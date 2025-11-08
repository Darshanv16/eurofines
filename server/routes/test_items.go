package routes

import (
	"net/http"
	"strconv"

	"eurofines-server/db"
	"eurofines-server/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TestItemHandler struct {
	DB *gorm.DB
}

func (h *TestItemHandler) CreateTestItem(c *gin.Context) {
	var testItem db.TestItem
	if err := c.ShouldBindJSON(&testItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user ID from context
	userID, _ := c.Get("user_id")
	userIDUint := userID.(uint)
	testItem.CreatedBy = &userIDUint

	if err := h.DB.Create(&testItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create test item"})
		return
	}

	c.JSON(http.StatusCreated, testItem)
}

func (h *TestItemHandler) GetTestItems(c *gin.Context) {
	var testItems []db.TestItem
	entity := c.Query("entity")

	query := h.DB
	if entity != "" {
		query = query.Where("entity = ?", entity)
	}

	if err := query.Find(&testItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch test items"})
		return
	}

	c.JSON(http.StatusOK, testItems)
}

func (h *TestItemHandler) GetTestItem(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var testItem db.TestItem
	if err := h.DB.First(&testItem, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Test item not found"})
		return
	}

	c.JSON(http.StatusOK, testItem)
}

func (h *TestItemHandler) UpdateTestItem(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var testItem db.TestItem
	if err := h.DB.First(&testItem, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Test item not found"})
		return
	}

	if err := c.ShouldBindJSON(&testItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.DB.Save(&testItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update test item"})
		return
	}

	c.JSON(http.StatusOK, testItem)
}

func (h *TestItemHandler) DeleteTestItem(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.DB.Delete(&db.TestItem{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete test item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Test item deleted successfully"})
}

func SetupTestItemRoutes(r *gin.RouterGroup, db *gorm.DB) {
	handler := &TestItemHandler{DB: db}

	testItems := r.Group("/test-items")
	testItems.Use(middleware.AuthMiddleware())
	{
		testItems.POST("", handler.CreateTestItem)
		testItems.GET("", handler.GetTestItems)
		testItems.GET("/:id", handler.GetTestItem)
		testItems.PUT("/:id", handler.UpdateTestItem)
		testItems.DELETE("/:id", middleware.AdminOnly(), handler.DeleteTestItem)
	}
}

