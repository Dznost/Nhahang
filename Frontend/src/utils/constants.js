// Order statuses
export const ORDER_STATUS = {
    PENDING: 'Pending',
    PREPARING: 'Preparing',
    SERVED: 'Served',
    PAID: 'Paid',
    CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.PENDING]: 'Chờ xử lý',
    [ORDER_STATUS.PREPARING]: 'Đang chuẩn bị',
    [ORDER_STATUS.SERVED]: 'Đã phục vụ',
    [ORDER_STATUS.PAID]: 'Đã thanh toán',
    [ORDER_STATUS.CANCELLED]: 'Đã hủy',
};

// Table statuses
export const TABLE_STATUS = {
    AVAILABLE: 'Available',
    OCCUPIED: 'Occupied',
    RESERVED: 'Reserved',
};

export const TABLE_STATUS_LABELS = {
    [TABLE_STATUS.AVAILABLE]: 'Trống',
    [TABLE_STATUS.OCCUPIED]: 'Có khách',
    [TABLE_STATUS.RESERVED]: 'Đã đặt',
};

// User roles
export const USER_ROLES = {
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    STAFF: 'Staff',
    CHEF: 'Chef',
};

// Payment methods
export const PAYMENT_METHODS = {
    CASH: 'Cash',
    CARD: 'Card',
    MOMO: 'MoMo',
    ZALOPAY: 'ZaloPay',
};

export const PAYMENT_METHOD_LABELS = {
    [PAYMENT_METHODS.CASH]: 'Tiền mặt',
    [PAYMENT_METHODS.CARD]: 'Thẻ',
    [PAYMENT_METHODS.MOMO]: 'MoMo',
    [PAYMENT_METHODS.ZALOPAY]: 'ZaloPay',
};

// Table locations
export const TABLE_LOCATIONS = {
    INDOOR: 'Indoor',
    OUTDOOR: 'Outdoor',
    VIP: 'VIP',
};

export const TABLE_LOCATION_LABELS = {
    [TABLE_LOCATIONS.INDOOR]: 'Trong nhà',
    [TABLE_LOCATIONS.OUTDOOR]: 'Ngoài trời',
    [TABLE_LOCATIONS.VIP]: 'VIP',
};

// Pagination
export const ITEMS_PER_PAGE = 10;
export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Local storage keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    CART: 'cart',
    THEME: 'theme',
};

// Date formats
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';
export const TIME_FORMAT = 'HH:mm';