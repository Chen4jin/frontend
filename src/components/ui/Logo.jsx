/**
 * Logo Component
 * Monogram-style logo used across the application
 */

import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import config from '../../config';

export const Logo = ({ 
    className = '', 
    showName = false,
    size = 'default',
    linkTo = ROUTES.HOME,
    onClick,
}) => {
    const sizeClasses = {
        small: 'w-6 h-6 text-[10px]',
        default: 'w-8 h-8 text-xs',
        large: 'w-10 h-10 text-sm',
    };

    const logoElement = (
        <div className={`
            flex items-center justify-center rounded-xl 
            bg-neutral-900 text-white font-semibold
            ${sizeClasses[size]} ${className}
        `}>
            JC
        </div>
    );

    const content = showName ? (
        <div className="flex items-center gap-2.5">
            {logoElement}
            <span className="text-sm font-semibold tracking-tight text-neutral-900">
                {config.app.name}
            </span>
        </div>
    ) : logoElement;

    if (linkTo) {
        return (
            <Link 
                to={linkTo} 
                onClick={onClick}
                className="transition-opacity duration-300 hover:opacity-70"
            >
                {content}
            </Link>
        );
    }

    return content;
};

export default Logo;
