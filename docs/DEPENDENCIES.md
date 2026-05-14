# Dependencias del Proyecto – PDF Filler

Este documento lista todas las librerías utilizadas en PDF Filler, su propósito y reglas para agregar nuevas dependencias.

---

## Dependencias de Producción

| Librería | Versión | Propósito |
|-----------|---------|-----------|
| **react** | ^19.2.5 | UI library principal |
| **react-dom** | ^19.2.5 | Renderizado en DOM |
| **react-router-dom** | ^7.14.2 | Navegación SPA por rutas |
| **zustand** | ^5.0.12 | Manejo de estado global (con Immer) |
| **immer** | ^11.1.4 | Mutaciones inmutables en Zustand |
| **axios** | ^1.16.1 | Cliente HTTP con interceptors |
| **lucide-react** | ^1.14.0 | Iconos SVG |
| **react-hook-form** | ^7.74.0 | Manejo de formularios (Login) |
| **zod** | ^4.4.1 | Validación de esquemas |
| **@hookform/resolvers** | ^5.2.2 | Integración zod + react-hook-form |
| **clsx** | ^2.1.1 | Clases condicionales |
| **tailwind-merge** | ^3.6.0 | Merge inteligente de clases Tailwind |
| **tailwindcss** | ^4.2.4 | Framework CSS utilitario |
| **@tailwindcss/vite** | ^4.2.4 | Plugin Tailwind para Vite |

## Dependencias de Desarrollo

| Librería | Versión | Propósito |
|-----------|---------|-----------|
| **typescript** | ~6.0.2 | Tipado estático |
| **vite** | ^8.0.10 | Bundler y dev server |
| **@vitejs/plugin-react** | ^6.0.1 | Integración React con Vite |
| **@types/react** | ^19.2.14 | Tipos TypeScript para React |
| **@types/react-dom** | ^19.2.3 | Tipos para React DOM |
| **@types/node** | ^25.6.0 | Tipos para Node.js |
| **vitest** | ^4.1.5 | Framework de testing unitario |
| **@testing-library/react** | ^16.3.2 | Testing de componentes React |
| **@testing-library/jest-dom** | ^6.9.1 | Matchers DOM para testing |
| **@testing-library/user-event** | ^14.6.1 | Simulación de eventos de usuario |
| **jsdom** | ^29.1.1 | Entorno DOM para tests |
| **postcss** | ^8.5.13 | Post-procesador CSS |
| **autoprefixer** | ^10.5.0 | Prefixes CSS automáticos |
| **@tailwindcss/postcss** | ^4.2.4 | Plugin PostCSS de Tailwind |

---

## Reglas para Agregar Dependencias

### 1. Justificación Obligatoria

Toda nueva dependencia debe:
- Resolver un problema específico
- No duplicar funcionalidad existente
- Estar documentada en este archivo

### 2. Proceso

```bash
npm install <librería>          # producción
npm install -D <librería>       # desarrollo
# Luego actualizar este archivo
```

### 3. Criterios de Selección

- **Popularidad:** Muchas descargas semanales
- **Mantenimiento:** Actualizado recientemente
- **Tamaño:** No inflar bundle innecesariamente
- **Licencia:** Compatible con el proyecto

### 4. Dependencias Prohibidas

- Librerías sin mantenimiento (último update > 2 años)
- Librerías con vulnerabilidades de seguridad conocidas
- Duplicados de funcionalidad ya existente

---

## Verificar Dependencias

```bash
npm audit         # Verificar vulnerabilidades
npm update        # Actualizar dependencias
npm run build     # Verificar tamaño de bundle
```

---

## Sincronización

- `package.json` y `docs/DEPENDENCIES.md` deben mantenerse sincronizados
- Todo cambio en dependencias debe reflejarse en este documento

---

[Volver a CONTRIBUTING](./CONTRIBUTING.md)
