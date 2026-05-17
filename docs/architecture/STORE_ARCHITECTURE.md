# Arquitectura del Store

El estado global de la aplicación se maneja con **Zustand** + **Immer** + **Persist**.

---

## Tecnologías

| Librería | Propósito |
|----------|-----------|
| `zustand` ^5.0.12 | Estado global liviano, sin providers ni context |
| `immer` ^11.1.4 | Mutaciones directas en el estado (sin spread operators) |
| `zustand/middleware/persist` | Persistencia selectiva en localStorage |

---

## División en 3 Archivos

El store se dividió en 3 archivos para mejorar cohesión y facilitar tests:

| Archivo | Contenido | Propósito |
|---------|-----------|-----------|
| `types/store.ts` | Interfaces `AuthState`, `DocumentsState`, `FormDataState`, `Contract`, `ContractState`, etc. | Tipos extraídos para importarlos sin cargar Zustand |
| `store/mockData.ts` | `initialDocuments`, `initialFormData`, `MOCK_CONTRACTS` | Estado inicial y datos mock separados del store |
| `store/useContractStore.ts` | Store puro (~185 líneas) con `create()`, `persist()`, `immer()` | Solo la definición del store (antes ~492 líneas) |

> **Compatibilidad hacia atrás**: `useContractStore` re-exporta `ContractState` y `Contract` para que los imports existentes (`@/store/useContractStore`) sigan funcionando sin cambios.

---

## Estructura del Store

```
useContractStore
├── auth        → Slice de sesión (el ÚNICO que persiste)
├── step        → Paso actual del flujo (1-4)
├── documents   → Archivos subidos + estado del OCR
├── formData    → Datos del formulario organizados por sección
└── history     → Lista de contratos (mock actualmente)
```

---

## Slices

### auth — Sesión del Usuario

```typescript
interface AuthState {
  user: string | null          // Email del usuario
  role: "asesor" | "admin" | null
  isAuthenticated: boolean
}
```

**Persistido**: ✅ Sí, en localStorage bajo la clave `credifom-auth`.

**Acciones**: `login(user, role)`, `logout()`

### step — Paso del Flujo

```typescript
interface StepState {
  current: 1 | 2 | 3 | 4
}
```

**Persistido**: ❌ No

**Acciones**: `setStep()`, `nextStep()`, `prevStep()`

### documents — Documentos

```typescript
interface DocumentsState {
  ineFile: File | null
  nomina1File: File | null
  nomina2File: File | null
  estadoCuentaFile: File | null
  scanStatus: "idle" | "scanning" | "done" | "error"
  scanProgress: number          // 0-100
  scanResults: Record<string, "pending" | "success" | "error">
}
```

**Persistido**: ❌ No (los archivos se guardan en IndexedDB via `fileStorage.ts`)

**Acciones**: `setDocument()`, `setScanStatus()`, `setScanProgress()`, `resetDocuments()`, `scanDocuments()`, `restoreDocuments()`

### formData — Datos del Formulario

```typescript
interface FormDataState {
  ine: Partial<INEData>
  nomina: Partial<NominaData>
  banco: Partial<EstadoCuentaData>
  extras: Record<string, unknown>
  tabla: TablaCreditoData | null
  capitalMonto: number
  plazoQnas: number
  asesorData: AsesorData
  contactoData: ContactoData
  antiguedadData: AntiguedadData
  referencias: Referencias         // [ReferenciaItem, ReferenciaItem, ReferenciaItem]
}
```

**Persistido**: ❌ No. Contiene datos sensibles (CURP, RFC, CLABE, teléfonos).

**Acciones**: `setFormData()`, `resetFormData()`

### history — Historial de Contratos

```typescript
interface Contract {
  id: string
  clientName: string
  date: string
  monto: number
  plazo: number
  asesor: string
  status: "completado" | "borrador"
}

interface HistoryState {
  contracts: Contract[]
}
```

**Persistido**: ❌ No. Actualmente usa datos mock (`MOCK_CONTRACTS`). Cuando el backend esté listo, se cargará desde API.

**Acciones**: `addContract()`, `clearHistory()`

---

## Persistencia

### Configuración

