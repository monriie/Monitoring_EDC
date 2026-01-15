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

	// Ambil semua mesin yang sedang perbaikan
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

		// Hitung selisih hari dari sekarang sampai estimasi selesai
		diffDays := int(time.Until(*p.EstimasiSelesai).Hours() / 24)

		if diffDays < 0 {
			// Sudah melewati estimasi => OVERDUE
			overdue++
			if m.Sewa != nil {
				totalKerugian += m.Sewa.BiayaBulanan
			}
		} else if diffDays <= 3 {
			// Kurang dari atau sama dengan 3 hari tersisa => WARNING
			warning++
		}
	}

	// Susun statusOverdue untuk frontend
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

	// Response lengkap
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

		diffDays := int(time.Until(*p.EstimasiSelesai).Hours() / 24)

		if diffDays < 0 {
			status = "OVERDUE"
			if m.Sewa != nil {
				kerugian = m.Sewa.BiayaBulanan
			}
		} else if diffDays <= 3 {
			status = "WARNING"
		}

		machineResp := dto.MachineResponse{
			ID:          m.ID,
			TerminalID:  m.TerminalID,
			MID:         m.MID,
			NamaNasabah: utils.GetNamaNasabah(m.NamaNasabah, m.StatusData),
			Kota:        m.Kota,
			Cabang:     m.Cabang,
			TipeEDC:    m.TipeEDC,
			StatusMesin: status,
			StatusData:  dto.MapStatusData(m.StatusData),
			StatusLetak: dto.MapStatusLetak(m.LetakMesin),
			BiayaSewa:   kerugian,
		}

		// Format tanggal pasang
		tp := dto.FormatDateOnlyPtr(m.TanggalPasang)
		if tp != "" {
			machineResp.TanggalPasang = tp
		}

		// Format estimasi selesai
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

		diffDays := int(time.Until(*p.EstimasiSelesai).Hours() / 24)

		if diffDays < 0 {
			status = "OVERDUE"
			if m.Sewa != nil {
				kerugian = m.Sewa.BiayaBulanan
			}
		} else if diffDays <= 3 {
			status = "WARNING"
		}

		machineResp := dto.MachineResponse{
			ID:          m.ID,
			TerminalID:  m.TerminalID,
			MID:         m.MID,
			NamaNasabah: utils.GetNamaNasabah(m.NamaNasabah, m.StatusData),
			Kota:        m.Kota,
			Cabang:     m.Cabang,
			TipeEDC:    m.TipeEDC,
			StatusMesin: status,
			StatusData:  dto.MapStatusData(m.StatusData),
			StatusLetak: dto.MapStatusLetak(m.LetakMesin),
			BiayaSewa:   kerugian,
		}

		// Format tanggal pasang
		tp := dto.FormatDateOnlyPtr(m.TanggalPasang)
		if tp != "" {
			machineResp.TanggalPasang = tp
		}

		// Format estimasi selesai
		es := dto.FormatDateOnlyPtr(p.EstimasiSelesai)
		if es != "" {
			machineResp.EstimasiSelesai = &es
		}

		result = append(result, machineResp)
	}

	return utils.Success(c, result)
}
