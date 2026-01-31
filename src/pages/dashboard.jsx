/**
 * Dashboard Page
 * Admin dashboard with Apple design system
 */

import { useLocation } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import { ROUTES } from '../constants';

const pageConfig = {
    [ROUTES.DASHBOARD]: {
        title: 'Overview',
        description: 'Manage your profile and site content',
    },
    [ROUTES.DASHBOARD_UPLOAD]: {
        title: 'Upload Photos',
        description: 'Add new photos to your collections',
    },
};

const Dashboard = ({ children }) => {
    const location = useLocation();
    const config = pageConfig[location.pathname] || pageConfig[ROUTES.DASHBOARD];

    return (
        <div className="min-h-screen bg-neutral-50">
            <Sidebar />
            
            {/* Main content */}
            <main className="lg:pl-72 min-h-screen">
                {/* Mobile header spacer */}
                <div className="lg:hidden h-14" />
                
                {/* Content area */}
                <div className="p-6 lg:p-8">
                    {/* Page header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-neutral-900">
                            {config.title}
                        </h1>
                        <p className="mt-1 text-neutral-500">
                            {config.description}
                        </p>
                    </div>

                    {/* Main content */}
                    <div className="space-y-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
