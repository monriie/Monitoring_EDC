import { useCallback } from 'react'
import { exportToPDF as exportPDF, exportToCSV } from '@/utils/exportUtils'
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
  const exportToPDF = useCallback((data, selectedYears, filename) => {
    try {
      // Filter data dulu
      const filteredData = filterDataByYears(data, selectedYears)
      
      if (filteredData.length === 0) {
        toast.error('Tidak ada data untuk tahun yang dipilih')
        return false
      }

      // Panggil fungsi export PDF dari exportUtils
      const success = exportPDF(filteredData, filename, selectedYears)
      
      if (success) {
        toast.success(`File PDF berhasil di-export (${filteredData.length} data)`)
      }
      
      return success
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Gagal export PDF: ' + error.message)
      return false
    }
  }, [filterDataByYears])

  // Export data ke Excel (CSV)
  const exportToExcel = useCallback((data, selectedYears, filename) => {
    try {
      // Filter data dulu
      const filteredData = filterDataByYears(data, selectedYears)
      
      if (filteredData.length === 0) {
        toast.error('Tidak ada data untuk tahun yang dipilih')
        return false
      }

      // Panggil fungsi export CSV dari exportUtils
      const success = exportToCSV(filteredData, filename, selectedYears)
      
      if (success) {
        toast.success(`File Excel berhasil di-export (${filteredData.length} data)`)
      }
      
      return success
    } catch (error) {
      console.error('Error exporting Excel:', error)
      toast.error('Gagal export Excel: ' + error.message)
      return false
    }
  }, [filterDataByYears])

  // Get unique years from data
  const getAvailableYears = useCallback((data) => {
    const years = data
      .map(item => item.tanggal_pasang ? new Date(item.tanggal_pasang).getFullYear() : null)
      .filter(year => year !== null)
    
    return [...new Set(years)].sort((a, b) => b - a)
  }, [])

  return {
    exportToPDF,
    exportToExcel,
    getAvailableYears,
    filterDataByYears
  }
};