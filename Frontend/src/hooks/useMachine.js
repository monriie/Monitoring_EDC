import { useState, useEffect, useCallback } from 'react'
import { rekapAPI, mesinAPI } from '@/service/api'
import toast from 'react-hot-toast'

export const useMachines = () => {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch semua mesin
  const fetchMachines = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await rekapAPI.getAll()
      setMachines(response.data || response)
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal memuat data mesin'
      setError(errorMsg)
      console.error('Error fetching machines:', err)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMachines()
    
    // Listen for reload events
    const handleReloadMachineList = () => {
      console.log('useMachines: reloadMachineList event received')
      fetchMachines()
    }
    
    const handleRekapUpdated = () => {
      console.log('useMachines: rekapUpdated event received')
      fetchMachines()
    }
    
    addEventListener('reloadMachineList', handleReloadMachineList)
    addEventListener('rekapUpdated', handleRekapUpdated)
    
    return () => {
      removeEventListener('reloadMachineList', handleReloadMachineList)
      removeEventListener('rekapUpdated', handleRekapUpdated)
    }
  }, [fetchMachines])

  // Tambah mesin baru
  const addMachine = useCallback(async (newMachine) => {
    try {
      console.log('Adding machine with data:', newMachine) // Debug log
      
      const response = await rekapAPI.create(newMachine)
      
      console.log('API Response:', response) // Debug log
      
      // Refresh data setelah berhasil tambah
      await fetchMachines()
      
      return { 
        success: true, 
        data: response.data,
        message: response.data?.message || 'Mesin berhasil ditambahkan'
      }
    } catch (err) {
      console.error('Error adding machine:', err)
      console.error('Error response:', err.response) // Debug log
      
      const errorMsg = err.response?.data?.message || 'Gagal menambah mesin'
      
      return { 
        success: false, 
        error: errorMsg 
      }
    }
  }, [fetchMachines])

  // Update mesin
  const updateMachine = useCallback(async (terminalId, updatedData) => {
    try {
      const response = await mesinAPI.update(terminalId, updatedData)
      
      // Refresh data setelah update
      await fetchMachines()
      
      return { 
        success: true, 
        data: response.data,
        message: 'Mesin berhasil diperbarui'
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal memperbarui mesin'
      console.error('Error updating machine:', err)
      
      return { 
        success: false, 
        error: errorMsg 
      }
    }
  }, [fetchMachines])

  // Delete mesin
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
};