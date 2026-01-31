/**
 * Firebase Configuration
 * Uses environment variables for security
 */

import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';

// Session configuration
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
export const SESSION_KEY = 'auth_session_timestamp';

// Validate required environment variables
const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0 && import.meta.env.DEV) {
    console.warn(`Missing Firebase env vars: ${missingVars.join(', ')}`);
}

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set auth persistence to local storage (survives browser refresh)
setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('Auth persistence error:', error);
});
