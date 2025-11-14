package repository

import (
	"inventory-system/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	GetAllUsers() ([]models.User, error)
	GetUserByID(userID string) (models.User, error)
	CreateUser(user *models.User) error
	UpdateUser(user *models.User) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (repo *userRepository) GetAllUsers() ([]models.User, error) {
	var users []models.User
	err := repo.db.Find(&users).Error
	return users, err
}

func (repo *userRepository) GetUserByID(userID string) (models.User, error) {
	var user models.User
	err := repo.db.Where("id = ?", userID).First(&user).Error
	return user, err
}

func (repo *userRepository) CreateUser(user *models.User) error {
	return repo.db.Create(user).Error
}

func (repo *userRepository) UpdateUser(user *models.User) error {
	return repo.db.Save(user).Error
}
