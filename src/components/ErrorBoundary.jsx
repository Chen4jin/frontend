/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */

import { Component } from 'react';
import { ExclamationCircleIcon, ArrowPathIcon } from './ui';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to monitoring service in production
        if (import.meta.env.PROD) {
            // Could send to Sentry, LogRocket, etc.
            console.error('Error caught by boundary:', error, errorInfo);
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        // Optionally reload the page
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div className="min-h-screen bg-apple-bg flex items-center justify-center p-4">
                    <div className="max-w-md w-full text-center">
                        <div className="p-4 rounded-2xl bg-red-50 inline-block mb-6">
                            <ExclamationCircleIcon className="w-12 h-12 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-semibold text-apple-black mb-3">
                            Something went wrong
                        </h1>
                        <p className="text-apple-gray mb-8">
                            We're sorry, but something unexpected happened. 
                            Please try refreshing the page.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-apple-black text-white font-medium hover:bg-apple-gray-dark transition-colors"
                            >
                                <ArrowPathIcon className="w-4 h-4" />
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-neutral-100 text-apple-black font-medium hover:bg-neutral-200 transition-colors"
                            >
                                Go Home
                            </button>
                        </div>
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-8 text-left">
                                <summary className="text-sm text-apple-gray cursor-pointer hover:text-apple-black">
                                    Error Details (Dev Only)
                                </summary>
                                <pre className="mt-2 p-4 bg-neutral-100 rounded-xl text-xs overflow-auto text-red-600">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
