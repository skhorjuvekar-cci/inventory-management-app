package dto

type MonthlyRevenueGrowthResponse struct {
	Month           string                   `json:"month"`
	Year            int                      `json:"year"`
	TotalRevenue    float64                  `json:"total_revenue"`
	PreviousRevenue float64                  `json:"previous_revenue"`
	GrowthPercent   float64                  `json:"growth_percent"`
	Target          float64                  `json:"target,omitempty"`
	TargetAchieved  bool                     `json:"target_achieved"`
	BurnRate        float64                  `json:"burn_rate,omitempty"`
	RunwayMonths    float64                  `json:"runway_months,omitempty"`
	TopSellingItems []TopSellingItemResponse `json:"top_selling_items"`
}

type TopSellingItemResponse struct {
	ItemName  string  `json:"item_name"`
	TotalSold int     `json:"total_sold"`
	Revenue   float64 `json:"revenue"`
}

type InventorySummaryResponse struct {
	AsOfDate          string  `json:"as_of"`
	TotalItems        int     `json:"total_items"`
	TotalStockValue   float64 `json:"total_stock_value"`
	TotalAvailableQty int     `json:"total_available_qty"`
	AverageItemValue  float64 `json:"average_item_value"`
}

type LowStockItemsResponse struct {
	Threshold     int                   `json:"threshold"`
	LowStockItems []LowStockItemDetails `json:"low_stock_items"`
}

type LowStockItemDetails struct {
	ItemName     string `json:"item_name"`
	AvailableQty int    `json:"available_qty"`
}

type SalesTrendsResponse struct {
	Interval string          `json:"interval"`
	Trends   []SalesTrendRow `json:"trends"`
}

type SalesTrendRow struct {
	Period    string  `json:"period"`
	Revenue   float64 `json:"revenue"`
	UnitsSold int     `json:"units_sold"`
}
