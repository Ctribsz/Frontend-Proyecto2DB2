import { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu } from '../types';

export function useMenus() {
  const [data, setData] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/DB/menu');
        setData(response.data);
      } catch (error) {
        setError('Error al cargar los menús');
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: () => {
      const fetchMenus = async () => {
        setLoading(true);
        try {
          const response = await axios.get('http://localhost:3000/DB/menu');
          setData(response.data);
        } catch (error) {
          setError('Error al cargar los menús');
        } finally {
          setLoading(false);
        }
      };
      fetchMenus();
    },
  };
}
