# Guía de Contribución – PDF Filler

Este documento define de forma general cómo contribuir al proyecto PDF Filler y enlaza a las guías detalladas.

> Antes de contribuir, asegúrate de leer el README del proyecto:
> [README.md](../README.md)

---

## Índice

- [Estructura del proyecto](#estructura-del-proyecto)
- [Convenciones de código](#convenciones-de-código)
- [Dependencias](#dependencias-del-proyecto)
- [Flujo de trabajo con Git](#flujo-de-trabajo-con-git)
- [Pull Requests](#pull-requests)
- [Comunicación del equipo](#comunicación-del-equipo)

---

## Estructura del proyecto

La estructura completa del repositorio y las responsabilidades de cada carpeta se describen en:

- **[Estructura del proyecto](./architecture/FOLDER_STRUCTURE.md)**
- [Arquitectura de componentes](./architecture/COMPONENTS_ARCHITECTURE.md)

---

## Convenciones de código

Las reglas de estilo, tamaño de archivos, calidad, pruebas, variables de entorno y seguridad están en:

- [Convenciones de código](./guides/CODING_STANDARDS.md)

---

## Dependencias del proyecto

Todas las reglas sobre instalación y documentación de dependencias están en:

- [Dependencias del proyecto](./DEPENDENCIES.md)

---

## Flujo de trabajo con Git

El flujo basado en GitHub Flow, tipos de ramas y convención de commits se documenta en:

- [GitHub Flow](./workflows/GIT_WORKFLOW.md)

---

## Pull Requests

Las reglas para crear PRs, checklist obligatorio y definición de terminado (DoD) están en:

- [Guía de Pull Requests](./workflows/PULL_REQUESTS.md)

---

## Reporte de errores

Antes de crear un issue, revisa la sección de troubleshooting:

- [Solución de problemas](./troubleshooting/index.md)

---

## Comunicación del equipo

- Avisar cuando se trabaje en archivos críticos
- No modificar archivos ajenos sin avisar
- Resolver conflictos de merge con cuidado
- Preguntar antes de hacer cambios grandes
- Mantener documentación actualizada (JSDoc en español)

---

## Estándares de Documentación

- Todo código debe tener JSDoc en **español**
- Formato: `/** ... */` para archivos, funciones y componentes
- Explicar: qué hace, cómo funciona, por qué existe
- Incluir documentación de props en componentes React
- Mantener barril `index.ts` en módulos principales

---

[Volver al README principal](../README.md)
