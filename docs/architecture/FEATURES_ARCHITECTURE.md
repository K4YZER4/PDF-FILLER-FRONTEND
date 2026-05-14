# Arquitectura de Features

Este documento detalla la arquitectura interna de cada feature, incluyendo la estructura de archivos, el flujo de datos y las responsabilidades.

---

## Principios Generales

1. **Cada feature es autocontenida**: Importa solo de `shared/`, `store/`, `types/` y `lib/`
2. **Orquestadores puros**: El componente principal solo renderiza; la lógica va en hooks
3. **No hay imports directos entre features**: Si dos features necesitan compartir algo, va en `src/types/`, `src/store/` o `src/lib/`
4. **Documentación JSDoc**: Cada archivo tiene un comentario al inicio explicando su propósito

---

## Auth

```
features/auth/
├── components/
│   ├── Toggle.tsx        # Switch personalizado (recordar sesión)
│   └── index.ts
├── LoginPage.tsx         # Página de login completa
└── index.ts
```

### Flujo

```
LoginPage
  → react-hook-form + zod validation
  → Busca en MOCK_USERS (email + password)
  → store.login(user, role)
  → navigate("/")
```

### Estados
- **Formulario**: Email + Password con validación en tiempo real
- **Loading**: `isSubmitting` de react-hook-form (Button muestra spinner)
- **Error**: `serverError` para credenciales incorrectas (banner rojo)
- **Éxito**: Redirección a `/`

### Próximos Pasos (backend real)
Reemplazar `MOCK_USERS` por:
```typescript
const { data } = await api.post("/api/auth/login", { email, password })
setToken(data.token)
store.login(data.user.email, data.user.role)
```

---

## Upload Documents

```
features/upload-documents/
├── SubirDocs.tsx
└── index.ts
```

### Flujo

```
SubirDocs
  → Drag & drop o input file para 4 documentos (INE, nómina 1 y 2, edo. cuenta)
  → store.setDocument(key, file) → guarda en store + IndexedDB
  → Botón "Leer documentos" → store.scanDocuments()
    → Simula OCR con setTimeout + Math.random()
    → Muestra overlay con progreso por documento
  → Al completar: scanStatus = "done" → se habilita "Siguiente"
```

### Persistencia
- Los archivos se guardan en **IndexedDB** via `utils/fileStorage.ts` (no localStorage)
- Al recargar la página, `SubirDocs` llama a `restoreDocuments()` para recuperarlos

### Próximos Pasos (backend real)
Reemplazar `scanDocuments()` simulado por llamadas API reales:
```typescript
// Por cada documento:
const formData = new FormData()
formData.append("file", file)
const { data } = await api.post("/scan/ine", formData)
store.setFormData("ine", data.data)
```

---

## Review Data

```
features/review-data/
├── components/
│   ├── EditableSection.tsx   # Sección de acordeón con campos editables
│   └── index.ts
├── RevisionDatos.tsx         # Acordeones dinámicos desde configuración
└── index.ts
```

### Configuración Dinámica

Los campos se definen en `src/constants/revisionFields.ts`:

```typescript
export const sections: SectionDef[] = [
  {
    id: "personales",
    title: "Datos Personales",
    icon: User,
    section: "ine",  // ← slice del store
    fields: [
      { id: "primerNombre", label: "Primer nombre", placeholder: "Ej: Juan" },
      { id: "curp", label: "CURP", placeholder: "ABCD001122HDFXXX01" },
      // ...
    ],
  },
  // domicilio, laborales, bancarios
]
```

### Beneficios
- Agregar/quitar campos solo requiere editar `revisionFields.ts`
- No necesita cambiar `RevisionDatos.tsx`
- Cada sección sabe qué slice del store actualizar (`section: "ine" | "nomina" | "banco"`)

### Estados del Acordeón
- **Expandido**: Muestra los campos editables
- **Contraído**: Solo muestra el título y el indicador de completitud
- Los campos toman su valor del store y actualizan via `setFormData`

---

## Loan Data (Crédito)

```
features/loan-data/
├── components/
│   ├── AccordionSection.tsx    # Genérico: sección plegable con icono, título, check
│   ├── SelectField.tsx         # Select unificado con label, error, icono
│   ├── PrestamoSection.tsx     # Monto, plazo, botón calcular, resultado
│   ├── AsesorSection.tsx       # Folio, sucursal, vendedor, fechas, lugar, descuento
│   ├── ContactoSection.tsx     # Teléfonos (3), correo, estado civil
│   ├── AntiguedadSection.tsx   # Fecha ingreso, meses, años
│   ├── ReferenciasSection.tsx  # 3 referencias (nombre + teléfono)
│   └── index.ts
├── hooks/
│   └── useCreditoAsesor.ts     # Hook principal: estado + sync + validaciones
├── CreditoAsesor.tsx           # Orquestador puro (~119 líneas)
├── constants.ts                # ASESORES_REGISTRADOS, MESES, ESTADOS_CIVILES, PLAZOS_QNA
├── types.ts                    # Re-export desde @/types
└── index.ts
```

