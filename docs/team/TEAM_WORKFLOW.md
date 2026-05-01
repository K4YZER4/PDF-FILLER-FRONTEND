# Team Workflow - PDF Filler

> **Equipo:** 4 desarrolladores (2 Frontend + 2 Backend)  
> **Modelo:** Colaboración Frontend-Backend paralela  
> **Última actualización:** 2026-05-01

---

## Estructura del Equipo

### Roles y Responsabilidades

| Rol | Persona | Responsabilidades Principales |
|-----|---------|-------------------------------|
| **Frontend Lead** | Dev 1 | - Arquitectura del frontend<br>- Componentes y UI<br>- Revisión de PRs frontend<br>- Coordinación con backend |
| **Backend Lead** | Dev 2 | - Arquitectura del backend<br>- Diseño de API REST<br>- Servicios OCR y PDF<br>- Revisión de PRs backend |
| **Frontend Dev** | Dev 3 | - Implementación de pantallas<br>- Formularios y validación<br>- Testing de componentes UI |
| **Backend Dev** | Dev 4 | - Endpoints API<br>- Servicios de procesamiento<br>- Testing de integración |

---

## Flujo de Trabajo Diario

### 1. Comunicación Asíncrona (Recomendada)

#### Daily Stand-up (Formato Escrito)
**Hora sugerida:** 9:00 AM  
**Plataforma:** Discord/Slack/WhatsApp

**Formato:**
```
📅 Daily Update - [Fecha]

[Tu nombre]
Ayer: Completé componente de subida de archivos
Hoy: Trabajaré en integración con API de OCR
Bloqueadores: Necesito confirmar formato de respuesta del endpoint /scan

[Backend Lead]
Ayer: ...
Hoy: ...
Bloqueadores: ...
```

#### Canales de Comunicación Sugeridos
- **#general** - Anuncios y coordinación general
- **#frontend** - Discusiones de UI/componentes
- **#backend** - Discusiones de API/servicios
- **#api-contracts** - Coordinación de contratos de API
- **#bugs** - Reporte de bugs
- **#random** - Off-topic

---

### 2. Sincronización Frontend-Backend

#### Reuniones Semanales (Recomendadas)

**Sprint Planning** - Lunes 10:00 AM (30 min)
- Revisar roadmap
- Asignar tareas de la semana
- Identificar dependencias entre frontend y backend
- Definir contratos de API si es necesario

**Mid-week Sync** - Miércoles 3:00 PM (15 min)
- Check-in rápido
- Resolver bloqueadores
- Ajustar prioridades si es necesario

**Sprint Review** - Viernes 4:00 PM (30 min)
- Demo de lo completado
- Actualizar roadmap
- Celebrar wins 🎉

---

## 🔗 Integración Frontend-Backend

### Proceso para Nuevas Features

#### 1. Definición de Contrato de API
**Responsable:** Frontend Lead + Backend Lead

**Pasos:**
1. Frontend identifica necesidad de nuevo endpoint
2. Crear issue en GitHub: `[API] Nombre del endpoint`
3. Documentar en `docs/api/API.md`:
   - Endpoint path
   - Request format
   - Response format
   - Códigos de error
4. Ambos equipos aprueban el contrato (👍 en el issue)

**Ejemplo de Issue:**
```markdown
## [API] Endpoint para escaneo OCR

**Path:** `POST /scan/ine`

**Request:**
- Content-Type: multipart/form-data
- Body: file (image)

**Response:**
```json
{
  "success": true,
  "data": {
    "curp": "XXXX000000XXXXXX0X",
    "nombre1": "JUAN",
    ...
  }
}
```

**Prioridad:** Alta  
**Fecha estimada:** 2026-05-10

@backend-lead - ¿Puedes revisar?
```

#### 2. Desarrollo Paralelo
- **Frontend:** Implementa con mocks basados en el contrato
- **Backend:** Implementa endpoint real

