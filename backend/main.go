package main

// @title Inventory Management API
// @version 1.0
// @description Simple inventory and transactions API
// @host localhost:4000
// @BasePath /

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

import (
	"fmt"
	"inventory-system/config"
	"inventory-system/routes"
	"log"
	"net/http"

	_ "inventory-system/docs"

	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger"
)

// “Import this package only for its side effects, not for using any of its exported names directly.”
func main() {

	db := config.ConnectDatabase()
	config.MigrateDatabase(db)

	fmt.Println("Welcome to Inventory Management System")
	router := mux.NewRouter()
	routes.RegisterInventoryRoutes(router, db)
	routes.RegisterTransactionRoutes(router, db)
	routes.RegisterAuthRoutes(router, db)
	routes.RegisterAnalyticsRoutes(router, db)
	routes.RegisterUserRoutes(router, db)
	router.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)
	log.Println("Server running on http://localhost:4000")
	log.Println("Swagger UI available at http://localhost:4000/swagger/index.html")

	log.Fatal(http.ListenAndServe(":4000", router))
}
