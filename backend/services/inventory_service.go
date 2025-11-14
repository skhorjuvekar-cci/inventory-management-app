package services

import (
	"errors"
	"inventory-system/dto"
	"inventory-system/models"
	"inventory-system/repository"
)

type InventoryService interface {
	CreateOneInventory(request dto.InventoryCreateRequest) (models.Inventory, error)
	GetAllInventories() ([]models.Inventory, error)
	GetOneInventory(id string) (models.Inventory, error)
	UpdateOneInventory(id string, req dto.InventoryUpdateRequest) (models.Inventory, error)
	DeleteOneInventory(id string) error
}

type inventoryService struct {
	inventoryRepository repository.InventoryRepository
}

func NewInventoryService(inventoryRepository repository.InventoryRepository) InventoryService {
	return &inventoryService{inventoryRepository: inventoryRepository}
}

func (serviceObject *inventoryService) CreateOneInventory(request dto.InventoryCreateRequest) (models.Inventory, error) {
	inventory := models.Inventory{
		ItemName:     request.ItemName,
		Quantity:     request.Quantity,
		PricePerItem: request.PricePerItem,
		TotalPrice:   float64(request.Quantity) * request.PricePerItem,
	}

	if err := serviceObject.inventoryRepository.CreateOneInventory(&inventory); err != nil {
		return inventory, err
	}
	return inventory, nil
}

func (serviceObject *inventoryService) GetAllInventories() ([]models.Inventory, error) {
	return serviceObject.inventoryRepository.GetAllInventories()
}

func (serviceObject *inventoryService) GetOneInventory(id string) (models.Inventory, error) {
	return serviceObject.inventoryRepository.GetOneInventory(id)
}

func (serviceObject *inventoryService) UpdateOneInventory(id string, request dto.InventoryUpdateRequest) (models.Inventory, error) {
	inventory, err := serviceObject.inventoryRepository.GetOneInventory(id)
	if err != nil {
		return inventory, err
	}

	if request.ItemName != nil {
		inventory.ItemName = *request.ItemName
	}
	if request.Quantity != nil {
		inventory.Quantity = *request.Quantity
	}
	if request.PricePerItem != nil {
		inventory.PricePerItem = *request.PricePerItem
	}

	inventory.TotalPrice = float64(inventory.Quantity) * inventory.PricePerItem

	if err := serviceObject.inventoryRepository.UpdateOneInventory(&inventory); err != nil {
		return inventory, err
	}
	return inventory, nil
}

func (serviceObject *inventoryService) DeleteOneInventory(id string) error {
	_, err := serviceObject.inventoryRepository.GetOneInventory(id)
	if err != nil {
		return errors.New("inventory not found")
	}
	return serviceObject.inventoryRepository.DeleteOneInventory(id)
}
