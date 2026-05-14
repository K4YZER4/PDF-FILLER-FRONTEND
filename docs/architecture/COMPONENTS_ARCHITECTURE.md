# Arquitectura de Componentes

---

## Principios de Diseño

### 1. Una Sola Responsabilidad
- `Button` → Solo renderiza un botón
- `Input` → Solo maneja entrada de datos
- `Card` → Solo es un contenedor visual
- `ErrorBoundary` → Solo captura errores de renderizado

### 2. Reutilización
- Componentes compartidos en `components/ui/` y `components/`
- Agnósticos al dominio del negocio
- Props genéricas, sin lógica de negocio

### 3. Separación
- **UI/Design System**: `components/ui/` (Button, Input, Badge)
- **Feedback**: `components/feedback/` (ErrorBoundary, EmptyState)
- **Genéricos**: `components/` (Card, Spinner)
- **Layout**: `layouts/` (AuthLayout, AppLayout, ContractLayout)
- **Lógica**: Cada feature maneja su estado con hooks locales
- **Datos**: `store/useContractStore` (Zustand)

---

## Componentes UI (`components/ui/`)

| Componente | Props | Descripción |
|-----------|-------|-------------|
| `Button` | `variant: primary/secondary/ghost/danger`, `size: sm/md/lg`, `loading`, `fullWidth`, `leftIcon?`, `rightIcon?` | Botón con estados y spinner |
| `Input` | `label?`, `error?`, `required`, `type: text/password/email`, `placeholder` | Input con label, mensaje de error, toggle de visibilidad para password |
| `Badge` | `variant: success/warning/error/info` | Etiqueta de estado con colores semánticos |

### Patrón de exportación
```tsx
// components/ui/Button.tsx
export { Button }
export type { ButtonProps }

// components/ui/index.ts
export { Button } from "./Button"
export type { ButtonProps } from "./Button"
```

---

## Componentes de Feedback (`components/feedback/`)

| Componente | Props | Descripción |
|-----------|-------|-------------|
| `ErrorBoundary` | `children`, `context?`, `onError?` | Class component de React que captura errores de renderizado. Muestra un Card con icono de advertencia, mensaje contextual y botón "Reintentar" que resetea el estado. |
| `EmptyState` | `title`, `description?`, `icon?`, `image?`, `actionLabel?`, `onAction?` | Pantalla de estado vacío con icono/imagen, título, descripción opcional y botón de acción. Útil para listas vacías (historial, resultados de búsqueda). |

### ErrorBoundary
- Usa `componentDidCatch` para capturar errores
- Props opcional `onError` para logging externo
- Botón "Reintentar" resetea `hasError` a false
- Envuelve `<Outlet />` en `ContractLayout`

---

## Componentes Genéricos (`components/`)

| Componente | Props | Descripción |
|-----------|-------|-------------|
| `Card` | `className?`, `children` | Contenedor con bordes redondeados, sombra y padding. Sin estilo propio — todo via className. |
| `Spinner` | `size: sm/md/lg` | Loader animado circular. Usado como fallback de Suspense y en estados de carga. |

---

## Layouts

| Layout | Ubicación | Propósito |
|--------|-----------|-----------|
| `AuthLayout` | `layouts/AuthLayout.tsx` | Fondo centrado para login |
| `AppLayout` | `layouts/AppLayout.tsx` | Header + contenido (historial) |
| `ContractLayout` | `layouts/ContractLayout.tsx` | Stepper 4 pasos con navegación + ErrorBoundary |

### ContractLayout
- Stepper visual con 4 pasos: Documentos → Datos → Crédito → Vista previa
- Navegación basada en URL (`/contracts/upload`, `/contracts/review`, etc.)
- Botones Siguiente/Volver con validación por paso
- Modal de confirmación al salir (ExitModal)
- Overlay de escaneo con progreso por documento
- Toast de finalización al generar contrato
- Botón flotante de compartir en móvil (paso 4)
- Usa `<Outlet />` envuelto en `<ErrorBoundary>`

### Componentes del Layout (`layouts/components/`)
| Componente | Descripción |
|-----------|-------------|
| `ContractStepper` | Stepper horizontal con íconos, labels y estado activo/completado |
| `ExitModal` | Modal de confirmación al salir del flujo |

---

## Features

Cada feature es una carpeta independiente con su propia estructura:

```
feature-name/
├── Componente.tsx     # Lógica + UI (orquestador puro en loan-data)
├── components/        # Subcomponentes de la feature
├── hooks/             # Hooks específicos
├── constants.ts       # Constantes de dominio
├── types.ts           # Tipos específicos (o re-export)
└── index.ts           # Barrel export
```

### Mapa de Features

| Feature | Componente | Estrategia | Store global |
|---------|-----------|------------|--------------|
| `auth` | `LoginPage` | react-hook-form + zod validation. Mock users local. | auth.login() |
| `upload-documents` | `SubirDocs` | Subida drag-and-drop + scanDocuments() del store. Archivos se guardan en IndexedDB. | documents |
| `review-data` | `RevisionDatos` | Acordeones dinámicos renderizados desde `revisionFields.ts`. Campos editables con Input. | formData |
| `loan-data` | `CreditoAsesor` | **Orquestador puro**. Hook `useCreditoAsesor` maneja estado y sincronización. 7 secciones en accordion. Cálculo simulado de tabla. | formData (asesorData, contactoData, antiguedadData, referencias, tabla) |
| `preview-contract` | `VistaPrevia` | Vista previa de datos, descarga mock, finalizar contrato y redirigir a historial. | formData, addContract |
| `history` | `HistorialPage` | Lista de contratos con búsqueda. Mock data en store. ContractCard por ítem. | history |

### Estructura Detallada: `loan-data`

```
features/loan-data/
├── CreditoAsesor.tsx        # Orquestador: 119 líneas, solo render
├── components/
│   ├── AccordionSection.tsx  # Sección plegable genérica con icono de completitud
│   ├── SelectField.tsx       # Select unificado para inputs de selección
│   ├── PrestamoSection.tsx   # Monto, plazo, botón calcular, resultado
│   ├── AsesorSection.tsx     # Folio, sucursal, vendedor, fechas, lugar, descuento
│   ├── ContactoSection.tsx   # Teléfonos, correo, estado civil
│   ├── AntiguedadSection.tsx # Fecha de ingreso, meses, años
│   ├── ReferenciasSection.tsx# 3 referencias (nombre + teléfono)
│   ├── SelectField.tsx       # Select unificado
│   └── index.ts
├── hooks/
│   └── useCreditoAsesor.ts   # Estado local + sync con store + validaciones
├── constants.ts              # ASESORES_REGISTRADOS, MESES, ESTADOS_CIVILES, PLAZOS_QNA
├── types.ts                  # Re-export desde @/types
└── index.ts
```

---

## Buenas Prácticas

1. **No mezclar lógica de negocio en componentes compartidos**
2. **Cada feature es autocontenida** (importa solo shared + store)
3. **Props explícitas** (no `any` en interfaces)
4. **Estados visuales**: loading, empty, error, success
5. **Mobile-first**: diseñar primero para pantalla pequeña
6. **Orquestadores puros**: El componente principal solo renderiza, la lógica va en hooks
7. **Selectores tipados**: Usar `useINEData()` en vez de `useContractStore(s => s.formData.ine)` directamente

---

[Volver a DOCS README](../README.md)
