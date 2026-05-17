# Arquitectura del Proyecto

## Descripción General

Aplicación frontend para **CREDIFOM, S.A.P.I. de C.V.** que permite generar contratos de crédito mediante:

1. **Subida de documentos** (INE, nóminas, estado de cuenta)
2. **Revisión y edición** de datos personales, laborales y bancarios
3. **Cálculo de crédito** (monto, plazo, tabla + datos complementarios)
4. **Vista previa y descarga** del contrato PDF

Arquitectura basada en **features** para facilitar escalabilidad y futura migración a React Native.

---

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| React | ^19.2.5 | UI |
| TypeScript | ~6.0.2 | Tipado |
| Vite | ^8.0.10 | Build y dev server |
| Tailwind CSS | ^4.2.4 | Estilos utilitarios |
| Zustand | ^5.0.12 | Estado global (con Immer + persist) |
| Immer | ^11.1.4 | Mutaciones inmutables |
| React Router | ^7.14.2 | Navegación SPA |
| Axios | ^1.16.1 | Cliente HTTP |
| Lucide React | ^1.14.0 | Iconos SVG |
| React Hook Form | ^7.74.0 | Manejo de formularios |
| Zod | ^4.4.1 | Validación de esquemas |
| clsx + tailwind-merge | - | Clases condicionales |

---

## Estructura de Carpetas

```
```
src/
├── api/                       # Servicios API por feature (preparados para backend)
│   ├── auth.api.ts            #   POST /api/auth/login
│   ├── scan.api.ts            #   POST /scan/ine, /scan/nomina, etc.
│   ├── calculo.api.ts         #   POST /api/calcular-tabla
│   ├── contracts.api.ts       #   GET/POST /api/contracts
│   └── index.ts               #   Barrel export
│
├── app/                       # Configuración raíz
│   ├── App.tsx                #   Routing principal + Suspense
│   └── index.css              #   Tema CREDIFOM (Tailwind @theme)
│
├── components/                # Componentes reutilizables
│   ├── ui/                    #   Design system
│   │   ├── Badge.tsx          #     Etiqueta de estado
│   │   ├── Button.tsx         #     Botón con variantes y loading
│   │   ├── DateInput.tsx      #     Input de fecha nativo
│   │   ├── Input.tsx          #     Input con label, error, íconos
│   │   ├── NameInput.tsx      #     Input solo letras (nombres)
│   │   ├── NumericInput.tsx   #     Input solo dígitos
│   │   ├── alert-dialog.tsx   #     Modal accesible (shadcn/ui adaptado)
│   │   └── index.ts
│   ├── feedback/              #   Feedback visual
│   │   ├── ErrorBoundary.tsx  #     Captura errores de renderizado
│   │   ├── EmptyState.tsx     #     Estado vacío con acción
│   │   └── index.ts
│   ├── Card.tsx               #   Contenedor con sombra y bordes
│   ├── Spinner.tsx            #   Loader animado
│   └── index.ts
│
├── constants/                 # Constantes globales
│   └── revisionFields.ts      #   Configuración de secciones y campos de revisión
│
├── features/                  # Módulos por funcionalidad (autocontenidos)
│   ├── auth/                  #   LoginPage (react-hook-form + zod)
│   │   ├── components/        #     Toggle component
│   │   ├── LoginPage.tsx
│   │   └── index.ts
│   ├── upload-documents/      #   SubirDocs (INE, nóminas, edo. cuenta)
│   │   ├── SubirDocs.tsx
│   │   └── index.ts
│   ├── review-data/           #   RevisionDatos + utils separados
│   │   ├── components/        #     CURPInput, RFCInput, CLABEInput, SexSelect
│   │   ├── utils/             #     validation.ts, fieldRenderer.tsx
│   │   ├── RevisionDatos.tsx  #     Orquestador (~145 líneas)
│   │   └── index.ts
│   ├── loan-data/             #   CreditoAsesor (orquestador + hook + utils)
│   │   ├── components/        #     7 secciones accordion + SelectField
│   │   ├── hooks/             #     useCreditoAsesor
│   │   ├── utils/             #     validation.ts (validadores compartidos)
│   │   ├── CreditoAsesor.tsx  #     Orquestador puro (~112 líneas)
│   │   ├── constants.ts       #     Catálogos (asesores, meses, plazos)
│   │   ├── types.ts           #     Re-export desde @/types
│   │   └── index.ts
│   ├── preview-contract/      #   VistaPrevia (vista previa del contrato)
│   │   ├── VistaPrevia.tsx
│   │   └── index.ts
│   └── history/               #   HistorialPage (filtros + búsqueda)
│       ├── components/        #     ContractCard, TimeFilter, AdvisorFilter
│       ├── hooks/             #     useContractFilters
│       ├── HistorialPage.tsx
│       └── index.ts
│
├── hooks/                     # Hooks compartidos
│   └── useApi.ts              #   Hook genérico API (loading/error/data)
│
├── layouts/                   # Layouts reutilizables
│   ├── components/            #   Componentes del flujo de contrato
│   │   ├── ContractStepper.tsx
│   │   ├── ContractFooter.tsx #     Botones según paso (extraído)
│   │   ├── ScanOverlay.tsx    #     Progreso de escaneo (extraído)
│   │   ├── FinishToast.tsx    #     Notificación éxito (extraído)
│   │   ├── FloatingShareButton.tsx # FAB compartir móvil (extraído)
│   │   ├── ExitModal.tsx
│   │   └── index.ts
│   ├── hooks/                 #   Hooks de navegación y lógica
│   │   ├── useStepValidation.ts #   Validación por paso (extraído)
│   │   └── useShareContract.ts  #   Web Share API / clipboard (extraído)
│   ├── AuthLayout.tsx         #   Layout público (login)
│   ├── AppLayout.tsx          #   Layout principal (header + logout)
│   └── ContractLayout.tsx     #   Stepper 4 pasos + ErrorBoundary (~167 líneas)
│
├── lib/                       # Infraestructura / API
│   ├── api.ts                 #   Axios instance + interceptors
│   ├── auth.ts                #   JWT management (set, get, decode)
│   ├── errors.ts              #   Clases de error tipadas
│   └── index.ts               #   Barrel export
│
├── routes/                    # Guards de autenticación
│   ├── PrivateRoute.tsx       #   Redirige a /login si no auth
│   ├── PublicRoute.tsx        #   Redirige a / si ya auth
│   └── index.ts
│
├── store/                     # Estado global (Zustand + immer + persist)
│   ├── mockData.ts            #   Valores iniciales + MOCK_CONTRACTS (extraído)
│   ├── selectors.ts           #   Selectores tipados (useINEData, useClientName, etc.)
│   └── useContractStore.ts    #   Store puro (~185 líneas) + re-export de tipos
│
├── types/                     # Tipos compartidos
│   ├── index.ts               #   INEData, NominaData, AsesorData, Referencias, etc.
│   ├── store.ts               #   ContractState, AuthState, FormDataState (extraído)
│   └── api.ts                 #   ApiResponse, LoginRequest, ContractDTO
│
├── utils/                     # Utilidades
│   ├── cn.ts                  #   clsx + tailwind-merge
│   └── fileStorage.ts         #   IndexedDB para archivos binarios
│
├── assets/                    # Imágenes estáticas (Logo, ilustraciones)
│
└── main.tsx                   # Entry point (ReactDOM.createRoot)
```
```

