using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.Models;
using RestaurantAPI.DTOs;

namespace RestaurantAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase
{
    private readonly RestaurantDbContext _context;

    public CustomerController(RestaurantDbContext context)
    {
        _context = context;
    }

    // GET: api/customer
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerDTO>>> GetCustomers([FromQuery] string? search)
    {
        var query = _context.Customers.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(c =>
                c.Name.Contains(search) ||
                c.Phone.Contains(search) ||
                (c.Email != null && c.Email.Contains(search))
            );
        }

        var customers = await query.OrderByDescending(c => c.CreatedAt).ToListAsync();

        var result = customers.Select(c => new CustomerDTO
        {
            Id = c.Id,
            Name = c.Name,
            Phone = c.Phone,
            Email = c.Email,
            LoyaltyPoints = c.LoyaltyPoints,
            CreatedAt = c.CreatedAt
        });

        return Ok(result);
    }

    // GET: api/customer/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerDTO>> GetCustomer(int id)
    {
        var customer = await _context.Customers.FindAsync(id);

        if (customer == null)
        {
            return NotFound(new { message = "Customer not found" });
        }

        var result = new CustomerDTO
        {
            Id = customer.Id,
            Name = customer.Name,
            Phone = customer.Phone,
            Email = customer.Email,
            LoyaltyPoints = customer.LoyaltyPoints,
            CreatedAt = customer.CreatedAt
        };

        return Ok(result);
    }

    // POST: api/customer
    [HttpPost]
    public async Task<ActionResult<CustomerDTO>> CreateCustomer(CustomerDTO request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Check if phone already exists
        var exists = await _context.Customers.AnyAsync(c => c.Phone == request.Phone);
        if (exists)
        {
            return BadRequest(new { message = "Phone number already exists" });
        }

        var customer = new Customer
        {
            Name = request.Name,
            Phone = request.Phone,
            Email = request.Email,
            LoyaltyPoints = 0,
            CreatedAt = DateTime.UtcNow
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        var result = new CustomerDTO
        {
            Id = customer.Id,
            Name = customer.Name,
            Phone = customer.Phone,
            Email = customer.Email,
            LoyaltyPoints = customer.LoyaltyPoints,
            CreatedAt = customer.CreatedAt
        };

        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, result);
    }

    // PUT: api/customer/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(int id, CustomerDTO request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound(new { message = "Customer not found" });
        }

        // Check if new phone already exists (excluding current customer)
        var exists = await _context.Customers
            .AnyAsync(c => c.Phone == request.Phone && c.Id != id);
        if (exists)
        {
            return BadRequest(new { message = "Phone number already exists" });
        }

        customer.Name = request.Name;
        customer.Phone = request.Phone;
        customer.Email = request.Email;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/customer/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound(new { message = "Customer not found" });
        }

        // Check if customer has orders
        var hasOrders = await _context.Orders.AnyAsync(o => o.CustomerId == id);
        if (hasOrders)
        {
            return BadRequest(new { message = "Cannot delete customer with orders. Consider deactivating instead." });
        }

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/customer/5/orders
    [HttpGet("{id}/orders")]
    public async Task<ActionResult<IEnumerable<Order>>> GetCustomerOrders(int id)
    {
        var customer = await _context.Customers
            .Include(c => c.Orders)
                .ThenInclude(o => o.Table)
            .Include(c => c.Orders)
                .ThenInclude(o => o.OrderDetails)
                    .ThenInclude(od => od.Menu)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (customer == null)
        {
            return NotFound(new { message = "Customer not found" });
        }

        return Ok(customer.Orders.OrderByDescending(o => o.OrderDate));
    }

    // POST: api/customer/5/loyalty
    [HttpPost("{id}/loyalty")]
    public async Task<IActionResult> UpdateLoyaltyPoints(int id, [FromBody] LoyaltyRequest request)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound(new { message = "Customer not found" });
        }

        customer.LoyaltyPoints += request.Points;

        // Ensure loyalty points don't go negative
        if (customer.LoyaltyPoints < 0)
        {
            customer.LoyaltyPoints = 0;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Loyalty points updated",
            loyaltyPoints = customer.LoyaltyPoints
        });
    }
}

// Request DTO
public class LoyaltyRequest
{
    public int Points { get; set; }
}