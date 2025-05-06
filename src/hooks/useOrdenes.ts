import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { Orden } from '../types'

export function useOrdenes(page = 1, limit = 20) {
  const [data, setData] = useState<Orden[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrdenes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get<Orden[]>(
        `http://localhost:3000/DB/ordenes?_page=${page}&_limit=${limit}`
      )
      setData(response.data)
    } catch (err: any) {
      setError(err.message ?? 'Error al cargar órdenes')
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    fetchOrdenes()
  }, [fetchOrdenes])

  return {
    data,
    loading,
    error,
    refetch: fetchOrdenes
  }
}