export const calculateLoss = (machine, daysOverdue) => {
  if (!machine.biaya_sewa || daysOverdue <= 0) return 0
  const dailyCost = machine.biaya_sewa / 30
  return Math.round(daysOverdue * dailyCost)
}

export const getOverdueInfo = (machine, today = new Date()) => {
  if (!machine.estimasi_selesai || machine.status_mesin !== 'PERBAIKAN') {
    return { 
      isOverdue: false, 
      daysLate: 0, 
      isWarning: false,
      isPerbaikan: false,
      statusPerbaikan: null
    }
  }

  const estimate = new Date(machine.estimasi_selesai)
  const diff = Math.ceil((today - estimate) / (1000 * 60 * 60 * 24))
  
  const isOverdue = diff > 0
  const isWarning = diff <= 0 && Math.ceil((estimate - today) / (1000 * 60 * 60 * 24)) <= 3
  const isPerbaikan = !isOverdue && !isWarning

  let statusPerbaikan = 'PERBAIKAN'
  if (isOverdue) statusPerbaikan = 'OVERDUE'
  else if (isWarning) statusPerbaikan = 'WARNING'

  return {
    isOverdue,
    daysLate: diff > 0 ? diff : 0,
    isWarning,
    isPerbaikan,
    statusPerbaikan
  }
}