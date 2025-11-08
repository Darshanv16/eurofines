package main

import (
	"fmt"
	"log"
	"strings"

	"eurofines-server/db"
)

func main() {
	// Connect to database
	database, err := db.Initialize()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Get all users
	var users []db.User
	if err := database.Find(&users).Error; err != nil {
		log.Fatalf("Failed to fetch users: %v", err)
	}

	fmt.Printf("Found %d users to check\n", len(users))

	// Normalize emails to lowercase
	updated := 0
	for _, user := range users {
		normalizedEmail := strings.ToLower(strings.TrimSpace(user.Email))
		if user.Email != normalizedEmail {
			// Check if normalized email already exists (avoid duplicates)
			var existingUser db.User
			if err := database.Where("LOWER(email) = ?", normalizedEmail).First(&existingUser).Error; err == nil {
				if existingUser.ID != user.ID {
					log.Printf("WARNING: Email %s conflicts with existing user %d. Skipping user %d\n", normalizedEmail, existingUser.ID, user.ID)
					continue
				}
			}

			// Update user email to lowercase
			if err := database.Model(&user).Update("email", normalizedEmail).Error; err != nil {
				log.Printf("Failed to update user %d: %v\n", user.ID, err)
				continue
			}
			fmt.Printf("Updated user %d: %s -> %s\n", user.ID, user.Email, normalizedEmail)
			updated++
		}
	}

	fmt.Printf("Normalized %d user emails\n", updated)
}
