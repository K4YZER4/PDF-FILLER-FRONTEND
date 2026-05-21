/**
 * Hook principal del paso 3 (Datos del Préstamo).
 *
 * Responsabilidades:
 *   1. Gestionar estado local de monto, plazo, resultado del cálculo y asesorData
 *      (contactoData, antiguedadData y referencias se leen/escriben directo en
 *      Zustand desde sus componentes, sin estado local en el hook).
 *   2. Sincronizar monto/plazo/asesorData al store para persistencia
 *      al navegar entre pasos del flujo.
 *   3. Auto-fill de campos del asesor cuando el admin selecciona un perfil
 *      (efecto que reacciona a asesorData.asesor).
 *   4. Proveer validaciones de completitud (completion) para los íconos de
 *      check en el accordion — lee contactoData/antiguedadData/referencias
 *      directo del store para calcularlas.
 *   5. Ejecutar cálculo simulado de tabla de amortización.
 *
 * Secciones que ya NO dependen del hook:
 *   - Contacto → ContactoFields (lee/escribe Zustand directo)
 *   - Antigüedad → AntiguedadSection (lee/escribe Zustand directo)
 *   - Referencias → ReferenciasSection (lee/escribe Zustand directo)
 *
 * Retorna:
 *   - Estado local:     monto, plazo, resultado, isCalculando, asesorData
 *   - Handlers/Setters: setMonto, setPlazo, updateAsesor
 *   - Acciones:         calcular, resetResultado
 *   - Derivados:        completion (objeto { prestamo, asesor, contacto, antiguedad, referencias })
 *                       userRole
 */

import { useState, useEffect, useMemo, useCallback } from "react"
import { useContractStore } from "@/store/useContractStore"
import type { TablaCreditoData, AsesorData } from "../types"
import { ASESORES_REGISTRADOS } from "../constants"
import { useDetectLocation } from "./useDetectLocation"
import {
  isAsesorComplete,
  isContactoComplete,
  isAntiguedadComplete,
  isReferenciasComplete,
} from "../utils/validation"

function getToday(): string {
  return new Date().toISOString().split("T")[0]
}

function getNextQuincenaDate(): string {
  const hoy = new Date()
  const year = hoy.getFullYear()
  const month = hoy.getMonth()

  const d15 = new Date(year, month, 15)
  if (hoy <= d15) return d15.toISOString().split("T")[0]

  const d30 = new Date(year, month, 30)
  if (hoy <= d30) return d30.toISOString().split("T")[0]

  const next15 = new Date(year, month + 1, 15)
  return next15.toISOString().split("T")[0]
}

export function useCreditoAsesor() {
  const store = useContractStore()
  const userRole = store.auth.role

  const [monto, setMonto] = useState(
    store.formData.capitalMonto > 0 ? String(store.formData.capitalMonto) : "",
  )
  const [plazo, setPlazo] = useState(store.formData.plazoQnas || 48)
  const [isCalculando, setIsCalculando] = useState(false)
  const [resultado, setResultado] = useState<TablaCreditoData | null>(
    store.formData.tabla,
  )

  const saved = store.formData

  const [asesorData, setAsesorData] = useState<AsesorData>(() => {
    const today = getToday()

    if (userRole !== "admin") {
      const perfil = ASESORES_REGISTRADOS[0]
      return {
        folio:         perfil.folio,
        sucursal:      perfil.sucursal,
        numVendedor:   perfil.numVendedor,
        asesor:        perfil.nombre,
        fechaContrato: today,
        fechaArranque: getNextQuincenaDate(),
        lugar:         "",
        mesDescuento:  perfil.mesDescuento,
        anioDescuento: perfil.anioDescuento,
      }
    }

    return {
      folio:         saved.asesorData.folio ?? "",
      sucursal:      saved.asesorData.sucursal ?? "",
      numVendedor:   saved.asesorData.numVendedor ?? "",
      asesor:        saved.asesorData.asesor ?? "",
      fechaContrato: saved.asesorData.fechaContrato ?? today,
      fechaArranque: saved.asesorData.fechaArranque || getNextQuincenaDate(),
      lugar:         saved.asesorData.lugar ?? "",
      mesDescuento:  saved.asesorData.mesDescuento ?? "",
      anioDescuento: saved.asesorData.anioDescuento ?? "",
    }
  })

  const contactoData = store.formData.contactoData
  const antiguedadData = store.formData.antiguedadData
  const referencias = store.formData.referencias

  useEffect(() => {
    store.setFormData("capitalMonto", monto === "" ? 0 : Number(monto))
  }, [monto])

  useEffect(() => { store.setFormData("plazoQnas", plazo) }, [plazo])
  useEffect(() => { store.setFormData("asesorData", asesorData) }, [asesorData])

  useEffect(() => {
    if (userRole !== "admin") return
    const perfil = ASESORES_REGISTRADOS.find(a => a.nombre === asesorData.asesor)
    if (!perfil) return
    setAsesorData(prev => ({
      ...prev,
      folio:         perfil.folio,
      sucursal:      perfil.sucursal,
      numVendedor:   perfil.numVendedor,
      fechaContrato: getToday(),
      mesDescuento:  perfil.mesDescuento,
      anioDescuento: perfil.anioDescuento,
    }))
  }, [asesorData.asesor])

  const { lugar: detectedLugar, loading: detectingLocation } = useDetectLocation()

  useEffect(() => {
    if (detectedLugar && !asesorData.lugar) {
      setAsesorData(prev => ({ ...prev, lugar: detectedLugar }))
    }
  }, [detectedLugar])

  const updateAsesor = useCallback(
    <K extends keyof AsesorData>(key: K, value: AsesorData[K]) =>
      setAsesorData((prev) => ({ ...prev, [key]: value })),
    [],
  )

  const calcular = useCallback(async () => {
    if (!monto || Number(monto) <= 0) return
    setIsCalculando(true)
    await new Promise((r) => setTimeout(r, 1000))
    const m = Number(monto)
    const res: TablaCreditoData = {
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
    monto !== "" && Number(monto) > 0 && Number(monto) % 1000 === 0 &&
    asesorData.fechaArranque.length > 0 &&
    asesorData.lugar.trim().length > 0 &&
    asesorData.mesDescuento.length > 0 &&
    asesorData.anioDescuento.length === 4

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
    asesorData,
    userRole,
    completion,
    updateAsesor,
    calcular, resetResultado,
    detectingLocation,
  }
}
