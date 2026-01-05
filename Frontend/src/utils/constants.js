export const MS_PER_DAY = 1000 * 60 * 60 * 24
export const NEW_MACHINE_THRESHOLD_DAYS = 30
export const WARNING_THRESHOLD_DAYS = 3
export const ITEMS_PER_PAGE = 10

export const STATUS_MESIN = {
  AKTIF: 'AKTIF',
  PERBAIKAN: 'PERBAIKAN',
  RUSAK: 'RUSAK',
  NONAKTIF: 'NONAKTIF'
}

export const STATUS_DATA = {
  TERDATA_BANK: 'TERDATA_BANK',
  VENDOR_ONLY: 'VENDOR_ONLY',
}

export const STATUS_SEWA = {
  AKTIF: 'AKTIF',
  BERAKHIR: 'BERAKHIR'
}

export const STATUS_LETAK = {
  NASABAH: 'NASABAH',
  VENDOR: 'VENDOR',
  BANK: 'BANK'
}

export const STATUS_PERBAIKAN = {
  PERBAIKAN: 'PERBAIKAN',
  WARNING: 'WARNING',
  OVERDUE: 'OVERDUE'
}

export const STATUS_LABELS = {
  AKTIF: 'Aktif',
  PERBAIKAN: 'Perbaikan',
  RUSAK: 'Rusak',
  NONAKTIF: 'Nonaktif',
  TERDATA_BANK: 'Terdata Bank',
  VENDOR_ONLY: 'Vendor Only',
  BERAKHIR: 'Berakhir',
  NASABAH: 'Nasabah',
  VENDOR: 'Vendor',
  BANK: 'Bank',
  WARNING: 'Warning',
  OVERDUE: 'Overdue'
}

export const STATUS_COLORS = {
  AKTIF: 'bg-emerald-500 text-white',
  PERBAIKAN: 'bg-amber-500 text-white',
  RUSAK: 'bg-red-600 text-white',
  NONAKTIF: 'bg-black text-white',

  NASABAH: 'bg-emerald-500 text-white',
  VENDOR: 'bg-orange-500 text-white',
  BANK: 'bg-sky-500 text-white',

  BERAKHIR: 'bg-gray-200 text-gray-800',
  TERDATA_BANK: 'bg-black text-white',
  VENDOR_ONLY: 'bg-white border text-black',

  WARNING: 'bg-yellow-500 text-white',
  OVERDUE: 'bg-red-600 text-white'
}
