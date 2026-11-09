/** Store global de Zustand para el estado de la aplicación CREDIFOM.
 *
 *  Arquitectura:
 *    - persist → guarda solo `auth` en localStorage
 *    - immer   → mutaciones directas sin perder inmutabilidad
 *
 *  Slices:
 *    auth      → sesión del usuario (persistida)
 *    step      → paso actual del flujo de 4 pasos
 *    documents → archivos subidos y estado del escaneo OCR
 *    formData  → datos extraídos del INE, nóminas y cuenta bancaria
 *    history   → contratos generados (mock en desarrollo)
 *
 *  Tipos extraídos a:
 *    - @/types/store   → ContractState y sub-interfaces
 *    - @/store/mockData → valores iniciales y datos mock
 *
 *  Re-exporta tipos para compatibilidad con imports existentes. */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";
import { saveFile, loadFile, clearAllFiles } from "@/utils/fileStorage";
import { initialDocuments, initialFormData, MOCK_CONTRACTS } from "@/store/mockData";
import type { ContractState } from "@/types/store";
import { mapIneFromApi, mapNominaFromApi, mapEstadoCuentaFromApi, mapTablaFromApi } from "@/utils/mapping";
import { getContract } from "@/api/contracts.api";
import { removeToken } from "@/lib/auth";

