using RestaurantAPI.Models;

namespace RestaurantAPI.Data;

public static class DbInitializer
{
    public static void Initialize(RestaurantDbContext context)
    {
        // Đảm bảo database đã được tạo
        context.Database.EnsureCreated();

        // Kiểm tra đã có dữ liệu chưa
        if (context.Categories.Any())
        {
            return; // DB đã có dữ liệu
        }

        // Seed Categories
        var categories = new Category[]
        {
            new Category { Name = "Món khai vị", Description = "Các món ăn khai vị" },
            new Category { Name = "Món chính", Description = "Các món ăn chính" },
            new Category { Name = "Món tráng miệng", Description = "Các món tráng miệng" },
            new Category { Name = "Đồ uống", Description = "Các loại đồ uống" },
            new Category { Name = "Món ăn nhanh", Description = "Fast food" }
        };
        context.Categories.AddRange(categories);
        context.SaveChanges();

        // Seed Menu Items
        var menuItems = new Menu[]
        {
            // Món khai vị
            new Menu
            {
                Name = "Gỏi cuốn",
                Description = "Gỏi cuốn tôm thịt",
                Price = 30000,
                CategoryId = categories[0].Id,
                ImageUrl = "/images/goi-cuon.jpg",
                IsAvailable = true
            },
            new Menu
            {
                Name = "Nem rán",
                Description = "Nem rán giòn",
                Price = 35000,
                CategoryId = categories[0].Id,
                ImageUrl = "/images/nem-ran.jpg",
                IsAvailable = true
            },

            // Món chính
            new Menu
            {
                Name = "Phở bò",
                Description = "Phở bò Hà Nội",
                Price = 55000,
                CategoryId = categories[1].Id,
                ImageUrl = "/images/pho-bo.jpg",
                IsAvailable = true
            },
            new Menu
            {
                Name = "Cơm tấm",
                Description = "Cơm tấm sườn bì chả",
                Price = 45000,
                CategoryId = categories[1].Id,
                ImageUrl = "/images/com-tam.jpg",
                IsAvailable = true
            },
            new Menu
            {
                Name = "Bún chả",
                Description = "Bún chả Hà Nội",
                Price = 50000,
                CategoryId = categories[1].Id,
                ImageUrl = "/images/bun-cha.jpg",
                IsAvailable = true
            },
            new Menu
            {
                Name = "Mì Quảng",
                Description = "Mì Quảng đặc sản",
                Price = 48000,
                CategoryId = categories[1].Id,
                ImageUrl = "/images/mi-quang.jpg",
                IsAvailable = true
            },

            // Món tráng miệng
            new Menu
            {
                Name = "Chè ba màu",
                Description = "Chè ba màu truyền thống",
                Price = 20000,
                CategoryId = categories[2].Id,
                ImageUrl = "/images/che-ba-mau.jpg",
                IsAvailable = true
            },
            new Menu
            {
                Name = "Bánh flan",
                Description = "Bánh flan caramel",
                Price = 15000,
                CategoryId = categories[2].Id,
                ImageUrl = "/images/banh-flan.jpg",
                IsAvailable = true
            },

            // Đồ uống
            new Menu
            {
                Name = "Trà đá",
                Description = "Trà đá miễn phí",
                Price = 0,
                CategoryId = categories[3].Id,
                ImageUrl = "/images/tra-da.jpg",
                IsAvailable = true
            },
            new Menu
            {
                Name = "Nước cam",
                Description = "Nước cam tươi",
                Price = 25000,
                CategoryId = categories[3].Id,
                ImageUrl = "/images/nuoc-cam.jpg",
                IsAvailable = true
            },
            new Menu
            {
                Name = "Cà phê sữa đá",
                Description = "Cà phê sữa đá truyền thống",
                Price = 22000,
                CategoryId = categories[3].Id,
                ImageUrl = "/images/ca-phe.jpg",
                IsAvailable = true
            },
            new Menu
            {
                Name = "Sinh tố bơ",
                Description = "Sinh tố bơ béo ngậy",
                Price = 30000,
                CategoryId = categories[3].Id,
                ImageUrl = "/images/sinh-to-bo.jpg",
                IsAvailable = true
            }
        };
        context.MenuItems.AddRange(menuItems);
        context.SaveChanges();

        // Seed Tables
        var tables = new Table[]
        {
            new Table { TableNumber = "T01", Capacity = 2, Status = "Available", Location = "Indoor" },
            new Table { TableNumber = "T02", Capacity = 2, Status = "Available", Location = "Indoor" },
            new Table { TableNumber = "T03", Capacity = 4, Status = "Available", Location = "Indoor" },
            new Table { TableNumber = "T04", Capacity = 4, Status = "Available", Location = "Indoor" },
            new Table { TableNumber = "T05", Capacity = 6, Status = "Available", Location = "Indoor" },
            new Table { TableNumber = "T06", Capacity = 6, Status = "Available", Location = "Outdoor" },
            new Table { TableNumber = "T07", Capacity = 8, Status = "Available", Location = "VIP" },
            new Table { TableNumber = "T08", Capacity = 10, Status = "Available", Location = "VIP" }
        };
        context.Tables.AddRange(tables);
        context.SaveChanges();

        // Seed Customers (mẫu)
        var customers = new Customer[]
        {
            new Customer
            {
                Name = "Nguyễn Văn A",
                Phone = "0901234567",
                Email = "nguyenvana@email.com",
                LoyaltyPoints = 100
            },
            new Customer
            {
                Name = "Trần Thị B",
                Phone = "0912345678",
                Email = "tranthib@email.com",
                LoyaltyPoints = 50
            },
            new Customer
            {
                Name = "Lê Văn C",
                Phone = "0923456789",
                Email = "levanc@email.com",
                LoyaltyPoints = 200
            }
        };
        context.Customers.AddRange(customers);
        context.SaveChanges();

        // Seed Employees (cho authentication)
        var employees = new Employee[]
        {
            new Employee
            {
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                FullName = "Administrator",
                Email = "admin@restaurant.com",
                Phone = "0900000000",
                Role = "Admin",
                IsActive = true
            },
            new Employee
            {
                Username = "manager",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("manager123"),
                FullName = "Quản lý",
                Email = "manager@restaurant.com",
                Phone = "0900000001",
                Role = "Manager",
                IsActive = true
            },
            new Employee
            {
                Username = "staff",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("staff123"),
                FullName = "Nhân viên",
                Email = "staff@restaurant.com",
                Phone = "0900000002",
                Role = "Staff",
                IsActive = true
            }
        };
        context.Employees.AddRange(employees);
        context.SaveChanges();

        Console.WriteLine("✅ Database seeded successfully!");
    }
}