# PDF Filler Frontend

Aplicación web para la captura, escaneo OCR y generación de contratos PDF.  
Permite procesar identificación oficial (INE), nómina, estado de cuenta y generar contratos crediticios automáticamente.

---

## Tecnologías

- **React 19** – Interfaz de usuario moderna
- **TypeScript** – Tipado estático y mantenibilidad
- **Vite** – Bundler rápido y moderno
- **Tailwind CSS v4** – Estilos utilitarios
- **Zustand** – Manejo de estado global simple
- **React Hook Form + Zod** – Formularios validados
- **React Router v7** – Navegación por pestañas
- **Node.js + Express** – Backend API (OCR y generación PDF)

---

## Estructura del Proyecto

```
PDF-FILLER-FRONTEND/
├── src/
│   ├── components/        # Componentes reutilizables UI
│   │   ├── ui/          # Botones, Inputs, Select, etc.
│   │   ├── layout/      # Header, TabsNav, Footer
│   │   ├── forms/       # FormField, CurrencyInput, etc.
│   │   └── feedback/   # Toast, ScanStatus, etc.
│   ├── features/         # Módulos principales (INE, Nómina, Crédito)
│   ├── store/            # Estado global (Zustand)
│   ├── services/         # Llamadas a API
│   ├── types/           # Tipos e interfaces TypeScript
│   ├── utils/           # Funciones auxiliares
│   ├── hooks/           # Custom hooks
│   └── assets/          # Imágenes y recursos
├── docs/                # Documentación del proyecto
├── public/              # Archivos públicos
└── index.html           # Entrada HTML
```

---

## Documentación

Este proyecto sigue un flujo de trabajo y reglas claras para facilitar el trabajo en equipo y mantener la calidad del código.

### Getting Started
- **[Setup para desarrolladores](./docs/setup/DEVELOPMENT_SETUP.md)** - Instalación y configuración inicial
- **[Guía de Contribución](./docs/CONTRIBUTING.md)** - Cómo contribuir al proyecto

### Gestión del Proyecto
- **[Flujo de Trabajo del Equipo](./docs/team/TEAM_WORKFLOW.md)** - Coordinación (2 frontend + 2 backend)
- **[Documentación de API](./docs/api/API.md)** - Contratos entre frontend y backend
- **[Dependencias del proyecto](./docs/DEPENDENCIES.md)** - Gestión de librerías

### Arquitectura
- **[Estructura del proyecto](./docs/ARCHITECTURE.md)** - Organización de carpetas
- **[Arquitectura de Componentes](./docs/architecture/COMPONENTS_ARCHITECTURE.md)** - Estructura UI
- **[Estándares de Código](./docs/guides/CODING_STANDARDS.md)** - Reglas de desarrollo

### Paleta de Colores
- **Primary:** `#5b2d8e` (Morado/Púrpura)
- **Error/Warning:** `#efc12c` (Amarillo)
- **Success:** `#16a34a` (Verde)
- **White:** `#ffffff` (Blanco)

### Git y Colaboración
- **[GitHub Flow](./docs/workflows/GIT_WORKFLOW.md)** - Flujo de trabajo con Git
- **[Guía de Pull Requests](./docs/workflows/PULL_REQUESTS.md)** - Cómo crear y revisar PRs

---

## Equipo de Desarrollo

| Rol | Persona | Responsabilidades |
|-----|---------|-------------------|
| **Frontend Lead** | Dev 1 | - Arquitectura del frontend<br>- Coordinación de UI/UX<br>- Revisión de PRs frontend |
| **Backend Lead** | Dev 2 | - Arquitectura del backend<br>- Diseño de API REST<br>- Base de datos y servicios OCR |
| **Frontend Dev** | Dev 3 | - Implementación de pantallas<br>- Componentes UI<br>- Testing de componentes |
| **Backend Dev** | Dev 4 | - Endpoints API<br>- Servicios de OCR<br>- Testing de integración |

---

## Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo (Vite)
npm run build        # Build de producción
npm run preview      # Preview del build
npx tsc --noEmit   # Verificación de tipos TypeScript
```

---

## Requisitos

- **Node.js** 18+ 
- **npm** 9+
- **Navegador moderno** (Chrome, Firefox, Edge)
- **Conexión a Internet** (para servicios de OCR)

---

> **Nota:** Este proyecto está optimizado para escritorio (no móvil).  
> La generación de PDFs requiere el backend API ejecutándose en `localhost:3000`.
