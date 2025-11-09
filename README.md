Nhahang/
├── Backend/
│   ├── RestaurantAPI.sln
│   ├── RestaurantAPI/
│   │   ├── Properties/
│   │   │   └── launchSettings.json
│   │   ├── certs/
│   │   │   └── ca.pem
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs
│   │   │   ├── CustomerController.cs
│   │   │   ├── DashboardController.cs
│   │   │   ├── EmployeeController.cs
│   │   │   ├── MenuController.cs
│   │   │   ├── OrderController.cs
│   │   │   ├── ReservationController.cs
│   │   │   └── TableController.cs
│   │   ├── Data/
│   │   │   ├── DbInitializer.cs
│   │   │   └── RestaurantDbContext.cs
│   │   ├── DTOs/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginDTO.cs
│   │   │   │   ├── RegisterDTO.cs
│   │   │   │   └── TokenDTO.cs
│   │   │   ├── Menu/
│   │   │   │   ├── CreateMenuItemDTO.cs
│   │   │   │   └── MenuItemDTO.cs
│   │   │   ├── Order/
│   │   │   │   ├── CreateOrderDTO.cs
│   │   │   │   ├── OrderDTO.cs
│   │   │   │   └── OrderResponseDTO.cs
│   │   │   ├── CreateReservationDTO.cs
│   │   │   ├── CustomerDTO.cs
│   │   │   ├── DashboardDTO.cs
│   │   │   ├── EmployeeDTO.cs
│   │   │   ├── ReservationDTO.cs
│   │   │   ├── TableDTO.cs
│   │   │   └── UpdateReservationStatusRequest.cs
│   │   ├── Helpers/
│   │   │   ├── JwtHelper.cs
│   │   │   ├── PaginationHelper.cs
│   │   │   └── PasswordHelper.cs
│   │   ├── Middleware/
│   │   │   ├── ErrorHandlingMiddleware.cs
│   │   │   └── JwtMiddleware.cs
│   │   ├── Migrations/
│   │   │   ├── RestaurantDbContextModelSnapshot.cs
│   │   │   ├── 20251109135428_InitialCreate.cs
│   │   │   └── 20251109135428_InitialCreate.Designer.cs
│   │   ├── Models/
│   │   │   ├── Category.cs
│   │   │   ├── Customer.cs
│   │   │   ├── Employee.cs
│   │   │   ├── Menu.cs
│   │   │   ├── Order.cs
│   │   │   ├── OrderDetail.cs
│   │   │   ├── Payment.cs
│   │   │   ├── Reservation.cs
│   │   │   └── Table.cs
│   │   ├── Repositories/
│   │   │   ├── IRepository.cs
│   │   │   ├── Repository.cs
│   │   │   └── UnitOfWork.cs
│   │   ├── Services/
│   │   │   ├── AuthService.cs
│   │   │   ├── EmailService.cs
│   │   │   ├── IAuthService.cs
│   │   │   ├── IOrderService.cs
│   │   │   └── OrderService.cs
│   │   ├── .env.example
│   │   ├── appsettings.json
│   │   ├── Program.cs
│   │   └── RestaurantAPI.csproj
│   │
│   └── RestaurantAPI.Tests/
│       └── RestaurantAPI.Tests.csproj
│
└── Frontend/
    ├── .env.example
    ├── .gitignore
    ├── .npmrc
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── README.md
    ├── tailwind.config.js
    ├── vite.config.js
    └── src/
        ├── api/
        │   ├── authAPI.js
        │   ├── axiosConfig.js
        │   ├── customerAPI.js
        │   ├── employeeAPI.js
        │   ├── menuAPI.js
        │   ├── orderAPI.js
        │   ├── reservationAPI.js
        │   └── tableAPI.js
        │
        ├── assets/
        │
        ├── components/
        │   ├── dashboard/
        │   │   ├── RecentOrders.jsx
        │   │   ├── RevenueChart.jsx
        │   │   └── StatCard.jsx
        │   ├── cart/
        │   │   ├── CartDrawer.jsx
        │   │   ├── CartItem.jsx
        │   │   └── CartSummary.jsx
        │   ├── common/
        │   │   ├── Button.jsx
        │   │   ├── Card.jsx
        │   │   ├── Input.jsx
        │   │   ├── Loading.jsx
        │   │   ├── Modal.jsx
        │   │   └── SearchBar.jsx
        │   ├── menu/
        │   │   ├── MenuCard.jsx
        │   │   ├── MenuFilter.jsx
        │   │   ├── MenuForm.jsx
        │   │   ├── MenuGrid.jsx
        │   │   └── MenuItem.jsx
        │   ├── order/
        │   │   ├── CreateOrderModal.jsx
        │   │   ├── OrderCard.jsx
        │   │   ├── OrderDetail.jsx
        │   │   ├── OrderList.jsx
        │   │   └── OrderStatusBadge.jsx
        │   └── table/
        │       ├── TableCard.jsx
        │       ├── TableForm.jsx
        │       ├── TableGrid.jsx
        │       └── TableStatusBadge.jsx
        │
        ├── contexts/
        │   ├── AuthContext.jsx
        │   ├── CartContext.jsx
        │   └── NotificationContext.jsx
        │
        ├── hooks/
        │   ├── useAuth.js
        │   ├── useCart.js
        │   ├── useDebounce.js
        │   ├── useMenu.js
        │   └── useOrders.js
        │
        ├── layouts/
        │   ├── AdminLayout.jsx
        │   ├── CustomerLayout.jsx
        │   └── MainLayout.jsx
        │
        ├── pages/
        │   ├── admin/
        │   │   ├── AdminDashboard.jsx
        │   │   ├── CustomerManagement.jsx
        │   │   ├── EmployeeManagement.jsx
        │   │   ├── MenuManagement.jsx
        │   │   ├── OrderManagement.jsx
        │   │   ├── ReservationManagement.jsx
        │   │   └── TableManagement.jsx
        │   ├── customer/
        │   │   ├── CustomerDashboard.jsx
        │   │   ├── MyOrders.jsx
        │   │   ├── MyReservations.jsx
        │   │   └── ProfilePage.jsx
        │   └── public/
        │       ├── HomePage.jsx
        │       ├── LoginPage.jsx
        │       ├── MenuPage.jsx
        │       ├── RegisterPage.jsx
        │       └── NotFoundPage.jsx
        │
        ├── routes/
        │   ├── AdminRoute.jsx
        │   ├── index.jsx
        │   └── PrivateRoute.jsx
        │
        ├── types/
        │   └── index.js
        │
        ├── utils/
        │
        ├── App.jsx
        └── main.jsx
Các API tôi đã hoàn thành : 
🕵️‍♂️ Auth
•	POST /api/auth/register
•	POST /api/auth/login
•	GET /api/auth/me
________________________________________
👤 Customer
•	GET /api/Customer
•	POST /api/Customer
•	GET /api/Customer/{id}
•	PUT /api/Customer/{id}
•	DELETE /api/Customer/{id}
•	GET /api/Customer/{id}/orders
•	POST /api/Customer/{id}/loyalty
________________________________________
📊 Dashboard
•	GET /api/Dashboard/statistics
•	GET /api/Dashboard/revenue
•	GET /api/Dashboard/popular-items
________________________________________
👨‍🍳 Employee
•	GET /api/Employee
•	GET /api/Employee/{id}
•	PUT /api/Employee/{id}
•	DELETE /api/Employee/{id}
•	PUT /api/Employee/{id}/toggle-active
•	POST /api/Employee/{id}/reset-password
________________________________________
🍔 Menu
•	GET /api/Menu
•	POST /api/Menu
•	GET /api/Menu/{id}
•	PUT /api/Menu/{id}

