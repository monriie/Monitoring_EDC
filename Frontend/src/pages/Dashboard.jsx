import React, { useMemo } from 'react'
import { MapPin, CheckCircle, AlertTriangle, Plus, ArrowBigRight, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import StatCard from '@/components/common/StatCard'
import StatusBadge from '@/components/common/StatusBadge'
import { calculateDaysOverdue } from '@/utils/dateUtils'
import { getOverdueInfo } from '@/utils/helper'
import { useMachines } from '@/hooks/useMachine'
import { Link, useNavigate } from 'react-router'
import DataBarChart from '@/components/chart/DataBarChart'
import StatusPieChart from '@/components/chart/StatusPieChart'

const Dashboard = () => {
  const { machines } = useMachines()
  const navigation = useNavigate()

  const stats = useMemo(() => {
    const total = machines.length
    const terdataBank = machines.filter(m => m.status_data === 'TERDATA_BANK').length
    const vendorOnly = machines.filter(m => m.status_data === 'VENDOR_ONLY').length
    
    const today = new Date()
    const overdue = machines.filter(m => {
      const info = getOverdueInfo(m, today)
      return info.isOverdue
    })

    const warning = machines.filter(m => {
      const info = getOverdueInfo(m, today)
      return info.isWarning
    })

    

    return {
      total,
      terdataBank,
      vendorOnly,
      overdue: overdue.length,
      warning: warning.length,
      overdueList: overdue,
      warningList: warning
    }
  }, [machines])

  const newVendorMachines = machines.filter(m => m.status_data === 'VENDOR_ONLY')
  const overduePreview = [...stats.overdueList, ...stats.warningList].slice(0, 5)

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Monitoring</h1>
        <p className="text-sm text-gray-500 mt-1">Sistem monitoring mesin EDC Bank Sumsel</p>
      </header>
      
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          title="Total Mesin EDC"
          value={stats.total}
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
          value={stats.overdue}
          icon={AlertTriangle}
          iconColor="text-[#ed1c24]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DataBarChart/>
        <StatusPieChart/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mesin Baru dari Vendor</CardTitle>
              <Badge variant="secondary">{newVendorMachines.length} Mesin</Badge>
            </div>
            <CardDescription>Mesin yang dipasang vendor tapi belum terdata di bank</CardDescription>
          </CardHeader>
          <CardContent>
            {newVendorMachines.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Plus size={48} className="mx-auto mb-3 opacity-50" />
                <p className="font-medium">Tidak ada mesin baru dari vendor</p>
              </div>
            ) : (
              <div className="space-y-3">
                {newVendorMachines.slice(0, 4).map(machine => (
                  <Link key={machine.terminal_id} to={`/mesin/${machine.terminal_id}`}>
                    <div 
                      className="mb-3 bg-orange-50 p-4 rounded-lg border border-orange-200 cursor-pointer hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{machine.terminal_id}</p>
                          <p className="text-sm text-gray-600">{machine.tipe_edc}</p>
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
                {newVendorMachines.length > 4 && (
                  <Button
                    variant="link" asChild
                    className="w-full text-[#00AEEF]"
                  >
                    <Link to="/rekap">
                      Lihat semua mesin baru <ArrowRight/>
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

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
                  const days = calculateDaysOverdue(machine.estimasi_selesai)
                  const isOverdue = days > 0

                  return (
                    <div
                      key={machine.terminal_id}
                      className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-all border border-gray-200"
                    >
                    <Link to={`/mesin/${machine.terminal_id}`}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{machine.terminal_id}</p>
                          <p className="text-xs text-gray-500">{machine.nama_nasabah || 'N/A'}</p>
                        </div>
                        <Badge variant={isOverdue ? 'destructive' : 'warning'}>
                          {isOverdue ? `${days}h Overdue` : 'Warning'}
                        </Badge>
                      </div>
                    </Link>
                    </div>
                  )
                })}
                <Button
                  variant="link" asChild
                  className="w-full text-[#00AEEF]"
                >
                  <Link to="/overdue">
                    Lihat semua mesin overdue <ArrowRight/>
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