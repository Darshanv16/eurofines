package routes

import (
	"net/http"
	"strconv"

	"eurofines-server/db"
	"eurofines-server/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type StudyHandler struct {
	DB *gorm.DB
}

func (h *StudyHandler) CreateStudy(c *gin.Context) {
	var study db.Study
	if err := c.ShouldBindJSON(&study); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user ID from context
	userID, _ := c.Get("user_id")
	userIDUint := userID.(uint)
	study.CreatedBy = &userIDUint

	if err := h.DB.Create(&study).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create study"})
		return
	}

	c.JSON(http.StatusCreated, study)
}

func (h *StudyHandler) GetStudies(c *gin.Context) {
	var studies []db.Study
	entity := c.Query("entity")

	query := h.DB
	if entity != "" {
		query = query.Where("entity = ?", entity)
	}

	if err := query.Find(&studies).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch studies"})
		return
	}

	c.JSON(http.StatusOK, studies)
}

func (h *StudyHandler) GetStudy(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var study db.Study
	if err := h.DB.First(&study, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Study not found"})
		return
	}

	c.JSON(http.StatusOK, study)
}

func (h *StudyHandler) UpdateStudy(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var study db.Study
	if err := h.DB.First(&study, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Study not found"})
		return
	}

	if err := c.ShouldBindJSON(&study); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Save(&study).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update study"})
		return
	}

	c.JSON(http.StatusOK, study)
}

func (h *StudyHandler) DeleteStudy(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.DB.Delete(&db.Study{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete study"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Study deleted successfully"})
}

func SetupStudyRoutes(r *gin.RouterGroup, db *gorm.DB) {
	handler := &StudyHandler{DB: db}

	studies := r.Group("/studies")
	studies.Use(middleware.AuthMiddleware())
	{
		studies.POST("", handler.CreateStudy)
		studies.GET("", handler.GetStudies)
		studies.GET("/:id", handler.GetStudy)
		studies.PUT("/:id", handler.UpdateStudy)
		studies.DELETE("/:id", middleware.AdminOnly(), handler.DeleteStudy)
	}
}

