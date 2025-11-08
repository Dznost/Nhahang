import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { tableAPI, orderAPI, menuAPI } from '../services/api';
import {
    DollarSign,
    ShoppingCart,
    Users,
    UtensilsCrossed,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        availableTables: 0,
        totalMenuItems: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Load all data in parallel
            const [ordersRes, tablesRes, menuRes] = await Promise.all([
                orderAPI.getAll(),
                tableAPI.getAll(),
                menuAPI.getAll()
            ]);

            // Calculate stats
            const totalRevenue = ordersRes.data
                .filter(o => o.status === 'Paid')
                .reduce((sum, order) => sum + order.totalAmount, 0);

            const availableTables = tablesRes.data.filter(t => t.status === 'Available').length;

            setStats({
                totalRevenue: totalRevenue,
                totalOrders: ordersRes.data.length,
                availableTables: availableTables,
                totalMenuItems: menuRes.data.length,
            });

            // Get recent orders (last 5)
            setRecentOrders(ordersRes.data.slice(0, 5));
        } catch (error) {
            console.error('Error loading dashboard:', error);
            toast.error('Không thể tải dữ liệu dashboard');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Chờ xử lý' },
            'Preparing': { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Đang chuẩn bị' },
            'Served': { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Đã phục vụ' },
            'Paid': { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, label: 'Đã thanh toán' },
            'Cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Đã hủy' },
        };

        const config = statusConfig[status] || statusConfig['Pending'];
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3" />
                {config.label}
            </span>
        );
    };

    const statCards = [
        {
            title: 'Tổng doanh thu',
            value: formatCurrency(stats.totalRevenue),
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            title: 'Tổng đơn hàng',
            value: stats.totalOrders,
            icon: ShoppingCart,
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Bàn trống',
            value: stats.availableTables,
            icon: Users,
            color: 'from-purple-500 to-pink-600',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600'
        },
        {
            title: 'Món ăn',
            value: stats.totalMenuItems,
            icon: UtensilsCrossed,
            color: 'from-orange-500 to-red-600',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600'
        },
    ];

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Tổng quan hệ thống quản lý nhà hàng</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 ${card.bgColor} rounded-lg`}>
                                        <Icon className={`w-6 h-6 ${card.iconColor}`} />
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">Đơn hàng gần đây</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã đơn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Bàn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thời gian
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tổng tiền
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">
                                                    #{order.id.toString().padStart(4, '0')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">
                                                    {order.table?.tableNumber || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">
                                                    {formatDate(order.orderDate)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(order.totalAmount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(order.status)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            Chưa có đơn hàng nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}