import { useCallback } from 'react'

export const useExport = () => {
  const exportToPDF = useCallback((data, filename = 'export') => {
    alert(`Export ${filename} to PDF dengan ${data.length} data\n\nFitur ini akan terintegrasi dengan library jsPDF`)
  }, [])

  const exportToExcel = useCallback((data, filename = 'export') => {
    alert(`Export ${filename} to Excel dengan ${data.length} data\n\nFitur ini akan terintegrasi dengan library xlsx`)
  }, [])

  return {
    exportToPDF,
    exportToExcel
  }
};