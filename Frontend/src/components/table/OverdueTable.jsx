import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { calculateDaysOverdue } from '@/utils/dateUtils'
import { calculateLoss } from '@/utils/helper'
import { formatCurrency } from '@/utils/formatter'
import StatusBadge from '../common/StatusBadge'

const OverdueTable = ({ machines}) => {
  const isNewMachine = (tanggalPasang) => {
    if (!tanggalPasang) return false
    const today = new Date()
    const pasang = new Date(tanggalPasang)
    const MS_PER_DAY = 1000 * 60 * 60 * 24
    const diffDays = Math.ceil((today - pasang) / MS_PER_DAY)
    return diffDays <= 30
  }

  return (
    <Table>
      <TableHeader className="bg-gray-200/50">
        <TableRow>
          <TableHead>Terminal ID</TableHead>
          <TableHead className="table-cell text-center">Nasabah</TableHead>
          <TableHead className="table-cell text-center">Letak Mesin</TableHead>
          <TableHead className="table-cell text-center">Tanggal Pasang</TableHead>
          <TableHead className="table-cell text-center">Estimasi</TableHead>
          <TableHead className="text-center">Terlambat</TableHead>
          <TableHead className="text-center">Status Perbaikan</TableHead>
          <TableHead className="table-cell text-center">Kerugian</TableHead>
          <TableHead className="text-center">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {machines.map(machine => {
          const daysLate = calculateDaysOverdue(machine.estimasi_selesai)
          const loss = calculateLoss(machine, daysLate)
          const isOverdue = daysLate > 0
          const isNew = isNewMachine(machine.tanggal_pasang)

          return (
            <TableRow 
              key={machine.terminal_id}
              className={`cursor-pointer ${isNew ? 'bg-green-50 hover:bg-green-100' : ''}`}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{machine.terminal_id}</span>
                  {isNew && (
                    <Badge variant="default" className="bg-green-600">
                      <Sparkles size={12} className="mr-1" />
                      Baru
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="table-cell">{machine.nama_nasabah || 'N/A'}</TableCell>
              <TableCell className="table-cell text-center"><StatusBadge status={machine.status_letak} /></TableCell>
              <TableCell className="table-cell text-center">
                <span className="text-sm">{machine.tanggal_pasang || '-'}</span>
              </TableCell>
              <TableCell className="table-cell text-center">{machine.estimasi_selesai || '-'}</TableCell>
              <TableCell>
                <span className="font-semibold flex justify-center text-[#ed1c24]">{daysLate} hari</span>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={isOverdue ? 'destructive' : 'warning'}>
                  {isOverdue ? 'Overdue' : 'Warning'}
                </Badge>
              </TableCell>
              <TableCell className="table-cell font-semibold text-[#ed1c24] text-center">
                {formatCurrency(loss)}
              </TableCell>
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

export default OverdueTable;