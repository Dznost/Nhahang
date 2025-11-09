import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl">Đang tải...</div>
        </div>;
    }

    return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;