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
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Menu API
export const menuAPI = {
    getAll: (categoryId) => api.get('/menu', { params: { categoryId } }),
    getById: (id) => api.get(`/menu/${id}`),
    create: (data) => api.post('/menu', data),
    update: (id, data) => api.put(`/menu/${id}`, data),
    delete: (id) => api.delete(`/menu/${id}`),
    getCategories: () => api.get('/menu/categories'),
    createCategory: (data) => api.post('/menu/categories', data),
};

// Order API
export const orderAPI = {
    getAll: (status) => api.get('/order', { params: { status } }),
    getById: (id) => api.get(`/order/${id}`),
    create: (data) => api.post('/order', data),
    updateStatus: (id, status) => api.put(`/order/${id}/status`, { status }),
    pay: (id, paymentMethod) => api.post(`/order/${id}/pay`, { paymentMethod }),
    cancel: (id) => api.delete(`/order/${id}`),
};

// Table API
export const tableAPI = {
    getAll: (status) => api.get('/table', { params: { status } }),
    getById: (id) => api.get(`/table/${id}`),
    getCurrentOrder: (id) => api.get(`/table/${id}/current-order`),
    create: (data) => api.post('/table', data),
    update: (id, data) => api.put(`/table/${id}`, data),
    updateStatus: (id, status) => api.put(`/table/${id}/status`, { status }),
    delete: (id) => api.delete(`/table/${id}`),
    getStatistics: () => api.get('/table/statistics'),
};

export default api;