---

## Flujo de Navegación

```
/login          → [PublicRoute] → AuthLayout → LoginPage
/               → [PrivateRoute] → AppLayout → HistorialPage
/contracts/*    → [PrivateRoute] → ContractLayout → [ErrorBoundary]
  /upload       →   SubirDocs (paso 1)
  /review       →   RevisionDatos (paso 2)
  /loan         →   CreditoAsesor (paso 3)
  /preview      →   VistaPrevia (paso 4)
```

### ContractLayout (Stepper)

**Contenido extraído a módulos separados:**
- `useStepValidation` → hook de validación por paso (evita lógica en el layout)
- `ContractFooter` → renderiza botones según el paso actual
- `ScanOverlay` → modal de progreso de escaneo
- `FinishToast` → notificación al generar contrato
- `FloatingShareButton` → FAB de compartir en móvil (paso 4)
- `useShareContract` → lógica de Web Share API / clipboard

**Comportamiento:**
- Navegación entre pasos basada en URL (useLocation)
- Botón "Siguiente" habilitado/deshabilitado según validación
- Botón "Volver" / "Cancelar"
- ErrorBoundary envuelve `<Outlet />` para capturar errores de renderizado

Validaciones:
- **Paso 1**: `scanStatus === "done"` (todos los documentos escaneados)
- **Paso 2**: Campos personales + domicilio + laborales + bancarios completos
- **Paso 3**: Monto válido + secciones del accordion completas (asesor, contacto, antigüedad, referencias)
- **Paso 4**: Sin restricción

---

## Store (Estado Global)

