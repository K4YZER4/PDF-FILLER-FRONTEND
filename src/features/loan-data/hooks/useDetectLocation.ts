import { useState, useEffect } from "react"

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse"

interface UseDetectLocationResult {
  lugar: string
  loading: boolean
  error: string | null
}

function useDetectLocation(): UseDetectLocationResult {
  const [lugar, setLugar] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocalización no disponible")
      return
    }

    let cancelled = false

    setLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (cancelled) return
        const { latitude, longitude } = pos.coords
        try {
          const params = new URLSearchParams({
            format: "json",
            lat: String(latitude),
            lon: String(longitude),
          })
          const res = await fetch(`${NOMINATIM_URL}?${params}`, {
            headers: { "User-Agent": "CREDIFOM-PDF-Filler/1.0" },
          })
          if (cancelled) return
          if (!res.ok) throw new Error("Error al consultar ubicación")
          const data = await res.json()
          const addr = data.address ?? {}
          const ciudad = addr.city || addr.municipality || addr.town || addr.village || ""
          const estado = addr.state || ""
          const parts = [ciudad, estado].filter(Boolean)
          if (!cancelled) setLugar(parts.join(", "))
        } catch (err) {
          if (!cancelled) setError("No se pudo detectar la ubicación")
        } finally {
          if (!cancelled) setLoading(false)
        }
      },
      (err) => {
        if (cancelled) return
        const messages: Record<number, string> = {
          1: "Permiso de ubicación denegado",
          2: "Ubicación no disponible",
          3: "Tiempo de espera agotado",
        }
        setError(messages[err.code] ?? "Error de geolocalización")
        setLoading(false)
      },
      { timeout: 10000 },
    )

    return () => { cancelled = true }
  }, [])

  return { lugar, loading, error }
}

export { useDetectLocation }
