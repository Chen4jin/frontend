/**
 * Profile Service
 * Fetches profile data from backend API
 */

import axios from 'axios';
import { BACKEND, API_VERSION } from '../config';

const api = axios.create({
    baseURL: `${BACKEND}${API_VERSION}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Get profile photo (selfie) URL
 * @returns {Promise<string>} CloudFront URL for selfie
 */
export const getSelfie = async () => {
    try {
        const response = await api.get('selfie');
        return response.data?.data?.url || null;
    } catch (error) {
        console.error('Failed to fetch selfie:', error);
        return null;
    }
};

/**
 * Get resume download URL
 * @returns {Promise<string>} CloudFront URL for resume
 */
export const getResume = async () => {
    try {
        const response = await api.get('resume');
        return response.data?.data?.url || null;
    } catch (error) {
        console.error('Failed to fetch resume:', error);
        return null;
    }
};

/**
 * Get social links (GitHub, LinkedIn)
 * @returns {Promise<{github: string, linkedin: string}>}
 */
export const getSocialLinks = async () => {
    try {
        const response = await api.get('social-links');
        return response.data?.data || { github: '', linkedin: '' };
    } catch (error) {
        console.error('Failed to fetch social links:', error);
        return { github: '', linkedin: '' };
    }
};

/**
 * Get site message
 * @returns {Promise<string>} Site message
 */
export const getSiteMessage = async () => {
    try {
        const response = await api.get('site-message');
        return response.data?.data?.message || null;
    } catch (error) {
        console.error('Failed to fetch site message:', error);
        return null;
    }
};

/**
 * Get all profile data at once
 * @returns {Promise<{selfie: string, resume: string, socialLinks: object, siteMessage: string}>}
 */
export const getProfileData = async () => {
    const [selfie, resume, socialLinks, siteMessage] = await Promise.all([
        getSelfie(),
        getResume(),
        getSocialLinks(),
        getSiteMessage(),
    ]);

    return {
        selfie,
        resume,
        socialLinks,
        siteMessage,
    };
};

export default {
    getSelfie,
    getResume,
    getSocialLinks,
    getSiteMessage,
    getProfileData,
};
