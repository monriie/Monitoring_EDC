import React, { useMemo } from 'react'
import { MapPin, CheckCircle, AlertTriangle, Plus, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import StatCard from '@/components/common/StatCard'
import StatusBadge from '@/components/common/StatusBadge'
import { calculateDaysOverdue } from '@/utils/dateUtils'
import { Link } from 'react-router'
import DataBarChart from '@/components/chart/DataBarChart'
import StatusPieChart from '@/components/chart/StatusPieChart'
import { useDashboard } from '@/hooks/useDashboard'
import Loading from '@/components/common/Loading'

const Dashboard = () => {
  const { stats, mesinBaru, overdueList, loading, error } = useDashboard()

  // Transform overdue data for preview
  const overduePreview = useMemo(() => {
    return overdueList.slice(0, 5)
  }, [overdueList])

  // Loading state
  if (loading) {
    return (
      <Loading/>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load dashboard</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => location.reload()}>Retry</Button>
        </div>
      </section>
    )
  }

  // Calculate overdue count from stats
  const overdueCount = stats.statusOverdue.find(s => s.status === 'overdue')?.total || 0

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Monitoring</h1>
        <p className="text-sm text-gray-500 mt-1">Sistem monitoring mesin EDC Bank Sumsel</p>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          title="Total Mesin EDC"
          value={stats.totalMesin}
          icon={MapPin}
          iconColor="text-[#00AEEF]"
        />

        <StatCard
          title="Terdata di Bank"
          value={stats.terdataBank}
          icon={CheckCircle}
          iconColor="text-green-600"
        />

        <StatCard
          title="Status Overdue"
          value={overdueCount}
          icon={AlertTriangle}
          iconColor="text-[#ed1c24]"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-3">
        <DataBarChart data={stats.statusMesin} />
        <StatusPieChart data={stats.statusMesin} />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mesin Baru dari Vendor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mesin Baru dari Vendor</CardTitle>
              <Badge variant="secondary">{mesinBaru.length} Mesin</Badge>
            </div>
            <CardDescription>Mesin yang dipasang vendor tapi belum terdata di bank</CardDescription>
          </CardHeader>
          <CardContent>
            {mesinBaru.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Plus size={48} className="mx-auto mb-3 opacity-50" />
                <p className="font-medium">Tidak ada mesin baru dari vendor</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mesinBaru.slice(0, 4).map(machine => (
                  <Link key={machine.terminal_id} to={`/mesin/${machine.terminal_id}`}>
                    <div className="mb-3 bg-orange-50 p-4 rounded-lg border border-orange-200 cursor-pointer hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{machine.terminal_id}</p>
                          <p className="text-sm text-gray-600">{machine.tipe_edc || 'N/A'}</p>
                        </div>
                        <StatusBadge status={machine.status_data} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Dipasang:</span> {machine.tanggal_pasang}
                        </div>
                        <div>
                          <span className="font-medium">Cabang:</span> {machine.cabang || '-'}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {mesinBaru.length > 4 && (
                  <Button variant="link" asChild className="w-full text-[#00AEEF]">
                    <Link to="/rekap">
                      Lihat semua mesin baru <ArrowRight />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monitoring Overdue */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-[#ed1c24]" size={20} />
              <CardTitle>Monitoring Overdue</CardTitle>
            </div>
            <CardDescription>Mesin yang melewati estimasi perbaikan</CardDescription>
          </CardHeader>
          <CardContent>
            {overduePreview.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CheckCircle size={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Tidak ada mesin overdue</p>
              </div>
            ) : (
              <div className="space-y-3">
                {overduePreview.map(machine => {
                  const days = machine.terlambat_hari || 0
                  const isOverdue = machine.status_perbaikan === 'overdue'

                  return (
                    <Link key={machine.terminal_id} to={`/mesin/${machine.terminal_id}`}>
                      <div className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-all border border-gray-200">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{machine.terminal_id}</p>
                            <p className="text-xs text-gray-500">{machine.nama_nasabah || 'N/A'}</p>
                          </div>
                          <Badge variant={isOverdue ? 'destructive' : 'warning'}>
                            {isOverdue ? `${days}h Overdue` : 'Warning'}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  )
                })}
                <Button variant="link" asChild className="w-full text-[#00AEEF]">
                  <Link to="/overdue">
                    Lihat semua mesin overdue <ArrowRight />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
export default Dashboard;