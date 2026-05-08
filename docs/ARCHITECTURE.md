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

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| React | 19 | UI |
| TypeScript | ~5.8 | Tipado |
| Vite | 8 | Build |
| Tailwind CSS | 4 | Estilos |
| Zustand | 5 | Estado global |
| React Router | 7 | Navegación |
| Immer | 10 | Mutaciones inmutables |
| Lucide React | ~0.5 | Iconos |

---

## Estructura de Carpetas

```
src/
├── app/                      # Configuración raíz
│   ├── App.tsx               # Componente raíz con routing
│   └── index.css             # Tema CREDIFOM (Tailwind @theme)
│
├── features/                 # Módulos por funcionalidad
│   ├── auth/                 # 
│   │   ├── LoginPage.tsx     #   Login con mock users
│   │   └── index.ts
│   ├── upload-documents/     #
│   │   ├── SubirDocs.tsx     #   Subida de INE, nóminas, edo. cuenta
│   │   └── index.ts
│   ├── review-data/          #
│   │   ├── RevisionDatos.tsx #   Accordions editables (4 secciones)
│   │   └── index.ts
│   ├── loan-data/            #
│   │   ├── CreditoAsesor.tsx #   Monto, plazo, cálculo simulado
│   │   └── index.ts
│   ├── preview-contract/     #
│   │   ├── VistaPrevia.tsx   #   Vista previa, descarga, finalizar
│   │   └── index.ts
│   └── history/              #
│       ├── HistorialPage.tsx #   Lista de contratos con filtros
│       └── index.ts
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
├── store/                    # Estado global
│   ├── useContractStore.ts   #   Store Zustand + immer
│   └── (types exportados: UserRole, Contract)
│
├── types/                    # Tipos compartidos
│   └── index.ts              #   INEData, NominaData, EstadoCuentaData, TablaCreditoData, ScanStatus
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

El layout de contrato mantiene un **stepper visual de 4 pasos** que permite:

- Navegación entre pasos completados
- Botón "Siguiente" habilitado/deshabilitado según validación
- Botón "Volver" / "Cancelar"
- Calcula el paso actual basado en la ruta URL

Validaciones para continuar:
- **Paso 1**: `scanStatus === "done"` (todos los documentos escaneados)
- **Paso 2**: Siempre permitido
- **Paso 3**: `tabla !== null` (cálculo de crédito completado)
- **Paso 4**: Sin restricción

---

## Store (Estado Global)

`useContractStore` maneja todo el estado con slices:

```
auth        → user, role, isAuthenticated | login(), logout()
step        → current: 1-4               | setStep(), nextStep(), prevStep()
documents   → ineFile, nomina1/2File,    | setDocument(), setScanStatus()
              estadoCuentaFile, scanStatus
formData    → ine, nomina, banco, tabla   | setFormData(), resetFormData()
history     → contracts[]                | addContract(), clearHistory()
```

---

## Componentes Compartidos

| Componente | Props | Descripción |
|-----------|-------|-------------|
| `Button` | `variant`, `size`, `loading` | Botón primary/secondary con spinner |
| `Input` | `error`, `type` | Input con mensaje de error |
| `Card` | `className` | Contenedor con sombra y bordes redondeados |
| `Badge` | `variant: success/warning/error/info` | Etiqueta de estado |
| `Spinner` | `size: sm/md/lg` | Loader animado |

---

## Manejo de Estado

Cada feature maneja su estado local con `useState` para UI efímera y usa el store global para datos persistentes:

```
Feature component
│
├── useState → UI temporal (modales, inputs, animaciones)
│
└── useContractStore → Datos de negocio (documentos, formularios, auth)
```

---

## Diseño Responsive

- **Mobile-first**: Todos los componentes diseñados primero para pantallas pequeñas
- Media queries con Tailwind: `sm:`, `md:`, `lg:`
- Contenedores con `max-w-4xl mx-auto` para desktop
- Grid responsivo: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Touch targets mínimos de 44px en mobile
