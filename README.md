# CREDIFOM - Generador de Contratos

Aplicación web para la generación de contratos de préstamo.  
Diseñada **mobile-first** para uso en celulares y tablets, con soporte desktop.

---

## Tecnologías

- **React 19** + **TypeScript** – UI moderna y tipada
- **Vite 8** – Build rápido
- **Tailwind CSS v4** – Estilos utilitarios
- **Zustand 5** + **Immer** – Estado global simple e inmutable
- **React Router v7** – Navegación por rutas
- **Lucide React** – Iconos

---

## Estructura del Proyecto

```
src/
├── app/                      # Entry point y estilos globales
│   ├── App.tsx               # Routing principal
│   └── index.css             # Tema CREDIFOM
├── features/                 # Módulos por funcionalidad
│   ├── auth/                 # Login
│   ├── upload-documents/     # Subir INE, nóminas, estado de cuenta
│   ├── review-data/          # Revisar datos personales, laborales, bancarios
│   ├── loan-data/            # Cálculo de crédito (monto, plazo)
│   ├── preview-contract/     # Vista previa y descarga del contrato
│   └── history/              # Historial de contratos generados
├── layouts/                  # Layouts reutilizables
│   ├── AuthLayout.tsx        # Layout público (login)
│   ├── AppLayout.tsx         # Layout principal con header
│   └── ContractLayout.tsx    # Stepper de 4 pasos
├── routes/                   # Protección de rutas
│   ├── PrivateRoute.tsx
│   └── PublicRoute.tsx
├── shared/components/        # UI components reutilizables
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   └── Spinner.tsx
├── store/                    # Estado global (Zustand + immer)
│   └── useContractStore.ts
├── types/                    # Tipos TypeScript
│   └── index.ts
└── main.tsx                  # Entry point
```

---

## Routing

| Ruta | Layout | Componente |
|------|--------|------------|
| `/login` | AuthLayout | LoginPage |
| `/` | AppLayout | HistorialPage |
| `/contracts/upload` | ContractLayout | SubirDocs |
| `/contracts/review` | ContractLayout | RevisionDatos |
| `/contracts/loan` | ContractLayout | CreditoAsesor |
| `/contracts/preview` | ContractLayout | VistaPrevia |

---

## Flujo de la Aplicación

```
Login → Historial → Nuevo Contrato
                        │
                        ▼
               Subir documentos (paso 1)
               INE, Nómina 1, Nómina 2, Estado de cuenta
                        │
                        ▼
               Revisar datos (paso 2)
               Personales · Domicilio · Laborales · Bancarios
                        │
                        ▼
               Datos del préstamo (paso 3)
               Monto · Plazo · Cálculo · Resumen
                        │
                        ▼
               Vista previa (paso 4)
               Descargar · Editar · Finalizar
```

---

## Paleta de Colores CREDIFOM

| Variable | Color | Uso |
|----------|-------|-----|
| `primary` | `#5b2d90` | Botones, acentos |
| `primary-hover` | `#6d3fb3` | Hover |
| `primary-tint` | `#f3eefa` | Fondos suaves |
| `brand` | `#f4b400` | Amarillo corporativo |
| `success` | `#16a34a` | Éxito |
| `error` | `#dc2626` | Error |
| `warning` | `#f59e0b` | Advertencia |
| `bg` | `#f8fafc` | Fondo general |
| `surface` | `#ffffff` | Tarjetas |
| `text-primary` | `#0f172a` | Texto principal |
| `text-secondary` | `#64748b` | Texto secundario |
| `border` | `#e2e8f0` | Bordes |

---

## Scripts

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build producción (tsc + vite)
npm run preview      # Preview del build
npm run lint         # Linter
```

---

## Requisitos

- **Node.js** 18+
- **Navegador moderno** (Chrome, Firefox, Edge, Safari)
- Diseñado **mobile-first** (celular → tablet → desktop)