### Arquitectura del Orquestador

```
CreditoAsesor (orquestador)
  ├── Obtiene estado y handlers de useCreditoAsesor
  ├── Renderiza secciones del accordion
  └── Renderiza resumen final (cliente, monto, plazo)

useCreditoAsesor (hook)
  ├── Estado local (useState para cada sección)
  ├── Sincronización con store (useEffect)
  ├── Validaciones (isAsesorComplete, isContactoComplete, etc.)
  ├── Cálculo simulado de tabla (calcular)
  └── Retorna completion (boolean por sección)
```

### Flujo de Datos

```
Componentes de sección
  → onChange → useCreditoAsesor.updateAsesor/updateContacto/etc.
    → setState local
      → useEffect → store.setFormData("asesorData", data)
        → Store actualizado → UI consistente entre pasos
```

### Secciones del Accordion

| Sección | Campos | Validación |
|---------|--------|------------|
| Préstamo | Monto (input), Plazo (botones 24-120 QNAs), Calcular, Resultado | Monto > 0 y múltiplo de 1000 |
| Asesor | Folio (5), Sucursal, Vendedor (3), Nombre, Fechas, Lugar, Mes/Año descuento | Todos requeridos, tamaños específicos |
| Contacto | Tel (10), Celular (10), Tel Casa (10), Correo (@), Edo. Civil | 10 dígitos en teléfonos, @ en correo |
| Antigüedad | Fecha ingreso, Meses, Años | Todos requeridos |
| Referencias | 3 pares (nombre + teléfono) | Nombre no vacío, teléfono 10 dígitos |

### Constantes de Dominio

```typescript
export const ASESORES_REGISTRADOS = ["MARIA LOPEZ GARCIA", "JORGE CRUZ SOTO", ...]
export const MESES = ["ENERO", "FEBRERO", ..., "DICIEMBRE"]
export const ESTADOS_CIVILES = ["SOLTERO", "CASADO", "DIVORCIADO", "UNIÓN LIBRE"]
export const PLAZOS_QNA = [24, 36, 48, 72, 96, 120]
```

### Cálculo (Mock)

Actualmente simula multiplicar el monto por 1.15. Cuando el backend esté listo:

```typescript
const { data } = await api.post("/api/calcular-tabla", {
  monto: Number(monto),
  quincenas: plazo,
})
setResultado(data.data)
```

---

## Preview Contract

```
features/preview-contract/
├── VistaPrevia.tsx
└── index.ts
```

### Flujo

```
VistaPrevia
  → Muestra resumen de todos los datos del contrato
  → Botones en el footer de ContractLayout:
      - Descargar (mock: genera Blob dummy)
      - Editar (navega a /contracts/review)
      - Compartir (Web Share API o clipboard)
      - Finalizar → addContract() → navigate("/")
```

### Compartir
- En desktop: Copia al portapapeles
- En móvil: Usa Web Share API (`navigator.share`)
- Botón flotante en móvil (paso 4)

---

## History

```
features/history/
├── components/
│   ├── ContractCard.tsx       # Card de contrato con íconos y estado
│   ├── SearchBar.tsx          # Barra de búsqueda con icono
│   └── index.ts
├── hooks/
│   └── useContractHistory.ts  # Hook para filtrar y buscar
├── HistorialPage.tsx          # Lista de contratos con búsqueda
└── index.ts
```

### Estados
- **Lista**: Grid de ContractCards (responsive: 1-3 columnas)
- **Búsqueda**: Filtra por nombre de cliente
- **Vacío**: EmptyState con icono y botón "Nuevo Contrato"
- **Error**: (futuro) Cuando falle la carga desde backend

### ContractCard
- Muestra: nombre del cliente, fecha, monto, plazo, asesor, estado
- Badge de estado (completado/borrador)
- Botón "Ver detalle" (futuro)

### Próximos Pasos (backend real)
```typescript
const { data, isLoading } = useApi(
  () => api.get("/contracts").then(r => r.data.data),
)
// Reemplazar store.history.contracts por data
```

---

[Volver a DOCS README](../README.md)
