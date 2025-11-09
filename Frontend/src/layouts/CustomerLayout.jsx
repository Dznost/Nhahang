import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const CustomerLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="text-2xl font-bold text-blue-600">
                                Restaurant
                            </Link>
                            <Link to="/customer/dashboard" className="text-gray-700 hover:text-blue-600">
                                Dashboard
                            </Link>
                            <Link to="/customer/orders" className="text-gray-700 hover:text-blue-600">
                                Đơn hàng của tôi
                            </Link>
                            <Link to="/menu" className="text-gray-700 hover:text-blue-600">
                                Đặt món
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Xin chào, {user?.username}</span>
                            <Link to="/customer/profile" className="text-blue-600 hover:text-blue-800">
                                Hồ sơ
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;