import { useCallback } from 'react'

export const useExport = () => {
  //  Filter data berdasarkan tahun yang dipilih
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
  const exportToPDF = useCallback((data, selectedYears, filename = 'export') => {
    const filteredData = filterDataByYears(data, selectedYears)
    
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk tahun yang dipilih')
      return
    }

    const yearLabel = selectedYears.sort((a, b) => a - b).join('-')
    const finalFilename = `${filename}_${yearLabel}`
    
    console.log('Export to PDF:', {
      filename: finalFilename,
      years: selectedYears,
      totalData: filteredData.length
    })

    // Implementasi export PDF menggunakan jsPDF
    alert(
      `Export ${finalFilename}.pdf\n\n` +
      `Tahun: ${selectedYears.join(', ')}\n` +
      `Total data: ${filteredData.length} mesin\n\n` +
      `Fitur ini akan terintegrasi dengan library jsPDF`
    )
  }, [filterDataByYears])

  // Export data ke Excel
  const exportToExcel = useCallback((data, selectedYears, filename = 'export') => {
    const filteredData = filterDataByYears(data, selectedYears)
    
    if (filteredData.length === 0) {
      alert('Tidak ada data untuk tahun yang dipilih')
      return
    }

    const yearLabel = selectedYears.sort((a, b) => a - b).join('-')
    const finalFilename = `${filename}_${yearLabel}`
    
    console.log('Export to Excel:', {
      filename: finalFilename,
      years: selectedYears,
      totalData: filteredData.length
    })

    // Implementasi export Excel menggunakan xlsx/SheetJS
    alert(
      `Export ${finalFilename}.xlsx\n\n` +
      `Tahun: ${selectedYears.join(', ')}\n` +
      `Total data: ${filteredData.length} mesin\n\n` +
      `Fitur ini akan terintegrasi dengan library SheetJS (xlsx)`
    )
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