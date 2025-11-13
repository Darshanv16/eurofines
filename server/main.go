package main

import (
	"fmt"
	"log"

	"eurofines-server/config"
	"eurofines-server/db"
	"eurofines-server/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file from server directory
	if err := godotenv.Load(".env"); err != nil {
		if err2 := godotenv.Load(); err2 != nil {
			log.Println("⚠️  No .env file found — using system environment variables")
		}
	}

	// Load configuration
	cfg := config.LoadConfig()

	// Default port
	if cfg.Port == "" {
		cfg.Port = "3001"
		log.Printf("ℹ️  Using default port: 3001")
	}

	// ✅ Connect to PostgreSQL using GORM
	db.ConnectDatabase()

	// --- Gin HTTP server ---
	r := gin.Default()

	// CORS setup
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"db":     "connected",
			"name":   cfg.DBName,
		})
	})

	// Initialize routes (you’ll add them later)
	routes.SetupRoutes(r, db.DB)

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("✅ Connected to PostgreSQL (%s)", cfg.DBName)
	log.Printf("🚀 Server listening on %s", addr)

	if err := r.Run(addr); err != nil {
		log.Fatalf("❌ Server failed: %v", err)
	}
}