```typescript
persist(
  immer((set) => ({
    // ... estado y acciones
  })),
  {
    name: "credifom-auth",
    partialize: (state) => ({
      auth: state.auth,  // Solo auth se persiste
    }),
  },
)
```

### ¿Qué se guarda?

| Dato | Dónde se guarda | Por qué |
|------|----------------|---------|
| Token/rol | localStorage | Para mantener la sesión entre recargas |
| Archivos (File) | IndexedDB | localStorage no soporta objetos binarios |
| Formulario (CURP, RFC, etc.) | ❌ No persiste | Datos sensibles — solo en memoria |
| Historial | ❌ No persiste | Vendrá del backend |

### Migración

Si había datos viejos en localStorage de versiones anteriores, al actualizar se perderá el contrato en progreso, pero la sesión se conserva.

---

## Selectores Tipados (src/store/selectors.ts)

Los selectores resuelven el problema de acceder a `Partial<T>` sin usar `as any`.

### Problema

```typescript
// ❌ Sin selector: TypeScript sabe que podría ser undefined, y se usaba as any
const curp = useContractStore(s => s.formData.ine.curp as string)
```

### Solución

```typescript
// ✅ Con selector: valores default + tipado fuerte
const { curp, primerNombre } = useINEData()
```

### Selectores Disponibles

| Selector | Retorna | Propósito |
|----------|---------|-----------|
| `useINEData()` | `Partial<INEData>` con defaults | Datos personales y domicilio |
| `useNominaData()` | `Partial<NominaData>` con defaults | Datos laborales |
| `useBancoData()` | `Partial<EstadoCuentaData>` con defaults | Datos bancarios |
| `useTablaData()` | `TablaCreditoData \| null` | Resultado del cálculo |
| `useClientName()` | `string` | Nombre completo del cliente (mayúsculas) |

### Implementación

```typescript
// Ejemplo: useINEData
export function useINEData() {
  const ine = useContractStore((s) => s.formData.ine)
  return {
    primerNombre: ine.primerNombre ?? "",
    curp: ine.curp ?? "",
    domicilio: {
      calle: ine.domicilio?.calle ?? "",
      // ... demás campos con ??
    },
  }
}
```

---

## Acciones de Reset

### resetContract()

Limpia el contrato en progreso sin afectar la sesión ni el historial.

```typescript
resetContract: () => {
  // Resetea: documents + formData + step
  // NO toca: auth, history
}
```

**Uso**: Cuando el asesor sale del flujo antes de terminar (botón "Cancelar" o "Salir").

### resetAll()

Limpia todo excepto el historial.

```typescript
resetAll: () => {
  // Resetea: auth + step + documents + formData
  // NO toca: history
}
```

**Uso**: En logout para asegurar que no queden datos sensibles en memoria.

---

## Mock Data

Los datos mock viven en `store/mockData.ts`, separados del store para:

1. **Facilitar tests**: Importar valores iniciales sin Zustand
2. **Simplificar el store**: El archivo del store solo define acciones y estado
3. **Compartir tipos**: `initialDocuments` y `initialFormData` son del tipo `DocumentsState` y `FormDataState`

### MOCK_CONTRACTS

Cuatro contratos de prueba para el historial durante el desarrollo. Se reemplazarán por llamadas al backend.

| ID | Cliente | Monto | Plazo | Asesor | Status |
|----|---------|-------|-------|--------|--------|
| CTR-001 | JUAN PEREZ GARCIA | $25,000 | 48 | MARIA LOPEZ | ✅ completado |
| CTR-002 | ANA SOFIA MARTINEZ | $18,000 | 36 | MARIA LOPEZ | ✅ completado |
| CTR-003 | CARLOS RAMIREZ SOTO | $30,000 | 72 | JORGE CRUZ | 📝 borrador |
| CTR-004 | LUISA FERNANDA DIAZ | $12,000 | 24 | JORGE CRUZ | ✅ completado |

### MOCK_USERS (en LoginPage)

| Rol | Email | Password |
|-----|-------|----------|
| Asesor | asesor@credifom.mx | 1234 |
| Admin | admin@credifom.mx | 1234 |

---

[Volver a DOCS README](../README.md)
