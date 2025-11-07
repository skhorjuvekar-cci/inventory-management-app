package dto

import "time"

type InventoryCreateRequest struct {
	ItemName     string  `json:"item_name" validate:"required,min=2,max=100"`
	Quantity     int     `json:"quantity" validate:"required,min=0"`
	PricePerItem float64 `json:"price_per_item" validate:"required,gt=0"`
}

type InventoryUpdateRequest struct {
	ItemName     *string  `json:"item_name" validate:"omitempty,min=2,max=100"`
	Quantity     *int     `json:"quantity" validate:"omitempty,min=0"`
	PricePerItem *float64 `json:"price_per_item" validate:"omitempty,gt=0"`
}

type InventoryResponse struct {
	InventoryId  string    `json:"inventory_id"`
	ItemName     string    `json:"item_name"`
	Quantity     int       `json:"quantity"`
	PricePerItem float64   `json:"price_per_item"`
	TotalPrice   float64   `json:"total_price"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
