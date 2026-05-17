/**
 * Archivo: features/loan-data/hooks/useCreditoAsesor.ts
 *
 * Hook principal del paso 3.
 *
 * Responsabilidades:
 *   1. Inicializar todo el estado local desde el store (Zustand persist)
 *   2. Sincronizar los cambios del estado local de vuelta al store
 *   3. Proveer validaciones de completitud por sección (isAsesorComplete, etc.)
 *   4. Ejecutar el cálculo simulado de tabla de amortización
 *
 * Cada sección del accordion recibe su porción de estado y handlers desde aquí.
 * El componente principal solo orquesta el render.
 */

import { useState, useEffect, useMemo, useCallback } from "react"
import { useContractStore } from "@/store/useContractStore"
import type { ResultadoCalculo, AsesorData, ContactoData, AntiguedadData, Referencias } from "../types"
import {
  isAsesorComplete,
  isContactoComplete,
  isAntiguedadComplete,
  isReferenciasComplete,
} from "../utils/validation"

/**
 * Hook principal del paso 3.
 *
 * Retorna:
 *   - Estado: monto, plazo, resultado, asesorData, contactoData, antiguedadData, referencias
 *   - Setters: setMonto, setPlazo
 *   - Handlers: updateAsesor, updateContacto, updateAntiguedad, updateReferencia
 *   - Acciones: calcular, resetResultado
 *   - Derivados: completion (objeto { prestamo, asesor, contacto, antiguedad, referencias })
 *
 * Cada efecto sincroniza una pieza de estado con el store de Zustand para
 * que los datos persistan al navegar entre pasos del flujo.
 */
export function useCreditoAsesor() {
  const store = useContractStore()
  const userRole = store.auth.role
  const userName = store.auth.user ?? ""

  const [monto, setMonto] = useState(
    store.formData.capitalMonto > 0 ? String(store.formData.capitalMonto) : "",
  )
  const [plazo, setPlazo] = useState(store.formData.plazoQnas || 48)
  const [isCalculando, setIsCalculando] = useState(false)
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(
    store.formData.tabla,
  )

  const saved = store.formData

  const [asesorData, setAsesorData] = useState<AsesorData>(() => ({
    folio:         saved.asesorData.folio ?? "",
    sucursal:      saved.asesorData.sucursal ?? "",
    numVendedor:   saved.asesorData.numVendedor ?? "",
    asesor:        saved.asesorData.asesor ?? (userRole !== "admin" ? userName : ""),
    fechaContrato: saved.asesorData.fechaContrato ?? "",
    fechaArranque: saved.asesorData.fechaArranque ?? "",
    lugar:         saved.asesorData.lugar ?? "",
    mesDescuento:  saved.asesorData.mesDescuento ?? "",
    anioDescuento: saved.asesorData.anioDescuento ?? "",
  }))

  const [contactoData, setContactoData] = useState<ContactoData>(() => ({
    tel:         saved.contactoData.tel ?? "",
    celular:     saved.contactoData.celular ?? "",
    telCasa:     saved.contactoData.telCasa ?? "",
    correo:      saved.contactoData.correo ?? "",
    estadoCivil: saved.contactoData.estadoCivil ?? "",
  }))

  const [antiguedadData, setAntiguedadData] = useState<AntiguedadData>(() => ({
    fechaIngreso: saved.antiguedadData.fechaIngreso ?? "",
    meses:        saved.antiguedadData.meses ?? "",
    anos:         saved.antiguedadData.anos ?? "",
  }))

  const [referencias, setReferencias] = useState<Referencias>(() => {
    const r = saved.referencias
    return [0, 1, 2].map((i) => ({
      nombre:   r[i]?.nombre   ?? "",
      telefono: r[i]?.telefono ?? "",
    })) as Referencias
  })

  useEffect(() => {
    store.setFormData("capitalMonto", monto === "" ? 0 : Number(monto))
  }, [monto])

  useEffect(() => { store.setFormData("plazoQnas", plazo) }, [plazo])
  useEffect(() => { store.setFormData("asesorData", asesorData) }, [asesorData])
  useEffect(() => { store.setFormData("contactoData", contactoData) }, [contactoData])
  useEffect(() => { store.setFormData("antiguedadData", antiguedadData) }, [antiguedadData])
  useEffect(() => { store.setFormData("referencias", referencias) }, [referencias])

  const updateAsesor = useCallback(
    <K extends keyof AsesorData>(key: K, value: AsesorData[K]) =>
      setAsesorData((prev) => ({ ...prev, [key]: value })),
    [],
  )

  const updateContacto = useCallback(
    <K extends keyof ContactoData>(key: K, value: ContactoData[K]) =>
      setContactoData((prev) => ({ ...prev, [key]: value })),
    [],
  )

  const updateAntiguedad = useCallback(
    <K extends keyof AntiguedadData>(key: K, value: AntiguedadData[K]) =>
      setAntiguedadData((prev) => ({ ...prev, [key]: value })),
    [],
  )

  const updateReferencia = useCallback(
    (index: number, field: keyof Referencias[number], value: string) =>
      setReferencias((prev) => {
        const next = [...prev] as Referencias
        next[index] = { ...next[index], [field]: value }
        return next
      }),
    [],
  )

  const calcular = useCallback(async () => {
    if (!monto || Number(monto) <= 0) return
    setIsCalculando(true)
    await new Promise((r) => setTimeout(r, 1000))
    const m = Number(monto)
    const res: ResultadoCalculo = {
      montoPagare:        m * 1.15,
      descuentoQuincenal: (m * 1.15) / plazo,
      tasaMensual:        0.025,
      cat:                0.32,
    }
    setResultado(res)
    store.setFormData("tabla", res)
    setIsCalculando(false)
  }, [monto, plazo])

  const resetResultado = useCallback(() => {
    setResultado(null)
    store.setFormData("tabla", null)
  }, [])

  const prestamoComplete =
    monto !== "" && Number(monto) > 0 && Number(monto) % 1000 === 0

  const completion = useMemo(
    () => ({
      prestamo:   prestamoComplete,
      asesor:     isAsesorComplete(asesorData),
      contacto:   isContactoComplete(contactoData),
      antiguedad: isAntiguedadComplete(antiguedadData),
      referencias: isReferenciasComplete(referencias),
    }),
    [prestamoComplete, asesorData, contactoData, antiguedadData, referencias],
  )

  return {
    monto, setMonto, plazo, setPlazo,
    isCalculando, resultado,
    asesorData, contactoData, antiguedadData, referencias,
    userRole, userName,
    completion,
    updateAsesor, updateContacto, updateAntiguedad, updateReferencia,
    calcular, resetResultado,
  }
}
