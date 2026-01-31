/**
 * useAuthInit Hook
 * Initializes auth state from Firebase on app load
 * Handles session expiration (24 hours)
 */

import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../redux/userSlice';
import { subscribeToAuthChanges, logout, getSessionTimeRemaining } from '../services/auth';

export const useAuthInit = () => {
    const dispatch = useDispatch();
    const [initialized, setInitialized] = useState(false);

    // Force logout handler
    const handleSessionExpired = useCallback(async () => {
        await logout();
        dispatch(clearUser());
    }, [dispatch]);

    useEffect(() => {
        let sessionTimer = null;

        // Subscribe to Firebase auth state changes
        const unsubscribe = subscribeToAuthChanges((user) => {
            if (user) {
                dispatch(setUser({
                    email: user.email,
                    status: user.status,
                }));

                // Set up session expiration timer
                const timeRemaining = getSessionTimeRemaining();
                if (timeRemaining > 0) {
                    sessionTimer = setTimeout(() => {
                        handleSessionExpired();
                    }, timeRemaining);
                }
            } else {
                dispatch(clearUser());
                // Clear any existing timer
                if (sessionTimer) {
                    clearTimeout(sessionTimer);
                }
            }
            setInitialized(true);
        });

        // Cleanup subscription and timer on unmount
        return () => {
            unsubscribe();
            if (sessionTimer) {
                clearTimeout(sessionTimer);
            }
        };
    }, [dispatch, handleSessionExpired]);

    return { initialized };
};

export default useAuthInit;
