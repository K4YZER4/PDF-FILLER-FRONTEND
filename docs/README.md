# Documentación del Proyecto PDF-FILLER-FRONTEND

## Índice de Documentos

1. [Arquitectura del Proyecto](./ARCHITECTURE.md) — Estructura, tecnologías y flujo
2. [Guía de Configuración](./SETUP.md) — Instalación y variables de entorno
3. [Arquitectura de Componentes](./architecture/COMPONENTS_ARCHITECTURE.md)
4. [Convenciones de Código](./guides/CODING_STANDARDS.md)
5. [Dependencias del Proyecto](./DEPENDENCIES.md)
6. [Git Workflow](./workflows/GIT_WORKFLOW.md)
7. [Pull Requests](./workflows/PULL_REQUESTS.md)
8. [Team Workflow](./team/TEAM_WORKFLOW.md)
9. [Solución de Problemas](./troubleshooting/index.md)
10. [API Contracts](./api/API.md)

## Resumen de Documentación en Código

Todos los archivos de código han sido documentados con comentarios explicando:

- **Propósito de cada archivo**
- **Qué hace cada sección/componente**
- **Qué hacen las funciones principales**
- **Tipos de datos y sus campos**

### Archivos Principales
- `src/main.tsx` - Punto de entrada de React
- `src/app/App.tsx` - Componente raíz con routing
- `src/app/index.css` - Estilos globales y tema CREDIFOM

### Tipos (`types/`)
- `src/types/index.ts` - Definición de interfaces: INEData, NominaData, EstadoCuentaData, TablaCreditoData

### Estado Global (`store/`)
- `src/store/useContractStore.ts` - Store Zustand con slices: auth, step, documents, formData, history

### Componentes Compartidos (`shared/components/`)
- Button, Input, Card, Badge, Spinner — documentados con props y comportamiento

### Features
- `src/features/auth/` - LoginPage
- `src/features/upload-documents/` - SubirDocs (subida de INE, nóminas, estado de cuenta)
- `src/features/review-data/` - RevisionDatos (acordeones editables)
- `src/features/loan-data/` - CreditoAsesor (cálculo de crédito)
- `src/features/preview-contract/` - VistaPrevia (vista previa y descarga)
- `src/features/history/` - HistorialPage (lista de contratos)

### Layouts
- `src/layouts/AuthLayout.tsx` - Fondo centrado para login
- `src/layouts/AppLayout.tsx` - Header + contenido
- `src/layouts/ContractLayout.tsx` - Stepper de 4 pasos

## Cómo Usar Esta Documentación

1. **Para entender un archivo**: Lee los comentarios al inicio de cada archivo
2. **Para entender funciones**: Lee los comentarios antes de cada función
3. **Para entender componentes**: Revisa las interfaces de props
4. **Para configuración general**: Lee los archivos en la carpeta `docs/`

---

[Volver a CONTRIBUTING](./CONTRIBUTING.md)
