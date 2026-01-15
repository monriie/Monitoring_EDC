import { MS_PER_DAY } from './constants'

// Get status perbaikan berdasarkan estimasi
export const getStatusPerbaikan = (estimateDate) => {
  const daysLate = calculateDaysOverdue(estimateDate)
  
   if (diff >= 3) return 'OVERDUE'
  if (diff >= 0) return 'WARNING'
  return 'PERBAIKAN'
}

export const isNewMachine = (tanggalPasang, thresholdDays = 30) => {
  if (!tanggalPasang) return false
  
  try {
    const today = new Date()
    const pasang = new Date(tanggalPasang)
    const diffDays = Math.ceil((today - pasang) / MS_PER_DAY)
    return diffDays <= thresholdDays
  } catch {
    return false
  }
}