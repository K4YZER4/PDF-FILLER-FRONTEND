/**
 * Barrel export de components/loan-data.
 *
 * Exporta todas las secciones del accordion del paso 3.
 * ContactoFields reemplazó a ContactoSection en la migración
 * al patrón config-driven; ahora lee/escribe directamente en Zustand
 * sin pasar por el hook.
 *
 * Componentes por tipo de sección:
 *   - Per-component con lógica única: PrestamoSection, AsesorSection
 *   - Per-component con lógica propia: AntiguedadSection, ReferenciasSection
 *   - Config-driven (constants + fieldRenderer): ContactoFields
 *   - Utilidad compartida: SelectField, AccordionSection
 */

export { AccordionSection }  from "./AccordionSection"
export { SelectField }       from "./SelectField"
export { PrestamoSection }   from "./PrestamoSection"
export { AsesorSection }     from "./AsesorSection"
export { ContactoFields }    from "./ContactoFields"
export { AntiguedadSection } from "./AntiguedadSection"
export { ReferenciasSection } from "./ReferenciasSection"
