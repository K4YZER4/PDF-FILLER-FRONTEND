/** Entry point de la app. Monta React en el DOM y carga los estilos globales del tema CREDIFOM. */
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./app/App"
import "./app/index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
