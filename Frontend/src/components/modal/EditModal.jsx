import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Info } from 'lucide-react'
import syncMachineStatuses from '@/utils/statusSync'

const EditModal = ({ isOpen, onClose, machine, onSave }) => {
  const [editingMachine, setEditingMachine] = useState(null)
  const [syncWarning, setSyncWarning] = useState(null)

  useEffect(() => {
    if (machine) {
      setEditingMachine({ ...machine })
    }
  }, [machine])

  if (!editingMachine) return null

  const handleFieldChange = (field, value) => {
    const { updated, warning } = syncMachineStatuses(
      editingMachine,
      field,
      value
    )

    if (warning) {
      setSyncWarning(warning)
      clearTimeout(window.__syncTimeout)
      window.__syncTimeout = setTimeout(() => {
        setSyncWarning(null)
      }, 3000)
    }

    setEditingMachine(updated)
  }

  const getLetakInfo = () => {
    switch (editingMachine.status_mesin) {
      case 'PERBAIKAN':
        return 'Mesin dalam perbaikan otomatis berada di Vendor.'
      case 'RUSAK':
        return 'Mesin rusak otomatis berada di Bank untuk konfirmasi.'
      case 'TIDAK_AKTIF':
        return 'Mesin nonaktif dikembalikan ke Bank.'
      case 'AKTIF':
        return 'Mesin aktif biasanya berada di Nasabah.'
      default:
        return ''
    }
  }

  const handleSave = () => {
    onSave(editingMachine)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Data Mesin EDC</DialogTitle>
          <DialogDescription>
            Perbarui informasi mesin EDC
          </DialogDescription>
        </DialogHeader>

        {syncWarning && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{syncWarning}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          {/* ID */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Terminal ID</Label>
              <Input value={editingMachine.terminal_id} disabled className="mt-2" />
            </div>
            <div>
              <Label>MID</Label>
              <Input value={editingMachine.mid} disabled className="mt-2" />
            </div>
          </div>

          {/* Nasabah */}
          <div>
            <Label>Nama Nasabah</Label>
            <Input
              value={editingMachine.nama_nasabah || ''}
              onChange={(e) =>
                setEditingMachine({
                  ...editingMachine,
                  nama_nasabah: e.target.value
                })
              }
              className="mt-2"
            />
          </div>

          {/* Lokasi */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Kota</Label>
              <Input
                value={editingMachine.kota || ''}
                onChange={(e) =>
                  setEditingMachine({ ...editingMachine, kota: e.target.value })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label>Cabang</Label>
              <Input
                value={editingMachine.cabang || ''}
                onChange={(e) =>
                  setEditingMachine({ ...editingMachine, cabang: e.target.value })
                }
                className="mt-2"
              />
            </div>
          </div>

          {/* Tipe */}
          <div>
            <Label>Tipe EDC</Label>
            <Input
              value={editingMachine.tipe_edc || ''}
              onChange={(e) =>
                setEditingMachine({
                  ...editingMachine,
                  tipe_edc: e.target.value
                })
              }
              className="mt-2"
            />
          </div>

          {/* Status */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Status Mesin</Label>
              <Select
                value={editingMachine.status_mesin}
                onValueChange={(val) =>
                  handleFieldChange('status_mesin', val)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AKTIF">Aktif</SelectItem>
                  <SelectItem value="PERBAIKAN">Perbaikan</SelectItem>
                  <SelectItem value="RUSAK">Rusak</SelectItem>
                  <SelectItem value="TIDAK_AKTIF">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status Data</Label>
              <Select
                value={editingMachine.status_data}
                onValueChange={(val) =>
                  setEditingMachine({ ...editingMachine, status_data: val })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TERDATA_BANK">Terdata Bank</SelectItem>
                  <SelectItem value="VENDOR_ONLY">Vendor Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status Sewa</Label>
              <Select
                value={editingMachine.status_sewa}
                onValueChange={(val) =>
                  handleFieldChange('status_sewa', val)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AKTIF">Aktif</SelectItem>
                  <SelectItem value="BERAKHIR">Berakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Letak Mesin</Label>
              <Select
                value={editingMachine.status_letak}
                onValueChange={(val) =>
                  handleFieldChange('status_letak', val)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NASABAH">Di Nasabah</SelectItem>
                  <SelectItem value="VENDOR">Di Vendor</SelectItem>
                  <SelectItem value="BANK">Di Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {getLetakInfo() && (
            <Alert className="mt-2">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {getLetakInfo()}
              </AlertDescription>
            </Alert>
          )}

          {/* Tanggal & Biaya */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tanggal Pemasangan</Label>
              <Input
                type="date"
                value={editingMachine.tanggal_pasang || ''}
                onChange={(e) =>
                  setEditingMachine({
                    ...editingMachine,
                    tanggal_pasang: e.target.value
                  })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label>Biaya Sewa / Bulan</Label>
              <Input
                type="number"
                value={editingMachine.biaya_sewa || 0}
                onChange={(e) =>
                  setEditingMachine({
                    ...editingMachine,
                    biaya_sewa: parseInt(e.target.value) || 0
                  })
                }
                className="mt-2"
              />
            </div>
          </div>

          {editingMachine.status_mesin === 'PERBAIKAN' && (
            <div>
              <Label>Estimasi Selesai Perbaikan</Label>
              <Input
                type="date"
                value={editingMachine.estimasi_selesai || ''}
                onChange={(e) =>
                  setEditingMachine({
                    ...editingMachine,
                    estimasi_selesai: e.target.value
                  })
                }
                className="mt-2"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#00AEEF] hover:bg-[#26baf1]"
          >
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditModal;