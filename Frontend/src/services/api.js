import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
    getCurrentUser: () => api.get('/auth/me'),
};

// Menu API
export const menuAPI = {
    getAll: () => api.get('/menu'),
    getById: (id) => api.get(`/menu/${id}`),
    getCategories: () => api.get('/menu/categories'),
};

// Table API
export const tableAPI = {
    getAll: () => api.get('/table'),
    getById: (id) => api.get(`/table/${id}`),
    updateStatus: (id, status) => api.patch(`/table/${id}/status`, { status }),
};

// Order API
export const orderAPI = {
    getAll: () => api.get('/order'),
    getById: (id) => api.get(`/order/${id}`),
    create: (data) => api.post('/order', data),
    updateStatus: (id, status) => api.patch(`/order/${id}/status`, { status }),
    pay: (id, paymentMethod) => api.post(`/order/${id}/pay`, { paymentMethod }),
};

export default api;