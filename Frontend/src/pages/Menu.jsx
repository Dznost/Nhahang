import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { menuAPI } from '../services/api';
import { Search, Filter, Plus, Edit, Trash2, X, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        imageUrl: '',
        isAvailable: true
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [menuRes, categoriesRes] = await Promise.all([
                menuAPI.getAll(),
                menuAPI.getCategories()
            ]);
            setMenuItems(menuRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error('Error loading menu:', error);
            toast.error('Không thể tải dữ liệu menu');
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.categoryId.toString() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                categoryId: parseInt(formData.categoryId)
            };

            if (editingItem) {
                await menuAPI.update(editingItem.id, data);
                toast.success('Cập nhật món ăn thành công!');
            } else {
                await menuAPI.create(data);
                toast.success('Thêm món ăn mới thành công!');
            }

            loadData();
            closeModal();
        } catch (error) {
            console.error('Error saving menu item:', error);
            toast.error(editingItem ? 'Không thể cập nhật món ăn' : 'Không thể thêm món ăn');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description || '',
            price: item.price.toString(),
            categoryId: item.categoryId.toString(),
            imageUrl: item.imageUrl || '',
            isAvailable: item.isAvailable
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa món ăn này?')) return;

        try {
            await menuAPI.delete(id);
            toast.success('Xóa món ăn thành công!');
            loadData();
        } catch (error) {
            console.error('Error deleting menu item:', error);
            toast.error('Không thể xóa món ăn');
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            categoryId: categories[0]?.id.toString() || '',
            imageUrl: '',
            isAvailable: true
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải menu...</p>
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
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Thực đơn</h1>
                        <p className="text-gray-600">Quản lý danh sách món ăn</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm món mới
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm món ăn..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                            >
                                <option value="all">Tất cả danh mục</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id.toString()}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100"
                        >
                            {/* Image */}
                            <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-6xl">🍽️</span>
                                    </div>
                                )}
                                {!item.isAvailable && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                                            Hết món
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="mb-3">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {item.description || 'Không có mô tả'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full font-medium">
                                        {categories.find(c => c.id === item.categoryId)?.name || 'N/A'}
                                    </span>
                                    <div className="flex items-center gap-1 text-orange-600 font-bold text-lg">
                                        <DollarSign className="w-4 h-4" />
                                        {formatCurrency(item.price)}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Không tìm thấy món ăn nào</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingItem ? 'Sửa món ăn' : 'Thêm món mới'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên món *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Vd: Phở bò"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Mô tả món ăn..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giá (VNĐ) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="1000"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="50000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Danh mục *
                                </label>
                                <select
                                    required
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id.toString()}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL hình ảnh
                                </label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isAvailable"
                                    checked={formData.isAvailable}
                                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                />
                                <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                                    Còn hàng
                                </label>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
                                >
                                    {editingItem ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}