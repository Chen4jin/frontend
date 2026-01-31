/**
 * Navigation Configuration
 * Centralized navigation items for navbar and mobile menu
 */

import { ROUTES } from './routes';

export const NAVIGATION_ITEMS = [
    { 
        name: 'Home', 
        to: ROUTES.HOME,
        icon: 'home',
    },
    { 
        name: 'Collections', 
        to: ROUTES.COLLECTIONS,
        icon: 'collections',
    },
];

export const AUTH_NAVIGATION = {
    signIn: {
        name: 'Sign In',
        to: ROUTES.LOGIN,
        icon: 'user',
    },
    dashboard: {
        name: 'Dashboard',
        to: ROUTES.DASHBOARD,
        icon: 'dashboard',
    },
};

export default NAVIGATION_ITEMS;
