package dto

import "time"

type TransactionCreateRequest struct {
	ItemID      string `json:"item_id" validate:"required,uuid4" `
	Type        string `json:"type" validate:"required,oneof=sold given added"`
	Quantity    int    `json:"quantity" validate:"required,gt=0"`
	Recipient   string `json:"recipient" validate:"required,min=2,max=100"`
	PerformedBy string `json:"performed_by" validate:"required,min=2,max=100"`
}

type TransactionUpdateRequest struct {
	Type        string  `json:"type" validate:"omitempty,oneof=sold given added"`
	Quantity    *int    `json:"quantity" validate:"omitempty,gt=0"`
	Recipient   *string `json:"recipient" validate:"omitempty,min=2,max=100"`
	PerformedBy *string `json:"performed_by" validate:"omitempty,min=2,max=100"`
}

type TransactionResponse struct {
	TransactionID string    `json:"transaction_id" `
	ItemID        string    `json:"item_id" `
	Type          string    `json:"type" `
	Quantity      int       `json:"quantity" `
	TotalAmount   float64   `json:"total_amount" `
	Recipient     string    `json:"recipient" `
	PerformedBy   string    `json:"performed_by" `
	CreatedAt     time.Time `json:"created_at" `
	UpdatedAt     time.Time `json:"updated_at" `
}
