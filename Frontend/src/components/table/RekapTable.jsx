import React from 'react'
import { FileText, Sparkles } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import StatusBadge from '@/components/common/StatusBadge'
import { Link } from 'react-router'

const RekapTable = ({ machines}) => {
  if (machines.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <FileText size={48} className="mx-auto mb-3 opacity-50" />
        <p className="font-medium">Tidak ada data yang sesuai dengan filter</p>
      </div>
    )
  }

  // Check if machine is new (within 30 days)
  const isNewMachine = (tanggalPasang) => {
    if (!tanggalPasang) return false
    const today = new Date()
    const pasang = new Date(tanggalPasang)
    const MS_PER_DAY = 1000 * 60 * 60 * 24
    const diffDays = Math.ceil((today - pasang) / MS_PER_DAY)
    return diffDays <= 30
  }

  return (
    <Table className="w-full overflow-x-auto lg:overflow-visible">
      <TableHeader className="bg-gray-200/50">
        <TableRow>
          <TableHead>Terminal ID</TableHead>
          <TableHead className="table-cell text-center">Nasabah</TableHead>
          <TableHead className="table-cell text-center">Cabang</TableHead>
          <TableHead className="table-cell text-center">Tanggal Pasang</TableHead>
          <TableHead className="text-center">Status Mesin</TableHead>
          <TableHead className="table-cell text-center">Status Data</TableHead>
          <TableHead className="text-center">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {machines.map(machine => {
          const isNew = isNewMachine(machine.tanggal_pasang)
          return (
            <TableRow 
              key={machine.terminal_id}
              className={isNew ? 'bg-green-50 hover:bg-green-100' : ''}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-medium">{machine.terminal_id}</div>
                    <div className="text-xs text-gray-500">{machine.tipe_edc || 'N/A'}</div>
                  </div>
                  {isNew && (
                    <Badge variant="default" className="bg-green-600">
                      <Sparkles size={12} className="mr-1" />
                      Baru
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="table-cell">{machine.nama_nasabah || 'N/A'}</TableCell>
              <TableCell className="table-cell text-center">{machine.cabang || 'N/A'}</TableCell>
              <TableCell className="table-cell text-center">
                <span className="text-sm">{machine.tanggal_pasang || '-'}</span>
              </TableCell>
              <TableCell className="text-center"><StatusBadge status={machine.status_mesin} /></TableCell>
              <TableCell className="table-cell text-center"><StatusBadge status={machine.status_data} /></TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
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

export default RekapTable;