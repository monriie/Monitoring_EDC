import { useCallback } from 'react'
import { exportToPDF as exportPDF, exportToCSV, exportSewaToPDF } from '@/utils/exportUtils'
import toast from 'react-hot-toast'

export const useExport = () => {
  // Filter data berdasarkan tahun yang dipilih
  const filterDataByYears = useCallback((data, selectedYears) => {
    if (!selectedYears || selectedYears.length === 0) {
      return data
    }

    return data.filter(item => {
      if (!item.tanggal_pasang) return false
      const year = new Date(item.tanggal_pasang).getFullYear()
      return selectedYears.includes(year)
    })
  }, [])

  // Export data ke PDF
  const exportToPDF = useCallback((data, filename, selectedYears = []) => {
    try {
      if (data.length === 0) {
        toast.error('Tidak ada data untuk di-export')
        return false
      }

      // Panggil fungsi export PDF - selectedYears sudah dihandle di dalam exportUtils
      const success = exportPDF(data, filename, selectedYears)
      
      if (success) {
        const yearLabel = selectedYears.length > 0 
          ? ` (${selectedYears.sort((a, b) => a - b).join(', ')})`
          : ''
        toast.success(`File PDF berhasil di-export${yearLabel}`)
      }
      
      return success
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Gagal export PDF: ' + error.message)
      return false
    }
  }, [])

  // Export sewa ke PDF
  const exportSewatoPDF = useCallback((data, filename, selectedYears = []) => {
    try {
      if (data.length === 0) {
        toast.error('Tidak ada data untuk di-export')
        return false
      }

      const success = exportSewaToPDF(data, filename, selectedYears)
      
      if (success) {
        const yearLabel = selectedYears.length > 0 
          ? ` (${selectedYears.sort((a, b) => a - b).join(', ')})`
          : ''
        toast.success(`File PDF berhasil di-export${yearLabel}`)
      }
      
      return success
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Gagal export PDF: ' + error.message)
      return false
    }
  }, [])

  // Export data ke Excel (CSV)
  const exportToExcel = useCallback((data, filename, selectedYears = []) => {
    try {
      if (data.length === 0) {
        toast.error('Tidak ada data untuk di-export')
        return false
      }

      // Panggil fungsi export CSV - selectedYears sudah dihandle di dalam exportUtils
      const success = exportToCSV(data, filename, selectedYears)
      
      if (success) {
        const yearLabel = selectedYears.length > 0 
          ? ` (${selectedYears.sort((a, b) => a - b).join(', ')})`
          : ''
        toast.success(`File Excel berhasil di-export${yearLabel}`)
      }
      
      return success
    } catch (error) {
      console.error('Error exporting Excel:', error)
      toast.error('Gagal export Excel: ' + error.message)
      return false
    }
  }, [])

  // Get unique years from data
  const getAvailableYears = useCallback((data) => {
    const years = data
      .map(item => item.tanggal_pasang ? new Date(item.tanggal_pasang).getFullYear() : null)
      .filter(year => year !== null)
    
    return [...new Set(years)].sort((a, b) => b - a)
  }, [])

  return {
    exportToPDF,
    exportSewatoPDF,
    exportToExcel,
    getAvailableYears,
    filterDataByYears
  }
};