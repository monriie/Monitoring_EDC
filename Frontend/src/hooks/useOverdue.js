import { useState, useEffect, useCallback } from 'react'
import { overdueAPI } from '@/service/api'
import { normalizeMachinesList } from '@/utils/statusNormalizer'
import toast from 'react-hot-toast'

export const useOverdue = () => {
  const [summary, setSummary] = useState({
    total_perbaikan: 0,
    warning: 0,
    overdue: 0,
    estimasi_kerugian: 0,
    statusOverdue: [],
  })
  const [overdueList, setOverdueList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSummary = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await overdueAPI.getSummary()
      
      console.log('SUMMARY RESPONSE:', response)

      setSummary({
        total_perbaikan: response?.total_perbaikan || 0,
        warning: response?.warning || 0,
        overdue: response?.overdue || 0,
        estimasi_kerugian: response?.estimasi_kerugian || 0,
        statusOverdue: Array.isArray(response?.statusOverdue) ? response.statusOverdue : [],
      })
      return { success: true, data: response }
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat summary overdue'
      setError(errorMessage)
      console.error('Overdue summary error:', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchList = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await overdueAPI.getList()
      
      // Normalisasi status dari backend
      const normalized = normalizeMachinesList(Array.isArray(response) ? response : [])
      setOverdueList(normalized)
      
      return { success: true, data: normalized }
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat list overdue'
      setError(errorMessage)
      console.error('Overdue list error:', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const searchOverdue = useCallback(async (query) => {
    if (!query) {
      await fetchList()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await overdueAPI.search(query)
      
      // Normalisasi status dari backend
      const normalized = normalizeMachinesList(Array.isArray(response) ? response : [])
      setOverdueList(normalized)
      
      return { success: true, data: normalized }
    } catch (err) {
      const errorMessage = err.message || 'Gagal mencari overdue'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [fetchList])

  useEffect(() => {
    fetchSummary()
    fetchList()
  }, [fetchSummary, fetchList])

  return {
    summary,
    overdueList,
    loading,
    error,
    fetchSummary,
    fetchList,
    searchOverdue,
  }
};