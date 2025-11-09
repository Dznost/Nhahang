import { useAuth } from '../../hooks/useAuth';

const CustomerDashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard Khách hàng</h1>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Thông tin cá nhân</h2>
                <div className="space-y-2">
                    <p><strong>Tên đăng nhập:</strong> {user?.username}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Vai trò:</strong> {user?.role}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-500 text-white rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-2">Đơn hàng</h3>
                    <p className="text-3xl font-bold">0</p>
                </div>

                <div className="bg-green-500 text-white rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-2">Đặt bàn</h3>
                    <p className="text-3xl font-bold">0</p>
                </div>

                <div className="bg-purple-500 text-white rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-2">Điểm tích lũy</h3>
                    <p className="text-3xl font-bold">0</p>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;