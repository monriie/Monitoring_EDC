import jsPDF from 'jspdf'
import { formatCurrency } from './formatter'
import toast from 'react-hot-toast'
import autoTable from 'jspdf-autotable'

export const normalizeYears = (years) => {
  if (Array.isArray(years)) return years
  if (years) return [years]
  return []
}

// Export data ke CSV (bisa dibuka di Excel)
export const exportToCSV = (data, filename, selectedYears = []) => {
  try {
    // Filter data by years if specified
    const filteredData = selectedYears.length > 0
      ? data.filter(item => {
          if (!item.tanggal_pasang) return false
          const year = new Date(item.tanggal_pasang).getFullYear()
          return selectedYears.includes(year)
        })
      : data

    if (filteredData.length === 0) {
      toast.error('Tidak ada data untuk di-export')
      return false
    }

    // Define CSV headers
    const headers = [
      'Terminal ID',
      'MID',
      'Nama Nasabah',
      'Kota',
      'Cabang',
      'Tipe EDC',
      'Vendor',
      'Status Mesin',
      'Status Data',
      'Status Sewa',
      'Letak Mesin',
      'Tanggal Pasang',
      'Biaya Sewa',
      'Estimasi Selesai'
    ]

    // Convert data to CSV rows
    const csvRows = filteredData.map(item => [
      item.terminal_id || '',
      item.mid || '',
      item.nama_nasabah || 'N/A',
      item.kota || '',
      item.cabang || '',
      item.tipe_edc || '',
      item.vendor || '',
      item.status_mesin || '',
      item.status_data || '',
      item.status_sewa || '',
      item.status_letak || '',
      item.tanggal_pasang || '',
      item.biaya_sewa || 0,
      item.estimasi_selesai || ''
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(';'),
      ...csvRows.map(row => 
        row.map(cell => {
          // Handle cells with commas or quotes
          const cellStr = String(cell)
          if (cellStr.includes(';') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`
          }
          return cellStr
        }).join(';')
      )
    ].join('\n')

    // Add BOM for Excel UTF-8 support
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })

    // Create download link
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    const years = normalizeYears(selectedYears)
    const yearLabel = years.length > 0 
      ? `_${years.sort((a, b) => a - b).join('-')}`
      : ''
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}${yearLabel}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return true
  } catch (error) {
    console.error('Error exporting to CSV:', error)
    toast.error('Gagal export CSV: ' + error.message)
    return false
  }
}

// Export data ke PDF
export const exportToPDF = (data, filename = 'export', selectedYears = []) => {
  try {
    // Filter data by years if specified
    const filteredData = selectedYears.length > 0
      ? data.filter(item => {
          if (!item.tanggal_pasang) return false
          const year = new Date(item.tanggal_pasang).getFullYear()
          return selectedYears.includes(year)
        })
      : data

    if (filteredData.length === 0) {
      toast.error('Tidak ada data untuk di-export')
      return false
    }

    // Create PDF document (A4 landscape)
    const doc = new jsPDF('l', 'mm', 'a4')
    
    // Add title
    const years = normalizeYears(selectedYears)
    const yearLabel = years.length > 0 
      ? ` (Tahun ${years.sort((a, b) => a - b).join(', ')})`
      : ''
    
    doc.setFontSize(16)
    doc.text(`Rekap Mesin EDC${yearLabel}`, 14, 15)
    
    doc.setFontSize(10)
    doc.text(`Bank Sumsel Babel`, 14, 22)
    doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 14, 27)
    doc.text(`Total Data: ${filteredData.length} mesin`, 14, 32)

    // Prepare table data
    const tableHeaders = [
      'Terminal ID',
      'Nasabah',
      'Kota',
      'Cabang',
      'Tipe EDC',
      'Status Mesin',
      'Status Data',
      'Tanggal Pasang',
      'Biaya Sewa'
    ]

    const tableData = filteredData.map(item => [
      item.terminal_id || '',
      item.nama_nasabah || 'N/A',
      item.kota || '',
      item.cabang || '',
      item.tipe_edc || '',
      item.status_mesin || '',
      item.status_data || '',
      item.tanggal_pasang || '',
      formatCurrency(item.biaya_sewa || 0)
    ])

    // Add table to PDF
    autoTable(doc,{
      head: [tableHeaders],
      body: tableData,
      startY: 38,
      styles: { 
        fontSize: 8,
        cellPadding: 2,
        font: 'helvetica'
      },
      headStyles: {
        fillColor: [0, 174, 239], // Bank Sumsel blue
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 38 },
    //   didDrawPage: (data) => {
    //     // Footer
    //     const pageCount = doc.internal.getNumberOfPages()
    //     const pageSize = doc.internal.pageSize
    //     const pageHeight = pageSize.height || pageSize.getHeight()
        
    //     doc.setFontSize(8)
    //     doc.text(
    //       `Halaman ${data.pageNumber} dari ${pageCount}`,
    //       data.settings.margin.left,
    //       pageHeight - 10
    //     )
        
    //     doc.text(
    //       'PT Bank Pembangunan Daerah Sumatera Selatan dan Bangka Belitung',
    //       pageSize.width / 2,
    //       pageHeight - 10,
    //       { align: 'center' }
    //     )
    //   }
    })

    const yearSuffix = years.length > 0 ? `_${years.join('-')}` : ''
    doc.save(`rekap-mesin${yearSuffix}.pdf`)

    return true
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    toast.error('Gagal export PDF: ' + error.message)
    return false
  }
}

// Export data Sewa ke PDF dengan format khusus
export const exportSewaToPDF = (data, filename = 'sewa', selectedYears = []) => {
  try {

    const filteredData = selectedYears.length > 0
      ? data.filter(item => {
          if (!item.tanggal_pasang) return false
          const year = new Date(item.tanggal_pasang).getFullYear()
          return years.includes(year)
        })
      : data

    if (filteredData.length === 0) {
      toast.error('Tidak ada data untuk di-export')
      return false
    }

    const doc = new jsPDF('l', 'mm', 'a4')
    
    const years = normalizeYears(selectedYears)
    const yearLabel = years.length > 0 
      ? ` (Tahun ${years.sort((a, b) => a - b).join(', ')})`
      : ''
    
    doc.setFontSize(16)
    doc.text(`Monitoring Sewa Mesin${yearLabel}`, 14, 15)
    
    doc.setFontSize(10)
    doc.text(`Bank Sumsel Babel`, 14, 22)
    doc.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 14, 27)

    // Calculate summary
    const sewaAktif = filteredData.filter(m => m.status_sewa === 'AKTIF').length
    const sewaBerakhir = filteredData.filter(m => m.status_sewa === 'BERAKHIR').length
    const totalBiaya = filteredData
      .filter(m => m.status_sewa === 'AKTIF')
      .reduce((sum, m) => sum + (m.biaya_sewa || 0), 0)

    doc.text(`Total Data: ${filteredData.length} mesin`, 14, 32)
    doc.text(`Sewa Aktif: ${sewaAktif} | Berakhir: ${sewaBerakhir}`, 14, 37)
    doc.text(`Total Biaya Sewa/Bulan: ${formatCurrency(totalBiaya)}`, 14, 42)

    const tableHeaders = [
      'Terminal ID',
      'Nasabah',
      'Tanggal Pasang',
      'Status Mesin',
      'Letak',
      'Status Sewa',
      'Biaya/Bulan'
    ]

    const tableData = filteredData.map(item => [
      item.terminal_id || '',
      item.nama_nasabah || 'N/A',
      item.tanggal_pasang || '',
      item.status_mesin || '',
      item.status_letak || '',
      item.status_sewa || '',
      formatCurrency(item.biaya_sewa || 0)
    ])

    autoTable(doc,{
      head: [tableHeaders],
      body: tableData,
      startY: 47,
      styles: { 
        fontSize: 8,
        cellPadding: 2,
        font: 'helvetica'
      },
      headStyles: {
        fillColor: [0, 174, 239],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
    //   didDrawPage: (data) => {
    //     const pageCount = doc.internal.getNumberOfPages()
    //     const pageSize = doc.internal.pageSize
    //     const pageHeight = pageSize.height || pageSize.getHeight()
        
    //     doc.setFontSize(8)
    //     doc.text(
    //       `Halaman ${data.pageNumber} dari ${pageCount}`,
    //       data.settings.margin.left,
    //       pageHeight - 10
    //     )
    //   }
    })
    const yearSuffix = years.length > 0 ? `_${years.join('-')}` : ''
    doc.save(`sewa-mesin${yearSuffix}.pdf`)

    return true
  } catch (error) {
    console.error('Error exporting sewa to PDF:', error)
    toast.error('Gagal export PDF: ' + error.message)
    return false
  }
};