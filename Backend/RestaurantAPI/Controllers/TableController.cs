using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.Models;
using RestaurantAPI.DTOs;

namespace RestaurantAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TableController : ControllerBase
{
    private readonly RestaurantDbContext _context;

    public TableController(RestaurantDbContext context)
    {
        _context = context;
    }

    // GET: api/table
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TableDTO>>> GetTables([FromQuery] string? status)
    {
        var query = _context.Tables.AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(t => t.Status == status);
        }

        var tables = await query.OrderBy(t => t.TableNumber).ToListAsync();

        var result = tables.Select(t => new TableDTO
        {
            Id = t.Id,
            TableNumber = t.TableNumber,
            Capacity = t.Capacity,
            Status = t.Status,
            Location = t.Location
        });

        return Ok(result);
    }

    // GET: api/table/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TableDTO>> GetTable(int id)
    {
        var table = await _context.Tables.FindAsync(id);

        if (table == null)
        {
            return NotFound(new { message = "Table not found" });
        }

        var result = new TableDTO
        {
            Id = table.Id,
            TableNumber = table.TableNumber,
            Capacity = table.Capacity,
            Status = table.Status,
            Location = table.Location
        };

        return Ok(result);
    }

    // GET: api/table/5/current-order
    [HttpGet("{id}/current-order")]
    public async Task<ActionResult<Order>> GetCurrentOrder(int id)
    {
        var order = await _context.Orders
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Menu)
            .Include(o => o.Customer)
            .Where(o => o.TableId == id && o.Status != "Paid" && o.Status != "Cancelled")
            .OrderByDescending(o => o.OrderDate)
            .FirstOrDefaultAsync();

        if (order == null)
        {
            return NotFound(new { message = "No active order for this table" });
        }

        return Ok(order);
    }

    // POST: api/table
    [HttpPost]
    public async Task<ActionResult<TableDTO>> CreateTable(TableDTO request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Check if table number already exists
        var exists = await _context.Tables.AnyAsync(t => t.TableNumber == request.TableNumber);
        if (exists)
        {
            return BadRequest(new { message = "Table number already exists" });
        }

        var table = new Table
        {
            TableNumber = request.TableNumber,
            Capacity = request.Capacity,
            Status = "Available",
            Location = request.Location
        };

        _context.Tables.Add(table);
        await _context.SaveChangesAsync();

        var result = new TableDTO
        {
            Id = table.Id,
            TableNumber = table.TableNumber,
            Capacity = table.Capacity,
            Status = table.Status,
            Location = table.Location
        };

        return CreatedAtAction(nameof(GetTable), new { id = table.Id }, result);
    }

    // PUT: api/table/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTable(int id, TableDTO request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var table = await _context.Tables.FindAsync(id);
        if (table == null)
        {
            return NotFound(new { message = "Table not found" });
        }

        // Check if new table number already exists (excluding current table)
        var exists = await _context.Tables
            .AnyAsync(t => t.TableNumber == request.TableNumber && t.Id != id);
        if (exists)
        {
            return BadRequest(new { message = "Table number already exists" });
        }

        table.TableNumber = request.TableNumber;
        table.Capacity = request.Capacity;
        table.Location = request.Location;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT: api/table/5/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateTableStatus(int id, [FromBody] UpdateTableStatusRequest request)
    {
        if (string.IsNullOrEmpty(request.Status))
        {
            return BadRequest(new { message = "Status is required" });
        }

        var table = await _context.Tables.FindAsync(id);
        if (table == null)
        {
            return NotFound(new { message = "Table not found" });
        }

        // Validate status
        var validStatuses = new[] { "Available", "Occupied", "Reserved" };
        if (!validStatuses.Contains(request.Status))
        {
            return BadRequest(new { message = "Invalid status" });
        }

        table.Status = request.Status;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Table status updated", status = table.Status });
    }

    // DELETE: api/table/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTable(int id)
    {
        var table = await _context.Tables.FindAsync(id);
        if (table == null)
        {
            return NotFound(new { message = "Table not found" });
        }

        // Check if table has active orders
        var hasActiveOrders = await _context.Orders
            .AnyAsync(o => o.TableId == id &&
                          o.Status != "Paid" &&
                          o.Status != "Cancelled");

        if (hasActiveOrders)
        {
            return BadRequest(new { message = "Cannot delete table with active orders" });
        }

        _context.Tables.Remove(table);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/table/statistics
    [HttpGet("statistics")]
    public async Task<ActionResult<TableStatistics>> GetTableStatistics()
    {
        var total = await _context.Tables.CountAsync();
        var available = await _context.Tables.CountAsync(t => t.Status == "Available");
        var occupied = await _context.Tables.CountAsync(t => t.Status == "Occupied");
        var reserved = await _context.Tables.CountAsync(t => t.Status == "Reserved");

        return Ok(new TableStatistics
        {
            Total = total,
            Available = available,
            Occupied = occupied,
            Reserved = reserved
        });
    }
}

// Request DTOs
public class UpdateTableStatusRequest
{
    public string Status { get; set; } = string.Empty;
}

public class TableStatistics
{
    public int Total { get; set; }
    public int Available { get; set; }
    public int Occupied { get; set; }
    public int Reserved { get; set; }
}