package handlers

import (
	"encoding/json"
	"inventory-system/dto"
	"inventory-system/services"
	"inventory-system/utils"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

type TransactionHandler struct {
	service  services.TransactionService
	validate *validator.Validate
}

func NewTransactionHandler(serviceObject services.TransactionService) *TransactionHandler {
	return &TransactionHandler{
		service:  serviceObject,
		validate: validator.New(),
	}
}

// GetAllTranscations endpoint
// @Summary Get all transactions
// @Description Retrieve a list of all transactions from the database
// @Tags Transaction
// @Produce json
// @Success 200 {object} dto.GlobalResponse "List of all transactions"
// @Failure 500 {object} dto.GlobalResponse "Internal Server Error"
// @Security BearerAuth
// @Router /transactions [get]
func (handlerObject *TransactionHandler) GetAllTranscations(w http.ResponseWriter, r *http.Request) {

	transaction, err := handlerObject.service.GetAllTransaction()
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "error", Success: false, Errors: err.Error()})
		return
	}
	utils.WriteJSON(w, http.StatusOK, dto.GlobalResponse{Message: "OK", Success: true, Data: transaction})
}

// GetOneTransaction endpoint
// @Summary Get one transaction by ID
// @Description Retrieve details of a specific transaction by its ID
// @Tags Transaction
// @Produce json
// @Param id path string true "Transaction ID"
// @Success 200 {object} dto.GlobalResponse "Transaction details"
// @Failure 404 {object} dto.GlobalResponse "Transaction not found"
// @Failure 500 {object} dto.GlobalResponse "Internal Server Error"
// @Security BearerAuth
// @Router /transactions/{id} [get]
func (handlerObject *TransactionHandler) GetOneTransaction(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)["id"]
	transaction, err := handlerObject.service.GetOneTransaction(params)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "error", Success: false, Errors: err.Error()})
		return
	}
	utils.WriteJSON(w, http.StatusOK, dto.GlobalResponse{Message: "OK", Success: true, Data: transaction})

}

// CreateOneTransaction endpoint
// @Summary Create a new transaction
// @Description Add a new transaction record to the system
// @Tags Transaction
// @Accept json
// @Produce json
// @Param request body dto.TransactionCreateRequest true "Transaction Create Request"
// @Success 201 {object} dto.GlobalResponse "Transaction created successfully"
// @Failure 400 {object} dto.GlobalResponse "Bad Request"
// @Failure 500 {object} dto.GlobalResponse "Internal Server Error"
// @Security BearerAuth
// @Router /transactions [post]
func (handlerObject *TransactionHandler) CreateOneTransaction(w http.ResponseWriter, r *http.Request) {

	var request dto.TransactionCreateRequest

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "Invalid Payload", Success: false, Errors: err.Error()})
		return
	}

	if err := handlerObject.validate.Struct(request); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "Validation failed", Success: false, Errors: err.Error()})
		return

	}

	transaction, err := handlerObject.service.CreateOneTransaction(request)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "Created failed", Success: false, Errors: err.Error()})
		return
	}
	utils.WriteJSON(w, http.StatusCreated, dto.GlobalResponse{Message: "Created", Success: true, Data: transaction})
}

// UpdateOneTransaction endpoint
// @Summary Update an existing transaction
// @Description Update details of an existing transaction by its ID
// @Tags Transaction
// @Accept json
// @Produce json
// @Param id path string true "Transaction ID"
// @Param request body dto.TransactionUpdateRequest true "Transaction Update Request"
// @Success 200 {object} dto.GlobalResponse "Transaction updated successfully"
// @Failure 400 {object} dto.GlobalResponse "Bad Request"
// @Failure 500 {object} dto.GlobalResponse "Internal Server Error"
// @Security BearerAuth
// @Router /transactions/{id} [put]
func (handlerObject *TransactionHandler) UpdateOneTransaction(w http.ResponseWriter, r *http.Request) {

	var request dto.TransactionUpdateRequest
	id := mux.Vars(r)["id"]
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "Invalid Payload", Success: false, Errors: err.Error()})
		return
	}

	if err := handlerObject.validate.Struct(request); err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "Validation Failed", Success: false, Errors: err.Error()})
		return
	}

	transaction, err := handlerObject.service.UpdateOneTransaction(id, request)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "Update failed", Success: false, Errors: err.Error()})
		return

	}
	utils.WriteJSON(w, http.StatusCreated, dto.GlobalResponse{Message: "Updated", Success: true, Data: transaction})
}
