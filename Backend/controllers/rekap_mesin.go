package controllers

import (
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"backend/database"
	"backend/models"
	"backend/models/dto"
	"backend/utils"
)

func GetRekapMesin(c *fiber.Ctx) error {
	search := c.Query("search")

	var mesinList []models.MesinEDC

	query := database.DB.
		Preload("Sewa").
		Preload("Perbaikan")

	if search != "" {
		keyword := "%" + strings.ToLower(search) + "%"
		query = query.Where(
			"LOWER(terminal_id) LIKE ? OR LOWER(nama_nasabah) LIKE ?",
			keyword, keyword,
		)
	}

	if err := query.Order("tanggal_pasang DESC").Find(&mesinList).Error; err != nil {
		return utils.Error(c, "Gagal mengambil data rekap")
	}

	var response []dto.MachineResponse

	for _, m := range mesinList {
		machineResp := dto.MachineResponse{
			ID:          m.ID,
			TerminalID:  m.TerminalID,
			MID:         m.MID,
			NamaNasabah: m.NamaNasabah,
			Kota:        m.Kota,
			Cabang:      m.Cabang,
			TipeEDC:     m.TipeEDC,
			Vendor:      m.Vendor,

			StatusMesin: dto.MapStatusMesin(m.StatusMesin),
			StatusData:  dto.MapStatusData(m.StatusData),
			StatusLetak: dto.MapStatusLetak(m.LetakMesin),

			CreatedAt: dto.FormatDateOnly(m.CreatedAt),
			UpdatedAt: dto.FormatDateOnly(m.UpdatedAt),

		}

		// ✅ Tanggal Pasang (POINTER SAFE)
		tp := dto.FormatDateOnlyPtr(m.TanggalPasang)
		if tp != "" {
			machineResp.TanggalPasang = tp
		}

		// ✅ Sewa
		if m.Sewa != nil {
			machineResp.StatusSewa = dto.MapStatusSewa(m.Sewa.StatusSewa)
			machineResp.BiayaSewa = m.Sewa.BiayaBulanan
		} else {
			machineResp.StatusSewa = "BERAKHIR"
			machineResp.BiayaSewa = 0
		}

		// ✅ Estimasi Selesai (PERBAIKAN)
		if len(m.Perbaikan) > 0 {
			es := dto.FormatDateOnlyPtr(m.Perbaikan[0].EstimasiSelesai)
			if es != "" {
				machineResp.EstimasiSelesai = &es
			}
		}


		response = append(response, machineResp)
	}

	return utils.Success(c, response)
}

func CreateRekapMesin(c *fiber.Ctx) error {
	type Request struct {
		TerminalID       string    `json:"terminal_id"`
		MID              string    `json:"mid"`
		Kota             string    `json:"kota"`
		Cabang           string    `json:"cabang"`
		TipeEDC          string    `json:"tipe_edc"`
		TanggalPasang    time.Time `json:"tanggal_pasang"`
		BiayaSewaBulanan int       `json:"biaya_sewa_bulanan"`
	}

	var req Request
	if err := c.BodyParser(&req); err != nil {
		return utils.Error(c, "Request tidak valid")
	}

	if req.TerminalID == "" || req.MID == "" {
		return utils.Error(c, "Terminal ID dan MID wajib diisi")
	}

	// Cek duplikasi
	var existing models.MesinEDC
	if err := database.DB.
		Where("terminal_id = ?", req.TerminalID).
		First(&existing).Error; err == nil {
		return utils.Error(c, "Terminal ID sudah terdaftar")
	}

	// ✅ POINTER FIX
	tanggalPasang := req.TanggalPasang

	mesin := models.MesinEDC{
		TerminalID:    req.TerminalID,
		MID:           req.MID,
		Kota:          req.Kota,
		Cabang:        req.Cabang,
		TipeEDC:       req.TipeEDC,
		TanggalPasang: &tanggalPasang,

		StatusData:  "vendor_only",
		StatusMesin: "aktif",
		LetakMesin:  "nasabah",
	}

	if err := database.DB.Create(&mesin).Error; err != nil {
		return utils.Error(c, "Gagal menyimpan mesin")
	}

	biaya := req.BiayaSewaBulanan
	if biaya == 0 {
		biaya = 150000
	}

	sewa := models.Sewa{
		MesinID:      mesin.ID,
		BiayaBulanan: biaya,
		StatusSewa:   "berakhir",
	}

	if err := database.DB.Create(&sewa).Error; err != nil {
		return utils.Error(c, "Gagal menyimpan data sewa")
	}

	return utils.Success(c, fiber.Map{
		"message":     "Rekap mesin berhasil ditambahkan",
		"id_mesin":    mesin.ID,
		"terminal_id": mesin.TerminalID,
	})
}
