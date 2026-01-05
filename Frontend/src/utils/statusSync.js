const syncMachineStatuses = (machine, changedField, newValue) => {
  const updated = { ...machine, [changedField]: newValue }
  let warning = null

  // Mesin RUSAK → Sewa BERAKHIR
  if (changedField === 'status_mesin' && newValue === 'RUSAK') {
    updated.status_sewa = 'BERAKHIR'
    updated.status_letak = 'BANK'
    warning = 'Status sewa otomatis berubah menjadi BERAKHIR'
  }

  // Mesin PERBAIKAN → Letak VENDOR
  if (changedField === 'status_mesin' && newValue === 'PERBAIKAN') {
    updated.status_letak = 'VENDOR'
  }

  // Mesin AKTIF dari PERBAIKAN → kembali ke Nasabah
  if (changedField === 'status_mesin' && newValue === 'AKTIF') {
    if (machine.status_mesin === 'PERBAIKAN') {
      updated.status_letak = 'NASABAH'
      updated.estimasi_selesai = null
      warning = 'Perbaikan selesai! Letak mesin dikembalikan ke NASABAH'
    }

    if (updated.status_sewa === 'BERAKHIR') {
      updated.status_sewa = 'AKTIF'
    }
  }

  // Status sewa BERAKHIR → Mesin NONAKTIF
  if (changedField === 'status_sewa' && newValue === 'BERAKHIR') {
    if (updated.status_mesin === 'AKTIF') {
      updated.status_mesin = 'NONAKTIF'
      warning = 'Status mesin otomatis berubah menjadi NONAKTIF'
    }
  }

  // Letak BANK saat PERBAIKAN → dianggap selesai
  if (changedField === 'status_letak' && newValue === 'BANK') {
    if (machine.status_mesin === 'PERBAIKAN') {
      updated.status_mesin = 'AKTIF'
      updated.estimasi_selesai = null
      warning = 'Mesin selesai diperbaiki! Status mesin berubah menjadi AKTIF'
    }
  }

  // Sewa AKTIF kembali → Mesin AKTIF
  if (changedField === 'status_sewa' && newValue === 'AKTIF') {
    if (updated.status_mesin === 'NONAKTIF') {
      updated.status_mesin = 'AKTIF'
      updated.status_letak = 'NASABAH'
    }
  }

  return { updated, warning }
}

export default syncMachineStatuses
