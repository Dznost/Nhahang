namespace RestaurantAPI.Models;

public class Order
{
    public int Id { get; set; }
    public int TableId { get; set; }
    public int? CustomerId { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Preparing, Served, Paid, Cancelled
    public string? Notes { get; set; }

    // Navigation
    public Table Table { get; set; } = null!;
    public Customer? Customer { get; set; }
    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    public Payment? Payment { get; set; }
}