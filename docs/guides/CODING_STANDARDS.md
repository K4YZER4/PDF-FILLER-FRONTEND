# Convenciones de Código – PDF Filler

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
- No duplicar lógica

### Complejidad y tamaño de archivos

- Un archivo no debe exceder:
  - 200 líneas para componentes
  - 150 líneas para hooks
- Si un archivo crece demasiado:
  - Debe dividirse
  - O refactorizarse en funciones auxiliares

---

## Variables de entorno

- Las variables sensibles deben definirse únicamente en archivos `.env`
- El archivo `.env` **NUNCA** debe subirse al repositorio
- El proyecto debe incluir un `.env.example` con las variables requeridas

---

## Seguridad

- No subir: tokens, API keys, credenciales
- No hardcodear URLs sensibles
- Toda configuración sensible va en `.env`

---

## Reglas para componentes

- Un componente debe tener una sola responsabilidad
- Evitar componentes con más de 200 líneas
- Componentes reutilizables van en `src/shared/components`
- Documentación obligatoria en español al inicio de cada archivo

---

## Reglas para hooks

- Todos los hooks personalizados deben iniciar con `use`
- Un hook debe manejar una sola lógica
- Los hooks NO deben contener JSX

---

## Uso obligatorio de alias en imports

### ❌ No usar imports relativos largos:

```typescript
import Button from "../../shared/components/Button";
```

### ✅ Usar alias definidos en tsconfig.json:

```typescript
import { Button } from "@/shared/components"
import { useContractStore } from "@/store/useContractStore"
import type { INEData } from "@/types"
```

---

## Convención de nombres

| Elemento    | Convención     | Ejemplo                  |
| ----------- | -------------- | ------------------------ |
| Componentes | PascalCase     | `LoginPage.tsx`          |
| Hooks       | useSomething   | `useAuth.ts`             |
| Store       | camelCase      | `useContractStore.ts`    |
| Tipos       | PascalCase     | `INEData`, `NominaData`  |
| Utilidades  | camelCase      | `formatDate.ts`          |
| Archivos    | kebab-case     | `upload-documents/`      |

---

## Documentación del código

- Todo archivo relevante debe tener al inicio comentarios que expliquen:
  - **Qué hace**
  - **Cómo funciona**
- Formato:

```typescript
/** Componente: Button. Botón reutilizable con variantes primary/secondary y estado loading. */
```

---

## Formato y estilo de código

- El código debe mantener un formato consistente
- Usar Tailwind CSS para estilos (no CSS inline excesivo)
- Mobile-first: diseñar primero para pantalla pequeña

---

## Git y Colaboración

- Hacer commits pequeños y frecuentes
- Seguir convención de commits: `feat:`, `fix:`, `docs:`, etc.
- No hacer push directo a `main`
- Crear PRs para revisión de código

---

## Rendimiento

- Evitar re-renderizados innecesarios
- Usar `React.memo`, `useMemo`, `useCallback` cuando sea necesario
- Optimizar imports (no importar toda una librería si solo se usa una función)

---

[Volver a CONTRIBUTING](../CONTRIBUTING.md)
