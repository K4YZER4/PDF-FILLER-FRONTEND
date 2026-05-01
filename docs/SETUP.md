# Guía de Configuración

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Backend API corriendo (por defecto en `http://localhost:3000`)

## Instalación

1. Clona el repositorio o descomprime el código
2. Navega a la carpeta del proyecto:
   ```bash
   cd PDF-FILLER-FRONTEND
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

## Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (o edita el existente):

```env
VITE_API_BASE=http://localhost:3000
```

Cambia la URL si tu backend está en un servidor diferente.

## Ejecución en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Genera la build de producción en `dist/` |
| `npm run preview` | Previsualiza la build de producción localmente |
| `npm run test` | Ejecuta las pruebas con Vitest |
| `npm run test:run` | Ejecuta pruebas sin modo watch |

## Estructura de archivos `.env`

```
# URL base del backend API
VITE_API_BASE=http://localhost:3000

# Otras variables según sea necesario...
```

## Notas Importantes

- El backend debe estar corriendo antes de usar las funciones de escaneo y generación de PDF
- Asegúrate de que el backend tenga los endpoints necesarios implementados
- Los archivos subidos deben ser imágenes claras (JPG, PNG) o PDFs de los documentos
