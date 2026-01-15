package controllers

import (
	"time"

	"github.com/gofiber/fiber/v2"

	"backend/database"
	"backend/models"
	"backend/models/dto"
	"backend/utils"
)

type StatusResult struct {
	Status string `json:"status"`
	Total  int64  `json:"total"`
}

func GetDashboard(c *fiber.Ctx) error {
	var totalMesin int64
	var terdataBank int64
	var statusMesin []StatusResult
	var statusOverdue []StatusResult
	var mesinBaru []models.MesinEDC

	now := time.Now()

	// =========================
	// TOTAL MESIN
	// =========================
	database.DB.
		Model(&models.MesinEDC{}).
		Count(&totalMesin)

	// =========================
	// TERDATA DI BANK
	// =========================
	database.DB.
		Model(&models.MesinEDC{}).
		Where("status_data = ?", "bank").
		Count(&terdataBank)

	// =========================
	// STATUS MESIN (CHART)
	// =========================
	database.DB.
		Model(&models.MesinEDC{}).
		Select("status_mesin as status, COUNT(*) as total").
		Group("status_mesin").
		Scan(&statusMesin)

	// =========================
	// STATUS OVERDUE
	// =========================
	database.DB.
		Model(&models.Perbaikan{}).
		Select("status_perbaikan as status, COUNT(*) as total").
		Group("status_perbaikan").
		Scan(&statusOverdue)

	// =========================
	// MESIN BARU DARI VENDOR
	// =========================
	database.DB.
		Where("status_data = ?", "vendor_only").
		Order("created_at DESC").
		Limit(10).
		Find(&mesinBaru)

	// =========================
	// MONITORING OVERDUE - MENGGUNAKAN LOGIKA YANG SAMA DENGAN OVERDUE CONTROLLER
	// =========================
	var mesinPerbaikan []models.MesinEDC
	
	err := database.DB.
		Preload("Perbaikan").
		Preload("Sewas").
		Where("status_mesin = ?", "perbaikan").
		Order("tanggal_pasang DESC").
		Find(&mesinPerbaikan).Error

	if err != nil {
		return utils.Error(c, "Gagal mengambil data overdue")
	}

	// Transform ke MachineResponse dengan logika yang sama seperti overdue controller
	var overdueList []dto.MachineResponse

	for _, m := range mesinPerbaikan {
		// Skip jika tidak ada data perbaikan atau estimasi
		if len(m.Perbaikan) == 0 || m.Perbaikan[0].EstimasiSelesai == nil {
			continue
		}

		p := m.Perbaikan[0]
		status := "PERBAIKAN"
		kerugian := 0
		daysLate := 0

		diffDays := int(p.EstimasiSelesai.Sub(now).Hours() / 24)

		if diffDays < 0 {
			status = "OVERDUE"
			daysLate = -diffDays
			if len(m.Sewas) > 0 {
				sewa := m.Sewas[0]
				dailyCost := float64(normalizeBiayaBulanan(sewa.BiayaBulanan)) / 30.0
				kerugian = int(float64(daysLate) * dailyCost)
			}
		} else if diffDays <= 3 {
			status = "WARNING"
			daysLate = 0
		}

		// Hanya ambil yang WARNING atau OVERDUE untuk monitoring
		if status != "WARNING" && status != "OVERDUE" {
			continue
		}

		machineResp := dto.MachineResponse{
			ID:              m.ID,
			TerminalID:      m.TerminalID,
			MID:             m.MID,
			NamaNasabah:     utils.GetNamaNasabah(m.NamaNasabah, m.StatusData),
			Kota:            m.Kota,
			Cabang:          m.Cabang,
			TipeEDC:         m.TipeEDC,
			StatusMesin:     dto.MapStatusMesin(m.StatusMesin),
			StatusData:      dto.MapStatusData(m.StatusData),
			StatusLetak:     dto.MapStatusLetak(m.LetakMesin),
			BiayaSewa:       kerugian,
			StatusPerbaikan: status,
			DaysOverdue:     daysLate,
		}

		tp := dto.FormatDateOnlyPtr(m.TanggalPasang)
		if tp != "" {
			machineResp.TanggalPasang = tp
		}

		es := dto.FormatDateOnlyPtr(p.EstimasiSelesai)
		if es != "" {
			machineResp.EstimasiSelesai = &es
		}

		overdueList = append(overdueList, machineResp)
	}

	// Sort by status priority (OVERDUE first, then WARNING) and days late
	// Limit to 5 items for dashboard preview
	if len(overdueList) > 0 {
		// Simple sort: OVERDUE first
		var overdueItems []dto.MachineResponse
		var warningItems []dto.MachineResponse
		
		for _, item := range overdueList {
			if item.StatusPerbaikan == "OVERDUE" {
				overdueItems = append(overdueItems, item)
			} else {
				warningItems = append(warningItems, item)
			}
		}
		
		// Combine: overdue first, then warning
		overdueList = append(overdueItems, warningItems...)
		
		// Limit to 5
		if len(overdueList) > 5 {
			overdueList = overdueList[:5]
		}
	}

	// Transform mesin baru ke MachineResponse
	var mesinBaruList []dto.MachineResponse
	for _, m := range mesinBaru {
		machineResp := dto.MachineResponse{
			ID:          m.ID,
			TerminalID:  m.TerminalID,
			MID:         m.MID,
			NamaNasabah: utils.GetNamaNasabah(m.NamaNasabah, m.StatusData),
			Kota:        m.Kota,
			Cabang:      m.Cabang,
			TipeEDC:     m.TipeEDC,
			StatusMesin: dto.MapStatusMesin(m.StatusMesin),
			StatusData:  dto.MapStatusData(m.StatusData),
			StatusLetak: dto.MapStatusLetak(m.LetakMesin),
		}

		tp := dto.FormatDateOnlyPtr(m.TanggalPasang)
		if tp != "" {
			machineResp.TanggalPasang = tp
		}

		mesinBaruList = append(mesinBaruList, machineResp)
	}

	// =========================
	// RESPONSE FINAL
	// =========================
	return utils.Success(c, fiber.Map{
		"stats": fiber.Map{
			"totalMesin":    totalMesin,
			"terdataBank":   terdataBank,
			"statusMesin":   statusMesin,
			"statusOverdue": statusOverdue,
		},
		"mesinBaru":         mesinBaruList,
		"monitoringOverdue": overdueList,
	})
}