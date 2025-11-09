namespace RestaurantAPI.DTOs.Order;

public class CreateOrderDTO
{
    public int TableId { get; set; }
    public int? CustomerId { get; set; }
    public string? Notes { get; set; }
    public List<CreateOrderItemDTO> Items { get; set; } = new();
}

public class CreateOrderItemDTO
{
    public int MenuId { get; set; }
    public int Quantity { get; set; }
    public string? Notes { get; set; }
}