namespace RestaurantAPI.DTOs.Order;

public class OrderDTO
{
    public int Id { get; set; }
    public int TableId { get; set; }
    public string TableNumber { get; set; } = string.Empty;
    public int? CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public List<OrderDetailDTO> OrderDetails { get; set; } = new();
}

public class OrderDetailDTO
{
    public int Id { get; set; }
    public int MenuId { get; set; }
    public string MenuName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string? Notes { get; set; }
}