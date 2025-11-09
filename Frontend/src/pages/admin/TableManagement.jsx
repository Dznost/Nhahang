import { useState, useEffect } from 'react';
import { tableAPI } from '../../api/tableAPI';
import { useNotification } from '../../contexts/NotificationContext';

const TableManagement = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [formData, setFormData] = useState({
        tableNumber: '',
        capacity: '',
        status: 'Available'
    });
    const { showSuccess, showError } = useNotification();

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const response = await tableAPI.getAll();
            setTables(response.data);
        } catch (error) {
            showError('Không thể tải danh sách bàn');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingTable) {
                await tableAPI.update(editingTable.tableId, formData);
                showSuccess('Cập nhật bàn thành công');
            } else {
                await tableAPI.create(formData);
                showSuccess('Thêm bàn mới thành công');
            }

            setShowForm(false);
            setEditingTable(null);
            setFormData({ tableNumber: '', capacity: '', status: 'Available' });
            fetchTables();
        } catch (error) {
            showError(error.response?.data?.message || 'Thao tác thất bại');
        }
    };

    const handleEdit = (table) => {
        setEditingTable(table);
        setFormData({
            tableNumber: table.tableNumber,
            capacity: table.capacity,
            status: table.status
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa bàn này?')) return;

        try {
            await tableAPI.delete(id);
            showSuccess('Xóa bàn thành công');
            fetchTables();
        } catch (error) {
            showError('Xóa thất bại');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-800';
            case 'Occupied': return 'bg-red-100 text-red-800';
            case 'Reserved': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Available': return 'Trống';
            case 'Occupied': return 'Đang dùng';
            case 'Reserved': return 'Đã đặt';
            default: return status;
        }
    };

    if (loading) {
        return <div className="text-center py-12">Đang tải...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý bàn</h1>
                <button
                    onClick={() => {
                        setEditingTable(null);
                        setFormData({ tableNumber: '', capacity: '', status: 'Available' });
                        setShowForm(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    + Thêm bàn mới
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Tổng số bàn</p>
                    <p className="text-2xl font-bold">{tables.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Bàn trống</p>
                    <p className="text-2xl font-bold text-green-600">
                        {tables.filter(t => t.status === 'Available').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Bàn đang sử dụng</p>
                    <p className="text-2xl font-bold text-red-600">
                        {tables.filter(t => t.status === 'Occupied').length}
                    </p>
                </div>
            </div>

            {/* Tables Grid */}
            <div className="grid md:grid-cols-4 gap-4">
                {tables.map((table) => (
                    <div key={table.tableId} className="bg-white rounded-lg shadow-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-xl font-bold">Bàn {table.tableNumber}</h3>
                                <p className="text-gray-600 text-sm">Sức chứa: {table.capacity} người</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(table.status)}`}>
                                {getStatusText(table.status)}
                            </span>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit(table)}
                                className="flex-1 px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => handleDelete(table.tableId)}
                                className="flex-1 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingTable ? 'Sửa bàn' : 'Thêm bàn mới'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Số bàn *</label>
                                <input
                                    type="text"
                                    value={formData.tableNumber}
                                    onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Sức chứa *</label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Trạng thái</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="Available">Trống</option>
                                    <option value="Occupied">Đang dùng</option>
                                    <option value="Reserved">Đã đặt</option>
                                </select>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editingTable ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingTable(null);
                                    }}
                                    className="flex-1 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableManagement;