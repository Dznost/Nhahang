namespace RestaurantAPI.DTOs.Auth;

public class TokenDTO
{
    public string Token { get; set; } = string.Empty;
    public EmployeeDTO Employee { get; set; } = null!;
}