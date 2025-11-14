package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"inventory-system/dto"
	"inventory-system/services"
	"inventory-system/utils"

	"github.com/go-playground/validator/v10"
)

// AuthHandler handles authentication-related requests
type AuthHandler struct {
	authService services.AuthService
	validator   *validator.Validate
}

// NewAuthHandler creates a new instance of AuthHandler
func NewAuthHandler(authService services.AuthService) *AuthHandler {
	v := validator.New()

	// Register custom password validation (no regex lookahead)
	v.RegisterValidation("password", func(fl validator.FieldLevel) bool {
		password := fl.Field().String()
		if len(password) < 8 {
			return false
		}

		hasUpper := false
		hasLower := false
		hasNumber := false
		hasSpecial := false

		for _, ch := range password {
			switch {
			case ch >= 'A' && ch <= 'Z':
				hasUpper = true
			case ch >= 'a' && ch <= 'z':
				hasLower = true
			case ch >= '0' && ch <= '9':
				hasNumber = true
			case strings.ContainsRune("!@#$%^&*()_+{}[]:;<>,.?/~-", ch):
				hasSpecial = true
			}
		}

		return hasUpper && hasLower && hasNumber && hasSpecial
	})

	return &AuthHandler{
		authService: authService,
		validator:   v,
	}
}

// Signup endpoint
// @Summary Register a new user
// @Description Create a new user account with the provided details
// @Tags Auth
// @Accept  json
// @Produce  json
// @Param request body dto.SignupRequest true "Signup Request"
// @Success 201 {object} dto.GlobalResponse
// @Failure 400 {object} dto.GlobalResponse
// @Failure 500 {object} dto.GlobalResponse
// @Router /auth/signup [post]
func (handlerObject *AuthHandler) Signup(w http.ResponseWriter, r *http.Request) {
	var request dto.SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "Invalid payload", Success: false, Errors: err.Error()})
		return
	}

	if err := handlerObject.validator.Struct(request); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "Validation failed", Success: false, Errors: err.Error()})
		return
	}

	response, err := handlerObject.authService.RegisterUser(request)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "Registration failed", Success: false, Errors: err.Error()})
		return
	}

	if !response.Success {
		utils.WriteJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "Registration failed", Success: false, Data: response.Data})
		return
	}

	utils.WriteJSON(w, http.StatusCreated, dto.GlobalResponse{Message: "Created", Success: true, Data: response.Data})
}

// Signin endpoint
// @Summary Login an existing user
// @Description Authenticate user credentials and return a JWT token
// @Tags Auth
// @Accept  json
// @Produce  json
// @Param request body dto.SignInRequest true "SignIn Request"
// @Success 200 {object} dto.GlobalResponse
// @Failure 400 {object} dto.GlobalResponse
// @Failure 401 {object} dto.GlobalResponse
// @Router /auth/signin [post]
func (handlerObject *AuthHandler) Signin(w http.ResponseWriter, r *http.Request) {
	var request dto.SignInRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "Invalid payload", Success: false, Errors: err.Error()})
		return
	}

	if err := handlerObject.validator.Struct(request); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "Validation failed", Success: false, Errors: err.Error()})
		return
	}

	signInData, err := handlerObject.authService.LoginUser(request)
	if err != nil {
		utils.WriteJSON(w, http.StatusUnauthorized, dto.GlobalResponse{Message: "Invalid credentials", Success: false, Errors: err.Error()})
		return
	}

	utils.WriteJSON(w, http.StatusOK, dto.GlobalResponse{Message: "Login successful", Success: true, Data: signInData})
}
