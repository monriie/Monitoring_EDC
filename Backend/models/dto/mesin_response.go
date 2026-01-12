package dto

import "time"

// Response format yang konsisten untuk semua endpoint
type MachineResponse struct {
	ID              uint    `json:"id"`
	TerminalID      string  `json:"terminal_id"`
	MID             string  `json:"mid"`
	SN              string  `json:"sn,omitempty"`
	NamaNasabah     string  `json:"nama_nasabah"`
	Kota            string  `json:"kota"`
	Cabang          string  `json:"cabang"`
	TipeEDC         string  `json:"tipe_edc"`
	Vendor          string  `json:"vendor"`
	StatusMesin     string  `json:"status_mesin"`   // AKTIF, PERBAIKAN, RUSAK, NONAKTIF
	StatusData      string  `json:"status_data"`    // TERDATA_BANK, VENDOR_ONLY
	StatusSewa      string  `json:"status_sewa"`    // AKTIF, BERAKHIR
	StatusLetak     string  `json:"status_letak"`   // NASABAH, VENDOR, BANK
	TanggalPasang   string  `json:"tanggal_pasang"` // Format: YYYY-MM-DD
	BiayaSewa       int     `json:"biaya_sewa"`
	EstimasiSelesai *string `json:"estimasi_selesai,omitempty"` // Format: YYYY-MM-DD
	CreatedAt       string  `json:"created_at"`     // Format: YYYY-MM-DD
	UpdatedAt       string  `json:"updated_at"`     // Format: YYYY-MM-DD
}

func FormatDateOnly(t time.Time) string {
	if t.IsZero() {
		return ""
	}
	return t.Format("2006-01-02")
}

func FormatDateOnlyPtr(t *time.Time) string {
	if t == nil {
		return ""
	}
	return t.Format("2006-01-02")
}

// Fungsi helper untuk convert status dari database ke frontend format
func MapStatusMesin(status string) string {
	statusMap := map[string]string{
		"aktif":      "AKTIF",
		"perbaikan":  "PERBAIKAN",
		"rusak":      "RUSAK",
		"tidak_aktif": "NONAKTIF",
		"nonaktif":   "NONAKTIF",
	}
	if mapped, ok := statusMap[status]; ok {
		return mapped
	}
	return "AKTIF"
}

func MapStatusData(status string) string {
	statusMap := map[string]string{
		"bank":        "TERDATA_BANK",
		"vendor_only": "VENDOR_ONLY",
	}
	if mapped, ok := statusMap[status]; ok {
		return mapped
	}
	return "VENDOR_ONLY"
}

func MapStatusSewa(status string) string {
	statusMap := map[string]string{
		"aktif":    "AKTIF",
		"berakhir": "BERAKHIR",
	}
	if mapped, ok := statusMap[status]; ok {
		return mapped
	}
	return "BERAKHIR"
}

func MapStatusLetak(letak string) string {
	letakMap := map[string]string{
		"nasabah": "NASABAH",
		"vendor":  "VENDOR",
		"bank":    "BANK",
	}
	if mapped, ok := letakMap[letak]; ok {
		return mapped
	}
	return "NASABAH"
}