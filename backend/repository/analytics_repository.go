package repository

import (
	"inventory-system/models"
	"time"

	"gorm.io/gorm"
)

type AnalyticsRepository interface {
	GetRevenueByMonth(month int, year int) (float64, error)
	GetTopSellingItems(month int, year int, limit int) ([]map[string]interface{}, error)
	GetInventorySummary() (int64, float64, int64, float64, error)
	GetLowStockItems(threshold int, limit int) ([]models.Inventory, error)
	GetSalesTrends(fromDate time.Time, toDate time.Time, interval string) ([]map[string]interface{}, error)
}

type analyticsRepository struct {
	db *gorm.DB
}

func NewAnalyticsRepository(db *gorm.DB) AnalyticsRepository {
	return &analyticsRepository{db: db}
}

// Get total revenue for a specific month/year
func (repo *analyticsRepository) GetRevenueByMonth(month int, year int) (float64, error) {
	var totalRevenue float64
	err := repo.db.
		Model(&models.Transaction{}).
		Select("COALESCE(SUM(total_amount),0)").
		Where("type = ?", "sold").
		Where("EXTRACT(MONTH FROM created_at) = ? AND EXTRACT(YEAR FROM created_at) = ?", month, year).
		Scan(&totalRevenue).Error
	return totalRevenue, err
}

// Get top-selling items by revenue
func (repo *analyticsRepository) GetTopSellingItems(month int, year int, limit int) ([]map[string]interface{}, error) {
	var results []map[string]interface{}
	err := repo.db.Table("transactions AS t").
		Select("i.item_name, SUM(t.quantity) AS total_sold, SUM(t.total_amount) AS revenue").
		Joins("JOIN inventories i ON i.inventory_id = t.item_id").
		Where("t.type = ?", "sold").
		Where("EXTRACT(MONTH FROM t.created_at) = ? AND EXTRACT(YEAR FROM t.created_at) = ?", month, year).
		Group("i.item_name").
		Order("revenue DESC").
		Limit(limit).
		Find(&results).Error
	return results, err
}

// Get inventory summary
func (repo *analyticsRepository) GetInventorySummary() (int64, float64, int64, float64, error) {
	var totalItems int64
	var totalStockValue, totalAvailableQty, avgItemValue float64

	err := repo.db.Model(&models.Inventory{}).Count(&totalItems).Error
	if err != nil {
		return 0, 0, 0, 0, err
	}

	err = repo.db.Model(&models.Inventory{}).Select("COALESCE(SUM(available_qty * price_per_item),0)").Scan(&totalStockValue).Error
	if err != nil {
		return 0, 0, 0, 0, err
	}

	err = repo.db.Model(&models.Inventory{}).Select("COALESCE(SUM(available_qty),0)").Scan(&totalAvailableQty).Error
	if err != nil {
		return 0, 0, 0, 0, err
	}

	err = repo.db.Model(&models.Inventory{}).Select("COALESCE(AVG(price_per_item),0)").Scan(&avgItemValue).Error
	return totalItems, totalStockValue, int64(totalAvailableQty), avgItemValue, err
}

// Get low-stock items
func (repo *analyticsRepository) GetLowStockItems(threshold int, limit int) ([]models.Inventory, error) {
	var items []models.Inventory
	err := repo.db.Where("available_qty < ?", threshold).
		Order("available_qty ASC").
		Limit(limit).
		Find(&items).Error
	return items, err
}

// Get sales trend grouped by interval
// Get sales trend grouped by interval (MySQL-safe version)
// Get sales trend grouped by interval (MySQL-safe version)
func (repo *analyticsRepository) GetSalesTrends(fromDate time.Time, toDate time.Time, interval string) ([]map[string]interface{}, error) {
	var groupBy string

	switch interval {
	case "daily":
		groupBy = "DATE(created_at)"
	case "weekly":
		groupBy = "YEARWEEK(created_at, 1)"
	case "monthly":
		groupBy = "DATE_FORMAT(created_at, '%Y-%m')"
	default:
		groupBy = "DATE(created_at)"
	}

	var results []map[string]interface{}

	err := repo.db.Table("transactions").
		Select(groupBy+" AS period, SUM(total_amount) AS revenue, SUM(quantity) AS units_sold").
		Where("type = ?", "sold").
		Where("created_at BETWEEN ? AND ?", fromDate, toDate).
		Group("period").
		Order("period ASC").
		Find(&results).Error

	return results, err
}
