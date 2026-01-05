// status letak ini 
/*  rusak = dibank untuk konfirmasi perbaikan
    perbaiki = vendor
    rusak = bisa di bank / vendor 
 */

const initialMachines = [
  {
    terminal_id: "32090001",
    mid: "70910001",
    nama_nasabah: "Toko Sukses Jaya",
    kota: "Palembang",
    cabang: "Ilir Barat",
    tipe_edc: "Ingenico DX8000",
    status_data: "TERDATA_BANK",
    status_mesin: "AKTIF",
    status_sewa: "AKTIF",
    status_letak: "NASABAH",
    tanggal_pasang: "2024-03-10",
    estimasi_selesai: null,
    biaya_sewa: 150000,
    sumber_data: ["BANK", "VENDOR"]
  },
  {
    terminal_id: "32090002",
    mid: "70910002",
    nama_nasabah: "RM Padang Minang",
    kota: null,
    cabang: null,
    tipe_edc: null,
    status_data: "TERDATA_BANK",
    status_mesin: "PERBAIKAN",
    status_sewa: "AKTIF",
    status_letak: "VENDOR",
    tanggal_pasang: "2024-05-01",
    estimasi_selesai: "2024-12-28",
    biaya_sewa: 150000,
    sumber_data: ["BANK"]
  },
  {
    terminal_id: "32090003",
    mid: "70910003",
    nama_nasabah: null,
    kota: "Palembang",
    cabang: "Plaju",
    tipe_edc: "Verifone V240m",
    status_data: "VENDOR_ONLY",
    status_mesin: "AKTIF",
    status_sewa: "BERAKHIR",
    status_letak: "NASABAH",
    tanggal_pasang: "2025-07-12",
    estimasi_selesai: null,
    biaya_sewa: 150000,
    sumber_data: ["VENDOR"]
  },
  {
    terminal_id: "32090004",
    mid: "70910004",
    nama_nasabah: "Toko Elektronik",
    kota: "Palembang",
    cabang: "Seberang Ulu",
    tipe_edc: "Ingenico DX8000",
    status_data: "TERDATA_BANK",
    status_mesin: "NONAKTIF",
    status_sewa: "AKTIF",
    status_letak: "BANK",
    tanggal_pasang: "2024-06-15",
    estimasi_selesai: null,
    biaya_sewa: 150000,
    sumber_data: ["BANK", "VENDOR"]
  },
  {
    terminal_id: "32090005",
    mid: "70910005",
    nama_nasabah: "Cafe Modern",
    kota: "Palembang",
    cabang: "Ilir Timur",
    tipe_edc: "Verifone V240m",
    status_data: "TERDATA_BANK",
    status_mesin: "PERBAIKAN",
    status_letak: "VENDOR",
    status_sewa: "AKTIF",
    tanggal_pasang: "2024-08-20",
    estimasi_selesai: "2024-12-29",
    biaya_sewa: 150000,
    sumber_data: ["BANK", "VENDOR"]
  },
  {
    terminal_id: "32090006",
    mid: "70910006",
    nama_nasabah: "Minimarket Jaya",
    kota: "Palembang",
    cabang: "Ilir Barat",
    tipe_edc: "Verifone V240m",
    status_data: "TERDATA_BANK",
    status_mesin: "RUSAK",
    status_letak: "BANK",
    status_sewa: "AKTIF",
    tanggal_pasang: "2024-04-10",
    estimasi_selesai: "2024-12-25",
    biaya_sewa: 150000,
    sumber_data: ["BANK", "VENDOR"]
  },
  {
    terminal_id: "32090007",
    mid: "70910007",
    nama_nasabah: "Apotek Sehat",
    kota: "Palembang",
    cabang: "Plaju",
    tipe_edc: "Ingenico DX8000",
    status_data: "VENDOR_ONLY",
    status_mesin: "AKTIF",
    status_sewa: "BERAKHIR",
    status_letak: "NASABAH",
    tanggal_pasang: "2025-07-15",
    estimasi_selesai: null,
    biaya_sewa: 150000,
    sumber_data: ["VENDOR"]
  }
];
export default initialMachines;