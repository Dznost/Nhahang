using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.DTOs; // Thay đổi từ RestaurantAPI.DTOs.Employee
using System.ComponentModel.DataAnnotations;

namespace RestaurantAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeeController : ControllerBase
{
    private readonly RestaurantDbContext _context;

    public EmployeeController(RestaurantDbContext context)
    {
        _context = context;
    }

    // GET: api/employee
    [HttpGet]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<IEnumerable<EmployeeDTO>>> GetEmployees([FromQuery] bool? isActive)
    {
        var query = _context.Employees.AsQueryable();

        if (isActive.HasValue)
        {
            query = query.Where(e => e.IsActive == isActive.Value);
        }

        var employees = await query.OrderBy(e => e.FullName).ToListAsync();

        var result = employees.Select(e => new EmployeeDTO
        {
            Id = e.Id,
            Username = e.Username,
            FullName = e.FullName,
            Email = e.Email,
            Phone = e.Phone,
            Role = e.Role,
            IsActive = e.IsActive,
            CreatedAt = e.CreatedAt
        });

        return Ok(result);
    }

    // GET: api/employee/5
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<EmployeeDTO>> GetEmployee(int id)
    {
        var employee = await _context.Employees.FindAsync(id);

        if (employee == null)
        {
            return NotFound(new { message = "Employee not found" });
        }

        var result = new EmployeeDTO
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

        return Ok(result);
    }

    // PUT: api/employee/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateEmployee(int id, UpdateEmployeeDTO request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var employee = await _context.Employees.FindAsync(id);
        if (employee == null)
        {
            return NotFound(new { message = "Employee not found" });
        }

        // Check email uniqueness
        var emailExists = await _context.Employees
            .AnyAsync(e => e.Email == request.Email && e.Id != id);
        if (emailExists)
        {
            return BadRequest(new { message = "Email already exists" });
        }

        employee.FullName = request.FullName;
        employee.Email = request.Email;
        employee.Phone = request.Phone;
        employee.Role = request.Role;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT: api/employee/5/toggle-active
    [HttpPut("{id}/toggle-active")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleEmployeeActive(int id)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null)
        {
            return NotFound(new { message = "Employee not found" });
        }

        // Prevent disabling the last admin
        if (employee.Role == "Admin" && employee.IsActive)
        {
            var activeAdminCount = await _context.Employees
                .CountAsync(e => e.Role == "Admin" && e.IsActive);

            if (activeAdminCount <= 1)
            {
                return BadRequest(new { message = "Cannot disable the last active admin" });
            }
        }

        employee.IsActive = !employee.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = employee.IsActive ? "Employee activated" : "Employee deactivated",
            isActive = employee.IsActive
        });
    }

    // DELETE: api/employee/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null)
        {
            return NotFound(new { message = "Employee not found" });
        }

        // Prevent deleting the last admin
        if (employee.Role == "Admin")
        {
            var adminCount = await _context.Employees.CountAsync(e => e.Role == "Admin");
            if (adminCount <= 1)
            {
                return BadRequest(new { message = "Cannot delete the last admin" });
            }
        }

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/employee/5/reset-password
    [HttpPost("{id}/reset-password")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ResetPassword(int id, [FromBody] ResetPasswordRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var employee = await _context.Employees.FindAsync(id);
        if (employee == null)
        {
            return NotFound(new { message = "Employee not found" });
        }

        employee.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Password reset successfully" });
    }
}

// Request DTOs
public class UpdateEmployeeDTO
{
    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Phone]
    public string Phone { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "Staff";
}

public class ResetPasswordRequest
{
    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string NewPassword { get; set; } = string.Empty;
}
