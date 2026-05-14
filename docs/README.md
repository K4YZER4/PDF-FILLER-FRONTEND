# Documentación del Proyecto PDF-FILLER-FRONTEND

## Índice de Documentos

1. [Arquitectura del Proyecto](./ARCHITECTURE.md) — Estructura, tecnologías y flujo
2. [Guía de Configuración](./SETUP.md) — Instalación y variables de entorno
3. [Arquitectura de Componentes](./architecture/COMPONENTS_ARCHITECTURE.md)
4. [Convenciones de Código](./guides/CODING_STANDARDS.md)
5. [Dependencias del Proyecto](./DEPENDENCIES.md)
6. [Git Workflow](./workflows/GIT_WORKFLOW.md)
7. [Pull Requests](./workflows/PULL_REQUESTS.md)
8. [Team Workflow](./team/TEAM_WORKFLOW.md)
9. [Solución de Problemas](./troubleshooting/index.md)
10. [API Contracts](./api/API.md)
11. [Conexión con Backend](./api/BACKEND_CONNECTION.md) — Axios, interceptors, auth, errores
12. [Arquitectura de Librerías (src/lib/)](./architecture/LIB_ARCHITECTURE.md) — api.ts, auth.ts, errors.ts
13. [Arquitectura del Store](./architecture/STORE_ARCHITECTURE.md) — Zustand + persist + selectores
14. [Manejo de Errores](./architecture/ERROR_HANDLING.md) — ErrorBoundary, errores tipados
15. [Arquitectura de Features](./architecture/FEATURES_ARCHITECTURE.md) — Loan-data, hooks, secciones

## Resumen de Documentación en Código

Todos los archivos de código han sido documentados con comentarios explicando:

- **Propósito de cada archivo**
- **Qué hace cada sección/componente**
- **Qué hacen las funciones principales**
- **Tipos de datos y sus campos**

### Archivos Principales
- `src/main.tsx` - Punto de entrada de React
- `src/app/App.tsx` - Componente raíz con routing y Suspense
- `src/app/index.css` - Estilos globales y tema CREDIFOM (Tailwind @theme)

### Infraestructura (`lib/`)
- `src/lib/api.ts` — Instancia axios con interceptors (token + errores)
- `src/lib/auth.ts` — Manejo de JWT (set, get, decode, expiry)
- `src/lib/errors.ts` — Clases tipadas: ApiError, ValidationError, AuthError, NetworkError
- `src/lib/index.ts` — Barrel export

### Tipos (`types/`)
- `src/types/index.ts` — Interfaces del dominio: INEData, NominaData, EstadoCuentaData, AsesorData, ContactoData, AntiguedadData, Referencias, ResultadoCalculo
- `src/types/api.ts` — Tipos de API REST: ApiResponse, LoginRequest, ContractDTO, etc.

### Estado Global (`store/`)
- `src/store/useContractStore.ts` — Store Zustand + Immer + persist (solo auth)
- `src/store/selectors.ts` — Selectores tipados: useINEData, useNominaData, useBancoData, useClientName

### Hooks Compartidos
- `src/hooks/useApi.ts` — Hook genérico para llamadas API con loading/error/data

### Componentes de UI (`components/ui/`)
- Button, Input, Badge — documentados con props y comportamiento

### Componentes de Feedback (`components/feedback/`)
- ErrorBoundary — Captura errores de renderizado con UI fallback y retry
- EmptyState — Pantalla de estado vacío con icono, título y acción

### Layouts
- `src/layouts/AuthLayout.tsx` - Fondo centrado para login
- `src/layouts/AppLayout.tsx` - Header + contenido
- `src/layouts/ContractLayout.tsx` - Stepper de 4 pasos + ErrorBoundary en Outlet

### Features
- `src/features/auth/` - LoginPage con react-hook-form + zod + toggle component
- `src/features/upload-documents/` - SubirDocs (subida de INE, nóminas, estado de cuenta)
- `src/features/review-data/` - RevisionDatos (acordeones editables desde configuración)
- `src/features/loan-data/` - CreditoAsesor (orquestador puro + hook + 7 secciones)
- `src/features/preview-contract/` - VistaPrevia (vista previa y descarga)
- `src/features/history/` - HistorialPage (lista de contratos con búsqueda)

### Utilidades
- `src/utils/cn.ts` — clsx + tailwind-merge para clases condicionales
- `src/utils/fileStorage.ts` — Persistencia de archivos en IndexedDB

### Constantes
- `src/constants/revisionFields.ts` — Configuración de secciones y campos de RevisionDatos

## Cómo Usar Esta Documentación

1. **Para entender un archivo**: Lee los comentarios al inicio de cada archivo
2. **Para entender funciones**: Lee los comentarios antes de cada función
3. **Para entender componentes**: Revisa las interfaces de props
4. **Para configuración general**: Lee los archivos en la carpeta `docs/`

---

[Volver a CONTRIBUTING](./CONTRIBUTING.md)
