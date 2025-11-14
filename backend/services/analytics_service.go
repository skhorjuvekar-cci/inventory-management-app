package services

import (
	"fmt"
	"inventory-system/dto"
	"inventory-system/repository"
	"math"
	"strconv"
	"time"
)

type AnalyticsService interface {
	GetMonthlyRevenueGrowth(month int, year int, target float64, burnRate float64) (dto.MonthlyRevenueGrowthResponse, error)
	GetInventorySummary(asOfDate string) (dto.InventorySummaryResponse, error)
	GetLowStockItems(threshold int, limit int) (dto.LowStockItemsResponse, error)
	GetSalesTrends(fromDate time.Time, toDate time.Time, interval string) (dto.SalesTrendsResponse, error)
}

type analyticsService struct {
	repo repository.AnalyticsRepository
}

func NewAnalyticsService(repo repository.AnalyticsRepository) AnalyticsService {
	return &analyticsService{repo: repo}
}

func (service *analyticsService) GetMonthlyRevenueGrowth(month int, year int, target float64, burnRate float64) (dto.MonthlyRevenueGrowthResponse, error) {
	currentRevenue, err := service.repo.GetRevenueByMonth(month, year)
	if err != nil {
		return dto.MonthlyRevenueGrowthResponse{}, err
	}

	// --- Compute previous month and year ---
	previousMonth := month - 1
	previousYear := year
	if previousMonth == 0 {
		previousMonth = 12
		previousYear--
	}

	previousRevenue, err := service.repo.GetRevenueByMonth(previousMonth, previousYear)
	if err != nil {
		return dto.MonthlyRevenueGrowthResponse{}, err
	}

	// --- Calculate Growth Percent ---
	var growthPercent float64
	switch {
	case previousRevenue > 0:
		growthPercent = ((currentRevenue - previousRevenue) / previousRevenue) * 100
	case previousRevenue == 0 && currentRevenue > 0:
		// If there was no previous revenue, treat this as 100% new growth
		growthPercent = 100
	default:
		growthPercent = 0
	}

	// --- Calculate Runway (based on Burn Rate) ---
	var runwayMonths float64
	if burnRate > 0 {
		runwayMonths = currentRevenue / burnRate
	} else {
		runwayMonths = 0
	}

	// --- Top Selling Items ---
	topItemsData, err := service.repo.GetTopSellingItems(month, year, 5)
	if err != nil {
		return dto.MonthlyRevenueGrowthResponse{}, err
	}

	var topSellingItems []dto.TopSellingItemResponse
	for _, record := range topItemsData {
		itemName, _ := record["item_name"].(string)
		totalSold, _ := record["total_sold"].(int64)
		revenue, _ := record["revenue"].(float64)

		topSellingItems = append(topSellingItems, dto.TopSellingItemResponse{
			ItemName:  itemName,
			TotalSold: int(totalSold),
			Revenue:   revenue,
		})
	}

	// --- Round off numeric values for presentation ---
	growthPercent = math.Round(growthPercent*100) / 100
	runwayMonths = math.Round(runwayMonths*100) / 100

	return dto.MonthlyRevenueGrowthResponse{
		Month:           time.Month(month).String(),
		Year:            year,
		TotalRevenue:    currentRevenue,
		PreviousRevenue: previousRevenue,
		GrowthPercent:   growthPercent,
		Target:          target,
		TargetAchieved:  growthPercent >= target,
		BurnRate:        burnRate,
		RunwayMonths:    runwayMonths,
		TopSellingItems: topSellingItems,
	}, nil
}

func (service *analyticsService) GetInventorySummary(asOfDate string) (dto.InventorySummaryResponse, error) {
	totalItems, totalStockValue, totalAvailableQty, avgItemValue, err := service.repo.GetInventorySummary()
	if err != nil {
		return dto.InventorySummaryResponse{}, err
	}

	if asOfDate == "" {
		asOfDate = time.Now().Format("2006-01-02")
	}

	return dto.InventorySummaryResponse{
		AsOfDate:          asOfDate,
		TotalItems:        int(totalItems),
		TotalStockValue:   totalStockValue,
		TotalAvailableQty: int(totalAvailableQty),
		AverageItemValue:  avgItemValue,
	}, nil
}

func (service *analyticsService) GetLowStockItems(threshold int, limit int) (dto.LowStockItemsResponse, error) {
	items, err := service.repo.GetLowStockItems(threshold, limit)
	if err != nil {
		return dto.LowStockItemsResponse{}, err
	}

	var lowStockList []dto.LowStockItemDetails
	for _, i := range items {
		lowStockList = append(lowStockList, dto.LowStockItemDetails{
			ItemName:     i.ItemName,
			AvailableQty: i.AvailableQty,
		})
	}

	return dto.LowStockItemsResponse{
		Threshold:     threshold,
		LowStockItems: lowStockList,
	}, nil
}

func (service *analyticsService) GetSalesTrends(fromDate time.Time, toDate time.Time, interval string) (dto.SalesTrendsResponse, error) {
	results, err := service.repo.GetSalesTrends(fromDate, toDate, interval)
	if err != nil {
		return dto.SalesTrendsResponse{}, err
	}

	var trends []dto.SalesTrendRow
	for _, record := range results {
		// Safe conversion of period, revenue, units_sold
		period := fmt.Sprintf("%v", record["period"])

		revenueFloat, err := strconv.ParseFloat(fmt.Sprintf("%v", record["revenue"]), 64)
		if err != nil {
			revenueFloat = 0
		}

		unitsSoldInt, err := strconv.Atoi(fmt.Sprintf("%v", record["units_sold"]))
		if err != nil {
			unitsSoldInt = 0
		}

		trends = append(trends, dto.SalesTrendRow{
			Period:    period,
			Revenue:   revenueFloat,
			UnitsSold: unitsSoldInt,
		})
	}

	return dto.SalesTrendsResponse{
		Interval: interval,
		Trends:   trends,
	}, nil
}
