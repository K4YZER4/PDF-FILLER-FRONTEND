/**
 * Archivo: features/nomina/NominaScreen.tsx
 * Propósito: Pantalla de la pestaña 2 - Captura de nómina y cuenta bancaria.
 * Permite subir recibos de nómina y estado de cuenta, escanearlos con OCR
 * y llenar los datos laborales y bancarios.
 */
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Button, UploadArea } from "@/components";
import { Input, Select } from "@/components/ui";
import { ScanStatusBadge, AutofillBadge } from "@/components/feedback";
import { scanNomina, scanEstadoCuenta } from "@/services";
import { useContractStore } from "@/store/useContractStore";
import { nominaSchema, cuentaSchema, BANCO_OPTIONS } from "./nomina.schema";
import { Upload, Info } from "lucide-react";

/** Convierte las opciones de banco para el componente Select */
const BANCO_SELECT_OPTIONS = BANCO_OPTIONS.map((b) => ({ label: b, value: b }));

/**
 * Pantalla principal para captura de datos laborales y bancarios.
 * Maneja carga de 3 documentos, escaneo OCR y formularios.
 */
function NominaScreen({
  onToast,
}: {
  onToast: (msg: string, type: "success" | "error" | "info") => void;
}) {
  const {
    nomina1File,
    nomina1Name,
    nomina2File,
    nomina2Name,
    estadoCuentaFile,
    estadoCuentaName,
    docsScanStatus,
    nominaData,
    estadoCuentaData,
    setNomina1File,
    setNomina2File,
    setEstadoCuentaFile,
    setNominaData,
    setEstadoCuentaData,
    setDocsScanStatus,
    setTabStatus,
  } = useContractStore();

  const [scanStatus, setScanStatus] = useState(docsScanStatus);
  const [isScanning, setIsScanning] = useState(false);
  const [autofilledNomina, setAutofilledNomina] = useState<Set<string>>(
    new Set(),
  );
  const [autofilledCuenta, setAutofilledCuenta] = useState<Set<string>>(
    new Set(),
  );
  const [nominaBadge, setNominaBadge] = useState<"pending" | "ok">("pending");
  const [cuentaBadge, setCuentaBadge] = useState<"pending" | "ok">("pending");

  /** Configuración de react-hook-form para datos laborales (nómina) */
  const {
    register: registerNomina,
    watch: watchNomina,
    setValue: setNominaValue,
    formState: { errors: nominaErrors },
  } = useForm({
    resolver: zodResolver(nominaSchema),
    defaultValues: {
      rfc: (nominaData.rfc as string) || "",
      noEmpleado: (nominaData.noEmpleado as string) || "",
      dependencia: (nominaData.dependencia as string) || "",
      departamento: (nominaData.departamento as string) || "",
      puesto: (nominaData.puesto as string) || "",
      ingresoMensual: (nominaData.ingresoMensual as number) || 0,
    },
  });

  /** Configuración de react-hook-form para datos bancarios */
  const {
    register: registerCuenta,
    watch: watchCuenta,
    setValue: setCuentaValue,
    formState: { errors: cuentaErrors },
  } = useForm({
    resolver: zodResolver(cuentaSchema),
    defaultValues: {
      numeroCuenta: (estadoCuentaData.numeroCuenta as string) || "",
      banco:
        (estadoCuentaData.banco as
          | ""
          | "BBVA"
          | "SANTANDER"
          | "BANAMEX"
          | "BANORTE"
          | "HSBC"
          | "SCOTIABANK"
          | "INBURSA"
          | "AZTECA"
          | "BIENESTAR"
          | "OTRO") || "",
      clabe: (estadoCuentaData.clabe as string) || "",
    },
  });

  /** Observa cambios en formulario de nómina y actualiza store */
  useEffect(() => {
    const sub = watchNomina((val) => {
      setNominaData({
        rfc: (val.rfc as string) || "",
        noEmpleado: (val.noEmpleado as string) || "",
        dependencia: (val.dependencia as string) || "",
        departamento: (val.departamento as string) || "",
        puesto: (val.puesto as string) || "",
        ingresoMensual: (val.ingresoMensual as number) || 0,
      });
    });
    return () => sub.unsubscribe();
  }, [watchNomina, setNominaData]);

  /** Observa cambios en formulario de cuenta y actualiza store */
  useEffect(() => {
    const sub = watchCuenta((val) => {
      setEstadoCuentaData({
        numeroCuenta: val.numeroCuenta || "",
        banco: val.banco || "",
        clabe: val.clabe || "",
        rfc: "",
      });
    });
    return () => sub.unsubscribe();
  }, [watchCuenta, setEstadoCuentaData]);

  /** Verifica si todos los documentos han sido cargados */
  const checkDocsReady = nomina1File && nomina2File && estadoCuentaFile;

  /** Ejecuta el escaneo OCR de nómina y estado de cuenta en paralelo */
  /** Ejecuta el escaneo OCR de nómina y estado de cuenta en paralelo */
  const handleScanDocs = useCallback(async () => {
    if (!nomina1File || !nomina2File || !estadoCuentaFile) return;

    setIsScanning(true);
    setScanStatus("scanning");
    setTabStatus("docs", "scanning");

    try {
      // Ejecuta ambos escaneos en paralelo para mayor velocidad
      const [nomRes, cuentaRes] = await Promise.all([
        scanNomina(nomina1File, nomina2File),
        scanEstadoCuenta(estadoCuentaFile),
      ]);

      // Procesa resultados de nómina
      if (nomRes) {
        setNominaValue("rfc", nomRes.rfc || "", { shouldValidate: true });
        setNominaValue("noEmpleado", nomRes.noEmpleado || "");
        setNominaValue("puesto", nomRes.puesto || "");
        setNominaValue("departamento", nomRes.departamento || "");
        setNominaValue("dependencia", nomRes.dependencia || "");
        if (nomRes.ingresoMensual)
          setNominaValue("ingresoMensual", nomRes.ingresoMensual);

        // Marca campos como autollenados
        setAutofilledNomina(
          new Set([
            "rfc",
            "noEmpleado",
            "puesto",
            "departamento",
            "dependencia",
            "ingresoMensual",
          ]),
        );
        setNominaBadge("ok");
      }

      // Procesa resultados de estado de cuenta
      if (cuentaRes) {
        setCuentaValue("numeroCuenta", cuentaRes.numeroCuenta || "");
        setCuentaValue("clabe", cuentaRes.clabe || "");
        if (cuentaRes.banco) setCuentaValue("banco", cuentaRes.banco);
        // Si el RFC viene en estado de cuenta pero no en nómina, lo usa
        if (cuentaRes.rfc && !watchNomina().rfc) {
          setNominaValue("rfc", cuentaRes.rfc);
          setAutofilledNomina((prev) => new Set(prev).add("rfc"));
        }

        setAutofilledCuenta(new Set(["numeroCuenta", "clabe", "banco"]));
        setCuentaBadge("ok");
      }

      setScanStatus("done");
      setTabStatus("docs", "complete");
      setDocsScanStatus("done");
      onToast("Documentos escaneados — revisa los campos", "success");
    } catch (err) {
      setScanStatus("error");
      setTabStatus("docs", "idle");
      setDocsScanStatus("error");
      onToast(`Error al escanear: ${(err as Error).message}`, "error");
    } finally {
      setIsScanning(false);
    }
  }, [
    nomina1File,
    nomina2File,
    estadoCuentaFile,
    setNominaValue,
    setCuentaValue,
    watchNomina,
    setDocsScanStatus,
    setTabStatus,
    onToast,
  ]);

  return (
    <div className="space-y-4">
      {/* Tip informativo sobre el proceso de escaneo */}
      <div className="flex items-start gap-3 bg-primary-tint border border-primary-tint rounded-md p-3 text-xs text-primary">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>
          Sube los 3 documentos y presiona <strong>Escanear</strong>. Los campos
          se rellenan solos — edítalos si es necesario.
        </span>
      </div>

      {/* Tarjeta para cargar los 3 documentos */}
      <Card
        title="Documentos"
        badge={
          <ScanStatusBadge
            status={scanStatus}
            idleText="Sube los 3 documentos"
            scanningText="Escaneando..."
            doneText="Escaneados"
            errorText="Error"
          />
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <UploadArea
            label="Nómina 1"
            onFileSelect={(f) => setNomina1File(f, f.name)}
            file={nomina1File}
            fileName={nomina1Name}
          />
          <UploadArea
            label="Nómina 2"
            onFileSelect={(f) => setNomina2File(f, f.name)}
            file={nomina2File}
            fileName={nomina2Name}
          />
          <UploadArea
            label="Estado de Cuenta"
            onFileSelect={(f) => setEstadoCuentaFile(f, f.name)}
            file={estadoCuentaFile}
            fileName={estadoCuentaName}
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="primary"
            disabled={!checkDocsReady}
            loading={isScanning}
            onClick={handleScanDocs}
          >
            <Upload size={14} />
            Escanear Documentos
          </Button>
        </div>
      </Card>

      {/* Tarjeta para datos laborales (se llenan con OCR de nómina) */}
      <Card
        title="Datos Laborales"
        badge={
          <span
            className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
              nominaBadge === "ok"
                ? "bg-success-tint text-success"
                : "bg-warning-tint text-warning"
            }`}
          >
            {nominaBadge === "ok" ? "\u2713 Escaneado" : "Pendiente"}
          </span>
        }
      >
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              RFC {autofilledNomina.has("rfc") && <AutofillBadge />}
            </label>
            <Input
              id="rfc"
              placeholder="GAGO9701033W6"
              className="uppercase"
              autofilled={autofilledNomina.has("rfc")}
              error={nominaErrors.rfc?.message}
              {...registerNomina("rfc", {
                setValueAs: (v: string) => v?.toUpperCase() || "",
              })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              No. Empleado{" "}
              {autofilledNomina.has("noEmpleado") && <AutofillBadge />}
            </label>
            <Input
              id="noEmpleado"
              placeholder="43724"
              autofilled={autofilledNomina.has("noEmpleado")}
              {...registerNomina("noEmpleado")}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Dependencia{" "}
              {autofilledNomina.has("dependencia") && <AutofillBadge />}
            </label>
            <Input
              id="dependencia"
              placeholder="GOBIERNO DEL ESTADO DE SINALOA"
              autofilled={autofilledNomina.has("dependencia")}
              {...registerNomina("dependencia", {
                setValueAs: (v: string) => v?.toUpperCase() || "",
              })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Departamento{" "}
              {autofilledNomina.has("departamento") && <AutofillBadge />}
            </label>
            <Input
              id="departamento"
              placeholder="INSTITUTO DE PENSIONES DEL ESTADO"
              autofilled={autofilledNomina.has("departamento")}
              {...registerNomina("departamento", {
                setValueAs: (v: string) => v?.toUpperCase() || "",
              })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Puesto {autofilledNomina.has("puesto") && <AutofillBadge />}
            </label>
            <Input
              id="puesto"
              placeholder="ASISTENTE"
              autofilled={autofilledNomina.has("puesto")}
              {...registerNomina("puesto", {
                setValueAs: (v: string) => v?.toUpperCase() || "",
              })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Ingreso Mensual{" "}
              {autofilledNomina.has("ingresoMensual") && <AutofillBadge />}
            </label>
            <Input
              id="ingresoMensual"
              type="number"
              placeholder="10882.48"
              step="0.01"
              autofilled={autofilledNomina.has("ingresoMensual")}
              error={nominaErrors.ingresoMensual?.message}
              {...registerNomina("ingresoMensual")}
            />
          </div>
        </form>
      </Card>

      {/* Tarjeta para datos bancarios (se llenan con OCR de estado de cuenta) */}
      <Card
        title="Datos Bancarios"
        badge={
          <span
            className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
              cuentaBadge === "ok"
                ? "bg-success-tint text-success"
                : "bg-warning-tint text-warning"
            }`}
          >
            {cuentaBadge === "ok" ? "\u2713 Escaneado" : "Pendiente"}
          </span>
        }
      >
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              No. de Cuenta{" "}
              {autofilledCuenta.has("numeroCuenta") && <AutofillBadge />}
            </label>
            <Input
              id="numeroCuenta"
              placeholder="012345678901"
              autofilled={autofilledCuenta.has("numeroCuenta")}
              {...registerCuenta("numeroCuenta")}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              Banco {autofilledCuenta.has("banco") && <AutofillBadge />}
            </label>
            <Select
              id="banco"
              options={BANCO_SELECT_OPTIONS}
              placeholder="— Seleccionar —"
              autofilled={autofilledCuenta.has("banco")}
              {...registerCuenta("banco")}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-stone-500 flex items-center gap-1 mb-0.5">
              CLABE Interbancaria{" "}
              {autofilledCuenta.has("clabe") && <AutofillBadge />}
            </label>
            <Input
              id="clabe"
              placeholder="021180012345678901"
              maxLength={18}
              inputMode="numeric"
              autofilled={autofilledCuenta.has("clabe")}
              error={cuentaErrors.clabe?.message}
              {...registerCuenta("clabe")}
            />
          </div>
        </form>
      </Card>
    </div>
  );
}

export { NominaScreen };
