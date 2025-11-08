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
	// Load .env (optional)
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  No .env file found — using system environment variables")
	}

	// Load configuration (uses your config.go)
	cfg := config.LoadConfig()

	// Connect DB (uses your db/database.go)
	database, err := db.Initialize()
	if err != nil {
		log.Fatalf("❌ Database connection failed: %v", err)
	}

	// Auto-migrate models
	if err := db.AutoMigrate(database); err != nil {
		log.Fatalf("❌ Migration failed: %v", err)
	}

	// --- Gin HTTP server ---
	r := gin.Default()

	// CORS (open for dev; tighten for prod)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"db":     "connected",
			"name":   cfg.DBName,
		})
	})

	// Initialize routes
	routes.SetupRoutes(r, database)

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("✅ Connected to PostgreSQL (%s)", cfg.DBName)
	log.Printf("🚀 Server listening on %s", addr)

	if err := r.Run(addr); err != nil {
		log.Fatalf("❌ Server failed: %v", err)
	}
}
