// Normalisasi status mesin dari berbagai format backend
export const normalizeStatusMesin = (status) => {
  if (!status) return 'AKTIF'
  
  const normalized = status.toString().toLowerCase()
  
  const statusMap = {
    'aktif': 'AKTIF',
    'perbaikan': 'PERBAIKAN',
    'rusak': 'RUSAK',
    'tidak_aktif': 'NONAKTIF',
    'nonaktif': 'NONAKTIF',
    'warning': 'WARNING',
    'overdue': 'OVERDUE'
  }
  
  return statusMap[normalized] || status.toUpperCase()
}

export const normalizeStatusSewa = (status) => {
  if (!status) return 'BERAKHIR'
  
  const normalized = status.toString().toLowerCase()
  
  const statusMap = {
    'aktif': 'AKTIF',
    'berakhir': 'BERAKHIR'
  }
  
  return statusMap[normalized] || status.toUpperCase()
}

export const normalizeStatusData = (status) => {
  if (!status) return 'VENDOR_ONLY'
  
  const normalized = status.toString().toLowerCase()
  
  if (normalized === 'bank' || normalized === 'terdata_bank') {
    return 'TERDATA_BANK'
  }
  
  return 'VENDOR_ONLY'
}

export const normalizeStatusLetak = (status) => {
  if (!status) return 'NASABAH'
  
  const normalized = status.toString().toLowerCase()
  
  const statusMap = {
    'nasabah': 'NASABAH',
    'vendor': 'VENDOR',
    'bank': 'BANK'
  }
  
  return statusMap[normalized] || status.toUpperCase()
}

export const isMesinProblematic = (statusMesin, statusSewa) => {
  const mesin = normalizeStatusMesin(statusMesin)
  const sewa = normalizeStatusSewa(statusSewa)
  
  return sewa === 'AKTIF' && mesin === 'OVERDUE'
}

export const isMesinWarning = (statusMesin, statusSewa) => {
  const mesin = normalizeStatusMesin(statusMesin)
  const sewa = normalizeStatusSewa(statusSewa)
  
  return sewa === 'AKTIF' && 
    (mesin === 'WARNING' || mesin === 'PERBAIKAN' || mesin === 'RUSAK') &&
      mesin !== 'OVERDUE'
}

// Normalisasi biaya sewa
export const normalizeBiayaSewa = (biaya) => {
  const parsed = parseInt(biaya)
  if (isNaN(parsed) || parsed <= 0) {
    return 150000 // default
  }
  return parsed
}

// Format tanggal dari backend (hapus jam)
export const formatDateOnly = (dateString) => {
  if (!dateString) return '-'
  
  try {
    // Jika format ISO (2024-01-15T00:00:00Z)
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    
    // Return YYYY-MM-DD saja
    return date.toISOString().split('T')[0]
  } catch {
    // Jika sudah format YYYY-MM-DD, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }
    return dateString
  }
}

// Normalisasi semua data machine termasuk biaya dan tanggal
export const normalizeMachineStatuses = (machine) => {
  return {
    ...machine,
    status_mesin: normalizeStatusMesin(machine.status_mesin),
    status_sewa: normalizeStatusSewa(machine.status_sewa),
    status_data: normalizeStatusData(machine.status_data),
    status_letak: normalizeStatusLetak(machine.status_letak),
    biaya_sewa: normalizeBiayaSewa(machine.biaya_sewa || machine.biaya_bulanan),
    tanggal_pasang: formatDateOnly(machine.tanggal_pasang),
    estimasi_selesai: machine.estimasi_selesai ? formatDateOnly(machine.estimasi_selesai) : null
  }
}

export const normalizeMachinesList = (machines) => {
  if (!Array.isArray(machines)) return []
  return machines.map(normalizeMachineStatuses)
}