/**
 * Archivo: store/useContractStore.ts
 * Propósito: Store global de Zustand para manejar todo el estado de la aplicación.
 *
 * Arquitectura:
 *   - persist   → guarda solo `auth` en localStorage para sobrevivir recargas
 *   - immer     → permite mutaciones directas del estado sin perder inmutabilidad
 *
 * Slices:
 *   auth      → sesión del usuario (persistida)
 *   step      → paso actual del flujo de 4 pasos
 *   documents → archivos subidos y estado del escaneo OCR
 *   formData  → datos extraídos del INE, nóminas y cuenta bancaria
 *   history   → contratos generados (mock en desarrollo)
 *
 * Acciones importantes:
 *   resetContract → descarta el contrato en progreso sin cerrar sesión
 *   resetAll      → limpia todo excepto el historial (usado en logout)
 */
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { saveFile, loadFile, clearAllFiles } from "@/utils/fileStorage";
import type {
  INEData,
  NominaData,
  EstadoCuentaData,
  TablaCreditoData,
  ScanStatus,
  AsesorData,
  ContactoData,
  AntiguedadData,
  Referencias,
} from "@/types";

// ─── Tipos ────────────────────────────────────────────────────────────────────

/** Roles disponibles — determina qué ve el usuario en historial y paso 3 */
type UserRole = "asesor" | "admin";

/** Slice de autenticación */
interface AuthState {
  user: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

/** Slice del paso actual en el flujo de contrato */
interface StepState {
  current: 1 | 2 | 3 | 4;
}

/** Slice de documentos subidos y estado del OCR */
interface DocumentsState {
  ineFile: File | null;
  nomina1File: File | null;
  nomina2File: File | null;
  estadoCuentaFile: File | null;
  /** idle → scanning → done → error */
  scanStatus: ScanStatus;
  /** Progreso del escaneo 0-100 */
  scanProgress: number;
  /** Resultado por documento durante el escaneo: "pending" | "success" | "error" */
  scanResults: Record<string, "pending" | "success" | "error">;
}

/** Slice de datos del formulario organizados por sección */
interface FormDataState {
  ine: Partial<INEData>;
  nomina: Partial<NominaData>;
  banco: Partial<EstadoCuentaData>;
  extras: Record<string, unknown>;
  tabla: TablaCreditoData | null;
  capitalMonto: number;
  plazoQnas: number;
  asesorData: AsesorData;
  contactoData: ContactoData;
  antiguedadData: AntiguedadData;
  referencias: Referencias;
}

/** Contrato individual en el historial */
interface Contract {
  id: string;
  clientName: string;
  date: string;
  monto: number;
  plazo: number;
  asesor: string;
  status: "completado" | "borrador";
}

/** Slice del historial de contratos generados */
interface HistoryState {
  contracts: Contract[];
}

/**
 * Interface completa del store.
 * Combina todos los slices con sus acciones correspondientes.
 */
interface ContractState {
  // ── Slices de estado ──
  auth: AuthState;
  step: StepState;
  documents: DocumentsState;
  formData: FormDataState;
  history: HistoryState;

  // ── Acciones de autenticación ──

  /** Guarda usuario y rol en el store después de login exitoso */
  login: (user: string, role: UserRole) => void;

  /** Limpia la sesión y borra auth del localStorage */
  logout: () => void;

  // ── Acciones de pasos ──

  /** Navega a un paso específico del flujo */
  setStep: (step: 1 | 2 | 3 | 4) => void;

  /** Avanza al siguiente paso si no está en el último */
  nextStep: () => void;

  /** Regresa al paso anterior si no está en el primero */
  prevStep: () => void;

  // ── Acciones de documentos ──

  /** Actualiza un archivo específico (ineFile, nomina1File, etc.) */
  setDocument: (
    key: keyof DocumentsState,
    value: DocumentsState[keyof DocumentsState],
  ) => void;

  /** Actualiza el estado del escaneo OCR */
  setScanStatus: (status: ScanStatus) => void;

  /** Actualiza el progreso del escaneo (0-100) */
  setScanProgress: (progress: number) => void;

  /** Limpia todos los documentos y resetea el estado del OCR */
  resetDocuments: () => void;

  /** Escanea todos los documentos subidos de forma simulada.
   *  Actualiza scanStatus y scanProgress durante el proceso.
   *  Retorna "done" si todos se escanearon OK, "error" si alguno falló. */
  scanDocuments: () => Promise<"done" | "error">;

  /** Restaura los archivos desde IndexedDB al cargar la página. */
  restoreDocuments: () => Promise<void>;

  // ── Acciones de formulario ──

  /** Actualiza una sección completa del formulario */
  setFormData: (
    section: keyof FormDataState,
    data: FormDataState[keyof FormDataState],
  ) => void;

  /** Limpia todos los datos del formulario */
  resetFormData: () => void;

  // ── Acciones de historial ──

  /** Agrega un contrato nuevo al inicio de la lista */
  addContract: (contract: Contract) => void;

  /** Vacía el historial completo */
  clearHistory: () => void;

  // ── Acciones de reset ──

  /**
   * Descarta el contrato en progreso sin afectar la sesión ni el historial.
   * Se usa cuando el asesor sale del flujo antes de terminar.
   * Resetea: documents + formData + step
   */
  resetContract: () => void;

