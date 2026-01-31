/**
 * Application Configuration
 * Centralized config for environment variables and app settings
 */

// API Configuration (moved from common/common.js)
export const API = {
    baseUrl: import.meta.env.VITE_BACKEND || '',
    version: import.meta.env.VITE_API_VERSION || 'v1',
};

// Convenience exports for API
export const BACKEND = API.baseUrl;
export const API_VERSION = API.version;

// Full config object
export const config = {
    // API Configuration
    api: API,

    // App Metadata
    app: {
        name: 'Jin Chen',
        title: 'Jin Chen - Software Engineer & Photographer',
        description: 'Building scalable solutions with Python, Java, and AWS. Capturing moments through my lens.',
    },

    // External Links
    links: {
        github: 'https://github.com/chenjq',
        linkedin: 'https://linkedin.com/in/chenjq',
        resume: 'https://d3bjrjf10s3vbi.cloudfront.net/static/CV.pdf',
        profileImage: 'https://d3bjrjf10s3vbi.cloudfront.net/static/selfie.png',
    },

    // Feature Flags
    features: {
        darkMode: false,
        analytics: false,
    },
};

export default config;
