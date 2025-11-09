using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using RestaurantAPI.Data;
using RestaurantAPI.Models;
using RestaurantAPI.DTOs;
using RestaurantAPI.DTOs.Auth;

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

    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<ActionResult<TokenDTO>> Register(RegisterDTO request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Check if username exists
        if (await _context.Employees.AnyAsync(e => e.Username == request.Username))
        {
            return BadRequest(new { message = "Username already exists" });
        }

        // Check if email exists
        if (await _context.Employees.AnyAsync(e => e.Email == request.Email))
        {
            return BadRequest(new { message = "Email already exists" });
        }

        // Create employee
        var employee = new Employee
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FullName = request.FullName,
            Email = request.Email,
            Phone = request.Phone,
            Role = "Staff",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        // Generate token
        var token = GenerateJwtToken(employee);

        return Ok(new TokenDTO
        {
            Token = token,
            Employee = MapToEmployeeDTO(employee)
        });
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<ActionResult<TokenDTO>> Login(LoginDTO request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Username == request.Username);

        if (employee == null)
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, employee.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        if (!employee.IsActive)
        {
            return Unauthorized(new { message = "Account is disabled" });
        }

        var token = GenerateJwtToken(employee);

        return Ok(new TokenDTO
        {
            Token = token,
            Employee = MapToEmployeeDTO(employee)
        });
    }

    // GET: api/auth/me
    [HttpGet("me")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<ActionResult<EmployeeDTO>> GetCurrentUser()
    {
        var username = User.FindFirst(ClaimTypes.Name)?.Value;

        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized();
        }

        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Username == username);

        if (employee == null)
        {
            return NotFound(new { message = "User not found" });
        }

        return Ok(MapToEmployeeDTO(employee));
    }

    // Helper methods
    private string GenerateJwtToken(Employee employee)
    {
        var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? _configuration["Jwt:Key"];
        var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
            ?? _configuration["Jwt:Issuer"];
        var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
            ?? _configuration["Jwt:Audience"];

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, employee.Id.ToString()),
            new Claim(ClaimTypes.Name, employee.Username),
            new Claim(ClaimTypes.Email, employee.Email),
            new Claim(ClaimTypes.Role, employee.Role),
            new Claim("FullName", employee.FullName)
        };

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(60),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private EmployeeDTO MapToEmployeeDTO(Employee employee)
    {
        return new EmployeeDTO
        {
            Id = employee.Id,
            Username = employee.Username,
            FullName = employee.FullName,
            Email = employee.Email,
            Phone = employee.Phone,
            Role = employee.Role,
            IsActive = employee.IsActive,
            CreatedAt = employee.CreatedAt
        };
    }
}