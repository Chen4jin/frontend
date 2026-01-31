/**
 * Sidebar Component
 * Dashboard navigation sidebar with Apple design
 */

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import { logout } from '../services/auth';
import { clearUser } from '../redux/userSlice';
import { ROUTES } from '../constants';
import {
    Logo,
    Squares2X2Icon,
    CloudArrowUpIcon,
    ArrowRightStartOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
} from './ui';

const navigationItems = [
    {
        name: 'Overview',
        to: ROUTES.DASHBOARD,
        icon: Squares2X2Icon,
        exact: true,
    },
    {
        name: 'Upload Photos',
        to: ROUTES.DASHBOARD_UPLOAD,
        icon: CloudArrowUpIcon,
    },
];

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.user);

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        dispatch(clearUser());
        navigate(ROUTES.LOGIN);
    };

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-4 bg-white/80 backdrop-blur-xl border-b border-neutral-200/60">
                <Logo showName />
                <button
                    type="button"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="icon-btn"
                >
                    <span className="sr-only">Toggle sidebar</span>
                    {sidebarOpen ? (
                        <XMarkIcon className="w-5 h-5" strokeWidth={2} />
                    ) : (
                        <Bars3Icon className="w-5 h-5" strokeWidth={2} />
                    )}
                </button>
            </div>

            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div 
                    className="lg:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    'fixed top-0 left-0 z-40 h-screen w-72',
                    'bg-neutral-50/95 backdrop-blur-xl border-r border-neutral-200/60',
                    'transition-transform duration-300 ease-out lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center h-14 px-6 border-b border-neutral-200/60">
                        <Logo showName />
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <p className="px-3 mb-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                            Menu
                        </p>
                        {navigationItems.map((item) => {
                            const active = isActive(item.to, item.exact);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.to}
                                    onClick={() => setSidebarOpen(false)}
                                    className={clsx('sidebar-link group', active && 'sidebar-link-active')}
                                >
                                    <item.icon 
                                        className={clsx(
                                            'sidebar-link-icon group-hover:text-neutral-700',
                                            active && 'sidebar-link-icon-active'
                                        )} 
                                        strokeWidth={1.5} 
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}

                        {/* Back to site */}
                        <div className="pt-4 mt-4 border-t border-neutral-200/60">
                            <p className="px-3 mb-3 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                                Quick Links
                            </p>
                            <Link
                                to={ROUTES.HOME}
                                onClick={() => setSidebarOpen(false)}
                                className="sidebar-link group"
                            >
                                <HomeIcon className="sidebar-link-icon group-hover:text-neutral-700" strokeWidth={1.5} />
                                Back to Site
                            </Link>
                        </div>
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-neutral-200/60">
                        <div className="user-card">
                            <div className="avatar-md">
                                {user ? user.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 truncate">
                                    {user || 'User'}
                                </p>
                                <p className="text-xs text-neutral-500">Administrator</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn-signout mt-3"
                        >
                            <ArrowRightStartOnRectangleIcon className="w-5 h-5" strokeWidth={1.5} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
