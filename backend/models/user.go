package models

import (
	"errors"
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID             string    `json:"id" gorm:"type:varchar(36);primaryKey"`
	FirstName      string    `json:"first_name" gorm:"type:varchar(50);index"`
	LastName       string    `json:"last_name" gorm:"type:varchar(50);index"`
	Email          string    `json:"email" gorm:"type:varchar(100);uniqueIndex;not null"`
	HashedPassword string    `json:"hashed_password" gorm:"type:varchar(255);not null"`
	Role           string    `json:"role" gorm:"type:varchar(20);default:'staff';not null"`
	IsActive       bool      `json:"is_active" gorm:"default:true;not null"`
	CreatedAt      time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt      time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// BeforeCreate hook to set defaults and validate
func (user *User) BeforeCreate(tx *gorm.DB) error {
	if user.ID == "" {
		user.ID = uuid.New().String()
	}

	// If Role not set, default to 'staff'
	if user.Role == "" {
		user.Role = "staff"
	}

	// Normalize and validate allowed roles
	user.Role = strings.ToLower(user.Role)
	if user.Role != "admin" && user.Role != "staff" {
		return errors.New("invalid role: must be either 'admin' or 'staff'")
	}

	return nil
}

func (user *User) BeforeUpdate(tx *gorm.DB) error {
	user.Role = strings.ToLower(user.Role)
	if user.Role != "admin" && user.Role != "staff" {
		return errors.New("invalid role: must be either 'admin' or 'staff'")
	}
	return nil
}
