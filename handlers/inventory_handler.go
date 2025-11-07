// package handlers

// import (
// 	"encoding/json"
// 	"fmt"
// 	"inventory-system/config"
// 	"inventory-system/models"
// 	"net/http"
// 	"time"

// 	"github.com/gorilla/mux"
// )

// var db = config.ConnetDatabase()

// func ServeHome(w http.ResponseWriter, r *http.Request) {
// 	w.Write([]byte("<h1>Welcome to Inventory Management APP</h1>"))
// }

// func GetAllInventories(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println("Get all inventories")
// 	w.Header().Set("Content-Type", "application/json")

// 	var inventories []models.Inventory
// 	result := db.Find(&inventories)

// 	if result.Error != nil {
// 		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
// 		return
// 	}
// 	json.NewEncoder(w).Encode((inventories))
// }

// func GetOneInventory(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println("Get inventory by ID")
// 	w.Header().Set("Content-Type", "application/json")

// 	params := mux.Vars(r)

// 	var inventory models.Inventory
// 	result := db.First(&inventory, "inventory_id=?", params["id"])
// 	if result.Error != nil {
// 		json.NewEncoder(w).Encode("No inventory found for given id!")
// 		return
// 	}

// 	json.NewEncoder(w).Encode(inventory)

// }

// func CreateOneInventory(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println("Create one inventory")
// 	w.Header().Set("Content-Type", "Application/json")

// 	if r.Body == nil {
// 		json.NewEncoder(w).Encode("Please enter data to add inventory.")
// 	}
// 	var inventory models.Inventory
// 	if err := json.NewDecoder(r.Body).Decode(&inventory); err != nil {
// 		http.Error(w, "Invalid data", http.StatusBadRequest)
// 		return
// 	}

// 	inventory.TotalPrice = float64(inventory.Quantity) * inventory.PricePerItem
// 	inventory.UpdatedAt = time.Now()

// 	result := db.Create(&inventory)
// 	if result.Error != nil {
// 		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
// 		return
// 	}
// 	json.NewEncoder(w).Encode(inventory)
// }

// func UpdateOneInventory(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println("Update inventory")
// 	w.Header().Set("Content-Type", "application/json")

// 	params := mux.Vars(r)

// 	var existing models.Inventory

// 	if err := db.First(&existing, "inventory_id=?", params["id"]).Error; err != nil {
// 		http.Error(w, "Inventory not found", http.StatusNotFound)
// 	}

// 	var updated models.Inventory
// 	if err := json.NewDecoder(r.Body).Decode(&updated); err != nil {
// 		http.Error(w, "Invalid data", http.StatusBadRequest)
// 		return
// 	}
// 	if r.Body == nil {
// 		json.NewEncoder(w).Encode("Please enter updated data")
// 	}
// 	existing.ItemName = updated.ItemName
// 	existing.Quantity = updated.Quantity
// 	existing.PricePerItem = updated.PricePerItem
// 	existing.TotalPrice = float64(updated.Quantity) * updated.PricePerItem
// 	existing.UpdatedAt = time.Now()
// 	db.Save(&existing)
// 	json.NewEncoder(w).Encode(existing)

// }

// func DeleteOneInventory(w http.ResponseWriter, r *http.Request) {
// 	fmt.Println("Delete inventory")
// 	w.Header().Set("Content-Type", "application/json")

// 	params := mux.Vars(r)

// 	if err := db.Delete(&models.Inventory{}, "inventory_id=?", params["id"]).Error; err != nil {
// 		http.Error(w, "Inventory not found", http.StatusNotFound)
// 	}
// 	json.NewEncoder(w).Encode("Inventory deleted successfully")
// }

package handlers

import (
	"encoding/json"
	"net/http"

	"inventory-system/dto"
	"inventory-system/services"

	"github.com/go-playground/validator/v10"
	"github.com/gorilla/mux"
)

type InventoryHandler struct {
	service  services.InventoryService
	validate *validator.Validate
}

func NewInventoryHandler(serviceObject services.InventoryService) *InventoryHandler {
	return &InventoryHandler{
		service:  serviceObject,
		validate: validator.New(),
	}

}
func (handlerObject *InventoryHandler) ServeHome(w http.ResponseWriter, r *http.Request) {

	response := dto.GlobalResponse{Message: "Welcome", Success: true}
	writeJSON(w, http.StatusOK, response)
}

func (handlerObject *InventoryHandler) GetAllInventories(w http.ResponseWriter, r *http.Request) {

	inventory, err := handlerObject.service.GetAllInventories()
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "error", Success: false, Errors: err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, dto.GlobalResponse{Message: "OK", Success: true, Data: inventory})
}

func (handlerObject *InventoryHandler) GetOneInventory(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	inventory, err := handlerObject.service.GetOneInventory(id)
	if err != nil {
		writeJSON(w, http.StatusNotFound, dto.GlobalResponse{Message: "not found", Success: false, Errors: err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, dto.GlobalResponse{Message: "OK", Success: true, Data: inventory})
}

func (handlerObject *InventoryHandler) CreateOneInventory(w http.ResponseWriter, r *http.Request) {

	var request dto.InventoryCreateRequest

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "invalid payload", Success: false, Errors: err.Error()})
		return
	}

	if err := handlerObject.validate.Struct(request); err != nil {
		writeJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "validation failed", Success: false, Errors: err.Error()})
		return
	}

	inventory, err := handlerObject.service.CreateOneInventory(request)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "create failed", Success: false, Errors: err.Error()})
		return
	}

	writeJSON(w, http.StatusCreated, dto.GlobalResponse{Message: "created", Success: true, Data: inventory})
}

func (handlerObject *InventoryHandler) UpdateOneInventory(w http.ResponseWriter, r *http.Request) {

	id := mux.Vars(r)["id"]

	var request dto.InventoryUpdateRequest

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		writeJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "invalid payload", Success: false, Errors: err.Error()})
		return
	}

	if err := handlerObject.validate.Struct(request); err != nil {
		writeJSON(w, http.StatusBadRequest, dto.GlobalResponse{Message: "validation failed", Success: false, Errors: err.Error()})
		return
	}

	inventory, err := handlerObject.service.UpdateOneInventory(id, request)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "update failed", Success: false, Errors: err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, dto.GlobalResponse{Message: "updated", Success: true, Data: inventory})
}

func (handlerObject *InventoryHandler) DeleteOneInventory(w http.ResponseWriter, r *http.Request) {

	id := mux.Vars(r)["id"]

	if err := handlerObject.service.DeleteOneInventory(id); err != nil {
		writeJSON(w, http.StatusNotFound, dto.GlobalResponse{Message: "delete failed", Success: false, Errors: err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, dto.GlobalResponse{Message: "deleted", Success: true})
}

func writeJSON(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
