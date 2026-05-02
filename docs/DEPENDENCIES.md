# Dependencias del Proyecto – PDF Filler

Este documento lista todas las librerías utilizadas en PDF Filler, su propósito y reglas para agregar nuevas dependencias.

---

## Dependencias de Producción

### Frontend (React + Vite)

| Librería | Versión | Propósito | Justificación |
|-----------|---------|-----------|---------------|
| **react** | ^19.0.0 | UI library principal | Framework base para la interfaz |
| **react-dom** | ^19.0.0 | Renderizado en DOM | Requerido por React |
| **react-router-dom** | ^7.0.0 | Navegación por pestañas | Manejo de rutas SPA |
| **typescript** | ~5.7.3 | Tipado estático | Seguridad y mantenibilidad |
| **vite** | ^6.2.4 | Bundler y dev server | Build rápido y HMR |
| **@vitejs/plugin-react** | ^4.3.4 | Integración React con Vite | Soporte JSX y Fast Refresh |
| **tailwindcss** | v4.0.0 | Framework CSS utilitario | Estilos rápidos y consistentes |
| **@tailwindcss/vite** | ^4.0.0 | Plugin Tailwind para Vite | Integración nativa |
| **zustand** | ^5.0.3 | Manejo de estado global | Simplicidad y buena integración con React |
| **react-hook-form** | ^7.54.2 | Manejo de formularios | Validación y rendimiento |
| **@hookform/resolvers** | ^5.0.1 | Resolvers para react-hook-form | Integración con Zod |
| **zod** | ^3.24.2 | Validación de esquemas | Tipado y validación robusta |
| **zod-to-ts** | ^1.3.0 | Conversión Zod a TypeScript | Generación de tipos automática |

### Backend (Node.js + Express)

> Nota: El backend está en un repositorio separado (PDF-FILLER-BACKEND)

| Librería | Versión | Propósito | Justificación |
|-----------|---------|-----------|---------------|
| **express** | ^4.18.2 | Framework web | API REST simple y flexible |
| **cors** | ^2.8.5 | Manejo de CORS | Permitir peticiones desde frontend |
| **dotenv** | ^16.4.5 | Variables de entorno | Configuración sensible |
| **multer** | ^1.4.5-lts.1 | Subida de archivos | Procesar imágenes para OCR |
| **pdf-lib** | ^1.17.1 | Generación de PDFs | Crear contratos dinámicos |
| **axios** | ^1.7.9 | Cliente HTTP | Comunicación con servicios externos OCR |

---

## Dependencias de Desarrollo

| Librería | Versión | Propósito | Justificación |
|-----------|---------|-----------|---------------|
| **@types/react** | ^19.0.0 | Tipos TypeScript para React | Desarrollo tipado |
| **@types/react-dom** | ^19.0.0 | Tipos para React DOM | Desarrollo tipado |
| **eslint** | ^9.22.0 | Linter de código | Mantener calidad |
| **@eslint/js** | ^9.22.0 | Configuración ESLint | Reglas modernas |
| **typescript-eslint** | ^8.26.1 | Integración TypeScript + ESLint | Linting tipado |

---

## Reglas para Agregar Dependencias

### 1. Justificación Obligatoria

Toda nueva dependencia debe:
- Resolver un problema específico
- No duplicar funcionalidad existente
- Estar documentada en este archivo

### 2. Proceso para Agregar Dependencia

```bash
# 1. Evaluar si es necesaria
# 2. Instalar y documentar
npm install <librería>
# o para devDependencies
npm install -D <librería>

# 3. Actualizar este archivo (DEPENDENCIES.md)
# 4. Hacer commit con mensaje claro
git commit -m "chore: agregar <librería> para <propósito>"
```

### 3. Criterios de Selección

- **Popularidad:** Muchas descargas semanales
- **Mantenimiento:** Actualizado recientemente
- **Tamaño:** No infl ar bundle innecesariamente
- **Licencia:** Compatible con el proyecto (MIT, Apache 2.0, etc.)

### 4. Dependencias Prohibidas

- Librerías sin mantenimiento (último update > 2 años)
- Librerías con vulnerabilidades de seguridad conocidas
- Duplicados de funcionalidad ya existente

---

## Verificar Dependencias

```bash
# Verificar vulnerabilidades
npm audit

# Actualizar dependencias
npm update

# Verificar tamaño de bundle
npm run build
```

---

## Sincronización

- `package.json` y `docs/DEPENDENCIES.md` deben mantenerse sincronizados
- Todo cambio en dependencias debe reflejarse en este documento
- Ninguna dependencia puede agregarse sin ser documentada

---

[Volver a CONTRIBUTING](./CONTRIBUTING.md)
