import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MainLayout = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="text-2xl font-bold text-blue-600">
                                Restaurant
                            </Link>
                            <Link to="/menu" className="text-gray-700 hover:text-blue-600">
                                Thực đơn
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <span className="text-gray-700">Xin chào, {user.username}</span>
                                    <Link
                                        to={user.role === 'Admin' ? '/admin/dashboard' : '/customer/dashboard'}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Đăng xuất
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-blue-600 hover:text-blue-800"
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Đăng ký
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                <Outlet />
            </main>

            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p>&copy; 2024 Restaurant Management. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;