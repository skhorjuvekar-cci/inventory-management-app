package services

import (
	"fmt"
	"inventory-system/dto"
	"inventory-system/models"
	"inventory-system/repository"
)

type TransactionService interface {
	CreateOneTransaction(request dto.TransactionCreateRequest) (models.Transaction, error)
	GetAllTransaction() ([]models.Transaction, error)
	GetOneTransaction(id string) (models.Transaction, error)
	UpdateOneTransaction(id string, request dto.TransactionUpdateRequest) (models.Transaction, error)
}

type transactionService struct {
	transactionRepository repository.TransactionRepository
	inventoryRepository   repository.InventoryRepository
}

func NewTransactionService(transactionRepository repository.TransactionRepository, inventoryRepository repository.InventoryRepository) TransactionService {
	return &transactionService{
		transactionRepository: transactionRepository,
		inventoryRepository:   inventoryRepository,
	}

}

func (serviceObject *transactionService) CreateOneTransaction(
	request dto.TransactionCreateRequest,
) (models.Transaction, error) {

	// Step 1: Fetch inventory record for the item
	inventory, err := serviceObject.inventoryRepository.GetOneInventory(request.ItemID)
	if err != nil {
		return models.Transaction{}, err
	}

	// Step 2: Calculate total transaction amount
	totalAmount := float64(request.Quantity) * inventory.PricePerItem

	// Step 3: Business logic — adjust available quantity & balance based on transaction type
	// Step 3: Business logic — adjust available quantity & balance based on transaction type
	switch request.Type {
	case "sold", "given":

		if inventory.AvailableQty < request.Quantity {
			return models.Transaction{}, fmt.Errorf("insufficient stock for item: %s", inventory.ItemName)
		}
		inventory.AvailableQty -= request.Quantity
		inventory.BalanceAmount -= totalAmount

	case "added":
		inventory.AvailableQty += request.Quantity
		inventory.BalanceAmount += totalAmount

	default:
		return models.Transaction{}, fmt.Errorf("invalid transaction type: %s", request.Type)
	}

	// Prevent negative balances (extra safety)
	if inventory.AvailableQty < 0 {
		inventory.AvailableQty = 0
	}
	if inventory.BalanceAmount < 0 {
		inventory.BalanceAmount = 0
	}

	// Step 4: Update inventory in the database
	if err := serviceObject.inventoryRepository.UpdateOneInventory(&inventory); err != nil {
		return models.Transaction{}, err
	}

	// Step 5: Create and save transaction record
	transaction := models.Transaction{
		ItemID:      request.ItemID,
		Type:        request.Type,
		Quantity:    request.Quantity,
		Recipient:   request.Recipient,
		PerformedBy: request.PerformedBy,
		TotalAmount: totalAmount,
	}

	if err := serviceObject.transactionRepository.CreateOneTransaction(&transaction); err != nil {
		return models.Transaction{}, err
	}

	return transaction, nil
}

func (serviceObject *transactionService) GetAllTransaction() ([]models.Transaction, error) {
	return serviceObject.transactionRepository.GetAllTransaction()
}

func (serviceObject *transactionService) GetOneTransaction(id string) (models.Transaction, error) {
	return serviceObject.transactionRepository.GetOneTransaction(id)
}

func (serviceObject *transactionService) UpdateOneTransaction(id string, request dto.TransactionUpdateRequest) (models.Transaction, error) {
	transaction, err := serviceObject.transactionRepository.GetOneTransaction(id)
	if err != nil {
		return transaction, err
	}

	if request.Type != "" {
		transaction.Type = request.Type
	}
	if request.Quantity != nil {
		transaction.Quantity = *request.Quantity

		inventory, err := serviceObject.inventoryRepository.GetOneInventory(transaction.ItemID)
		if err != nil {
			return models.Transaction{}, err

		}
		transaction.TotalAmount = float64(*request.Quantity) * inventory.PricePerItem

	}
	if request.Recipient != nil {
		transaction.Recipient = *request.Recipient
	}
	if request.PerformedBy != nil {
		transaction.PerformedBy = *request.PerformedBy
	}

	if err := serviceObject.transactionRepository.UpdateOneTransaction(&transaction); err != nil {
		return transaction, err
	}
	return transaction, nil
}
