package routes

import (
	"net/http"
	"strconv"
	"time"

	"eurofines-server/db"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// TestItemHandler owns test-item handlers
type TestItemHandler struct{}

// Request shape for creating/updating
type createTestItemReq struct {
	TestItemName  string  `json:"test_item_name" binding:"required"`
	TestItemCode  string  `json:"test_item_code"`
	CompanyName   string  `json:"company_name"`
	DateOfReceipt *string `json:"date_of_receipt"`
	BatchNo       string  `json:"batch_no"`
	Storage       string  `json:"storage"`
	ExpiryDate    *string `json:"expiry_date"`
	Remark        string  `json:"remark"`
	Entity        string  `json:"entity" binding:"required,oneof=adgyl agro biopharma"`
	CreatedBy     *uint   `json:"created_by"`
}

// CreateTestItem handles POST /api/test-items
func (h *TestItemHandler) CreateTestItem(c *gin.Context) {
	var req createTestItemReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ti := db.TestItem{
		TestItemName: req.TestItemName,
		TestItemCode: req.TestItemCode,
		CompanyName:  req.CompanyName,
		BatchNo:      req.BatchNo,
		Storage:      req.Storage,
		Remark:       req.Remark,
		Entity:       req.Entity,
		CreatedBy:    req.CreatedBy,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	// parse dates into db.Date if provided
	if req.DateOfReceipt != nil && *req.DateOfReceipt != "" {
		var d db.Date
		if err := d.UnmarshalJSON([]byte(`"` + *req.DateOfReceipt + `"`)); err == nil {
			ti.DateOfReceipt = &d
		}
	}
	if req.ExpiryDate != nil && *req.ExpiryDate != "" {
		var d db.Date
		if err := d.UnmarshalJSON([]byte(`"` + *req.ExpiryDate + `"`)); err == nil {
			ti.ExpiryDate = &d
		}
	}

	if err := db.DB.Create(&ti).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"test_item": ti})
}

// GetTestItems handles GET /api/test-items
func (h *TestItemHandler) GetTestItems(c *gin.Context) {
	var items []db.TestItem
	if err := db.DB.Order("created_at desc").Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"test_items": items})
}

// GetTestItem handles GET /api/test-items/:id
func (h *TestItemHandler) GetTestItem(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var item db.TestItem
	if err := db.DB.First(&item, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "test item not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"test_item": item})
}

// UpdateTestItem handles PUT /api/test-items/:id
func (h *TestItemHandler) UpdateTestItem(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var existing db.TestItem
	if err := db.DB.First(&existing, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "test item not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Flexible partial update payload
	var req struct {
		TestItemName  *string `json:"test_item_name"`
		TestItemCode  *string `json:"test_item_code"`
		CompanyName   *string `json:"company_name"`
		DateOfReceipt *string `json:"date_of_receipt"`
		BatchNo       *string `json:"batch_no"`
		Storage       *string `json:"storage"`
		ExpiryDate    *string `json:"expiry_date"`
		Remark        *string `json:"remark"`
		Entity        *string `json:"entity"`
		CreatedBy     *uint   `json:"created_by"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{}

	if req.TestItemName != nil {
		updates["test_item_name"] = *req.TestItemName
	}
	if req.TestItemCode != nil {
		updates["test_item_code"] = *req.TestItemCode
	}
	if req.CompanyName != nil {
		updates["company_name"] = *req.CompanyName
	}
	if req.BatchNo != nil {
		updates["batch_no"] = *req.BatchNo
	}
	if req.Storage != nil {
		updates["storage"] = *req.Storage
	}
	if req.Remark != nil {
		updates["remark"] = *req.Remark
	}
	if req.Entity != nil {
		updates["entity"] = *req.Entity
	}
	if req.CreatedBy != nil {
		updates["created_by"] = req.CreatedBy
	}

	// handle date strings
	if req.DateOfReceipt != nil && *req.DateOfReceipt != "" {
		var d db.Date
		if err := d.UnmarshalJSON([]byte(`"` + *req.DateOfReceipt + `"`)); err == nil {
			updates["date_of_receipt"] = &d
		}
	}
	if req.ExpiryDate != nil && *req.ExpiryDate != "" {
		var d db.Date
		if err := d.UnmarshalJSON([]byte(`"` + *req.ExpiryDate + `"`)); err == nil {
			updates["expiry_date"] = &d
		}
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no fields to update"})
		return
	}

	if err := db.DB.Model(&existing).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// return updated record
	if err := db.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"test_item": existing})
}

// DeleteTestItem handles DELETE /api/test-items/:id
func (h *TestItemHandler) DeleteTestItem(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var item db.TestItem
	if err := db.DB.First(&item, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "test item not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := db.DB.Delete(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
