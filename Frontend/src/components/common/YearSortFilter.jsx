import React from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowUpDown } from 'lucide-react'

const YearSortFilter = ({ 
  filterYear, 
  setFilterYear, 
  sortOrder, 
  setSortOrder, 
  availableYears 
}) => {
  return (
    <>
      <div>
        <Label htmlFor="filter-year">Tahun Pemasangan</Label>
        <Select value={filterYear} onValueChange={setFilterYear}>
          <SelectTrigger id="filter-year" className="mt-2 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tahun</SelectItem>
            {availableYears.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="sort-order">Urutkan</Label>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger id="sort-order" className="mt-2 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              <div className="flex items-center gap-2">
                <ArrowUpDown size={14} />
                Terbaru - Terlama
              </div>
            </SelectItem>
            <SelectItem value="oldest">
              <div className="flex items-center gap-2">
                <ArrowUpDown size={14} />
                Terlama - Terbaru
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}

export default YearSortFilter;