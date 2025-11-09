import { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { showSuccess, showError } = useNotification();

    // Mock data - Thay bằng API call thực tế khi có customerAPI
    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            // TODO: Thay bằng customerAPI.getAll() khi có
            // const response = await customerAPI.getAll();
            // setCustomers(response.data);

            // Mock data tạm thời
            setCustomers([
                {
                    customerId: 1,
                    fullName: 'Nguyễn Văn A',
                    email: 'nguyenvana@email.com',
                    phoneNumber: '0901234567',
                    totalOrders: 15,
                    totalSpent: 5000000,
                    joinDate: '2024-01-15'
                },
                {
                    customerId: 2,
                    fullName: 'Trần Thị B',
                    email: 'tranthib@email.com',
                    phoneNumber: '0912345678',
                    totalOrders: 8,
                    totalSpent: 2500000,
                    joinDate: '2024-02-20'
                }
            ]);
        } catch (error) {
            showError('Không thể tải danh sách khách hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa khách hàng này?')) return;

        try {
            // TODO: await customerAPI.delete(id);
            showSuccess('Xóa khách hàng thành công');
            fetchCustomers();
        } catch (error) {
            showError('Xóa thất bại');
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(searchTerm)
    );

    if (loading) {
        return <div className="text-center py-12">Đang tải...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý khách hàng</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    + Thêm khách hàng
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Tổng khách hàng</p>
                    <p className="text-2xl font-bold">{customers.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Khách hàng VIP</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {customers.filter(c => c.totalOrders >= 10).length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Tổng đơn hàng</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Tổng doanh thu</p>
                    <p className="text-2xl font-bold text-green-600">
                        {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString('vi-VN')}đ
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                />
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Họ tên</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Số điện thoại</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Số đơn</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Tổng chi tiêu</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Ngày tham gia</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.customerId} className="border-t hover:bg-gray-50">
                                <td className="px-6 py-4">#{customer.customerId}</td>
                                <td className="px-6 py-4 font-semibold">{customer.fullName}</td>
                                <td className="px-6 py-4">{customer.email}</td>
                                <td className="px-6 py-4">{customer.phoneNumber}</td>
                                <td className="px-6 py-4">{customer.totalOrders}</td>
                                <td className="px-6 py-4 font-semibold text-green-600">
                                    {customer.totalSpent.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(customer.joinDate).toLocaleDateString('vi-VN')}
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    <button className="text-blue-600 hover:underline">Chi tiết</button>
                                    <button className="text-green-600 hover:underline">Sửa</button>
                                    <button
                                        onClick={() => handleDelete(customer.customerId)}
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
        </div>
    );
};

export default CustomerManagement;