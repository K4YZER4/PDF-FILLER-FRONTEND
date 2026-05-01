/**
 * Archivo: features/ine/IneScreen.tsx
 * Propósito: Pantalla de la pestaña 1 - Captura de datos de la INE.
 * Permite subir la foto de la INE, escanearla con OCR y llenar el formulario
 * con los datos personales y de domicilio.
 */
import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, Button } from "@/components"
import { Input, Select } from "@/components/ui"
import { ScanStatusBadge, AutofillBadge } from "@/components/feedback"
import { scanINE } from "@/services"
import { convertToISO } from "@/utils"
import { useContractStore } from "@/store/useContractStore"
import { ineSchema } from "./ine.schema"
import type { INEFormData } from "./ine.schema"
import type { ScanStatus } from "@/types"

/** Opciones para el campo de sexo */
const SEXO_OPTIONS = [
  { label: "H - Hombre", value: "H" },
  { label: "M - Mujer", value: "M" },
]

/** Campos que pueden ser autollenados por el OCR */
const AUTOFILL_FIELDS = [
  "nombre1", "nombre2", "apellidoPaterno", "apellidoMaterno", "curp",
  "sexo", "fechaNac", "claveElector",
  "domicilio.calle", "domicilio.numeroCasa", "domicilio.colonia",
  "domicilio.codigoPostal", "domicilio.municipio", "domicilio.estado",
  "seccion", "vigencia", "numEmision",
] as const

/**
 * Pantalla principal para captura de datos de la INE (Identificación Nacional Electoral).
 * Maneja la carga de imagen, escaneo OCR y formulario de datos personales.
 */
function IneScreen({ onToast }: { onToast: (msg: string, type: "success" | "error" | "info") => void }) {
  // Extrae datos y funciones del store global
  const {
    ineData, ineFile, ineFileUrl, ineScanStatus,
    setINEFile, setINEData, setINEScanStatus, setTabStatus,
  } = useContractStore()

  // Estados locales para la UI
  const [scanStatus, setScanStatus] = useState<ScanStatus>(ineScanStatus)
  const [isScanning, setIsScanning] = useState(false)
  const [autofilledFields, setAutofilledFields] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  /** Configuración de react-hook-form con validación Zod */
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ineSchema),
    defaultValues: {
      nombre1: (ineData.nombre1 as string) || "",
      nombre2: (ineData.nombre2 as string) || "",
      apellidoPaterno: (ineData.apellidoPaterno as string) || "",
      apellidoMaterno: (ineData.apellidoMaterno as string) || "",
      curp: (ineData.curp as string) || "",
      sexo: (ineData.sexo as "" | "H" | "M") || "",
      fechaNac: (ineData.fechaNac as string) || "",
      claveElector: (ineData.claveElector as string) || "",
      domicilio: {
        calle: (ineData.domicilio?.calle as string) || "",
        numeroCasa: (ineData.domicilio?.numeroCasa as string) || "",
        colonia: (ineData.domicilio?.colonia as string) || "",
        codigoPostal: (ineData.domicilio?.codigoPostal as string) || "",
        municipio: (ineData.domicilio?.municipio as string) || "",
        estado: (ineData.domicilio?.estado as string) || "",
      },
      seccion: (ineData.seccion as string) || "",
      vigencia: (ineData.vigencia as string) || "",
      numEmision: (ineData.numEmision as string) || "",
    },
  })

  // Observa cambios en el campo de fecha de nacimiento
  const watchFechaNac = watch("fechaNac")

  // Observa cambios en el formulario y actualiza el store
  useEffect(() => {
    const subscription = watch((value) => {
      const flatValues: Record<string, unknown> = {}
      if (value.nombre1) flatValues.nombre1 = value.nombre1
      if (value.nombre2) flatValues.nombre2 = value.nombre2
      if (value.apellidoPaterno) flatValues.apellidoPaterno = value.apellidoPaterno
      if (value.apellidoMaterno) flatValues.apellidoMaterno = value.apellidoMaterno
      if (value.curp) flatValues.curp = value.curp
      if (value.sexo) flatValues.sexo = value.sexo
      if (value.fechaNac) flatValues.fechaNac = value.fechaNac
      if (value.claveElector) flatValues.claveElector = value.claveElector
      if (value.domicilio) flatValues.domicilio = value.domicilio
      if (value.seccion) flatValues.seccion = value.seccion
      if (value.vigencia) flatValues.vigencia = value.vigencia
      if (value.numEmision) flatValues.numEmision = value.numEmision
      setINEData(flatValues as Partial<INEFormData>)
    })
    return () => subscription.unsubscribe()
  }, [watch, setINEData])

  /** Maneja la selección de archivo de imagen */
  const handleFileSelect = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file)
      setINEFile(file, url)
    },
    [setINEFile]
  )

  /** Dispara el clic en el input de archivo oculto */
  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  /** Ejecuta el escaneo OCR de la INE */
  const handleScanINE = useCallback(async () => {
    if (!ineFile) return

    setIsScanning(true)
    setScanStatus("scanning")
    setTabStatus("ine", "scanning")
    onToast("Escaneando INE en segundo plano — puedes ir al Tab 2", "info")

    try {
      const data = await scanINE(ineFile)

      setScanStatus("done")
      setTabStatus("ine", "complete")
      setINEScanStatus("done")

      // Llena el formulario con los datos escaneados
      setValue("nombre1", data.nombre1 || "", { shouldValidate: true })
      setValue("nombre2", data.nombre2 || "")
      setValue("apellidoPaterno", data.apellidoPaterno || "", { shouldValidate: true })
      setValue("apellidoMaterno", data.apellidoMaterno || "", { shouldValidate: true })
      setValue("curp", data.curp || "", { shouldValidate: true })
      setValue("sexo", data.sexo || "")
      setValue("claveElector", data.claveElector || "")
      setValue("seccion", data.seccion || "")
      setValue("vigencia", data.vigencia || "")
      setValue("numEmision", data.numEmision || "")

      if (data.fechaNac) {
        const iso = convertToISO(data.fechaNac)
        setValue("fechaNac", iso, { shouldValidate: true })
      }

      if (data.domicilio) {
        setValue("domicilio.calle", data.domicilio.calle || "", { shouldValidate: true })
        setValue("domicilio.numeroCasa", data.domicilio.numeroCasa || "", { shouldValidate: true })
        setValue("domicilio.colonia", data.domicilio.colonia || "", { shouldValidate: true })
        setValue("domicilio.codigoPostal", data.domicilio.codigoPostal || "", { shouldValidate: true })
        setValue("domicilio.municipio", data.domicilio.municipio || "", { shouldValidate: true })
        setValue("domicilio.estado", data.domicilio.estado || "", { shouldValidate: true })
      }

      // Marca todos los campos como autollenados
      const newAutofilled = new Set<string>(AUTOFILL_FIELDS)
      setAutofilledFields(newAutofilled)

      onToast("INE escaneado correctamente", "success")
    } catch {
      setScanStatus("error")
      setTabStatus("ine", "idle")
      setINEScanStatus("error")
      onToast("Error al escanear INE", "error")
    } finally {
      setIsScanning(false)
    }
  }, [ineFile, setValue, setINEScanStatus, setTabStatus, onToast])

  return (
    <div className="space-y-4">
      {/* Tip informativo sobre el proceso de escaneo */}
      <div className="flex items-start gap-3 bg-primary-tint border border-primary-tint rounded-md p-3 text-xs text-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>
          <strong>Tip:</strong> Sube el INE y dale a <em>Leer con OCR</em>.
          Mientras escanea en segundo plano, puedes ir al Tab 2 a subir las nóminas.
        </span>
      </div>

      {/* Tarjeta para subir y previsualizar la foto de la INE */}
      <Card title="Fotografía del INE" badge={<ScanStatusBadge status={scanStatus} />}>
        <div
          className={`
            relative border-2 border-dashed rounded-lg min-h-[110px] flex flex-col items-center justify-center
            cursor-pointer transition-colors text-center px-4
            ${ineFile ? "border-success bg-success-tint" : "border-stone-200 hover:border-primary hover:bg-primary-tint"}
          `}
          onClick={handleImageClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          {ineFile && ineFileUrl ? (
            <div className="relative rounded-md overflow-hidden group">
              <img src={ineFileUrl} alt="INE" className="w-full max-h-[180px] object-contain rounded-md" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium">Clic para cambiar</span>
              </div>
            </div>
          ) : (
            <>
              <svg className="text-stone-300 mb-2" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="8.5" cy="9.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-xs font-medium text-stone-500">Arrastra la foto del INE aquí</p>
              <p className="text-[11px] text-stone-400 mt-0.5">o haz clic · JPG, PNG · max 10 MB</p>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 mt-3">
          <Button variant="primary" disabled={!ineFile} loading={isScanning} onClick={handleScanINE}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Leer INE con OCR
          </Button>
        </div>
      </Card>

      {/* Tarjeta con formulario de datos personales */}
      <Card title="Datos Personales">
        <form onSubmit={handleSubmit(() => {})} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Primer Nombre <span className="text-red-600 text-[10px]">*</span>
              {autofilledFields.has("nombre1") && <AutofillBadge />}
            </label>
            <Input
              id="nombre1"
              placeholder="JUAN"
              autofilled={autofilledFields.has("nombre1")}
              error={errors.nombre1?.message}
              {...register("nombre1", { setValueAs: (v: string) => v?.toUpperCase() || "" })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">
              Segundo Nombre
              {autofilledFields.has("nombre2") && <AutofillBadge />}
            </label>
            <Input
              id="nombre2"
              placeholder="CARLOS"
              autofilled={autofilledFields.has("nombre2")}
              {...register("nombre2", { setValueAs: (v: string) => v?.toUpperCase() || "" })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Apellido Paterno <span className="text-red-600 text-[10px]">*</span>
              {autofilledFields.has("apellidoPaterno") && <AutofillBadge />}
            </label>
            <Input
              id="apellidoPaterno"
              placeholder="GARCÍA"
              autofilled={autofilledFields.has("apellidoPaterno")}
              error={errors.apellidoPaterno?.message}
              {...register("apellidoPaterno", { setValueAs: (v: string) => v?.toUpperCase() || "" })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Apellido Materno <span className="text-red-600 text-[10px]">*</span>
              {autofilledFields.has("apellidoMaterno") && <AutofillBadge />}
            </label>
            <Input
              id="apellidoMaterno"
              placeholder="LÓPEZ"
              autofilled={autofilledFields.has("apellidoMaterno")}
              error={errors.apellidoMaterno?.message}
              {...register("apellidoMaterno", { setValueAs: (v: string) => v?.toUpperCase() || "" })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              CURP <span className="text-red-600 text-[10px]">*</span>
              {autofilledFields.has("curp") && <AutofillBadge />}
            </label>
            <Input
              id="curp"
              placeholder="GALO800101HSLRPN01"
              maxLength={18}
              className="uppercase"
              autofilled={autofilledFields.has("curp")}
              error={errors.curp?.message}
              {...register("curp", { setValueAs: (v: string) => v?.toUpperCase() || "" })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Sexo</label>
            <Select
              id="sexo"
              options={SEXO_OPTIONS}
              placeholder="— Seleccionar —"
              autofilled={autofilledFields.has("sexo")}
              {...register("sexo")}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Fecha de Nacimiento <span className="text-red-600 text-[10px]">*</span>
              <span className="font-normal text-stone-400">(AAAA-MM-DD)</span>
              {autofilledFields.has("fechaNac") && <AutofillBadge />}
            </label>
            <Input
              id="fechaNac"
              type="date"
              value={watchFechaNac || ""}
              onChange={(e) => setValue("fechaNac", e.target.value, { shouldValidate: true })}
              autofilled={autofilledFields.has("fechaNac")}
              error={errors.fechaNac?.message}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">
              Clave de Elector
              {autofilledFields.has("claveElector") && <AutofillBadge />}
            </label>
            <Input
              id="claveElector"
              placeholder="GRLPJN90010112H300"
              maxLength={18}
              className="uppercase"
              autofilled={autofilledFields.has("claveElector")}
              {...register("claveElector", { setValueAs: (v: string) => v?.toUpperCase() || "" })}
            />
          </div>
        </form>
      </Card>

      {/* Tarjeta con formulario de domicilio */}
      <Card title="Domicilio">
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Calle <span className="text-red-600 text-[10px]">*</span>
              {autofilledFields.has("domicilio.calle") && <AutofillBadge />}
            </label>
            <Input
              id="calle"
              placeholder="AV. INSURGENTES SUR"
              autofilled={autofilledFields.has("domicilio.calle")}
              error={errors.domicilio?.calle?.message}
              {...register("domicilio.calle", { setValueAs: (v: string) => v?.toUpperCase() || "" })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              No. Ext <span className="text-red-600 text-[10px]">*</span>
              {autofilledFields.has("domicilio.numeroCasa") && <AutofillBadge />}
            </label>
            <Input
              id="numeroCasa"
              placeholder="1234"
              autofilled={autofilledFields.has("domicilio.numeroCasa")}
              error={errors.domicilio?.numeroCasa?.message}
              {...register("domicilio.numeroCasa")}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Colonia <span className="text-red-600 text-[10px]">*</span>
              {autofilledFields.has("domicilio.colonia") && <AutofillBadge />}
            </label>
            <Input
              id="colonia"
              placeholder="CENTRO"
              autofilled={autofilledFields.has("domicilio.colonia")}
              error={errors.domicilio?.colonia?.message}
              {...register("domicilio.colonia", { setValueAs: (v: string) => v?.toUpperCase() || "" })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Código Postal <span className="text-red-600 text-[10px]">*</span>
              {autofilledFields.has("domicilio.codigoPostal") && <AutofillBadge />}
            </label>
            <Input
              id="codigoPostal"
              placeholder="81000"
              maxLength={5}
              autofilled={autofilledFields.has("domicilio.codigoPostal")}
              error={errors.domicilio?.codigoPostal?.message}
              {...register("domicilio.codigoPostal")}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Municipio <span className="text-red-600 text-[10px]">*</span>
              {autofilledFields.has("domicilio.municipio") && <AutofillBadge />}
            </label>
            <Input
              id="municipio"
              placeholder="GUASAVE"
              autofilled={autofilledFields.has("domicilio.municipio")}
              error={errors.domicilio?.municipio?.message}
              {...register("domicilio.municipio", { setValueAs: (v: string) => v?.toUpperCase() || "" })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Estado <span className="text-red-600 text-[10px]">*</span>
              {autofilledFields.has("domicilio.estado") && <AutofillBadge />}
            </label>
            <Input
              id="estado"
              placeholder="SINALOA"
              autofilled={autofilledFields.has("domicilio.estado")}
              error={errors.domicilio?.estado?.message}
              {...register("domicilio.estado", { setValueAs: (v: string) => v?.toUpperCase() || "" })}
            />
          </div>
        </form>
      </Card>

      {/* Tarjeta con datos adicionales de la INE (sección, vigencia, emisión) */}
      <Card title="Datos INE Adicionales">
        <form className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Sección</label>
            <Input
              id="seccion"
              placeholder="1234"
              maxLength={4}
              autofilled={autofilledFields.has("seccion")}
              {...register("seccion")}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Vigencia</label>
            <Input
              id="vigencia"
              placeholder="2031"
              maxLength={4}
              autofilled={autofilledFields.has("vigencia")}
              {...register("vigencia")}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 mb-0.5 block">Núm. de Emisión</label>
            <Input
              id="numEmision"
              placeholder="01"
              maxLength={2}
              autofilled={autofilledFields.has("numEmision")}
              {...register("numEmision")}
            />
          </div>
        </form>
      </Card>
    </div>
  )
}

export { IneScreen }
