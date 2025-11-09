import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/authAPI';
import { useNotification } from './NotificationContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showError, showSuccess } = useNotification();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { token, ...userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            showSuccess('Đăng nhập thành công!');
            return { success: true };
        } catch (error) {
            showError(error.response?.data?.message || 'Đăng nhập thất bại');
            return { success: false, error };
        }
    };

    const register = async (userData) => {
        try {
            await authAPI.register(userData);
            showSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
            return { success: true };
        } catch (error) {
            showError(error.response?.data?.message || 'Đăng ký thất bại');
            return { success: false, error };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        showSuccess('Đăng xuất thành công');
    };

    const isAdmin = () => user?.role === 'Admin';
    const isCustomer = () => user?.role === 'Customer';

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            isAdmin,
            isCustomer
        }}>
            {children}
        </AuthContext.Provider>
    );
};