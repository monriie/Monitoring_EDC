import React, { useState, useEffect } from 'react'
import { Plus, Upload, FileSpreadsheet, X, AlertCircle, Database, Building2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const AddModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('satuan')
  const [uploadSource, setUploadSource] = useState('vendor') // 'vendor' or 'bank'
  
  const [excelFiles, setExcelFiles] = useState({
    vendor: null,
    bank: null,
  })
  
  const [previewData, setPreviewData] = useState({
    vendor: [],
    bank: [],
  })

  const [newMachine, setNewMachine] = useState({
    terminal_id: '',
    mid: '',
    nama_nasabah: null,
    kota: '',
    cabang: '',
    tipe_edc: '',
    status_data: 'VENDOR',
    status_mesin: 'AKTIF',
    status_sewa: 'BERAKHIR',
    status_letak: 'NASABAH',
    tanggal_pasang: new Date().toISOString().split('T')[0],
    estimasi_selesai: null,
    biaya_sewa: 1500000,
    sumber_data: ['VENDOR']
  })

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    addEventListener('openAddModal', handleOpen)
    return () => removeEventListener('openAddModal', handleOpen)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setActiveTab('satuan')
    setUploadSource('vendor')
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
      status_data: 'VENDOR',
      status_mesin: 'AKTIF',
      status_sewa: 'BERAKHIR',
      status_letak: 'NASABAH',
      tanggal_pasang: new Date().toISOString().split('T')[0],
      estimasi_selesai: null,
      biaya_sewa: 1500000,
      sumber_data: ['VENDOR']
    })
  }

  const resetExcelUpload = () => {
    setExcelFiles({
      vendor: null,
      bank: null,
    })
    setPreviewData({
      vendor: [],
      bank: [],
    })
  }

  const handleAddSatuan = () => {
    if (!newMachine.terminal_id || !newMachine.mid) {
      alert('Terminal ID dan MID wajib diisi!')
      return
    }

    dispatchEvent(new CustomEvent('machineAdded', {
      detail: newMachine
    }))
    
    handleClose()
  }

  const handleFileChange = async (e, source) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (!validTypes.includes(file.type)) {
      alert('File harus berformat Excel (.xlsx atau .xls)')
      return
    }

    setExcelFiles(prev => ({
      ...prev,
      [source]: file
    }))

    // Preview dummy data sesuai source
    const reader = new FileReader()
    reader.onload = () => {
      if (source === 'vendor') {
        setPreviewData(prev => ({
          ...prev,
          vendor: [
            { TID: '32090010', MID: '70910010', NO_SPK: 'SPK001', DEFAULT_MCC: '5411', DESCRIPTION: 'Toko A', KOTA: 'Palembang', CABANG_PENGELOLA: 'Ilir Barat', TYPE_EDC: 'Wireless' },
            { TID: '32090011', MID: '70910011', NO_SPK: 'SPK002', DEFAULT_MCC: '5812', DESCRIPTION: 'Restoran B', KOTA: 'Palembang', CABANG_PENGELOLA: 'Plaju', TYPE_EDC: 'Mobile' },
          ]
        }))
      } else {
        setPreviewData(prev => ({
          ...prev,
          bank: [
            { TERMINAL_ID_NR: '32090010', STATUS: 'ACTIVE', OWNER_ENTITY_ID: 'E001', ENTITY_NAME: 'PT ABC', ACTUAL_START_TIME: '2024-01-15', ENTITY_STATUS: 'VERIFIED' },
            { TERMINAL_ID_NR: '32090012', STATUS: 'ACTIVE', OWNER_ENTITY_ID: 'E002', ENTITY_NAME: 'PT XYZ', ACTUAL_START_TIME: '2024-02-20', ENTITY_STATUS: 'VERIFIED' },
          ]
        }))
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleAddMulti = () => {
    const currentFile = excelFiles[uploadSource]
    const currentPreview = previewData[uploadSource]

    if (!currentFile) {
      alert('Pilih file Excel terlebih dahulu!')
      return
    }

    dispatchEvent(new CustomEvent('machinesAddedBulk', {
      detail: { 
        file: currentFile, 
        data: currentPreview,
        source: uploadSource // 'vendor' atau 'bank'
      }
    }))
    
    handleClose()
  }

  const removeFile = (source) => {
    setExcelFiles(prev => ({
      ...prev,
      [source]: null
    }))
    setPreviewData(prev => ({
      ...prev,
      [source]: []
    }))
    
    const fileInput = document.getElementById(`excel-file-${source}`)
    if (fileInput) fileInput.value = ''
  }

  const currentFile = excelFiles[uploadSource]
  const currentPreview = previewData[uploadSource]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-start md:text-2xl font-bold text-black">
            Tambah Rekap Mesin EDC
          </DialogTitle>
          <DialogDescription className="text-start">
            Pilih metode penambahan data mesin
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 gap-2 bg-none">
            <TabsTrigger value="satuan" className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'satuan'
                ? 'border-b-2 border-[#00AEEF] text-[#00AEEF]'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            Rekap Satuan
            </TabsTrigger>
            <TabsTrigger value="multi" className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'multi'
                ? 'border-b-2 border-[#00AEEF] text-[#00AEEF]'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            Multi Rekap (Excel)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="satuan" className="space-y-4 mt-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-800" />
              <AlertDescription className="text-sm text-blue-800">
                <strong>Info Defaul</strong>
                <div className="mt-1 space-y-1">
                  <div>Status Data: VENDOR</div>
                  <div>Status Mesin: AKTIF</div>
                  <div>Status Sewa: BERAKHIR</div>
                  <div>Letak: NASABAH</div>
                </div>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="terminal_id">Terminal ID *</Label>
                <Input
                  id="terminal_id"
                  value={newMachine.terminal_id}
                  onChange={(e) => setNewMachine({...newMachine, terminal_id: e.target.value})}
                  className="mt-2"
                  placeholder="32090010"
                />
              </div>

              <div>
                <Label htmlFor="mid">MID *</Label>
                <Input
                  id="mid"
                  value={newMachine.mid}
                  onChange={(e) => setNewMachine({...newMachine, mid: e.target.value})}
                  className="mt-2"
                  placeholder="70910010"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kota">Kota</Label>
                <Input
                  id="kota"
                  value={newMachine.kota}
                  onChange={(e) => setNewMachine({...newMachine, kota: e.target.value})}
                  className="mt-2"
                  placeholder="Palembang"
                />
              </div>

              <div>
                <Label htmlFor="cabang">Cabang Pengelola</Label>
                <Input
                  id="cabang"
                  value={newMachine.cabang}
                  onChange={(e) => setNewMachine({...newMachine, cabang: e.target.value})}
                  className="mt-2"
                  placeholder="Ilir Barat"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tipe_edc">Tipe EDC</Label>
              <Input
                id="tipe_edc"
                value={newMachine.tipe_edc}
                onChange={(e) => setNewMachine({...newMachine, tipe_edc: e.target.value})}
                className="mt-2"
                placeholder="Verifone"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tanggal_pasang">Tanggal Pemasangan</Label>
                <Input
                  id="tanggal_pasang"
                  type="date"
                  value={newMachine.tanggal_pasang}
                  onChange={(e) => setNewMachine({...newMachine, tanggal_pasang: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="biaya_sewa">Biaya Sewa/Bulan (Rp)</Label>
                <Input
                  id="biaya_sewa"
                  type="number"
                  value={newMachine.biaya_sewa}
                  onChange={(e) => setNewMachine({...newMachine, biaya_sewa: parseInt(e.target.value) || 0})}
                  className="mt-2"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="multi" className="space-y-4 mt-4">
            {/* Source Selector */}
            <div className="mb-6">
              <Label className="text-base font-semibold mb-3 block">Pilih Sumber Data</Label>
              <div className="grid grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer transition-all ${uploadSource === 'vendor' ? 'ring-2 ring-[#00AEEF] bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => setUploadSource('vendor')}
                >
                  <CardContent className="flex items-center gap-3">
                    <Building2 className={`h-8 w-8 ${uploadSource === 'vendor' ? 'text-[#00AEEF]' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-semibold">Data Vendor</div>
                      <div className="text-sm text-gray-500">Upload file dari vendor</div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${uploadSource === 'bank' ? 'ring-2 ring-[#00AEEF] bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => setUploadSource('bank')}
                >
                  <CardContent className="flex items-center gap-3">
                    <Database className={`h-8 w-8 ${uploadSource === 'bank' ? 'text-[#00AEEF]' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-semibold">Data Bank</div>
                      <div className="text-sm text-gray-500">Upload file dari bank</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Info Format */}
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-800">
                <strong>Format Excel {uploadSource === 'vendor' ? 'Vendor' : 'Bank'}:</strong>
                {uploadSource === 'vendor' ? (
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Kolom: TID, MID, NO SPK, DEFAULT_MCC, DESCRIPTION, KOTA, CABANG PENGELOLA, TYPE EDC</li>
                    <li>File maksimal 5MB</li>
                    <li>Format: .xlsx atau .xls</li>
                  </ul>
                ) : (
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Kolom: TERMINAL_ID_NR, STATUS, OWNER_ENTITY_ID, ENTITY_NAME, ACTUAL_START_TIME, ENTITY_STATUS</li>
                    <li>File maksimal 5MB</li>
                    <li>Format: .xlsx atau .xls</li>
                  </ul>
                )}
                <div className="mt-2">
                  <a href="#" className="text-[#00AEEF] hover:underline font-medium">
                    Download Template Excel {uploadSource === 'vendor' ? 'Vendor' : 'Bank'} →
                  </a>
                </div>
              </AlertDescription>
            </Alert>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#00AEEF] transition-colors">
              {!currentFile ? (
                <div>
                  <input
                    id={`excel-file-${uploadSource}`}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => handleFileChange(e, uploadSource)}
                    className="hidden"
                  />
                  <label htmlFor={`excel-file-${uploadSource}`} className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-lg font-medium text-gray-700 mb-2">
                      Klik untuk upload file Excel {uploadSource === 'vendor' ? 'Vendor' : 'Bank'}
                    </div>
                    <div className="text-sm text-gray-500">
                      atau drag and drop file di sini
                    </div>
                  </label>
                  <div className="text-xs text-gray-400 mt-4">
                    XLSX, XLS hingga 5MB
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{currentFile.name}</div>
                      <div className="text-sm text-gray-500">
                        {(currentFile.size / 1024).toFixed(2)} KB
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadSource)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Preview Data */}
            {currentPreview.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="font-semibold mb-4">
                    Preview Data {uploadSource === 'vendor' ? 'Vendor' : 'Bank'} ({currentPreview.length} record)
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          {uploadSource === 'vendor' ? (
                            <>
                              <th className="px-4 py-2 text-left">TID</th>
                              <th className="px-4 py-2 text-left">MID</th>
                              <th className="px-4 py-2 text-left">Kota</th>
                              <th className="px-4 py-2 text-left">Cabang</th>
                              <th className="px-4 py-2 text-left">Type EDC</th>
                            </>
                          ) : (
                            <>
                              <th className="px-4 py-2 text-left">Terminal ID</th>
                              <th className="px-4 py-2 text-left">Status</th>
                              <th className="px-4 py-2 text-left">Entity Name</th>
                              <th className="px-4 py-2 text-left">Start Time</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {currentPreview.map((item, idx) => (
                          <tr key={idx} className="border-b">
                            {uploadSource === 'vendor' ? (
                              <>
                                <td className="px-4 py-2">{item.TID}</td>
                                <td className="px-4 py-2">{item.MID}</td>
                                <td className="px-4 py-2">{item.KOTA}</td>
                                <td className="px-4 py-2">{item.CABANG_PENGELOLA}</td>
                                <td className="px-4 py-2">{item.TYPE_EDC}</td>
                              </>
                            ) : (
                              <>
                                <td className="px-4 py-2">{item.TERMINAL_ID_NR}</td>
                                <td className="px-4 py-2">{item.STATUS}</td>
                                <td className="px-4 py-2">{item.ENTITY_NAME}</td>
                                <td className="px-4 py-2">{item.ACTUAL_START_TIME}</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Batal
          </Button>
          {activeTab === 'satuan' ? (
            <Button onClick={handleAddSatuan} className="bg-[#00AEEF]">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Mesin
            </Button>
          ) : (
            <Button 
              onClick={handleAddMulti} 
              className="bg-[#00AEEF] hover:bg-[#0095d1]"
              disabled={!currentFile}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload {currentPreview.length} Data {uploadSource === 'vendor' ? 'Vendor' : 'Bank'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddModal;