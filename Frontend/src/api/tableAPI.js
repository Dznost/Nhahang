import API from './axiosConfig';

export const tableAPI = {
    getAll: () => API.get('/table'),
    getById: (id) => API.get(`/table/${id}`),
    create: (data) => API.post('/table', data),
    update: (id, data) => API.put(`/table/${id}`, data),
    delete: (id) => API.delete(`/table/${id}`),
    getStatistics: () => API.get('/table/statistics')
};