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
├── api/                      # Servicios API (preparados para backend)
├── app/                      # Entry point + estilos globales + routing
├── components/               # Componentes reutilizables
│   ├── ui/                   #   Design system (Button, Input, NameInput, etc.)
│   └── feedback/             #   ErrorBoundary, EmptyState
├── constants/                # Configuración de campos de revisión
├── features/                 # Módulos por funcionalidad (autocontenidos)
│   ├── auth/                 #   Login
│   ├── upload-documents/     #   Subir INE, nóminas, estado de cuenta
│   ├── review-data/          #   Revisar datos + utils de validación
│   ├── loan-data/            #   Crédito + utils de validación compartidos
│   ├── preview-contract/     #   Vista previa del contrato
│   └── history/              #   Historial con filtros
├── hooks/                    # Hook genérico useApi
├── layouts/                  # Layouts + componentes extraídos
│   ├── components/           #   ContractStepper, ContractFooter, ScanOverlay, etc.
│   └── hooks/                #   useStepValidation, useShareContract
├── lib/                      # Infraestructura (axios, JWT, errores)
├── routes/                   # PrivateRoute, PublicRoute
├── store/                    # Zustand + persist + mockData + selectores
├── types/                    # Tipos de dominio + store + API
├── utils/                    # cn() + fileStorage (IndexedDB)
└── main.tsx
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
