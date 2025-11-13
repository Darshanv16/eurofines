package db

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDatabase initializes the database connection and runs migrations
func ConnectDatabase() {
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASS")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, dbname, port)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}

	log.Println("✅ Connected to PostgreSQL successfully!")

	DB = database

	// Auto migrate all your models (tables)
	err = database.AutoMigrate(&User{}, &TestItem{}, &Study{}, &FacilityDoc{})
	if err != nil {
		log.Fatalf("❌ Failed to migrate database: %v", err)
	}

	log.Println("✅ Database migration complete!")
}
