namespace RestaurantAPI.DTOs;

public class DashboardDTO
{
    public int TotalOrders { get; set; }
    public int PendingOrders { get; set; }
    public int PreparingOrders { get; set; }
    public int ServedOrders { get; set; }
    public decimal TodayRevenue { get; set; }
    public decimal MonthRevenue { get; set; }
    public int AvailableTables { get; set; }
    public int OccupiedTables { get; set; }
    public List<RecentOrderDTO> RecentOrders { get; set; } = new();
}

public class RecentOrderDTO
{
    public int Id { get; set; }
    public string TableNumber { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
}

public class RevenueStatistics
{
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public decimal AverageOrderValue { get; set; }
    public List<DailyRevenue> DailyRevenue { get; set; } = new();
}

public class DailyRevenue
{
    public DateTime Date { get; set; }
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
}

public class PopularItemDTO
{
    public int MenuId { get; set; }
    public string MenuName { get; set; } = string.Empty;
    public int TotalOrdered { get; set; }
    public decimal TotalRevenue { get; set; }
}
