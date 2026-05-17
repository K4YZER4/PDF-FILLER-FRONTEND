/** Estado inicial y datos mock utilizados por el store.
 *  Separado de useContractStore.ts para mantener el store enfocado
 *  en la definición de acciones, y permitir reutilizar estos valores
 *  en tests o previews sin importar Zustand.
 *
 *  Uso:
 *    import { initialDocuments, MOCK_CONTRACTS } from "@/store/mockData"; */

import type {
  DocumentsState,
  FormDataState,
  Contract,
} from "@/types/store";

/** Valor por defecto del slice documents */
export const initialDocuments: DocumentsState = {
  ineFile: null,
  nomina1File: null,
  nomina2File: null,
  estadoCuentaFile: null,
  scanStatus: "idle",
  scanProgress: 0,
  scanResults: {},
};

/** Valor por defecto del slice formData */
export const initialFormData: FormDataState = {
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

/** Contratos mock para desarrollo — se reemplazarán con llamadas al backend */
export const MOCK_CONTRACTS: Contract[] = [
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
