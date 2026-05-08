# Arquitectura de Componentes

---

## Principios de Diseño

### 1. Una Sola Responsabilidad
- `Button` → Solo renderiza un botón
- `Input` → Solo maneja entrada de datos
- `Card` → Solo es un contenedor visual

### 2. Reutilización
- Componentes compartidos en `shared/components/`
- Agnósticos al dominio del negocio
- Props genéricas, sin lógica de negocio

### 3. Separación
- **UI**: `shared/components/` (Button, Input, Card, Badge, Spinner)
- **Layout**: `layouts/` (AuthLayout, AppLayout, ContractLayout)
- **Lógica**: Cada feature maneja su estado con hooks locales
- **Datos**: `store/useContractStore` (Zustand)

---

## Componentes Compartidos (`shared/components/`)

| Componente | Props | Descripción |
|-----------|-------|-------------|
| `Button` | `variant`, `size`, `loading` | Botón con estados |
| `Input` | `error?`, atributos HTML input | Input con mensaje de error |
| `Card` | `className?`, `children` | Contenedor con bordes redondeados y sombra |
| `Badge` | `variant: success/warning/error/info` | Etiqueta de estado |
| `Spinner` | `size: sm/md/lg` | Loader animado |

### Patrón de exportación
```tsx
// shared/components/Button.tsx
export { Button }
export type { ButtonProps }

// shared/components/index.ts
export { Button } from "./Button"
export type { ButtonProps } from "./Button"
```

---

## Layouts

| Layout | Ubicación | Propósito |
|--------|-----------|-----------|
| `AuthLayout` | `layouts/AuthLayout.tsx` | Fondo centrado para login |
| `AppLayout` | `layouts/AppLayout.tsx` | Header + contenido (historial) |
| `ContractLayout` | `layouts/ContractLayout.tsx` | Stepper 4 pasos con navegación |

### ContractLayout
- Stepper visual con 4 pasos: Documentos → Datos → Crédito → Vista previa
- Navegación basada en URL (`/contracts/upload`, `/contracts/review`, etc.)
- Botones Siguiente/Volver con validación por paso
- Usa `<Outlet />` de React Router para renderizar el contenido

---

## Features

Cada feature es una carpeta independiente con:
```
feature-name/
├── Componente.tsx     # Lógica + UI
└── index.ts           # Barrel export
```

| Feature | Componente | Estado local | Store global |
|---------|-----------|-------------|--------------|
| `auth` | `LoginPage` | email, password, error | auth |
| `upload-documents` | `SubirDocs` | scanResults[], isScanning | documents |
| `review-data` | `RevisionDatos` | expandedSection | formData |
| `loan-data` | `CreditoAsesor` | monto, plazo, resultado | formData.tabla |
| `preview-contract` | `VistaPrevia` | showToast | formData |
| `history` | `HistorialPage` | search | history |

---

## Buenas Prácticas

1. **No mezclar lógica de negocio en componentes compartidos**
2. **Cada feature es autocontenida** (importa solo shared + store)
3. **Props explícitas** (no `any` en interfaces)
4. **Estados visuales**: loading, empty, error, success
5. **Mobile-first**: diseñar primero para pantalla pequeña

---

[Volver a CONTRIBUTING](../CONTRIBUTING.md)
