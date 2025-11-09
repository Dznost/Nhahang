import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const HomePage = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    Chào mừng đến với Restaurant
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Hệ thống quản lý nhà hàng hiện đại và chuyên nghiệp
                </p>

                <div className="space-x-4">
                    <Link
                        to="/menu"
                        className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Xem thực đơn
                    </Link>
                    {!user && (
                        <Link
                            to="/register"
                            className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Đăng ký ngay
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <div className="text-4xl mb-4">🍽️</div>
                    <h3 className="text-xl font-bold mb-2">Thực đơn đa dạng</h3>
                    <p className="text-gray-600">Hơn 100+ món ăn ngon được cập nhật liên tục</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <div className="text-4xl mb-4">⚡</div>
                    <h3 className="text-xl font-bold mb-2">Phục vụ nhanh chóng</h3>
                    <p className="text-gray-600">Đặt món trực tuyến, giao hàng tận nơi</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <div className="text-4xl mb-4">💯</div>
                    <h3 className="text-xl font-bold mb-2">Chất lượng đảm bảo</h3>
                    <p className="text-gray-600">Nguyên liệu tươi ngon, vệ sinh an toàn</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;