function Loading({ size = 'md', text = 'Đang tải...' }) {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className={`${sizes[size]} border-4 border-primary-600 border-t-transparent rounded-full animate-spin`} />
            {text && <p className="mt-4 text-gray-600">{text}</p>}
        </div>
    );
}

export default Loading;