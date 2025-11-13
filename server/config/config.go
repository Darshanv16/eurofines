package config

import (
	"os"
	"strings"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBName     string
	DBUser     string
	DBPassword string
	DBSSLMode  string
	Port       string
	JWTSecret  string
}

func LoadConfig() *Config {
	return &Config{
		DBHost:     getEnv("DB_HOST", "localhost"),
		DBPort:     getEnv("DB_PORT", "5432"),
		DBName:     getEnv("DB_NAME", "eurofines_db"),
		DBUser:     getEnv("DB_USER", "postgres"),
		DBPassword: getEnv("DB_PASSWORD", ""),
		DBSSLMode:  getEnv("DB_SSLMODE", "disable"),
		Port:       getEnv("PORT", "3001"),
		JWTSecret:  getEnv("JWT_SECRET", "your_super_secret_jwt_key_change_this_in_production_min_32_chars"),
	}
}

func getEnv(key, def string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return def
}
