# Arquitectura de Componentes – PDF Filler

Este documento describe cómo se estructuran y organizan los componentes en PDF Filler.

---

## Principios de Diseño

### 1. Una Sola Responsabilidad
Cada componente debe tener un propósito claro y específico:
- `Button` → Solo renderiza un botón
- `Input` → Solo maneja entrada de datos
- `FormField` → Solo envuelve un campo con etiqueta y error

### 2. Reutilización
- Los componentes UI van en `src/components/ui/`
- Se exportan mediante `index.ts`
- Deben ser agnósticos al dominio del negocio

### 3. Separación de Responsabilidades
- **Presentación:** Componentes en `components/`
- **Lógica:** Hooks en `hooks/`
- **Datos:** Store en `store/`
- **API:** Servicios en `services/`

---

## Tipos de Componentes

### Componentes UI (src/components/ui/)

Componentes atómicos reutilizables:

| Componente | Propósito | Props principales |
|-----------|-----------|-------------------|
| `Button` | Botón con variantes | `variant`, `size`, `loading`, `onClick` |
| `Input` | Campo de texto | `id`, `type`, `error`, `...register` |
| `Select` | Selección dropdown | `id`, `options`, `error` |
| `Badge` | Etiquetas de estado | `status`, `children` |
| `Spinner` | Indicador de carga | `size`, `className` |
| `Card` | Contenedor con título | `title`, `children` |

### Componentes de Layout (src/components/layout/)

Estructura de la aplicación:

| Componente | Propósito | Ubicación |
|-----------|-----------|------------|
| `Header` | Encabezado con logo | Arriba de todo |
| `TabsNav` | Navegación por pestañas | Entre Header y contenido |
| `FooterBar` | Pie de página | Abajo de todo |
| `Card` | Tarjetas de secciones | Contenedor de formularios |

### Componentes de Formularios (src/components/forms/)

Campos especializados:

| Componente | Propósito | Validación |
|-----------|-----------|------------|
| `FormField` | Wrapper de campo con error | Genérico |
| `CurrencyInput` | Entrada de moneda | Formato MXN |
| `CURPInput` | Validación de CURP | 18 caracteres |
| `CLABEInput` | Validación de CLABE | 18 dígitos |
| `PhoneInput` | Teléfono mexicano | 10 dígitos |
| `DateInput` | Fechas | Formato AAAA-MM-DD |

### Componentes de Feedback (src/components/feedback/)

Notificaciones y estados:

| Componente | Propósito | Uso |
|-----------|-----------|-----|
| `Toast` | Notificaciones temporales | Éxito, error, info |
| `ScanStatusBadge` | Estado de escaneo | pending/scanning/ok |
| `AutofillBadge` | Indicador de autollenado | OCR completado |

---

## Estilos y Tailwind CSS

### Clases Utilitarias
Se usa **Tailwind CSS v4** para todos los estilos:

```tsx
// ✅ Correcto: Usar Tailwind
<button className="px-4 py-2 bg-teal-800 text-white rounded-md hover:bg-teal-900">
  Guardar
</button>

// ❌ Incorrecto: Estilos inline o CSS separado
<button style={{ padding: '8px 16px' }}>
```

### Colores Principales
Definidos en `index.css` con `@theme`:

| Variable | Color | Uso |
|-----------|-------|-----|
| `--color-primary` | `#01696f` | Botones primarios, acentos |
| `--color-primary-hover` | `#0c4e54` | Hover de primario |
| `--color-error` | `#dc2626` | Errores |
| `--color-success` | `#16a34a` | Éxito |
| `--color-warning` | `#d97706` | Advertencias |

---

## Documentación de Componentes (JSDoc)

Todo componente debe estar documentado en español:

```tsx
/**
 * Componente: Button
 * Propósito: Botón reutilizable con múltiples variantes.
 * Props: variant, size, loading, onClick, children.
 */
```

---

## Ejemplo de Estructura de Componente

```tsx
// Archivo: components/ui/Button.tsx

/**
 * Componente: Button
 * Propósito: Botón reutilizable con múltiples variantes.
 * Props: variant, size, loading, onClick, children.
 */
export function Button({ variant = "primary", size = "md", loading, onClick, children, ...props }: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-all cursor-pointer disabled:opacity-50"
  
  const variants = {
    primary: "bg-teal-800 text-white hover:bg-teal-900",
    secondary: "bg-stone-100 text-stone-700 hover:bg-stone-200",
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]}`}
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  )
}
```

---

## Barrel Exports (index.ts)

Cada carpeta debe tener un `index.ts` para limpieza de imports:

```tsx
// components/ui/index.ts
export { Button } from "./Button"
export { Input } from "./Input"
export { Select } from "./Select"
// ...

// Uso en otro archivo:
import { Button, Input, Select } from "@/components"
```

---

## Rendimiento

### Optimización de Componentes
- Usar `React.memo` para componentes pesados que reciben props complejas
- Usar `useMemo` para cálculos costosos
- Usar `useCallback` para funciones pasadas como props

```tsx
export const HeavyComponent = React.memo(function HeavyComponent({ data }) {
  const processed = useMemo(() => expensiveCalculation(data), [data])
  return <div>{processed}</div>
})
```

---

[Volver a FOLDER_STRUCTURE](./FOLDER_STRUCTURE.md)
