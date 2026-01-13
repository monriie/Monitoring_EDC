import { MS_PER_DAY, WARNING_THRESHOLD_DAYS } from './constants'

export const calculateDaysOverdue = (estimateDate) => {
  if (!estimateDate) return 0
  const today = new Date()
  const estimate = new Date(estimateDate)
  const diff = Math.floor((today - estimate) / MS_PER_DAY)
  return diff >= 3 ? diff : 0
}

export const isNewMachine = (tanggalPasang, thresholdDays = 30) => {
  if (!tanggalPasang) return false
  const today = new Date()
  const pasang = new Date(tanggalPasang)
  const diffDays = Math.ceil((today - pasang) / MS_PER_DAY)
  return diffDays <= thresholdDays
}