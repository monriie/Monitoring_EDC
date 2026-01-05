import React from 'react'
import { Edit2, MapPin, Building2, Wrench, DollarSign, Database, Calendar, AlertTriangle, CheckCircle, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Breadcrumb from '@/components/common/Breadcrumb'
import StatusBadge from '@/components/common/StatusBadge'
import { calculateDaysOverdue } from '@/utils/dateUtils'
import { calculateLoss } from '@/utils/helper'
import { formatCurrency } from '@/utils/formatter'
import { useMachines } from '@/hooks/useMachine'
import { useParams } from 'react-router'

const DetailMesin = ({ onEdit }) => {
  const { id } = useParams()
  const { machines } = useMachines()

  const machine = machines.find(
    m => String(m.terminal_id) === String(id)
  )
  
  if (!machine) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <Search size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg text-gray-600">Data mesin tidak ditemukan</p>
        </div>
      </div>
    )
  }

  const daysOverdue = calculateDaysOverdue(machine.estimasi_selesai)
  const loss = calculateLoss(machine, daysOverdue)

  const InfoItem = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 group">
      {Icon && (
        <div className="mt-0.5 text-gray-400 group-hover:text-[#00AEEF] transition-colors">
          <Icon size={18} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="font-semibold text-gray-900 truncate">{value || 'N/A'}</p>
      </div>
    </div>
  )

  return (
    <section className="space-y-6">
      <Breadcrumb items={['Detail Mesin', machine.terminal_id]} />
      
      {/* Header Section - Compact */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              TID {machine.terminal_id}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">MID {machine.mid}</span>
              <span className="text-gray-400">•</span>
              <span>{machine.tipe_edc || 'N/A'}</span>
            </div>
          </div>
          <Button
            onClick={() => onEdit(machine)}
            className="bg-[#00AEEF] hover:bg-[#0099D6] whitespace-nowrap"
          >
            <Edit2 size={16} className="mr-2" />
            Edit Data
          </Button>
        </div>
      </div>

      {/* Alert Section - Only show if needed */}
      {/* {machine.status_mesin === 'PERBAIKAN' && daysOverdue > 0 && (
        <Alert variant="destructive" className="border-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-base">Overdue {daysOverdue} hari</p>
                <p className="text-sm mt-0.5">Estimasi Kerugian: {formatCurrency(loss)}</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )} */}

      {/* Main Content - Optimized Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Status Overview Card */}
        <Card className="lg:col-span-1 gap-3">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench size={18} className="text-[#00AEEF]" />
              Status & Kondisi
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Status Mesin</p>
              <StatusBadge status={machine.status_mesin} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Letak Mesin</p>
              <StatusBadge status={machine.status_letak} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Status Data</p>
              <StatusBadge status={machine.status_data} />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Status Sewa</p>
              <StatusBadge status={machine.status_sewa} />
            </div>

            <div className="pt-4 border-t col-span-2 mt-2">
              <div className="flex flex-wrap gap-3">
                {machine.sumber_data.map((sumber, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200"
                  >
                    <CheckCircle size={16} />
                    <span className="font-medium text-sm">{sumber}</span>
                  </div>
                ))}
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Location & Customer Info */}
        <Card className="lg:col-span-1 gap-3">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin size={18} className="text-[#00AEEF]" />
              Lokasi & Nasabah
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoItem 
              label="Nama Nasabah" 
              value={machine.nama_nasabah || 'Belum terdata'} 
              icon={Building2}
            />
            <InfoItem 
              label="Cabang Pengelola" 
              value={machine.cabang} 
              icon={Building2}
            />
            <InfoItem 
              label="Kota" 
              value={machine.kota} 
              icon={MapPin}
            />
            <InfoItem 
              label="Tanggal Pemasangan" 
              value={machine.tanggal_pasang} 
              icon={Calendar}
            />
          </CardContent>
        </Card>

        {/* Rental & Financial Info */}
        <Card className="lg:col-span-1 gap-3">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign size={18} className="text-[#00AEEF]" />
              Informasi Sewa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 mb-1">Biaya Sewa/Bulan</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(machine.biaya_sewa)}
              </p>
            </div>
            
            {machine.status_mesin === 'PERBAIKAN' && (
              <>
                <div className="pt-2 border-t">
                  <InfoItem 
                    label="Estimasi Selesai" 
                    value={machine.estimasi_selesai || 'Belum ada'} 
                    icon={Calendar}
                  />
                </div>
                
                {daysOverdue > 0 && (
                  <Alert className="bg-linear-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                    <AlertDescription>
                      <p className="text-base text-gray-600 mb-1">Overdue : <span className="font-bold text-base text-[#ed1c24] mb-1">{daysOverdue} hari</span></p>
                      <p className="text-base text-gray-600 mb-1">Estimasi Kerugian <span className="font-bold text-base md:text-xl text-[#ed1c24] flex flex-col">{formatCurrency(loss)}</span></p>
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default DetailMesin;