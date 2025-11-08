using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using RestaurantAPI.Data;
using RestaurantAPI.Models;

namespace RestaurantAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly RestaurantDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(RestaurantDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.FullName) ||
                string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin" });
            }

            // Check if username exists
            var existingUser = await _context.Employees
                .FirstOrDefaultAsync(e => e.Username == request.Username);

            if (existingUser != null)
            {
                return BadRequest(new { message = "Tên đăng nhập đã tồn tại" });
            }

            // Check if email exists
            var existingEmail = await _context.Employees
                .FirstOrDefaultAsync(e => e.Email == request.Email);

            if (existingEmail != null)
            {
                return BadRequest(new { message = "Email đã được sử dụng" });
            }

            // Validate password length
            if (request.Password.Length < 6)
            {
                return BadRequest(new { message = "Mật khẩu phải có ít nhất 6 ký tự" });
            }

            // Validate role
            var validRoles = new[] { "Admin", "Manager", "Staff", "Chef" };
            if (!validRoles.Contains(request.Role))
            {
                return BadRequest(new { message = "Vai trò không hợp lệ" });
            }

            // Create new employee
            var employee = new Employee
            {
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FullName = request.FullName,
                Email = request.Email,
                Phone = request.Phone,
                Role = request.Role,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            // Generate token
            var token = GenerateJwtToken(employee);

            return Ok(new
            {
                token,
                employee = new
                {
                    employee.Id,
                    employee.Username,
                    employee.FullName,
                    employee.Email,
                    employee.Phone,
                    employee.Role
                }
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Register error: {ex.Message}");
            return StatusCode(500, new { message = "Đã xảy ra lỗi khi đăng ký", error = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Username == request.Username);

            if (employee == null)
            {
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng" });
            }

            if (!employee.IsActive)
            {
                return Unauthorized(new { message = "Tài khoản đã bị vô hiệu hóa" });
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, employee.PasswordHash);

            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng" });
            }

            var token = GenerateJwtToken(employee);

            return Ok(new
            {
                token,
                employee = new
                {
                    employee.Id,
                    employee.Username,
                    employee.FullName,
                    employee.Email,
                    employee.Phone,
                    employee.Role
                }
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Login error: {ex.Message}");
            return StatusCode(500, new { message = "Đã xảy ra lỗi khi đăng nhập", error = ex.Message });
        }
    }

    private string GenerateJwtToken(Employee employee)
    {
        var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ??
                       _configuration["JWT_SECRET"] ??
                       "eZOZZ2XhtQz9Bxw/z5GKWAhlWy/vgSkC6yEVWmF8JZY=";

        var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ??
                       _configuration["JWT_ISSUER"] ??
                       "RestaurantAPI";

        var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ??
                         _configuration["JWT_AUDIENCE"] ??
                         "RestaurantClient";

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, employee.Id.ToString()),
            new Claim(ClaimTypes.Name, employee.Username),
            new Claim(ClaimTypes.Email, employee.Email),
            new Claim(ClaimTypes.Role, employee.Role)
        };

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

// Request DTOs
public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Role { get; set; } = "Staff";
}