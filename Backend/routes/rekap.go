package routes

import (
	"github.com/gofiber/fiber/v2"
	"backend/controllers"
	"backend/middlewares"
)

func RekapRoutes(api fiber.Router) {
	rekap := api.Group("/rekap", middlewares.AuthMiddleware)

	rekap.Get("/", controllers.GetRekapMesin)
	rekap.Post("/", controllers.CreateRekapMesin)
	rekap.Get("/:id", controllers.GetDetailMesin)
	rekap.Put("/:id", controllers.UpdateMesin)

}
