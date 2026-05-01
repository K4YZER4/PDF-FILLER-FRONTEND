/**
 * Archivo: features/credito/CreditoScreen.tsx
 * Propósito: Pantalla de la pestaña 3 - Crédito, asesor y referencias.
 * Permite calcular la tabla crediticia, ingresar datos del asesor,
 * información de contacto, antigüedad y referencias personales.
 * Finalmente genera el contrato PDF.
 */
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, Button } from "@/components"
import { Input, Select } from "@/components/ui"
import { calcularTabla, generarContrato } from "@/services"
import { formatCurrency, formatPercentage, calculateSeniority, downloadBlob, getDefaultDischargeMonth } from "@/utils"
import { useContractStore } from "@/store/useContractStore"
import {
  creditoSchema,
  asesorSchema,
  contactoSchema,
  antiguedadSchema,
  PLAZO_OPTIONS,
} from "./credito.schema"
import type { TablaCreditoData, PlazoQuincenas } from "@/types"

/** Opciones para el campo estado civil */
const ESTADO_CIVIL_OPTIONS = [
  { label: "SOLTERO", value: "SOLTERO" },
  { label: "CASADO", value: "CASADO" },
  { label: "DIVORCIADO", value: "DIVORCIADO" },
  { label: "VIUDO", value: "VIUDO" },
  { label: "UNION LIBRE", value: "UNION LIBRE" },
]

/** Estado para las 3 referencias personales */
interface ReferenceState {
  ref1Name: string
  ref1Phone: string
  ref2Name: string
  ref2Phone: string
  ref3Name: string
  ref3Phone: string
}

/**
 * Pantalla principal para configuración de crédito y generación de contrato.
 * Maneja cálculo de tabla, datos del asesor, contacto y referencias.
 */
