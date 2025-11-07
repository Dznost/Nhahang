using Microsoft.EntityFrameworkCore;
using RestaurantAPI.Models;

namespace RestaurantAPI.Data;

public class RestaurantDbContext : DbContext
{
    public RestaurantDbContext(DbContextOptions<RestaurantDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Menu> MenuItems { get; set; }
    public DbSet<Table> Tables { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderDetail> OrderDetails { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<Employee> Employees { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
        });

        // Menu
        modelBuilder.Entity<Menu>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Price).HasColumnType("decimal(10,2)");

            entity.HasOne(e => e.Category)
                  .WithMany(c => c.MenuItems)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Table
        modelBuilder.Entity<Table>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TableNumber).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Status).HasMaxLength(20);
        });

        // Customer
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Phone).IsRequired().HasMaxLength(20);
        });

        // Order
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(10,2)");
            entity.Property(e => e.Status).HasMaxLength(20);

            entity.HasOne(e => e.Table)
                  .WithMany(t => t.Orders)
                  .HasForeignKey(e => e.TableId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Customer)
                  .WithMany(c => c.Orders)
                  .HasForeignKey(e => e.CustomerId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // OrderDetail
        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Price).HasColumnType("decimal(10,2)");

            entity.HasOne(e => e.Order)
                  .WithMany(o => o.OrderDetails)
                  .HasForeignKey(e => e.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Menu)
                  .WithMany(m => m.OrderDetails)
                  .HasForeignKey(e => e.MenuId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Payment
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasColumnType("decimal(10,2)");

            entity.HasOne(e => e.Order)
                  .WithOne(o => o.Payment)
                  .HasForeignKey<Payment>(e => e.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Reservation
        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Status).HasMaxLength(20);

            entity.HasOne(e => e.Customer)
                  .WithMany(c => c.Reservations)
                  .HasForeignKey(e => e.CustomerId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Table)
                  .WithMany(t => t.Reservations)
                  .HasForeignKey(e => e.TableId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Employee
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
        });
    }
}