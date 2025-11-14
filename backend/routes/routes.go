package routes

import (
	"inventory-system/handlers"
	"inventory-system/middleware"
	"inventory-system/repository"
	"inventory-system/services"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

func RegisterInventoryRoutes(router *mux.Router, db *gorm.DB) {

	inventoryRepository := repository.NewInventoryRepository(db)
	inventoryService := services.NewInventoryService(inventoryRepository)
	inventoryHandler := handlers.NewInventoryHandler(inventoryService)

	inventoryRouter := router.PathPrefix("/inventories").Subrouter()

	inventoryRouter.Use(middleware.AuthMiddleware)

	inventoryRouter.HandleFunc("", inventoryHandler.GetAllInventories).Methods("GET")
	inventoryRouter.HandleFunc("/{id}", inventoryHandler.GetOneInventory).Methods("GET")
	inventoryRouter.HandleFunc("", inventoryHandler.CreateOneInventory).Methods("POST")

	adminOnly := middleware.RoleMiddleware("admin")
	inventoryRouterAdmin := inventoryRouter.NewRoute().Subrouter()
	inventoryRouterAdmin.Use(adminOnly)

	inventoryRouterAdmin.HandleFunc("/{id}", inventoryHandler.UpdateOneInventory).Methods("PUT")
	inventoryRouterAdmin.HandleFunc("/{id}", inventoryHandler.DeleteOneInventory).Methods("DELETE")
}

func RegisterTransactionRoutes(router *mux.Router, db *gorm.DB) {

	transactionRepository := repository.NewTransactionRepository(db)
	inventoryRepository := repository.NewInventoryRepository(db)
	transactionService := services.NewTransactionService(transactionRepository, inventoryRepository)
	transactionHandler := handlers.NewTransactionHandler(transactionService)

	transactionRouter := router.PathPrefix("/transactions").Subrouter()

	transactionRouter.Use(middleware.AuthMiddleware)

	// Define routes under /transactions
	transactionRouter.HandleFunc("", transactionHandler.GetAllTranscations).Methods("GET")
	transactionRouter.HandleFunc("/{id}", transactionHandler.GetOneTransaction).Methods("GET")
	transactionRouter.HandleFunc("", transactionHandler.CreateOneTransaction).Methods("POST")

	adminOnly := middleware.RoleMiddleware("admin")
	transactionRouterAdmin := transactionRouter.NewRoute().Subrouter()
	transactionRouterAdmin.Use(adminOnly)
	transactionRouterAdmin.HandleFunc("/{id}", transactionHandler.UpdateOneTransaction).Methods("PUT")
}

func RegisterAuthRoutes(router *mux.Router, db *gorm.DB) {

	authRepository := repository.NewAuthRepository(db)
	authService := services.NewAuthService(authRepository, db)
	authHandler := handlers.NewAuthHandler(authService)

	// Public routes (no middleware)
	router.HandleFunc("/auth/signup", authHandler.Signup).Methods("POST")
	router.HandleFunc("/auth/signin", authHandler.Signin).Methods("POST")
}

func RegisterAnalyticsRoutes(router *mux.Router, db *gorm.DB) {
	analyticsRepository := repository.NewAnalyticsRepository(db)
	analyticsService := services.NewAnalyticsService(analyticsRepository)
	analyticsHandler := handlers.NewAnalyticsHandler(analyticsService)

	analyticsRouter := router.PathPrefix("/analytics").Subrouter()
	analyticsRouter.Use(middleware.AuthMiddleware)

	analyticsRouter.HandleFunc("/revenue/growth", analyticsHandler.GetMonthlyRevenueGrowth).Methods("GET")
	analyticsRouter.HandleFunc("/inventory/summary", analyticsHandler.GetInventorySummary).Methods("GET")
	analyticsRouter.HandleFunc("/inventory/low-stock", analyticsHandler.GetLowStockItems).Methods("GET")
	analyticsRouter.HandleFunc("/sales/trends", analyticsHandler.GetSalesTrends).Methods("GET")
}

func RegisterUserRoutes(router *mux.Router, db *gorm.DB) {
	userRepository := repository.NewUserRepository(db)
	userService := services.NewUserService(userRepository, db)
	userHandler := handlers.NewUserHandler(userService)

	userRouter := router.PathPrefix("/users").Subrouter()
	userRouter.Use(middleware.AuthMiddleware)

	adminOnly := middleware.RoleMiddleware("admin")
	userRouterAdmin := userRouter.NewRoute().Subrouter()
	userRouterAdmin.Use(adminOnly)

	userRouterAdmin.HandleFunc("", userHandler.GetAllUsers).Methods("GET")
	userRouterAdmin.HandleFunc("/{id}", userHandler.GetUserByID).Methods("GET")
	userRouterAdmin.HandleFunc("", userHandler.CreateUser).Methods("POST")
	userRouterAdmin.HandleFunc("/{id}", userHandler.UpdateUser).Methods("PUT")
}
