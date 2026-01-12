import React, { useState } from 'react'
import { Download, CheckCircle, FileText, DollarSign, AlertTriangle, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import StatCard from '@/components/common/StatCard'
import SewaTable from '@/components/table/SewaTable'
import Pagination from '@/components/common/Pagination'
import YearSortFilter from '@/components/common/YearSortFilter'
import { useSewa } from '@/hooks/useRekap'
import { useFilters } from '@/hooks/useFilter'
import { usePagination } from '@/hooks/usePagination'
import { useExport } from '@/hooks/useExport'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/utils/formatter'
import Loading from '@/components/common/Loading'
import EmptyState from '@/components/common/EmptyState'
import ExportYearFilterModal from '@/components/modal/ExportYearFilterModal'

const Sewa = () => {
  const { summary, sewaList, loading, error, searchSewa } = useSewa()
  const { exportToPDF, exportToExcel, getAvailableYears } = useExport()
  const [searchTerm, setSearchTerm] = useState('')

    // Export modal states
    const [showExportModal, setShowExportModal] = useState(false)
    const [exportType, setExportType] = useState('pdf') // 'pdf' or 'excel'

  // Apply filters
  const {
    filterStatus,
    setFilterStatus,
    filterSewa,
    setFilterSewa,
    // filterCabang,
    // setFilterCabang,
    filterLetak,
    setFilterLetak,
    filterYear,
    setFilterYear,
    sortOrder,
    setSortOrder,
    availableYears,
    availableBranches,
    filteredData,
  } = useFilters(sewaList)

  // Pagination
  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(filteredData, 10)

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value)
    if (value.length >= 3 || value.length === 0) {
      searchSewa(value)
    }
  }

  // Handle export button clicks
  const handleExportPDFClick = () => {
    setExportType('pdf')
    setShowExportModal(true)
  }

  const handleExportExcelClick = () => {
    setExportType('excel')
    setShowExportModal(true)
  }

  // Handle actual export with selected years
  const handleExport = (selectedYears) => {
    if (exportType === 'pdf') {
      exportToPDF(filteredData, selectedYears, 'rekap-mesin')
    } else {
      exportToExcel(filteredData, selectedYears, 'rekap-mesin')
    }
  }
  const yearsForExport = getAvailableYears(filteredData)

  // Loading state
  if (loading && sewaList.length === 0) {
    return (
      <Loading/>
    )
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Monitoring Sewa Mesin</h1>
          <p className="text-sm text-gray-500 mt-1">Kontrol biaya sewa dan status mesin EDC</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleExportPDFClick} 
            variant="destructive"
            disabled={filteredData.length === 0}
          >
            <Download size={16} className="mr-2" />
            <span className="inline">PDF</span>
          </Button>
          <Button
            onClick={handleExportExcelClick}
            className="bg-[#00AEEF] hover:bg-[#26baf1]"
            disabled={filteredData.length === 0}
          >
            <Download size={16} className="mr-2" />
            <span className="inline">Excel</span>
          </Button>
        </div>
      </header>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <StatCard
            title="Sewa Aktif"
            value={summary.sewa_aktif}
            icon={CheckCircle}
            iconColor="text-green-600"
          />
        </div>

        <div>
          <StatCard
            title="Sewa Berakhir"
            value={summary.sewa_berakhir}
            icon={FileText}
            iconColor="text-[#ed1c24]"
          />
        </div>

        <StatCard
          title="Total Sewa/Bulan"
          value={formatCurrency(summary.total_biaya_bulanan)}
          icon={DollarSign}
          iconColor="text-[#00AEEF]"
        />

        <StatCard
          title="Bermasalah"
          value={summary.bermasalah}
          icon={AlertTriangle}
          iconColor="text-[#ed1c24]"
        />
      </div>

      {summary.bermasalah > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-semibold">Perhatian!</span> {summary.bermasalah} mesin dengan sewa
            aktif tetapi sedang rusak/perbaikan
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
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
                    <SelectItem value="NONAKTIF">Non Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status-sewa">Status Sewa</Label>
                <Select value={filterSewa} onValueChange={setFilterSewa}>
                  <SelectTrigger id="status-sewa" className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Sewa</SelectItem>
                    <SelectItem value="AKTIF">Aktif</SelectItem>
                    <SelectItem value="BERAKHIR">Berakhir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* <div>
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
              </div> */}
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
              title="Tidak ada mesin yang di sewa"
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <SewaTable machines={paginatedItems} />
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Export Year Filter Modal */}
      <ExportYearFilterModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        availableYears={yearsForExport}
        exportType={exportType}
      />
    </section>
  )
}

export default Sewa;