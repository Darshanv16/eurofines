package db

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID        uint      `gorm:"primaryKey" json:"id"`
	Email     string    `gorm:"uniqueIndex;not null" json:"email"`
	Password  string    `gorm:"not null" json:"-"`
	Role      string    `gorm:"not null;check:role IN ('user', 'admin')" json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type TestItem struct {
	ID                  uint       `gorm:"primaryKey" json:"id"`
	TestItemName        string     `json:"test_item_name"`
	TestItemCode        string     `json:"test_item_code"`
	CompanyName         string     `json:"company_name"`
	DateOfReceipt       *time.Time `json:"date_of_receipt"`
	BatchNo             string     `json:"batch_no"`
	ArcNo               string     `json:"arc_no"`
	RackNo              string     `json:"rack_no"`
	IndexNo             string     `json:"index_no"`
	Storage             string     `json:"storage"`
	ExpiryDate          *time.Time `json:"expiry_date"`
	RetestDate          *time.Time `json:"retest_date"`
	Quantity            string     `json:"quantity"`
	DateOfArchive       *time.Time `json:"date_of_archive"`
	ArchivedBy          string     `json:"archived_by"`
	DisposedOrReturned  string     `json:"disposed_or_returned"`
	SponsorApprovalDate *time.Time `json:"sponsor_approval_date"`
	Remark              string     `gorm:"type:text" json:"remark"`
	Entity              string     `gorm:"not null;check:entity IN ('adgyl', 'agro', 'biopharma')" json:"entity"`
	CreatedBy           *uint      `json:"created_by"`
	Creator             *User      `gorm:"foreignKey:CreatedBy" json:"creator,omitempty"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at"`
}

type Study struct {
	ID                                       uint       `gorm:"primaryKey" json:"id"`
	StudyNumber                              string     `json:"study_number"`
	StudyCode                                string     `json:"study_code"`
	TestItemCode                             string     `json:"test_item_code"`
	SdOrPiName                               string     `json:"sd_or_pi_name"`
	StudyPlanPageNo                          string     `json:"study_plan_page_no"`
	StudyPlanAmendmentPages                  string     `json:"study_plan_amendment_pages"`
	DateOfReceipt                            *time.Time `json:"date_of_receipt"`
	RdIndex                                  string     `json:"rd_index"`
	FrIndex                                  string     `json:"fr_index"`
	BlockSlidesIndex                         string     `json:"block_slides_index"`
	TissuesIndex                             string     `json:"tissues_index"`
	CarcassIndex                             string     `json:"carcass_index"`
	RawDataCount                             int        `gorm:"default:0" json:"raw_data_count"`
	FinalOrTerminatedReport                  string     `json:"final_or_terminated_report"`
	AmendmentToFinalReport                   string     `json:"amendment_to_final_report"`
	Others                                   string     `json:"others"`
	ElectronicDataArchivedUsingArchiveSystem bool       `gorm:"default:false" json:"electronic_data_archived_using_archive_system"`
	ManuallyArchivingData                    bool       `gorm:"default:false" json:"manually_archiving_data"`
	ProvantisData                            bool       `gorm:"default:false" json:"provantis_data"`
	EmpowerData                              bool       `gorm:"default:false" json:"empower_data"`
	OtherElectronicIfAny                     bool       `gorm:"default:false" json:"other_electronic_if_any"`
	DetailsOfElectronicDataArchivedThrough   string     `json:"details_of_electronic_data_archived_through"`
	BlockSlidesNameBoxNo                     string     `json:"block_slides_name_box_no"`
	BlockSlidesNoOfBox                       string     `json:"block_slides_no_of_box"`
	TissueBoxNameBoxNo                       string     `json:"tissue_box_name_box_no"`
	TissueBoxNoOfBox                         string     `json:"tissue_box_no_of_box"`
	CarcassBoxNameBoxNo                      string     `json:"carcass_box_name_box_no"`
	CarcassBoxNoOfBox                        string     `json:"carcass_box_no_of_box"`
	StudyCompletionDate                      *time.Time `json:"study_completion_date"`
	Remarks                                  string     `gorm:"type:text" json:"remarks"`
	RawDataItems                             string     `gorm:"type:jsonb" json:"raw_data_items"`
	Entity                                   string     `gorm:"not null;check:entity IN ('adgyl', 'agro', 'biopharma')" json:"entity"`
	CreatedBy                                *uint      `json:"created_by"`
	Creator                                  *User      `gorm:"foreignKey:CreatedBy" json:"creator,omitempty"`
	CreatedAt                                time.Time  `json:"created_at"`
	UpdatedAt                                time.Time  `json:"updated_at"`
}

type FacilityDoc struct {
	ID                  uint       `gorm:"primaryKey" json:"id"`
	DeptSection         string     `json:"dept_section"`
	Date                *time.Time `json:"date"`
	Particulars         string     `json:"particulars"`
	TotalNoOfPages      *int       `json:"total_no_of_pages"`
	SubmittedBy         string     `json:"submitted_by"`
	AdminIndexNo        string     `json:"admin_index_no"`
	AdminDateOfReceipt  *time.Time `json:"admin_date_of_receipt"`
	AdminDateOfIndexing *time.Time `json:"admin_date_of_indexing"`
	AdminRemarks        string     `gorm:"type:text" json:"admin_remarks"`
	Entity              string     `gorm:"not null;check:entity IN ('adgyl', 'agro', 'biopharma')" json:"entity"`
	CreatedBy           *uint      `json:"created_by"`
	Creator             *User      `gorm:"foreignKey:CreatedBy" json:"creator,omitempty"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at"`
}