#### 3. Integración
**Responsable:** Frontend Dev + Backend Dev

**Pasos:**
1. Backend publica endpoint en entorno de desarrollo
2. Frontend configura `VITE_API_URL=http://localhost:3000`
3. Testing de integración
4. Resolver diferencias entre contrato y implementación
5. Actualizar documentación si hay cambios

---

## 📂 Organización de Repositorios

### Repositorio Frontend (este)
```
PDF-FILLER-FRONTEND/
├── src/                    # Código del frontend
├── docs/                   # Documentación compartida
│   ├── api/               # Contratos de API (compartido con backend)
│   └── ...
```

### Repositorio Backend (separado)
```
PDF-FILLER-BACKEND/
├── src/
├── docs/
│   └── api/               # Misma documentación que frontend
```

**Importante:** Mantener `docs/api/API.md` sincronizado entre ambos repos.

---

## 🔀 Git Workflow (Recap)

### Ramas

```
main (protegida)
  ├── feature/ine-ocr
  ├── feature/credito-calculator
  ├── fix/scan-error
  └── chore/update-deps
```

### Convención de Nombres de Ramas
- `feature/nombre-corto` - Nuevas funcionalidades
- `fix/nombre-del-bug` - Corrección de errores
- `refactor/area` - Refactorización
- `chore/tarea` - Configuración, dependencias

### Convención de Commits
```
tipo: descripción breve

feat: agregar escaneo de INE con OCR
fix: corregir error al generar PDF
refactor: optimizar componentes de formulario
chore: actualizar dependencias de Vite
docs: agregar documentación de API
test: agregar tests para servicios
```

---

## ✅ Pull Request Workflow

### 1. Antes de Crear el PR

**Checklist del Desarrollador:**
- [ ] Código sigue los estándares (`CODING_STANDARDS.md`)
- [ ] No hay `console.log` innecesarios
- [ ] TypeScript compila sin errores (`npx tsc --noEmit`)
- [ ] Build pasa (`npm run build`)
- [ ] Archivos sensibles no incluidos (`.env`)
- [ ] Código documentado con JSDoc

### 2. Crear el PR

**Template:**
```markdown
## 🎯 Descripción
[Descripción clara de qué hace este PR]

## 📸 Screenshots/Videos
[Si es UI, agregar capturas]

## 🔗 Issue Relacionado
Closes #123

## 🧪 Cómo Probar
1. Ir a pantalla de INE
2. Subir imagen de INE
3. Verificar que OCR extrae datos

## ✅ Checklist
- [x] Código sigue estándares
- [x] Sin console.log
- [x] TypeScript sin errores
- [x] Build pasa
- [x] Documentación actualizada
```

### 3. Revisión de Código

**Revisores Asignados:**
- Frontend PRs: Frontend Lead
- Backend PRs: Backend Lead
- PRs de integración: Ambos leads

**Criterios de Aprobación:**
- ✅ Al menos 1 aprobación (👍)
- ✅ Checklist completo
- ✅ No hay comentarios sin resolver

**Tiempo de revisión objetivo:** 24 horas

### 4. Merge

**Quién hace merge:**
- El autor del PR (después de aprobación)
- O el revisor (si el autor no está disponible)

**Después del merge:**
- Eliminar la rama
- Mover ticket a "Done"
- Actualizar roadmap si es un hito importante

---

## 🐛 Reporte de Bugs

### Formato de Issue de Bug

```markdown
## 🐛 Bug: [Título descriptivo]

**Severidad:** Crítico / Alto / Medio / Bajo

**Descripción:**
[Descripción clara del problema]

**Steps to Reproduce:**
1. Abrir app
2. Ir a escaneo de INE
3. Subir imagen
4. App crashea

**Expected Behavior:**
[Qué debería pasar]

**Actual Behavior:**
[Qué está pasando]

**Screenshots/Videos:**
[Si aplica]

**Environment:**
- OS: Windows 11
- Browser: Chrome 120
- App Version: 1.0.0

**Additional Context:**
[Stack trace, logs, etc.]
```

