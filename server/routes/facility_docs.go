package routes

import (
	"net/http"
	"strconv"

	"eurofines-server/db"
	"eurofines-server/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type FacilityDocHandler struct {
	DB *gorm.DB
}

func (h *FacilityDocHandler) CreateFacilityDoc(c *gin.Context) {
	var facilityDoc db.FacilityDoc
	if err := c.ShouldBindJSON(&facilityDoc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user ID from context
	userID, _ := c.Get("user_id")
	userIDUint := userID.(uint)
	facilityDoc.CreatedBy = &userIDUint

	if err := h.DB.Create(&facilityDoc).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create facility doc"})
		return
	}

	c.JSON(http.StatusCreated, facilityDoc)
}

func (h *FacilityDocHandler) GetFacilityDocs(c *gin.Context) {
	var facilityDocs []db.FacilityDoc
	entity := c.Query("entity")

	query := h.DB
	if entity != "" {
		query = query.Where("entity = ?", entity)
	}

	if err := query.Find(&facilityDocs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch facility docs"})
		return
	}

	c.JSON(http.StatusOK, facilityDocs)
}

func (h *FacilityDocHandler) GetFacilityDoc(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var facilityDoc db.FacilityDoc
	if err := h.DB.First(&facilityDoc, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Facility doc not found"})
		return
	}

	c.JSON(http.StatusOK, facilityDoc)
}

func (h *FacilityDocHandler) UpdateFacilityDoc(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var facilityDoc db.FacilityDoc
	if err := h.DB.First(&facilityDoc, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Facility doc not found"})
		return
	}

	if err := c.ShouldBindJSON(&facilityDoc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Save(&facilityDoc).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update facility doc"})
		return
	}

	c.JSON(http.StatusOK, facilityDoc)
}

func (h *FacilityDocHandler) DeleteFacilityDoc(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.DB.Delete(&db.FacilityDoc{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete facility doc"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Facility doc deleted successfully"})
}

func SetupFacilityDocRoutes(r *gin.RouterGroup, db *gorm.DB) {
	handler := &FacilityDocHandler{DB: db}

	facilityDocs := r.Group("/facility-docs")
	facilityDocs.Use(middleware.AuthMiddleware())
	{
		facilityDocs.POST("", handler.CreateFacilityDoc)
		facilityDocs.GET("", handler.GetFacilityDocs)
		facilityDocs.GET("/:id", handler.GetFacilityDoc)
		facilityDocs.PUT("/:id", handler.UpdateFacilityDoc)
		facilityDocs.DELETE("/:id", middleware.AdminOnly(), handler.DeleteFacilityDoc)
	}
}

