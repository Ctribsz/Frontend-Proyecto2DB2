// src/hooks/useUsuarios.ts
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Usuario } from '../types'

export function useUsuarios() {
  const [data, setData] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get<Usuario[]>('http://localhost:3000/DB/usuarios')
        setData(response.data)
      } catch (err: any) {
        setError(err.message || 'Error al cargar usuarios')
      } finally {
        setLoading(false)
      }
    }

    fetchUsuarios()
  }, [])

  return { data, loading, error }
}
