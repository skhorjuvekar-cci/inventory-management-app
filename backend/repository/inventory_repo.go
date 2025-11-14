package repository

import (
	"inventory-system/models"

	"gorm.io/gorm"
)

type InventoryRepository interface {
	CreateOneInventory(inventory *models.Inventory) error
	GetAllInventories() ([]models.Inventory, error)
	GetOneInventory(id string) (models.Inventory, error)
	UpdateOneInventory(inventory *models.Inventory) error
	DeleteOneInventory(id string) error
}

type inventoryRepository struct {
	db *gorm.DB
}

func NewInventoryRepository(db *gorm.DB) InventoryRepository {
	return &inventoryRepository{db: db}
}

func (repositoryObject *inventoryRepository) CreateOneInventory(inventory *models.Inventory) error {
	return repositoryObject.db.Create(inventory).Error
}

func (repositoryObject *inventoryRepository) GetAllInventories() ([]models.Inventory, error) {
	var list []models.Inventory
	err := repositoryObject.db.Find(&list).Error
	return list, err
}

func (repositoryObject *inventoryRepository) GetOneInventory(id string) (models.Inventory, error) {
	var inventory models.Inventory
	err := repositoryObject.db.First(&inventory, "inventory_id", id).Error
	return inventory, err
}

func (repositoryObject *inventoryRepository) UpdateOneInventory(inventory *models.Inventory) error {
	return repositoryObject.db.Save(inventory).Error
}

func (repositoryObject *inventoryRepository) DeleteOneInventory(id string) error {
	return repositoryObject.db.Delete(&models.Inventory{}, "inventory_id=?", id).Error
}
