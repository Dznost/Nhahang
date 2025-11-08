import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { tableAPI } from '../services/api';
import { Users, MapPin, Check, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Tables() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        try {
            setLoading(true);
            const response = await tableAPI.getAll();
            setTables(response.data);
        } catch (error) {
            console.error('Error loading tables:', error);
            toast.error('Không thể tải danh sách bàn');
        } finally {
            setLoading(false);
        }
    };

    const updateTableStatus = async (id, newStatus) => {
        try {
            await tableAPI.updateStatus(id, newStatus);
            toast.success('Cập nhật trạng thái bàn thành công!');
            loadTables();
        } catch (error) {
            console.error('Error updating table status:', error);
            toast.error('Không thể cập nhật trạng thái bàn');
        }
    };

    const filteredTables = tables.filter(table => {
        if (filterStatus === 'all') return true;
        return table.status === filterStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available':
                return 'from-green-500 to-emerald-600';
            case 'Occupied':
                return 'from-red-500 to-pink-600';
            case 'Reserved':
                return 'from-yellow-500 to-orange-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            'Available': { color: 'bg-green-100 text-green-800', icon: Check, label: 'Trống' },
            'Occupied': { color: 'bg-red-100 text-red-800', icon: X, label: 'Đang sử dụng' },
            'Reserved': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Đã đặt' },
        };

        const statusConfig = config[status] || config['Available'];
        const Icon = statusConfig.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                <Icon className="w-3 h-3" />
                {statusConfig.label}
            </span>
        );
    };

    const getLocationIcon = (location) => {
        switch (location) {
            case 'Indoor':
                return '🏠';
            case 'Outdoor':
                return '🌳';
            case 'VIP':
                return '👑';
            default:
                return '📍';
        }
    };

    const stats = {
        total: tables.length,
        available: tables.filter(t => t.status === 'Available').length,
        occupied: tables.filter(t => t.status === 'Occupied').length,
        reserved: tables.filter(t => t.status === 'Reserved').length,
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải danh sách bàn...</p>
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
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý bàn ăn</h1>
                    <p className="text-gray-600">Theo dõi và quản lý tình trạng các bàn</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Tổng số bàn</p>
                                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Bàn trống</p>
                                <p className="text-3xl font-bold text-green-600">{stats.available}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Check className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Đang sử dụng</p>
                                <p className="text-3xl font-bold text-red-600">{stats.occupied}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <X className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Đã đặt</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.reserved}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'all'
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Tất cả ({stats.total})
                        </button>
                        <button
                            onClick={() => setFilterStatus('Available')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'Available'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Trống ({stats.available})
                        </button>
                        <button
                            onClick={() => setFilterStatus('Occupied')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'Occupied'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Đang dùng ({stats.occupied})
                        </button>
                        <button
                            onClick={() => setFilterStatus('Reserved')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'Reserved'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Đã đặt ({stats.reserved})
                        </button>
                    </div>
                </div>

                {/* Tables Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTables.map((table) => (
                        <div
                            key={table.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100"
                        >
                            {/* Header with gradient */}
                            <div className={`bg-gradient-to-br ${getStatusColor(table.status)} p-6 text-white`}>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-2xl font-bold">{table.tableNumber}</h3>
                                    <span className="text-3xl">{getLocationIcon(table.location)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm opacity-90">
                                    <Users className="w-4 h-4" />
                                    <span>{table.capacity} chỗ ngồi</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        <span>{table.location}</span>
                                    </div>
                                    {getStatusBadge(table.status)}
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    {table.status !== 'Available' && (
                                        <button
                                            onClick={() => updateTableStatus(table.id, 'Available')}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium"
                                        >
                                            <Check className="w-4 h-4" />
                                            Đặt trống
                                        </button>
                                    )}

                                    {table.status !== 'Occupied' && (
                                        <button
                                            onClick={() => updateTableStatus(table.id, 'Occupied')}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                                        >
                                            <X className="w-4 h-4" />
                                            Đang sử dụng
                                        </button>
                                    )}

                                    {table.status !== 'Reserved' && (
                                        <button
                                            onClick={() => updateTableStatus(table.id, 'Reserved')}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors font-medium"
                                        >
                                            <Clock className="w-4 h-4" />
                                            Đặt trước
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTables.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Không có bàn nào phù hợp</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}