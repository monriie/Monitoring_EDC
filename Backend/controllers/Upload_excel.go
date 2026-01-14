package controllers

import (
	"errors"
	"strings"

	"gorm.io/gorm"

	"backend/database"
	"backend/models"
	"backend/models/dto"
    "backend/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/xuri/excelize/v2"
)

// =====================
// UPLOAD VENDOR EXCEL
// =====================
func UploadVendorExcel(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "File tidak ditemukan"})
	}

	if !isExcelFile(file.Filename) {
		return c.Status(400).JSON(fiber.Map{"message": "File harus berformat Excel"})
	}

	src, err := file.Open()
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Gagal membuka file"})
	}
	defer src.Close()

	xl, err := excelize.OpenReader(src)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Gagal membaca file excel"})
	}

	sheet := xl.GetSheetName(0)
	rows, err := xl.GetRows(sheet)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Gagal membaca sheet"})
	}

	var inserted, updated, skipped int

	for i := 1; i < len(rows); i++ {

		tid := dto.GetRawCell(xl, sheet, i, 1) // TID
		mid := dto.GetRawCell(xl, sheet, i, 2) // MID
		kota := dto.GetRawCell(xl, sheet, i, 6)
		cabang := dto.GetRawCell(xl, sheet, i, 7)
		tipeEDC := dto.GetRawCell(xl, sheet, i, 8)

		if tid == "" {
			skipped++
			continue
		}

		var mesin models.MesinEDC
		err := database.DB.Where("terminal_id = ?", tid).First(&mesin).Error

		// =======================
		// DATA SUDAH ADA → MERGE
		// =======================
		if err == nil {

			vendorData := models.MesinEDC{
				MID:      mid,
				Kota:     kota,
				Cabang:   cabang,
				TipeEDC:  tipeEDC,
			}

			updates := utils.MergeVendorData(&mesin, vendorData)

			if len(updates) == 0 {
				skipped++
				continue
			}

			if err := database.DB.Model(&mesin).Updates(updates).Error; err != nil {
				skipped++
				continue
			}

			updated++
			continue
		}

		// =======================
		// RECORD BARU → INSERT
		// =======================
		if errors.Is(err, gorm.ErrRecordNotFound) {

			newMesin := models.MesinEDC{
				TerminalID: tid,
				MID:        mid,
				Kota:       kota,
				Cabang:     cabang,
				TipeEDC:    tipeEDC,
				StatusData: "vendor_only",
			}

			if err := database.DB.Create(&newMesin).Error; err != nil {
				skipped++
				continue
			}

			inserted++
			continue
		}

		skipped++
	}

	return c.JSON(fiber.Map{
		"message":  "Upload vendor selesai",
		"inserted": inserted,
		"updated":  updated,
		"skipped":  skipped,
	})
}

// =====================
// UPLOAD BANK EXCEL
// =====================
func UploadBankExcel(c *fiber.Ctx) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "File tidak ditemukan"})
	}

	if !isExcelFile(file.Filename) {
		return c.Status(400).JSON(fiber.Map{"message": "File harus berformat Excel"})
	}

	src, err := file.Open()
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Gagal membuka file"})
	}
	defer src.Close()

	xl, err := excelize.OpenReader(src)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Gagal membaca file excel"})
	}

	sheet := xl.GetSheetName(0)
	rows, err := xl.GetRows(sheet)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Gagal membaca sheet"})
	}

	var inserted, updated, skipped int

	for i := 1; i < len(rows); i++ {

		terminalID := dto.GetRawCell(xl, sheet, i, 1)
		namaNasabah := dto.GetRawCell(xl, sheet, i, 5)

		if terminalID == "" || namaNasabah == "" {
			skipped++
			continue
		}

		tanggalPasang, err := dto.GetExcelDate(xl, sheet, i, 6)
		if err != nil {
			skipped++
			continue
		}

		var mesin models.MesinEDC
		err = database.DB.
			Where("terminal_id = ?", terminalID).
			First(&mesin).Error

		// ======================
		// DATA SUDAH ADA → MERGE
		// ======================
		if err == nil {

			bankData := models.MesinEDC{
				NamaNasabah:  namaNasabah,
				TanggalPasang: tanggalPasang,
			}

			updates := utils.MergeBankData(&mesin, bankData)

			if len(updates) == 0 {
				skipped++
				continue
			}

			if err := database.DB.Model(&mesin).Updates(updates).Error; err != nil {
				skipped++
				continue
			}

			updated++
			continue
		}

		// ======================
		// RECORD BARU → INSERT
		// ======================
		if errors.Is(err, gorm.ErrRecordNotFound) {

			newMesin := models.MesinEDC{
				TerminalID:    terminalID,
				NamaNasabah:  namaNasabah,
				TanggalPasang: tanggalPasang,
				StatusData:   "bank",
			}

			if err := database.DB.Create(&newMesin).Error; err != nil {
				skipped++
				continue
			}

			inserted++
			continue
		}

		skipped++
	}

	return c.JSON(fiber.Map{
		"message":  "Upload bank selesai",
		"inserted": inserted,
		"updated":  updated,
		"skipped":  skipped,
	})
}

// =====================
// HELPERS
// =====================
func isExcelFile(filename string) bool {
	filename = strings.ToLower(filename)
	return strings.HasSuffix(filename, ".xlsx") || strings.HasSuffix(filename, ".xls")
}

func getCell(row []string, index int) string {
	if len(row) > index {
		return strings.TrimSpace(row[index])
	}
	return ""
}