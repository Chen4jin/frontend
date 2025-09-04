const alertStyles = {
    info: {
        color: 'text-blue-800',
        bg: 'bg-blue-50',
        darkText: 'dark:text-blue-400',
        label: 'Info alert!',
    },
    danger: {
        color: 'text-red-800',
        bg: 'bg-red-50',
        darkText: 'dark:text-red-400',
        label: 'Danger alert!',
    },
    success: {
        color: 'text-green-800',
        bg: 'bg-green-50',
        darkText: 'dark:text-green-400',
        label: 'Success alert!',
    },
    warning: {
        color: 'text-yellow-800',
        bg: 'bg-yellow-50',
        darkText: 'dark:text-yellow-300',
        label: 'Warning alert!',
    },
};

const Alert = ({ type, message }) => {
    const style = alertStyles[type];

    if (!style) return null;

    return (
        <div
            className={`p-4 mb-4 text-sm rounded-lg ${style.color} ${style.bg} dark:bg-gray-800 ${style.darkText}`}
            role="alert"
        >
            <span className="font-medium">{style.label}</span> {message}
        </div>
    );
};
export default Alert;
