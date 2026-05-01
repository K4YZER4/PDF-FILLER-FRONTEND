# Solución de Problemas – PDF Filler

Guía rápida para resolver errores comunes en el desarrollo.

---

## Problemas de Instalación

### Error: "npm install falla"
**Causa:** Conflictos de dependencias o caché corrupta.

**Solución:**
```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

### Error: "Node.js version incompatible"
**Causa:** Versión de Node no soportada.

**Solución:**
```bash
# Verificar versión actual
node -v

# Requiere Node.js 18+
# Instalar nvm (Node Version Manager) para cambiar versiones
```

---

## Problemas de Desarrollo

### Error: "Cannot connect to API" (Error 404/500)
**Causa:** Backend no está corriendo o URL incorrecta.

**Solución:**
1. Verificar que backend esté corriendo en `localhost:3000`
2. Revisar `.env`:
   ```
   VITE_API_URL=http://localhost:3000
   ```
3. Reiniciar servidor frontend:
   ```bash
   npm run dev
   ```

---

### Error: "TypeScript errors" (tsc --noEmit)
**Causa:** Errores de tipado.

**Solución:**
```bash
# Ver errores detallados
npx tsc --noEmit

# Corregir errores mostrados
# Verificar imports y tipos
```

---

### Error: "Port 5173 already in use"
**Causa:** Puerto ocupado por otra instancia.

**Solución:**
```bash
# Cambiar puerto
npm run dev -- --port 3001

# O matar proceso en el puerto
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## Problemas de Build

### Error: "npm run build falla"
**Causa:** TypeScript errors o errores de sintaxis.

**Solución:**
```bash
# Verificar TypeScript
npx tsc --noEmit

# Verificar syntax JSX/CSS
npm run dev # y revisar consola del navegador
```

---

### Error: "CSS syntax error" (Tailwind)
**Causa:** Comentarios `//` en CSS o sintaxis incorrecta.

**Solución:**
- CSS no soporta `//` para comentarios, usar `/* */`
- Verificar `index.css` no tenga comentarios inválidos
- Revisar configuración de Tailwind

---

## Problemas de OCR y PDF

### Error: "Scan falla / No se procesa imagen"
**Causa:** Backend no responde o imagen inválida.

**Solución:**
1. Verificar formato de archivo (JPG, PNG, PDF)
2. Verificar tamaño máximo (10MB)
3. Revisar consola del backend para errores
4. Probar con imagen diferente

---

### Error: "PDF no se genera"
**Causa:** Faltan datos o backend falla.

**Solución:**
1. Verificar que se haya calculado la tabla primero
2. Revisar que todos los campos requeridos estén llenos
3. Verificar consola del backend
4. Revisar `docs/api/API.md` para formato correcto

---

## Problemas de Git

### Error: "Merge conflicts"
**Causa:** Cambios en la misma línea de código.

**Solución:**
```bash
# 1. Ver archivos con conflictos
git status

# 2. Abrir archivo y buscar
<<<<<<< HEAD
código actual
=======
código de la otra rama
>>>>>>> feature/nombre

# 3. Editar manualmente, elegir qué código mantener
# 4. Eliminar marcadores <<<, ===, >>>
# 5. Hacer commit
git add .
git commit -m "fix: resolver conflictos de merge"
```

---

### Error: "Cannot push to main"
**Causa:** Rama main protegida.

**Solución:**
```bash
# Crear rama feature
git checkout -b feature/mi-cambio

# Hacer push de la rama
git push origin feature/mi-cambio

# Crear PR desde GitHub
```

---

## Problemas de Rendimiento

### Lento al recargar (HMR no funciona)
**Causa:** Archivos muy grandes o dependencias pesadas.

**Solución:**
- Dividir archivos > 200 líneas
- Verificar que Vite esté configurado correctamente
- Revisar `vite.config.ts`

---

## Contacto y Soporte

Si no encuentras solución:

1. Revisar `docs/` completo
2. Buscar en issues de GitHub
3. Preguntar en canal `#bugs` de Discord/Slack
4. Crear issue con formato de bug (ver `docs/team/TEAM_WORKFLOW.md`)

---

## Recursos Útiles

- [Documentación de Vite](https://vitejs.dev/guide/troubleshooting.html)
- [Documentación de React](https://react.dev/learn/troubleshooting)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Tailwind](https://tailwindcss.com/docs)

---

[Volver a CONTRIBUTING](../CONTRIBUTING.md)
