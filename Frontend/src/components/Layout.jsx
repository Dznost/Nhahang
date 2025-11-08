import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    UtensilsCrossed,
    ShoppingCart,
    Users,
    LogOut,
    Menu as MenuIcon,
    X,
    ChefHat,
} from 'lucide-react';

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/menu', icon: UtensilsCrossed, label: 'Menu' },
        { path: '/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/tables', icon: Users, label: 'Tables' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`bg-indigo-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-indigo-800">
                    <div className="flex items-center justify-between">
                        {sidebarOpen ? (
                            <div className="flex items-center gap-2">
                                <ChefHat className="w-8 h-8" />
                                <span className="font-bold text-xl">Restaurant</span>
                            </div>
                        ) : (
                            <ChefHat className="w-8 h-8 mx-auto" />
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1 hover:bg-indigo-800 rounded"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* User Info */}
                {sidebarOpen && (
                    <div className="p-4 border-b border-indigo-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center">
                                <span className="text-lg font-bold">{user?.fullName?.[0] || 'U'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{user?.fullName || 'User'}</p>
                                <p className="text-xs text-indigo-300 truncate">{user?.role || 'Staff'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Menu Items */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-indigo-700 text-white'
                                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                                    } ${!sidebarOpen && 'justify-center'}`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-800">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-200 hover:bg-red-600 hover:text-white transition-colors ${!sidebarOpen && 'justify-center'
                            }`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
                        </h1>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}