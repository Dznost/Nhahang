import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Hồ sơ cá nhân</h1>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Tên đăng nhập</label>
                        <input
                            type="text"
                            value={user?.username || ''}
                            disabled
                            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;