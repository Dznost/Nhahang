import API from './axiosConfig';

export const menuAPI = {
    getAll: () => API.get('/menu'),
    getById: (id) => API.get(`/menu/${id}`),
    create: (data) => API.post('/menu', data),
    update: (id, data) => API.put(`/menu/${id}`, data),
    delete: (id) => API.delete(`/menu/${id}`),
    getByCategory: (categoryId) => API.get(`/menu/category/${categoryId}`)
};