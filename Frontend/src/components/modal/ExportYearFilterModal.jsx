import React, { useState, useEffect } from 'react'
import { Download, FileText, Filter, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

const ExportYearFilterModal = ({ 
  isOpen, 
  onClose, 
  onExport, 
  availableYears = [], 
  exportType = 'pdf' // 'pdf' or 'excel'
}) => {
  const [selectedYears, setSelectedYears] = useState([])

  // Reset saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setSelectedYears([])
    }
  }, [isOpen])

  const toggleYear = (year) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    )
  }

  const selectAll = () => {
    setSelectedYears([...availableYears])
  }

  const clearAll = () => {
    setSelectedYears([])
  }

  const handleExport = () => {
    if (selectedYears.length === 0) {
      alert('Pilih minimal 1 tahun untuk di-export')
      return
    }

    onExport(selectedYears)
    onClose()
  }

  const getFileIcon = () => {
    return exportType === 'pdf' ? '📄' : '📊'
  }

  const getFileTypeLabel = () => {
    return exportType === 'pdf' ? 'PDF' : 'Excel'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download size={20} className="text-[#00AEEF]" />
            Export ke {getFileTypeLabel()}
          </DialogTitle>
          <DialogDescription>
            Pilih tahun pemasangan yang ingin di-export
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Info Alert */}
          <Alert>
            <Filter className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Dokumen akan berisi data mesin yang dipasang pada tahun yang dipilih.
              Pilih beberapa tahun untuk menggabungkan data.
            </AlertDescription>
          </Alert>

          {/* Selected Count */}
          {selectedYears.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-[#00AEEF] text-white">
                {selectedYears.length} tahun dipilih
              </Badge>
              <span className="text-xs text-gray-500">
                {selectedYears.sort((a, b) => b - a).join(', ')}
              </span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAll}
              className="flex-1"
            >
              Pilih Semua
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAll}
              className="flex-1"
            >
              Batal Semua
            </Button>
          </div>

          {/* Year Selection Grid */}
          <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
            {availableYears.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText size={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Tidak ada data untuk di-export</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {availableYears.sort((a, b) => b - a).map(year => (
                  <label
                    key={year}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer
                      transition-all hover:shadow-sm
                      ${selectedYears.includes(year) 
                        ? 'border-[#00AEEF] bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <Checkbox
                      checked={selectedYears.includes(year)}
                      onCheckedChange={() => toggleYear(year)}
                      className="data-[state=checked]:bg-[#00AEEF]"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{year}</p>
                    </div>
                    {selectedYears.includes(year) && (
                      <Check size={18} className="text-[#00AEEF]" />
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Preview Info */}
          {selectedYears.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">
                {getFileIcon()} File akan berisi data dari tahun:{' '}
                <span className="font-semibold">
                  {selectedYears.sort((a, b) => a - b).join(', ')}
                </span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleExport}
            disabled={selectedYears.length === 0}
            className={
              exportType === 'pdf'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#00AEEF] hover:bg-[#26baf1]'
            }
          >
            <Download size={16} className="mr-2" />
            Export {getFileTypeLabel()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExportYearFilterModal;