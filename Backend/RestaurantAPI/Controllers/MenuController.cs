using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.Models;

namespace RestaurantAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuController : ControllerBase
{
    private readonly RestaurantDbContext _context;

    public MenuController(RestaurantDbContext context)
    {
        _context = context;
    }

    // GET: api/menu
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Menu>>> GetMenuItems([FromQuery] int? categoryId)
    {
        var query = _context.MenuItems.Include(m => m.Category).AsQueryable();

        if (categoryId.HasValue)
        {
            query = query.Where(m => m.CategoryId == categoryId.Value);
        }

        var items = await query.Where(m => m.IsAvailable).ToListAsync();
        return Ok(items);
    }

    // GET: api/menu/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Menu>> GetMenuItem(int id)
    {
        var menuItem = await _context.MenuItems
            .Include(m => m.Category)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (menuItem == null)
        {
            return NotFound(new { message = "Menu item not found" });
        }

        return Ok(menuItem);
    }

    // POST: api/menu
    [HttpPost]
    public async Task<ActionResult<Menu>> CreateMenuItem(Menu menuItem)
    {
        // Validate category exists
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == menuItem.CategoryId);
        if (!categoryExists)
        {
            return BadRequest(new { message = "Category not found" });
        }

        menuItem.CreatedAt = DateTime.UtcNow;
        _context.MenuItems.Add(menuItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMenuItem), new { id = menuItem.Id }, menuItem);
    }

    // PUT: api/menu/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMenuItem(int id, Menu menuItem)
    {
        if (id != menuItem.Id)
        {
            return BadRequest(new { message = "ID mismatch" });
        }

        _context.Entry(menuItem).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.MenuItems.AnyAsync(m => m.Id == id))
            {
                return NotFound(new { message = "Menu item not found" });
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/menu/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMenuItem(int id)
    {
        var menuItem = await _context.MenuItems.FindAsync(id);
        if (menuItem == null)
        {
            return NotFound(new { message = "Menu item not found" });
        }

        // Soft delete - just mark as unavailable
        menuItem.IsAvailable = false;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/menu/categories
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _context.Categories.ToListAsync();
        return Ok(categories);
    }

    // POST: api/menu/categories
    [HttpPost("categories")]
    public async Task<ActionResult<Category>> CreateCategory(Category category)
    {
        category.CreatedAt = DateTime.UtcNow;
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
    }
}