package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"backend/config"
	"backend/database"
	"backend/routes"
)

func main() {
	config.LoadEnv()
	database.DBLoad()
	database.DBMigrate()

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowMethods:     "GET, POST, HEAD, PUT, DELETE, PATCH, OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization, X-Requested-With",
		AllowCredentials: true,
		ExposeHeaders:    "Content-Length, Authorization",
		MaxAge:           86400,
	}))

	routes.SetupRoutes(app)

	log.Fatal(app.Listen(":3000"))
}
