/** Combina clases de Tailwind con merge inteligente.
 *  clsx + tailwind-merge para resolver conflictos de clases
 *  (ej: "px-4 px-6" → solo "px-6").
 *
 *  Uso:
 *    cn("text-sm", isActive && "text-primary", className) */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
