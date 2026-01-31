/**
 * Button Component
 * Reusable button with multiple variants
 */

import { Link } from 'react-router-dom';
import clsx from 'clsx';

const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
    primary: 'bg-apple-black text-white rounded-full px-6 py-3 hover:bg-apple-gray-dark',
    secondary: 'bg-white text-apple-black rounded-full px-6 py-3 border border-apple-gray-light hover:bg-apple-bg-secondary',
    ghost: 'text-apple-black px-4 py-2 hover:opacity-60',
    link: 'text-apple-black hover:opacity-60',
};

const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-4',
};

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    href,
    to,
    external = false,
    loading = false,
    disabled = false,
    className = '',
    ...props
}) => {
    const classes = clsx(baseStyles, variants[variant], sizes[size], className);

    // Loading spinner
    const loadingSpinner = loading && (
        <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
    );

    // External link
    if (href) {
        return (
            <a
                href={href}
                className={classes}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                {...props}
            >
                {loadingSpinner}
                {children}
            </a>
        );
    }

    // Internal link
    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {loadingSpinner}
                {children}
            </Link>
        );
    }

    // Button
    return (
        <button
            className={classes}
            disabled={disabled || loading}
            {...props}
        >
            {loadingSpinner}
            {children}
        </button>
    );
};

export default Button;
