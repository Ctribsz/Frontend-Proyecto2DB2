// src/hooks/useSucursales.ts
import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'

export interface Sucursal {
  _id: string
  nombre: string
  telefono: string
  horario: string
  fecha_apertura: string
  ubicacion: {
    ciudad: string
    direccion: string
    zona: number
  }
}

export function useSucursales(page = 1, limit = 20) {
  const [data, setData] = useState<Sucursal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSucursales = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get<Sucursal[]>(
        `http://localhost:3000/DB/sucursales?_page=${page}&_limit=${limit}`
      )
      setData(response.data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar sucursales')
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    fetchSucursales()
  }, [fetchSucursales])

  return { data, loading, error, refetch: fetchSucursales }
}