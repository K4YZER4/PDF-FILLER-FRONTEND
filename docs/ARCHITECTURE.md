# Arquitectura del Proyecto

## Descripción General

Aplicación frontend para **CREDIFOM, S.A.P.I. de C.V.** que permite generar contratos de crédito mediante:

1. **Subida de documentos** (INE, nóminas, estado de cuenta)
2. **Revisión y edición** de datos personales, laborales y bancarios
3. **Cálculo de crédito** (monto, plazo, tabla)
4. **Vista previa y descarga** del contrato PDF

Arquitectura basada en **features** para facilitar escalabilidad y futura migración a React Native.

---

## Stack Tecnológico

| Tecnología | Propósito |
|-----------|-----------|
| React 19 | UI |
| TypeScript ~5.8 | Tipado |
| Vite 8 | Build |
| Tailwind CSS 4 | Estilos |
| Zustand 5 + Immer 10 | Estado global |
| React Router 7 | Navegación |
| Lucide React | Iconos |

---

## Estructura de Carpetas

```
src/
├── app/                      # Configuración raíz
│   ├── App.tsx               # Routing principal
│   └── index.css             # Tema CREDIFOM (Tailwind @theme)
│
├── features/                 # Módulos por funcionalidad
│   ├── auth/                 # LoginPage
│   ├── upload-documents/     # SubirDocs (INE, nóminas, edo. cuenta)
│   ├── review-data/          # RevisionDatos (acordeones editables)
│   ├── loan-data/            # CreditoAsesor (monto, plazo, cálculo)
│   ├── preview-contract/     # VistaPrevia (preview, descarga, finalizar)
│   └── history/              # HistorialPage (lista de contratos)
│
├── layouts/                  # Layouts reutilizables
│   ├── AuthLayout.tsx        #   Layout público (fondo centrado)
│   ├── AppLayout.tsx         #   Layout principal (header + contenido)
│   └── ContractLayout.tsx    #   Stepper 4 pasos con navegación
│
├── routes/                   # Guards de autenticación
│   ├── PrivateRoute.tsx      #   Redirige a /login si no auth
│   ├── PublicRoute.tsx       #   Redirige a / si ya auth
│   └── index.ts
│
├── shared/components/        # UI components reutilizables
│   ├── Button.tsx            #   Botón con variantes y loading
│   ├── Input.tsx             #   Input con error
│   ├── Card.tsx              #   Contenedor con bordes y sombra
│   ├── Badge.tsx             #   Etiqueta de estado
│   ├── Spinner.tsx           #   Indicador de carga
│   └── index.ts
│
├── store/                    # Estado global (Zustand + immer)
│   └── useContractStore.ts   #   Slices: auth, step, documents, formData, history
│
├── types/                    # Tipos compartidos
│   └── index.ts              #   INEData, NominaData, EstadoCuentaData, TablaCreditoData
│
└── main.tsx                  # Entry point (ReactDOM.createRoot)
```

---

## Flujo de Navegación

```
/login          → [PublicRoute] → AuthLayout → LoginPage
/               → [PrivateRoute] → AppLayout → HistorialPage
/contracts/*    → [PrivateRoute] → ContractLayout
  /upload       →   SubirDocs (paso 1)
  /review       →   RevisionDatos (paso 2)
  /loan         →   CreditoAsesor (paso 3)
  /preview      →   VistaPrevia (paso 4)
```

### ContractLayout (Stepper)

- Navegación entre pasos basada en URL (useLocation)
- Botón "Siguiente" habilitado/deshabilitado según validación
- Botón "Volver" / "Cancelar"

Validaciones:
- **Paso 1**: `scanStatus === "done"` (todos los documentos escaneados)
- **Paso 2**: Siempre permitido
- **Paso 3**: `tabla !== null` (cálculo completado)
- **Paso 4**: Sin restricción

---

## Store (Estado Global)

`useContractStore` con slices:

| Slice | Estado | Acciones |
|-------|--------|----------|
| `auth` | user, role, isAuthenticated | login(), logout() |
| `step` | current: 1-4 | setStep(), nextStep(), prevStep() |
| `documents` | ineFile, nomina1/2File, estadoCuentaFile, scanStatus | setDocument(), setScanStatus() |
| `formData` | ine, nomina, banco, tabla | setFormData(), resetFormData() |
| `history` | contracts[] | addContract(), clearHistory() |

---

## Componentes Compartidos

| Componente | Props | Descripción |
|-----------|-------|-------------|
| `Button` | `variant`, `size`, `loading` | Botón primary/secondary con spinner |
| `Input` | `error`, type HTML input | Input con mensaje de error |
| `Card` | `className` | Contenedor con sombra y bordes redondeados |
| `Badge` | `variant: success/warning/error/info` | Etiqueta de estado |
| `Spinner` | `size: sm/md/lg` | Loader animado |

---

## Diseño Responsive

- **Mobile-first**: Todos los componentes diseñados primero para pantallas pequeñas
- Media queries con Tailwind: `sm:`, `md:`, `lg:`
- Contenedores con `max-w-4xl mx-auto` para desktop
- Grid responsivo: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

[Volver a DOCS README](./README.md)
