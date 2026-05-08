# Documentación de API – PDF Filler

Este documento define los contratos entre el frontend (PDF-FILLER-FRONTEND) y el backend (PDF-FILLER-BACKEND).

---

## Base URL

```
Desarrollo: http://localhost:3000
```

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
    "nombre1": "JUAN",
    "nombre2": "CARLOS",
    "apellidoPaterno": "PEREZ",
    "apellidoMaterno": "LOPEZ",
    "curp": "PEMJ800101HDFLXL09",
    "fechaNac": "1980-01-01",
    "sexo": "H",
    "claveElector": "PEMJ800101HDFLXL09",
    "seccion": "1234",
    "vigencia": "2025-12-31",
    "numEmision": "1234567890",
    "domicilio": {
      "calle": "AV INDEPENDENCIA",
      "numeroCasa": "123",
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
    "numeroCuenta": "1234567890",
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
    "tasaMensual": 2.04,
    "importeInteres": 7000
  }
}
```

### 5. Generar Contrato PDF

**Endpoint:** `POST /api/generar-contrato`

**Request Body:**
```json
{ "ine": {}, "tabla": {}, "nomina": {}, "estadoCuenta": {}, "extra": {} }
```

**Response (200):** Archivo PDF binario

---

## Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| 400 | Datos inválidos |
| 404 | Endpoint no encontrado |
| 413 | Archivo muy grande |
| 415 | Formato no soportado |
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

---

[Volver a DOCS README](../README.md)
