import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    UtensilsCrossed,
    Lock,
    User,
    Mail,
    Phone,
    UserCog,
    ChefHat,
    Eye,
    EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        email: '',
        phone: '',
        role: 'Staff' // Default role
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const roles = [
        { value: 'Staff', label: 'Nhân viên', icon: User, color: 'from-blue-500 to-blue-600' },
        { value: 'Chef', label: 'Đầu bếp', icon: ChefHat, color: 'from-orange-500 to-red-600' },
        { value: 'Manager', label: 'Quản lý', icon: UserCog, color: 'from-purple-500 to-purple-600' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        try {
            setLoading(true);
            await register(formData);
            toast.success('Đăng ký thành công!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Đăng ký thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg mb-4">
                        <UtensilsCrossed className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Đăng ký tài khoản
                    </h1>
                    <p className="text-gray-600">
                        Tạo tài khoản mới cho hệ thống quản lý nhà hàng
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Chọn vai trò *
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {roles.map((role) => {
                                    const Icon = role.icon;
                                    const isSelected = formData.role === role.value;

                                    return (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: role.value })}
                                            className={`
                        relative p-4 rounded-xl border-2 transition-all duration-200
                        ${isSelected
                                                    ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                                }
                      `}
                                        >
                                            <div className={`
                        w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2
                        ${isSelected
                                                    ? `bg-gradient-to-br ${role.color} text-white`
                                                    : 'bg-gray-100 text-gray-600'
                                                }
                      `}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <p className={`text-sm font-medium ${isSelected ? 'text-orange-600' : 'text-gray-700'}`}>
                                                {role.label}
                                            </p>
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Username & Full Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tên đăng nhập *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="username"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                        placeholder="username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Họ và tên *
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Số điện thoại *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                        placeholder="0123456789"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mật khẩu *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Tối thiểu 6 ký tự</p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Xác nhận mật khẩu *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Đang xử lý...
                                </span>
                            ) : (
                                'Đăng ký'
                            )}
                        </button>

                        {/* Login Link */}
                        <div className="text-center pt-4">
                            <p className="text-gray-600">
                                Đã có tài khoản?{' '}
                                <Link
                                    to="/login"
                                    className="text-orange-500 hover:text-orange-600 font-semibold"
                                >
                                    Đăng nhập ngay
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}