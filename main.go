package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

type Inventory struct {
	InventoryId  string    `json:"inventory_id" gorm:"primaryKey"`
	ItemName     string    `json:"item_name"`
	Quantity     int       `json:"quantity"`
	PricePerItem float64   `json:"price_per_item"`
	TotalPrice   float64   `json:"total_price"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// fake DB
var inventories []Inventory

func (inventory *Inventory) IsEmpty() bool {
	return inventory.ItemName == ""
}

func main() {
	//fmt.Println("Welcome to Inventory Management System")
	router := mux.NewRouter()

	//seeding
	inventories = append(inventories, Inventory{
		InventoryId:  "1",
		ItemName:     "Coconut",
		Quantity:     20,
		PricePerItem: 25,
		TotalPrice:   500,
		UpdatedAt:    time.Now(),
	})

	inventories = append(inventories, Inventory{
		InventoryId:  "2",
		ItemName:     "Apple",
		Quantity:     100,
		PricePerItem: 50,
		TotalPrice:   5000,
		UpdatedAt:    time.Now(),
	})

	//routing
	router.HandleFunc("/", serveHome).Methods("GET")
	router.HandleFunc("/inventries", getAllInventories).Methods("GET")
	router.HandleFunc("/inventries/{id}", getOneInventory).Methods("GET")
	router.HandleFunc("/inventries", createOneInventory).Methods("POST")
	router.HandleFunc("/inventries/{id}", updateOneInventory).Methods("PUT")
	router.HandleFunc("/inventries/{id}", deleteOneInventory).Methods("DELETE")

	//listen to a port
	log.Fatal(http.ListenAndServe(":4000", router))
}

func serveHome(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("<h1>Welcome to Inventory Management APP</h1>"))
}

func getAllInventories(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get all inventories")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode((inventories))
}
func getOneInventory(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get inventory by ID")
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)

	for _, inventory := range inventories {
		if inventory.InventoryId == params["id"] {
			json.NewEncoder(w).Encode(inventory)
			return
		}

	}
	json.NewEncoder(w).Encode("No inventory found for given id!")
	return
}

func createOneInventory(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Create one inventory")
	w.Header().Set("Content-Type", "Application/json")

	if r.Body == nil {
		json.NewEncoder(w).Encode("Please enter data to add inventory.")
	}
	var inventory Inventory
	_ = json.NewDecoder(r.Body).Decode(&inventory)
	if inventory.IsEmpty() {
		json.NewEncoder(w).Encode("Please send some data")
	}

	rand.Seed(time.Now().UnixNano())
	inventory.InventoryId = strconv.Itoa(rand.Intn(100))
	inventories = append(inventories, inventory)
	json.NewEncoder(w).Encode(inventory)
	return
}
func updateOneInventory(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Update inventory")
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)
	if r.Body == nil {
		json.NewEncoder(w).Encode("Please enter updated data")
	}

	for index, inventory := range inventories {
		if inventory.InventoryId == params["id"] {
			inventories = append(inventories[:index], inventories[index+1:]...)
			var inventory Inventory
			_ = json.NewDecoder(r.Body).Decode(&inventory)
			inventory.InventoryId = params["id"]
			inventories = append(inventories, inventory)
			json.NewEncoder(w).Encode(inventory)
		}
	}

}

func deleteOneInventory(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Delete inventory")
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(r)

	for index, inventory := range inventories {

		if inventory.InventoryId == params["id"] {
			inventories = append(inventories[:index], inventories[index+1:]...)
		}
	}
	//json.NewEncoder(w).Encode(inventories)
}
