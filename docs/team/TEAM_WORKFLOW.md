# Team Workflow - PDF Filler

> **Equipo:** 2 Frontend + 2 Backend
> **Modelo:** Colaboración Frontend-Backend paralela

---

## Estructura del Equipo

| Rol | Responsabilidades |
|-----|-------------------|
| **Frontend Lead** | Arquitectura frontend, componentes, revisión PRs, coordinación con backend |
| **Backend Lead** | Arquitectura backend, API REST, servicios OCR/PDF, revisión PRs |
| **Frontend Dev** | Implementación de pantallas, formularios, testing |
| **Backend Dev** | Endpoints API, servicios de procesamiento, testing |

---

## Flujo de Trabajo Diario

### Daily Stand-up (Asíncrono)
**Formato:**
```
Ayer: [lo completado]
Hoy: [en lo que trabajo]
Bloqueadores: [si hay]
```

### Canales de Comunicación
- **#general** - Anuncios
- **#frontend** - UI/componentes
- **#backend** - API/servicios
- **#api-contracts** - Contratos de API

### Reuniones Semanales
- **Sprint Planning** - Lunes (30 min)
- **Mid-week Sync** - Miércoles (15 min)
- **Sprint Review** - Viernes (30 min)

---

## Integración Frontend-Backend

### Proceso para Nuevas Features

1. **Definición de Contrato de API**
   - Crear issue: `[API] Nombre del endpoint`
   - Documentar en [docs/api/API.md](../api/API.md)
   - Ambos equipos aprueban

2. **Desarrollo Paralelo**
   - Frontend: implementa con mocks
   - Backend: implementa endpoint real

3. **Integración**
   - Backend publica endpoint
   - Frontend configura `VITE_API_URL`
   - Testing de integración
   - Actualizar documentación

---

## Git Workflow

Ver [GIT_WORKFLOW.md](../workflows/GIT_WORKFLOW.md) para detalles completos.

Resumen:
- `main` (protegida)
- `feature/*` - Nuevas funcionalidades
- `fix/*` - Corrección de errores
- `chore/*` - Configuración

Convención de commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`

---

## Pull Request Workflow

Ver [PULL_REQUESTS.md](../workflows/PULL_REQUESTS.md) para detalles completos.

Checklist antes del PR:
- [ ] Código sigue [estándares](../guides/CODING_STANDARDS.md)
- [ ] Sin `console.log`
- [ ] TypeScript sin errores
- [ ] Build pasa (`npm run build`)
- [ ] Archivos sensibles no incluidos

---

## Reporte de Bugs

Usar el siguiente formato en GitHub Issues:

```markdown
## Bug: [Título]

**Severidad:** Crítico / Alto / Medio / Bajo

**Descripción:** [clara del problema]

**Steps:**
1. Abrir app
2. Ir a escaneo de INE
3. Subir imagen
4. App crashea

**Esperado:** [qué debería pasar]
**Actual:** [qué está pasando]

**Ambiente:**
- OS: Windows 11
- Browser: Chrome 120
```

### Priorización

| Severidad | Descripción | SLA |
|-----------|-------------|-----|
| Crítico | App no funciona | 24h |
| Alto | Feature principal roto | 3 días |
| Medio | Feature secundario | 1 semana |
| Bajo | Cosmético | 2 semanas |

---

## Recursos del Equipo

- **Documentación:** [docs/](../README.md)
- **API Contracts:** [docs/api/API.md](../api/API.md)
- **Estándares:** [docs/guides/CODING_STANDARDS.md](../guides/CODING_STANDARDS.md)

---

[Volver a CONTRIBUTING](../CONTRIBUTING.md)
