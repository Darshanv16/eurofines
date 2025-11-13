package routes

import (
	"net/http"
	"time"

	"eurofines-server/db"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type signupReq struct {
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
	Role      string `json:"role" binding:"required,oneof=user admin"`
	FullName  string `json:"full_name"`
}

// SignUp creates a new user (password hashed)
func (h *AuthHandler) SignUp(c *gin.Context) {
	var req signupReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// hash password
	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":"failed to hash password"})
		return
	}

	user := db.User{
		Email: req.Email,
		Password: string(hashed),
		Role: req.Role,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := db.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// hide password
	user.Password = ""
	c.JSON(http.StatusCreated, gin.H{"user": user})
}

type signinReq struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// SignIn verifies credentials and returns user info (or token if you implement JWT)
func (h *AuthHandler) SignIn(c *gin.Context) {
	var req signinReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user db.User
	if err := db.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error":"invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error":"invalid credentials"})
		return
	}

	// if you have JWT: create token here and return it
	user.Password = ""
	c.JSON(http.StatusOK, gin.H{"user": user})
}

// GetCurrentUser returns the current user (stub — replace with auth middleware)
func (h *AuthHandler) GetCurrentUser(c *gin.Context) {
	// If you use middleware to set userID in context, read it here.
	// For now, return a sample or require created_by in body.
	c.JSON(http.StatusOK, gin.H{"message": "implement auth middleware to return current user"})
}

// optional: handler struct (not strictly necessary but consistent)
type AuthHandler struct{}
