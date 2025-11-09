using RestaurantAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace RestaurantAPI.Data;

public static class DbInitializer
{
    public static void Initialize(RestaurantDbContext context)
    {
        try
        {
            // Đảm bảo database đã được tạo
            context.Database.EnsureCreated();

            // Kiểm tra dữ liệu đã tồn tại chưa
            if (context.Categories.Any())
            {
                Console.WriteLine("📊 Database already seeded");
                return;
            }

            Console.WriteLine("🌱 Starting database seeding...");

            // -----------------------------
            // Seed Categories
            // -----------------------------
            var categories = new Category[]
            {
                new Category { Name = "Món khai vị", Description = "Các món ăn khai vị", CreatedAt = DateTime.UtcNow },
                new Category { Name = "Món chính", Description = "Các món ăn chính", CreatedAt = DateTime.UtcNow },
                new Category { Name = "Món tráng miệng", Description = "Các món tráng miệng", CreatedAt = DateTime.UtcNow },
                new Category { Name = "Đồ uống", Description = "Các loại đồ uống", CreatedAt = DateTime.UtcNow },
                new Category { Name = "Món ăn nhanh", Description = "Fast food", CreatedAt = DateTime.UtcNow }
            };
            context.Categories.AddRange(categories);
            context.SaveChanges();
            Console.WriteLine("✅ Seeded Categories");

            var categoryDict = context.Categories.ToDictionary(c => c.Name, c => c.Id);

            // -----------------------------
            // Seed Menus
            // -----------------------------
            var menus = new Menu[]
            {
                // Món khai vị
                new Menu { Name = "Gỏi cuốn", Description = "Gỏi cuốn tôm thịt", Price = 30000, CategoryId = categoryDict["Món khai vị"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Nem rán", Description = "Nem rán giòn", Price = 35000, CategoryId = categoryDict["Món khai vị"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Chả giò", Description = "Chả giò miền Nam", Price = 32000, CategoryId = categoryDict["Món khai vị"], IsAvailable = true, CreatedAt = DateTime.UtcNow },

                // Món chính
                new Menu { Name = "Phở bò", Description = "Phở bò Hà Nội", Price = 55000, CategoryId = categoryDict["Món chính"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Cơm tấm", Description = "Cơm tấm sườn bì chả", Price = 45000, CategoryId = categoryDict["Món chính"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Bún chả", Description = "Bún chả Hà Nội", Price = 50000, CategoryId = categoryDict["Món chính"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Mì Quảng", Description = "Mì Quảng đặc sản", Price = 48000, CategoryId = categoryDict["Món chính"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Bún bò Huế", Description = "Bún bò Huế cay", Price = 52000, CategoryId = categoryDict["Món chính"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Hủ tiếu", Description = "Hủ tiếu Nam Vang", Price = 47000, CategoryId = categoryDict["Món chính"], IsAvailable = true, CreatedAt = DateTime.UtcNow },

                // Món tráng miệng
                new Menu { Name = "Chè ba màu", Description = "Chè ba màu truyền thống", Price = 20000, CategoryId = categoryDict["Món tráng miệng"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Bánh flan", Description = "Bánh flan caramel", Price = 15000, CategoryId = categoryDict["Món tráng miệng"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Chè đậu xanh", Description = "Chè đậu xanh nước dừa", Price = 18000, CategoryId = categoryDict["Món tráng miệng"], IsAvailable = true, CreatedAt = DateTime.UtcNow },

                // Đồ uống
                new Menu { Name = "Trà đá", Description = "Trà đá miễn phí", Price = 0, CategoryId = categoryDict["Đồ uống"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Nước cam", Description = "Nước cam tươi", Price = 25000, CategoryId = categoryDict["Đồ uống"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Cà phê sữa đá", Description = "Cà phê sữa đá truyền thống", Price = 22000, CategoryId = categoryDict["Đồ uống"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Sinh tố bơ", Description = "Sinh tố bơ béo ngậy", Price = 30000, CategoryId = categoryDict["Đồ uống"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Nước dừa", Description = "Nước dừa tươi mát", Price = 20000, CategoryId = categoryDict["Đồ uống"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Trà sữa", Description = "Trà sữa trân châu", Price = 28000, CategoryId = categoryDict["Đồ uống"], IsAvailable = true, CreatedAt = DateTime.UtcNow },

                // Món ăn nhanh
                new Menu { Name = "Bánh mì thịt", Description = "Bánh mì thịt đặc biệt", Price = 25000, CategoryId = categoryDict["Món ăn nhanh"], IsAvailable = true, CreatedAt = DateTime.UtcNow },
                new Menu { Name = "Xôi gà", Description = "Xôi gà nóng hổi", Price = 30000, CategoryId = categoryDict["Món ăn nhanh"], IsAvailable = true, CreatedAt = DateTime.UtcNow }
            };
            context.MenuItems.AddRange(menus);
            context.SaveChanges();
            Console.WriteLine("✅ Seeded Menus");

            // -----------------------------
            // Seed Tables
            // -----------------------------
            var tables = new Table[]
            {
                new Table { TableNumber = "T01", Capacity = 2, Status = "Available", Location = "Indoor" },
                new Table { TableNumber = "T02", Capacity = 2, Status = "Available", Location = "Indoor" },
                new Table { TableNumber = "T03", Capacity = 4, Status = "Available", Location = "Indoor" },
                new Table { TableNumber = "T04", Capacity = 4, Status = "Available", Location = "Indoor" },
                new Table { TableNumber = "T05", Capacity = 6, Status = "Available", Location = "Indoor" },
                new Table { TableNumber = "T06", Capacity = 6, Status = "Available", Location = "Outdoor" },
                new Table { TableNumber = "T07", Capacity = 8, Status = "Available", Location = "VIP" },
                new Table { TableNumber = "T08", Capacity = 10, Status = "Available", Location = "VIP" },
                new Table { TableNumber = "T09", Capacity = 4, Status = "Available", Location = "Outdoor" },
                new Table { TableNumber = "T10", Capacity = 4, Status = "Available", Location = "Indoor" }
            };
            context.Tables.AddRange(tables);
            context.SaveChanges();
            Console.WriteLine("✅ Seeded Tables");

            // -----------------------------
            // Seed Employees
            // -----------------------------
            var employees = new Employee[]
            {
                new Employee { Username = "admin", PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"), FullName = "Administrator", Email = "admin@restaurant.com", Phone = "0900000000", Role = "Admin", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Employee { Username = "manager", PasswordHash = BCrypt.Net.BCrypt.HashPassword("manager123"), FullName = "Quản lý", Email = "manager@restaurant.com", Phone = "0900000001", Role = "Manager", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Employee { Username = "staff", PasswordHash = BCrypt.Net.BCrypt.HashPassword("staff123"), FullName = "Nhân viên", Email = "staff@restaurant.com", Phone = "0900000002", Role = "Staff", IsActive = true, CreatedAt = DateTime.UtcNow },
                new Employee { Username = "chef", PasswordHash = BCrypt.Net.BCrypt.HashPassword("chef123"), FullName = "Đầu bếp", Email = "chef@restaurant.com", Phone = "0900000003", Role = "Chef", IsActive = true, CreatedAt = DateTime.UtcNow }
            };
            context.Employees.AddRange(employees);
            context.SaveChanges();
            Console.WriteLine("✅ Seeded Employees");

            // -----------------------------
            // Seed Customers
            // -----------------------------
            var customers = new Customer[]
            {
                new Customer { Name = "Nguyễn Văn A", Phone = "0901234567", Email = "nguyenvana@email.com", LoyaltyPoints = 100, CreatedAt = DateTime.UtcNow },
                new Customer { Name = "Trần Thị B", Phone = "0912345678", Email = "tranthib@email.com", LoyaltyPoints = 50, CreatedAt = DateTime.UtcNow },
                new Customer { Name = "Lê Văn C", Phone = "0923456789", Email = "levanc@email.com", LoyaltyPoints = 200, CreatedAt = DateTime.UtcNow },
                new Customer { Name = "Phạm Thị D", Phone = "0934567890", Email = "phamthid@email.com", LoyaltyPoints = 75, CreatedAt = DateTime.UtcNow },
                new Customer { Name = "Hoàng Văn E", Phone = "0945678901", Email = "hoangvane@email.com", LoyaltyPoints = 150, CreatedAt = DateTime.UtcNow }
            };
            context.Customers.AddRange(customers);
            context.SaveChanges();
            Console.WriteLine("✅ Seeded Customers");

            Console.WriteLine("✅✅✅ Database seeded successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error seeding database: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            throw;
        }
    }
}
