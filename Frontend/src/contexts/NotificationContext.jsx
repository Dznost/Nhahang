import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showSuccess = (message) => {
        setNotification({ type: 'success', message });
        setTimeout(() => setNotification(null), 3000);
    };

    const showError = (message) => {
        setNotification({ type: 'error', message });
        setTimeout(() => setNotification(null), 3000);
    };

    const showInfo = (message) => {
        setNotification({ type: 'info', message });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <NotificationContext.Provider value={{ showSuccess, showError, showInfo }}>
            {children}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    } text-white`}>
                    {notification.message}
                </div>
            )}
        </NotificationContext.Provider>
    );
};