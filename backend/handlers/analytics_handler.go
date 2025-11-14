package handlers

import (
	"inventory-system/dto"
	"inventory-system/services"
	"inventory-system/utils"
	"net/http"
	"strconv"
	"time"
)

type AnalyticsHandler struct {
	service services.AnalyticsService
}

func NewAnalyticsHandler(service services.AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{service: service}
}

// GetMonthlyRevenueGrowth endpoint
// @Summary Get Monthly Revenue Growth
// @Description Retrieve monthly revenue growth details including growth percentage, target achievement, burn rate, and top-selling items.
// @Tags Analytics
// @Produce json
// @Param month query int true "Month number (1-12)"
// @Param year query int true "Year (e.g., 2025)"
// @Param target query float64 false "Revenue growth target percentage"
// @Param burn_rate query float64 false "Monthly burn rate amount"
// @Success 200 {object} dto.GlobalResponse{data=dto.MonthlyRevenueGrowthResponse} "Revenue growth data retrieved successfully"
// @Failure 400 {object} dto.GlobalResponse "Invalid request parameters"
// @Failure 500 {object} dto.GlobalResponse "Internal Server Error"
// @Security BearerAuth
// @Router /analytics/revenue/growth [get]
func (handler *AnalyticsHandler) GetMonthlyRevenueGrowth(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	month, _ := strconv.Atoi(query.Get("month"))
	year, _ := strconv.Atoi(query.Get("year"))
	target, _ := strconv.ParseFloat(query.Get("target"), 64)
	burnRate, _ := strconv.ParseFloat(query.Get("burn_rate"), 64)

	result, err := handler.service.GetMonthlyRevenueGrowth(month, year, target, burnRate)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "Error", Success: false, Errors: err.Error()})
		return
	}
	utils.WriteJSON(w, http.StatusOK, dto.GlobalResponse{Message: "OK", Success: true, Data: result})
}

// GetInventorySummary endpoint
// @Summary Get Inventory Summary
// @Description Retrieve a summary of inventory statistics, including total items, total stock value, and average item value.
// @Tags Analytics
// @Produce json
// @Param as_of query string false "As of date (YYYY-MM-DD)"
// @Success 200 {object} dto.GlobalResponse{data=dto.InventorySummaryResponse} "Inventory summary retrieved successfully"
// @Failure 500 {object} dto.GlobalResponse "Internal Server Error"
// @Security BearerAuth
// @Router /analytics/inventory/summary [get]
func (handler *AnalyticsHandler) GetInventorySummary(w http.ResponseWriter, r *http.Request) {
	asOf := r.URL.Query().Get("as_of")

	result, err := handler.service.GetInventorySummary(asOf)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "Error", Success: false, Errors: err.Error()})
		return
	}
	utils.WriteJSON(w, http.StatusOK, dto.GlobalResponse{Message: "OK", Success: true, Data: result})
}

// GetLowStockItems endpoint
// @Summary Get Low Stock Items
// @Description Retrieve a list of items that are below a specified stock threshold.
// @Tags Analytics
// @Produce json
// @Param threshold query int false "Stock quantity threshold (default: system-defined)"
// @Param limit query int false "Maximum number of items to return"
// @Success 200 {object} dto.GlobalResponse{data=dto.LowStockItemsResponse} "Low stock items retrieved successfully"
// @Failure 500 {object} dto.GlobalResponse "Internal Server Error"
// @Security BearerAuth
// @Router /analytics/inventory/low-stock [get]
func (handler *AnalyticsHandler) GetLowStockItems(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	threshold, _ := strconv.Atoi(query.Get("threshold"))
	limit, _ := strconv.Atoi(query.Get("limit"))

	result, err := handler.service.GetLowStockItems(threshold, limit)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, dto.GlobalResponse{Message: "Error", Success: false, Errors: err.Error()})
		return
	}
	utils.WriteJSON(w, http.StatusOK, dto.GlobalResponse{Message: "OK", Success: true, Data: result})
}

// GetSalesTrends endpoint
// @Summary Get Sales Trends
// @Description Retrieve sales trends for a given date range and interval (daily, weekly, or monthly).
// @Tags Analytics
// @Produce json
// @Param from query string true "Start date (YYYY-MM-DD)"
// @Param to query string true "End date (YYYY-MM-DD)"
// @Param interval query string true "Time interval (daily|weekly|monthly)"
// @Success 200 {object} dto.GlobalResponse{data=dto.SalesTrendsResponse} "Sales trends retrieved successfully"
// @Failure 400 {object} dto.GlobalResponse "Invalid parameters or date format"
// @Failure 500 {object} dto.GlobalResponse "Internal Server Error"
// @Security BearerAuth
// @Router /analytics/sales/trends [get]
func (handler *AnalyticsHandler) GetSalesTrends(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	fromStr := query.Get("from")
	toStr := query.Get("to")
	interval := query.Get("interval")

	fromDate, err := time.Parse("2006-01-02", fromStr)
	if err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, dto.GlobalResponse{
			Message: "Invalid from date",
			Success: false,
			Errors:  err.Error(),
		})
		return
	}

	toDate, err := time.Parse("2006-01-02", toStr)
	if err != nil {
		utils.WriteJSON(w, http.StatusBadRequest, dto.GlobalResponse{
			Message: "Invalid to date",
			Success: false,
			Errors:  err.Error(),
		})
		return
	}

	result, err := handler.service.GetSalesTrends(fromDate, toDate, interval)
	if err != nil {
		utils.WriteJSON(w, http.StatusInternalServerError, dto.GlobalResponse{
			Message: "Error",
			Success: false,
			Errors:  err.Error(),
		})
		return
	}

	utils.WriteJSON(w, http.StatusOK, dto.GlobalResponse{
		Message: "OK",
		Success: true,
		Data:    result,
	})
}
