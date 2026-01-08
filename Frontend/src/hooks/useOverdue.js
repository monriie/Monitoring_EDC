import { useState, useEffect, useCallback } from 'react'
import { overdueAPI } from '@/service/api'
import toast from 'react-hot-toast'

export const useOverdue = () => {
  const [summary, setSummary] = useState({
    total_perbaikan: 0,
    warning: 0,
    overdue: 0,
    estimasi_kerugian: 0,
  })
  const [overdueList, setOverdueList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch overdue summary
  const fetchSummary = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await overdueAPI.getSummary()
      // Ensure we have valid data structure
      setSummary({
        total_perbaikan: response?.total_perbaikan || 0,
        warning: response?.warning || 0,
        overdue: response?.overdue || 0,
        estimasi_kerugian: response?.estimasi_kerugian || 0,
      })
      return { success: true, data: response }
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat summary overdue'
      setError(errorMessage)
      // Don't show toast on initial load
      console.error('Overdue summary error:', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch overdue list
  const fetchList = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await overdueAPI.getList()
      // Ensure array format
      setOverdueList(Array.isArray(response) ? response : [])
      return { success: true, data: response }
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat list overdue'
      setError(errorMessage)
      console.error('Overdue list error:', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // Search overdue
  const searchOverdue = useCallback(async (query) => {
    if (!query) {
      await fetchList()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await overdueAPI.search(query)
      setOverdueList(Array.isArray(response) ? response : [])
      return { success: true, data: response }
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
}