package config

import (
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var dsn = "root:SA123456#@tcp(127.0.0.1:3306)/inventory_management_db?charset=utf8mb4&parseTime=True&loc=Local"

func ConnetDatabase() *gorm.DB {
	var db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	fmt.Println("Data connected succesfully")
	return db
}

func MigrateDatabase(db *gorm.DB)
