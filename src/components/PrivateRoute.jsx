/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * Validates both Redux state AND Firebase auth state
 */

import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from '../constants';
import { isAuthValid } from '../services/auth';

const PrivateRoute = ({ children }) => {
    const { status } = useSelector((state) => state.user);
    
    // Check both Redux state AND actual Firebase auth validity
    // This prevents manipulation of Redux state to bypass auth
    if (!status || !isAuthValid()) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }
    
    return children;
};

export default PrivateRoute;
