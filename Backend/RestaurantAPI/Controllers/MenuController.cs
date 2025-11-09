using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Data;
using RestaurantAPI.Models;
using RestaurantAPI.DTOs.Menu;

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
    public async Task<ActionResult<IEnumerable<MenuItemDTO>>> GetMenuItems([FromQuery] int? categoryId)
    {
        var query = _context.MenuItems.Include(m => m.Category).AsQueryable();

        if (categoryId.HasValue)
        {
            query = query.Where(m => m.CategoryId == categoryId.Value);
        }

        var items = await query.Where(m => m.IsAvailable).ToListAsync();

        var result = items.Select(m => new MenuItemDTO
        {
            Id = m.Id,
            Name = m.Name,
            Description = m.Description,
            Price = m.Price,
            CategoryId = m.CategoryId,
            CategoryName = m.Category.Name,
            ImageUrl = m.ImageUrl,
            IsAvailable = m.IsAvailable,
            CreatedAt = m.CreatedAt
        });

        return Ok(result);
    }

    // GET: api/menu/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MenuItemDTO>> GetMenuItem(int id)
    {
        var menuItem = await _context.MenuItems
            .Include(m => m.Category)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (menuItem == null)
        {
            return NotFound(new { message = "Menu item not found" });
        }

        var result = new MenuItemDTO
        {
            Id = menuItem.Id,
            Name = menuItem.Name,
            Description = menuItem.Description,
            Price = menuItem.Price,
            CategoryId = menuItem.CategoryId,
            CategoryName = menuItem.Category.Name,
            ImageUrl = menuItem.ImageUrl,
            IsAvailable = menuItem.IsAvailable,
            CreatedAt = menuItem.CreatedAt
        };

        return Ok(result);
    }

    // POST: api/menu
    [HttpPost]
    public async Task<ActionResult<MenuItemDTO>> CreateMenuItem(CreateMenuItemDTO request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Validate category exists
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists)
        {
            return BadRequest(new { message = "Category not found" });
        }

        var menuItem = new Menu
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            CategoryId = request.CategoryId,
            ImageUrl = request.ImageUrl,
            IsAvailable = request.IsAvailable,
            CreatedAt = DateTime.UtcNow
        };

        _context.MenuItems.Add(menuItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMenuItem), new { id = menuItem.Id },
            await GetMenuItem(menuItem.Id));
    }

    // PUT: api/menu/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMenuItem(int id, CreateMenuItemDTO request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var menuItem = await _context.MenuItems.FindAsync(id);
        if (menuItem == null)
        {
            return NotFound(new { message = "Menu item not found" });
        }

        // Validate category exists
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists)
        {
            return BadRequest(new { message = "Category not found" });
        }

        menuItem.Name = request.Name;
        menuItem.Description = request.Description;
        menuItem.Price = request.Price;
        menuItem.CategoryId = request.CategoryId;
        menuItem.ImageUrl = request.ImageUrl;
        menuItem.IsAvailable = request.IsAvailable;

        await _context.SaveChangesAsync();

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

        // Soft delete
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