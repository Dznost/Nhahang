using System.ComponentModel.DataAnnotations;

namespace RestaurantAPI.DTOs;

public class TableDTO
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Table number is required")]
    [StringLength(10, ErrorMessage = "Table number cannot exceed 10 characters")]
    public string TableNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Capacity is required")]
    [Range(1, 50, ErrorMessage = "Capacity must be between 1 and 50")]
    public int Capacity { get; set; }

    public string Status { get; set; } = "Available";

    [StringLength(50, ErrorMessage = "Location cannot exceed 50 characters")]
    public string? Location { get; set; }
}