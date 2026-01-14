import { MS_PER_DAY } from "./constants";

export const calculateLoss = (machine, daysOverdue) => {
  const biaya = machine.biaya_sewa || machine.biaya_bulanan || 0

  if (!biaya || daysOverdue <= 0) return 0
  const dailyCost = biaya / 30
  return Math.round(daysOverdue * dailyCost)
}

export const getOverdueInfo = (machine, today = new Date()) => {
  if (!machine.estimasi_selesai) {
    return {
      statusPerbaikan: 'PERBAIKAN',
      isOverdue: false,
      isWarning: false,
      isPerbaikan: true,
      daysLate: 0
    }
  }

  today.setHours(0, 0, 0, 0)
  const estimate = new Date(machine.estimasi_selesai)
  estimate.setHours(0, 0, 0, 0)

  const diff = Math.floor((estimate - today) / MS_PER_DAY)

  /**
   * diff:
   * > 3  → masih aman
   * 3..0 → WARNING (H-3 s/d H)
   * < 0  → OVERDUE
   */

  let statusPerbaikan = 'PERBAIKAN'
  let isOverdue = false
  let isWarning = false
  let daysLate = 0

  if (diff < 0) {
    statusPerbaikan = 'OVERDUE'
    isOverdue = true
    daysLate = Math.abs(diff)
  } else if (diff <= 3) {
    statusPerbaikan = 'WARNING'
    isWarning = true
  }

  return {
    statusPerbaikan,
    isOverdue,
    isWarning,
    isPerbaikan: statusPerbaikan === 'PERBAIKAN',
    daysLate
  }
}