namespace RestaurantAPI.DTOs.Order;

public class OrderResponseDTO
{
    public int Id { get; set; }
    public int TableId { get; set; }
    public string TableNumber { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}