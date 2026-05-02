# Guía de Pull Requests – PDF Filler

Esta guía define cómo crear, revisar y mergear Pull Requests (PRs) en el proyecto.

---

## Antes de Crear el PR

### Checklist del Desarrollador:

- [ ] Código sigue los estándares (`CODING_STANDARDS.md`)
- [ ] No hay `console.log` innecesarios
- [ ] TypeScript compila sin errores (`npx tsc --noEmit`)
- [ ] Build pasa exitosamente (`npm run build`)
- [ ] Archivos sensibles no incluidos (`.env`)
- [ ] Código documentado con JSDoc en español
- [ ] Tests escritos y pasando (si aplica)
- [ ] App corre sin errores (`npm run dev`)

---

## Crear el PR

### Template:

```markdown
## 🎯 Descripción
[Descripción clara de qué hace este PR]

## 📸 Screenshots/Videos
[Si es UI, agregar capturas o video]

## 🔗 Issue Relacionado
Closes #123

## 🧪 Cómo Probar
1. Ir a pantalla de INE
2. Subir imagen de INE
3. Verificar que OCR extrae datos correctamente

## ✅ Checklist
- [x] Código sigue estándares
- [x] Sin console.log
- [x] TypeScript sin errores
- [x] Build pasa exitosamente
- [x] Documentación actualizada
- [x] Tests agregados (si aplica)

## 📝 Notas Adicionales
[Cualquier contexto adicional]
```

---

## Revisión de Código

### Revisores Asignados:

- **Frontend PRs:** Frontend Lead
- **Backend PRs:** Backend Lead
- **PRs de integración:** Ambos leads

### Criterios de Aprobación:

- ✅ Al menos 1 aprobación (👍)
- ✅ Checklist completo
- ✅ Build pasa exitosamente
- ✅ No hay comentarios sin resolver

### Tiempo de revisión objetivo: 24 horas

---

## Merge

### Quién hace merge:

- El autor del PR (después de aprobación)
- O el revisor (si el autor no está disponible)

### Después del merge:

- Eliminar la rama
- Actualizar documentación si es necesario
- Mover ticket a "Done"

---

## Definición de "Done" (DoD)

Una tarea está completa cuando:

- ✅ Código implementado y funcionando
- ✅ Code review aprobado
- ✅ TypeScript sin errores
- ✅ Build pasa exitosamente
- ✅ Documentación JSDoc actualizada
- ✅ PR merged a `main`
- ✅ Sin bugs conocidos críticos o altos
- ✅ Feature probada en navegador

---

[Volver a CONTRIBUTING](../CONTRIBUTING.md)
