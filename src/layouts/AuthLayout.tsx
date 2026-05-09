/** Layout público para pantallas de autenticación.
 *  Actualmente es un pass-through. LoginPage maneja su propio
 *  layout de pantalla completa (dos columnas desktop / columna móvil).
 *  Reservado para cuando se agreguen más rutas públicas que compartan
 *  estructura (ej: recuperar contraseña, registro). */
function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export { AuthLayout };
