# Guía de Configuración

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

## Instalación

```bash
cd PDF-FILLER-FRONTEND
npm install
```

## Ejecución en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Genera la build de producción en `dist/` (tsc + vite) |
| `npm run preview` | Previsualiza la build de producción localmente |
| `npm run lint` | Ejecuta el linter |
| `npm test` | Ejecuta pruebas con Vitest en modo watch |
| `npm run test:run` | Ejecuta pruebas una sola vez |

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE=http://localhost:3000
```

### Variables Disponibles

| Variable | Requerida | Default | Descripción |
|----------|-----------|---------|-------------|
| `VITE_API_BASE` | No | `http://localhost:3000` | URL base del backend |

### Ejemplo de `.env` completo

```env
# URL del backend (API REST)
VITE_API_BASE=http://localhost:3000
```

## Conexión con el Backend

### Cliente HTTP (Axios)

El proyecto usa **Axios** como cliente HTTP. La instancia preconfigurada está en `src/lib/api.ts`:

- **Base URL**: Se obtiene de `VITE_API_BASE`. Si no está definida, usa `http://localhost:3000`
- **Timeout**: 30 segundos
- **Interceptor de request**: Adjunta automáticamente el token JWT (`Authorization: Bearer <token>`)
- **Interceptor de response**: Normaliza errores a clases tipadas (ApiError, ValidationError, AuthError, NetworkError)

### Autenticación

El token JWT se maneja en `src/lib/auth.ts`:
- `setToken(token)` — Guarda en localStorage
- `getToken()` — Recupera desde localStorage
- `decodeToken(token)` — Decodifica payload sin verificar firma
- `isTokenExpired(token)` — Verifica expiración por timestamp

### Flujo típico de llamada

```typescript
import { api } from "@/lib/api"
import { useApi } from "@/hooks/useApi"

// Opción 1: Directa
const contracts = await api.get("/contracts").then(r => r.data.data)

// Opción 2: Con hook (loading + error)
const { data, isLoading, error, execute } = useApi(
  () => api.get("/contracts").then(r => r.data.data),
)
```

## Credenciales de Prueba (Login)

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Asesor | asesor@credifom.mx | 1234 |
| Admin | admin@credifom.mx | 1234 |

## Notas Importantes

- El backend debe estar corriendo antes de usar las funciones de escaneo y generación de PDF
- Asegúrate de que el backend tenga los endpoints necesarios implementados
- Los archivos subidos deben ser imágenes claras (JPG, PNG) o PDFs de los documentos
- Los datos del formulario NO se persisten en localStorage por seguridad. Solo el token de autenticación persiste
- Los archivos se guardan en IndexedDB (no en localStorage) para soportar archivos binarios grandes

---

[Volver a DOCS README](./README.md)
