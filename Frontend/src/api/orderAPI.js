import API from './axiosConfig';

export const orderAPI = {
    getAll: () => API.get('/order'),
    getById: (id) => API.get(`/order/${id}`),
    create: (data) => API.post('/order', data),
    update: (id, data) => API.put(`/order/${id}`, data),
    delete: (id) => API.delete(`/order/${id}`),
    updatePayment: (id, paymentData) => API.put(`/order/${id}/payment`, paymentData)
};