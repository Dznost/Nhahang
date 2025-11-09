import { useState, useEffect } from 'react';
import { orderAPI } from '../../api/orderAPI';
import { menuAPI } from '../../api/menuAPI';
import { tableAPI } from '../../api/tableAPI';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalMenuItems: 0,
        availableTables: 0,
        occupiedTables: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [ordersRes, menuRes, tablesRes] = await Promise.all([
                orderAPI.getAll(),
                menuAPI.getAll(),
                tableAPI.getStatistics()
            ]);

            const orders = ordersRes.data;
            const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

            setStats({
                totalOrders: orders.length,
                totalRevenue: totalRevenue,
                totalCustomers: new Set(orders.map(o => o.customerId)).size,
                totalMenuItems: menuRes.data.length,
                availableTables: tablesRes.data.available || 0,
                occupiedTables: tablesRes.data.occupied || 0
            });

            setRecentOrders(orders.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Đang tải...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

            {/* Statistics Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Tổng đơn hàng</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
                        </div>
                        <div className="text-4xl">📦</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Doanh thu</p>
                            <p className="text-3xl font-bold text-green-600">
                                {stats.totalRevenue.toLocaleString('vi-VN')}đ
                            </p>
                        </div>
                        <div className="text-4xl">💰</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Khách hàng</p>
                            <p className="text-3xl font-bold text-purple-600">{stats.totalCustomers}</p>
                        </div>
                        <div className="text-4xl">👥</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Món ăn</p>
                            <p className="text-3xl font-bold text-orange-600">{stats.totalMenuItems}</p>
                        </div>
                        <div className="text-4xl">🍽️</div>
                    </div>
                </div>
            </div>

            {/* Tables Status */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Trạng thái bàn</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Bàn trống</span>
                            <span className="text-2xl font-bold text-green-600">{stats.availableTables}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Bàn đang sử dụng</span>
                            <span className="text-2xl font-bold text-red-600">{stats.occupiedTables}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Thống kê nhanh</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Đơn hôm nay</span>
                            <span className="font-bold">{stats.totalOrders}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Doanh thu hôm nay</span>
                            <span className="font-bold">{stats.totalRevenue.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4">Đơn hàng gần đây</h2>
                {recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Mã đơn</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Ngày</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Tổng tiền</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.orderId} className="border-t">
                                        <td className="px-6 py-4">#{order.orderId}</td>
                                        <td className="px-6 py-4">
                                            {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4">{order.totalAmount.toLocaleString('vi-VN')}đ</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded text-sm ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-600">Chưa có đơn hàng nào</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;