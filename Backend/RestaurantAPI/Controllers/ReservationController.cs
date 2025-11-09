using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.Models;
using RestaurantAPI.DTOs;

namespace RestaurantAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationController : ControllerBase
{
    private readonly RestaurantDbContext _context;

    public ReservationController(RestaurantDbContext context)
    {
        _context = context;
    }

    // GET: api/reservation
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReservationDTO>>> GetReservations(
        [FromQuery] string? status,
        [FromQuery] DateTime? date)
    {
        var query = _context.Reservations
            .Include(r => r.Customer)
            .Include(r => r.Table)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(r => r.Status == status);
        }

        if (date.HasValue)
        {
            var startDate = date.Value.Date;
            var endDate = startDate.AddDays(1);
            query = query.Where(r => r.ReservationDate >= startDate && r.ReservationDate < endDate);
        }

        var reservations = await query.OrderByDescending(r => r.ReservationDate).ToListAsync();

        var result = reservations.Select(r => new ReservationDTO
        {
            Id = r.Id,
            CustomerId = r.CustomerId,
            CustomerName = r.Customer.Name,
            TableId = r.TableId,
            TableNumber = r.Table.TableNumber,
            ReservationDate = r.ReservationDate,
            NumberOfGuests = r.NumberOfGuests,
            Status = r.Status,
            Notes = r.Notes,
            CreatedAt = r.CreatedAt
        });

        return Ok(result);
    }

    // GET: api/reservation/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ReservationDTO>> GetReservation(int id)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Customer)
            .Include(r => r.Table)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (reservation == null)
        {
            return NotFound(new { message = "Reservation not found" });
        }

        var result = new ReservationDTO
        {
            Id = reservation.Id,
            CustomerId = reservation.CustomerId,
            CustomerName = reservation.Customer.Name,
            TableId = reservation.TableId,
            TableNumber = reservation.Table.TableNumber,
            ReservationDate = reservation.ReservationDate,
            NumberOfGuests = reservation.NumberOfGuests,
            Status = reservation.Status,
            Notes = reservation.Notes,
            CreatedAt = reservation.CreatedAt
        };

        return Ok(result);
    }

    // POST: api/reservation
    [HttpPost]
    public async Task<ActionResult<ReservationDTO>> CreateReservation(CreateReservationDTO request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var customer = await _context.Customers.FindAsync(request.CustomerId);
        if (customer == null)
        {
            return BadRequest(new { message = "Customer not found" });
        }

        var table = await _context.Tables.FindAsync(request.TableId);
        if (table == null)
        {
            return BadRequest(new { message = "Table not found" });
        }

        if (request.NumberOfGuests > table.Capacity)
        {
            return BadRequest(new { message = $"Table capacity is {table.Capacity}, cannot accommodate {request.NumberOfGuests} guests" });
        }

        if (request.ReservationDate <= DateTime.UtcNow)
        {
            return BadRequest(new { message = "Reservation date must be in the future" });
        }

        var conflictingReservation = await _context.Reservations
            .AnyAsync(r =>
                r.TableId == request.TableId &&
                r.Status != "Cancelled" &&
                r.ReservationDate.Date == request.ReservationDate.Date &&
                Math.Abs((r.ReservationDate - request.ReservationDate).TotalHours) < 2
            );

        if (conflictingReservation)
        {
            return BadRequest(new { message = "Table is already reserved for this time slot" });
        }

        var reservation = new Reservation
        {
            CustomerId = request.CustomerId,
            TableId = request.TableId,
            ReservationDate = request.ReservationDate,
            NumberOfGuests = request.NumberOfGuests,
            Status = "Pending",
            Notes = request.Notes,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reservations.Add(reservation);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id },
            await GetReservation(reservation.Id));
    }

    // PUT: api/reservation/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateReservation(int id, CreateReservationDTO request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var reservation = await _context.Reservations.FindAsync(id);
        if (reservation == null)
        {
            return NotFound(new { message = "Reservation not found" });
        }

        if (reservation.Status == "Completed" || reservation.Status == "Cancelled")
        {
            return BadRequest(new { message = "Cannot update completed or cancelled reservation" });
        }

        var customer = await _context.Customers.FindAsync(request.CustomerId);
        if (customer == null)
        {
            return BadRequest(new { message = "Customer not found" });
        }

        var table = await _context.Tables.FindAsync(request.TableId);
        if (table == null)
        {
            return BadRequest(new { message = "Table not found" });
        }

        if (request.NumberOfGuests > table.Capacity)
        {
            return BadRequest(new { message = $"Table capacity is {table.Capacity}" });
        }

        reservation.CustomerId = request.CustomerId;
        reservation.TableId = request.TableId;
        reservation.ReservationDate = request.ReservationDate;
        reservation.NumberOfGuests = request.NumberOfGuests;
        reservation.Notes = request.Notes;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT: api/reservation/5/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateReservationStatus(int id, [FromBody] UpdateReservationStatusRequest request)
    {
        if (string.IsNullOrEmpty(request.Status))
        {
            return BadRequest(new { message = "Status is required" });
        }

        var reservation = await _context.Reservations
            .Include(r => r.Table)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (reservation == null)
        {
            return NotFound(new { message = "Reservation not found" });
        }

        var validStatuses = new[] { "Pending", "Confirmed", "Cancelled", "Completed" };
        if (!validStatuses.Contains(request.Status))
        {
            return BadRequest(new { message = "Invalid status" });
        }

        reservation.Status = request.Status;

        if (request.Status == "Confirmed")
        {
            reservation.Table.Status = "Reserved";
        }
        else if (request.Status == "Cancelled" || request.Status == "Completed")
        {
            reservation.Table.Status = "Available";
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Reservation status updated", status = reservation.Status });
    }

    // DELETE: api/reservation/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReservation(int id)
    {
        var reservation = await _context.Reservations
            .Include(r => r.Table)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (reservation == null)
        {
            return NotFound(new { message = "Reservation not found" });
        }

        if (reservation.Status != "Pending" && reservation.Status != "Cancelled")
        {
            return BadRequest(new { message = "Only pending or cancelled reservations can be deleted" });
        }

        if (reservation.Table.Status == "Reserved")
        {
            reservation.Table.Status = "Available";
        }

        _context.Reservations.Remove(reservation);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/reservation/upcoming
    [HttpGet("upcoming")]
    public async Task<ActionResult<IEnumerable<ReservationDTO>>> GetUpcomingReservations()
    {
        var now = DateTime.UtcNow;
        var reservations = await _context.Reservations
            .Include(r => r.Customer)
            .Include(r => r.Table)
            .Where(r => r.ReservationDate >= now && r.Status != "Cancelled" && r.Status != "Completed")
            .OrderBy(r => r.ReservationDate)
            .Take(10)
            .ToListAsync();

        var result = reservations.Select(r => new ReservationDTO
        {
            Id = r.Id,
            CustomerId = r.CustomerId,
            CustomerName = r.Customer.Name,
            TableId = r.TableId,
            TableNumber = r.Table.TableNumber,
            ReservationDate = r.ReservationDate,
            NumberOfGuests = r.NumberOfGuests,
            Status = r.Status,
            Notes = r.Notes,
            CreatedAt = r.CreatedAt
        });

        return Ok(result);
    }
}

// Request DTO - ĐẶT NGOÀI CLASS
public class UpdateReservationStatusRequest
{
    public string Status { get; set; } = string.Empty;
}