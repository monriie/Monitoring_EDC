import { useState, useEffect, useCallback } from 'react'
import { rekapAPI, sewaAPI } from '@/service/api'
import toast from 'react-hot-toast'

export const useRekap = () => {
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all machines
  const fetchMachines = useCallback(async (searchQuery = '') => {
    setLoading(true)
    setError(null)

    try {
      const response = await rekapAPI.getAll(searchQuery)
      // Handle different response formats
      const data = Array.isArray(response) ? response : []
      setMachines(data)
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat data rekap'
      setError(errorMessage)
      console.error('Rekap fetch error:', errorMessage)
      // Set empty array on error
      setMachines([])
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // Create new machine
  const createMachine = useCallback(async (data) => {
    setLoading(true)
    setError(null)

    try {
      const response = await rekapAPI.create(data)
      toast.success('Rekap mesin berhasil ditambahkan')
      await fetchMachines() // Refresh list
      return { success: true, data: response }
    } catch (err) {
      const errorMessage = err.message || 'Gagal menambahkan rekap'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [fetchMachines])

  // Auto fetch on mount
  useEffect(() => {
    fetchMachines()
  }, [fetchMachines])

  return {
    machines,
    loading,
    error,
    fetchMachines,
    createMachine,
  }
}

export const useSewa = () => {
  const [summary, setSummary] = useState({
    sewa_aktif: 0,
    sewa_berakhir: 0,
    total_biaya_bulanan: 0,
    bermasalah: 0,
  })
  const [sewaList, setSewaList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch sewa summary
  const fetchSummary = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await sewaAPI.getSummary()
      // Ensure valid structure
      setSummary({
        sewa_aktif: response?.sewa_aktif || 0,
        sewa_berakhir: response?.sewa_berakhir || 0,
        total_biaya_bulanan: response?.total_biaya_bulanan || 0,
        bermasalah: response?.bermasalah || 0,
      })
      return { success: true, data: response }
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat summary sewa'
      setError(errorMessage)
      console.error('Sewa summary error:', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch sewa list
  const fetchList = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await sewaAPI.getList()
      setSewaList(Array.isArray(response) ? response : [])
      return { success: true, data: response }
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat list sewa'
      setError(errorMessage)
      console.error('Sewa list error:', errorMessage)
      setSewaList([])
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  // Search sewa
  const searchSewa = useCallback(async (query) => {
    if (!query) {
      await fetchList()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await sewaAPI.search(query)
      setSewaList(Array.isArray(response) ? response : [])
      return { success: true, data: response }
    } catch (err) {
      const errorMessage = err.message || 'Gagal mencari sewa'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [fetchList])

  // Fetch all data on mount
  useEffect(() => {
    fetchSummary()
    fetchList()
  }, [fetchSummary, fetchList])

  return {
    summary,
    sewaList,
    loading,
    error,
    fetchSummary,
    fetchList,
    searchSewa,
  }
}