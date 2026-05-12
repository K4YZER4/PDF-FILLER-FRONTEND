/**
 * Archivo: revisionFields.ts
 * Propósito:
 * Configuración centralizada de las secciones y campos
 * del formulario de revisión de datos.
 * review-data/RevisionDatos.tsx consume esta configuración para renderizar los campos
 * de forma dinámica, lo que facilita agregar/quitar campos o secciones sin tocar la lógica del componente.
 * Cada sección tiene un id, título, ícono, sección del store a la que corresponde y un array de campos.
 * Cada campo tiene un id, label y placeholder.
 */

import { User, Home, Briefcase, Building } from "lucide-react";

export const sections = [
  {
    id: "personales" as const,
    title: "Datos Personales",
    icon: User,
    section: "ine" as const,

    fields: [
      {
        id: "primerNombre",
        label: "Primer nombre",
        placeholder: "Ej: Juan",
      },
      {
        id: "segundoNombre",
        label: "Segundo nombre",
        placeholder: "Ej: Carlos",
      },
      {
        id: "primerApellido",
        label: "Primer apellido",
        placeholder: "Ej: Pérez",
      },
      {
        id: "segundoApellido",
        label: "Segundo apellido",
        placeholder: "Ej: López",
      },
      {
        id: "curp",
        label: "CURP",
        placeholder: "ABCD001122HDFXXX01",
      },
      {
        id: "sexo",
        label: "Sexo",
        placeholder: "Ej: Masculino",
      },
      {
        id: "fechaNacimiento",
        label: "Fecha de nacimiento",
        placeholder: "DD/MM/AAAA",
      },
      {
        id: "claveElector",
        label: "Clave de elector",
        placeholder: "1234567890123",
      },
    ],
  },

  {
    id: "domicilio" as const,
    title: "Domicilio",
    icon: Home,
    section: "ine" as const,

    fields: [
      {
        id: "calle",
        label: "Calle",
        placeholder: "Ej: Av. Independencia",
      },
      {
        id: "codigoPostal",
        label: "Código postal",
        placeholder: "81200",
      },
      {
        id: "colonia",
        label: "Colonia",
        placeholder: "Ej: Centro",
      },
      {
        id: "noExt",
        label: "No. ext",
        placeholder: "123",
      },
      {
        id: "municipio",
        label: "Municipio",
        placeholder: "Ej: Guasave",
      },
      {
        id: "estado",
        label: "Estado",
        placeholder: "Ej: Sinaloa",
      },
    ],
  },

  {
    id: "laborales" as const,
    title: "Datos Laborales",
    icon: Briefcase,
    section: "nomina" as const,

    fields: [
      {
        id: "rfc",
        label: "RFC",
        placeholder: "ABCD001122XXX",
      },
      {
        id: "noEmpleado",
        label: "No. empleado",
        placeholder: "12345",
      },
      {
        id: "dependencia",
        label: "Dependencia",
        placeholder: "Ej: SEP",
      },
      {
        id: "departamento",
        label: "Departamento",
        placeholder: "Ej: Recursos Humanos",
      },
      {
        id: "puesto",
        label: "Puesto",
        placeholder: "Ej: Analista",
      },
      {
        id: "ingresoMensual",
        label: "Ingreso mensual",
        placeholder: "Ej: 15000",
      },
    ],
  },

  {
    id: "bancarios" as const,
    title: "Datos Bancarios",
    icon: Building,
    section: "banco" as const,

    fields: [
      {
        id: "noCuenta",
        label: "No. de cuenta",
        placeholder: "1234567890",
      },
      {
        id: "banco",
        label: "Banco",
        placeholder: "Ej: BBVA",
      },
      {
        id: "clabe",
        label: "CLABE interbancaria",
        placeholder: "123456789012345678",
      },
    ],
  },
];
