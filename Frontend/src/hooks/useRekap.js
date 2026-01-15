import { useState, useEffect, useCallback } from 'react'
import { rekapAPI, sewaAPI, excelAPI } from '@/service/api'
import { normalizeMachinesList } from '@/utils/statusNormalizer'
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
      const data = Array.isArray(response) ? response : []
      setMachines(data)
      console.log('✅ Fetched machines:', data.length)
      return { success: true, data }
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat data rekap'
      setError(errorMessage)
      console.error('Rekap fetch error:', errorMessage)
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
      console.log('✅ Machine created:', response)
      
      toast.success('Rekap mesin berhasil ditambahkan')
      
      await fetchMachines()
      window.dispatchEvent(new Event('rekapUpdated'))
      
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

  // Upload Excel Vendor
  const uploadVendorExcel = useCallback(async (file) => {
    setLoading(true)
    setError(null)

    try {
      const response = await excelAPI.uploadVendor(file)
      console.log('✅ Vendor Excel uploaded:', response)
      
      toast.success(
        `Upload vendor berhasil! Ditambahkan: ${response.inserted || 0}, Diupdate: ${response.updated || 0}, Dilewati: ${response.skipped || 0}`,
        { duration: 5000 }
      )
      await fetchMachines()
      dispatchEvent(new Event('rekapUpdated'))
      
      return { success: true, data: response }
    } catch (err) {
      const errorMessage = err.message || 'Gagal upload file vendor'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [fetchMachines])

  // Upload Excel Bank
  const uploadBankExcel = useCallback(async (file) => {
    setLoading(true)
    setError(null)

    try {
      const response = await excelAPI.uploadBank(file)
      console.log('✅ Bank Excel uploaded:', response)
      
      toast.success(
        `Upload bank berhasil! Ditambahkan: ${response.inserted || 0}, Diupdate: ${response.updated || 0}, Dilewati: ${response.skipped || 0}`,
        { duration: 5000 }
      )
      
      await fetchMachines()
      dispatchEvent(new Event('rekapUpdated'))
      
      return { success: true, data: response }
    } catch (err) {
      const errorMessage = err.message || 'Gagal upload file bank'
      setError(errorMessage)
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [fetchMachines])

  useEffect(() => {
    fetchMachines()
  }, [fetchMachines])

  return {
    machines,
    loading,
    error,
    fetchMachines,
    createMachine,
    uploadVendorExcel,
    uploadBankExcel,
  }
}


// sewa
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

  const fetchSummary = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await sewaAPI.getSummary()
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

  const fetchList = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await sewaAPI.getList()
      
      // Normalisasi status dari backend
      const normalized = normalizeMachinesList(Array.isArray(response) ? response : [])
      setSewaList(normalized)
      
      return { success: true, data: normalized }
    } catch (err) {
      const errorMessage = err.message || 'Gagal memuat list sewa'
      setError(errorMessage)
      console.error('Sewa list error:', errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const searchSewa = useCallback(async (query) => {
    if (!query) {
      await fetchList()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await sewaAPI.search(query)
      
      // Normalisasi status dari backend
      const normalized = normalizeMachinesList(Array.isArray(response) ? response : [])
      setSewaList(normalized)
      
      return { success: true, data: normalized }
    } catch (err) {
      const errorMessage = err.message || 'Gagal mencari sewa'
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
    sewaList,
    loading,
    error,
    fetchSummary,
    fetchList,
    searchSewa,
  }
}