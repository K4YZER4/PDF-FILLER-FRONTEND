/**
 * ──────────────────────────────────────────────────────────────────────────────
 * CreditoAsesor.tsx  —  Paso 3 del flujo: Datos del préstamo + complementarios
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * Secciones tipo accordion (mismo patrón que RevisionDatos en paso 2):
 *   1. Préstamo           → monto neto, plazo quincenas, Calcular + resultados
 *   2. Datos del Asesor   → folio, sucursal, vendedor, asesor, fechas, lugar, mes/año
 *   3. Contacto y Estado Civil → teléfonos, correo, estado civil
 *   4. Antigüedad         → fecha ingreso, meses, años
 *   5. Referencias        → 3 referencias con nombre y teléfono
 *   6. Resumen            → cliente, monto, plazo
 *
 * Visual (accordion):
 *   - Borde verde  → sección completa
 *   - Borde rojo   → colapsada con campos vacíos
 *   - Check verde  → todos los campos llenos
 *   - Alerta naranja → colapsada con pendientes
 *
 * Almacenamiento:
 *   - Los campos se guardan en propiedades directas de FormDataState
 *     (asesorData, contactoData, antiguedadData, referencias) para
 *     asegurar reactividad correcta con Zustand.
 * ──────────────────────────────────────────────────────────────────────────────
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  TrendingUp,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  User,
  Phone,
  Calendar,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button, Input } from "@/components/ui";
import { Card } from "@/components";
import { NameInput, NumericInput, DateInput } from "@/features/review-data/components";
import { useContractStore } from "@/store/useContractStore";

// ─── Tipos internos ───────────────────────────────────────────────────────────

interface AsesorData {
  folio: string;
  sucursal: string;
  numVendedor: string;
  asesor: string;
  fechaContrato: string;
  fechaArranque: string;
  lugar: string;
  mesDescuento: string;
  anioDescuento: string;
}

interface ContactoData {
  tel: string;
  celular: string;
  telCasa: string;
  correo: string;
  estadoCivil: string;
}

interface AntiguedadData {
  fechaIngreso: string;
  meses: string;
  anos: string;
}

interface ReferenciaItem {
  nombre: string;
  telefono: string;
}

// ─── Configuración de secciones del accordion ─────────────────────────────────

interface SectionConfig {
  id: string;
  title: string;
  icon: LucideIcon;
}

const SECTIONS: SectionConfig[] = [
  { id: "prestamo", title: "Préstamo", icon: TrendingUp },
  { id: "asesor", title: "Datos del Asesor", icon: User },
  { id: "contacto", title: "Contacto y Estado Civil", icon: Phone },
  { id: "antiguedad", title: "Antigüedad", icon: Calendar },
  { id: "referencias", title: "Referencias", icon: Users },
];

// ─── Constantes de dominio ────────────────────────────────────────────────────

const ASESORES_REGISTRADOS = [
  "MARIA LOPEZ GARCIA",
  "JORGE CRUZ SOTO",
  "ANA GARCIA MARTINEZ",
  "PEDRO MARTINEZ RAMIREZ",
];

const MESES = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
];

const ESTADOS_CIVILES = ["SOLTERO", "CASADO", "DIVORCIADO", "UNIÓN LIBRE"];

// ─── Helpers de validación ────────────────────────────────────────────────────

function isAsesorComplete(data: AsesorData): boolean {
  return (
    (data.folio?.length ?? 0) === 5 &&
    (data.sucursal?.trim()?.length ?? 0) > 0 &&
    (data.numVendedor?.length ?? 0) === 3 &&
    (data.asesor?.trim()?.length ?? 0) > 0 &&
    (data.fechaContrato?.length ?? 0) > 0 &&
    (data.fechaArranque?.length ?? 0) > 0 &&
    (data.lugar?.trim()?.length ?? 0) > 0 &&
    (data.mesDescuento?.length ?? 0) > 0 &&
    (data.anioDescuento?.length ?? 0) === 4
  );
}

function isContactoComplete(data: ContactoData): boolean {
  return (
    (data.tel?.length ?? 0) === 10 &&
    (data.celular?.length ?? 0) === 10 &&
    (data.telCasa?.length ?? 0) === 10 &&
    (data.correo?.includes?.("@") ?? false) &&
    (data.estadoCivil?.length ?? 0) > 0
  );
}

function isAntiguedadComplete(data: AntiguedadData): boolean {
  return (
    (data.fechaIngreso?.length ?? 0) > 0 &&
    (data.meses?.length ?? 0) > 0 &&
    (data.anos?.length ?? 0) > 0
  );
}

function isReferenciasComplete(data: [ReferenciaItem, ReferenciaItem, ReferenciaItem]): boolean {
  return data.every((r) => (r?.nombre?.trim()?.length ?? 0) > 0 && (r?.telefono?.length ?? 0) === 10);
}

// ─── Componente ───────────────────────────────────────────────────────────────

function CreditoAsesor() {
  const store = useContractStore();

  const clientName =
    [
      (store.formData.ine as any)?.primerNombre,
      (store.formData.ine as any)?.segundoNombre,
      (store.formData.ine as any)?.primerApellido,
      (store.formData.ine as any)?.segundoApellido,
    ]
      .filter(Boolean)
      .join(" ")
      .toUpperCase() || "CLIENTE";

  const userRole = store.auth.role;
  const userName = store.auth.user ?? "";

  // ── Accordion state ─────────────────────────────────────────────────────────
  const [expandedSection, setExpandedSection] = useState<string | null>("prestamo");

  const toggleSection = (id: string) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  };

  // ── Estado local: préstamo ──────────────────────────────────────────────────
  const [monto, setMonto] = useState(
    store.formData.capitalMonto > 0 ? String(store.formData.capitalMonto) : "",
  );
  const [plazo, setPlazo] = useState(store.formData.plazoQnas || 48);
  const [isCalculando, setIsCalculando] = useState(false);
  const [resultado, setResultado] = useState<{
    montoPagare: number;
    descuentoQuincenal: number;
    tasaMensual: number;
    cat: number;
  } | null>(store.formData.tabla);

  // ── Estado local: datos complementarios ─────────────────────────────────────
  const [asesorData, setAsesorData] = useState<AsesorData>(() => {
    const saved = (store.formData.asesorData || {}) as Record<string, string>;
    return {
      folio: saved.folio ?? "",
      sucursal: saved.sucursal ?? "",
      numVendedor: saved.numVendedor ?? "",
      asesor: saved.asesor ?? (userRole !== "admin" ? userName : ""),
      fechaContrato: saved.fechaContrato ?? "",
      fechaArranque: saved.fechaArranque ?? "",
      lugar: saved.lugar ?? "",
      mesDescuento: saved.mesDescuento ?? "",
      anioDescuento: saved.anioDescuento ?? "",
    } as AsesorData;
  });
  const [contactoData, setContactoData] = useState<ContactoData>(() => {
    const saved = (store.formData.contactoData || {}) as Record<string, string>;
    return {
      tel: saved.tel ?? "",
      celular: saved.celular ?? "",
      telCasa: saved.telCasa ?? "",
      correo: saved.correo ?? "",
      estadoCivil: saved.estadoCivil ?? "",
    } as ContactoData;
  });
  const [antiguedadData, setAntiguedadData] = useState<AntiguedadData>(() => {
    const saved = (store.formData.antiguedadData || {}) as Record<string, string>;
    return {
      fechaIngreso: saved.fechaIngreso ?? "",
      meses: saved.meses ?? "",
      anos: saved.anos ?? "",
    } as AntiguedadData;
  });
  const [referencias, setReferencias] = useState<
    [ReferenciaItem, ReferenciaItem, ReferenciaItem]
  >(() => {
    const saved = (store.formData.referencias || []) as Array<Record<string, string>>;
    return [0, 1, 2].map((i) => ({
      nombre: saved[i]?.nombre ?? "",
      telefono: saved[i]?.telefono ?? "",
    })) as [ReferenciaItem, ReferenciaItem, ReferenciaItem];
  });

  // ── Persistencia en store ───────────────────────────────────────────────────
  useEffect(() => {
    store.setFormData("capitalMonto", monto === "" ? 0 : Number(monto));
  }, [monto]);

  useEffect(() => {
    store.setFormData("plazoQnas", plazo);
  }, [plazo]);

  useEffect(() => { store.setFormData("asesorData", asesorData as any); }, [asesorData]);
  useEffect(() => { store.setFormData("contactoData", contactoData as any); }, [contactoData]);
  useEffect(() => { store.setFormData("antiguedadData", antiguedadData as any); }, [antiguedadData]);
  useEffect(() => { store.setFormData("referencias", referencias as any); }, [referencias]);

  // ── Completitud de secciones ────────────────────────────────────────────────
  const prestamoComplete = monto !== "" && Number(monto) > 0 && Number(monto) % 1000 === 0;

  const completion = useMemo(() => ({
    prestamo: prestamoComplete,
    asesor: isAsesorComplete(asesorData),
    contacto: isContactoComplete(contactoData),
    antiguedad: isAntiguedadComplete(antiguedadData),
    referencias: isReferenciasComplete(referencias),
  }), [prestamoComplete, asesorData, contactoData, antiguedadData, referencias]);

  // ── Helpers de actualización ────────────────────────────────────────────────
  const updateAsesor = useCallback(<K extends keyof AsesorData>(key: K, value: AsesorData[K]) => {
    setAsesorData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateContacto = useCallback(<K extends keyof ContactoData>(key: K, value: ContactoData[K]) => {
    setContactoData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateAntiguedad = useCallback(<K extends keyof AntiguedadData>(key: K, value: AntiguedadData[K]) => {
    setAntiguedadData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateReferencia = useCallback((index: number, field: keyof ReferenciaItem, value: string) => {
    setReferencias((prev) => {
      const next = [...prev] as [ReferenciaItem, ReferenciaItem, ReferenciaItem];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  // ── Cálculo ─────────────────────────────────────────────────────────────────
  const calcular = async () => {
    if (!monto || Number(monto) <= 0) return;
    setIsCalculando(true);
    await new Promise((r) => setTimeout(r, 1000));
    const m = Number(monto);
    const res = {
      montoPagare: m * 1.15,
      descuentoQuincenal: (m * 1.15) / plazo,
      tasaMensual: 0.025,
      cat: 0.32,
    };
    setResultado(res);
    store.setFormData("tabla", res);
    setIsCalculando(false);
  };

  // ── Render de sección accordion ─────────────────────────────────────────────
  type SectionId = (typeof SECTIONS)[number]["id"];
  const sectionCompletion: Record<SectionId, boolean> = completion as Record<SectionId, boolean>;

  const renderAccordionSection = (
    section: SectionConfig,
    isComplete: boolean,
    children: React.ReactNode,
  ) => {
    const isExpanded = expandedSection === section.id;
    const isCollapsedWithIssues = !isExpanded && !isComplete;
    const cardBorder = isComplete
      ? "border-success/30"
      : isCollapsedWithIssues
        ? "border-error/40"
        : "border-border";

    return (
      <Card className={`overflow-hidden border-2 transition-colors ${cardBorder}`}>
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-bg transition-colors"
          onClick={() => toggleSection(section.id)}
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-2.5">
            <section.icon size={20} className="text-primary shrink-0" aria-hidden="true" />
            <span className="text-sm font-semibold text-text-primary">{section.title}</span>
            {isComplete ? (
              <CheckCircle2 size={16} className="text-success shrink-0" aria-label="Sección completa" />
            ) : isCollapsedWithIssues ? (
              <AlertTriangle size={16} className="text-warning shrink-0" aria-label="Faltan datos obligatorios" />
            ) : null}
          </div>
          <ChevronDown
            size={18}
            className={`text-text-secondary transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
        {isExpanded && (
          <div className="px-4 md:px-5 pb-5">{children}</div>
        )}
      </Card>
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4 md:p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Datos del Préstamo
        </h2>
        <p className="text-sm text-text-secondary">
          Configura los términos del crédito
        </p>
      </div>

      <div className="space-y-3">
        {/* ─── PRÉSTAMO ─────────────────────────────────────────────────────── */}
        {renderAccordionSection(SECTIONS[0], sectionCompletion["prestamo"],
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Monto neto (capital)</label>
                <Input
                  placeholder="Ej: $15000"
                  value={monto}
                  type="number"
                  error={monto === "" ? "Campo requerido" : (Number(monto) <= 0 || Number(monto) % 1000 !== 0) ? "Debe ser múltiplo de 1000" : undefined}
                  success={prestamoComplete}
                  onChange={(e) => {
                    setMonto(e.target.value);
                    if (store.formData.tabla) store.setFormData("tabla", null);
                    setResultado(null);
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Plazo (quincenas)</label>
                <div className="flex gap-2 flex-wrap">
                  {[24, 36, 48, 72, 96, 120].map((q) => (
                    <button
                      key={q}
                      onClick={() => setPlazo(q)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                        plazo === q
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-text-secondary border-border hover:border-primary"
                      }`}
                    >
                      {q} QNAs
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button
              onClick={calcular}
              loading={isCalculando}
              disabled={!monto || Number(monto) <= 0}
              size="lg"
            >
              <TrendingUp size={16} /> Calcular
            </Button>
            {resultado && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Monto pagaré", value: `$${resultado.montoPagare.toLocaleString()}` },
                  { label: "Descuento quincenal", value: `$${resultado.descuentoQuincenal.toLocaleString()}` },
                  { label: "Tasa mensual", value: `${(resultado.tasaMensual * 100).toFixed(1)}%` },
                  { label: "CAT anual", value: `${(resultado.cat * 100).toFixed(1)}%` },
                ].map((item) => (
                  <div key={item.label} className="bg-bg border border-border rounded-lg p-4">
                    <div className="text-xs text-text-secondary mb-1">{item.label}</div>
                    <div className="text-lg font-semibold text-primary">{item.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>,
        )}

        {/* ─── DATOS DEL ASESOR ──────────────────────────────────────────────── */}
        {renderAccordionSection(SECTIONS[1], sectionCompletion["asesor"],
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Folio <span className="text-error">*</span></label>
              <NumericInput
                placeholder="5 dígitos"
                value={asesorData.folio}
                maxLength={5}
                success={(asesorData.folio?.length ?? 0) === 5}
                error={(asesorData.folio?.length ?? 0) > 0 && (asesorData.folio?.length ?? 0) !== 5 ? "Deben ser 5 dígitos" : undefined}
                onChange={(v) => updateAsesor("folio", v)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Sucursal <span className="text-error">*</span></label>
              <NameInput
                placeholder="Solo letras"
                value={asesorData.sucursal}
                success={(asesorData.sucursal?.trim()?.length ?? 0) > 0}
                onChange={(v) => updateAsesor("sucursal", v)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Num. Vendedor <span className="text-error">*</span></label>
              <NumericInput
                placeholder="3 dígitos"
                value={asesorData.numVendedor}
                maxLength={3}
                success={(asesorData.numVendedor?.length ?? 0) === 3}
                error={(asesorData.numVendedor?.length ?? 0) > 0 && (asesorData.numVendedor?.length ?? 0) !== 3 ? "Deben ser 3 dígitos" : undefined}
                onChange={(v) => updateAsesor("numVendedor", v)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Asesor <span className="text-error">*</span></label>
              {userRole === "admin" ? (
                <SelectField
                  value={asesorData.asesor}
                  onChange={(v) => updateAsesor("asesor", v)}
                  options={ASESORES_REGISTRADOS}
                  placeholder="Seleccionar asesor"
                   success={(asesorData.asesor?.trim()?.length ?? 0) > 0}
                />
              ) : (
                <Input value={userName} disabled success={userName.length > 0} className="text-text-primary" />
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Fecha Contrato <span className="text-error">*</span></label>
              <DateInput
                value={asesorData.fechaContrato}
                success={(asesorData.fechaContrato?.length ?? 0) > 0}
                onChange={(v) => updateAsesor("fechaContrato", v)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Fecha Arranque <span className="text-error">*</span></label>
              <DateInput
                value={asesorData.fechaArranque}
                success={(asesorData.fechaArranque?.length ?? 0) > 0}
                onChange={(v) => updateAsesor("fechaArranque", v)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Lugar <span className="text-error">*</span></label>
              <NameInput
                placeholder="Solo letras"
                value={asesorData.lugar}
                success={(asesorData.lugar?.trim()?.length ?? 0) > 0}
                onChange={(v) => updateAsesor("lugar", v)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Mes de Descuento <span className="text-error">*</span></label>
              <SelectField
                value={asesorData.mesDescuento}
                onChange={(v) => updateAsesor("mesDescuento", v)}
                options={MESES}
                placeholder="Seleccionar mes"
                success={(asesorData.mesDescuento?.length ?? 0) > 0}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Año de Descuento <span className="text-error">*</span></label>
              <NumericInput
                placeholder="4 dígitos"
                value={asesorData.anioDescuento}
                maxLength={4}
                success={(asesorData.anioDescuento?.length ?? 0) === 4}
                error={(asesorData.anioDescuento?.length ?? 0) > 0 && (asesorData.anioDescuento?.length ?? 0) !== 4 ? "Deben ser 4 dígitos" : undefined}
                onChange={(v) => updateAsesor("anioDescuento", v)}
              />
            </div>
          </div>,
        )}

        {/* ─── CONTACTO Y ESTADO CIVIL ──────────────────────────────────────── */}
        {renderAccordionSection(SECTIONS[2], sectionCompletion["contacto"],
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Tel <span className="text-error">*</span></label>
              <NumericInput
                placeholder="10 dígitos"
                value={contactoData.tel}
                maxLength={10}
                success={(contactoData.tel?.length ?? 0) === 10}
                error={(contactoData.tel?.length ?? 0) > 0 && (contactoData.tel?.length ?? 0) !== 10 ? "Deben ser 10 dígitos" : undefined}
                onChange={(v) => updateContacto("tel", v)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Celular <span className="text-error">*</span></label>
              <NumericInput
                placeholder="10 dígitos"
                value={contactoData.celular}
                maxLength={10}
                success={(contactoData.celular?.length ?? 0) === 10}
                error={(contactoData.celular?.length ?? 0) > 0 && (contactoData.celular?.length ?? 0) !== 10 ? "Deben ser 10 dígitos" : undefined}
                onChange={(v) => updateContacto("celular", v)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Tel. Casa <span className="text-error">*</span></label>
              <NumericInput
                placeholder="10 dígitos"
                value={contactoData.telCasa}
                maxLength={10}
                success={(contactoData.telCasa?.length ?? 0) === 10}
                error={(contactoData.telCasa?.length ?? 0) > 0 && (contactoData.telCasa?.length ?? 0) !== 10 ? "Deben ser 10 dígitos" : undefined}
                onChange={(v) => updateContacto("telCasa", v)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Correo <span className="text-error">*</span></label>
              <Input
                type="email"
                placeholder="correo@ejemplo.com"
                value={contactoData.correo}
                success={(contactoData.correo?.includes?.("@") ?? false)}
                onChange={(e) => updateContacto("correo", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Estado Civil <span className="text-error">*</span></label>
              <SelectField
                value={contactoData.estadoCivil}
                onChange={(v) => updateContacto("estadoCivil", v)}
                options={ESTADOS_CIVILES}
                placeholder="Seleccionar"
                success={(contactoData.estadoCivil?.length ?? 0) > 0}
              />
            </div>
          </div>,
        )}

        {/* ─── ANTIGÜEDAD ───────────────────────────────────────────────────── */}
        {renderAccordionSection(SECTIONS[3], sectionCompletion["antiguedad"],
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Fecha de Ingreso <span className="text-error">*</span></label>
              <DateInput
                value={antiguedadData.fechaIngreso}
                success={(antiguedadData.fechaIngreso?.length ?? 0) > 0}
                onChange={(v) => updateAntiguedad("fechaIngreso", v)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Meses <span className="text-error">*</span></label>
              <NumericInput
                placeholder="0"
                value={antiguedadData.meses}
                maxLength={3}
                success={(antiguedadData.meses?.length ?? 0) > 0}
                onChange={(v) => updateAntiguedad("meses", v)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Años <span className="text-error">*</span></label>
              <NumericInput
                placeholder="0"
                value={antiguedadData.anos}
                maxLength={3}
                success={(antiguedadData.anos?.length ?? 0) > 0}
                onChange={(v) => updateAntiguedad("anos", v)}
              />
            </div>
          </div>,
        )}

        {/* ─── REFERENCIAS ──────────────────────────────────────────────────── */}
        {renderAccordionSection(SECTIONS[4], sectionCompletion["referencias"],
          <div className="space-y-2">
            {([1, 2, 3] as const).map((num) => {
              const idx = num - 1;
              return (
                <div key={num} className="py-3 space-y-2">
                  <p className="text-xs font-semibold text-text-secondary uppercase">Referencia {num}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-secondary">Nombre <span className="text-error">*</span></label>
                      <NameInput
                        placeholder="Nombre completo"
                        value={referencias[idx].nombre}
                        success={(referencias[idx]?.nombre?.trim()?.length ?? 0) > 0}
                        onChange={(v) => updateReferencia(idx, "nombre", v)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-text-secondary">Teléfono <span className="text-error">*</span></label>
                      <NumericInput
                        placeholder="10 dígitos"
                        value={referencias[idx].telefono}
                        maxLength={10}
                        success={(referencias[idx]?.telefono?.length ?? 0) === 10}
                        error={(referencias[idx]?.telefono?.length ?? 0) > 0 && (referencias[idx]?.telefono?.length ?? 0) !== 10 ? "Deben ser 10 dígitos" : undefined}
                        onChange={(v) => updateReferencia(idx, "telefono", v)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>,
        )}
      </div>

      {/* ─── RESUMEN ─────────────────────────────────────────────────────────── */}
      <Card className="p-5 md:p-6 space-y-3 border-2 border-border">
        <h3 className="text-sm font-semibold text-text-primary">Resumen</h3>
        {[
          { label: "Cliente", value: clientName },
          { label: "Monto", value: `$${Number(monto || 0).toLocaleString()}` },
          { label: "Plazo", value: `${plazo} QNAs` },
        ].map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-text-secondary">{item.label}</span>
            <span className="font-medium text-text-primary">{item.value}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

export { CreditoAsesor };

// ─── SelectField ──────────────────────────────────────────────────────────────

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  disabled?: boolean;
  success?: boolean;
}

function SelectField({ value, onChange, options, placeholder, disabled, success }: SelectFieldProps) {
  const fieldId = `select-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="relative">
      <select
        id={fieldId}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-md border px-3 py-2.5 text-sm bg-surface text-text-primary transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed appearance-none pr-8 ${
          success
            ? "border-success focus:border-success focus:ring-success/15"
            : "border-border focus:border-primary focus:ring-primary/15"
        }`}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
