import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await authAPI.login(username, password);
            const { token, employee } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(employee));
            setUser(employee);

            toast.success(`Chào mừng ${employee.fullName}!`);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
            throw error;
        }
    };

    const register = async (formData) => {
        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, ...registerData } = formData;

            const response = await authAPI.register(registerData);
            const { token, employee } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(employee));
            setUser(employee);

            toast.success(`Đăng ký thành công! Chào mừng ${employee.fullName}!`);
            return response.data;
        } catch (error) {
            console.error('Register error:', error);
            toast.error(error.response?.data?.message || 'Đăng ký thất bại');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Đã đăng xuất');
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};