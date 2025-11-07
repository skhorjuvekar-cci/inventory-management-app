package config

import (
	"fmt"
	"inventory-system/models"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var dsn = "root:SA123456#@tcp(127.0.0.1:3306)/inventory_management_db?charset=utf8mb4&parseTime=True&loc=Local"

func ConnectDatabase() *gorm.DB {
	var db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	fmt.Println("Data connected succesfully")
	return db
}

func MigrateDatabase(db *gorm.DB) {
	var err = db.AutoMigrate(&models.Inventory{})
	if err != nil {
		log.Fatal("Failed to migrated to Inventory database:", err)
	}
	fmt.Println("Inventory Database migrated successfully")

	err = db.AutoMigrate(&models.Transaction{})
	if err != nil {
		log.Fatal("Failed to migrated to Transaction database:", err)
	}
	fmt.Println("Transaction Database migrated successfully")

	err = db.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatal("Failed to migrated to User database:", err)
	}
	fmt.Println("User Database migrated successfully")
}
