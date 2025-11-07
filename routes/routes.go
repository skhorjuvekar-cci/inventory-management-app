package routes

import (
	"inventory-system/handlers"
	"inventory-system/middleware"
	"inventory-system/repository"
	"inventory-system/services"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

// -------------------- INVENTORY ROUTES --------------------

func RegisterInventoryRoutes(router *mux.Router, db *gorm.DB) {

	inventoryRepository := repository.NewInventoryRepository(db)
	inventoryService := services.NewInventoryService(inventoryRepository)
	inventoryHandler := handlers.NewInventoryHandler(inventoryService)

	// Create a subrouter for inventory routes
	inventoryRouter := router.PathPrefix("/inventories").Subrouter()

	inventoryRouter.Use(middleware.AuthMiddleware)

	inventoryRouter.HandleFunc("/", inventoryHandler.GetAllInventories).Methods("GET")
	inventoryRouter.HandleFunc("/{id}", inventoryHandler.GetOneInventory).Methods("GET")
	inventoryRouter.HandleFunc("/", inventoryHandler.CreateOneInventory).Methods("POST")
	inventoryRouter.HandleFunc("/{id}", inventoryHandler.UpdateOneInventory).Methods("PUT")
	inventoryRouter.HandleFunc("/{id}", inventoryHandler.DeleteOneInventory).Methods("DELETE")
}

func RegisterTransactionRoutes(router *mux.Router, db *gorm.DB) {

	transactionRepository := repository.NewTransactionRepository(db)
	inventoryRepository := repository.NewInventoryRepository(db)
	transactionService := services.NewTransactionService(transactionRepository, inventoryRepository)
	transactionHandler := handlers.NewTransactionHandler(transactionService)

	transactionRouter := router.PathPrefix("/transactions").Subrouter()

	transactionRouter.Use(middleware.AuthMiddleware)

	// Define routes under /transactions
	transactionRouter.HandleFunc("/", transactionHandler.GetAllTranscations).Methods("GET")
	transactionRouter.HandleFunc("/{id}", transactionHandler.GetOneTransaction).Methods("GET")
	transactionRouter.HandleFunc("/", transactionHandler.CreateOneTransaction).Methods("POST")
	transactionRouter.HandleFunc("/{id}", transactionHandler.UpdateOneTransaction).Methods("PUT")
}

func RegisterAuthRoutes(router *mux.Router, db *gorm.DB) {

	authRepository := repository.NewAuthRepository(db)
	authService := services.NewAuthService(authRepository, db)
	authHandler := handlers.NewAuthHandler(authService)

	// Public routes (no middleware)
	router.HandleFunc("/auth/signup", authHandler.Signup).Methods("POST")
	router.HandleFunc("/auth/signin", authHandler.Signin).Methods("POST")
}
