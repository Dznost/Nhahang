using System.ComponentModel.DataAnnotations;

namespace RestaurantAPI.DTOs.Menu;

public class CreateMenuItemDTO
{
    [Required(ErrorMessage = "Menu item name is required")]
    [StringLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
    public string Name { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Price is required")]
    [Range(0, double.MaxValue, ErrorMessage = "Price must be a positive number")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Category is required")]
    public int CategoryId { get; set; }

    [Url(ErrorMessage = "Invalid URL format")]
    public string? ImageUrl { get; set; }

    public bool IsAvailable { get; set; } = true;
}