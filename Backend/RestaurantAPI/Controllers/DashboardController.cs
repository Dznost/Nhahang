using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.DTOs;

namespace RestaurantAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly RestaurantDbContext _context;

    public DashboardController(RestaurantDbContext context)
    {
        _context = context;
    }

    // GET: api/dashboard/statistics
    [HttpGet("statistics")]
    public async Task<ActionResult<DashboardDTO>> GetStatistics()
    {
        var today = DateTime.UtcNow.Date;
        var startOfMonth = new DateTime(today.Year, today.Month, 1);

        // Get all orders
        var allOrders = await _context.Orders.ToListAsync();

        // Calculate statistics
        var totalOrders = allOrders.Count;
        var pendingOrders = allOrders.Count(o => o.Status == "Pending");
        var preparingOrders = allOrders.Count(o => o.Status == "Preparing");
        var servedOrders = allOrders.Count(o => o.Status == "Served");

        // Today's revenue
        var todayRevenue = allOrders
            .Where(o => o.OrderDate.Date == today && o.Status == "Paid")
            .Sum(o => o.TotalAmount);

        // Month's revenue
        var monthRevenue = allOrders
            .Where(o => o.OrderDate >= startOfMonth && o.Status == "Paid")
            .Sum(o => o.TotalAmount);

        // Table statistics
        var availableTables = await _context.Tables.CountAsync(t => t.Status == "Available");
        var occupiedTables = await _context.Tables.CountAsync(t => t.Status == "Occupied");

        // Recent orders
        var recentOrders = await _context.Orders
            .Include(o => o.Table)
            .OrderByDescending(o => o.OrderDate)
            .Take(5)
            .Select(o => new RecentOrderDTO
            {
                Id = o.Id,
                TableNumber = o.Table.TableNumber,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                OrderDate = o.OrderDate
            })
            .ToListAsync();

        return Ok(new DashboardDTO
        {
            TotalOrders = totalOrders,
            PendingOrders = pendingOrders,
            PreparingOrders = preparingOrders,
            ServedOrders = servedOrders,
            TodayRevenue = todayRevenue,
            MonthRevenue = monthRevenue,
            AvailableTables = availableTables,
            OccupiedTables = occupiedTables,
            RecentOrders = recentOrders
        });
    }

    // GET: api/dashboard/revenue
    [HttpGet("revenue")]
    public async Task<ActionResult<object>> GetRevenue([FromQuery] string period = "week")
    {
        var now = DateTime.UtcNow.Date;
        DateTime startDate;

        switch (period.ToLower())
        {
            case "week":
                startDate = now.AddDays(-7);
                break;
            case "month":
                startDate = now.AddDays(-30);
                break;
            case "year":
                startDate = now.AddYears(-1);
                break;
            default:
                startDate = now.AddDays(-7);
                break;
        }

        var orders = await _context.Orders
            .Where(o => o.OrderDate >= startDate && o.Status == "Paid")
            .GroupBy(o => o.OrderDate.Date)
            .Select(g => new
            {
                Date = g.Key,
                Revenue = g.Sum(o => o.TotalAmount),
                OrderCount = g.Count()
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/dashboard/popular-items
    [HttpGet("popular-items")]
    public async Task<ActionResult<object>> GetPopularItems([FromQuery] int limit = 10)
    {
        var popularItems = await _context.OrderDetails
            .Include(od => od.Menu)
            .GroupBy(od => new { od.MenuId, od.Menu.Name })
            .Select(g => new
            {
                MenuId = g.Key.MenuId,
                MenuName = g.Key.Name,
                TotalQuantity = g.Sum(od => od.Quantity),
                TotalRevenue = g.Sum(od => od.Price * od.Quantity),
                OrderCount = g.Count()
            })
            .OrderByDescending(x => x.TotalQuantity)
            .Take(limit)
            .ToListAsync();

        return Ok(popularItems);
    }
}