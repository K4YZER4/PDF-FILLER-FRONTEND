/** Tipos del store global de Zustand.
 *  Separados de la implementación del store para mantener cohesionadas
 *  las definiciones de estado y permitir importarlas sin cargar el store.
 *
 *  Uso:
 *    import type { Contract, FormDataState } from "@/types/store"; */

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

/** Roles disponibles — determina qué ve el usuario en historial y paso 3 */
export type UserRole = "asesor" | "admin";

/** Slice de autenticación */
export interface AuthState {
  user: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

/** Slice del paso actual en el flujo de contrato */
export interface StepState {
  current: 1 | 2 | 3 | 4;
}

/** Slice de documentos subidos y estado del OCR */
export interface DocumentsState {
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
export interface FormDataState {
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
export interface Contract {
  id: string;
  clientName: string;
  date: string;
  monto: number;
  plazo: number;
  asesor: string;
  status: "completado" | "borrador";
}

/** Slice del historial de contratos generados */
export interface HistoryState {
  contracts: Contract[];
}

/** Interface completa del store.
 *  Combina todos los slices con sus acciones correspondientes. */
export interface ContractState {
  auth: AuthState;
  step: StepState;
  documents: DocumentsState;
  formData: FormDataState;
  history: HistoryState;

  login: (user: string, role: UserRole) => void;
  logout: () => void;

  setStep: (step: 1 | 2 | 3 | 4) => void;
  nextStep: () => void;
  prevStep: () => void;

  setDocument: (
    key: keyof DocumentsState,
    value: DocumentsState[keyof DocumentsState],
  ) => void;
  setScanStatus: (status: ScanStatus) => void;
  setScanProgress: (progress: number) => void;
  resetDocuments: () => void;
  scanDocuments: () => Promise<"done" | "error">;
  restoreDocuments: () => Promise<void>;

  setFormData: (
    section: keyof FormDataState,
    data: FormDataState[keyof FormDataState],
  ) => void;
  resetFormData: () => void;

  addContract: (contract: Contract) => void;
  clearHistory: () => void;

  resetContract: () => void;
  resetAll: () => void;
}
