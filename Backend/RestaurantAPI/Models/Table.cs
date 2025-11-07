namespace RestaurantAPI.Models;

public class Table
{
    public int Id { get; set; }
    public string TableNumber { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string Status { get; set; } = "Available"; // Available, Occupied, Reserved
    public string? Location { get; set; } // Indoor, Outdoor, VIP

    // Navigation
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
}