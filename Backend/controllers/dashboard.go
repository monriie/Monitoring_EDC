package controllers

import (
	"time"

	"github.com/gofiber/fiber/v2"

	"backend/database"
	"backend/models"
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
	var overdueList []models.Perbaikan

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
	// MONITORING OVERDUE
	// =========================
	database.DB.
		Preload("Mesin").
		Where("estimasi_selesai < ? AND status_perbaikan = ?", now, "overdue").
		Order("estimasi_selesai ASC").
		Find(&overdueList)

	// =========================
	// RESPONSE FINAL
	// =========================
	return c.JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
		"stats": fiber.Map{
			"totalMesin":    totalMesin,
			"terdataBank":   terdataBank,
			"statusMesin":   statusMesin,
			"statusOverdue": statusOverdue,
		},
		"mesinBaru":   mesinBaru,
		"monitoringOverdue": overdueList,
	},
	})
}
