import { useState, useEffect } from 'react';
import { menuAPI } from '../../api/menuAPI';

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await menuAPI.getAll();
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Đang tải thực đơn...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">Thực đơn</h1>

            <div className="grid md:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                    <div key={item.menuId} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-6xl">{item.imageUrl || '🍽️'}</span>
                        </div>
                        <div className="p-4">
                            <h3 className="text-xl font-bold mb-2">{item.itemName}</h3>
                            <p className="text-gray-600 mb-2">{item.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-blue-600">
                                    {item.price.toLocaleString('vi-VN')}đ
                                </span>
                                <span className={`px-3 py-1 rounded ${item.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {item.availability ? 'Còn hàng' : 'Hết hàng'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuPage;