# Solución de Problemas – PDF Filler

---

## Problemas de Instalación

### Error: "npm install falla"
**Causa:** Conflictos de dependencias o caché corrupta.

**Solución:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Error: "Node.js version incompatible"
**Causa:** Versión de Node no soportada.

**Solución:** Requiere Node.js 18+. Usar nvm para cambiar versiones.

---

## Problemas de Desarrollo

### Error: "Cannot connect to API"
**Causa:** Backend no está corriendo o URL incorrecta.

**Solución:**
1. Verificar que backend esté corriendo
2. Revisar `.env`: `VITE_API_URL=http://localhost:3000`
3. Reiniciar servidor: `npm run dev`

### Error: "TypeScript errors"
**Causa:** Errores de tipado.

**Solución:**
```bash
npx tsc --noEmit
# Corregir errores mostrados
```

### Error: "Port 5173 already in use"
**Causa:** Puerto ocupado.

**Solución:**
```bash
npm run dev -- --port 3001
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
npx tsc --noEmit
npm run dev   # revisar consola del navegador
```

### Error: "CSS syntax error" (Tailwind)
**Causa:** Comentarios `//` en CSS o sintaxis incorrecta.

**Solución:** Usar `/* */` para comentarios en CSS. Verificar `index.css`.

---

## Problemas de OCR y PDF

### Error: "Scan falla / No se procesa imagen"
**Causa:** Backend no responde o imagen inválida.

**Solución:**
1. Verificar formato de archivo (JPG, PNG, PDF)
2. Verificar tamaño máximo (10MB)
3. Revisar consola del backend

### Error: "PDF no se genera"
**Causa:** Faltan datos o backend falla.

**Solución:**
1. Verificar que se haya calculado la tabla primero
2. Revisar que todos los campos requeridos estén llenos
3. Revisar [docs/api/API.md](../api/API.md) para formato correcto

---

## Problemas de Git

### Error: "Merge conflicts"
**Solución:**
```bash
git status                                # ver conflictos
# Editar archivos, eliminar marcadores <<<, ===, >>>
git add .
git commit -m "fix: resolver conflictos de merge"
```

### Error: "Cannot push to main"
**Solución:** main está protegida. Crear rama feature y PR.

---

## Problemas de Rendimiento

### Lento al recargar (HMR no funciona)
**Solución:** Dividir archivos > 200 líneas. Verificar `vite.config.ts`.

---

## Contacto y Soporte

Si no encuentras solución:

1. Revisar `docs/` completo
2. Buscar en issues de GitHub
3. Preguntar en canal del equipo
4. [Crear issue con formato de bug](../team/TEAM_WORKFLOW.md#reporte-de-bugs)

---

## Recursos Útiles

- [Documentación de Vite](https://vitejs.dev/guide/troubleshooting.html)
- [Documentación de React](https://react.dev/learn/troubleshooting)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Tailwind](https://tailwindcss.com/docs)

---

[Volver a CONTRIBUTING](../CONTRIBUTING.md)
