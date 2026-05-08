# Dependencias del Proyecto – PDF Filler

Este documento lista todas las librerías utilizadas en PDF Filler, su propósito y reglas para agregar nuevas dependencias.

---

## Dependencias de Producción

| Librería | Versión | Propósito |
|-----------|---------|-----------|
| **react** | ^19.0.0 | UI library principal |
| **react-dom** | ^19.0.0 | Renderizado en DOM |
| **react-router-dom** | ^7.0.0 | Navegación SPA por rutas |
| **zustand** | ^5.0.3 | Manejo de estado global |
| **immer** | ^10.1.1 | Mutaciones inmutables en Zustand |
| **lucide-react** | ^0.474.0 | Iconos SVG |
| **@tailwindcss/vite** | ^4.0.0 | Plugin Tailwind para Vite |
| **tailwindcss** | ^4.0.0 | Framework CSS utilitario |

## Dependencias de Desarrollo

| Librería | Versión | Propósito |
|-----------|---------|-----------|
| **typescript** | ~5.7.3 | Tipado estático |
| **vite** | ^6.2.4 | Bundler y dev server |
| **@vitejs/plugin-react** | ^4.3.4 | Integración React con Vite |
| **@types/react** | ^19.0.0 | Tipos TypeScript para React |
| **@types/react-dom** | ^19.0.0 | Tipos para React DOM |
| **eslint** | ^9.22.0 | Linter de código |
| **@eslint/js** | ^9.22.0 | Configuración ESLint |
| **typescript-eslint** | ^8.26.1 | Integración TypeScript + ESLint |

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
