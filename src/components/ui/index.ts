/** Barrel export de todos los componentes UI del design system.
 *  Cada componente se exporta desde su archivo individual y se re-exporta
 *  desde aquí para importar todo desde @/components/ui. */
export { Input } from "./Input";
export type { InputProps } from "./Input";

export { Button } from "./Button";

export { Badge } from "./Badge";
export type { BadgeVariant, BadgeProps } from "./Badge";

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog";

export { NameInput } from "./NameInput";
export { NumericInput } from "./NumericInput";
export { DateInput } from "./DateInput";
