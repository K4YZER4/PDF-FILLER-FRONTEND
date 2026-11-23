# Arquitectura de Librerías (src/lib/)

La carpeta `src/lib/` contiene la infraestructura compartida para la comunicación con el backend. Es la **capa de red** de la aplicación.

---

## Estructura

```
src/lib/
├── api.ts      # Instancia axios + interceptors
├── auth.ts     # Manejo de tokens JWT
├── errors.ts   # Clases de error tipadas
└── index.ts    # Barrel export
```

> **Nota:** El archivo `lib/utils.ts` (duplicado de `utils/cn.ts`) fue eliminado durante la refactorización. La función `cn()` vive únicamente en `src/utils/cn.ts`.

---

## api.ts — Cliente HTTP

### Responsabilidades

1. Crear una instancia de axios con configuración base (URL, timeout, headers)
2. Interceptor de request: adjuntar token JWT automáticamente
3. Interceptor de request: detectar token expirado y rechazar antes de enviar
4. Interceptor de response: normalizar errores a las clases tipadas de `errors.ts`

### Configuración

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
})
```

### Flujo de Interceptor de Request

```
Request
  │
  ▼
¿Hay token en localStorage?
  ├── No  → Continuar sin Authorization header
  └── Sí  → ¿Token expirado?
              ├── Sí → removeToken() + reject(AuthError) + redirect /login
              └── No  → Adjuntar Bearer token + continuar
```

### Flujo de Interceptor de Response

```
Response
  │
  ├── Éxito (2xx) → Devolver response sin modificar
  │
  └── Error
        ├── ERR_NETWORK           → NetworkError
        ├── 401                   → AuthError
        ├── 422 con data.errors   → ValidationError
        └── Otro status           → ApiError(status, message, code)
```

---

## auth.ts — JWT Management

### Responsabilidades

1. Persistir el token JWT en `localStorage` (clave: `credifom-token`)
2. Proveer funciones de acceso: get, set, remove, has
3. Decodificar payload del JWT sin verificar firma (para UI: nombre, rol)
4. Detectar expiración del token por timestamp

### Funciones

| Función | Complejidad | Propósito |
|---------|-------------|-----------|
| `setToken(token)` | O(1) | Guarda en localStorage |
| `getToken()` | O(1) | Lee de localStorage |
| `removeToken()` | O(1) | Elimina de localStorage |
| `hasToken()` | O(1) | `!!getToken()` |
| `decodeToken(token)` | O(n) | Divide JWT, decodifica base64 payload, retorna `TokenPayload` |
| `isTokenExpired(token)` | O(n) | Compara `payload.exp * 1000` con `Date.now()` |
| `authHeader()` | O(1) | Retorna `{ Authorization: "Bearer <token>" }` |

### TokenPayload

```typescript
interface TokenPayload {
  sub: string    // Email del usuario
  role: string   // "asesor" | "admin"
  exp: number    // Timestamp de expiración (segundos)
  iat: number    // Timestamp de emisión (segundos)
}
```

### Notas de Seguridad

- El frontend **NO verifica la firma del JWT**. La verificación la hace el backend.
- `decodeToken()` solo se usa para leer datos de UI (nombre, rol), no para autorización.
- `isTokenExpired()` se usa en el interceptor de axios para evitar enviar requests con token expirado.
- El token se guarda en localStorage por simplicidad. Para mayor seguridad, considerar httpOnly cookies.

---

## errors.ts — Errores Tipados

### Jerarquía

```
Error (nativo)
├── ApiError
│   ├── ValidationError
│   └── AuthError
└── NetworkError
```

### ApiError

Error genérico del servidor (cualquier status 4xx/5xx).

```typescript
class ApiError extends Error {
  public readonly status: number   // HTTP status code
  public readonly code: string     // Código interno del backend
  constructor(status: number, message: string, code = "UNKNOWN_ERROR")
}
```

### ValidationError

Error 422 con errores específicos por campo.

```typescript
class ValidationError extends ApiError {
  public readonly fields: Record<string, string[]>
  // Ejemplo: { email: ["El email es requerido"], password: ["Mínimo 6 caracteres"] }
  constructor(fields: Record<string, string[]>, message = "Error de validación")
}
```

### AuthError

Error 401 — no autorizado / sesión expirada.

```typescript
class AuthError extends ApiError {
  constructor(message = "Sesión expirada. Inicia sesión nuevamente.")
}
```

### NetworkError

Error de red — no se pudo conectar con el servidor.

```typescript
class NetworkError extends Error {
  constructor(message = "No se pudo conectar con el servidor. Verifica tu conexión.")
}
```

### Uso en Componentes

```typescript
import { AuthError, NetworkError } from "@/lib/errors"

try {
  await api.get("/contracts")
} catch (e) {
  if (e instanceof NetworkError) {
    toast.error("Revisa tu conexión a internet")
  } else if (e instanceof AuthError) {
    navigate("/login")
  }
}
```

---

## index.ts — Barrel Export

Exporta todo desde un solo punto de entrada:

```typescript
export { api } from "./api"
export { setToken, getToken, removeToken, hasToken, decodeToken, isTokenExpired, authHeader } from "./auth"
export { ApiError, ValidationError, AuthError, NetworkError } from "./errors"
```

---

## Dependencias Externas

- `axios` ^1.16.1 — Cliente HTTP
- `localStorage` — API nativa del navegador

No hay dependencias adicionales. La capa de red es autocontenida.

---

[Volver a DOCS README](../README.md)
