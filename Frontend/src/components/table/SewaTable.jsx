import React from 'react'
import { AlertTriangle, FileText, Sparkles } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import StatusBadge from '@/components/common/StatusBadge'
import { formatCurrency } from '@/utils/formatter'
import { Link } from 'react-router'

const SewaTable = ({ machines }) => {
  const isNewMachine = (tanggalPasang) => {
    if (!tanggalPasang) return false
    const today = new Date()
    const pasang = new Date(tanggalPasang)
    const diffDays = Math.ceil((today - pasang) / (1000 * 60 * 60 * 24))
    return diffDays <= 30
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
          const isProblematic = machine.status_sewa === 'AKTIF' && 
                               (machine.status_mesin === 'RUSAK' || machine.status_mesin === 'PERBAIKAN')
          const isNew = isNewMachine(machine.tanggal_pasang)
          
          return (
            <TableRow 
              key={machine.terminal_id}
              className={`cursor-pointer ${isProblematic ? 'bg-red-50 hover:bg-red-100' : isNew ? 'bg-green-50 hover:bg-green-100' : ''}`}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{machine.terminal_id}</span>
                  {isProblematic && <AlertTriangle className="text-[#ed1c24]" size={16} />}
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
              <TableCell className="text-center"><StatusBadge status={machine.status_mesin} /></TableCell>
              <TableCell className="table-cell text-center"><StatusBadge status={machine.status_letak} /></TableCell>
              <TableCell className="table-cell text-center"><StatusBadge status={machine.status_sewa} /></TableCell>
              <TableCell className="font-semibold text-center">{formatCurrency(machine.biaya_sewa)}</TableCell>
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

export default SewaTable;