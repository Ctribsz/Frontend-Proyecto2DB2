// src/hooks/useUsuarios.ts
import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { Usuario } from '../types'

export function useUsuarios(page = 1, limit = 20) {
  const [data, setData] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsuarios = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get<Usuario[]>(
        `http://localhost:3000/DB/usuarios?_page=${page}&_limit=${limit}`
      )
      setData(response.data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    fetchUsuarios()
  }, [fetchUsuarios])

  return { data, loading, error, refetch: fetchUsuarios }
}
