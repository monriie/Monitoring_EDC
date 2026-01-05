import React, { useMemo } from 'react'
import { Download, CheckCircle, FileText, DollarSign, AlertTriangle, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import StatCard from '@/components/common/StatCard'
import SewaTable from '@/components/table/SewaTable'
import Pagination from '@/components/common/Pagination'
import YearSortFilter from '@/components/common/YearSortFilter'
import { useMachines } from '@/hooks/useMachine'
import { useFilters } from '@/hooks/useFilter'
import { usePagination } from '@/hooks/usePagination'
import { useExport } from '@/hooks/useExport'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const Sewa = () => {
  const { machines } = useMachines()
  const { exportToPDF, exportToExcel } = useExport()

  // Apply filters
  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterSewa,
    setFilterSewa,
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
  } = useFilters(machines)

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage
  } = usePagination(filteredData, 10)

  // Calculate stats from ALL machines (not filtered)
  const stats = useMemo(() => {
    const activeRentals = machines.filter(m => m.status_sewa === 'AKTIF')
    const totalActiveCost = activeRentals.reduce((sum, m) => sum + m.biaya_sewa, 0)
    const inactiveCount = machines.filter(m => m.status_sewa === 'BERAKHIR').length
    const brokenButActive = activeRentals.filter(m => 
      m.status_mesin === 'RUSAK' || m.status_mesin === 'PERBAIKAN'
    )

    return {
      activeRentals: activeRentals.length,
      inactiveCount,
      totalActiveCost,
      brokenButActive
    }
  }, [machines])

  const handleStatClick = (status) => {
    setFilterSewa(status)
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Monitoring Sewa Mesin</h1>
          <p className="text-sm text-gray-500 mt-1">Kontrol biaya sewa dan status mesin EDC</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => exportToPDF(filteredData, 'sewa')} variant="destructive">
            <Download size={16} className="mr-2" />
            PDF
          </Button>
          <Button onClick={() => exportToExcel(filteredData, 'sewa')} className="bg-[#00AEEF] hover:bg-[#26baf1]">
            <Download size={16} className="mr-2" />
            Excel
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div onClick={() => handleStatClick('AKTIF')} className="cursor-pointer">
          <StatCard
            title="Sewa Aktif"
            value={stats.activeRentals}
            icon={CheckCircle}
            iconColor="text-green-600"
          />
        </div>

        <div onClick={() => handleStatClick('BERAKHIR')} className="cursor-pointer">
          <StatCard
            title="Sewa Berakhir"
            value={stats.inactiveCount}
            icon={FileText}
            iconColor="text-[#ed1c24]"
          />
        </div>

        <StatCard
          title="Total Sewa/Bulan"
          value={`Rp ${stats.totalActiveCost.toLocaleString('id-ID')}`}
          icon={DollarSign}
          iconColor="text-[#00AEEF]"
        />

        <StatCard
          title="Bermasalah"
          value={stats.brokenButActive.length}
          icon={AlertTriangle}
          iconColor="text-[#ed1c24]"
        />
      </div>

      {stats.brokenButActive.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-semibold">Perhatian!</span> {stats.brokenButActive.length} mesin dengan sewa aktif tetapi sedang rusak/perbaikan
          </AlertDescription>
        </Alert>
      )}

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
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mt-4">
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

      <Card>
        <CardContent >
          <SewaTable machines={paginatedItems}/>
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={goToPage} 
            />
          )}
        </CardContent>
      </Card>
    </section>
  )
}

export default Sewa;