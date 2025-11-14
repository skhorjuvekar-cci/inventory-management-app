package services

import (
	"errors"
	"inventory-system/dto"
	"inventory-system/models"
	"inventory-system/repository"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService interface {
	GetAllUsers() ([]models.User, error)
	GetUserByID(userID string) (models.User, error)
	CreateUser(request dto.AdminCreateUserRequest) (*dto.AdminUserResponse, error)
	UpdateUser(userID string, request dto.AdminUpdateUserRequest) (*dto.AdminUserResponse, error)
}

type userService struct {
	userRepository repository.UserRepository
	db             *gorm.DB
}

func NewUserService(userRepository repository.UserRepository, db *gorm.DB) UserService {
	return &userService{userRepository: userRepository, db: db}
}

// Utility for password hashing
func (s *userService) hashPassword(plainPassword string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(plainPassword), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedBytes), nil
}

func (s *userService) GetAllUsers() ([]models.User, error) {
	return s.userRepository.GetAllUsers()
}

func (s *userService) GetUserByID(userID string) (models.User, error) {
	return s.userRepository.GetUserByID(userID)
}

func (s *userService) CreateUser(request dto.AdminCreateUserRequest) (*dto.AdminUserResponse, error) {
	hashedPassword, err := s.hashPassword(request.Password)
	if err != nil {
		return nil, err
	}

	newUser := models.User{
		FirstName:      request.FirstName,
		LastName:       request.LastName,
		Email:          request.Email,
		Role:           request.Role,
		HashedPassword: hashedPassword,
		IsActive:       true,
	}

	if err := s.userRepository.CreateUser(&newUser); err != nil {
		return nil, err
	}

	response := dto.AdminUserResponse{
		ID:        newUser.ID,
		FirstName: newUser.FirstName,
		LastName:  newUser.LastName,
		Email:     newUser.Email,
		Role:      newUser.Role,
		IsActive:  newUser.IsActive,
	}
	return &response, nil
}

func (s *userService) UpdateUser(userID string, request dto.AdminUpdateUserRequest) (*dto.AdminUserResponse, error) {
	user, err := s.userRepository.GetUserByID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}
	if request.FirstName != "" {
		user.FirstName = request.FirstName
	}
	if request.LastName != "" {
		user.LastName = request.LastName
	}
	if request.Email != "" {
		user.Email = request.Email
	}

	if request.Role != "" {
		user.Role = request.Role
	}
	if request.IsActive != nil {
		user.IsActive = *request.IsActive
	}

	if err := s.userRepository.UpdateUser(&user); err != nil {
		return nil, err
	}

	response := dto.AdminUserResponse{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
		Role:      user.Role,
		IsActive:  user.IsActive,
	}
	return &response, nil
}