El store está dividido en 3 archivos para mejorar cohesión y facilitar tests:

| Archivo | Contenido | Propósito |
|---------|-----------|-----------|
| `store/types/store.ts` | Interfaces `AuthState`, `DocumentsState`, `FormDataState`, `ContractState`, etc. | Tipos extraídos del store para importarlos sin cargar Zustand |
| `store/mockData.ts` | `initialDocuments`, `initialFormData`, `MOCK_CONTRACTS` | Estado inicial y datos mock separados del store |
| `store/useContractStore.ts` | Store puro con `create()`, `persist()`, `immer()` | Solo la definición del store (~185 líneas) |

### Slices

| Slice | Estado | Acciones | Persistido |
|-------|--------|----------|------------|
| `auth` | user, role, isAuthenticated | login(), logout() | ✅ localStorage |
| `step` | current: 1-4 | setStep(), nextStep(), prevStep() | ❌ |
| `documents` | ineFile, nomina1/2File, estadoCuentaFile, scanStatus, scanProgress, scanResults | setDocument(), setScanStatus(), scanDocuments(), resetDocuments() | ❌ (archivos en IndexedDB) |
| `formData` | ine, nomina, banco, tabla, asesorData, contactoData, antiguedadData, referencias, capitalMonto, plazoQnas | setFormData(), resetFormData() | ❌ (datos sensibles) |
| `history` | contracts[] | addContract(), clearHistory() | ❌ (mock, será backend) |

**Seguridad**: `partialize` solo persiste `auth` en localStorage. Datos sensibles (CURP, RFC, CLABE) nunca se guardan en almacenamiento local.

---

## Capa de Infraestructura (src/lib/)

| Archivo | Propósito |
|---------|-----------|
| `api.ts` | Instancia axios con baseURL de `VITE_API_BASE`, interceptor de token y normalización de errores |
| `auth.ts` | Gestión de JWT: setToken, getToken, decodeToken, isTokenExpired |
| `errors.ts` | Clases tipadas: ApiError, ValidationError, AuthError, NetworkError |

> **Nota:** `utils/cn.ts` es la única fuente de la función `cn()`. El archivo `lib/utils.ts` (duplicado) fue eliminado.

Toda llamada HTTP debe hacerse a través de `api` (importado de `@/lib/api`) para asegurar:
- Inyección automática del token JWT
- Rechazo de requests con token expirado
- Normalización consistente de errores

---

## Componentes Compartidos

### UI (`components/ui/`)

| Componente | Props | Descripción |
|-----------|-------|-------------|
| `Button` | `variant`, `size`, `loading`, `fullWidth`, `leftIcon` | Botón primary/secondary/ghost/danger con spinner |
| `Input` | `label`, `error`, `type`, `required` | Input con label, mensaje de error, íconos, toggle password |
| `NameInput` | `onChange(value)`, `maxLength` | Solo letras + mayúsculas automáticas (nombres, ciudades) |
| `NumericInput` | `onChange(value)`, `maxLength` | Solo dígitos (CP, teléfono, cuenta) |
| `DateInput` | `onChange(isoValue)` | Calendario nativo, rango 1935 a hoy-18años |
| `Badge` | `variant: success/warning/error/info` | Etiqueta de estado |
| `alert-dialog` | — | Modal accesible vía shadcn/ui, usado para confirmación al salir |

> Los inputs especializados (`NameInput`, `NumericInput`, `DateInput`) se movieron desde `features/review-data/components/` a `components/ui/` porque son usados por múltiples features.

### Feedback (`components/feedback/`)
| Componente | Props | Descripción |
|-----------|-------|-------------|
| `ErrorBoundary` | `children`, `context?`, `onError?` | Class component que captura errores y muestra fallback con retry |
| `EmptyState` | `title`, `description?`, `icon?`, `actionLabel?`, `onAction?` | Pantalla de estado vacío |

### Genéricos (`components/`)
| Componente | Props | Descripción |
|-----------|-------|-------------|
| `Card` | `className`, `children` | Contenedor con sombra y bordes redondeados |
| `Spinner` | `size: sm/md/lg` | Loader animado |

---

## Diseño Responsive

- **Mobile-first**: Todos los componentes diseñados primero para pantallas pequeñas
- Media queries con Tailwind: `sm:`, `md:`, `lg:`
- Contenedores con `max-w-4xl mx-auto` para desktop
- Grid responsivo: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- El login tiene layout de 2 columnas en desktop (formulario + ilustración)

---

[Volver a DOCS README](./README.md)
