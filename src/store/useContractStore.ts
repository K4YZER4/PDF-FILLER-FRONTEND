/**
 * Archivo: store/useContractStore.ts
 * Propósito: Store global de Zustand para manejar todo el estado de la aplicación.
 * Centraliza los datos del formulario, archivos, estados de escaneo y navegación.
 */
import { create } from "zustand"
import type {
  INEData,
  NominaData,
  EstadoCuentaData,
  TablaCreditoData,
  TabStatus,
  ScanStatus,
  PlazoQuincenas,
} from "@/types"

/** Interface que define todo el estado del contrato y funciones para modificarlo */
interface ContractState {
  // === TAB 1: INE (Identificación) ===
  ineFile: File | null              // Archivo de imagen de la INE
  ineFileUrl: string | null         // URL temporal para previsualización
  ineData: Partial<INEData>        // Datos extraídos o ingresados de la INE
  ineScanStatus: ScanStatus        // Estado del escaneo OCR

  // === TAB 2: Nómina y Cuenta Bancaria ===
  nomina1File: File | null         // Primer archivo de nómina
  nomina1Name: string | null       // Nombre del primer archivo
  nomina2File: File | null        // Segundo archivo de nómina
  nomina2Name: string | null       // Nombre del segundo archivo
  estadoCuentaFile: File | null   // Archivo del estado de cuenta
  estadoCuentaName: string | null // Nombre del archivo de estado de cuenta
  docsScanStatus: ScanStatus      // Estado del escaneo de documentos
  nominaData: Partial<NominaData> // Datos extraídos de la nómina
  estadoCuentaData: Partial<EstadoCuentaData> // Datos bancarios

  // === TAB 3: Crédito y Extras ===
  montoNeto: number | null         // Monto neto del préstamo
  plazoQuincenas: PlazoQuincenas  // Plazo en quincenas (24, 36, 48, etc.)
  tablaData: TablaCreditoData | null // Resultado del cálculo crediticio

  // === NAVEGACIÓN Y ESTADO DE PESTAÑAS ===
  activeTab: string                 // Pestaña activa actualmente
  tabStatuses: Record<string, TabStatus> // Estado de cada pestaña

  // === SETTERS PARA INE ===
  setINEFile: (file: File, url: string) => void
  setINEData: (data: Partial<INEData>) => void
  setINEScanStatus: (status: ScanStatus) => void

  // === SETTERS PARA DOCUMENTOS ===
  setNomina1File: (file: File, name: string) => void
  setNomina2File: (file: File, name: string) => void
  setEstadoCuentaFile: (file: File, name: string) => void
  setNominaData: (data: Partial<NominaData>) => void
  setEstadoCuentaData: (data: Partial<EstadoCuentaData>) => void
  setDocsScanStatus: (status: ScanStatus) => void

  // === SETTERS PARA CRÉDITO ===
  setMontoNeto: (monto: number) => void
  setPlazoQuincenas: (plazo: PlazoQuincenas) => void
  setTablaData: (data: TablaCreditoData) => void

  // === NAVEGACIÓN ===
  setActiveTab: (tab: string) => void
  setTabStatus: (tabId: string, status: TabStatus) => void

  // === RESETEAR TODO ===
  reset: () => void
}

/** Plazo predeterminado: 48 quincenas (2 años) */
const defaultPlazo: PlazoQuincenas = 48

/** Store principal de la aplicación creado con Zustand */
const useContractStore = create<ContractState>((set) => ({
  // === ESTADO INICIAL ===
  ineFile: null,
  ineFileUrl: null,
  ineData: {},
  ineScanStatus: "idle",

  nomina1File: null,
  nomina1Name: null,
  nomina2File: null,
  nomina2Name: null,
  estadoCuentaFile: null,
  estadoCuentaName: null,
  docsScanStatus: "idle",
  nominaData: {},
  estadoCuentaData: {},

  montoNeto: null,
  plazoQuincenas: defaultPlazo,
  tablaData: null,

  activeTab: "ine",
  tabStatuses: {
    ine: "idle",
    docs: "idle",
    extras: "idle",
  },

  // === ACCIONES PARA INE ===
  setINEFile: (file, url) => set({ ineFile: file, ineFileUrl: url }),
  setINEData: (data) => set((state) => ({ ineData: { ...state.ineData, ...data } })),
  setINEScanStatus: (status) => set({ ineScanStatus: status }),

  // === ACCIONES PARA DOCUMENTOS ===
  setNomina1File: (file, name) => set({ nomina1File: file, nomina1Name: name }),
  setNomina2File: (file, name) => set({ nomina2File: file, nomina2Name: name }),
  setEstadoCuentaFile: (file, name) => set({ estadoCuentaFile: file, estadoCuentaName: name }),
  setNominaData: (data) => set((state) => ({ nominaData: { ...state.nominaData, ...data } })),
  setEstadoCuentaData: (data) => set((state) => ({ estadoCuentaData: { ...state.estadoCuentaData, ...data } })),
  setDocsScanStatus: (status) => set({ docsScanStatus: status }),

  // === ACCIONES PARA CRÉDITO ===
  setMontoNeto: (monto) => set({ montoNeto: monto }),
  setPlazoQuincenas: (plazo) => set({ plazoQuincenas: plazo }),
  setTablaData: (data) => set({ tablaData: data }),

  // === ACCIONES DE NAVEGACIÓN ===
  setActiveTab: (tab) => set({ activeTab: tab }),
  setTabStatus: (tabId, status) =>
    set((state) => ({
      tabStatuses: { ...state.tabStatuses, [tabId]: status },
    })),

  // === RESETEAR TODO EL FORMULARIO ===
  reset: () =>
    set({
      ineFile: null,
      ineFileUrl: null,
      ineData: {},
      ineScanStatus: "idle",
      nomina1File: null,
      nomina1Name: null,
      nomina2File: null,
      nomina2Name: null,
      estadoCuentaFile: null,
      estadoCuentaName: null,
      docsScanStatus: "idle",
      nominaData: {},
      estadoCuentaData: {},
      montoNeto: null,
      plazoQuincenas: defaultPlazo,
      tablaData: null,
      activeTab: "ine",
      tabStatuses: { ine: "idle", docs: "idle", extras: "idle" },
    }),
}))

export { useContractStore }
