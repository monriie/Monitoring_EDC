package controllers

import (
	"time"

	"backend/database"
	"backend/models"
	"backend/models/dto"
	"backend/utils"

	"github.com/gofiber/fiber/v2"
)

func GetOverdueSummary(c *fiber.Ctx) error {
	var mesin []models.MesinEDC
	db := database.DB

	err := db.
		Preload("Perbaikan").
		Preload("Sewa").
		Where("status_mesin = ?", "perbaikan").
		Find(&mesin).Error

	if err != nil {
		return utils.Error(c, "Gagal mengambil data overdue")
	}

	totalPerbaikan := 0
	warning := 0
	overdue := 0
	totalKerugian := 0

	for _, m := range mesin {
		if len(m.Perbaikan) == 0 || m.Perbaikan[0].EstimasiSelesai == nil {
			continue
		}

		totalPerbaikan++
		p := m.Perbaikan[0]

		// Hitung selisih hari dari estimasi selesai ke sekarang
		now := time.Now()
		diffDays := int(p.EstimasiSelesai.Sub(now).Hours() / 24)

		if diffDays < 0 {
			// Sudah melewati estimasi => OVERDUE
			overdue++
			if m.Sewa != nil {
				// Hitung kerugian berdasarkan hari terlambat
				daysLate := -diffDays
				dailyCost := float64(m.Sewa.BiayaBulanan) / 30.0
				totalKerugian += int(float64(daysLate) * dailyCost)
			}
		} else if diffDays <= 3 {
			// Kurang dari atau sama dengan 3 hari tersisa => WARNING
			warning++
		}
	}

	statusOverdue := []fiber.Map{
		{
			"status": "PERBAIKAN",
			"total":  totalPerbaikan - warning - overdue,
		},
		{
			"status": "WARNING",
			"total":  warning,
		},
		{
			"status": "OVERDUE",
			"total":  overdue,
		},
	}

	return utils.Success(c, fiber.Map{
		"total_perbaikan":   totalPerbaikan,
		"warning":           warning,
		"overdue":           overdue,
		"statusOverdue":     statusOverdue,
		"estimasi_kerugian": totalKerugian,
	})
}

func GetOverdueList(c *fiber.Ctx) error {
	var mesin []models.MesinEDC

	err := database.DB.
		Preload("Perbaikan").
		Preload("Sewa").
		Where("status_mesin = ?", "perbaikan").
		Find(&mesin).Error

	if err != nil {
		return utils.Error(c, "Gagal mengambil data mesin overdue")
	}

	var result []dto.MachineResponse

	for _, m := range mesin {
		if len(m.Perbaikan) == 0 || m.Perbaikan[0].EstimasiSelesai == nil {
			continue
		}

		p := m.Perbaikan[0]
		status := "PERBAIKAN"
		kerugian := 0
		daysLate := 0

		now := time.Now()
		diffDays := int(p.EstimasiSelesai.Sub(now).Hours() / 24)

		if diffDays < 0 {
			status = "OVERDUE"
			daysLate = -diffDays
			if m.Sewa != nil {
				dailyCost := float64(m.Sewa.BiayaBulanan) / 30.0
				kerugian = int(float64(daysLate) * dailyCost)
			}
		} else if diffDays <= 3 {
			status = "WARNING"
			daysLate = 0
		}

		machineResp := dto.MachineResponse{
			ID:              m.ID,
			TerminalID:      m.TerminalID,
			MID:             m.MID,
			NamaNasabah:     utils.GetNamaNasabah(m.NamaNasabah, m.StatusData),
			Kota:            m.Kota,
			Cabang:          m.Cabang,
			TipeEDC:         m.TipeEDC,
			StatusMesin:     status,
			StatusData:      dto.MapStatusData(m.StatusData),
			StatusLetak:     dto.MapStatusLetak(m.LetakMesin),
			BiayaSewa:       kerugian,
			DaysOverdue:     daysLate,
			StatusPerbaikan: status,
		}

		tp := dto.FormatDateOnlyPtr(m.TanggalPasang)
		if tp != "" {
			machineResp.TanggalPasang = tp
		}

		es := dto.FormatDateOnlyPtr(p.EstimasiSelesai)
		if es != "" {
			machineResp.EstimasiSelesai = &es
		}

		result = append(result, machineResp)
	}

	return utils.Success(c, result)
}

func SearchOverdue(c *fiber.Ctx) error {
	query := c.Query("q")

	var mesin []models.MesinEDC
	err := database.DB.
		Preload("Perbaikan").
		Preload("Sewa").
		Where(`
			status_mesin = ?
			AND (terminal_id LIKE ? OR nama_nasabah LIKE ?)
		`, "perbaikan", "%"+query+"%", "%"+query+"%").Find(&mesin).Error

	if err != nil {
		return utils.Error(c, "Gagal melakukan pencarian overdue")
	}

	var result []dto.MachineResponse

	for _, m := range mesin {
		if len(m.Perbaikan) == 0 || m.Perbaikan[0].EstimasiSelesai == nil {
			continue
		}

		p := m.Perbaikan[0]
		status := "PERBAIKAN"
		kerugian := 0
		daysLate := 0

		now := time.Now()
		diffDays := int(p.EstimasiSelesai.Sub(now).Hours() / 24)

		if diffDays < 0 {
			status = "OVERDUE"
			daysLate = -diffDays
			if m.Sewa != nil {
				dailyCost := float64(m.Sewa.BiayaBulanan) / 30.0
				kerugian = int(float64(daysLate) * dailyCost)
			}
		} else if diffDays <= 3 {
			status = "WARNING"
			daysLate = 0
		}

		machineResp := dto.MachineResponse{
			ID:              m.ID,
			TerminalID:      m.TerminalID,
			MID:             m.MID,
			NamaNasabah:     utils.GetNamaNasabah(m.NamaNasabah, m.StatusData),
			Kota:            m.Kota,
			Cabang:          m.Cabang,
			TipeEDC:         m.TipeEDC,
			StatusMesin:     status,
			StatusData:      dto.MapStatusData(m.StatusData),
			StatusLetak:     dto.MapStatusLetak(m.LetakMesin),
			BiayaSewa:       kerugian,
			DaysOverdue:     daysLate,
			StatusPerbaikan: status,
		}

		tp := dto.FormatDateOnlyPtr(m.TanggalPasang)
		if tp != "" {
			machineResp.TanggalPasang = tp
		}

		es := dto.FormatDateOnlyPtr(p.EstimasiSelesai)
		if es != "" {
			machineResp.EstimasiSelesai = &es
		}

		result = append(result, machineResp)
	}

	return utils.Success(c, result)
}