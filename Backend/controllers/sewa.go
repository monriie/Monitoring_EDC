package controllers

import (
	"github.com/gofiber/fiber/v2"
	"backend/database"
	"backend/models"
)

func GetSewaSummary(c *fiber.Ctx) error {
	db := database.DB

	var sewas []models.Sewa
	db.Preload("Mesin").Find(&sewas)

	sewaAktif := 0
	sewaBerakhir := 0
	bermasalah := 0
	totalBiaya := 0

	for _, s := range sewas {
		biaya := normalizeBiayaBulanan(s.BiayaBulanan)

		switch s.StatusSewa {
		case "aktif":
			sewaAktif++
			totalBiaya += biaya
		case "berakhir":
			sewaBerakhir++
		}

		if s.Mesin != nil && isMesinBermasalah(s.Mesin.StatusMesin) {
			bermasalah++
		}
	}

	return c.JSON(fiber.Map{
		"sewa_aktif":          sewaAktif,
		"sewa_berakhir":       sewaBerakhir,
		"total_biaya_bulanan": totalBiaya,
		"bermasalah":          bermasalah,
	})
}

func GetSewaList(c *fiber.Ctx) error {
	db := database.DB

	var sewas []models.Sewa
	err := db.Preload("Mesin").Find(&sewas).Error
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "Gagal mengambil data sewa",
		})
	}

	var result []fiber.Map

	for _, s := range sewas {
		if s.Mesin == nil {
			continue
		}

		biaya := s.BiayaBulanan
		if biaya == 0 {
			biaya = 150000
		}

		result = append(result, fiber.Map{
			"terminal_id":    s.Mesin.TerminalID,
			"nama_nasabah":   s.Mesin.NamaNasabah,
			"tanggal_pasang": s.Mesin.TanggalPasang,

			"status_mesin": mapStatusMesinToResponse(s.Mesin.StatusMesin),
			"letak_mesin":  s.Mesin.LetakMesin,
			"status_sewa":  mapStatusSewaToResponse(s.StatusSewa),

			"biaya_bulanan": normalizeBiayaBulanan(s.BiayaBulanan),
		})
	}

	return c.JSON(result)
}

func SearchSewa(c *fiber.Ctx) error {
	query := c.Query("q")
	db := database.DB

	var sewas []models.Sewa
	err := db.
		Joins("JOIN mesin_edcs ON mesin_edcs.id = sewas.mesin_id").
		Where(`
			mesin_edcs.terminal_id LIKE ? OR mesin_edcs.nama_nasabah LIKE ?
		`, "%"+query+"%", "%"+query+"%").
		Preload("Mesin").
		Find(&sewas).Error

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "Gagal melakukan pencarian sewa",
		})
	}

	var result []fiber.Map

	for _, s := range sewas {
		if s.Mesin == nil {
			continue
		}

		biaya := s.BiayaBulanan
		if biaya == 0 {
			biaya = 150000
		}

		result = append(result, fiber.Map{
			"terminal_id":    s.Mesin.TerminalID,
			"nama_nasabah":   s.Mesin.NamaNasabah,
			"tanggal_pasang": s.Mesin.TanggalPasang,

			"status_mesin": mapStatusMesinToResponse(s.Mesin.StatusMesin),
			"letak_mesin":  s.Mesin.LetakMesin,
			"status_sewa":  mapStatusSewaToResponse(s.StatusSewa),

			"biaya_bulanan": normalizeBiayaBulanan(s.BiayaBulanan),
		})

	}

	return c.JSON(result)
}

func mapStatusSewaToResponse(status string) string {
	mapper := map[string]string{
		"aktif":    "AKTIF",
		"berakhir": "BERAKHIR",
	}
	if v, ok := mapper[status]; ok {
		return v
	}
	return "BERAKHIR"
}

func mapStatusMesinToResponse(status string) string {
	mapper := map[string]string{
		"aktif":        "AKTIF",
		"perbaikan":    "PERBAIKAN",
		"rusak":        "RUSAK",
		"tidak_aktif":  "NONAKTIF",
	}
	if v, ok := mapper[status]; ok {
		return v
	}
	return "AKTIF"
}

func isMesinBermasalah(status string) bool {
	return status == "perbaikan" || status == "rusak"
}

func normalizeBiayaBulanan(biaya int) int {
	if biaya <= 0 {
		return 150000
	}
	return biaya
}
