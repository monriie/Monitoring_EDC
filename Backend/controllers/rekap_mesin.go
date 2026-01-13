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
		TerminalID       string     `json:"terminal_id"`
		MID              string     `json:"mid"`
		NamaNasabah      *string    `json:"nama_nasabah"` // Make it pointer to handle null
		Kota             string     `json:"kota"`
		Cabang           string     `json:"cabang"`
		TipeEDC          string     `json:"tipe_edc"`
		StatusData       string     `json:"status_data"`
		StatusMesin      string     `json:"status_mesin"`
		StatusSewa       string     `json:"status_sewa"`
		StatusLetak      string     `json:"status_letak"`
		TanggalPasang    *time.Time `json:"tanggal_pasang"` // Pointer for optional
		BiayaSewa        int        `json:"biaya_sewa"`     // Match frontend field name
	}

	var req Request
	if err := c.BodyParser(&req); err != nil {
		println("Body parse error:", err.Error())
		return utils.Error(c, "Request tidak valid")
	}

	// Basic validation
	if req.TerminalID == "" || req.MID == "" {
		return utils.Error(c, "Terminal ID dan MID wajib diisi")
	}

	println("Received data:", req.TerminalID, req.MID)

	// Check for duplicates
	var existing models.MesinEDC
	if err := database.DB.
		Where("terminal_id = ?", req.TerminalID).
		First(&existing).Error; err == nil {
		return utils.Error(c, "Terminal ID sudah terdaftar")
	}

	// Handle nama_nasabah (could be null from frontend)
	namaNasabah := "Belum Terdata"
	if req.NamaNasabah != nil && *req.NamaNasabah != "" {
		namaNasabah = *req.NamaNasabah
	}

	// Convert status values from frontend (uppercase) to DB format (lowercase)
	statusData := convertStatusDataToDB(req.StatusData)
	statusMesin := convertStatusMesinToDB(req.StatusMesin)
	statusLetak := convertStatusLetakToDB(req.StatusLetak)

	// Create mesin record
	mesin := models.MesinEDC{
		TerminalID:    req.TerminalID,
		MID:           req.MID,
		NamaNasabah:   namaNasabah,
		Kota:          req.Kota,
		Cabang:        req.Cabang,
		TipeEDC:       req.TipeEDC,
		TanggalPasang: req.TanggalPasang,
		StatusData:    statusData,
		StatusMesin:   statusMesin,
		LetakMesin:    statusLetak,
	}

	if err := database.DB.Create(&mesin).Error; err != nil {
		return utils.Error(c, "Gagal menyimpan mesin: " + err.Error())
	}

	// Set default biaya if not provided
	biaya := req.BiayaSewa
	if biaya == 0 {
		biaya = 1500000 // Match frontend default
	}

	// Convert status sewa
	statusSewa := convertStatusSewaToDB(req.StatusSewa)

	// Create sewa record
	sewa := models.Sewa{
		MesinID:      mesin.ID,
		BiayaBulanan: biaya,
		StatusSewa:   statusSewa,
	}

	if err := database.DB.Create(&sewa).Error; err != nil {
		return utils.Error(c, "Gagal menyimpan data sewa: " + err.Error())
	}

	return utils.Success(c, fiber.Map{
		"message":     "Rekap mesin berhasil ditambahkan",
		"id_mesin":    mesin.ID,
		"terminal_id": mesin.TerminalID,
	})
}

// func CreateRekapMesin(c *fiber.Ctx) error {
// 	type Request struct {
// 		TerminalID       string    `json:"terminal_id"`
// 		MID              string    `json:"mid"`
// 		NamaNasabah      string    `json:"nama_nasabah"`
// 		Kota             string    `json:"kota"`
// 		Cabang           string    `json:"cabang"`
// 		TipeEDC          string    `json:"tipe_edc"`
// 		StatusData       string    `json:"status_data"`
// 		TanggalPasang    time.Time `json:"tanggal_pasang"`
// 		BiayaSewaBulanan int       `json:"biaya_sewa_bulanan"`
// 	}

// 	var req Request
// 	if err := c.BodyParser(&req); err != nil {
// 		return utils.Error(c, "Request tidak valid")
// 	}

// 	if req.TerminalID == "" || req.MID == "" || req.NamaNasabah == "" {
// 		return utils.Error(c, "Terminal ID, MID, dan Nama Nasabah wajib diisi")
// 	}

// 	// Cek duplikasi
// 	var existing models.MesinEDC
// 	if err := database.DB.
// 		Where("terminal_id = ?", req.TerminalID).
// 		First(&existing).Error; err == nil {
// 		return utils.Error(c, "Terminal ID sudah terdaftar")
// 	}

// 	// ✅ POINTER FIX
// 	tanggalPasang := req.TanggalPasang
// 	statusData := req.StatusData
// 	if statusData == "" {
// 		statusData = "vendor_only"
// 	}

// 	mesin := models.MesinEDC{
// 		TerminalID:    req.TerminalID,
// 		MID:           req.MID,
// 		NamaNasabah:   req.NamaNasabah,
// 		Kota:          req.Kota,
// 		Cabang:        req.Cabang,
// 		TipeEDC:       req.TipeEDC,
// 		TanggalPasang: &tanggalPasang,

// 		StatusData:  statusData,
// 		StatusMesin: "aktif",
// 		LetakMesin:  "nasabah",
// 	}

// 	if err := database.DB.Create(&mesin).Error; err != nil {
// 		return utils.Error(c, "Gagal menyimpan mesin")
// 	}

// 	biaya := req.BiayaSewaBulanan
// 	if biaya == 0 {
// 		biaya = 150000
// 	}

// 	sewa := models.Sewa{
// 		MesinID:      mesin.ID,
// 		BiayaBulanan: biaya,
// 		StatusSewa:   "berakhir",
// 	}

// 	if err := database.DB.Create(&sewa).Error; err != nil {
// 		return utils.Error(c, "Gagal menyimpan data sewa")
// 	}

// 	return utils.Success(c, fiber.Map{
// 		"message":     "Rekap mesin berhasil ditambahkan",
// 		"id_mesin":    mesin.ID,
// 		"terminal_id": mesin.TerminalID,
// 	})
// }
