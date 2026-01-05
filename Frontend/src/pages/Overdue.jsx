import React, { useMemo } from 'react'
import { AlertTriangle, DollarSign, CheckCircle, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import StatCard from '@/components/common/StatCard'
import OverdueTable from '@/components/table/OverdueTable'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'
import YearSortFilter from '@/components/common/YearSortFilter'
import { useMachines } from '@/hooks/useMachine'
import { useFilters } from '@/hooks/useFilter'
import { usePagination } from '@/hooks/usePagination'
import { getOverdueInfo, calculateLoss } from '@/utils/helper'
import { calculateDaysOverdue } from '@/utils/dateUtils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const Overdue = () => {
  const { machines: allMachines } = useMachines()

  // Make getOverdueInfo globally accessible for filter
  React.useEffect(() => {
    window.getOverdueInfo = getOverdueInfo
  }, [])

  // Get all overdue and warning machines first
  const overdueAndWarningMachines = useMemo(() => {
    const today = new Date()
    return allMachines.filter(m => {
      const info = getOverdueInfo(m, today)
      return info.isOverdue || info.isWarning || m.status_mesin === 'PERBAIKAN'
    })
  }, [allMachines])

  // Apply filters to overdue machines
  const {
    searchTerm,
    setSearchTerm,
    filterPerbaikan,
    setFilterPerbaikan,
    filterCabang,
    setFilterCabang,
    filterLetak,
    setFilterLetak,
    filterYear,
    setFilterYear,
    sortOrder,
    setSortOrder,
    availableYears,
    availableBranches,
    availableLetak,
    filteredData
  } = useFilters(overdueAndWarningMachines)

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage
  } = usePagination(filteredData, 10)

  // Calculate stats from ALL repair machines (not filtered)
  const stats = useMemo(() => {
    const today = new Date()
    const inRepairList = allMachines.filter(m => m.status_mesin === 'PERBAIKAN')
    
    const overdueList = inRepairList.filter(m => {
      const info = getOverdueInfo(m, today)
      return info.isOverdue
    })

    const warningList = inRepairList.filter(m => {
      const info = getOverdueInfo(m, today)
      return info.isWarning
    })

    const onTrackList = inRepairList.filter(m => {
      const info = getOverdueInfo(m, today)
      return !info.isOverdue && !info.isWarning
    })

    const allProblematic = [...overdueList, ...warningList]
    const totalLoss = allProblematic.reduce((sum, m) => {
      const days = calculateDaysOverdue(m.estimasi_selesai)
      return sum + calculateLoss(m, days)
    }, 0)

    return {
      onTrack: onTrackList.length,
      warning: warningList.length,
      overdue: overdueList.length,
      totalLoss
    }
  }, [allMachines])

  // Handle stat card click for filtering
  const handleStatClick = (status) => {
    setFilterPerbaikan(status)
  }

  return (
    <section className="space-y-6">      
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Monitoring Overdue</h1>
        <p className="text-sm text-gray-500 mt-1">Pantau mesin yang mendekati atau melewati estimasi perbaikan</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div onClick={() => handleStatClick('PERBAIKAN')} className="cursor-pointer">
          <StatCard
            title="Perbaikan"
            value={stats.onTrack}
            icon={CheckCircle}
            iconColor="text-green-600"
          />
        </div>

        <div onClick={() => handleStatClick('WARNING')} className="cursor-pointer">
          <StatCard
            title="Warning (≤3 hari)"
            value={stats.warning}
            icon={AlertTriangle}
            iconColor="text-yellow-600"
          />
        </div>

        <div onClick={() => handleStatClick('OVERDUE')} className="cursor-pointer">
          <StatCard
            title="Overdue"
            value={stats.overdue}
            icon={AlertTriangle}
            iconColor="text-[#ed1c24]"
          />
        </div>

        <StatCard
          title="Estimasi Kerugian"
          value={`Rp ${stats.totalLoss.toLocaleString('id-ID')}`}
          icon={DollarSign}
          iconColor="text-[#ed1c24]"
          className="-nowrap"
        />
      </div>

      {/* Filter Section */}
      <Card>
        <CardContent>
          <div>
            <div>
              <Label htmlFor="search">Pencarian</Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Terminal ID / Nasabah"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div>
                <Label htmlFor="cabang">Cabang</Label>
                <Select value={filterCabang} onValueChange={setFilterCabang}>
                  <SelectTrigger id="cabang" className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Cabang</SelectItem>
                    {availableBranches.map(branch => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="letak">Letak Mesin</Label>
                <Select value={filterLetak} onValueChange={setFilterLetak}>
                  <SelectTrigger id="letak" className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Letak</SelectItem>
                    <SelectItem value="BANK">Bank</SelectItem>
                    <SelectItem value="VENDOR">Vendor</SelectItem>
                    <SelectItem value="NASABAH">Nasabah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <YearSortFilter
                filterYear={filterYear}
                setFilterYear={setFilterYear}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                availableYears={availableYears}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredData.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <EmptyState
              icon={CheckCircle}
              title="Tidak ada mesin overdue atau mendekati deadline"
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <OverdueTable machines={paginatedItems} />
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={goToPage} 
              />
            )}
          </CardContent>
        </Card>
      )}
    </section>
  )
}

export default Overdue;