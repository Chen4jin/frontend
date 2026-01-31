/**
 * Dashboard Overview Component
 * Main dashboard page with profile management features
 */

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
    UserCircleIcon,
    PhotoIcon,
    DocumentTextIcon,
    LinkIcon,
    ArrowPathIcon,
    CloudArrowUpIcon,
    DocumentArrowUpIcon,
    ChatBubbleBottomCenterTextIcon,
    PencilSquareIcon,
    GitHubIcon,
    LinkedInIcon,
} from '../ui';
import { BACKEND, API_VERSION } from '../../config';

const Overview = () => {
    // Selfie state
    const [selfie, setSelfie] = useState(null);
    const [selfiePreview, setSelfiePreview] = useState(null);
    const [uploadingSelfie, setUploadingSelfie] = useState(false);
    
    // Resume state
    const [resume, setResume] = useState(null);
    const [uploadingResume, setUploadingResume] = useState(false);

    // Social links state
    const [socialLinks, setSocialLinks] = useState({
        github: '',
        linkedin: '',
    });
    const [savingSocial, setSavingSocial] = useState(false);

    // Site message state
    const [siteMessage, setSiteMessage] = useState('');
    const [savingMessage, setSavingMessage] = useState(false);

    // Handle selfie file selection
    const handleSelfieChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelfie(file);
            setSelfiePreview(URL.createObjectURL(file));
        }
    };

    // Upload selfie
    const handleSelfieUpload = async () => {
        if (!selfie) return;
        
        setUploadingSelfie(true);

        try {
            const responseData = (await axios.put(BACKEND + API_VERSION + 'selfie')).data['data'];
            const signedURL = responseData['url'];
            
            await axios.put(signedURL, selfie, {
                headers: { 'Content-Type': selfie.type || 'image/jpeg' },
            });

            toast.success('Profile photo uploaded!');
            setSelfie(null);
            setSelfiePreview(null);
        } catch (error) {
            console.error('Selfie upload error:', error);
            toast.error('Failed to upload photo');
        } finally {
            setUploadingSelfie(false);
        }
    };

    // Handle resume file selection
    const handleResumeChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setResume(file);
        }
    };

    // Upload resume
    const handleResumeUpload = async () => {
        if (!resume) return;
        
        setUploadingResume(true);

        try {
            const responseData = (await axios.put(BACKEND + API_VERSION + 'resume')).data['data'];
            const signedURL = responseData['url'];
            
            await axios.put(signedURL, resume, {
                headers: { 'Content-Type': resume.type || 'application/pdf' },
            });

            toast.success('Resume uploaded!');
            setResume(null);
        } catch (error) {
            console.error('Resume upload error:', error);
            toast.error('Failed to upload resume');
        } finally {
            setUploadingResume(false);
        }
    };

    // Handle social links input
    const handleSocialChange = (field, value) => {
        setSocialLinks(prev => ({ ...prev, [field]: value }));
    };

    // Save social links
    const handleSaveSocialLinks = async () => {
        setSavingSocial(true);

        try {
            await axios.post(BACKEND + API_VERSION + 'social-links', {
                github: socialLinks.github,
                linkedin: socialLinks.linkedin,
            });
            toast.success('Social links saved!');
        } catch (error) {
            console.error('Social links save error:', error);
            toast.error('Failed to save links');
        } finally {
            setSavingSocial(false);
        }
    };

    // Save site message
    const handleSaveMessage = async () => {
        if (!siteMessage.trim()) return;
        
        setSavingMessage(true);

        try {
            await axios.post(BACKEND + API_VERSION + 'site-message', {
                message: siteMessage,
            });
            toast.success('Message updated!');
        } catch (error) {
            console.error('Site message save error:', error);
            toast.error('Failed to save message');
        } finally {
            setSavingMessage(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 text-white">
                <h2 className="text-xl font-semibold mb-2">Welcome back!</h2>
                <p className="text-neutral-300 text-sm">
                    Manage your profile, resume, and social links from here.
                </p>
            </div>

            {/* Profile Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Selfie Upload Card */}
                <div className="bg-white rounded-2xl border border-neutral-200/60 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-neutral-100">
                            <UserCircleIcon className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900">Profile Photo</h3>
                            <p className="text-xs text-neutral-500">Update your profile picture</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block cursor-pointer">
                            <div className={`
                                w-full aspect-square max-w-[180px] mx-auto rounded-full overflow-hidden
                                border-2 border-dashed transition-all duration-200
                                ${selfiePreview 
                                    ? 'border-transparent' 
                                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50'
                                }
                            `}>
                                {selfiePreview ? (
                                    <img src={selfiePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                                        <PhotoIcon className="w-8 h-8 mb-2" strokeWidth={1} />
                                        <span className="text-xs">Click to select</span>
                                    </div>
                                )}
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={handleSelfieChange} />
                        </label>

                        {selfie && (
                            <button
                                onClick={handleSelfieUpload}
                                disabled={uploadingSelfie}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 transition-all duration-200"
                            >
                                {uploadingSelfie ? (
                                    <><ArrowPathIcon className="w-4 h-4 animate-spin" />Uploading...</>
                                ) : (
                                    <><CloudArrowUpIcon className="w-4 h-4" />Upload Photo</>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Resume Upload Card */}
                <div className="bg-white rounded-2xl border border-neutral-200/60 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-neutral-100">
                            <DocumentTextIcon className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900">Resume / CV</h3>
                            <p className="text-xs text-neutral-500">Upload your latest resume</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block cursor-pointer">
                            <div className={`
                                w-full py-12 rounded-xl border-2 border-dashed transition-all duration-200
                                ${resume 
                                    ? 'border-neutral-900 bg-neutral-50' 
                                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50'
                                }
                            `}>
                                <div className="flex flex-col items-center justify-center text-neutral-500">
                                    <DocumentArrowUpIcon className="w-8 h-8 mb-2" strokeWidth={1} />
                                    {resume ? (
                                        <span className="text-sm font-medium text-neutral-900">{resume.name}</span>
                                    ) : (
                                        <>
                                            <span className="text-sm font-medium">Click to select file</span>
                                            <span className="text-xs text-neutral-400 mt-1">PDF, DOC, DOCX (Max 5MB)</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <input 
                                type="file" 
                                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                                className="hidden" 
                                onChange={handleResumeChange} 
                            />
                        </label>

                        {resume && (
                            <button
                                onClick={handleResumeUpload}
                                disabled={uploadingResume}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 transition-all duration-200"
                            >
                                {uploadingResume ? (
                                    <><ArrowPathIcon className="w-4 h-4 animate-spin" />Uploading...</>
                                ) : (
                                    <><CloudArrowUpIcon className="w-4 h-4" />Upload Resume</>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-white rounded-2xl border border-neutral-200/60 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-neutral-100">
                        <LinkIcon className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Social Links</h3>
                        <p className="text-xs text-neutral-500">Update your GitHub and LinkedIn URLs</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* GitHub */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            <div className="flex items-center gap-2">
                                <GitHubIcon className="w-4 h-4" />
                                GitHub Profile
                            </div>
                        </label>
                        <input
                            type="url"
                            value={socialLinks.github}
                            onChange={(e) => handleSocialChange('github', e.target.value)}
                            placeholder="https://github.com/username"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all duration-200"
                        />
                    </div>

                    {/* LinkedIn */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            <div className="flex items-center gap-2">
                                <LinkedInIcon className="w-4 h-4" />
                                LinkedIn Profile
                            </div>
                        </label>
                        <input
                            type="url"
                            value={socialLinks.linkedin}
                            onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 transition-all duration-200"
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSaveSocialLinks}
                        disabled={savingSocial || (!socialLinks.github && !socialLinks.linkedin)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {savingSocial ? (
                            <><ArrowPathIcon className="w-4 h-4 animate-spin" />Saving...</>
                        ) : (
                            'Save Links'
                        )}
                    </button>
                </div>
            </div>

            {/* Site Message Card */}
            <div className="bg-white rounded-2xl border border-neutral-200/60 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-neutral-100">
                        <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-neutral-600" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-neutral-900">Site Message</h3>
                        <p className="text-xs text-neutral-500">Update the message displayed on your homepage</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Homepage Message
                        </label>
                        <textarea
                            value={siteMessage}
                            onChange={(e) => setSiteMessage(e.target.value)}
                            placeholder="Write a message or announcement for your visitors..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-300 resize-none transition-all duration-200"
                        />
                        <p className="mt-2 text-xs text-neutral-400">
                            This message will be displayed on your homepage for all visitors to see.
                        </p>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSaveMessage}
                        disabled={savingMessage || !siteMessage.trim()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {savingMessage ? (
                            <><ArrowPathIcon className="w-4 h-4 animate-spin" />Saving...</>
                        ) : (
                            <><PencilSquareIcon className="w-4 h-4" />Update Message</>
                        )}
                    </button>
                </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl border border-neutral-200/60 p-6">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Quick Tips</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-neutral-50">
                        <div className="text-2xl mb-2">📸</div>
                        <p className="text-xs text-neutral-600">
                            Use a professional photo to make a great first impression.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-50">
                        <div className="text-2xl mb-2">📄</div>
                        <p className="text-xs text-neutral-600">
                            Keep your resume updated with latest experience.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-50">
                        <div className="text-2xl mb-2">🔗</div>
                        <p className="text-xs text-neutral-600">
                            Add social links so visitors can connect with you.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-50">
                        <div className="text-2xl mb-2">💬</div>
                        <p className="text-xs text-neutral-600">
                            Update your site message to engage visitors.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
