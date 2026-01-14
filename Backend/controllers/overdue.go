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

	now := time.Now()
	totalPerbaikan := 0
	warning := 0
	overdue := 0
	totalKerugian := 0

	for _, m := range mesin {
		if len(m.Perbaikan) == 0 {
			continue
		}

		totalPerbaikan++

		p := m.Perbaikan[0]
		if p.EstimasiSelesai == nil {
			continue
		}

		diff := int(now.Sub(*p.EstimasiSelesai).Hours() / 24)

		// Warning hanya jika mendekati deadline (0-2 hari)
		if diff >= 3 {
			overdue++
			if m.Sewa != nil {
				totalKerugian += m.Sewa.BiayaBulanan
			}
		} else if diff >= 0 && diff < 3 {
			warning++
		}
	}

	// Susun statusOverdue untuk frontend
	statusOverdue := []fiber.Map{
		{
			"status": "PERBAIKAN",
			"total":  totalPerbaikan - warning - overdue, // Mesin yang masih dalam perbaikan normal
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

	// Kembalikan response lengkap
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

	// Ambil semua mesin yang sedang perbaikan
	err := database.DB.
		Preload("Perbaikan").
		Preload("Sewa").
		Where("status_mesin = ?", "perbaikan").
		Find(&mesin).Error

	if err != nil {
		return utils.Error(c, "Gagal mengambil data mesin overdue")
	}

	now := time.Now()
	var result []dto.MachineResponse

	for _, m := range mesin {
		if len(m.Perbaikan) == 0 {
			continue
		}

		p := m.Perbaikan[0]

		status := "PERBAIKAN"
		kerugian := 0

		if p.EstimasiSelesai != nil {
			diff := int(now.Sub(*p.EstimasiSelesai).Hours() / 24)

			if diff >= 3 {
				status = "OVERDUE"
				if m.Sewa != nil {
					kerugian = m.Sewa.BiayaBulanan
				}
			} else if diff >= 0 && diff < 3 {
				status = "WARNING"
			}
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
		`, "perbaikan", "%"+query+"%", "%"+query+"%").
		Find(&mesin).Error

	if err != nil {
		return utils.Error(c, "Gagal melakukan pencarian overdue")
	}

	now := time.Now()
	var result []dto.MachineResponse

	for _, m := range mesin {
		if len(m.Perbaikan) == 0 {
			continue
		}

		p := m.Perbaikan[0]

		status := "PERBAIKAN"
		kerugian := 0

		if p.EstimasiSelesai != nil {
			diff := int(now.Sub(*p.EstimasiSelesai).Hours() / 24)

			if diff >= 3 {
				status = "OVERDUE"
				if m.Sewa != nil {
					kerugian = m.Sewa.BiayaBulanan
				}
			} else if diff >= 0 && diff < 3 {
				status = "WARNING"
			}
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