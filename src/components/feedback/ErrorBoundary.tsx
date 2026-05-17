/**
 * Archivo: src/components/feedback/ErrorBoundary.tsx
 *
 * React Error Boundary para capturar errores de renderizado
 * y mostrar una UI fallback en lugar de que crashee toda la app.
 *
 * Uso:
 *   <ErrorBoundary fallback={<ErrorFallback />}>
 *     <ComponenteQuePuedeFallar />
 *   </ErrorBoundary>
 *
 * También expone un hook useErrorBoundary para logging global.
 */

import { Component, createElement } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";
import { Card } from "@/components";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Mensaje personalizado para el contexto (ej: "Error al cargar contratos") */
  context?: string;
  /** Si se provee, se llamará con el error para logging externo */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return createElement(ErrorFallback, {
        message: this.props.context,
        onRetry: this.handleRetry,
      });
    }

    return this.props.children;
  }
}

// ─── Fallback visual ─────────────────────────────────────────────────────────

interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

function ErrorFallback({ message, onRetry }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-screen flex-1 p-6">
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        <AlertTriangle size={48} className="mx-auto text-warning" />
        <h2 className="text-lg font-semibold text-text-primary">
          Algo salió mal
        </h2>
        <p className="text-sm text-text-secondary">
          {message || "Ocurrió un error inesperado. Intenta de nuevo."}
        </p>
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            leftIcon={<RefreshCw size={16} />}
          >
            Reintentar
          </Button>
        )}
      </Card>
    </div>
  );
}

export { ErrorBoundary, ErrorFallback };
export type { ErrorBoundaryProps, ErrorFallbackProps };
