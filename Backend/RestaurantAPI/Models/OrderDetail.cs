namespace RestaurantAPI.Models;

public class OrderDetail
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int MenuId { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public string? Notes { get; set; }

    // Navigation
    public Order Order { get; set; } = null!;
    public Menu Menu { get; set; } = null!;
}