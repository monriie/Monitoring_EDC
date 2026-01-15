package dto

import "time"

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
	StatusMesin     string  `json:"status_mesin"`
	StatusData      string  `json:"status_data"`
	StatusSewa      string  `json:"status_sewa"`
	StatusLetak     string  `json:"status_letak"`
	TanggalPasang   string  `json:"tanggal_pasang"`
	BiayaSewa       int     `json:"biaya_sewa"`
	EstimasiSelesai *string `json:"estimasi_selesai,omitempty"`
	CreatedAt       string  `json:"created_at"`
	UpdatedAt       string  `json:"updated_at"`
	
	// Fields khusus untuk overdue tracking
	StatusPerbaikan string `json:"status_perbaikan,omitempty"` // PERBAIKAN, WARNING, OVERDUE
	DaysOverdue     int    `json:"days_overdue,omitempty"`     // Jumlah hari terlambat
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

func MapStatusMesin(status string) string {
	statusMap := map[string]string{
		"aktif":       "AKTIF",
		"perbaikan":   "PERBAIKAN",
		"rusak":       "RUSAK",
		"tidak_aktif": "NONAKTIF",
		"nonaktif":    "NONAKTIF",
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
		"AKTIF":    "AKTIF",
		"BERAKHIR": "BERAKHIR",
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