package controllers

import (
	"errors"
	"log"
	"strings"

	"gorm.io/gorm"

	"backend/database"
	"backend/models"
	"backend/models/dto"

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

	tid := dto.GetRawCell(xl, sheet, i, 1)     // TID
	mid := dto.GetRawCell(xl, sheet, i, 2)     // MID
	kota := dto.GetRawCell(xl, sheet, i, 6)    // KOTA
	cabang := dto.GetRawCell(xl, sheet, i, 7)  // CABANG
	tipeEDC := dto.GetRawCell(xl, sheet, i, 8) // TYPE EDC

	if tid == "" || mid == "" {
		skipped++
		continue
	}

	var mesin models.MesinEDC
	err := database.DB.Where("terminal_id = ?", tid).First(&mesin).Error

	// =============================
	// UPDATE
	// =============================
	if err == nil {

		if err := database.DB.Model(&mesin).Updates(map[string]interface{}{
			"mid":         mid,
			"kota":        kota,
			"cabang":      cabang,
			"tipe_edc":    tipeEDC,
		}).Error; err != nil {
			skipped++
			continue
		}

		updated++
		continue
	}

	// =============================
	// INSERT
	// =============================
	if errors.Is(err, gorm.ErrRecordNotFound) {

		newMesin := models.MesinEDC{
			TerminalID:    tid,
			MID:           mid,
			Kota:          kota,
			Cabang:        cabang,
			TipeEDC:       tipeEDC,
			StatusData:    "vendor_only",
			TanggalPasang: nil,
		}

		if err := database.DB.Create(&newMesin).Error; err != nil {
			log.Println("INSERT ERROR:", err)
			skipped++
			continue
		}

		inserted++
		continue
	}

	log.Println("DB ERROR:", err)
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

    // mulai dari row ke-2 (skip header)
    for i := 1; i < len(rows); i++ {

        terminalID := dto.GetRawCell(xl, sheet, i, 1)   // TERMINAL_ID_NR
        namaNasabah := dto.GetRawCell(xl, sheet, i, 5) // ENTITY_NAME
        rawDate := dto.GetRawCell(xl, sheet, i, 6)     // ACTUAL_START_DATE

        // 🔍 LOG DATA AWAL
        log.Printf(
            "[ROW %d] terminalID='%s' namaNasabah='%s' rawDate='%s'",
            i+1, terminalID, namaNasabah, rawDate,
        )

        // =============================
        // VALIDASI STRING WAJIB
        // =============================
        if terminalID == "" || namaNasabah == "" || rawDate == "" {
            log.Printf(
                "[SKIP][VALIDASI] row=%d terminalID='%s' namaNasabah='%s' rawDate='%s'",
                i+1, terminalID, namaNasabah, rawDate,
            )
            skipped++
            continue
        }

        // =============================
        // PARSE TANGGAL (pakai versi aman)
        // =============================
        tanggalPasang, err := dto.GetExcelDate(xl, sheet, i, 6)
        if err != nil {
            log.Printf(
                "[SKIP][DATE] row=%d terminalID='%s' rawDate='%s' err=%v",
                i+1, terminalID, rawDate, err,
            )
            skipped++
            continue
        }

        var mesin models.MesinEDC
        err = database.DB.
            Where("terminal_id = ?", terminalID).
            First(&mesin).Error

        // =============================
        // 🔥 DATA SUDAH ADA → UPDATE
        // =============================
        if err == nil {

            log.Printf("[UPDATE] row=%d terminalID='%s'", i+1, terminalID)

            if err := database.DB.Model(&mesin).Updates(map[string]interface{}{
                "nama_nasabah":   namaNasabah,
                "tanggal_pasang": tanggalPasang,
                "status_data":    "terdata_di_bank",
            }).Error; err != nil {

                log.Printf(
                    "[SKIP][UPDATE ERROR] row=%d terminalID='%s' err=%v",
                    i+1, terminalID, err,
                )

                skipped++
                continue
            }

            updated++
            continue
        }

        // =============================
        // 🔥 RECORD NOT FOUND → INSERT
        // =============================
        if errors.Is(err, gorm.ErrRecordNotFound) {

            log.Printf("[INSERT] row=%d terminalID='%s'", i+1, terminalID)

            newMesin := models.MesinEDC{
                TerminalID:    terminalID,
                NamaNasabah:  namaNasabah,
                TanggalPasang: tanggalPasang,
                StatusData:   "terdata_di_bank",
            }

            if err := database.DB.Create(&newMesin).Error; err != nil {

                log.Printf(
                    "[SKIP][INSERT ERROR] row=%d terminalID='%s' err=%v",
                    i+1, terminalID, err,
                )

                skipped++
                continue
            }

            inserted++
            continue
        }

        // =============================
        // ERROR DB LAIN
        // =============================
        log.Printf(
            "[SKIP][DB ERROR] row=%d terminalID='%s' err=%v",
            i+1, terminalID, err,
        )

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