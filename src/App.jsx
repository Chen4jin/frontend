/**
 * App Component
 * Root component with routing and providers
 */

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';

import { store } from './redux';
import { ROUTES } from './constants';
import { useAuthInit } from './hooks';

// Pages
import Home from './pages/home';
import Collections from './pages/collections';
import Login from './pages/login';
import Dashboard from './pages/dashboard';

// Components
import PrivateRoute from './components/PrivateRoute';
import Overview from './components/dashboard/Overview';
import Upload from './components/upload';

// Loading spinner for auth initialization
const LoadingScreen = () => (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
            <p className="text-sm text-neutral-500">Loading...</p>
        </div>
    </div>
);

// App content with auth initialization
const AppContent = () => {
    const { initialized } = useAuthInit();

    // Show loading while Firebase checks auth state
    if (!initialized) {
        return <LoadingScreen />;
    }

    return (
        <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.COLLECTIONS} element={<Collections />} />
            <Route path={ROUTES.LOGIN} element={<Login />} />
            
            {/* Dashboard Routes */}
            <Route
                path={ROUTES.DASHBOARD}
                element={
                    <PrivateRoute>
                        <Dashboard>
                            <Overview />
                        </Dashboard>
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.DASHBOARD_UPLOAD}
                element={
                    <PrivateRoute>
                        <Dashboard>
                            <Upload />
                        </Dashboard>
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

function App() {
    return (
        <div className="App min-h-screen">
            <Provider store={store}>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </Provider>
            <Toaster 
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#18181b',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '14px',
                    },
                }}
            />
        </div>
    );
}

export default App;
