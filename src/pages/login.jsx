/**
 * Login Page
 * User authentication form with validation
 */

import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';

import Navbar from '../components/navbar';
import { Input, Button, ExclamationCircleIcon, XMarkIcon } from '../components/ui';
import { useAuth } from '../hooks';
import { ROUTES } from '../constants';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
    const { login, error, loading, clearAuthError, isAuthenticated } = useAuth();
    const [input, setInput] = useState({
        email: '',
        password: '',
    });
    const [validation, setValidation] = useState({
        email: '',
        password: '',
    });
    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });

    // Clear auth error when component unmounts (user leaves page)
    useEffect(() => {
        return () => {
            clearAuthError();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Clear auth error when user starts typing
    useEffect(() => {
        if (error && (input.email || input.password)) {
            clearAuthError();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input.email, input.password]);

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    // Validate individual field
    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                if (!value) return 'Email is required';
                if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email';
                return '';
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                return '';
            default:
                return '';
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        // Validate on change if field was touched
        if (touched[name]) {
            setValidation((prev) => ({
                ...prev,
                [name]: validateField(name, value),
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));
        setValidation((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };

    const handleSubmitEvent = async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const emailError = validateField('email', input.email);
        const passwordError = validateField('password', input.password);
        
        setValidation({
            email: emailError,
            password: passwordError,
        });
        setTouched({
            email: true,
            password: true,
        });

        // Don't submit if validation errors
        if (emailError || passwordError) {
            return;
        }

        await login(input.email, input.password);
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            <Navbar />
            
            <div className="flex min-h-[calc(100vh-56px)] flex-col justify-center px-4 sm:px-6">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8 opacity-0 animate-fade-in-up animation-delay-100">
                        <h1 className="text-3xl font-semibold text-neutral-900">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-neutral-500">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/60 p-6 sm:p-8 opacity-0 animate-fade-in-up animation-delay-200">
                        <form onSubmit={handleSubmitEvent} className="space-y-5" noValidate>
                            {/* Email Field */}
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                label="Email"
                                autoComplete="email"
                                placeholder="name@example.com"
                                onChange={handleInput}
                                onBlur={handleBlur}
                                value={input.email}
                                error={touched.email ? validation.email : ''}
                                aria-describedby={validation.email ? 'email-error' : undefined}
                            />

                            {/* Password Field */}
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                label="Password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                onChange={handleInput}
                                onBlur={handleBlur}
                                value={input.password}
                                error={touched.password ? validation.password : ''}
                                aria-describedby={validation.password ? 'password-error' : undefined}
                            />

                            {/* Server Error Message */}
                            {error && (
                                <div 
                                    className="alert-error animate-fade-in"
                                    role="alert"
                                    aria-live="polite"
                                >
                                    <ExclamationCircleIcon className="alert-error-icon" />
                                    <div className="flex-1">
                                        <p className="alert-error-title">Authentication failed</p>
                                        <p className="alert-error-message">{error}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearAuthError}
                                        className="alert-error-dismiss"
                                        aria-label="Dismiss error"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                loading={loading}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-neutral-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-4 text-neutral-400">or</span>
                            </div>
                        </div>

                        {/* Back to Home */}
                        <div className="text-center">
                            <Link 
                                to={ROUTES.HOME}
                                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
                            >
                                ← Back to home
                            </Link>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-xs text-neutral-400 opacity-0 animate-fade-in animation-delay-300">
                        Protected by industry-standard encryption
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
