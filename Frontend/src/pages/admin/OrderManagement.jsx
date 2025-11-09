import { useState, useEffect } from 'react';
import { orderAPI } from '../../api/orderAPI';
import { useNotification } from '../../contexts/NotificationContext';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const { showSuccess, showError } = useNotification();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.getAll();
            setOrders(response.data);
        } catch (error) {
            showError('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (orderId) => {
        try {
            const response = await orderAPI.getById(orderId);
            setSelectedOrder(response.data);
            setShowDetailModal(true);
        } catch (error) {
            showError('Không thể tải chi tiết đơn hàng');
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await orderAPI.update(orderId, { status: newStatus });
            showSuccess('Cập nhật trạng thái thành công');
            fetchOrders();
        } catch (error) {
            showError('Cập nhật thất bại');
        }
    };

    const handleDelete = async (orderId) => {
        if (!confirm('Bạn có chắc muốn xóa đơn hàng này?')) return;

        try {
            await orderAPI.delete(orderId);
            showSuccess('Xóa đơn hàng thành công');
            fetchOrders();
        } catch (error) {
            showError('Xóa thất bại');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Processing': return 'bg-blue-100 text-blue-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="text-center py-12">Đang tải...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
                <div className="space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        📊 Thống kê
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Tổng đơn</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Đang xử lý</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {orders.filter(o => o.status === 'Processing').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Hoàn thành</p>
                    <p className="text-2xl font-bold text-green-600">
                        {orders.filter(o => o.status === 'Completed').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Tổng doanh thu</p>
                    <p className="text-2xl font-bold text-green-600">
                        {orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString('vi-VN')}đ
                    </p>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Mã đơn</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Ngày đặt</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Bàn</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Tổng tiền</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.orderId} className="border-t hover:bg-gray-50">
                                <td className="px-6 py-4">#{order.orderId}</td>
                                <td className="px-6 py-4">
                                    {new Date(order.orderDate).toLocaleString('vi-VN')}
                                </td>
                                <td className="px-6 py-4">Bàn {order.tableId}</td>
                                <td className="px-6 py-4 font-semibold">
                                    {order.totalAmount.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleUpdateStatus(order.orderId, e.target.value)}
                                        className={`px-3 py-1 rounded text-sm ${getStatusColor(order.status)}`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    <button
                                        onClick={() => handleViewDetail(order.orderId)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Chi tiết
                                    </button>
                                    <button
                                        onClick={() => handleDelete(order.orderId)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Chi tiết đơn hàng #{selectedOrder.orderId}</h2>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-600 hover:text-gray-900 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600">Ngày đặt:</p>
                                    <p className="font-semibold">
                                        {new Date(selectedOrder.orderDate).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Bàn:</p>
                                    <p className="font-semibold">Bàn {selectedOrder.tableId}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Trạng thái:</p>
                                    <span className={`px-3 py-1 rounded ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-gray-600">Tổng tiền:</p>
                                    <p className="font-bold text-xl text-green-600">
                                        {selectedOrder.totalAmount.toLocaleString('vi-VN')}đ
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold mb-2">Món đã đặt:</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left">Món</th>
                                                <th className="px-4 py-2 text-left">SL</th>
                                                <th className="px-4 py-2 text-left">Đơn giá</th>
                                                <th className="px-4 py-2 text-left">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.orderDetails?.map((detail, idx) => (
                                                <tr key={idx} className="border-t">
                                                    <td className="px-4 py-2">{detail.menuItem?.itemName}</td>
                                                    <td className="px-4 py-2">{detail.quantity}</td>
                                                    <td className="px-4 py-2">{detail.price.toLocaleString('vi-VN')}đ</td>
                                                    <td className="px-4 py-2">
                                                        {(detail.quantity * detail.price).toLocaleString('vi-VN')}đ
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;