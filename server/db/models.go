package db

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

// Date is a custom type that handles date-only strings (YYYY-MM-DD)
// It can be used in JSON and GORM to parse date strings without time
type Date struct {
	t time.Time
}

// NewDate creates a new Date from a time.Time
func NewDate(t time.Time) Date {
	return Date{t: t}
}

// Time returns the underlying time.Time
func (d Date) Time() time.Time {
	return d.t
}

// IsZero returns true if the date is zero
func (d Date) IsZero() bool {
	return d.t.IsZero()
}

// UnmarshalJSON implements json.Unmarshaler interface
func (d *Date) UnmarshalJSON(b []byte) error {
	// Handle null
	if string(b) == "null" {
		d.t = time.Time{}
		return nil
	}
	
	// Remove quotes from JSON string
	s := strings.TrimSpace(strings.Trim(string(b), "\""))
	
	// Handle empty string
	if s == "" || s == "undefined" || s == "null" {
		d.t = time.Time{}
		return nil
	}
	
	// Try parsing as date-only format (YYYY-MM-DD) first
	parsed, err := time.Parse("2006-01-02", s)
	if err == nil {
		d.t = parsed
		return nil
	}
	
	// Try parsing as RFC3339 format as fallback
	parsed, err = time.Parse(time.RFC3339, s)
	if err == nil {
		d.t = parsed
		return nil
	}
	
	// Try parsing as RFC3339Nano format
	parsed, err = time.Parse(time.RFC3339Nano, s)
	if err == nil {
		d.t = parsed
		return nil
	}
	
	// Try parsing with timezone
	parsed, err = time.Parse("2006-01-02T15:04:05Z07:00", s)
	if err == nil {
		d.t = parsed
		return nil
	}
	
	return fmt.Errorf("invalid date format: %s, expected YYYY-MM-DD", s)
}

// MarshalJSON implements json.Marshaler interface
func (d Date) MarshalJSON() ([]byte, error) {
	if d.t.IsZero() {
		return []byte("null"), nil
	}
	return json.Marshal(d.t.Format("2006-01-02"))
}

// Value implements driver.Valuer interface for database
func (d Date) Value() (driver.Value, error) {
	if d.t.IsZero() {
		return nil, nil
	}
	return d.t, nil
}

// Scan implements sql.Scanner interface for database
func (d *Date) Scan(value interface{}) error {
	if value == nil {
		d.t = time.Time{}
		return nil
	}
	
	switch v := value.(type) {
	case time.Time:
		d.t = v
		return nil
	case []byte:
		// Try parsing as date string from database
		s := string(v)
		if s == "" {
			d.t = time.Time{}
			return nil
		}
		// Try different date formats
		layouts := []string{"2006-01-02", "2006-01-02T15:04:05Z07:00", time.RFC3339, time.RFC3339Nano}
		for _, layout := range layouts {
			if parsed, err := time.Parse(layout, s); err == nil {
				d.t = parsed
				return nil
			}
		}
		return fmt.Errorf("cannot parse date from database: %s", s)
	case string:
		if v == "" {
			d.t = time.Time{}
			return nil
		}
		// Try different date formats
		layouts := []string{"2006-01-02", "2006-01-02T15:04:05Z07:00", time.RFC3339, time.RFC3339Nano}
		for _, layout := range layouts {
			if parsed, err := time.Parse(layout, v); err == nil {
				d.t = parsed
				return nil
			}
		}
		return fmt.Errorf("cannot parse date from database: %s", v)
	default:
		return fmt.Errorf("cannot scan %T into Date", value)
	}
}

type User struct {
    ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
    Email     string    `gorm:"uniqueIndex;not null" json:"email"`
    Password  string    `gorm:"not null" json:"-"`
    Role      string    `gorm:"not null;type:VARCHAR(20);check:role IN ('user','admin')" json:"role"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}


type TestItem struct {
	ID                  uint       `gorm:"primaryKey" json:"id"`
	TestItemName        string     `json:"test_item_name"`
	TestItemCode        string     `json:"test_item_code"`
	CompanyName         string     `json:"company_name"`
	DateOfReceipt       *Date      `json:"date_of_receipt"`
	BatchNo             string     `json:"batch_no"`
	ArcNo               string     `json:"arc_no"`
	RackNo              string     `json:"rack_no"`
	IndexNo             string     `json:"index_no"`
	Storage             string     `json:"storage"`
	ExpiryDate          *Date      `json:"expiry_date"`
	RetestDate          *Date      `json:"retest_date"`
	Quantity            string     `json:"quantity"`
	DateOfArchive       *Date      `json:"date_of_archive"`
	ArchivedBy          string     `json:"archived_by"`
	DisposedOrReturned  string     `json:"disposed_or_returned"`
	SponsorApprovalDate *Date      `json:"sponsor_approval_date"`
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
	DateOfReceipt                            *Date      `json:"date_of_receipt"`
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
	StudyCompletionDate                      *Date      `json:"study_completion_date"`
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
	Date                *Date      `json:"date"`
	Particulars         string     `json:"particulars"`
	TotalNoOfPages      *int       `json:"total_no_of_pages"`
	SubmittedBy         string     `json:"submitted_by"`
	AdminIndexNo        string     `json:"admin_index_no"`
	AdminDateOfReceipt  *Date      `json:"admin_date_of_receipt"`
	AdminDateOfIndexing *Date      `json:"admin_date_of_indexing"`
	AdminRemarks        string     `gorm:"type:text" json:"admin_remarks"`
	Entity              string     `gorm:"not null;check:entity IN ('adgyl', 'agro', 'biopharma')" json:"entity"`
	CreatedBy           *uint      `json:"created_by"`
	Creator             *User      `gorm:"foreignKey:CreatedBy" json:"creator,omitempty"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at"`
}
