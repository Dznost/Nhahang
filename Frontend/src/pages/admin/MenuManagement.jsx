import { useState, useEffect } from 'react';
import { menuAPI } from '../../api/menuAPI';
import { useNotification } from '../../contexts/NotificationContext';

const MenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useNotification();

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await menuAPI.getAll();
            setMenuItems(response.data);
        } catch (error) {
            showError('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa món này?')) return;

        try {
            await menuAPI.delete(id);
            showSuccess('Xóa thành công');
            fetchMenu();
        } catch (error) {
            showError('Xóa thất bại');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Quản lý thực đơn</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    + Thêm món mới
                </button>
            </div>

            {loading ? (
                <div>Đang tải...</div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">Tên món</th>
                                <th className="px-6 py-3 text-left">Mô tả</th>
                                <th className="px-6 py-3 text-left">Giá</th>
                                <th className="px-6 py-3 text-left">Trạng thái</th>
                                <th className="px-6 py-3 text-left">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menuItems.map((item) => (
                                <tr key={item.menuId} className="border-t">
                                    <td className="px-6 py-4">{item.itemName}</td>
                                    <td className="px-6 py-4">{item.description}</td>
                                    <td className="px-6 py-4">{item.price.toLocaleString()}đ</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded ${item.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {item.availability ? 'Có sẵn' : 'Hết'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button className="text-blue-600 hover:underline">Sửa</button>
                                        <button
                                            onClick={() => handleDelete(item.menuId)}
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
            )}
        </div>
    );
};

export default MenuManagement;