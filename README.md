# PDF Filler — Plataforma de Contratos de Crédito

Aplicación web **mobile-first** desarrollada con **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4** y **Zustand** para gestionar el ciclo completo de contratos de crédito vía nómina: desde el escaneo inteligente de documentos con IA hasta el cálculo de crédito, vista previa del PDF, firma electrónica remota del cliente y aprobación en Mesa de Control.

[![CI Frontend](https://github.com/K4YZER4/PDF-FILLER-FRONTEND/actions/workflows/ci.yml/badge.svg)](https://github.com/K4YZER4/PDF-FILLER-FRONTEND/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-443E38)

> **Repositorio Backend:** [K4YZER4/portafolio-backend](https://github.com/K4YZER4/portafolio-backend/tree/main) (NestJS 11 + TypeScript + Prisma 7 + PostgreSQL + Gemini AI)

---

## Características Principales

- **Flujo guiado en 4 pasos** — Subida de documentos (INE, nóminas y estado de cuenta), revisión/edición de datos extraídos por IA, configuración del préstamo con calculadora en tiempo real y vista previa del contrato PDF.
- **Escaneo Multimodal Unificado** — Integración con el endpoint unificado de Gemini AI del backend, con soporte en modo demo para que el visitante ingrese su propia API key (`X-Gemini-Api-Key`) y persistencia temporal de archivos en IndexedDB.
- **Validación en Tiempo Real** — Campos especializados (`NameInput`, `NumericInput`, `DateInput`, `SelectField`) con validación de CURP, formatos de correo/teléfono, límites de longitud e indicadores visuales inmediatos de estado (borde rojo/verde).
- **Firma Electrónica Remota (`/firmar/:token`)** — Visor PDF seguro mediante proxy del backend, verificación opcional con código OTP de 6 dígitos y captura de firma manuscrita con `signature_pad`.
- **Historial y Mesa de Control** — Panel con filtros por fecha, asesor y búsqueda, seguimiento de estados (`POR FIRMAR`, `POR APROBAR`, `ACTIVO`, `RECHAZADO`) y flujo de aprobación/rechazo con motivo obligatorio para administradores.
- **Modo Demostración Pública** — Al finalizar un contrato se muestra un modal con el enlace de firma listo para copiar o abrir sin depender de un proveedor de correo externo.

---

## Stack Tecnológico

| Categoría | Tecnología |
| --- | --- |
| **UI & Lenguaje** | React 19, TypeScript |
| **Build Tool** | Vite 8 |
| **Estilos** | Tailwind CSS v4, Lucide React, Radix Alert Dialog |
| **Estado Global** | Zustand 5 + Immer + `persist` |
| **Formularios y Validación** | React Hook Form + Zod |
| **Routing & HTTP** | React Router v7, Axios (interceptors JWT + errores tipados) |
| **Firma y Persistencia Local** | `signature_pad`, IndexedDB (`fileStorage`) |
| **Testing** | Vitest + Testing Library |

---

## Estructura del Proyecto

```text
src/
├── api/                      # Servicios API (auth, scan, calculo, contracts)
├── app/                      # Entry point, estilos globales y routing
├── components/               # Componentes reutilizables
│   ├── ui/                   #   Design system (Button, Input, NameInput, NumericInput, DateInput, etc.)
│   └── feedback/             #   ErrorBoundary, EmptyState
├── constants/                # Configuración de campos de revisión
├── features/                 # Módulos por funcionalidad (autocontenidos)
│   ├── auth/                 #   Login + acceso demo
│   ├── upload-documents/     #   Subir INE, nóminas y estado de cuenta
│   ├── review-data/          #   Revisión de datos extraídos + validaciones
│   ├── loan-data/            #   Préstamo, asesor, contacto, antigüedad y referencias
│   ├── preview-contract/     #   Vista previa PDF + modal de enlace de firma
│   ├── signature/            #   Página pública de firma remota (/firmar/:token) + PdfViewer
│   └── history/              #   Historial de contratos y Mesa de Control
├── hooks/                    # Hooks compartidos (useApi, etc.)
├── layouts/                  # Layouts, stepper, footer y guards de paso
├── lib/                      # Infraestructura (axios, JWT, clases de error)
├── routes/                   # PrivateRoute, PublicRoute
├── store/                    # Zustand + persist + mockData + selectores
├── types/                    # Tipos de dominio, store y API
└── utils/                    # cn(), mapping de payload y fileStorage (IndexedDB)
```

---

## Rutas de la Aplicación

| Ruta | Acceso | Componente | Descripción |
| --- | --- | --- | --- |
| `/login` | Público | `LoginPage` | Inicio de sesión (con accesos demo) |
| `/` | Privado | `HistorialPage` | Historial de contratos y Mesa de Control |
| `/contracts/upload` | Privado | `SubirDocs` | Paso 1: Subida y escaneo de documentos |
| `/contracts/review` | Privado | `RevisionDatos` | Paso 2: Revisión y validación de datos |
| `/contracts/loan` | Privado | `CreditoAsesor` | Paso 3: Datos del préstamo y contacto |
| `/contracts/preview` | Privado | `VistaPrevia` | Paso 4: Vista previa PDF y generación de enlace |
| `/firmar/:token` | Público (token) | `FirmarPage` | Visor PDF y firma electrónica del cliente |

---

## Inicio Rápido

### Requisitos
- **Node.js 18+**
- Backend [portafolio-backend](https://github.com/K4YZER4/portafolio-backend/tree/main) en ejecución

### Instalación y Ejecución

```bash
git clone https://github.com/K4YZER4/PDF-FILLER-FRONTEND.git
cd PDF-FILLER-FRONTEND
npm install
npm run dev
```

### Variables de Entorno (`.env`)

```env
VITE_API_BASE=http://localhost:3000
VITE_DEMO_MODE=true
```

### Acceso de Demostración

| Rol | Correo | Contraseña |
| --- | --- | --- |
| **Asesor** | `juan@test.com` | `Demo1234!` |
| **Administrador** | `admin@test.com` | `Demo1234!` |

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Verificación de tipos (tsc) + build producción (vite)
npm run preview      # Vista previa del build
npm run test:run     # Ejecución de pruebas con Vitest
```

---

## Documentación Técnica

Toda la documentación detallada está organizada en [`docs/`](./docs/README.md):

| Documento | Descripción |
| --- | --- |
| [Índice General](./docs/README.md) | Mapa completo de documentación y módulos |
| [Arquitectura](./docs/architecture.md) | Estructura, tecnologías y flujo general |
| [Configuración](./docs/setup.md) | Instalación y variables de entorno |
| [Contratos de API](./docs/api/api.md) | Endpoints consumidos y estructuras DTO |
| [Conexión con Backend](./docs/api/backend-connection.md) | Axios, interceptors, JWT y manejo de errores |
| [Arquitectura de Features](./docs/architecture/features-architecture.md) | Diseño modular de pantallas y validaciones |
| [Arquitectura del Store](./docs/architecture/store-architecture.md) | Zustand, persistencia y selectores |
| [Estándares de Código](./docs/guides/coding-standards.md) | Convenciones TypeScript y React |
| [Guía de Contribución](./docs/contributing.md) | Flujo de trabajo, Git y Pull Requests |
