# Conexión con el Backend – Guía Completa

Este documento explica cómo el frontend se conecta con el backend (PDF-FILLER-BACKEND), cómo está estructurada la capa de API, y las mejores prácticas para consumir endpoints.

---

## Arquitectura de la Capa de Red

```
Componente/Feature
    │
    ▼
useApi (hook genérico)     ← src/hooks/useApi.ts
    │
    ▼
api (axios instance)       ← src/lib/api.ts
    │
    ├── Interceptor request  → Adjunta token JWT automáticamente
    │                           Rechaza si token expirado
    │
    └── Interceptor response → Normaliza errores a clases tipadas
                                (ApiError, ValidationError, AuthError, NetworkError)
    │
    ▼
Backend (REST API)
```

---

## Configuración

### 1. Variables de Entorno

```env
VITE_API_BASE=http://localhost:3000
```

El valor se lee en `src/lib/api.ts:26`:
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000",
  timeout: 30000,
})
```

### 2. Archivo `.env`

- Crea un `.env` en la raíz del proyecto (no está en git)
- Usa `.env.example` como referencia
- **NUNCA** subas `.env` al repositorio

---

## Cliente HTTP (src/lib/api.ts)

### Instancia Axios

```typescript
import { api } from "@/lib/api"

// GET
const contracts = await api.get("/contracts").then(r => r.data)

// POST
const result = await api.post("/scan/ine", formData).then(r => r.data)

// PUT
await api.put("/contracts/123", payload)

// DELETE
await api.delete("/contracts/123")
```

### Interceptor de Request

```typescript
// Se ejecuta ANTES de cada request
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    if (isTokenExpired(token)) {
      removeToken()
      window.location.href = "/login"
      return Promise.reject(new AuthError("Sesión expirada"))
    }
  }
  return config
})
```

El token JWT se adjunta automáticamente. No necesitas hacerlo manualmente.

### Interceptor de Response

```typescript
// Se ejecuta DESPUÉS de cada response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      return Promise.reject(new NetworkError())
    }
    if (error.response) {
      const { status, data } = error.response
      if (status === 401) return Promise.reject(new AuthError(data?.message))
      if (status === 422) return Promise.reject(new ValidationError(data.errors, data?.message))
      return Promise.reject(new ApiError(status, data?.message, data?.code))
    }
    return Promise.reject(new NetworkError())
  },
)
```

---

## Autenticación (src/lib/auth.ts)

### Funciones Disponibles

| Función | Descripción | Uso |
|---------|-------------|-----|
| `setToken(token)` | Guarda JWT en localStorage | Tras login exitoso |
| `getToken()` | Recupera JWT | Interceptor de axios |
| `removeToken()` | Elimina JWT | Logout / 401 |
| `hasToken()` | Verifica si existe token | Guards de ruta |
| `decodeToken(token)` | Decodifica payload JWT | Obtener rol/usuario |
| `isTokenExpired(token)` | Verifica expiración | Interceptor |
| `authHeader()` | Retorna header Authorization | Uso manual (raro) |

### Flujo de Login

```
LoginPage
  → onSubmit()
    → api.post("/api/auth/login", { email, password })
      → Response: { token, user }
        → setToken(token)
        → store.login(user.email, user.role)
        → navigate("/")
```

---

## Manejo de Errores (src/lib/errors.ts)

### Jerarquía de Errores

```
Error
├── ApiError         → Cualquier error 4xx/5xx (status, code, message)
│   ├── ValidationError → 422 (fields: Record<string, string[]>)
│   └── AuthError       → 401
└── NetworkError     → No se pudo conectar al servidor
```

### Cómo Usarlos

```typescript
import { api } from "@/lib/api"
import { ApiError, ValidationError, AuthError, NetworkError } from "@/lib/errors"

try {
  const res = await api.get("/contracts")
} catch (e) {
  if (e instanceof NetworkError) {
    // "No se pudo conectar con el servidor"
  } else if (e instanceof ValidationError) {
    // Errores por campo: e.fields
  } else if (e instanceof AuthError) {
    // Sesión expirada: redirigir a login
  } else if (e instanceof ApiError) {
    // Error genérico: e.status, e.message
  }
}
```

---

## Hook Genérico (src/hooks/useApi.ts)

El hook `useApi` encapsula el patrón loading/error/data para evitar repetir useState en cada componente.

### Uso Básico

```typescript
import { useApi } from "@/hooks/useApi"
import { api } from "@/lib/api"

function ContractList() {
  const { data, isLoading, error, execute } = useApi(
    () => api.get("/contracts").then(r => r.data.data),
  )

  if (isLoading) return <Spinner />
  if (error) return <p>Error: {error}</p>
  return <div>...</div>
}
```

### Ejecución Manual

```typescript
const { data, isLoading, execute } = useApi(
  () => api.post("/scan/ine", formData).then(r => r.data.data),
  { auto: false }, // No ejecuta automáticamente
)

// Ejecutar cuando se necesita:
<Button onClick={execute}>Escanear</Button>
```

### Retorno del Hook

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `data` | `T \| null` | Datos de la respuesta |
| `isLoading` | `boolean` | Si está cargando |
| `error` | `string \| null` | Mensaje de error legible |
| `apiError` | `ApiError \| NetworkError \| null` | Error tipado (status, fields) |
| `execute` | `() => Promise<T \| null>` | Función para (re)ejecutar |

---

## Buenas Prácticas

### 1. Siempre usa `api` en vez de `axios` directo
La instancia preconfigurada de `src/lib/api.ts` asegura que el token y el manejo de errores sean consistentes.

### 2. Usa `useApi` para llamadas con estado UI
Evita repetir `useState + useEffect + try/catch` en cada componente.

### 3. Tipa las respuestas
```typescript
interface ContractsResponse {
  data: ContractDTO[]
  total: number
}
const { data } = await api.get<ContractsResponse>("/contracts")
```

### 4. Maneja errores específicamente
```typescript
if (e instanceof ValidationError) {
  // Mostrar errores por campo en el formulario
}
```

### 5. No persistas datos sensibles
El store solo persiste `auth` en localStorage. `formData` (con CURP, RFC, CLABE) solo vive en memoria.

### 6. Usa selectores tipados
```typescript
// ✅ Correcto
const { curp } = useINEData()

// ❌ Incorrecto
const curp = useContractStore(s => s.formData.ine.curp as string)
```

---

## Endpoints Actualmente Consumidos

Actualmente, todos los endpoints están en **modo mock**:
- `scanDocuments()` en el store simula escaneo con `setTimeout` y `Math.random()`
- `calcular()` en `useCreditoAsesor` simula cálculo de tabla
- `LoginPage` usa `MOCK_USERS` local
- `addContract()` solo guarda en memoria (store)

### Migración a API Real

Cuando el backend esté listo, reemplazar:

1. **Auth**: `LoginPage.onSubmit` → `api.post("/api/auth/login", ...)`
2. **OCR**: `store.scanDocuments` → `api.post("/scan/ine", formData)`, etc.
3. **Cálculo**: `useCreditoAsesor.calcular` → `api.post("/api/calcular-tabla", ...)`
4. **Historial**: Carga inicial → `api.get("/contracts")`
5. **Crear contrato**: `handleFinish` → `api.post("/api/generar-contrato", ...)`

---

[Volver a DOCS README](../README.md)