const useContractStore = create<ContractState>()(
  persist(
    immer((set) => ({
      // ── Estado inicial ──

      auth: {
        user: null,
        role: null,
        isAuthenticated: false,
        profile: null,
      },
      step: { current: 1 },
      documents: { ...initialDocuments },
      formData: { ...initialFormData },
      history: { contracts: [...MOCK_CONTRACTS] },
      editMode: { active: false },

      // ── Autenticación ──

      login: (user, role, profile) =>
        set((state) => {
          state.auth.user = user;
          state.auth.role = role;
          state.auth.isAuthenticated = true;
          state.auth.profile = profile ?? null;
        }),

      logout: () => {
        set((state) => {
          state.auth = { user: null, role: null, isAuthenticated: false, profile: null };
          state.step = { current: 1 };
          state.documents = { ...initialDocuments };
          state.formData = { ...initialFormData };
        });
        clearAllFiles().catch(console.error);
        removeToken();
      },

      // ── Pasos ──

      setStep: (step) =>
        set((state) => {
          state.step.current = step;
        }),

      nextStep: () =>
        set((state) => {
          if (state.step.current < 4) {
            (state.step.current as number) += 1;
          }
        }),

      prevStep: () =>
        set((state) => {
          if (state.step.current > 1) {
            (state.step.current as number) -= 1;
          }
        }),

      // ── Documentos ──

      setDocument: (key, value) => {
        set((state) => {
          (state.documents as Record<string, unknown>)[key] = value;
        });
        if (value instanceof File) {
          saveFile(key, value).catch(console.error);
        } else if (value === null) {
          clearAllFiles().catch(console.error);
        }
      },

      setScanStatus: (status) =>
        set((state) => {
          state.documents.scanStatus = status;
        }),

      setScanProgress: (progress) =>
        set((state) => {
          state.documents.scanProgress = progress;
        }),

      resetDocuments: () => {
        set((state) => {
          state.documents = { ...initialDocuments };
        });
        clearAllFiles().catch(console.error);
      },

      restoreDocuments: async () => {
        const keys = ["ineFile", "nomina1File", "nomina2File", "estadoCuentaFile"] as const;
        for (const key of keys) {
          const file = await loadFile(key);
          if (file) {
            set((state) => {
              (state.documents as Record<string, unknown>)[key] = file;
            });
          }
        }
      },

      scanDocuments: async () => {
        set((state) => {
          state.documents.scanStatus = "scanning";
          state.documents.scanProgress = 0;
          state.documents.scanResults = {
            ine: "pending",
            nomina1: "pending",
            nomina2: "pending",
            estadoCuenta: "pending",
          };
        });

        const currentFiles = useContractStore.getState().documents;
        let allOk = true;
        let completed = 0;
        const total = 3;

        const markProgress = () => {
          completed++;
          set((state) => {
            state.documents.scanProgress = (completed / total) * 100;
          });
        };

        // ── 1. INE ──────────────────────────────────
        const ineFile = currentFiles.ineFile;
        if (ineFile instanceof File) {
          try {
            const fd = new FormData();
            fd.append("ine", ineFile);
            const { data } = await api.post("/api/ine", fd, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            useContractStore.getState().setFormData("ine", mapIneFromApi(data));
            set((state) => { state.documents.scanResults.ine = "success"; });
          } catch {
            allOk = false;
            set((state) => { state.documents.scanResults.ine = "error"; });
          }
        } else {
          allOk = false;
          set((state) => { state.documents.scanResults.ine = "error"; });
        }
        markProgress();

        // ── 2. Nóminas (ambas en una sola llamada) ──
        const nomina1File = currentFiles.nomina1File;
        const nomina2File = currentFiles.nomina2File;
        if (nomina1File instanceof File && nomina2File instanceof File) {
          try {
            const fd = new FormData();
            fd.append("nomina1", nomina1File);
            fd.append("nomina2", nomina2File);
            const { data } = await api.post("/api/nominas", fd, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            useContractStore.getState().setFormData("nomina", {
              ...useContractStore.getState().formData.nomina,
              ...mapNominaFromApi(data.datos ?? data),
            });
            set((state) => {
              state.documents.scanResults.nomina1 = "success";
              state.documents.scanResults.nomina2 = "success";
            });
          } catch {
            allOk = false;
            set((state) => {
              state.documents.scanResults.nomina1 = "error";
              state.documents.scanResults.nomina2 = "error";
            });
          }
        } else {
          allOk = false;
          set((state) => {
            if (!(nomina1File instanceof File)) state.documents.scanResults.nomina1 = "error";
            if (!(nomina2File instanceof File)) state.documents.scanResults.nomina2 = "error";
          });
        }
        markProgress();

        // ── 3. Estado de Cuenta ──────────────────────
        const estadoCuentaFile = currentFiles.estadoCuentaFile;
        if (estadoCuentaFile instanceof File) {
          try {
            const fd = new FormData();
            fd.append("estadoCuenta", estadoCuentaFile);
            const { data } = await api.post("/api/estados-cuenta", fd, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            useContractStore.getState().setFormData("banco", mapEstadoCuentaFromApi(data.datos ?? data));
            set((state) => { state.documents.scanResults.estadoCuenta = "success"; });
          } catch {
            allOk = false;
            set((state) => { state.documents.scanResults.estadoCuenta = "error"; });
          }
        } else {
          allOk = false;
          set((state) => { state.documents.scanResults.estadoCuenta = "error"; });
        }
        markProgress();

        set((state) => {
          state.documents.scanStatus = allOk ? "done" : "error";
          state.documents.scanProgress = 100;
        });
        return allOk ? "done" : "error";
      },

      scanSingleDocument: async (docId: string): Promise<boolean> => {
        const current = useContractStore.getState().documents;

        const scanIne = async (): Promise<boolean> => {
          const file = current.ineFile;
          if (!(file instanceof File)) return false;
          try {
            const fd = new FormData();
            fd.append("ine", file);
            const { data } = await api.post("/api/ine", fd, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            useContractStore.getState().setFormData("ine", mapIneFromApi(data));
            set((state) => { state.documents.scanResults.ine = "success"; });
            return true;
          } catch {
            set((state) => { state.documents.scanResults.ine = "error"; });
            return false;
          }
        };

        const scanNominas = async (): Promise<boolean> => {
          const f1 = current.nomina1File;
          const f2 = current.nomina2File;
          if (!(f1 instanceof File) || !(f2 instanceof File)) {
            set((state) => {
              if (!(f1 instanceof File)) state.documents.scanResults.nomina1 = "error";
              if (!(f2 instanceof File)) state.documents.scanResults.nomina2 = "error";
            });
            return false;
          }
          try {
            const fd = new FormData();
            fd.append("nomina1", f1);
            fd.append("nomina2", f2);
            const { data } = await api.post("/api/nominas", fd, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            useContractStore.getState().setFormData("nomina", {
              ...useContractStore.getState().formData.nomina,
              ...mapNominaFromApi(data.datos ?? data),
            });
            set((state) => {
              state.documents.scanResults.nomina1 = "success";
              state.documents.scanResults.nomina2 = "success";
            });
            return true;
          } catch {
            set((state) => {
              state.documents.scanResults.nomina1 = "error";
              state.documents.scanResults.nomina2 = "error";
            });
            return false;
          }
        };

        const scanEstadoCuenta = async (): Promise<boolean> => {
          const file = current.estadoCuentaFile;
          if (!(file instanceof File)) return false;
          try {
            const fd = new FormData();
            fd.append("estadoCuenta", file);
            const { data } = await api.post("/api/estados-cuenta", fd, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            useContractStore.getState().setFormData("banco", mapEstadoCuentaFromApi(data.datos ?? data));
            set((state) => { state.documents.scanResults.estadoCuenta = "success"; });
            return true;
          } catch {
            set((state) => { state.documents.scanResults.estadoCuenta = "error"; });
            return false;
          }
        };

        // Resetear el doc a pending antes de reintentar
        let result: boolean;
        if (docId === "nomina1" || docId === "nomina2") {
          set((state) => {
            state.documents.scanResults.nomina1 = "pending";
            state.documents.scanResults.nomina2 = "pending";
          });
          result = await scanNominas();
        } else {
          set((state) => { state.documents.scanResults[docId] = "pending"; });

          switch (docId) {
            case "ine": result = await scanIne(); break;
            case "estadoCuenta": result = await scanEstadoCuenta(); break;
            default: return false;
          }
        }

        // Si el escaneo fue exitoso y todos los documentos estan en success, marcar como done
        if (result) {
          const results = useContractStore.getState().documents.scanResults;
          if (
            results.ine === "success" &&
            results.nomina1 === "success" &&
            results.nomina2 === "success" &&
            results.estadoCuenta === "success"
          ) {
            set((state) => { state.documents.scanStatus = "done"; });
          }
        }

        return result;
      },

      // ── Formulario ──

      setFormData: (section, data) =>
        set((state) => {
          (state.formData as Record<string, unknown>)[section] = data;
        }),

      resetFormData: () =>
        set((state) => {
          state.formData = { ...initialFormData };
        }),

      loadContractForEdit: async (folio: string) => {
        const data = await getContract(folio);
        set((state) => {
          state.editMode = { active: true, folio };
          state.formData.ine = mapIneFromApi(data.ine);
          state.formData.nomina = mapNominaFromApi(data.nomina);
          state.formData.banco = mapEstadoCuentaFromApi(data.estadoCuenta);
          state.formData.tabla = mapTablaFromApi(data.tabla);
          state.formData.capitalMonto = data.capitalMonto;
          state.formData.plazoQnas = data.plazoQnas;
          state.formData.contratoFolio = data.folio;
          state.formData.contactoData = {
            tel: data.extra.telefonoCelular ?? "",
            celular: data.extra.telefonoCelular ?? "",
            telCasa: data.extra.telefonoCasa ?? "",
            correo: data.extra.mail ?? "",
            estadoCivil: data.extra.estadoCivil ?? "",
            dependientesEconomicos: String(data.extra.dependientesEconomicos ?? 0),
            propiedad: data.extra.propiedad ?? "",
            entreCalles: data.extra.entreCalles ?? "",
          };
          state.formData.asesorData = {
            folio: data.extra.asesorFolio ?? "",
            sucursal: data.extra.sucursal ?? "",
            numVendedor: data.extra.numVendedor ?? "",
            asesor: data.extra.vendedor ?? "",
            fechaContrato: data.extra.fechaContrato ?? "",
            fechaArranque: data.extra.fechaArranque ?? "",
            lugar: data.extra.lugarFecha ?? "",
            mesDescuento: data.extra.mesDescuento ?? "",
            anioDescuento: data.extra.añoDescuento ?? "",
          };
          state.formData.antiguedadData = {
            fechaIngreso: data.extra.fechaIngreso ?? "",
            meses: data.extra.mesesAntiguedad ?? "",
            anos: data.extra.añosAntiguedad ?? "",
          };
          state.formData.referencias = [
            {
              nombre: data.extra.referencia1 ?? "",
              telefono: data.extra.telefonoReferencia1 ?? "",
            },
            {
              nombre: data.extra.referencia2 ?? "",
              telefono: data.extra.telefonoReferencia2 ?? "",
            },
            {
              nombre: data.extra.referencia3 ?? "",
              telefono: data.extra.telefonoReferencia3 ?? "",
            },
          ];
          state.documents.scanStatus = "done";
          state.step.current = 1;
        });
      },

      // ── Historial ──

      addContract: (contract) =>
        set((state) => {
          state.history.contracts.unshift(contract);
        }),

      setContracts: (contracts) =>
        set((state) => {
          state.history.contracts = contracts;
        }),

      clearHistory: () =>
        set((state) => {
          state.history.contracts = [];
        }),

      // ── Reset ──

      resetContract: () => {
        set((state) => {
          state.documents = { ...initialDocuments };
          state.formData = { ...initialFormData };
          state.step = { current: 1 };
          state.editMode = { active: false };
        });
        clearAllFiles().catch(console.error);
      },

      resetAll: () => {
        set((state) => {
          state.auth = { user: null, role: null, isAuthenticated: false, profile: null };
          state.step = { current: 1 };
          state.documents = { ...initialDocuments };
          state.formData = { ...initialFormData };
        });
        clearAllFiles().catch(console.error);
      },
    })),
    {
      name: "credifom-auth",
      partialize: (state) => ({
        auth: state.auth,
      }),
    },
  ),
);

export { useContractStore };

// Re-export para compatibilidad con imports existentes
export type { UserRole, Contract, ContractState, FormDataState } from "@/types/store";
