package services

import (
	"errors"
	"os"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"inventory-system/dto"
	"inventory-system/models"
	"inventory-system/repository"

	"github.com/golang-jwt/jwt/v5"
)

type AuthService interface {
	RegisterUser(request dto.SignupRequest) (*dto.SignupResponse, error)
	LoginUser(request dto.SignInRequest) (*dto.SignInData, error)
}

type authService struct {
	authRepository repository.AuthRepository
	database       *gorm.DB
}

func NewAuthService(authRepository repository.AuthRepository, database *gorm.DB) AuthService {
	return &authService{
		authRepository: authRepository,
		database:       database,
	}
}

// Hash password using bcrypt
func (s *authService) hashPassword(plainPassword string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(plainPassword), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedBytes), nil
}

func (s *authService) verifyPassword(plainPassword, hashedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
}

// RegisterUser implements user registration flow
func (s *authService) RegisterUser(request dto.SignupRequest) (*dto.SignupResponse, error) {
	// check existing user
	_, err := s.authRepository.GetUserByEmail(request.Email)
	if err == nil {
		// user already exists
		return &dto.SignupResponse{
			Data:    nil,
			Success: false,
			Message: "User with this email already exists",
		}, nil
	}
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	hashedPassword, err := s.hashPassword(request.Password)
	if err != nil {
		return nil, err
	}

	user := models.User{
		FirstName:      request.FirstName,
		LastName:       request.LastName,
		Email:          request.Email,
		HashedPassword: hashedPassword,
		IsActive:       true,
	}

	if err := s.authRepository.CreateUser(&user); err != nil {
		return nil, err
	}

	userData := map[string]interface{}{
		"id":         user.ID,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
		"email":      user.Email,
	}

	return &dto.SignupResponse{
		Data:    userData,
		Success: true,
		Message: "User registered successfully",
	}, nil
}

// LoginUser implements user login flow and token generation
func (s *authService) LoginUser(request dto.SignInRequest) (*dto.SignInData, error) {
	user, err := s.authRepository.GetUserByEmail(request.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid credentials")
		}
		return nil, err
	}

	if err := s.verifyPassword(request.Password, user.HashedPassword); err != nil {
		return nil, errors.New("invalid credentials")
	}

	// create access token
	accessExpiration := time.Now().Add(1 * time.Hour)
	accessClaims := jwt.MapClaims{
		"sub": user.Email,
		"id":  user.ID,
		"exp": accessExpiration.Unix(),
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	secretKey := os.Getenv("SECRET_KEY")
	if secretKey == "" {
		secretKey = "default-secret-key"
	}
	signedAccessToken, err := accessToken.SignedString([]byte(secretKey))
	if err != nil {
		return nil, err
	}

	// create refresh token
	refreshExpiration := time.Now().Add(7 * 24 * time.Hour)
	refreshClaims := jwt.MapClaims{
		"sub":  user.Email,
		"id":   user.ID,
		"type": "refresh",
		"exp":  refreshExpiration.Unix(),
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	signedRefreshToken, err := refreshToken.SignedString([]byte(secretKey))
	if err != nil {
		return nil, err
	}

	signInData := dto.SignInData{
		Token:        signedAccessToken,
		Expiration:   accessExpiration.Format(time.RFC3339) + "Z",
		RefreshToken: signedRefreshToken,
	}

	// ensure user is active
	if !user.IsActive {
		user.IsActive = true
		_ = s.authRepository.UpdateUser(&user) // ignore update error for login flow
	}

	return &signInData, nil
}
