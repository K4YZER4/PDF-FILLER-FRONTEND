/** Layout principal para pantallas internas (historial).
 *  Header sticky con título, botón "Nuevo contrato" y botón de cerrar sesión.
 *  showActions=false oculta los botones del header. */
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import { Button } from "@/components";
import { useContractStore } from "@/store/useContractStore";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showActions?: boolean;
}

function AppLayout({
  children,
  title = "Historial",
  showActions = true,
}: AppLayoutProps) {
  const navigate = useNavigate();
  const logout = useContractStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-text-primary">{title}</h1>
          {showActions && (
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => navigate("/contracts/upload")}>
                <Plus size={14} /> Nuevo contrato
              </Button>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-stone-50 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

export { AppLayout };
