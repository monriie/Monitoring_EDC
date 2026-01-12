import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex items-center justify-between px-2 py-4">
    <p className="text-sm text-gray-700">
      Halaman <span className="font-medium">{currentPage}</span> dari{' '}
      <span className="font-medium">{totalPages}</span>
    </p>
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
        <p className="hidden md:inline">Previous</p>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <p className="hidden md:inline">Next</p>
        <ChevronRight size={16} />
      </Button>
    </div>
  </div>
)

export default Pagination