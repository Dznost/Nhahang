import { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        position: '',
        phoneNumber: '',
        email: '',
        salary: '',
        hireDate: '',
        status: 'Active'
    });
    const { showSuccess, showError } = useNotification();

    // Mock data
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            // TODO: Thay bằng employeeAPI.getAll()
            setEmployees([
                {
                    employeeId: 1,
                    fullName: 'Nguyễn Văn Manager',
                    position: 'Quản lý',
                    phoneNumber: '0909999999',
                    email: 'manager@restaurant.com',
                    salary: 15000000,
                    hireDate: '2023-01-15',
                    status: 'Active'
                },
                {
                    employeeId: 2,
                    fullName: 'Trần Thị Chef',
                    position: 'Bếp trưởng',
                    phoneNumber: '0908888888',
                    email: 'chef@restaurant.com',
                    salary: 12000000,
                    hireDate: '2023-03-20',
                    status: 'Active'
                },
                {
                    employeeId: 3,
                    fullName: 'Lê Văn Waiter',
                    position: 'Phục vụ',
                    phoneNumber: '0907777777',
                    email: 'waiter@restaurant.com',
                    salary: 8000000,
                    hireDate: '2023-06-10',
                    status: 'Active'
                }
            ]);
        } catch (error) {
            showError('Không thể tải danh sách nhân viên');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingEmployee) {
                // TODO: await employeeAPI.update(editingEmployee.employeeId, formData);
                showSuccess('Cập nhật nhân viên thành công');
            } else {
                // TODO: await employeeAPI.create(formData);
                showSuccess('Thêm nhân viên mới thành công');
            }

            setShowForm(false);
            setEditingEmployee(null);
            setFormData({
                fullName: '',
                position: '',
                phoneNumber: '',
                email: '',
                salary: '',
                hireDate: '',
                status: 'Active'
            });
            fetchEmployees();
        } catch (error) {
            showError('Thao tác thất bại');
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            fullName: employee.fullName,
            position: employee.position,
            phoneNumber: employee.phoneNumber,
            email: employee.email,
            salary: employee.salary,
            hireDate: employee.hireDate,
            status: employee.status
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa nhân viên này?')) return;

        try {
            // TODO: await employeeAPI.delete(id);
            showSuccess('Xóa nhân viên thành công');
            fetchEmployees();
        } catch (error) {
            showError('Xóa thất bại');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
            // TODO: await employeeAPI.updateStatus(id, newStatus);
            showSuccess('Cập nhật trạng thái thành công');
            fetchEmployees();
        } catch (error) {
            showError('Cập nhật thất bại');
        }
    };

    if (loading) {
        return <div className="text-center py-12">Đang tải...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý nhân viên</h1>
                <button
                    onClick={() => {
                        setEditingEmployee(null);
                        setFormData({
                            fullName: '',
                            position: '',
                            phoneNumber: '',
                            email: '',
                            salary: '',
                            hireDate: '',
                            status: 'Active'
                        });
                        setShowForm(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    + Thêm nhân viên
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Tổng nhân viên</p>
                    <p className="text-2xl font-bold">{employees.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Đang làm việc</p>
                    <p className="text-2xl font-bold text-green-600">
                        {employees.filter(e => e.status === 'Active').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Tạm nghỉ</p>
                    <p className="text-2xl font-bold text-red-600">
                        {employees.filter(e => e.status === 'Inactive').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-600 text-sm">Tổng lương/tháng</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {employees.reduce((sum, e) => sum + e.salary, 0).toLocaleString('vi-VN')}đ
                    </p>
                </div>
            </div>

            {/* Employees Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Họ tên</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Chức vụ</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">SĐT</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Lương</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.employeeId} className="border-t hover:bg-gray-50">
                                <td className="px-6 py-4">#{employee.employeeId}</td>
                                <td className="px-6 py-4 font-semibold">{employee.fullName}</td>
                                <td className="px-6 py-4">{employee.position}</td>
                                <td className="px-6 py-4">{employee.email}</td>
                                <td className="px-6 py-4">{employee.phoneNumber}</td>
                                <td className="px-6 py-4 font-semibold">
                                    {employee.salary.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleStatus(employee.employeeId, employee.status)}
                                        className={`px-3 py-1 rounded text-sm ${employee.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {employee.status === 'Active' ? 'Đang làm' : 'Nghỉ việc'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    <button
                                        onClick={() => handleEdit(employee)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(employee.employeeId)}
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

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingEmployee ? 'Sửa nhân viên' : 'Thêm nhân viên mới'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Họ tên *</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Chức vụ *</label>
                                <select
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                >
                                    <option value="">-- Chọn chức vụ --</option>
                                    <option value="Quản lý">Quản lý</option>
                                    <option value="Bếp trưởng">Bếp trưởng</option>
                                    <option value="Đầu bếp">Đầu bếp</option>
                                    <option value="Phục vụ">Phục vụ</option>
                                    <option value="Thu ngân">Thu ngân</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Số điện thoại *</label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Lương (VNĐ) *</label>
                                <input
                                    type="number"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Ngày vào làm *</label>
                                <input
                                    type="date"
                                    value={formData.hireDate}
                                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2">Trạng thái</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="Active">Đang làm việc</option>
                                    <option value="Inactive">Nghỉ việc</option>
                                </select>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editingEmployee ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingEmployee(null);
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

export default EmployeeManagement;