package models

import "time"

type Inventory struct {
	InventoryId  string    `json:"inventory_id" gorm:"primaryKey"`
	ItemName     string    `json:"item_name"`
	Quantity     int       `json:"quantity"`
	PricePerItem float64   `json:"price_per_item"`
	TotalPrice   float64   `json:"total_price"`
	UpdatedAt    time.Time `json:"updated_at"`
}
