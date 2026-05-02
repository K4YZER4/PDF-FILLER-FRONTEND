# Documentación de API – PDF Filler

Este documento define los contratos entre el frontend (PDF-FILLER-FRONTEND) y el backend (PDF-FILLER-BACKEND).

---

## Base URL

```
Desarrollo: http://localhost:3000
Producción: https://api.pdffiller.com (por definir)
```

---

## Endpoints de OCR (Escaneo)

### 1. Escanear INE (Identificación Oficial)

**Endpoint:** `POST /scan/ine`

**Descripción:** Procesa una imagen de INE y extrae datos mediante OCR.

**Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [archivo de imagen] (JPG, PNG, PDF)
```

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

**Response de Error (400/500):**
```json
{
  "success": false,
  "error": "No se pudo procesar la imagen",
  "message": "El archivo no es legible o está dañado"
}
```

---

### 2. Escanear Nómina

**Endpoint:** `POST /scan/nomina`

**Descripción:** Extrae datos de un recibo de nómina.

**Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [archivo de imagen] (JPG, PNG, PDF)
```

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

---

### 3. Escanear Estado de Cuenta

**Endpoint:** `POST /scan/estado-cuenta`

**Descripción:** Extrae datos bancarios de un estado de cuenta.

**Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [archivo de imagen] (JPG, PNG, PDF)
```

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

**Descripción:** Calcula montos, intereses y descuentos para un crédito.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "monto": 25000,
  "quincenas": 48
}
```

**Response Exitosa (200):**
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

---

### 5. Generar Contrato PDF

**Endpoint:** `POST /api/generar-contrato`

**Descripción:** Genera un contrato PDF con todos los datos.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "ine": { ... },
  "tabla": { ... },
  "nomina": { ... },
  "estadoCuenta": { ... },
  "extra": { ... }
}
```

**Response Exitosa (200):**
- Content-Type: `application/pdf`
- Body: Archivo PDF binario

**Response de Error (400/500):**
```json
{
  "success": false,
  "error": "Error al generar PDF",
  "message": "Faltan datos requeridos"
}
```

---

## Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Endpoint no encontrado |
| 413 | Payload Too Large - Archivo muy grande |
| 415 | Unsupported Media Type - Formato no soportado |
| 429 | Too Many Requests - Rate limiting |
| 500 | Internal Server Error - Error del servidor |
| 503 | Service Unavailable - Servicio no disponible |

---

## Rate Limiting

- Máximo 100 peticiones por IP por hora
- Archivos de hasta 10MB
- Formatos permitidos: JPG, PNG, PDF

---

## Sincronización Frontend-Backend

1. Cualquier cambio en estos contratos debe:
   - Documentarse en este archivo
   - Notificarse en el canal `#api-contracts`
   - Actualizarse en AMBOS repositorios (`docs/api/API.md`)

2. Flujo para cambios:
   - Crear issue: `[API] Descripción del cambio`
   - Discusión en `#api-contracts`
   - Implementación en backend
   - Actualización en frontend
   - Actualización de este documento

---

[Volver a README principal](../README.md)
