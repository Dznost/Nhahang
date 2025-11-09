import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import CustomerLayout from '../layouts/CustomerLayout';

// Public Pages - SỬA LẠI ĐƯỜNG DẪN
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import MenuPage from '../pages/public/MenuPage';

// Customer Pages
import CustomerDashboard from '../pages/customer/CustomerDashboard';
import MyOrders from '../pages/customer/MyOrders';
import ProfilePage from '../pages/customer/ProfilePage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import MenuManagement from '../pages/admin/MenuManagement';
import OrderManagement from '../pages/admin/OrderManagement';
import TableManagement from '../pages/admin/TableManagement';

import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/menu" element={<MenuPage />} />
            </Route>

            {/* Customer Routes */}
            <Route element={<PrivateRoute><CustomerLayout /></PrivateRoute>}>
                <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                <Route path="/customer/orders" element={<MyOrders />} />
                <Route path="/customer/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/menu" element={<MenuManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
                <Route path="/admin/tables" element={<TableManagement />} />
            </Route>

            {/* 404 */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
};

export default AppRoutes;