# Estructura del proyecto – PDF Filler

El proyecto utiliza **React Router v7** y mantiene una separación estricta entre  
**navegación**, **presentación** y **lógica de negocio**.

```
PDF-FILLER-FRONTEND/
├── src/                          # Código fuente principal
│   ├── components/               # Componentes reutilizables
│   │   ├── ui/                  # Botones, Inputs, Select, Badge, Spinner
│   │   ├── layout/              # Header, TabsNav, FooterBar, Card
│   │   ├── forms/               # FormField, CurrencyInput, CURPInput, etc.
│   │   └── feedback/            # Toast, ScanStatus, AutofillBadge
│   │
│   ├── features/                # Módulos principales (pestañas)
│   │   ├── ine/                 # Pantalla INE + OCR
│   │   ├── nomina/              # Pantalla Nómina + Estado Cuenta
│   │   └── credito/            # Pantalla Crédito + Generación PDF
│   │
│   ├── store/                   # Estado global (Zustand)
│   │   └── useContractStore.ts   # Store principal del contrato
│   │
│   ├── services/                # Llamadas a API
│   │   ├── api.ts               # Configuración base de API
│   │   ├── ine.service.ts       # Servicios de escaneo INE
│   │   ├── nomina.service.ts    # Servicios de nómina
│   │   └── credito.service.ts  # Servicios de cálculo y PDF
│   │
│   ├── types/                   # Tipos e interfaces TypeScript
│   │   ├── index.ts             # Barrel de tipos
│   │   ├── ine.types.ts
│   │   ├── nomina.types.ts
│   │   ├── tabla.types.ts
│   │   ├── extra.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/                   # Funciones auxiliares
│   │   ├── formatters.ts        # Formateo de moneda, fechas, etc.
│   │   ├── validators.ts        # Validadores de CURP, CLABE, etc.
│   │   └── helpers.ts           # Utilidades generales
│   │
│   ├── hooks/                   # Custom hooks
│   │   └── useToast.ts          # Hook para notificaciones
│   │
│   ├── assets/                  # Recursos estáticos
│   └── index.css                # Estilos globales + Tailwind
│
├── docs/                         # Documentación del proyecto
│   ├── setup/                   # Guías de instalación
│   ├── team/                    # Gestión del equipo
│   ├── architecture/            # Arquitectura y estructura
│   ├── workflows/              # Git y PRs
│   ├── guides/                 # Estándares de código
│   ├── api/                    # Contratos de API
│   └── troubleshooting/         # Solución de problemas
│
├── public/                       # Archivos públicos
├── index.html                   # Entrada HTML
├── package.json                 # Dependencias y scripts
├── tsconfig.json                # Configuración TypeScript
├── vite.config.ts              # Configuración Vite
├── tailwind.config.ts           # Configuración Tailwind (si aplica)
├── .env.example                # Ejemplo variables entorno
└── README.md                   # Documentación principal
```

> **Nota:** Los archivos `.env` no se versionan.  
> Cada desarrollador debe crear su propio `.env` basado en `.env.example`.

---

## Responsabilidad de carpetas

### src/components/
- Componentes reutilizables de UI
- Separados por propósito: `ui/`, `layout/`, `forms/`, `feedback/`
- Cada componente debe tener una sola responsabilidad
- Deben estar documentados con JSDoc en español

### src/features/
- Pantallas principales (pestañas)
- Cada feature maneja su propia lógica, esquemas y componentes
- Se comunican con el store global y servicios API

### src/store/
- Estado global de la aplicación (Zustand)
- Centraliza datos del contrato: INE, nómina, crédito
- Provee acciones para actualizar el estado

### src/services/
- Llamadas a APIs externas
- Manejo de respuestas y errores
- No contienen lógica de UI

### src/types/
- Definición de tipos TypeScript
- Interfaces para datos, respuestas API, etc.
- Barrel `index.ts` para exportaciones limpias

### src/utils/
- Funciones auxiliares puras
- Formateo, validación, cálculos
- Sin efectos secundarios

### src/hooks/
- Custom hooks de React
- Nombres deben iniciar con `use`
- Manejo de lógica reutilizable

---

## Reglas para pantallas (features)

- Cada pantalla debe enfocarse solo en la presentación y flujo
- Las pantallas NO deben:
  - Manejar lógica compleja directamente
  - Contener más de una responsabilidad
  - Hacer llamadas directas a servicios (usar hooks o store)

- La lógica debe extraerse a:
  - hooks
  - services
  - store

---

## Convenciones de nombres

| Elemento    | Convención        | Ejemplo              |
|-----------|-------------------|----------------------|
| Componentes | PascalCase        | `Button.tsx`         |
| Hooks       | useSomething      | `useContract.ts`      |
| Servicios   | xxx.service.ts   | `ine.service.ts`     |
| Store       | xxx.store.ts     | `contract.store.ts`   |
| Tipos       | PascalCase        | `INEData.ts`         |
| Utilidades  | camelCase         | `formatCurrency.ts`   |
| Esquemas    | xxx.schema.ts    | `credito.schema.ts`  |

---

## Imports y Alias

Usar alias definidos en `tsconfig.json`:

```ts
// ❌ No usar rutas relativas largas
import Button from "../../../components/ui/Button"

// ✅ Usar alias
import { Button } from "@/components"
import { useContractStore } from "@/store/useContractStore"
import type { INEData } from "@/types"
```

---

## Documentación (JSDoc)

Todo archivo debe tener documentación en español:

```typescript
/**
 * Archivo: components/ui/Button.tsx
 * Propósito: Botón reutilizable con múltiples variantes.
 * Props: variant, size, loading, children.
 */
```

---

- **[Volver a CONTRIBUTING](../CONTRIBUTING.md)**
- **[Arquitectura de Componentes y Estilos](./COMPONENTS_ARCHITECTURE.md)**
