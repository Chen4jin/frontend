/**
 * Input Component
 * Reusable form input with label and error states
 */

import { useState, forwardRef } from 'react';
import clsx from 'clsx';
import { EyeIcon, EyeSlashIcon } from './Icons';

export const Input = forwardRef(({
    label,
    type = 'text',
    error,
    className = '',
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className={className}>
            {label && (
                <label 
                    htmlFor={props.id} 
                    className="block text-sm font-medium text-apple-black mb-2"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    type={isPassword && showPassword ? 'text' : type}
                    className={clsx(
                        'input-field',
                        isPassword && 'pr-12',
                        error && 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    )}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-apple-gray hover:text-apple-black transition-colors duration-200"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                            <EyeIcon className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