function CreditoScreen({ onToast }: { onToast: (msg: string, type: "success" | "error" | "info") => void }) {
  // Extrae datos y funciones del store global
  const {
    montoNeto, plazoQuincenas, tablaData,
    ineData, nominaData, estadoCuentaData,
    setMontoNeto, setPlazoQuincenas, setTablaData, setTabStatus,
    reset: resetStore,
  } = useContractStore()

  // Estados locales para UI
  const [isCalculating, setIsCalculating] = useState(false)  // Si está calculando la tabla
  const [isGenerating, setIsGenerating] = useState(false)  // Si está generando el PDF
  const [displayedPlazo, setDisplayedPlazo] = useState<string>(String(plazoQuincenas))
  const [tablaResult, setTablaResult] = useState<TablaCreditoData | null>(tablaData)
  // Estado para las 3 referencias personales
  const [references, setReferences] = useState<ReferenceState>({
    ref1Name: "", ref1Phone: "",
    ref2Name: "", ref2Phone: "",
    ref3Name: "", ref3Phone: "",
  })

  /** Configuración de react-hook-form para datos de crédito */
  const {
    register: registerCredito,
    watch: watchCredito,
    setValue: setCreditoValue,
    handleSubmit: handleCreditoSubmit,
    formState: { errors: creditoErrors },
  } = useForm({
    resolver: zodResolver(creditoSchema),
    defaultValues: {
      montoNeto: montoNeto || undefined,
      plazoQuincenas: displayedPlazo,
    },
  })

  /** Configuración de react-hook-form para datos del asesor */
  const {
    register: registerAsesor,
    watch: watchAsesor,
  } = useForm({
    resolver: zodResolver(asesorSchema),
    defaultValues: {
      folio: "",
      sucursal: "",
      numVendedor: "",
      vendedor: "",
      fechaContrato: "",
      fechaArranque: "",
      lugarFecha: "",
      mesDescuento: getDefaultDischargeMonth(),
      añoDescuento: String(new Date().getFullYear()),
    },
  })

  /** Configuración de react-hook-form para datos de contacto */
  const {
    register: registerContacto,
    watch: watchContacto,
    formState: { errors: contactoErrors },
  } = useForm({
    resolver: zodResolver(contactoSchema),
    defaultValues: {
      telefonoCelular: "",
      telefonoCasa: "",
      mail: "",
      estadoCivil: "",
    },
  })

  /** Configuración de react-hook-form para antigüedad laboral */
  const {
    register: registerAntiguedad,
    watch: watchAntiguedad,
    setValue: setAntiguedadValue,
  } = useForm({
    resolver: zodResolver(antiguedadSchema),
    defaultValues: {
      fechaIngreso: "",
      mesesAntiguedad: 0,
      anosAntiguedad: 0,
    },
  })

  /** Observa cambios en monto y actualiza store */
  useEffect(() => {
    const sub = watchCredito((val) => {
      if (val.montoNeto && typeof val.montoNeto === "number") {
        setMontoNeto(val.montoNeto)
      }
    })
    return () => sub.unsubscribe()
  }, [watchCredito, setMontoNeto])

  /** Calcula antigüedad automáticamente cuando cambia fecha de ingreso */
  useEffect(() => {
    const val = watchAntiguedad().fechaIngreso
    if (val) {
      const { meses, anos } = calculateSeniority(val)
      setAntiguedadValue("mesesAntiguedad", meses)
      setAntiguedadValue("anosAntiguedad", anos)
    }
  }, [watchAntiguedad().fechaIngreso, setAntiguedadValue])

  /** Cambia el plazo seleccionado y actualiza formulario y store */
  const selectPlazo = useCallback(
    (qnas: number) => {
      setDisplayedPlazo(String(qnas))
      setCreditoValue("plazoQuincenas", String(qnas))
      setPlazoQuincenas(qnas as PlazoQuincenas)
    },
    [setCreditoValue, setPlazoQuincenas]
  )

  /** Ejecuta el cálculo de la tabla crediticia */
  const handleCalcular = handleCreditoSubmit(async (data) => {
    setIsCalculating(true)
    try {
      const result = await calcularTabla({
        monto: data.montoNeto,
        quincenas: Number(data.plazoQuincenas) as PlazoQuincenas,
      })
      setTablaResult(result)
      setTablaData(result)
      setTabStatus("extras", "complete")
      onToast("Tabla calculada correctamente", "success")
    } catch {
      onToast("Error al calcular tabla", "error")
    } finally {
      setIsCalculating(false)
    }
  })

  /** Genera el contrato PDF con todos los datos recolectados */
  const handleGenerate = async () => {
    if (!tablaResult) {
      onToast("Primero calcula la tabla", "error")
      return
    }

    // Validación de campos requeridos de INE y domicilio
    const ine = ineData
    const required = [
      { field: ine.nombre1, label: "Primer Nombre" },
      { field: ine.apellidoPaterno, label: "Apellido Paterno" },
      { field: ine.apellidoMaterno, label: "Apellido Materno" },
      { field: ine.curp, label: "CURP" },
      { field: ine.fechaNac, label: "Fecha de Nacimiento" },
    ]
    const domicilioRequired = [
      { field: ine.domicilio?.calle, label: "Calle" },
      { field: ine.domicilio?.numeroCasa, label: "No. Ext" },
      { field: ine.domicilio?.colonia, label: "Colonia" },
      { field: ine.domicilio?.codigoPostal, label: "CP" },
      { field: ine.domicilio?.municipio, label: "Municipio" },
      { field: ine.domicilio?.estado, label: "Estado" },
    ]

    const missing = [
      ...required,
      ...domicilioRequired,
    ]
      .filter((r) => !r.field || String(r.field).trim() === "")
      .map((r) => r.label)

    if (missing.length > 0) {
      onToast(`Faltan: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? "..." : ""}`, "error")
      return
    }

    // Obtiene valores de todos los formularios
    const contactoVal = watchContacto()
    const asesorVal = watchAsesor()
    const antiguedadVal = watchAntiguedad()
    const creditoVal = watchCredito()

    setIsGenerating(true)
    try {
      // Envía payload completo al API para generar PDF
      const blob = await generarContrato({
        ine: {
          nombre1: String(ine.nombre1 || ""),
          nombre2: String(ine.nombre2 || ""),
          apellidoPaterno: String(ine.apellidoPaterno || ""),
          apellidoMaterno: String(ine.apellidoMaterno || ""),
          curp: String(ine.curp || ""),
          fechaNac: String(ine.fechaNac || ""),
          claveElector: String(ine.claveElector || ""),
          sexo: String(ine.sexo || ""),
          seccion: String(ine.seccion || ""),
          vigencia: String(ine.vigencia || ""),
          numEmision: String(ine.numEmision || ""),
          domicilio: {
            calle: String(ine.domicilio?.calle || ""),
            numeroCasa: String(ine.domicilio?.numeroCasa || ""),
            colonia: String(ine.domicilio?.colonia || ""),
            codigoPostal: String(ine.domicilio?.codigoPostal || ""),
            municipio: String(ine.domicilio?.municipio || ""),
            estado: String(ine.domicilio?.estado || ""),
          },
        },
        tabla: {
          montoPagare: tablaResult.montoPagare,
          descuentoQuincenal: tablaResult.descuentoQuincenal,
          cat: tablaResult.cat,
          tasaMensual: tablaResult.tasaMensual,
          importeInteres: tablaResult.importeInteres,
          montoNeto: currentMonto,
          plazoQuincenas: Number(creditoVal.plazoQuincenas) || 48,
        },
        nomina: {
          rfc: String(nominaData.rfc || ""),
          noEmpleado: String(nominaData.noEmpleado || ""),
          puesto: String(nominaData.puesto || ""),
          departamento: String(nominaData.departamento || ""),
          dependencia: String(nominaData.dependencia || ""),
          ingresoMensual: Number(nominaData.ingresoMensual) || 0,
        },
        estadoCuenta: {
          rfc: String(estadoCuentaData.rfc || ""),
          numeroCuenta: String(estadoCuentaData.numeroCuenta || ""),
          clabe: String(estadoCuentaData.clabe || ""),
          banco: String(estadoCuentaData.banco || ""),
        },
        extra: {
          folio: String(asesorVal.folio || ""),
          sucursal: String(asesorVal.sucursal || ""),
          numVendedor: String(asesorVal.numVendedor || ""),
          vendedor: String(asesorVal.vendedor || ""),
          fechaContrato: String(asesorVal.fechaContrato || ""),
          fechaArranque: String(asesorVal.fechaArranque || ""),
          lugarFecha: String(asesorVal.lugarFecha || ""),
          mesDescuento: String(asesorVal.mesDescuento || ""),
          añoDescuento: String(asesorVal.añoDescuento || ""),
          telefonoCelular: String(contactoVal.telefonoCelular || ""),
          telefonoCasa: String(contactoVal.telefonoCasa || ""),
          mail: String(contactoVal.mail || ""),
          estadoCivil: String(contactoVal.estadoCivil || ""),
          mesesAntiguedad: String(antiguedadVal.mesesAntiguedad || 0),
          añosAntiguedad: String(antiguedadVal.anosAntiguedad || 0),
          referencia1: references.ref1Name,
          referencia2: references.ref2Name,
          referencia3: references.ref3Name,
          telefonoReferencia1: references.ref1Phone,
          telefonoReferencia2: references.ref2Phone,
          telefonoReferencia3: references.ref3Phone,
        },
      })

      // Descarga el PDF generado
      const filename = `CONTRATO_${(String(ine.apellidoPaterno) + "_" + String(ine.nombre1)).toUpperCase()}.pdf`
      downloadBlob(blob, filename)
      onToast("PDF generado y descargado", "success")
    } catch (err) {
      onToast(`Error al generar PDF: ${(err as Error).message}`, "error")
    } finally {
      setIsGenerating(false)
    }
  }

  /** Limpia todo el formulario y reinicia estados */
  const handleClean = () => {
    resetStore()
    setTablaResult(null)
    setDisplayedPlazo("48")
    setReferences({
      ref1Name: "", ref1Phone: "",
      ref2Name: "", ref2Phone: "",
      ref3Name: "", ref3Phone: "",
    })
    onToast("Formulario limpiado", "info")
  }

  // Verifica si se puede generar el contrato (tabla calculada)
  const canGenerate = !!tablaResult
  const currentMonto = typeof montoNeto === "number" ? montoNeto : 0

  return (
    <div className="space-y-4">
      {/* Tarjeta para configuración de crédito: monto y plazo */}
      <Card title="Solicitud de Crédito">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Monto Neto (Capital) <span className="text-red-600 text-[10px]">*</span>
            </label>
            <div className="flex items-center border border-stone-200 rounded-md overflow-hidden bg-stone-50 transition-all focus-within:border-teal-800 focus-within:ring-2 focus-within:ring-teal-800/15">
              <span className="px-3 py-2 bg-white border-r border-stone-200 font-semibold text-sm text-stone-500 whitespace-nowrap">
                MXN $
              </span>
              <input
                type="number"
                placeholder="25000"
                min={1000}
                max={200000}
                step={500}
                className="flex-1 px-3 py-2 text-base font-semibold bg-transparent focus:outline-none placeholder:text-stone-400"
                {...registerCredito("montoNeto", { valueAsNumber: true })}
              />
            </div>
            {creditoErrors.montoNeto && (
              <span className="text-xs text-red-600 mt-0.5 block" role="alert">{String(creditoErrors.montoNeto.message)}</span>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-2">
            Plazo (Quincenas) <span className="text-red-600 text-[10px]">*</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {PLAZO_OPTIONS.map((q) => (
              <button
                key={q}
                type="button"
                className={`
                  px-3 py-1 rounded-full border text-xs font-medium transition-all cursor-pointer
                  ${Number(displayedPlazo) === q
                    ? "bg-teal-800 text-white border-teal-800"
                    : "bg-stone-50 text-stone-500 border-stone-200 hover:border-teal-800 hover:text-teal-800 hover:bg-teal-50"
                  }
                `}
                onClick={() => selectPlazo(q)}
              >
                {q} QNAs
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <Button variant="primary" size="lg" loading={isCalculating} onClick={handleCalcular as () => void}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Calcular tabla
          </Button>
        </div>

        {tablaResult && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-stone-50 border border-stone-200 rounded-md p-3">
              <div className="text-xs text-stone-500 mb-0.5">Monto Pagaré</div>
              <div className="text-base font-semibold text-teal-800">{formatCurrency(tablaResult.montoPagare)}</div>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-md p-3">
              <div className="text-xs text-stone-500 mb-0.5">Descuento Quincenal</div>
              <div className="text-base font-semibold text-teal-800">{formatCurrency(tablaResult.descuentoQuincenal)}</div>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-md p-3">
              <div className="text-xs text-stone-500 mb-0.5">CAT Anual</div>
              <div className="text-base font-semibold">{formatPercentage(tablaResult.cat ?? 0)}</div>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-md p-3">
              <div className="text-xs text-stone-500 mb-0.5">Tasa Mensual</div>
              <div className="text-base font-semibold">{formatPercentage(tablaResult.tasaMensual)}</div>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-md p-3">
              <div className="text-xs text-stone-500 mb-0.5">Tasa Anual</div>
              <div className="text-base font-semibold">{formatPercentage(Number(tablaResult.tasaMensual) * 12)}</div>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-md p-3">
              <div className="text-xs text-stone-500 mb-0.5">Intereses Totales</div>
              <div className="text-base font-semibold">
                {formatCurrency(
                  tablaResult.importeInteres ?? (Number(tablaResult.montoPagare) - currentMonto)
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Tarjeta para datos del asesor/vendedor */}
      <Card title="Datos del Asesor">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Folio</label>
            <Input id="folio" placeholder="00001" {...registerAsesor("folio")} />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Sucursal</label>
            <Input id="sucursal" placeholder="DATAZO" {...registerAsesor("sucursal", { setValueAs: (v: string) => v?.toUpperCase() || "" })} />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Núm. Vendedor</label>
            <Input id="numVendedor" placeholder="000" {...registerAsesor("numVendedor")} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Vendedor / Asesor</label>
            <Input id="vendedor" placeholder="NOMBRE DEL ASESOR" {...registerAsesor("vendedor", { setValueAs: (v: string) => v?.toUpperCase() || "" })} />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">
              Fecha Contrato <span className="font-normal text-stone-400">(AAAA-MM-DD)</span>
            </label>
            <Input id="fechaContrato" type="date" {...registerAsesor("fechaContrato")} />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">
              Fecha Arranque <span className="font-normal text-stone-400">(AAAA-MM-DD)</span>
            </label>
            <Input id="fechaArranque" type="date" {...registerAsesor("fechaArranque")} />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Lugar</label>
            <Input id="lugarFecha" placeholder="GUASAVE, SINALOA" {...registerAsesor("lugarFecha", { setValueAs: (v: string) => v?.toUpperCase() || "" })} />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Mes Descuento</label>
            <Input id="mesDescuento" placeholder="MAYO" {...registerAsesor("mesDescuento", { setValueAs: (v: string) => v?.toUpperCase() || "" })} />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Año Descuento</label>
            <Input id="anioDescuento" placeholder="2026" maxLength={4} {...registerAsesor("añoDescuento")} />
          </div>
        </div>
      </Card>

      {/* Tarjeta para información de contacto y estado civil */}
      <Card title="Contacto y Estado Civil">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Tel. Celular</label>
            <Input id="telefonoCelular" type="tel" placeholder="6671234567" maxLength={10} inputMode="numeric" error={contactoErrors.telefonoCelular?.message ? String(contactoErrors.telefonoCelular.message) : undefined} {...registerContacto("telefonoCelular")} />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Tel. Casa</label>
            <Input id="telefonoCasa" type="tel" placeholder="6671234567" maxLength={10} inputMode="numeric" error={contactoErrors.telefonoCasa?.message ? String(contactoErrors.telefonoCasa.message) : undefined} {...registerContacto("telefonoCasa")} />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Correo</label>
            <Input id="mail" type="email" placeholder="correo@ejemplo.com" error={contactoErrors.mail?.message ? String(contactoErrors.mail.message) : undefined} {...registerContacto("mail")} />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Estado Civil</label>
            <Select id="estadoCivil" options={ESTADO_CIVIL_OPTIONS} {...registerContacto("estadoCivil")} />
          </div>
        </div>
      </Card>

      {/* Tarjeta para antigüedad laboral (se calcula automáticamente) */}
      <Card title="Antigüedad">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Fecha de ingreso</label>
            <Input id="fechaIngreso" type="date" {...registerAntiguedad("fechaIngreso")} />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Meses</label>
            <Input id="mesesAntiguedad" type="number" placeholder="0" min={0} readOnly {...registerAntiguedad("mesesAntiguedad")} />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Años</label>
            <Input id="anosAntiguedad" type="number" placeholder="0" min={0} readOnly {...registerAntiguedad("anosAntiguedad")} />
          </div>
        </div>
      </Card>

      {/* Tarjeta para 3 referencias personales con teléfono */}
      <Card title="Referencias Personales">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Referencia 1</label>
            <Input
              id="referencia1"
              placeholder="Nombre completo"
              value={references.ref1Name}
              onChange={(e) => setReferences((prev) => ({ ...prev, ref1Name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Teléfono</label>
            <Input
              id="telRef1"
              type="tel"
              placeholder="6671234567"
              maxLength={10}
              inputMode="numeric"
              value={references.ref1Phone}
              onChange={(e) => setReferences((prev) => ({ ...prev, ref1Phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Referencia 2</label>
            <Input
              id="referencia2"
              placeholder="Nombre completo"
              value={references.ref2Name}
              onChange={(e) => setReferences((prev) => ({ ...prev, ref2Name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Teléfono</label>
            <Input
              id="telRef2"
              type="tel"
              placeholder="6671234567"
              maxLength={10}
              inputMode="numeric"
              value={references.ref2Phone}
              onChange={(e) => setReferences((prev) => ({ ...prev, ref2Phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Referencia 3</label>
            <Input
              id="referencia3"
              placeholder="Nombre completo"
              value={references.ref3Name}
              onChange={(e) => setReferences((prev) => ({ ...prev, ref3Name: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Teléfono</label>
            <Input
              id="telRef3"
              type="tel"
              placeholder="6671234567"
              maxLength={10}
              inputMode="numeric"
              value={references.ref3Phone}
              onChange={(e) => setReferences((prev) => ({ ...prev, ref3Phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
            />
          </div>
        </div>
      </Card>

      {/* Botones para limpiar formulario y generar contrato */}
      <div className="flex justify-end gap-3 pt-2">
        {/* Botón para limpiar todo el formulario */}
        <Button variant="secondary" onClick={handleClean}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.85" />
          </svg>
          Limpiar todo
        </Button>
        {/* Botón para generar el contrato PDF (requiere tabla calculada) */}
        <Button
          variant="primary"
          size="lg"
          loading={isGenerating}
          disabled={!canGenerate}
          onClick={handleGenerate}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          Generar Contrato PDF
        </Button>
      </div>
    </div>
  )
}

export { CreditoScreen }
