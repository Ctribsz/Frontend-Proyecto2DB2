
// src/hooks/useResenas.ts
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

export interface Respuesta {
  adminId: string
  mensaje: string
  fecha?: string
  fechaRespuesta?: string
}

export interface Resena {
  _id: string
  usuarioId: string
  ordenId: string
  sucursalId: string
  calificacion: number
  comentario: string
  fecha: string
  respuestas: Respuesta[]
}

export function useResenas(page = 1, limit = 20) {
  const [data, setData] = useState<Resena[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResenas = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get<Resena[]>(
        `http://localhost:3000/DB/resenas?_page=${page}&_limit=${limit}`
      )
      setData(response.data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar reseñas')
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    fetchResenas()
  }, [fetchResenas])

  return { data, loading, error, refetch: fetchResenas }
}
