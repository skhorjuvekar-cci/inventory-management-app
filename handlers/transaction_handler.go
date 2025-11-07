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

func (handlerObject *TransactionHandler) GetAllTranscations(w http.ResponseWriter, r *http.Request) {

	transaction, err := handlerObject.service.GetAllTransaction()
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "error", Success: false, Errors: err.Error()})
		return
	}
	utils.WriteJSON(w, http.StatusOK, dto.GlobalResponse{Message: "OK", Success: true, Data: transaction})
}

func (handlerObject *TransactionHandler) GetOneTransaction(w http.ResponseWriter, r *http.Request) {

	params := mux.Vars(r)["id"]
	transaction, err := handlerObject.service.GetOneTransaction(params)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "error", Success: false, Errors: err.Error()})
		return
	}
	utils.WriteJSON(w, http.StatusOK, dto.GlobalResponse{Message: "OK", Success: true, Data: transaction})

}

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
