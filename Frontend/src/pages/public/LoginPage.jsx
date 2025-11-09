import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // ✅ Navigate khi user đã login
    useEffect(() => {
        if (user) {
            navigate(user.role === 'Admin' ? '/admin/dashboard' : '/customer/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await login(formData);

            if (result.success) {
                // userData đã được lưu trong useAuth hook hoặc localStorage
                const userData = JSON.parse(localStorage.getItem('user'));
                navigate(userData.role === 'Admin' ? '/admin/dashboard' : '/customer/dashboard');
            } else {
                alert(result.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra, vui lòng thử lại.');
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto px-4 py-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center mb-8">Đăng nhập</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 mb-2">Tên đăng nhập</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Mật khẩu</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Đăng ký ngay
                    </Link>
                </p>

                <div className="mt-6 p-4 bg-gray-100 rounded text-sm">
                    <p className="font-bold mb-2">🔑 Tài khoản demo:</p>
                    <p>Admin: admin / admin123</p>
                    <p>Customer: customer / customer123</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
