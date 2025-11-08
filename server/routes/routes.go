package routes

import (
	"eurofines-server/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, database *gorm.DB) {
	authHandler := &AuthHandler{DB: database}

	// Public routes
	r.POST("/api/auth/signup", authHandler.SignUp)
	r.POST("/api/auth/signin", authHandler.SignIn)

	// Protected routes
	api := r.Group("/api")
	api.Use(middleware.AuthMiddleware())
	{
		api.GET("/auth/me", authHandler.GetCurrentUser)
		SetupTestItemRoutes(api, database)
		SetupStudyRoutes(api, database)
		SetupFacilityDocRoutes(api, database)
	}

	// Health check endpoint is handled in main.go if needed
}
