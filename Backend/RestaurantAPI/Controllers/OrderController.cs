using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.Models;
using RestaurantAPI.DTOs.Order;

namespace RestaurantAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly RestaurantDbContext _context;

    public OrderController(RestaurantDbContext context)
    {
        _context = context;
    }

    // GET: api/order
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders([FromQuery] string? status)
    {
        var query = _context.Orders
            .Include(o => o.Table)
            .Include(o => o.Customer)
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Menu)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(o => o.Status == status);
        }

        var orders = await query.OrderByDescending(o => o.OrderDate).ToListAsync();

        var result = orders.Select(o => new OrderDTO
        {
            Id = o.Id,
            TableId = o.TableId,
            TableNumber = o.Table.TableNumber,
            CustomerId = o.CustomerId,
            CustomerName = o.Customer?.Name,
            OrderDate = o.OrderDate,
            TotalAmount = o.TotalAmount,
            Status = o.Status,
            Notes = o.Notes,
            OrderDetails = o.OrderDetails.Select(od => new OrderDetailDTO
            {
                Id = od.Id,
                MenuId = od.MenuId,
                MenuName = od.Menu.Name,
                Quantity = od.Quantity,
                Price = od.Price,
                Notes = od.Notes
            }).ToList()
        });

        return Ok(result);
    }

    // GET: api/order/5
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDTO>> GetOrder(int id)
    {
        var order = await _context.Orders
            .Include(o => o.Table)
            .Include(o => o.Customer)
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Menu)
            .Include(o => o.Payment)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        var result = new OrderDTO
        {
            Id = order.Id,
            TableId = order.TableId,
            TableNumber = order.Table.TableNumber,
            CustomerId = order.CustomerId,
            CustomerName = order.Customer?.Name,
            OrderDate = order.OrderDate,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            Notes = order.Notes,
            OrderDetails = order.OrderDetails.Select(od => new OrderDetailDTO
            {
                Id = od.Id,
                MenuId = od.MenuId,
                MenuName = od.Menu.Name,
                Quantity = od.Quantity,
                Price = od.Price,
                Notes = od.Notes
            }).ToList()
        };

        return Ok(result);
    }

    // POST: api/order
    [HttpPost]
    public async Task<ActionResult<OrderResponseDTO>> CreateOrder(CreateOrderDTO request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Validate table exists and available
        var table = await _context.Tables.FindAsync(request.TableId);
        if (table == null)
        {
            return BadRequest(new { message = "Table not found" });
        }

        // Create order
        var order = new Order
        {
            TableId = request.TableId,
            CustomerId = request.CustomerId,
            OrderDate = DateTime.UtcNow,
            Status = "Pending",
            Notes = request.Notes,
            OrderDetails = new List<OrderDetail>()
        };

        // Add order details
        decimal totalAmount = 0;
        foreach (var item in request.Items)
        {
            var menuItem = await _context.MenuItems.FindAsync(item.MenuId);
            if (menuItem == null || !menuItem.IsAvailable)
            {
                return BadRequest(new { message = $"Menu item {item.MenuId} not available" });
            }

            var orderDetail = new OrderDetail
            {
                MenuId = item.MenuId,
                Quantity = item.Quantity,
                Price = menuItem.Price,
                Notes = item.Notes
            };

            order.OrderDetails.Add(orderDetail);
            totalAmount += menuItem.Price * item.Quantity;
        }

        order.TotalAmount = totalAmount;

        // Update table status
        table.Status = "Occupied";

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id },
            new OrderResponseDTO
            {
                Id = order.Id,
                TableId = order.TableId,
                TableNumber = table.TableNumber,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                Message = "Order created successfully"
            });
    }

    // PUT: api/order/5/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        if (string.IsNullOrEmpty(request.Status))
        {
            return BadRequest(new { message = "Status is required" });
        }

        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        // Validate status transition
        var validStatuses = new[] { "Pending", "Preparing", "Served", "Paid", "Cancelled" };
        if (!validStatuses.Contains(request.Status))
        {
            return BadRequest(new { message = "Invalid status" });
        }

        order.Status = request.Status;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Order status updated", status = order.Status });
    }

    // POST: api/order/5/pay
    [HttpPost("{id}/pay")]
    public async Task<ActionResult<Payment>> PayOrder(int id, [FromBody] PaymentRequest request)
    {
        var order = await _context.Orders
            .Include(o => o.Table)
            .Include(o => o.Payment)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        if (order.Status == "Paid")
        {
            return BadRequest(new { message = "Order already paid" });
        }

        if (order.Payment != null)
        {
            return BadRequest(new { message = "Payment already exists" });
        }

        // Create payment
        var payment = new Payment
        {
            OrderId = id,
            Amount = order.TotalAmount,
            PaymentMethod = request.PaymentMethod ?? "Cash",
            PaymentDate = DateTime.UtcNow,
            Status = "Completed"
        };

        _context.Payments.Add(payment);

        // Update order status
        order.Status = "Paid";

        // Free table
        order.Table.Status = "Available";

        await _context.SaveChangesAsync();

        return Ok(payment);
    }

    // DELETE: api/order/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelOrder(int id)
    {
        var order = await _context.Orders
            .Include(o => o.Table)
            .Include(o => o.Payment)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        if (order.Status == "Paid")
        {
            return BadRequest(new { message = "Cannot cancel paid order" });
        }

        if (order.Payment != null)
        {
            return BadRequest(new { message = "Cannot cancel order with payment" });
        }

        order.Status = "Cancelled";
        order.Table.Status = "Available";

        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// Request DTOs
public class UpdateStatusRequest
{
    public string Status { get; set; } = string.Empty;
}

public class PaymentRequest
{
    public string? PaymentMethod { get; set; } = "Cash";
}