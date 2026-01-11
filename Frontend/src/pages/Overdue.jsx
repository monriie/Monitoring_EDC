import React, { useMemo, useState } from 'react'
import { AlertTriangle, DollarSign, CheckCircle, Search, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import StatCard from '@/components/common/StatCard'
import OverdueTable from '@/components/table/OverdueTable'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'
import YearSortFilter from '@/components/common/YearSortFilter'
import { useOverdue } from '@/hooks/useOverdue'
import { useFilters } from '@/hooks/useFilter'
import { usePagination } from '@/hooks/usePagination'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/utils/formatter'
import Loading from '@/components/common/Loading'

const Overdue = () => {
  const { summary, overdueList, loading, error, searchOverdue } = useOverdue()
  const [searchTerm, setSearchTerm] = useState('')

  // Apply filters to overdue machines
  const {
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
    filteredData,
  } = useFilters(overdueList)

  // Pagination
  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(filteredData, 10)

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchTerm(value)
    if (value.length >= 3 || value.length === 0) {
      searchOverdue(value)
    }
  }

  // Handle stat card click for filtering
  const handleStatClick = (status) => {
    setFilterPerbaikan(status)
  }

  // Loading state
  if (loading && overdueList.length === 0) {
    return (
      <Loading/>
    )
  }

  // Error state
  if (error && overdueList.length === 0) {
    return (
      <section className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load overdue data</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Monitoring Overdue</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pantau mesin yang mendekati atau melewati estimasi perbaikan
        </p>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div onClick={() => handleStatClick('PERBAIKAN')} className="cursor-pointer">
          <StatCard
            title="Perbaikan"
            value={summary.total_perbaikan - summary.warning - summary.overdue}
            icon={CheckCircle}
            iconColor="text-green-600"
          />
        </div>

        <div onClick={() => handleStatClick('WARNING')} className="cursor-pointer">
          <StatCard
            title="Warning (≤ 3 hari)"
            value={summary.warning}
            icon={AlertTriangle}
            iconColor="text-yellow-600"
          />
        </div>

        <div onClick={() => handleStatClick('OVERDUE')} className="cursor-pointer">
          <StatCard
            title="Overdue"
            value={summary.overdue}
            icon={AlertTriangle}
            iconColor="text-[#ed1c24]"
          />
        </div>

        <StatCard
          title="Estimasi Kerugian"
          value={formatCurrency(summary.estimasi_kerugian)}
          icon={DollarSign}
          iconColor="text-[#ed1c24]"
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
                  onChange={(e) => handleSearch(e.target.value)}
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
                    {availableBranches.map((branch) => (
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

      {/* Table */}
      {filteredData.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <EmptyState
              icon={FileText}
              title="Tidak ada mesin overdue atau mendekati deadline"
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <OverdueTable machines={paginatedItems} />
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
            )}
          </CardContent>
        </Card>
      )}
    </section>
  )
}

export default Overdue;