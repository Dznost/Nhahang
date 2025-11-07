namespace RestaurantAPI.Models;

public class Reservation
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public int TableId { get; set; }
    public DateTime ReservationDate { get; set; }
    public int NumberOfGuests { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled, Completed
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Customer Customer { get; set; } = null!;
    public Table Table { get; set; } = null!;
}