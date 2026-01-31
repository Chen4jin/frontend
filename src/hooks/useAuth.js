/**
 * useAuth Hook
 * Centralized authentication state and actions
 */

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { setUser, clearUser, setError, setLoading } from '../redux/userSlice';
import { ROUTES } from '../constants';
import * as authService from '../services/auth';

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, status, error, loading } = useSelector((state) => state.user);

    const login = useCallback(async (email, password) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        
        try {
            const result = await authService.login(email, password);
            dispatch(setUser(result));
            navigate(ROUTES.DASHBOARD);
            return { success: true };
        } catch (err) {
            const errorMessage = authService.getAuthErrorMessage(err.code);
            dispatch(setError(errorMessage));
            return { success: false, error: errorMessage };
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, navigate]);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
            dispatch(clearUser());
            navigate(ROUTES.HOME);
        } catch (err) {
            console.error('Logout error:', err);
        }
    }, [dispatch, navigate]);

    const clearAuthError = useCallback(() => {
        dispatch(setError(null));
    }, [dispatch]);

    return {
        user,
        isAuthenticated: !!status,
        error,
        loading,
        login,
        logout,
        clearAuthError,
    };
};

export default useAuth;
