import { MS_PER_DAY } from "./constants";

export const calculateLoss = (machine, daysOverdue) => {
  if (!machine.biaya_sewa || daysOverdue <= 0) return 0
  const dailyCost = machine.biaya_sewa / 30
  return Math.round(daysOverdue * dailyCost)
}

export const getOverdueInfo = (machine, today = new Date()) => {
  if (!machine.estimasi_selesai) {
    return { 
      isOverdue: false, 
      daysLate: 0, 
      isWarning: false,
      isPerbaikan: true,
      statusPerbaikan: 'PERBAIKAN'
    }
  }

  const estimate = new Date(machine.estimasi_selesai)
  
  const diff = Math.floor((today - estimate) / MS_PER_DAY)
  let statusPerbaikan = 'PERBAIKAN'
  let isOverdue = false
  let isWarning = false
  let daysLate = 0
  
  if (diff >= 3) {
    statusPerbaikan = 'OVERDUE'
    isOverdue = true
    daysLate = diff
  } else if (diff >= 0) {
    statusPerbaikan = 'WARNING'
    isWarning = true
  }

  return {
    statusPerbaikan,
    isOverdue,
    isWarning,
    isPerbaikan: statusPerbaikan === 'PERBAIKAN',
    daysLate,
  }
};

// Tambahkan helper function di atas component
export const normalizeStatusData = (status) => {
  if (!status) return 'VENDOR_ONLY'
  
  const normalized = status.toUpperCase()
  
  // Handle semua kemungkinan format dari backend
  if (normalized === 'BANK' || normalized === 'TERDATA_BANK') {
    return 'TERDATA_BANK'
  }
  
  return 'VENDOR_ONLY'
}