# Documentación del Proyecto PDF-FILLER-FRONTEND

## Índice de Documentos

1. [Arquitectura del Proyecto](./ARCHITECTURE.md) - Estructura, tecnologías y flujo
2. [Guía de Configuración](./SETUP.md) - Instalación y variables de entorno

## Resumen de Documentación en Código

Todos los archivos de código han sido documentados con comentarios JSDoc explicando:

- **Propósito de cada archivo**
- **Qué hace cada sección/componente**
- **Qué hacen las funciones principales**
- **Tipos de datos y sus campos**

## Estructura de Documentación

### Archivos Principales
- `src/main.tsx` - Punto de entrada de React
- `src/App.tsx` - Componente raíz con navegación por pestañas
- `src/index.css` - Estilos globales y tema

### Tipos (types/)
- Definición de todas las interfaces y tipos TypeScript
- Comentarios en cada campo explicando su propósito

### Estado Global (store/)
- `useContractStore.ts` - Store de Zustand con toda la lógica de estado

### Servicios API (services/)
- Comentarios en cada función de servicio explicando su propósito y parámetros

### Componentes (components/)
- Documentados por categorías: ui, layout, forms, upload, feedback
- Cada componente tiene explicación de props y comportamiento

### Características (features/)
- Pantallas completas (INE, Nómina, Crédito)
- Esquemas de validación Zod documentados

## Cómo Usar Esta Documentación

1. **Para entender un archivo**: Lee los comentarios JSDoc al inicio de cada archivo
2. **Para entender funciones**: Lee los comentarios antes de cada función
3. **Para entender componentes**: Revisa los comentarios en las interfaces de props
4. **Para configuración general**: Lee los archivos en la carpeta `docs/`

## Convenciones de Documentación

- Se usó español para mantener consistencia con el código
- Formato JSDoc para tipos y funciones
- Comentarios inline para lógica compleja
- Explicación de propósitos y comportamientos, no implementación obvia
