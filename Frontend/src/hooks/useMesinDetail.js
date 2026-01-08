import { useState, useEffect, useCallback } from 'react'
import { mesinAPI } from '@/service/api'
import toast from 'react-hot-toast'

export const useMesinDetail = (terminalId) => {
  const [machine, setMachine] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch machine detail
  const fetchDetail = useCallback(async () => {
    if (!terminalId) {
      return { success: false, error: 'Terminal ID required' }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await mesinAPI.getDetail(terminalId)
      
      setMachine(response)
      return { success: true, data: response }
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat detail mesin'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [terminalId])

  // Update machine
  const updateMachine = useCallback(async (data) => {
    if (!terminalId) {
      return { success: false, error: 'Terminal ID required' }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await mesinAPI.update(terminalId, data)
      toast.success('Data mesin berhasil diperbarui')
      await fetchDetail()
      
      return { success: true, data: response }
    } catch (err) {
      const errorMessage = err.message || 'Gagal memperbarui mesin'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [terminalId, fetchDetail])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  return {
    machine,
    loading,
    error,
    fetchDetail,
    updateMachine,
  }
}