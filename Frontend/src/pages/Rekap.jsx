import React, { useState } from 'react'
import { Plus, Download, AlertTriangle, FileText, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import RekapTable from '@/components/table/RekapTable'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'
import YearSortFilter from '@/components/common/YearSortFilter'
import { useRekap } from '@/hooks/useRekap'
import { useFilters } from '@/hooks/useFilter'
import { usePagination } from '@/hooks/usePagination'
import { useExport } from '@/hooks/useExport'
import Loading from '@/components/common/Loading'

const Rekap = () => {
  const { machines, loading, error, fetchMachines } = useRekap()
  const { exportToPDF, exportToExcel } = useExport()
  const [searchTerm, setSearchTerm] = useState('')

  const {
    filterStatus,
    setFilterStatus,
    filterData,
    setFilterData,
    filterCabang,
    setFilterCabang,
    filterYear,
    setFilterYear,
    sortOrder,
    setSortOrder,
    availableYears,
    availableBranches,
    filteredData,
  } = useFilters(machines)

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(filteredData, 10)

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchTerm(value)
    if (value.length >= 3 || value.length === 0) {
      fetchMachines(value)
    }
  }

  // Trigger AddModal
  const handleAddClick = () => {
    window.dispatchEvent(new Event('openAddModal'))
  }

  const newVendorCount = machines.filter((m) => m.status_data === 'VENDOR_ONLY').length

  // Loading state
  if (loading && machines.length === 0) {
    return (
      <Loading/>
    )
  }

  // Error state
  if (error && machines.length === 0) {
    return (
      <section className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load rekap data</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Rekap Data Mesin EDC</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar lengkap semua mesin EDC</p>
          {newVendorCount > 0 && (
            <Badge variant="secondary" className="mt-2">
              <AlertTriangle size={14} className="mr-1" />
              {newVendorCount} mesin baru dari vendor
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleAddClick} className="bg-green-600 hover:bg-green-700">
            <Plus size={16} className="md:mr-2" />
            Tambah Rekap
          </Button>
          <Button onClick={() => exportToPDF(filteredData, 'rekap')} variant="destructive">
            <Download size={16} className="md:mr-2" />
            PDF
          </Button>
          <Button
            onClick={() => exportToExcel(filteredData, 'rekap')}
            className="bg-[#00AEEF] hover:bg-[#26baf1]"
          >
            <Download size={16} className="md:mr-2" />
            Excel
          </Button>
        </div>
      </header>

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
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
              <div>
                <Label htmlFor="status-mesin">Status Mesin</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status-mesin" className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="AKTIF">Aktif</SelectItem>
                    <SelectItem value="PERBAIKAN">Perbaikan</SelectItem>
                    <SelectItem value="RUSAK">Rusak</SelectItem>
                    <SelectItem value="TIDAK_AKTIF">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status-data">Status Data</Label>
                <Select value={filterData} onValueChange={setFilterData}>
                  <SelectTrigger id="status-data" className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Data</SelectItem>
                    <SelectItem value="TERDATA_BANK">Terdata Bank</SelectItem>
                    <SelectItem value="VENDOR_ONLY">Vendor Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            <EmptyState icon={FileText} title="Tidak ada data mesin yang terdaftar" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <RekapTable machines={paginatedItems} />
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
            )}
          </CardContent>
        </Card>
      )}
    </section>
  )
}

export default Rekap;