### Priorización de Bugs

| Severidad | Descripción | Ejemplo | SLA |
|-----------|-------------|---------|-----|
| 🔴 Crítico | App no funciona | Error 500 en OCR | 24h |
| 🟠 Alto | Feature principal roto | Escaneo no funciona | 3 días |
| 🟡 Medio | Feature secundario | Filtro no guarda | 1 semana |
| 🟢 Bajo | Cosmético, menor | Texto mal alineado | 2 semanas |

---

## 📊 Gestión de Tareas (Sugerencias)

### Opción 1: GitHub Projects (Recomendada)
**Ventajas:** Integrado con issues y PRs, gratis

**Columnas sugeridas:**
- 📋 Backlog
- 📝 To Do (Sprint actual)
- 🚧 In Progress
- 👀 In Review
- ✅ Done

### Opción 2: Trello (Alternativa Simple)
**Ventajas:** Visual, fácil de usar

**Boards sugeridos:**
- Board principal: "PDF Filler Development"
- Listas: Backlog, To Do, Doing, Review, Done

---

## 🎯 Definición de "Done"

Una tarea está completa cuando:
- ✅ Código implementado y funcionando
- ✅ Code review aprobado
- ✅ TypeScript sin errores
- ✅ Build pasa exitosamente
- ✅ Documentación actualizada (si afecta contratos o arquitectura)
- ✅ PR merged a `main`
- ✅ Sin bugs conocidos críticos o altos
- ✅ Feature probada en navegador

---

## 📅 Calendario de Ceremonias

### Semanal

| Día | Hora | Ceremonia | Duración | Asistentes |
|-----|------|-----------|----------|------------|
| Lunes | 9:00 AM | Daily (async) | - | Todos |
| Lunes | 10:00 AM | Sprint Planning | 30 min | Todos |
| Miércoles | 9:00 AM | Daily (async) | - | Todos |
| Miércoles | 3:00 PM | Mid-week Sync | 15 min | Leads |
| Viernes | 9:00 AM | Daily (async) | - | Todos |
| Viernes | 4:00 PM | Sprint Review | 30 min | Todos |

### Mensual
- **Retrospectiva:** Último viernes del mes (45 min)
- **Roadmap Review:** Primer lunes del mes (30 min)

---

## 🚀 Tips para Trabajo Eficiente

1. **Comunicación Asíncrona First**
   - No esperes respuestas inmediatas
   - Documenta decisiones en GitHub/Docs
   - Usa hilos en mensajes para organizar conversaciones

2. **Over-communicate**
   - Si tienes dudas, pregunta
   - Comparte progreso proactivamente
   - Avisa si estarás no disponible

3. **Respeta los Tiempos**
   - Llega a tiempo a las reuniones
   - Respeta el horario de trabajo de otros
   - Define horario de disponibilidad

4. **Documenta Todo**
   - Decisiones importantes → GitHub issues o docs
   - Cambios en contratos → `docs/api/API.md`
   - Problemas conocidos → documentación técnica

5. **Sé Proactivo**
   - No esperes a estar bloqueado para pedir ayuda
   - Revisa PRs de otros proactivamente
   - Comparte conocimiento

---

## 🎉 Celebra los Wins

- ✨ Primer feature completado
- 🚀 MVP desplegado
- 🐛 Bug crítico resuelto
- 📈 Milestone alcanzado

**Cómo celebrar:**
- Mensaje en #general con GIF 🎊
- Mention en la retrospectiva
- Screenshot para portfolio

---

## 📚 Recursos del Equipo

- **Documentación:** `docs/`
- **API Contracts:** `docs/api/API.md`
- **Roadmap:** (por definir)
- **Estándares:** `docs/guides/CODING_STANDARDS.md`

---

**Recordatorio:** Este workflow es flexible. Si algo no funciona, ¡propón mejoras en la retrospectiva!
