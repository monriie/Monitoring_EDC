import React, { useState, useEffect } from 'react'
import { Plus, AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

const AddModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [newMachine, setNewMachine] = useState({
    terminal_id: '',
    mid: '',
    nama_nasabah: null,
    kota: '',
    cabang: '',
    tipe_edc: '',
    status_data: 'VENDOR_ONLY',
    status_mesin: 'AKTIF',
    status_sewa: '',
    status_letak: '',
    tanggal_pasang: new Date().toISOString().split('T')[0],
    estimasi_selesai: null,
    biaya_sewa: 1500000,
    sumber_data: ['VENDOR']
  })

  // Listen for open event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    addEventListener('openAddModal', handleOpen)
    return () => removeEventListener('openAddModal', handleOpen)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setNewMachine({
      terminal_id: '',
      mid: '',
      nama_nasabah: null,
      kota: '',
      cabang: '',
      tipe_edc: '',
      status_data: 'VENDOR_ONLY',
      status_mesin: 'AKTIF',
      status_sewa: '',
      status_letak: '',
      tanggal_pasang: new Date().toISOString().split('T')[0],
      estimasi_selesai: null,
      biaya_sewa: 1500000,
      sumber_data: ['VENDOR']
    })
  }

  const handleAdd = () => {
    if (!newMachine.terminal_id || !newMachine.mid) {
      alert('Terminal ID dan MID wajib diisi!')
      return
    }

    // Dispatch event with new machine data
    dispatchEvent(new CustomEvent('machineAdded', { 
      detail: newMachine 
    }))
    
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Rekap Mesin EDC</DialogTitle>
          <DialogDescription>Data mesin baru dari vendor</DialogDescription>
        </DialogHeader>
        
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold">Info Default:</p>
            <p className="text-sm mt-1">
              Status Data: <span className="font-bold">VENDOR_ONLY</span> •{' '}
              Status Mesin: <span className="font-bold">AKTIF</span> •{' '}
              Status Sewa: <span className="font-bold">BERAKHIR</span> •{' '}
              Letak: <span className="font-bold">NASABAH</span>
            </p>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Terminal ID <span className="text-red-500">*</span></Label>
              <Input
                placeholder="32090004"
                value={newMachine.terminal_id}
                onChange={(e) => setNewMachine({...newMachine, terminal_id: e.target.value})}
                className="mt-2"
              />
            </div>
            <div>
              <Label>MID <span className="text-red-500">*</span></Label>
              <Input
                placeholder="70910004"
                value={newMachine.mid}
                onChange={(e) => setNewMachine({...newMachine, mid: e.target.value})}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Kota</Label>
              <Input
                placeholder="Palembang"
                value={newMachine.kota}
                onChange={(e) => setNewMachine({...newMachine, kota: e.target.value})}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Cabang Pengelola</Label>
              <Input
                placeholder="Ilir Barat"
                value={newMachine.cabang}
                onChange={(e) => setNewMachine({...newMachine, cabang: e.target.value})}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipe EDC</Label>
              <Input
                placeholder="Ingenico DX8000"
                value={newMachine.tipe_edc}
                onChange={(e) => setNewMachine({...newMachine, tipe_edc: e.target.value})}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tanggal Pemasangan</Label>
              <Input
                type="date"
                value={newMachine.tanggal_pasang}
                onChange={(e) => setNewMachine({...newMachine, tanggal_pasang: e.target.value})}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Biaya Sewa/Bulan (Rp)</Label>
              <Input
                type="number"
                value={newMachine.biaya_sewa}
                onChange={(e) => setNewMachine({...newMachine, biaya_sewa: parseInt(e.target.value) || 0})}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Batal</Button>
          <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
            <Plus size={16} className="mr-2" />
            Tambah Mesin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddModal;