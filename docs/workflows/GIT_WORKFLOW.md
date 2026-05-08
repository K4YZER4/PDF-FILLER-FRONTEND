# GitHub Flow – Guía de Trabajo

Este repositorio utiliza **GitHub Flow** como flujo de trabajo para el desarrollo de PDF Filler.

---

## Convención de commits

### Tipos de commit permitidos

- **feat**: nueva funcionalidad
- **fix**: corrección de errores
- **refactor**: cambios internos sin afectar la funcionalidad
- **chore**: tareas de mantenimiento
- **docs**: cambios en documentación
- **test**: agregar o modificar tests

### Ejemplo

```bash
git commit -m "feat: agregar escaneo de INE con OCR"
```

---

## Estructura de ramas

| Rama        | Descripción                                 |
| ----------- | ------------------------------------------- |
| `main`      | Rama principal y estable                    |
| `feature/*` | Nuevas funcionalidades                      |
| `fix/*`     | Corrección de errores                       |
| `chore/*`   | Configuración, dependencias o mantenimiento |

### Ejemplos

```bash
feature/ine-ocr
feature/credito-calculator
fix/scan-error
chore/update-vite
```

---

## Rama main

- El proyecto debe compilar correctamente (`npm run build`)
- No debe contener código experimental
- Está protegida (no se permite push directo)

---

## Flujo de trabajo diario

### 1. Actualizar main

```bash
git checkout main
git pull origin main
```

### 2. Crear una rama para la tarea

```bash
git checkout -b feature/nombre-de-la-tarea
```

### 3. Trabajar y hacer commits

```bash
git commit -m "feat: agregar pantalla de crédito"
```

### 4. Subir la rama a GitHub

```bash
git push origin feature/nombre-de-la-tarea
```

### 5. Crear Pull Request (PR)

**Checklist antes del merge:**

- ✅ `npx tsc --noEmit` sin errores
- ✅ `npm run build` exitoso
- ✅ No hay console.log innecesarios
- ✅ No se subieron archivos sensibles (.env)
- ✅ PR hace una sola cosa
- ✅ Documentación actualizada

### 6. Merge a main

Una vez aprobado el PR se hace merge a main y se elimina la rama.

---

## Relación Frontend-Backend

### Sincronización de contratos API

1. Crear issue: `[API] Descripción del endpoint`
2. Documentar en [docs/api/API.md](../api/API.md)
3. Frontend implementa con mock
4. Backend implementa endpoint real
5. Integrar y probar

---

[Volver a CONTRIBUTING](../CONTRIBUTING.md)
