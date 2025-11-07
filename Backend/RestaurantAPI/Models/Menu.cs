namespace RestaurantAPI.Models;

public class Menu
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Category Category { get; set; } = null!;
    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}