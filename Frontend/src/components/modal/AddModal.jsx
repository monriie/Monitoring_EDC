import React, { useState, useEffect } from 'react'
import { Plus, AlertTriangle, Upload, FileSpreadsheet, X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'

const AddModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('satuan') // 'satuan' or 'multi'
  const [excelFile, setExcelFile] = useState(null)
  const [previewData, setPreviewData] = useState([])
  
  // Form satuan
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
    window.addEventListener('openAddModal', handleOpen)
    return () => window.removeEventListener('openAddModal', handleOpen)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setActiveTab('satuan')
    resetForm()
    resetExcelUpload()
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

  const resetExcelUpload = () => {
    setExcelFile(null)
    setPreviewData([])
  }

  // Handle satuan submit
  const handleAddSatuan = () => {
    if (!newMachine.terminal_id || !newMachine.mid) {
      alert('Terminal ID dan MID wajib diisi!')
      return
    }

    window.dispatchEvent(new CustomEvent('machineAdded', { 
      detail: newMachine 
    }))
    
    handleClose()
  }

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (!validTypes.includes(file.type)) {
      alert('File harus berformat Excel (.xlsx atau .xls)')
      return
    }

    setExcelFile(file)

    // Preview using FileReader (simplified - in production use SheetJS/xlsx library)
    const reader = new FileReader()
    reader.onload = (event) => {
      // TODO: Parse Excel dengan library xlsx/SheetJS
      // Untuk demo, kita set preview dummy
      setPreviewData([
        { terminal_id: '32090010', mid: '70910010', kota: 'Palembang', cabang: 'Ilir Barat' },
        { terminal_id: '32090011', mid: '70910011', kota: 'Palembang', cabang: 'Plaju' },
      ])
    }
    reader.readAsArrayBuffer(file)
  }

  // Handle multi upload submit
  const handleAddMulti = () => {
    if (!excelFile) {
      alert('Pilih file Excel terlebih dahulu!')
      return
    }

    // Dispatch event with Excel data
    window.dispatchEvent(new CustomEvent('machinesAddedBulk', { 
      detail: { file: excelFile, data: previewData }
    }))
    
    handleClose()
  }

  const removeFile = () => {
    resetExcelUpload()
    // Reset file input
    const fileInput = document.getElementById('excel-file')
    if (fileInput) fileInput.value = ''
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Rekap Mesin EDC</DialogTitle>
          <DialogDescription>Pilih metode penambahan data mesin</DialogDescription>
        </DialogHeader>

        {/* Tabs Navigation */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('satuan')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'satuan'
                ? 'border-b-2 border-[#00AEEF] text-[#00AEEF]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Rekap Satuan
          </button>
          <button
            onClick={() => setActiveTab('multi')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'multi'
                ? 'border-b-2 border-[#00AEEF] text-[#00AEEF]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Multi Rekap (Excel)
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'satuan' && (
          <div className="space-y-4 pt-4">
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
        )}

        {activeTab === 'multi' && (
          <div className="space-y-4 pt-4">
            <Alert>
              <FileSpreadsheet className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold mb-2">Format Excel yang Dibutuhkan:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Kolom: Terminal ID, MID, Kota, Cabang, Tipe EDC, Tanggal Pasang, Biaya Sewa</li>
                  <li>File maksimal 5MB</li>
                  <li>Format: .xlsx atau .xls</li>
                </ul>
                <a 
                  href="/template-rekap-mesin.xlsx" 
                  className="text-[#00AEEF] hover:underline text-sm font-medium mt-2 inline-block"
                  download
                >
                  Download Template Excel →
                </a>
              </AlertDescription>
            </Alert>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              {!excelFile ? (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="excel-file" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Klik untuk upload file Excel
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        atau drag and drop file di sini
                      </span>
                    </label>
                    <input
                      id="excel-file"
                      type="file"
                      className="hidden"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    XLSX, XLS hingga 5MB
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{excelFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(excelFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X size={18} />
                  </Button>
                </div>
              )}
            </div>

            {/* Preview Data */}
            {previewData.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">Preview Data ({previewData.length} mesin)</h4>
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left">Terminal ID</th>
                          <th className="px-3 py-2 text-left">MID</th>
                          <th className="px-3 py-2 text-left">Kota</th>
                          <th className="px-3 py-2 text-left">Cabang</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((item, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="px-3 py-2">{item.terminal_id}</td>
                            <td className="px-3 py-2">{item.mid}</td>
                            <td className="px-3 py-2">{item.kota}</td>
                            <td className="px-3 py-2">{item.cabang}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Batal</Button>
          {activeTab === 'satuan' ? (
            <Button onClick={handleAddSatuan} className="bg-green-600 hover:bg-green-700">
              <Plus size={16} className="mr-2" />
              Tambah Mesin
            </Button>
          ) : (
            <Button 
              onClick={handleAddMulti} 
              className="bg-green-600 hover:bg-green-700"
              disabled={!excelFile}
            >
              <Upload size={16} className="mr-2" />
              Upload {previewData.length} Mesin
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddModal;