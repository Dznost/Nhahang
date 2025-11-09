using System;
using System.ComponentModel.DataAnnotations;

namespace RestaurantAPI.DTOs
{
	public class CreateReservationDTO
	{
		[Required]
		public int CustomerId { get; set; }

		[Required]
		public int TableId { get; set; }

		[Required]
		public DateTime ReservationDate { get; set; }

		[Required]
		[Range(1, 50, ErrorMessage = "Number of guests must be between 1 and 50.")]
		public int NumberOfGuests { get; set; }

		public string? Status { get; set; } = "Pending"; // Mặc định Pending
		public string? Notes { get; set; }
	}
}
