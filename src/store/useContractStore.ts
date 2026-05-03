/**
 * Archivo: store/useContractStore.ts
 * Propósito: Store global de Zustand para manejar todo el estado de la aplicación.
 * Incluye slices para auth, step, documents, formData, history.
 * Usa immer para mutaciones inmutables.
 */
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import type { INEData, NominaData, EstadoCuentaData, TablaCreditoData, ScanStatus } from "@/types"

/** Roles disponibles en la aplicación */
type UserRole = "asesor" | "admin"

/** Información del usuario autenticado */
interface AuthState {
  user: string | null
  role: UserRole | null
  isAuthenticated: boolean
}

/** Estado del paso actual en el flujo de 4 pasos */
interface StepState {
  current: 1 | 2 | 3 | 4
}

/** Estado de los documentos subidos y escaneo */
interface DocumentsState {
  ineFile: File | null
  nomina1File: File | null
  nomina2File: File | null
  estadoCuentaFile: File | null
  scanStatus: ScanStatus
  scanProgress: number // 0-100
}

/** Datos del formulario organizados por secciones */
interface FormDataState {
  ine: Partial<INEData>
  nomina: Partial<NominaData>
  banco: Partial<EstadoCuentaData>
  extras: Record<string, unknown>
  tabla: TablaCreditoData | null
}

/** Estructura de un contrato en el historial */
interface Contract {
  id: string
  clientName: string
  date: string
  monto: number
  plazo: number
  asesor: string
  status: "completado" | "borrador"
}

/** Estado del historial de contratos */
interface HistoryState {
  contracts: Contract[]
}

/** Interface principal que combina todos los slices */
interface ContractState {
  auth: AuthState
  step: StepState
  documents: DocumentsState
  formData: FormDataState
  history: HistoryState

  // === ACCIONES DE AUTENTICACIÓN ===
  login: (user: string, role: UserRole) => void
  logout: () => void

  // === ACCIONES DE PASOS ===
  setStep: (step: 1 | 2 | 3 | 4) => void
  nextStep: () => void
  prevStep: () => void

  // === ACCIONES DE DOCUMENTOS ===
  setDocument: (key: keyof DocumentsState, value: DocumentsState[keyof DocumentsState]) => void
  setScanStatus: (status: ScanStatus) => void
  setScanProgress: (progress: number) => void
  resetDocuments: () => void

  // === ACCIONES DE FORMULARIO ===
  setFormData: (section: keyof FormDataState, data: FormDataState[keyof FormDataState]) => void
  resetFormData: () => void

  // === ACCIONES DE HISTORIAL ===
  addContract: (contract: Contract) => void
  clearHistory: () => void

  // === RESETEAR TODO ===
  resetAll: () => void
}

/** Datos hardcodeados para el historial (mockup) */
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
]

/** Estado inicial de documentos */
const initialDocuments: DocumentsState = {
  ineFile: null,
  nomina1File: null,
  nomina2File: null,
  estadoCuentaFile: null,
  scanStatus: "idle",
  scanProgress: 0,
}

/** Estado inicial de formularios */
const initialFormData: FormDataState = {
  ine: {},
  nomina: {},
  banco: {},
  extras: {},
  tabla: null,
}

/** Store principal con immer para mutaciones */
const useContractStore = create<ContractState>()(
  immer((set) => ({
    // === ESTADO INICIAL ===
    auth: {
      user: null,
      role: null,
      isAuthenticated: false,
    },
    step: { current: 1 },
    documents: { ...initialDocuments },
    formData: { ...initialFormData },
    history: { contracts: [...MOCK_CONTRACTS] },

    // === ACCIONES DE AUTENTICACIÓN ===
    login: (user, role) =>
      set((state) => {
        state.auth.user = user
        state.auth.role = role
        state.auth.isAuthenticated = true
      }),

    logout: () =>
      set((state) => {
        state.auth.user = null
        state.auth.role = null
        state.auth.isAuthenticated = false
      }),

    // === ACCIONES DE PASOS ===
    setStep: (step) =>
      set((state) => {
        state.step.current = step
      }),

    nextStep: () =>
      set((state) => {
        if (state.step.current < 4) {
          state.step.current += 1
        }
      }),

    prevStep: () =>
      set((state) => {
        if (state.step.current > 1) {
          state.step.current -= 1
        }
      }),

    // === ACCIONES DE DOCUMENTOS ===
    setDocument: (key, value) =>
      set((state) => {
        (state.documents as Record<string, unknown>)[key] = value
      }),

    setScanStatus: (status) =>
      set((state) => {
        state.documents.scanStatus = status
      }),

    setScanProgress: (progress) =>
      set((state) => {
        state.documents.scanProgress = progress
      }),

    resetDocuments: () =>
      set((state) => {
        state.documents = { ...initialDocuments }
      }),

    // === ACCIONES DE FORMULARIO ===
    setFormData: (section, data) =>
      set((state) => {
        (state.formData as Record<string, unknown>)[section] = data
      }),

    resetFormData: () =>
      set((state) => {
        state.formData = { ...initialFormData }
      }),

    // === ACCIONES DE HISTORIAL ===
    addContract: (contract) =>
      set((state) => {
        state.history.contracts.unshift(contract)
      }),

    clearHistory: () =>
      set((state) => {
        state.history.contracts = []
      }),

    // === RESETEAR TODO ===
    resetAll: () =>
      set((state) => {
        state.auth = { user: null, role: null, isAuthenticated: false }
        state.step = { current: 1 }
        state.documents = { ...initialDocuments }
        state.formData = { ...initialFormData }
        // Mantener historial en mockup
      }),
  }))
)

export { useContractStore }
export type { UserRole, Contract }
