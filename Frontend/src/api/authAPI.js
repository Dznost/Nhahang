import API from './axiosConfig';

export const authAPI = {
    login: (credentials) => API.post('/auth/login', credentials),
    register: (userData) => API.post('/auth/register', userData),
    getCurrentUser: () => API.get('/auth/current'),
    changePassword: (data) => API.put('/auth/change-password', data)
};