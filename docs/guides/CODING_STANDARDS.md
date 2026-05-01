# Convenciones de Código – PDF Filler

La calidad del código es responsabilidad de todo el equipo.

---

## Calidad y Testing

### Reglas generales

- Todo código nuevo debe:
  - Compilar sin errores
  - Pasar el tipado de TypeScript
  - No romper funcionalidades existentes
- No se permite hacer merge con errores de TypeScript

### Pruebas manuales obligatorias

Antes de subir un PR, el desarrollador debe:

- Ejecutar la app con `npm run dev`
- Probar manualmente el flujo afectado
- Verificar navegación, estados y errores comunes

```bash
npm run dev
```

### Errores y logs

- No se permiten `console.log` en producción
- Se permiten logs temporales solo durante desarrollo
- Todo log debe eliminarse antes del merge

### Limpieza de código

- No dejar:
  - Código comentado sin uso
  - Archivos sin referencia
  - Imports no utilizados
- Si un archivo ya no se usa, debe eliminarse
- No duplicar lógica: reutilizar hooks, utils o servicios existentes

### Complejidad y tamaño de archivos

- Un archivo no debe exceder:
  - 200 líneas para componentes
  - 150 líneas para hooks
- Si un archivo crece demasiado:
  - Debe dividirse
  - O refactorizarse en funciones auxiliares

### Nuevas funcionalidades

Antes de empezar una nueva feature:

- Confirmar que no exista ya algo similar
- Definir claramente:
  - Qué problema resuelve
  - Qué archivos tocará
  - Dividir la funcionalidad en tareas pequeñas

---

## Variables de entorno

- Las variables sensibles deben definirse únicamente en archivos `.env`
- El archivo `.env` **NUNCA** debe subirse al repositorio
- El proyecto debe incluir un `.env.example` con las variables requeridas
- Cada desarrollador es responsable de configurar su entorno local

---

## Seguridad

- No subir:
  - Tokens
  - API keys
  - Credenciales
- No hardcodear URLs sensibles
- Toda configuración sensible va en `.env`

---

## Reglas para componentes

- Un componente debe tener una sola responsabilidad
- Evitar componentes con más de 200 líneas
- Componentes reutilizables van en `src/components/ui`
- Documentación obligatoria con JSDoc en español

### Ejemplo de JSDoc para componente:

```typescript
/**
 * Componente: Button.tsx
 * Propósito: Botón reutilizable con múltiples variantes.
 * Props: variant, size, loading, onClick, children.
 */
```

---

## Reglas para hooks

- Todos los hooks personalizados deben iniciar con `use`
- Un hook debe manejar una sola lógica
- No duplicar lógica entre hooks
- Los hooks NO deben contener JSX

---

## Reglas para servicios

- Los servicios NO renderizan UI
- Los servicios solo:
  - obtienen datos
  - procesan información
  - manejan comunicación externa
- Todas las llamadas a APIs deben pasar por `src/services`

---

## Uso obligatorio de alias en imports

### ❌ No usar imports relativos largos:

```typescript
import Button from "../../../components/ui/Button";
```

### ✅ Usar alias definidos en tsconfig.json:

```typescript
import { Button } from "@/components";
import { useContractStore } from "@/store/useContractStore";
import type { INEData } from "@/types";
```

---

## Componentes reutilizables

- Todos los componentes deben estar en `src/components`
- Los componentes UI (Button, Input, Card, etc.) van en `components/ui`
- Los componentes de layout (Header, Container, etc.) van en `components/layout`
- Se debe usar `index.ts` para exportaciones

---

## Convención de nombres

| Elemento    | Convención     | Ejemplo           |
| ----------- | -------------- | ----------------- |
| Componentes | PascalCase     | `LoginForm.tsx`   |
| Hooks       | useSomething   | `useAuth.ts`      |
| Servicios   | xxx.service.ts | `auth.service.ts` |
| Store       | xxx.store.ts   | `auth.store.ts`   |
| Tipos       | PascalCase     | `User.ts`         |
| Utilidades  | camelCase      | `formatDate.ts`   |
| Esquemas    | xxx.schema.ts  | `credito.schema.ts` |

---

## Documentación del código (JSDoc)

- Todo código nuevo relevante debe estar documentado
- Todo archivo, función o componente nuevo debe explicar:
  - **Qué hace**
  - **Cómo funciona**
  - **Por qué existe**
- La documentación debe realizarse mediante:
  - Comentarios JSDoc en español
  - Tipado correcto con TypeScript
  - Nombres descriptivos de variables y funciones

### Formato JSDoc:

```typescript
/**
 * Archivo: components/ui/Button.tsx
 * Propósito: Botón reutilizable con múltiples variantes.
 * Props: variant, size, loading, onClick, children.
 */
```

El código debe poder entenderse sin necesidad de explicación verbal.

---

## Formato y estilo de código

- El código debe mantener un formato consistente
- Se recomienda usar el formateador configurado en el proyecto
- No se aceptan PRs con formato inconsistente o difícil de leer
- Usar Tailwind CSS para estilos (no CSS inline excesivo)

---

## Dependencias del proyecto

Este proyecto documenta de forma explícita todas las librerías utilizadas, su propósito y las reglas para agregar nuevas dependencias.

- Toda dependencia instalada debe documentarse en `docs/DEPENDENCIES.md`
- No se permite instalar librerías sin justificar su uso
- `package.json` y `docs/DEPENDENCIES.md` deben mantenerse sincronizados

**Listado completo y reglas de uso:**  
[Ver DEPENDENCIES.md](../DEPENDENCIES.md)

> Ninguna dependencia puede agregarse al proyecto sin ser documentada.

---

## Git y Colaboración

- Hacer commits pequeños y frecuentes
- Seguir convención de commits: `feat:`, `fix:`, `docs:`, etc.
- No hacer push directo a `main`
- Crear PRs para revisión de código
- Avisar antes de modificar archivos críticos (store, types, schemas)

---

## Rendimiento

- Evitar re-renderizados innecesarios
- Usar `React.memo`, `useMemo`, `useCallback` cuando sea necesario
- Optimizar imports (no importar todo un librería si solo se usa una función)
- Lazy loading para componentes pesados si es necesario

---

[Volver a CONTRIBUTING](../CONTRIBUTING.md)
