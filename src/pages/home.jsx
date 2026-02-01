/**
 * Home Page
 * Hero section with introduction and social links
 */

import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/navbar';
import { ArrowDownTrayIcon, ArrowRightIcon, GitHubIcon, LinkedInIcon } from '../components/ui';
import config from '../config';
import { getProfileData } from '../services/profile';

const Home = () => {
    const [profileData, setProfileData] = useState({
        selfie: config.links.profileImage, // Fallback to config
        resume: config.links.resume,
        socialLinks: {
            github: config.links.github,
            linkedin: config.links.linkedin,
        },
        siteMessage: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getProfileData();
                setProfileData({
                    selfie: data.selfie || config.links.profileImage,
                    resume: data.resume || config.links.resume,
                    socialLinks: {
                        github: data.socialLinks?.github || config.links.github,
                        linkedin: data.socialLinks?.linkedin || config.links.linkedin,
                    },
                    siteMessage: data.siteMessage,
                });
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
                // Keep fallback values from config
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Build social links array with dynamic data (memoized)
    const socialLinks = useMemo(() => [
        { 
            name: 'Resume', 
            href: profileData.resume, 
            icon: ArrowDownTrayIcon,
            download: true,
        },
        { 
            name: 'GitHub', 
            href: profileData.socialLinks.github, 
            icon: GitHubIcon,
            external: true,
        },
        { 
            name: 'LinkedIn', 
            href: profileData.socialLinks.linkedin, 
            icon: LinkedInIcon,
            external: true,
        },
    ].filter(link => link.href), [profileData.resume, profileData.socialLinks.github, profileData.socialLinks.linkedin]);

    return (
        <div className="min-h-screen select-none bg-apple-bg">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative min-h-[calc(100vh-48px)] flex items-center justify-center">
                <div className="container-default w-full">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        
                        {/* Profile Image */}
                        <div className="flex-shrink-0 opacity-0 animate-fade-in-scale">
                            <div className="relative group">
                                {loading ? (
                                    <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-full bg-neutral-200 animate-pulse" />
                                ) : (
                                    <img
                                        className="w-48 h-48 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                                        src={profileData.selfie}
                                        alt={config.app.name}
                                        draggable="false"
                                    />
                                )}
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-apple-gray-light via-transparent to-apple-gray-light/50 -z-10 opacity-60" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center lg:text-left cursor-default">
                            
                            {/* Intro Label */}
                            <p className="text-label mb-3 opacity-0 animate-fade-in-up animation-delay-200">
                                Hello, I'm
                            </p>
                            
                            {/* Name - Hero Typography */}
                            <h1 className="text-hero-xl mb-4 opacity-0 animate-fade-in-up animation-delay-300">
                                {config.app.name}
                            </h1>
                            
                            {/* Title - Gradient Text */}
                            <h2 className="text-hero-md mb-8 opacity-0 animate-fade-in-up animation-delay-400">
                                <span className="text-gradient-gray">
                                    Software Engineer.
                                </span>
                                <br />
                                <span className="text-gradient-subtle">
                                    Photographer.
                                </span>
                            </h2>
                            
                            {/* Site Message (if available) */}
                            {profileData.siteMessage && (
                                <p className="text-body-md max-w-xl mx-auto lg:mx-0 mb-6 p-4 rounded-xl bg-neutral-100 opacity-0 animate-fade-in-up animation-delay-500">
                                    {profileData.siteMessage}
                                </p>
                            )}
                            
                            {/* Description */}
                            <p className="text-body-lg max-w-xl mx-auto lg:mx-0 mb-10 opacity-0 animate-fade-in-up animation-delay-500">
                                {config.app.description}
                            </p>
                            
                            {/* Social Links */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-0 animate-fade-in-up animation-delay-600">
                                {socialLinks.map((link) => (
                                    <a 
                                        key={link.name}
                                        href={link.href}
                                        target={link.external ? '_blank' : undefined}
                                        rel={link.external ? 'noopener noreferrer' : undefined}
                                        download={link.download}
                                        className="group inline-flex items-center gap-2 text-apple-black text-lg font-normal transition-opacity duration-300 hover:opacity-60"
                                    >
                                        <link.icon className="w-5 h-5" />
                                        <span>{link.name}</span>
                                        <ArrowRightIcon className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
