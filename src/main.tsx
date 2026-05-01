/**
 * Archivo: main.tsx
 * Propósito: Punto de entrada principal de la aplicación React.
 * Inicializa el renderizado de la app en el DOM dentro del modo StrictMode.
 */
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css" // Estilos globales con Tailwind CSS
import App from "./App" // Componente raíz de la aplicación

// Renderiza la aplicación en el elemento con id "root" del HTML
createRoot(document.getElementById("root")!).render(
  <StrictMode> {/* Modo estricto para detectar errores comunes durante el desarrollo */}
    <App />
  </StrictMode>
)
