package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"

	"inventory-system/dto"
	"inventory-system/services"
	"inventory-system/utils"
)

// UserHandler handles admin-related user management actions
type UserHandler struct {
	userService services.UserService
	validator   *validator.Validate
}

// NewUserHandler creates a new instance of UserHandler
func NewUserHandler(userService services.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
		validator:   validator.New(),
	}
}

// GetAllUsers endpoint
// @Summary Get all users
// @Description Retrieve a list of all registered users (Admin only)
// @Tags Admin
// @Security BearerAuth
// @Produce json
// @Success 200 {object} dto.GlobalResponse "Users fetched successfully"
// @Failure 401 {object} dto.GlobalResponse "Unauthorized"
// @Failure 500 {object} dto.GlobalResponse "Failed to fetch users"
// @Router /users [get]
func (handler *UserHandler) GetAllUsers(w http.ResponseWriter, r *http.Request) {
	users, err := handler.userService.GetAllUsers()
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "Failed to fetch users", Success: false, Errors: err.Error()})
		return
	}
	utils.WriteJSON(w, http.StatusOK, dto.GlobalResponse{Message: "Users fetched successfully", Success: true, Data: users})
}

// GetUserByID endpoint
// @Summary Get user by ID
// @Description Retrieve user details by ID (Admin only)
// @Tags Admin
// @Security BearerAuth
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} dto.GlobalResponse "User fetched successfully"
// @Failure 401 {object} dto.GlobalResponse "Unauthorized"
// @Failure 404 {object} dto.GlobalResponse "User not found"
// @Router /users/{id} [get]
func (handler *UserHandler) GetUserByID(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userID := params["id"]

	user, err := handler.userService.GetUserByID(userID)
	if err != nil {
		utils.WriteJSON(w, http.StatusNotFound, dto.GlobalResponse{Message: "User not found", Success: false, Errors: err.Error()})
		return
	}

	utils.WriteJSON(w, http.StatusOK, dto.GlobalResponse{Message: "User fetched successfully", Success: true, Data: user})
}

// CreateUser endpoint
// @Summary Create a new staff account
// @Description Allows admin to create a new user (staff account)
// @Tags Admin
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param request body dto.AdminCreateUserRequest true "Create User Request"
// @Success 201 {object} dto.GlobalResponse "User created successfully"
// @Failure 400 {object} dto.GlobalResponse "Validation failed or invalid request body"
// @Failure 401 {object} dto.GlobalResponse "Unauthorized"
// @Failure 500 {object} dto.GlobalResponse "Failed to create user"
// @Router /users [post]
func (handler *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var request dto.AdminCreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "Invalid request body", Success: false, Errors: err.Error()})
		return
	}

	if err := handler.validator.Struct(request); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "Validation failed", Success: false, Errors: err.Error()})
		return
	}

	userResponse, err := handler.userService.CreateUser(request)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "Failed to create user", Success: false, Errors: err.Error()})
		return
	}

	utils.WriteJSON(w, http.StatusCreated, dto.GlobalResponse{Message: "User created successfully", Success: true, Data: userResponse})
}

// UpdateUser endpoint
// @Summary Update user details
// @Description Update a user's role or active status (Admin only)
// @Tags Admin
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param request body dto.AdminUpdateUserRequest true "Update User Request"
// @Success 200 {object} dto.GlobalResponse "User updated successfully"
// @Failure 400 {object} dto.GlobalResponse "Invalid request body"
// @Failure 401 {object} dto.GlobalResponse "Unauthorized"
// @Failure 500 {object} dto.GlobalResponse "Failed to update user"
// @Router /users/{id} [put]
func (handler *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userID := params["id"]

	var request dto.AdminUpdateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "Invalid request body", Success: false, Errors: err.Error()})
		return
	}

	userResponse, err := handler.userService.UpdateUser(userID, request)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "Failed to update user", Success: false, Errors: err.Error()})
		return
	}

	utils.WriteJSON(w, http.StatusOK, dto.GlobalResponse{Message: "User updated successfully", Success: true, Data: userResponse})
}
