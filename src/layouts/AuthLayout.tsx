/** Layout público para pantallas de autenticación.
 *  Muestra el logo de CREDIFOM centrado y el contenido (formulario de login) debajo.
 *  Fondo claro con altura mínima de pantalla completa. */
import { FileText } from "lucide-react";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <FileText size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            Generador de Contratos
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            CREDIFOM, S.A.P.I. de C.V.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

export { AuthLayout };
