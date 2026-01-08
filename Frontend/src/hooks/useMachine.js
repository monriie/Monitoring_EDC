import { useState, useEffect, useCallback } from 'react'
import { rekapAPI, mesinAPI } from '@/service/api'

export const useMachines = () => {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch semua mesin dari API
  const fetchMachines = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await rekapAPI.getAll()
      // Sesuaikan dengan struktur response backend
      setMachines(response.data.data || response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data mesin')
      console.error('Error fetching machines:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load data saat component mount
  useEffect(() => {
    fetchMachines()
  }, [fetchMachines])

  // Tambah mesin baru
  const addMachine = useCallback(async (newMachine) => {
    try {
      const response = await rekapAPI.create(newMachine)
      setMachines(prev => [...prev, response.data.data || response.data])
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal menambah mesin'
      console.error('Error adding machine:', err)
      return { success: false, error: errorMsg }
    }
  }, [])

  // Update mesin
  const updateMachine = useCallback(async (terminalId, updatedData) => {
    try {
      const response = await mesinAPI.update(terminalId, updatedData)
      setMachines(prev => 
        prev.map(m => 
          m.terminal_id === terminalId 
            ? { ...m, ...(response.data.data || response.data) } 
            : m
        )
      )
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal memperbarui mesin'
      console.error('Error updating machine:', err)
      return { success: false, error: errorMsg }
    }
  }, [])

  // Delete mesin (jika backend support)
  const deleteMachine = useCallback((terminalId) => {
    setMachines(prev => prev.filter(m => m.terminal_id !== terminalId))
  }, [])

  return {
    machines,
    loading,
    error,
    fetchMachines,
    addMachine,
    updateMachine,
    deleteMachine
  }
}