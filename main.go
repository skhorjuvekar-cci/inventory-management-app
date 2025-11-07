package main

import (
	"fmt"
	"inventory-system/config"
	"inventory-system/routes"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {

	db := config.ConnectDatabase()
	config.MigrateDatabase(db)

	fmt.Println("Welcome to Inventory Management System")
	router := mux.NewRouter()
	routes.RegisterInventoryRoutes(router, db)
	routes.RegisterTransactionRoutes(router, db)
	routes.RegisterAuthRoutes(router, db)

	log.Fatal(http.ListenAndServe(":4000", router))
}
