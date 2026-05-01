# Arquitectura del Proyecto PDF-FILLER-FRONTEND

## Descripción General

Esta es una aplicación frontend para **CREDIFOM, S.A.P.I. de C.V.** que permite generar contratos de crédito de manera automatizada mediante:

1. **Subida y escaneo OCR** de documentos (INE, nóminas, estado de cuenta)
2. **Captura y validación** de datos personales, laborales y bancarios
3. **Cálculo de tabla crediticia** (montos, descuentos, intereses)
4. **Generación de contrato PDF** con todos los datos recolectados

## Stack Tecnológico

- **Framework**: React 19 con TypeScript
- **Build Tool**: Vite 8
- **Estilos**: Tailwind CSS v4
- **State Management**: Zustand 5
- **Formularios**: React Hook Form 7 + Zod 4
- **Testing**: Vitest 4 + React Testing Library

## Estructura de Carpetas

```
PDF-FILLER-FRONTEND/
├── src/
│   ├── main.tsx                 # Entrada de React
│   ├── App.tsx                 # Componente raíz (tabs, tema, toasts)
│   ├── index.css               # Estilos globales y variables de tema
│   │
│   ├── types/                 # Definiciones de tipos TypeScript
│   │   ├── index.ts            # Barrel export
│   │   ├── ine.types.ts       # Tipos para INE
│   │   ├── nomina.types.ts    # Tipos para nómina y banco
│   │   ├── tabla.types.ts     # Tipos para tabla de crédito
│   │   ├── extra.types.ts     # Tipos para datos adicionales
│   │   └── api.types.ts       # Tipos para API y respuestas
│   │
│   ├── store/                 # Estado global (Zustand)
│   │   └── useContractStore.ts
│   │
│   ├── services/              # Capa de servicios API
│   │   ├── index.ts           # Barrel export
│   │   ├── api.client.ts      # Cliente HTTP base
│   │   ├── ine.service.ts     # Escaneo de INE
│   │   ├── nomina.service.ts  # Escaneo de nómina y estado de cuenta
│   │   └── credito.service.ts # Cálculos y generación PDF
│   │
│   ├── utils/                 # Utilidades
│   │   ├── index.ts           # Barrel export
│   │   ├── validation.ts      # Validadores (CURP, CLABE, tel)
│   │   ├── format.ts          # Formateo (moneda, %, descarga)
│   │   └── date.ts            # Manejo de fechas
│   │
│   ├── hooks/                 # Custom hooks
│   │   └── useToast.ts        # Hook para notificaciones toast
│   │
│   ├── components/           # Componentes reutilizables
│   │   ├── index.ts           # Barrel export
│   │   ├── ui/               # Componentes UI base
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── index.ts
│   │   ├── layout/           # Componentes de estructura
│   │   │   ├── Header.tsx
│   │   │   ├── TabsNav.tsx
│   │   │   ├── FooterBar.tsx
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   ├── forms/            # Componentes de formulario
│   │   │   ├── FormField.tsx
│   │   │   ├── CurrencyInput.tsx
│   │   │   ├── CURPInput.tsx
│   │   │   ├── CLABEInput.tsx
│   │   │   ├── PhoneInput.tsx
│   │   │   ├── DateInput.tsx
│   │   │   └── index.ts
│   │   ├── upload/           # Componentes de carga
│   │   │   ├── UploadArea.tsx
│   │   │   ├── ImagePreview.tsx
│   │   │   └── index.ts
│   │   └── feedback/        # Componentes de retroalimentación
│   │       ├── Toast.tsx
│   │       ├── ScanStatus.tsx
│   │       ├── AutofillBadge.tsx
│   │       └── index.ts
│   │
│   └── features/             # Pantallas por característica
│       ├── ine/               # Tab 1: Datos INE
│       │   ├── index.ts
│       │   ├── IneScreen.tsx
│       │   └── ine.schema.ts
│       ├── nomina/            # Tab 2: Nómina y Cuenta
│       │   ├── index.ts
│       │   ├── NominaScreen.tsx
│       │   └── nomina.schema.ts
│       └── credito/           # Tab 3: Crédito y Extras
│           ├── index.ts
│           ├── CreditoScreen.tsx
│           └── credito.schema.ts
│
├── docs/                      # Documentación adicional
├── public/                    # Archivos públicos
├── index.html                # HTML de entrada
├── package.json              # Dependencias
├── vite.config.ts            # Configuración de Vite
├── tsconfig.json             # Configuración de TypeScript
└── .env                      # Variables de entorno
```

## Flujo de la Aplicación

```
1. Usuario entra a la aplicación
   ↓
2. Tab 1: Sube foto de INE → Escanea con OCR → Llena datos personales
   ↓
3. Tab 2: Sube nóminas y estado de cuenta → Escanea → Llena datos laborales/banco
   ↓
4. Tab 3: Captura monto y plazo → Calcula tabla → Ingresa datos asesor/referencias
   ↓
5. Genera contrato PDF → Se descarga automáticamente
```

## Comunicación con el Backend

La aplicación se comunica con un backend API (por defecto en `http://localhost:3000`) a través de:

- **POST /api/ine/escanear-ine** - Escanea la INE
- **POST /api/escanear-nomina** - Escanea recibos de nómina
- **POST /api/escanear-estado-cuenta** - Escanea estado de cuenta
- **POST /api/monto/filtrar-tabla** - Calcula tabla crediticia
- **POST /api/pdf/rellenar-pdf** - Genera el contrato PDF

## Características Principales

- ✅ Tema claro/oscuro
- ✅ Soporte para drag-and-drop de archivos
- ✅ Validación en tiempo real con Zod
- ✅ Autollenado de campos mediante OCR
- ✅ Indicadores visuales de estado (badges, scan status)
- ✅ Notificaciones toast
- ✅ Cálculo automático de antigüedad laboral
- ✅ Formateo de moneda y porcentajes
