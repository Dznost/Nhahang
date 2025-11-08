import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { orderAPI, menuAPI, tableAPI } from '../services/api';
import {
    Plus,
    Eye,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    ChefHat,
    Filter,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [formData, setFormData] = useState({
        tableId: '',
        customerId: null,
        notes: '',
        items: []
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [ordersRes, menuRes, tablesRes] = await Promise.all([
                orderAPI.getAll(),
                menuAPI.getAll(),
                tableAPI.getAll()
            ]);
            setOrders(ordersRes.data);
            setMenuItems(menuRes.data);
            setTables(tablesRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filterStatus === 'all') return true;
        return order.status === filterStatus;
    });

    const handleCreateOrder = async (e) => {
        e.preventDefault();

        if (formData.items.length === 0) {
            toast.error('Vui lòng chọn ít nhất 1 món');
            return;
        }

        try {
            await orderAPI.create(formData);
            toast.success('Tạo đơn hàng thành công!');
            loadData();
            closeCreateModal();
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Không thể tạo đơn hàng');
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await orderAPI.updateStatus(orderId, newStatus);
            toast.success('Cập nhật trạng thái thành công!');
            loadData();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const handlePayOrder = async (orderId) => {
        try {
            await orderAPI.pay(orderId, { paymentMethod: 'Cash' });
            toast.success('Thanh toán thành công!');
            loadData();
        } catch (error) {
            console.error('Error paying order:', error);
            toast.error('Không thể thanh toán đơn hàng');
        }
    };

    const openCreateModal = () => {
        setFormData({
            tableId: tables.find(t => t.status === 'Available')?.id.toString() || '',
            customerId: null,
            notes: '',
            items: []
        });
        setShowCreateModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
    };

    const openDetailModal = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedOrder(null);
    };

    const addMenuItem = (menuId) => {
        const existingItem = formData.items.find(item => item.menuId === parseInt(menuId));

        if (existingItem) {
            setFormData({
                ...formData,
                items: formData.items.map(item =>
                    item.menuId === parseInt(menuId)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            });
        } else {
            const menuItem = menuItems.find(m => m.id === parseInt(menuId));
            setFormData({
                ...formData,
                items: [...formData.items, {
                    menuId: parseInt(menuId),
                    quantity: 1,
                    notes: '',
                    price: menuItem?.price || 0
                }]
            });
        }
    };

    const updateItemQuantity = (menuId, quantity) => {
        if (quantity <= 0) {
            setFormData({
                ...formData,
                items: formData.items.filter(item => item.menuId !== menuId)
            });
        } else {
            setFormData({
                ...formData,
                items: formData.items.map(item =>
                    item.menuId === menuId ? { ...item, quantity } : item
                )
            });
        }
    };

    const getTotalAmount = () => {
        return formData.items.reduce((sum, item) => {
            const menuItem = menuItems.find(m => m.id === item.menuId);
            return sum + (menuItem?.price || 0) * item.quantity;
        }, 0);
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

    const getStatusConfig = (status) => {
        const config = {
            'Pending': {
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                icon: Clock,
                label: 'Chờ xử lý',
                nextStatus: 'Preparing',
                nextLabel: 'Bắt đầu nấu'
            },
            'Preparing': {
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: ChefHat,
                label: 'Đang chuẩn bị',
                nextStatus: 'Served',
                nextLabel: 'Đã phục vụ'
            },
            'Served': {
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: CheckCircle,
                label: 'Đã phục vụ',
                nextStatus: null,
                nextLabel: 'Thanh toán'
            },
            'Paid': {
                color: 'bg-gray-100 text-gray-800 border-gray-200',
                icon: DollarSign,
                label: 'Đã thanh toán',
                nextStatus: null,
                nextLabel: null
            },
            'Cancelled': {
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: XCircle,
                label: 'Đã hủy',
                nextStatus: null,
                nextLabel: null
            },
        };
        return config[status] || config['Pending'];
    };

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        preparing: orders.filter(o => o.status === 'Preparing').length,
        served: orders.filter(o => o.status === 'Served').length,
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải đơn hàng...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý đơn hàng</h1>
                        <p className="text-gray-600">Theo dõi và xử lý đơn hàng</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                        <Plus className="w-5 h-5" />
                        Tạo đơn mới
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Tổng đơn</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Chờ xử lý</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Đang nấu</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.preparing}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <ChefHat className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Đã phục vụ</p>
                                <p className="text-3xl font-bold text-green-600">{stats.served}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'all'
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Tất cả ({orders.length})
                        </button>
                        <button
                            onClick={() => setFilterStatus('Pending')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'Pending'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Chờ xử lý ({stats.pending})
                        </button>
                        <button
                            onClick={() => setFilterStatus('Preparing')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'Preparing'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Đang nấu ({stats.preparing})
                        </button>
                        <button
                            onClick={() => setFilterStatus('Served')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'Served'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Đã phục vụ ({stats.served})
                        </button>
                        <button
                            onClick={() => setFilterStatus('Paid')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'Paid'
                                    ? 'bg-gray-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Đã thanh toán
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);
                        const Icon = statusConfig.icon;

                        return (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-800">
                                                Đơn hàng #{order.id.toString().padStart(4, '0')}
                                            </h3>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                                                <Icon className="w-3 h-3" />
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>Bàn: <strong>{order.table?.tableNumber || 'N/A'}</strong></span>
                                            <span>•</span>
                                            <span>{formatDate(order.orderDate)}</span>
                                            {order.notes && (
                                                <>
                                                    <span>•</span>
                                                    <span className="italic">{order.notes}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-gray-800">
                                            {formatCurrency(order.totalAmount)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openDetailModal(order)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Xem chi tiết
                                    </button>

                                    {statusConfig.nextStatus && (
                                        <button
                                            onClick={() => handleUpdateStatus(order.id, statusConfig.nextStatus)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            {statusConfig.nextLabel}
                                        </button>
                                    )}

                                    {order.status === 'Served' && (
                                        <button
                                            onClick={() => handlePayOrder(order.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium"
                                        >
                                            <DollarSign className="w-4 h-4" />
                                            Thanh toán
                                        </button>
                                    )}

                                    {order.status === 'Pending' && (
                                        <button
                                            onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Hủy đơn
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Không có đơn hàng nào</p>
                    </div>
                )}
            </div>

            {/* Create Order Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">Tạo đơn hàng mới</h2>
                            <button onClick={closeCreateModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateOrder} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chọn bàn *
                                    </label>
                                    <select
                                        required
                                        value={formData.tableId}
                                        onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="">Chọn bàn</option>
                                        {tables.filter(t => t.status === 'Available').map(table => (
                                            <option key={table.id} value={table.id}>
                                                {table.tableNumber} - {table.capacity} chỗ ({table.location})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ghi chú
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Vd: Không cay, ít hành..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chọn món *
                                </label>
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            addMenuItem(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">-- Chọn món để thêm --</option>
                                    {menuItems.filter(m => m.isAvailable).map(item => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} - {formatCurrency(item.price)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Selected Items */}
                            {formData.items.length > 0 && (
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-3">Món đã chọn:</h3>
                                    <div className="space-y-2">
                                        {formData.items.map((item) => {
                                            const menuItem = menuItems.find(m => m.id === item.menuId);
                                            return (
                                                <div key={item.menuId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800">{menuItem?.name}</p>
                                                        <p className="text-sm text-gray-600">{formatCurrency(menuItem?.price || 0)}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateItemQuantity(item.menuId, item.quantity - 1)}
                                                            className="w-8 h-8 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateItemQuantity(item.menuId, item.quantity + 1)}
                                                            className="w-8 h-8 bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateItemQuantity(item.menuId, 0)}
                                                            className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
                                        <span className="text-2xl font-bold text-orange-600">
                                            {formatCurrency(getTotalAmount())}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeCreateModal}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={formData.items.length === 0}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Tạo đơn hàng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Order Detail Modal */}
            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Chi tiết đơn #{selectedOrder.id.toString().padStart(4, '0')}
                            </h2>
                            <button onClick={closeDetailModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Bàn</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {selectedOrder.table?.tableNumber}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusConfig(selectedOrder.status).color}`}>
                                        {getStatusConfig(selectedOrder.status).label}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Thời gian</p>
                                    <p className="text-sm font-medium text-gray-800">
                                        {formatDate(selectedOrder.orderDate)}
                                    </p>
                                </div>
                                {selectedOrder.notes && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Ghi chú</p>
                                        <p className="text-sm font-medium text-gray-800">{selectedOrder.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Món đã gọi:</h3>
                                <div className="space-y-2">
                                    {selectedOrder.orderDetails?.map((detail) => (
                                        <div key={detail.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800">{detail.menu?.name}</p>
                                                {detail.notes && (
                                                    <p className="text-sm text-gray-600 italic">{detail.notes}</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">x{detail.quantity}</p>
                                                <p className="font-semibold text-gray-800">
                                                    {formatCurrency(detail.price * detail.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-semibold text-gray-800">Tổng cộng:</span>
                                    <span className="text-3xl font-bold text-orange-600">
                                        {formatCurrency(selectedOrder.totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}