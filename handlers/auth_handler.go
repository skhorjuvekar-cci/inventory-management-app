package handlers

import (
	"encoding/json"
	"net/http"

	"inventory-system/dto"
	"inventory-system/services"
	"inventory-system/utils"

	"github.com/go-playground/validator/v10"
)

type AuthHandler struct {
	authService services.AuthService
	validator   *validator.Validate
}

func NewAuthHandler(authService services.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		validator:   validator.New(),
	}
}

// Signup endpoint
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
