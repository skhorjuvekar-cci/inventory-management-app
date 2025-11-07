package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Inventory struct {
	InventoryId  string    `json:"inventory_id" gorm:"type:char(50);primaryKey"`
	ItemName     string    `json:"item_name" gorm:"not null;size:100" `
	Quantity     int       `json:"quantity" gorm:"not null"`
	PricePerItem float64   `json:"price_per_item" gorm:"not null"`
	TotalPrice   float64   `json:"total_price" gorm:"not null"`
	UpdatedAt    time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (inventory *Inventory) BeforeCreate(tx *gorm.DB) (err error) {
	if inventory.ItemName == "" {
		return errors.New("item name cannot be empty")
	}
	if inventory.InventoryId == "" {
		inventory.InventoryId = uuid.New().String()
	}
	return nil
}
