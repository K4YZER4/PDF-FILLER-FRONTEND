# Setup para Desarrolladores – PDF Filler

> Guía rápida para levantar el proyecto frontend y trabajar con el backend API.

---

## Requisitos para desarrolladores

- **Node.js** 18+ (LTS recomendado)
- **npm** 9+
- **Git**
- **Navegador moderno** (Chrome, Firefox, Edge)
- **Backend API** ejecutándose en `localhost:3000`

Verifica Node y npm:
```bash
node -v
npm -v
```

---

## Paso 1: Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd PDF-FILLER-FRONTEND
```

---

## Paso 2: Instalar dependencias

```bash
npm install
```

---

## Paso 3: Configurar variables de entorno

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Edita `.env` con los valores correctos:
   ```
   VITE_API_URL=http://localhost:3000
   ```

> **Nota:** El archivo `.env` nunca se debe subir al repositorio.

---

## Paso 4: Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## Paso 5: Verificar que todo funciona

1. Abre `http://localhost:5173` en tu navegador
2. Verifica que cargue la pantalla de INE
3. Sube un archivo de imagen para probar el OCR
4. Verifica que el backend responda en `localhost:3000`

---

## Flujo de trabajo diario

1. Actualiza main:
   ```bash
   git checkout main
   git pull origin main
   ```

2. Crea una rama para tu tarea:
   ```bash
   git checkout -b feature/nombre-de-la-tarea
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Modifica archivos `.tsx`, `.ts`, `.css`
5. Guarda cambios (Vite recarga automáticamente)
6. Verifica que TypeScript no tenga errores:
   ```bash
   npx tsc --noEmit
   ```

7. Haz commit y push de tus cambios

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo (Vite) |
| `npm run build` | Genera build de producción |
| `npm run preview` | Preview del build local |
| `npx tsc --noEmit` | Verificación de tipos TypeScript |

---

## Solución de problemas

### Error: "Cannot connect to API"
- Verifica que el backend esté corriendo en `localhost:3000`
- Revisa que `VITE_API_URL` en `.env` sea correcto

### Error: "TypeScript errors"
```bash
npx tsc --noEmit
```
Corrige todos los errores antes de hacer commit.

### Error: "Port 5173 already in use"
Cambia el puerto:
```bash
npm run dev -- --port 3001
```

---

## Estructura de ramas

```
main (protegida)
  ├── feature/ine-ocr-improvement
  ├── feature/credito-calculator
  ├── fix/navigation-bug
  └── chore/update-dependencies
```

---

- **[Volver al README principal](../README.md)**
- **[Guía de Contribución](../CONTRIBUTING.md)**
