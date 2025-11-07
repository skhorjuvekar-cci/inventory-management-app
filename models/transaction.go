package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Transaction struct {
	TransactionID string    `json:"transaction_id" gorm:"type:char(50);primaryKey"`
	ItemID        string    `json:"item_id" gorm:"type:char(50);not null"`
	Type          string    `json:"type" gorm:"type:varchar(20);not null"`
	Quantity      int       `json:"quantity" gorm:"not null"`
	TotalAmount   float64   `json:"total_amount" gorm:"not null"`
	Recipient     string    `json:"recipient" gorm:"size:100"`
	PerformedBy   string    `json:"performed_by" gorm:"size:50"`
	CreatedAt     time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt     time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

func (transaction *Transaction) BeforeCreate(tx *gorm.DB) (err error) {
	if transaction.Type == "" {
		return errors.New("Transaction Type cannot be empty")
	}
	if transaction.TransactionID == "" {
		transaction.TransactionID = uuid.New().String()
	}
	return nil
}
