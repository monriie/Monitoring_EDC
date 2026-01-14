import { MS_PER_DAY } from './constants'

// Calculate days overdue dari estimasi selesai
export const calculateDaysOverdue = (estimateDate) => {
  if (!estimateDate) return 0
  
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const estimate = new Date(estimateDate)
    estimate.setHours(0, 0, 0, 0)
    
    const diff = Math.floor((today - estimate) / MS_PER_DAY)
    
    // Return selisih hari (bisa positif atau negatif)
    return diff
  } catch {
    return 0
  }
}

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