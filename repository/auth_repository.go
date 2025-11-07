package repository

import (
	"inventory-system/models"

	"gorm.io/gorm"
)

type AuthRepository interface {
	CreateUser(user *models.User) error
	GetUserByEmail(email string) (models.User, error)
	GetUserByID(userID string) (models.User, error)
	UpdateUser(user *models.User) error
}

type authRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) AuthRepository {
	return &authRepository{db: db}
}

func (repo *authRepository) CreateUser(user *models.User) error {
	return repo.db.Create(user).Error
}

func (repo *authRepository) GetUserByEmail(email string) (models.User, error) {
	var user models.User
	err := repo.db.Where("email = ?", email).First(&user).Error
	return user, err
}

func (repo *authRepository) GetUserByID(userID string) (models.User, error) {
	var user models.User
	err := repo.db.Where("id = ?", userID).First(&user).Error
	return user, err
}

func (repo *authRepository) UpdateUser(user *models.User) error {
	return repo.db.Save(user).Error
}
