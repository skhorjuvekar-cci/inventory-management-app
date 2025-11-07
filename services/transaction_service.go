package services

import (
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

	inventory, err := serviceObject.inventoryRepository.GetOneInventory(request.ItemID)
	if err != nil {
		return models.Transaction{}, err
	}
	totalAmount := float64(request.Quantity) * inventory.PricePerItem

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
	return transaction, err

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
