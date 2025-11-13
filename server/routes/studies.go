package routes

import (
	"net/http"
	"time"

	"eurofines-server/db"

	"github.com/gin-gonic/gin"
)

type StudyHandler struct{}

type createStudyReq struct {
	StudyNumber   string  `json:"study_number" binding:"required"`
	StudyCode     string  `json:"study_code"`
	TestItemCode  string  `json:"test_item_code"`
	SdOrPiName    string  `json:"sd_or_pi_name"`
	DateOfReceipt *string `json:"date_of_receipt"`
	Entity        string  `json:"entity" binding:"required,oneof=adgyl agro biopharma"`
	CreatedBy     *uint   `json:"created_by"`
}

func (h *StudyHandler) CreateStudy(c *gin.Context) {
	var req createStudyReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	st := db.Study{
		StudyNumber: req.StudyNumber,
		StudyCode:   req.StudyCode,
		TestItemCode: req.TestItemCode,
		SdOrPiName: req.SdOrPiName,
		Entity: req.Entity,
		CreatedBy: req.CreatedBy,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if req.DateOfReceipt != nil && *req.DateOfReceipt != "" {
		var d db.Date
		if err := d.UnmarshalJSON([]byte(`"` + *req.DateOfReceipt + `"`)); err == nil {
			st.DateOfReceipt = &d
		}
	}

	if err := db.DB.Create(&st).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"study": st})
}

func (h *StudyHandler) GetStudies(c *gin.Context) {
	var list []db.Study
	if err := db.DB.Order("created_at desc").Find(&list).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"studies": list})
}
