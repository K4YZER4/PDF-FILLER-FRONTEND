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
- **UI/Design System**: `components/ui/` (Button, Input, Badge, NameInput, NumericInput, DateInput, alert-dialog)
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
| `Input` | `label?`, `error?`, `required`, `type: text/password/email/number`, `placeholder` | Input con label, mensaje de error, toggle de visibilidad para password |
| `NameInput` | `onChange(value)`, `maxLength?` | Solo letras + mayúsculas automáticas (nombres, ciudades). Movido desde `features/review-data/` |
| `NumericInput` | `onChange(value)`, `maxLength?` | Solo dígitos (CP, teléfono, cuenta). Movido desde `features/review-data/` |
| `DateInput` | `onChange(isoValue)` | Calendario nativo, rango 1935 a hoy-18. Movido desde `features/review-data/` |
| `Badge` | `variant: success/warning/error/info` | Etiqueta de estado con colores semánticos |
| `alert-dialog` | — | Modal accesible vía `@radix-ui/react-alert-dialog`, usado para confirmación al salir del flujo |

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

### ContractLayout (~167 líneas)
- Stepper visual con 4 pasos: Documentos → Datos → Crédito → Vista previa
- Navegación basada en URL (`/contracts/upload`, `/contracts/review`, etc.)
- Botones Siguiente/Volver renderizados por `ContractFooter`
- Validación por paso delegada a `useStepValidation` hook
- ScanOverlay, FinishToast, FloatingShareButton como componentes independientes
- Modal de confirmación al salir vía `AlertDialog` de `components/ui/`
- Usa `<Outlet />` envuelto en `<ErrorBoundary>`

**Nota:** La lógica extraída redujo ContractLayout de ~529 a ~167 líneas.

### Componentes del Layout (`layouts/components/`)
| Componente | Descripción | Extraído de |
|-----------|-------------|-------------|
| `ContractStepper` | Stepper horizontal con íconos, labels y estado activo/completado | — |
| `ContractFooter` | Botones dinámicos según paso: Subir, Siguiente, Volver, Cancelar, Descargar, Finalizar | ContractLayout |
| `ScanOverlay` | Modal con barra de progreso del escaneo de documentos | ContractLayout |
| `FinishToast` | Notificación "Contrato generado" con auto-dismiss | ContractLayout |
| `FloatingShareButton` | FAB de compartir en móvil (solo paso 4) | ContractLayout |
| `ExitModal` | Modal de confirmación al salir del flujo | — |

### Hooks del Layout (`layouts/hooks/`)
| Hook | Descripción | Extraído de |
|------|-------------|-------------|
| `useStepValidation` | Valida el paso actual: upload (archivos + scan), review (todas las secciones completas), loan (todas las secciones completas vía loan-data validators) | ContractLayout |
| `useShareContract` | Web Share API en móvil, clipboard en desktop. Retorna `{ share, isSupported }` | ContractLayout |

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
├── CreditoAsesor.tsx        # Orquestador: ~112 líneas, solo render
├── components/
│   ├── AccordionSection.tsx  # Sección plegable genérica con icono de completitud
│   ├── SelectField.tsx       # Select unificado para inputs de selección
│   ├── PrestamoSection.tsx   # Monto, plazo, botón calcular, resultado
│   ├── AsesorSection.tsx     # Folio, sucursal, vendedor, fechas, lugar, descuento
│   ├── ContactoSection.tsx   # Teléfonos, correo, estado civil
│   ├── AntiguedadSection.tsx # Fecha de ingreso, meses, años
│   ├── ReferenciasSection.tsx# 3 referencias (nombre + teléfono)
│   └── index.ts
├── hooks/
│   └── useCreditoAsesor.ts   # Estado local + sync con store + validaciones
├── utils/
│   └── validation.ts         # Validadores compartidos con useStepValidation
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
