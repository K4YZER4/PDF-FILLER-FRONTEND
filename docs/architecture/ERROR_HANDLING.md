# Manejo de Errores

Este documento describe las estrategias de manejo de errores en PDF-FILLER-FRONTEND.

---

## Estrategias de Manejo de Errores

### 1. Errores de Red/API (src/lib/errors.ts)

Todas las llamadas HTTP pasan por la instancia `api` de axios, cuyo interceptor de response normaliza los errores a clases tipadas:

| Clase | Cuándo se lanza | Propiedades clave |
|-------|-----------------|-------------------|
| `NetworkError` | No se pudo conectar al servidor | `message` |
| `AuthError` | 401 Unauthorized | `message` |
| `ValidationError` | 422 con errores por campo | `fields: Record<string, string[]>` |
| `ApiError` | Cualquier otro error 4xx/5xx | `status`, `code`, `message` |

### 2. Errores de Renderizado (ErrorBoundary)

`ErrorBoundary` (class component) captura errores lanzados durante el renderizado de sus hijos.

**Ubicación**: `src/components/feedback/ErrorBoundary.tsx`

**Uso en ContractLayout**:
```typescript
<ErrorBoundary context="Error al cargar la sección del contrato">
  <Outlet />
</ErrorBoundary>
```

**Comportamiento**:
- Captura el error con `componentDidCatch`
- Muestra un `Card` con icono de advertencia, mensaje contextual y botón "Reintentar"
- El botón "Reintentar" resetea `hasError` a `false`, forzando un re-render
- Props opcional `onError` para logging externo (Sentry, etc.)

### 3. Hook useApi (src/hooks/useApi.ts)

El hook `useApi` encapsula el patrón try/catch y expone:

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `data` | `T \| null` | Datos de la respuesta exitosa |
| `isLoading` | `boolean` | True mientras se ejecuta la llamada |
| `error` | `string \| null` | Mensaje legible para mostrar al usuario |
| `apiError` | `ApiError \| NetworkError \| null` | Objeto de error tipado para manejo avanzado |
| `execute` | `() => Promise<T \| null>` | Función para ejecutar/re-ejecutar |

El hook categoriza automáticamente el error:
- **ValidationError**: Toma el primer error del primer campo
- **AuthError/ApiError/NetworkError**: Usa el message del error
- **Error genérico**: Usa `error.message`

### 4. Errores de Validación (Zod + react-hook-form)

El login usa `react-hook-form` con `zod` para validación del lado del cliente:

```typescript
const loginSchema = z.object({
  email: z.string().min(1, "El usuario es requerido").email("Ingresa un correo válido"),
  password: z.string().min(1, "La contraseña es requerida").min(4, "Mínimo 4 caracteres"),
})
```

Los errores de validación se muestran por campo mediante la prop `error` del componente `Input`.

### 5. Errores de Mock/Desarrollo

Durante desarrollo, algunos errores son simulados:
- `scanDocuments()`: `Math.random() > 0.2` determina si un documento se escanea OK
- Login: Búsqueda en array local de `MOCK_USERS`

---

## Flujo Completo de Error

```
Componente
  │
  ├── Error de validación (cliente)
  │   └── Zod → react-hook-form → Input.error
  │
  ├── Error de API
  │   └── api.ts interceptor
  │       ├── NetworkError → useApi.error = "No se pudo conectar..."
  │       ├── AuthError → useApi.error = "Sesión expirada..." + puede redirigir a /login
  │       ├── ValidationError → useApi.error = "email: El email es requerido"
  │       └── ApiError → useApi.error = message del backend
  │
  └── Error de renderizado
      └── ErrorBoundary → UI fallback con "Reintentar"
```

---

## Buenas Prácticas

1. **Siempre usa `api` (no axios directo)** para tener interceptors de error consistentes
2. **Usa `useApi`** para llamadas API en componentes — evita repetir try/catch
3. **Maneja errores específicamente**:
   ```typescript
   if (e instanceof ValidationError) {
     // Mostrar errores en formulario
   } else if (e instanceof NetworkError) {
     toast.error("Sin conexión")
   }
   ```
4. **Envuelve secciones críticas con ErrorBoundary** para evitar crash total
5. **No persistas errores en el store** — los errores son locales al componente
6. **Limpia errores al re-ejecutar** — `execute()` en `useApi` resetea `error` y `apiError`

---

[Volver a DOCS README](../README.md)
