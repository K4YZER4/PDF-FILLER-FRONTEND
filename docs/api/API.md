# Documentación de API – PDF Filler

Este documento define los contratos entre el frontend (PDF-FILLER-FRONTEND) y el backend (PDF-FILLER-BACKEND).

---

## Base URL

```
Desarrollo: http://localhost:3000
Producción:  (definido en VITE_API_BASE)
```

La URL base se configura via `VITE_API_BASE` en `.env`. Por defecto: `http://localhost:3000`.

---

## Endpoints de OCR (Escaneo)

### 1. Escanear INE

**Endpoint:** `POST /scan/ine`

**Descripción:** Procesa una imagen de INE y extrae datos mediante OCR.

**Headers:** `Content-Type: multipart/form-data`

**Request Body:** `file: [imagen JPG/PNG/PDF]`

**Response Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "primerNombre": "JUAN",
    "segundoNombre": "CARLOS",
    "primerApellido": "PEREZ",
    "segundoApellido": "LOPEZ",
    "curp": "PEMJ800101HDFLXL09",
    "fechaNacimiento": "1980-01-01",
    "sexo": "H",
    "claveElector": "PEMJ800101HDFLXL09",
    "domicilio": {
      "calle": "AV INDEPENDENCIA",
      "noExt": "123",
      "colonia": "CENTRO",
      "codigoPostal": "81000",
      "municipio": "GUASAVE",
      "estado": "SINALOA"
    }
  }
}
```

### 2. Escanear Nómina

**Endpoint:** `POST /scan/nomina`

**Response Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "rfc": "PELJ800101ABC",
    "noEmpleado": "12345",
    "puesto": "DESARROLLADOR",
    "departamento": "SISTEMAS",
    "dependencia": "GOBIERNO DEL ESTADO",
    "ingresoMensual": 25000
  }
}
```

### 3. Escanear Estado de Cuenta

**Endpoint:** `POST /scan/estado-cuenta`

**Response Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "rfc": "PELJ800101ABC",
    "noCuenta": "1234567890",
    "clabe": "012180001234567890",
    "banco": "BBVA"
  }
}
```

---

## Endpoints de Cálculo y Generación

### 4. Calcular Tabla Crediticia

**Endpoint:** `POST /api/calcular-tabla`

**Request Body:**
```json
{ "monto": 25000, "quincenas": 48 }
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "montoPagare": 32000,
    "descuentoQuincenal": 666.67,
    "cat": 24.5,
    "tasaMensual": 2.04
  }
}
```

### 5. Generar Contrato PDF

**Endpoint:** `POST /api/generar-contrato`

**Request Body:**
```json
{
  "ine": {},
  "nomina": {},
  "estadoCuenta": {},
  "asesorData": {},
  "contactoData": {},
  "antiguedadData": {},
  "referencias": [],
  "capitalMonto": 25000,
  "plazoQnas": 48,
  "tabla": {}
}
```

**Response (200):** Archivo PDF binario (`Content-Type: application/pdf`)

### 6. Autenticación

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "asesor@credifom.mx",
  "password": "1234"
}
```

**Response Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "email": "asesor@credifom.mx",
      "role": "asesor",
      "name": "MARIA LOPEZ"
    }
  }
}
```

### 7. Listar Contratos

**Endpoint:** `GET /api/contracts`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "CTR-001",
      "clientName": "JUAN PEREZ GARCIA",
      "date": "2026-01-15",
      "monto": 25000,
      "plazo": 48,
      "asesor": "MARIA LOPEZ",
      "status": "completado"
    }
  ]
}
```

Query params: `?page=1&limit=10&search=JUAN`

---

## Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| 400 | Datos inválidos |
| 401 | No autorizado / Token inválido |
| 404 | Endpoint no encontrado |
| 413 | Archivo muy grande |
| 415 | Formato no soportado |
| 422 | Error de validación (con errores por campo) |
| 429 | Rate limiting |
| 500 | Error del servidor |

---

## Sincronización Frontend-Backend

1. Cualquier cambio en estos contratos debe:
   - Documentarse en este archivo
   - Actualizarse en AMBOS repositorios (`docs/api/API.md`)

2. Flujo para cambios:
   - Crear issue: `[API] Descripción del cambio`
   - Implementación en backend
   - Actualización en frontend
   - Actualización de este documento

3. La infraestructura de API está en `src/lib/`:
   - `api.ts` — Instancia axios con interceptors
   - `auth.ts` — Manejo de tokens JWT
   - `errors.ts` — Clases de error tipadas

---

[Volver a DOCS README](../README.md)
