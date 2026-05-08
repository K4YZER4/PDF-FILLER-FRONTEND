# Guía de Configuración

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn

## Instalación

```bash
cd PDF-FILLER-FRONTEND
npm install
```

## Ejecución en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Genera la build de producción en `dist/` (tsc + vite) |
| `npm run preview` | Previsualiza la build de producción localmente |
| `npm run lint` | Ejecuta el linter |

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE=http://localhost:3000
```

Cambia la URL si tu backend está en un servidor diferente.

## Notas Importantes

- El backend debe estar corriendo antes de usar las funciones de escaneo y generación de PDF
- Asegúrate de que el backend tenga los endpoints necesarios implementados
- Los archivos subidos deben ser imágenes claras (JPG, PNG) o PDFs de los documentos

---

[Volver a DOCS README](./README.md)
