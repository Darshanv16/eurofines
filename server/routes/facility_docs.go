package routes

import (
	"net/http"
	"time"

	"eurofines-server/db"

	"github.com/gin-gonic/gin"
)

type FacilityDocHandler struct{}

type createFacilityReq struct {
	DeptSection    string  `json:"dept_section"`
	Date           *string `json:"date"`
	Particulars    string  `json:"particulars"`
	TotalNoOfPages *int    `json:"total_no_of_pages"`
	SubmittedBy    string  `json:"submitted_by"`
	Entity         string  `json:"entity" binding:"required,oneof=adgyl agro biopharma"`
	CreatedBy      *uint   `json:"created_by"`
}

func (h *FacilityDocHandler) CreateFacilityDoc(c *gin.Context) {
	var req createFacilityReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fd := db.FacilityDoc{
		DeptSection: req.DeptSection,
		Particulars: req.Particulars,
		TotalNoOfPages: req.TotalNoOfPages,
		SubmittedBy: req.SubmittedBy,
		Entity: req.Entity,
		CreatedBy: req.CreatedBy,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if req.Date != nil && *req.Date != "" {
		var d db.Date
		if err := d.UnmarshalJSON([]byte(`"` + *req.Date + `"`)); err == nil {
			fd.Date = &d
		}
	}

	if err := db.DB.Create(&fd).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"facility_doc": fd})
}

func (h *FacilityDocHandler) GetFacilityDocs(c *gin.Context) {
	var docs []db.FacilityDoc
	if err := db.DB.Order("created_at desc").Find(&docs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"facility_docs": docs})
}
