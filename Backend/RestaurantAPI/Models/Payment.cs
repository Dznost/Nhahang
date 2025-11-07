namespace RestaurantAPI.Models;

public class Payment
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = "Cash"; // Cash, Card, MoMo, ZaloPay
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Completed"; // Pending, Completed, Failed

    // Navigation
    public Order Order { get; set; } = null!;
}