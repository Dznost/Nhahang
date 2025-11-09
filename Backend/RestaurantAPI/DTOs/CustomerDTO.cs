using System.ComponentModel.DataAnnotations;

namespace RestaurantAPI.DTOs;

public class CustomerDTO
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Customer name is required")]
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Phone is required")]
    [Phone(ErrorMessage = "Invalid phone format")]
    public string Phone { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string? Email { get; set; }

    public int LoyaltyPoints { get; set; }
    public DateTime CreatedAt { get; set; }
}