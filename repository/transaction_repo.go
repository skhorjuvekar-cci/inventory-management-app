package repository

import (
	"inventory-system/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	CreateOneTransaction(transaction *models.Transaction) error
	GetAllTransaction() ([]models.Transaction, error)
	GetOneTransaction(id string) (models.Transaction, error)
	UpdateOneTransaction(transaction *models.Transaction) error
}

type transactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) TransactionRepository {
	return &transactionRepository{db: db}
}

func (repositoryObject *transactionRepository) CreateOneTransaction(transaction *models.Transaction) error {
	return repositoryObject.db.Create(transaction).Error
}

func (repositoryObject *transactionRepository) GetAllTransaction() ([]models.Transaction, error) {
	var list []models.Transaction
	var err = repositoryObject.db.Find(&list).Error
	return list, err
}

func (repositoryObject *transactionRepository) GetOneTransaction(id string) (models.Transaction, error) {
	var transaction models.Transaction
	var err = repositoryObject.db.First(&transaction, "transaction_id", id).Error
	return transaction, err
}

func (repositoryObject *transactionRepository) UpdateOneTransaction(transaction *models.Transaction) error {
	return repositoryObject.db.Save(&transaction).Error
}
