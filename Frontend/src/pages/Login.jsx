import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Lock, User } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login({ username, password });
        if (result.success) navigate('/dashboard');
        setLoading(false);
    };

    const quickLogin = async (user, pass) => {
        setLoading(true);
        const result = await login({ username: user, password: pass });
        if (result.success) navigate('/dashboard');
        setLoading(false);
    };

    // Danh sách các tài khoản đăng nhập nhanh
    const quickLoginAccounts = [
        { username: 'admin', password: 'admin123', label: 'Admin', color: 'bg-purple-100 text-purple-700', icon: '👑' },
        { username: 'manager', password: 'manager123', label: 'Manager', color: 'bg-blue-100 text-blue-700', icon: '🧩' },
        { username: 'staff', password: 'staff123', label: 'Staff', color: 'bg-green-100 text-green-700', icon: '💼' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100">
            <div className="max-w-md w-full mx-4">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
                        <UtensilsCrossed className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Restaurant POS</h1>
                    <p className="text-gray-600 mt-2">Đăng nhập để tiếp tục</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="admin"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50"
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>

                    {/* Quick Login Buttons */}
                    <div className="mt-8 border-t pt-6">
                        <p className="text-sm text-gray-600 mb-4 text-center">Đăng nhập nhanh:</p>
                        <div className="grid grid-cols-3 gap-3">
                            {quickLoginAccounts.map((account) => (
                                <button
                                    key={account.username}
                                    type="button"
                                    onClick={() => quickLogin(account.username, account.password)}
                                    disabled={loading}
                                    className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200 hover:border-orange-300"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${account.color}`}>
                                        <span className="text-xl">{account.icon}</span>
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">{account.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Register Link */}
                        <div className="text-center pt-4">
                            <p className="text-gray-600">
                                Chưa có tài khoản?{' '}
                                <Link to="/register" className="text-orange-500 hover:text-orange-600 font-semibold">
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
