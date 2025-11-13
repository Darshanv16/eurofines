package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	// create handler instances if you prefer object style
	auth := &AuthHandler{}
	ti := &TestItemHandler{}
	st := &StudyHandler{}
	fd := &FacilityDocHandler{}

	api := r.Group("/api")

	// auth
	authGroup := api.Group("/auth")
	authGroup.POST("/signup", auth.SignUp)
	authGroup.POST("/signin", auth.SignIn)
	authGroup.GET("/me", auth.GetCurrentUser) // protect with auth middleware later

	// test items
	items := api.Group("/test-items")
	items.POST("", ti.CreateTestItem)
	items.GET("", ti.GetTestItems)
	items.GET("/:id", ti.GetTestItem)     // implement if you want
	items.PUT("/:id", ti.UpdateTestItem)  // implement
	items.DELETE("/:id", ti.DeleteTestItem) // implement

	// studies
	stud := api.Group("/studies")
	stud.POST("", st.CreateStudy)
	stud.GET("", st.GetStudies)

	// facility docs
	fdGroup := api.Group("/facility-docs")
	fdGroup.POST("", fd.CreateFacilityDoc)
	fdGroup.GET("", fd.GetFacilityDocs)
}
