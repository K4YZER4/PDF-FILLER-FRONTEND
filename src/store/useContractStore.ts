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
import { saveFile, loadFile, clearAllFiles } from "@/utils/fileStorage";
import { initialDocuments, initialFormData, MOCK_CONTRACTS } from "@/store/mockData";
import type { ContractState } from "@/types/store";

const useContractStore = create<ContractState>()(
  persist(
    immer((set) => ({
      // ── Estado inicial ──

      auth: {
        user: null,
        role: null,
        isAuthenticated: false,
      },
      step: { current: 1 },
      documents: { ...initialDocuments },
      formData: { ...initialFormData },
      history: { contracts: [...MOCK_CONTRACTS] },

      // ── Autenticación ──

      login: (user, role) =>
        set((state) => {
          state.auth.user = user;
          state.auth.role = role;
          state.auth.isAuthenticated = true;
        }),

      logout: () => {
        set((state) => {
          state.auth = { user: null, role: null, isAuthenticated: false };
          state.step = { current: 1 };
          state.documents = { ...initialDocuments };
          state.formData = { ...initialFormData };
        });
        clearAllFiles().catch(console.error);
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

        const docIds = ["ine", "nomina1", "nomina2", "estadoCuenta"];
        const total = docIds.length;
        let allOk = true;

        for (let i = 0; i < total; i++) {
          await new Promise((r) => setTimeout(r, 800));
          const success = Math.random() > 0.2;
          if (!success) allOk = false;

          set((state) => {
            state.documents.scanResults[docIds[i]] = success ? "success" : "error";
            state.documents.scanProgress = ((i + 1) / total) * 100;
          });
        }

        set((state) => {
          state.documents.scanStatus = allOk ? "done" : "error";
          state.documents.scanProgress = 100;
        });
        return allOk ? "done" : "error";
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

      // ── Historial ──

      addContract: (contract) =>
        set((state) => {
          state.history.contracts.unshift(contract);
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
        });
        clearAllFiles().catch(console.error);
      },

      resetAll: () => {
        set((state) => {
          state.auth = { user: null, role: null, isAuthenticated: false };
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
