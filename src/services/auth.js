/**
 * Authentication Service
 * Handles Firebase authentication operations with secure session management
 */

import { auth, SESSION_DURATION_MS, SESSION_KEY } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

/**
 * Generate a simple hash for session validation
 * This prevents users from simply setting any timestamp in localStorage
 */
const generateSessionHash = (timestamp, uid) => {
    // Simple hash combining timestamp, uid, and a rotating component
    const data = `${timestamp}-${uid}-${navigator.userAgent}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
};

/**
 * Set session data on login (with validation hash)
 */
const setSessionData = (uid) => {
    const timestamp = Date.now();
    const hash = generateSessionHash(timestamp, uid);
    const sessionData = JSON.stringify({ timestamp, hash, uid });
    localStorage.setItem(SESSION_KEY, sessionData);
};

/**
 * Clear session data on logout
 */
const clearSessionData = () => {
    localStorage.removeItem(SESSION_KEY);
};

/**
 * Get and validate session data
 * Returns null if session is invalid or tampered
 */
const getValidSessionData = () => {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        
        const data = JSON.parse(raw);
        if (!data.timestamp || !data.hash || !data.uid) return null;
        
        // Verify the hash matches (prevents tampering)
        const expectedHash = generateSessionHash(data.timestamp, data.uid);
        if (data.hash !== expectedHash) {
            console.warn('Session data tampered, clearing session');
            clearSessionData();
            return null;
        }
        
        return data;
    } catch {
        clearSessionData();
        return null;
    }
};

/**
 * Check if session is expired (24 hours)
 * Also validates session integrity
 */
export const isSessionExpired = () => {
    const sessionData = getValidSessionData();
    if (!sessionData) return true;
    
    const elapsed = Date.now() - sessionData.timestamp;
    
    // Consider sessions less than 10 seconds old as fresh (race condition handling)
    if (elapsed < 10000) return false;
    
    return elapsed >= SESSION_DURATION_MS;
};

/**
 * Get remaining session time in milliseconds
 */
export const getSessionTimeRemaining = () => {
    const sessionData = getValidSessionData();
    if (!sessionData) return 0;
    
    const elapsed = Date.now() - sessionData.timestamp;
    const remaining = SESSION_DURATION_MS - elapsed;
    return Math.max(0, remaining);
};

/**
 * Verify that the current Firebase user matches the session
 */
export const isAuthValid = () => {
    // If login is in progress, consider auth valid temporarily
    if (loginInProgress) return true;
    
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return false;
    
    const sessionData = getValidSessionData();
    if (!sessionData) return false;
    
    // Verify Firebase user matches session user
    if (sessionData.uid !== firebaseUser.uid) {
        console.warn('Session user mismatch');
        return false;
    }
    
    // Check session expiration
    if (isSessionExpired()) return false;
    
    return true;
};

// Track if login is in progress (to handle race condition with onAuthStateChanged)
let loginInProgress = false;

/**
 * Check if login is currently in progress
 */
export const isLoginInProgress = () => loginInProgress;

/**
 * Login with email and password
 */
export const login = async (email, password) => {
    loginInProgress = true;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Set session data immediately after successful login
        setSessionData(userCredential.user.uid);
        
        loginInProgress = false;
        
        return {
            email: userCredential.user.email,
            uid: userCredential.user.uid,
            status: userCredential.operationType,
        };
    } catch (error) {
        loginInProgress = false;
        // Ensure no stale session data
        clearSessionData();
        throw error;
    }
};

/**
 * Logout current user and invalidate session
 */
export const logout = async () => {
    // Clear session data first
    clearSessionData();
    
    // Sign out from Firebase
    await signOut(auth);
};

/**
 * Subscribe to auth state changes with session validation
 */
export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            // If login is in progress, wait a moment for session data to be set
            if (loginInProgress) {
                // Wait for login to complete and session to be set
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Validate session integrity and expiration
            const sessionData = getValidSessionData();
            
            // If no valid session or session expired, force logout
            // But only if login is not in progress
            if (!sessionData || isSessionExpired()) {
                if (!loginInProgress) {
                    await logout();
                    callback(null);
                    return;
                }
                // If login is still in progress, create session now
                setSessionData(user.uid);
            }
            
            // Re-check session after potential creation
            const validSession = getValidSessionData();
            if (!validSession) {
                await logout();
                callback(null);
                return;
            }
            
            // Verify session belongs to this user
            if (validSession.uid !== user.uid) {
                console.warn('Session user mismatch, logging out');
                await logout();
                callback(null);
                return;
            }
            
            callback({
                email: user.email,
                uid: user.uid,
                status: 'signIn',
            });
        } else {
            // Clear any stale session data
            clearSessionData();
            callback(null);
        }
    });
};

/**
 * Get current user (with validation)
 */
export const getCurrentUser = () => {
    if (!isAuthValid()) return null;
    return auth.currentUser;
};

/**
 * Map Firebase error codes to user-friendly messages
 */
export const getAuthErrorMessage = (errorCode) => {
    const errorMessages = {
        'auth/invalid-email': 'Invalid email address.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/email-already-in-use': 'An account already exists with this email.',
        'auth/weak-password': 'Password should be at least 6 characters.',
    };

    return errorMessages[errorCode] || 'An error occurred. Please try again.';
};
