import { useState, useMemo } from 'react'

export const useFilters = (data) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterData, setFilterData] = useState('all')
  const [filterSewa, setFilterSewa] = useState('all') // Added for Sewa page
  const [filterPerbaikan, setFilterPerbaikan] = useState('all') // Added for Overdue page
  const [filterCabang, setFilterCabang] = useState('all') // Added for Branch filter
  const [filterLetak, setFilterLetak] = useState('all') // Added for Letak Mesin filter
  const [filterYear, setFilterYear] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  // Get unique years from tanggal_pasang
  const availableYears = useMemo(() => {
    const years = data
      .map(item => item.tanggal_pasang ? new Date(item.tanggal_pasang).getFullYear() : null)
      .filter(year => year !== null)
    return [...new Set(years)].sort((a, b) => b - a)
  }, [data])

  // Get unique branches
  const availableBranches = useMemo(() => {
    const branches = data
      .map(item => item.cabang)
      .filter(cabang => cabang && cabang !== 'N/A')
    return [...new Set(branches)].sort()
  }, [data])

  // Get unique letak mesin
  const availableLetak = useMemo(() => {
    const letakList = data
      .map(item => item.status_letak)
      .filter(letak => letak && letak !== 'N/A')
    return [...new Set(letakList)].sort()
  }, [data])


  const filteredData = useMemo(() => {
    let filtered = data.filter(item => {
      // Search filter
      const matchSearch = 
        item.terminal_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_nasabah?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Status mesin filter
      const matchStatus = filterStatus === 'all' || item.status_mesin === filterStatus
      
      // Status letak mesin filter
      const matchLetak = filterLetak === 'all' || item.status_letak === filterLetak
      
      // Status data filter
      const matchData = filterData === 'all' || item.status_data === filterData
      
      // Status sewa filter (for Sewa page)
      const matchSewa = filterSewa === 'all' || item.status_sewa === filterSewa
      
      // Branch filter
      const matchCabang = filterCabang === 'all' || item.cabang === filterCabang
      
      // Status perbaikan filter (for Overdue page)
      let matchPerbaikan = true
      if (filterPerbaikan !== 'all' && typeof window.getOverdueInfo === 'function') {
        const overdueInfo = window.getOverdueInfo(item)
        if (filterPerbaikan === 'OVERDUE') {
          matchPerbaikan = overdueInfo.isOverdue
        } else if (filterPerbaikan === 'WARNING') {
          matchPerbaikan = overdueInfo.isWarning
        } else if (filterPerbaikan === 'PERBAIKAN') {
          matchPerbaikan = item.status_mesin === 'PERBAIKAN' && !overdueInfo.isOverdue && !overdueInfo.isWarning
        }
      }
      
      // Year filter
      const matchYear = filterYear === 'all' || 
        (item.tanggal_pasang && new Date(item.tanggal_pasang).getFullYear() === parseInt(filterYear))

      return matchSearch && matchStatus && matchLetak && matchData && matchSewa && matchCabang && matchPerbaikan && matchYear
    })

    // Sort by tanggal_pasang
    filtered.sort((a, b) => {
      const dateA = a.tanggal_pasang ? new Date(a.tanggal_pasang) : new Date(0)
      const dateB = b.tanggal_pasang ? new Date(b.tanggal_pasang) : new Date(0)
      
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    return filtered
  }, [data, searchTerm, filterStatus, filterLetak, filterData, filterSewa, filterCabang, filterPerbaikan, filterYear, sortOrder])

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterLetak,
    setFilterLetak,
    filterData,
    setFilterData,
    filterSewa,
    setFilterSewa,
    filterCabang,
    setFilterCabang,
    filterPerbaikan,
    setFilterPerbaikan,
    filterYear,
    setFilterYear,
    sortOrder,
    setSortOrder,
    availableYears,
    availableBranches,
    availableLetak,
    filteredData
  }
};