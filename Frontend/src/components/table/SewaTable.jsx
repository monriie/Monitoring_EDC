import React from 'react'
import { AlertTriangle, FileText, Sparkles } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import StatusBadge from '@/components/common/StatusBadge'
import { formatCurrency } from '@/utils/formatter'
import { Link } from 'react-router'
import { isNewMachine } from '@/utils/dateUtils'

const SewaTable = ({ machines }) => {
  // Helper untuk menormalkan status dari backend
  const normalizeStatusMesin = (status) => {
    const statusMap = {
      'aktif': 'AKTIF',
      'perbaikan': 'PERBAIKAN',
      'rusak': 'RUSAK',
      'tidak_aktif': 'NONAKTIF',
      'nonaktif': 'NONAKTIF',
      'AKTIF': 'AKTIF',
      'PERBAIKAN': 'PERBAIKAN',
      'RUSAK': 'RUSAK',
      'NONAKTIF': 'NONAKTIF',
      'WARNING': 'WARNING',
      'OVERDUE': 'OVERDUE'
    }
    return statusMap[status] || 'AKTIF'
  }

  const normalizeStatusSewa = (status) => {
    const statusMap = {
      'aktif': 'AKTIF',
      'berakhir': 'BERAKHIR',
      'AKTIF': 'AKTIF',
      'BERAKHIR': 'BERAKHIR'
    }
    return statusMap[status] || 'BERAKHIR'
  }

  return (
    <Table className="w-full overflow-x-scroll lg:overflow-visible">
      <TableHeader className="bg-gray-200/50">
        <TableRow>
          <TableHead>Terminal ID</TableHead>
          <TableHead className="table-cell text-center">Nasabah</TableHead>
          <TableHead className="table-cell text-center">Tanggal Pasang</TableHead>
          <TableHead className="text-center">Status Mesin</TableHead>
          <TableHead className="table-cell text-center">Letak Mesin</TableHead>
          <TableHead className="table-cell text-center">Status Sewa</TableHead>
          <TableHead className="text-center">Sewa/Bulan</TableHead>
          <TableHead className="text-center">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {machines.map(machine => {
          // Normalisasi status
          const statusMesin = normalizeStatusMesin(machine.status_mesin)
          const statusSewa = normalizeStatusSewa(machine.status_sewa)
          
          // Hanya merah jika sewa AKTIF dan mesin OVERDUE
          const isProblematic = statusSewa === 'AKTIF' && statusMesin === 'OVERDUE'
          
          // Warning jika sewa AKTIF dan mesin WARNING/PERBAIKAN/RUSAK (tapi bukan OVERDUE)
          const isWarning = statusSewa === 'AKTIF' && 
                           (statusMesin === 'WARNING' || statusMesin === 'PERBAIKAN' || statusMesin === 'RUSAK') &&
                           !isProblematic
          
          const isNew = isNewMachine(machine.tanggal_pasang)
          
          // Biaya sewa sudah dinormalisasi dari useRekap hook
          const biayaSewa = machine.biaya_sewa || 150000

          return (
            <TableRow 
              key={machine.terminal_id}
              className={`cursor-pointer ${
                isProblematic ? 'bg-red-50 hover:bg-red-100' : 
                isWarning ? 'bg-yellow-50 hover:bg-yellow-100' :
                isNew ? 'bg-green-50 hover:bg-green-100' : ''
              }`}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{machine.terminal_id}</span>
                  {isProblematic && <AlertTriangle className="text-red-600" size={16} />}
                  {isNew && (
                    <Badge variant="default" className="bg-green-600">
                      <Sparkles size={12} className="mr-1" />
                      Baru
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="table-cell">{machine.nama_nasabah || 'N/A'}</TableCell>
              <TableCell className="table-cell text-center">
                <span className="text-sm">{machine.tanggal_pasang || '-'}</span>
              </TableCell>
              <TableCell className="text-center"><StatusBadge status={statusMesin} /></TableCell>
              <TableCell className="table-cell text-center"><StatusBadge status={machine.status_letak} /></TableCell>
              <TableCell className="table-cell text-center"><StatusBadge status={statusSewa} /></TableCell>
              <TableCell className="font-semibold text-center">{formatCurrency(biayaSewa)}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link to={`/mesin/${machine.terminal_id}`}>
                    <FileText size={16} />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default SewaTable