  /**
   * Limpia todo el estado excepto el historial.
   * Se usa en logout para asegurar que no queden datos sensibles en memoria.
   */
  resetAll: () => void;
}

// ─── Estado inicial ───────────────────────────────────────────────────────────
// Definido fuera del store para poder reutilizarlo en las acciones de reset
// sin duplicar valores.

const initialDocuments: DocumentsState = {
  ineFile: null,
  nomina1File: null,
  nomina2File: null,
  estadoCuentaFile: null,
  scanStatus: "idle",
  scanProgress: 0,
  scanResults: {},
};

const initialFormData: FormDataState = {
  ine: {},
  nomina: {},
  banco: {},
  extras: {},
  tabla: null,
  capitalMonto: 0,
  plazoQnas: 48,
  asesorData: {
    folio: "",
    sucursal: "",
    numVendedor: "",
    asesor: "",
    fechaContrato: "",
    fechaArranque: "",
    lugar: "",
    mesDescuento: "",
    anioDescuento: "",
  },
  contactoData: {
    tel: "",
    celular: "",
    telCasa: "",
    correo: "",
    estadoCivil: "",
  },
  antiguedadData: {
    fechaIngreso: "",
    meses: "",
    anos: "",
  },
  referencias: [
    { nombre: "", telefono: "" },
    { nombre: "", telefono: "" },
    { nombre: "", telefono: "" },
  ],
};

// ─── Datos mock ───────────────────────────────────────────────────────────────
// Contratos de prueba para el historial durante el desarrollo.
// Se reemplazarán por llamadas al backend cuando esté listo.

const MOCK_CONTRACTS: Contract[] = [
  {
    id: "CTR-001",
    clientName: "JUAN PEREZ GARCIA",
    date: "2026-01-15",
    monto: 25000,
    plazo: 48,
    asesor: "MARIA LOPEZ",
    status: "completado",
  },
  {
    id: "CTR-002",
    clientName: "ANA SOFIA MARTINEZ",
    date: "2026-02-20",
    monto: 18000,
    plazo: 36,
    asesor: "MARIA LOPEZ",
    status: "completado",
  },
  {
    id: "CTR-003",
    clientName: "CARLOS RAMIREZ SOTO",
    date: "2026-03-10",
    monto: 30000,
    plazo: 72,
    asesor: "JORGE CRUZ",
    status: "borrador",
  },
  {
    id: "CTR-004",
    clientName: "LUISA FERNANDA DIAZ",
    date: "2026-04-05",
    monto: 12000,
    plazo: 24,
    asesor: "JORGE CRUZ",
    status: "completado",
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

const useContractStore = create<ContractState>()(
  persist(
    immer((set) => ({
      // ── Estado inicial ──────────────────────────────────────────────────────

      auth: {
        user: null,
        role: null,
        isAuthenticated: false,
      },
      step: { current: 1 },
      documents: { ...initialDocuments },
      formData: { ...initialFormData },
      history: { contracts: [...MOCK_CONTRACTS] },

      // ── Autenticación ───────────────────────────────────────────────────────

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

      // ── Pasos ───────────────────────────────────────────────────────────────

      setStep: (step) =>
        set((state) => {
          state.step.current = step;
        }),

      nextStep: () =>
        set((state) => {
          if (state.step.current < 4) {
            // El cast es necesario porque TypeScript no infiere
            // que current + 1 sigue siendo 1 | 2 | 3 | 4
            (state.step.current as number) += 1;
          }
        }),

      prevStep: () =>
        set((state) => {
          if (state.step.current > 1) {
            (state.step.current as number) -= 1;
          }
        }),

      // ── Documentos ──────────────────────────────────────────────────────────

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

      // ── Formulario ──────────────────────────────────────────────────────────

      setFormData: (section, data) =>
        set((state) => {
          (state.formData as Record<string, unknown>)[section] = data;
        }),

      resetFormData: () =>
        set((state) => {
          state.formData = { ...initialFormData };
        }),

      // ── Historial ───────────────────────────────────────────────────────────

      addContract: (contract) =>
        set((state) => {
          // unshift agrega al inicio para mostrar el más reciente primero
          state.history.contracts.unshift(contract);
        }),

      clearHistory: () =>
        set((state) => {
          state.history.contracts = [];
        }),

      // ── Reset ───────────────────────────────────────────────────────────────

      resetContract: () => {
        set((state) => {
          // Solo limpia el contrato en progreso
          // NO toca auth ni history
          state.documents = { ...initialDocuments };
          state.formData = { ...initialFormData };
          state.step = { current: 1 };
        });
        clearAllFiles().catch(console.error);
      },

      resetAll: () => {
        set((state) => {
          // Limpia todo excepto el historial
          // Se llama antes del logout para no dejar datos sensibles en memoria
          state.auth = { user: null, role: null, isAuthenticated: false };
          state.step = { current: 1 };
          state.documents = { ...initialDocuments };
          state.formData = { ...initialFormData };
        });
        clearAllFiles().catch(console.error);
      },
    })),
    {
      /**
       * Configuración de persistencia en localStorage.
       *
       * Solo persistimos auth para mantener la sesión del usuario.
       * Los datos del formulario (formData) NO se persisten porque
       * contienen información sensible (CURP, RFC, CLABE).
       * Los documentos (File) se guardan en IndexedDB mediante fileStorage.ts.
       *
       * Migración: usuarios con datos viejos en localStorage perderán
       * su contrato en progreso al actualizar, pero la sesión se conserva.
       */
      name: "credifom-auth",
      partialize: (state) => ({
        auth: state.auth,
      }),
    },
  ),
);

// ─── Exports ──────────────────────────────────────────────────────────────────

export { useContractStore };
export type { UserRole, Contract, ContractState, FormDataState };
