import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <Link to="/admin/dashboard" className="text-2xl font-bold">
                                Admin Panel
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span>Admin: {user?.username}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                <aside className="w-64 bg-white shadow-lg min-h-screen">
                    <nav className="p-4 space-y-2">
                        <Link
                            to="/admin/dashboard"
                            className="block px-4 py-2 rounded hover:bg-blue-50 text-gray-700"
                        >
                            📊 Dashboard
                        </Link>
                        <Link
                            to="/admin/menu"
                            className="block px-4 py-2 rounded hover:bg-blue-50 text-gray-700"
                        >
                            🍽️ Quản lý thực đơn
                        </Link>
                        <Link
                            to="/admin/orders"
                            className="block px-4 py-2 rounded hover:bg-blue-50 text-gray-700"
                        >
                            📦 Quản lý đơn hàng
                        </Link>
                        <Link
                            to="/admin/tables"
                            className="block px-4 py-2 rounded hover:bg-blue-50 text-gray-700"
                        >
                            🪑 Quản lý bàn
                        </Link>
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;