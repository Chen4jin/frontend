/**
 * Photos Component
 * Photo upload and management with Apple design system
 */

import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import {
    CloudArrowUpIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
    TrashIcon,
    PhotoIcon,
    ExclamationCircleIcon,
} from './ui';
import { BACKEND, API_VERSION } from '../config';
import { fetchImages, deleteImage, resetImages } from '../redux/imageSlice';
import { loadImage } from '../redux/setupSlice';

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const MAX_FILE_SIZE_DISPLAY = '10MB';

const statusConfig = {
    pending: {
        icon: ArrowPathIcon,
        color: 'text-neutral-400',
        bg: 'bg-neutral-100',
        label: 'Pending',
    },
    uploading: {
        icon: ArrowPathIcon,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        label: 'Uploading...',
        animate: true,
    },
    success: {
        icon: CheckCircleIcon,
        color: 'text-green-500',
        bg: 'bg-green-50',
        label: 'Uploaded',
    },
    error: {
        icon: XCircleIcon,
        color: 'text-red-500',
        bg: 'bg-red-50',
        label: 'Failed',
    },
};

const Upload = () => {
    const dispatch = useDispatch();
    const { images, loading: galleryLoading, deleting } = useSelector((state) => state.imageList);
    const { imagesLoaded } = useSelector((state) => state.setup);
    
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'manage'

    // Fetch gallery images on mount (only if not already loaded or loading)
    useEffect(() => {
        if (!imagesLoaded && !galleryLoading) {
            dispatch(fetchImages({ lastKey: "", page: 50 }));
            dispatch(loadImage());
        }
    }, [dispatch, imagesLoaded, galleryLoading]);

    // Handle photo deletion
    const handleDeletePhoto = async (imageID) => {
        try {
            await dispatch(deleteImage(imageID)).unwrap();
            toast.success('Photo deleted successfully');
            setDeleteConfirmId(null);
        } catch (err) {
            toast.error(err || 'Failed to delete photo');
        }
    };

    // Refresh gallery
    const refreshGallery = () => {
        dispatch(resetImages());
        dispatch(fetchImages({ lastKey: "", page: 50 }));
    };

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const droppedFiles = Array.from(e.dataTransfer.files).filter(
            file => file.type.startsWith('image/')
        );
        
        addFiles(droppedFiles);
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            addFiles(selectedFiles);
        }
    };

    const addFiles = (newFiles) => {
        const validFiles = [];
        const oversizedFiles = [];

        newFiles.forEach(file => {
            if (file.size > MAX_FILE_SIZE) {
                oversizedFiles.push(file.name);
            } else {
                validFiles.push(file);
            }
        });

        // Show warning for oversized files
        if (oversizedFiles.length > 0) {
            toast.error(`${oversizedFiles.length} file(s) exceed ${MAX_FILE_SIZE_DISPLAY} limit`);
        }

        // Add valid files
        if (validFiles.length > 0) {
            const fileItems = validFiles.map(file => ({
                id: nanoid(),
                data: file,
                status: 'pending',
                preview: URL.createObjectURL(file),
            }));
            setFiles(prev => [...prev, ...fileItems]);
        }
    };

    const removeFile = (id) => {
        setFiles(prev => {
            const file = prev.find(f => f.id === id);
            if (file?.preview) {
                URL.revokeObjectURL(file.preview);
            }
            return prev.filter(f => f.id !== id);
        });
    };

    const updateFileStatus = (id, status) => {
        setFiles(prev => prev.map(f => 
            f.id === id ? { ...f, status } : f
        ));
    };

    const handleUpload = async () => {
        const pendingFiles = files.filter(f => f.status === 'pending');
        if (pendingFiles.length === 0) return;

        setIsUploading(true);
        let uploadedCount = 0;
        let failedCount = 0;

        for (const file of pendingFiles) {
            updateFileStatus(file.id, 'uploading');
            
            try {
                // Get content type from file, default to jpeg
                const contentType = file.data.type || 'image/jpeg';
                
                // Request presigned URL with content type
                const responseData = (await axios.put(
                    `${BACKEND}${API_VERSION}images?contentType=${encodeURIComponent(contentType)}`
                )).data['data'];
                const signedURL = responseData['url'];
                const imageID = responseData['imageID'];
                
                // Use fetch for S3 upload (axios adds extra headers that break signature)
                const uploadResponse = await fetch(signedURL, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': contentType,
                    },
                    body: file.data,
                });

                if (uploadResponse.ok) {
                    await axios.post(BACKEND + API_VERSION + 'images', {
                        imageID: imageID,
                        fileName: file.data.name,
                        sizeBytes: file.data.size,
                    });
                    updateFileStatus(file.id, 'success');
                    uploadedCount++;
                } else {
                    updateFileStatus(file.id, 'error');
                    failedCount++;
                }
            } catch (error) {
                console.error('Upload error:', error);
                updateFileStatus(file.id, 'error');
                failedCount++;
            }
        }

        // Show completion toast
        if (failedCount > 0) {
            toast.error(`${failedCount} file(s) failed to upload`);
        }
        if (uploadedCount > 0) {
            toast.success(`${uploadedCount} photo(s) uploaded!`);
        }

        setIsUploading(false);
    };

    const clearAll = () => {
        files.forEach(f => {
            if (f.preview) URL.revokeObjectURL(f.preview);
        });
        setFiles([]);
    };

    const pendingCount = files.filter(f => f.status === 'pending').length;
    const successCount = files.filter(f => f.status === 'success').length;

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === 'upload'
                            ? 'bg-white text-neutral-900 shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                >
                    <span className="flex items-center gap-2">
                        <CloudArrowUpIcon className="w-4 h-4" strokeWidth={2} />
                        Upload
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('manage')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === 'manage'
                            ? 'bg-white text-neutral-900 shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                >
                    <span className="flex items-center gap-2">
                        <PhotoIcon className="w-4 h-4" strokeWidth={2} />
                        Manage ({images.length})
                    </span>
                </button>
            </div>

            {/* Upload Tab */}
            {activeTab === 'upload' && (
                <>
                    {/* Upload Zone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            relative rounded-2xl border-2 border-dashed transition-all duration-300
                            ${isDragging 
                                ? 'border-neutral-900 bg-neutral-100' 
                                : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
                            }
                        `}
                    >
                        <label className="flex flex-col items-center justify-center py-16 cursor-pointer">
                            <div className={`
                                p-4 rounded-2xl mb-4 transition-colors duration-300
                                ${isDragging ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'}
                            `}>
                                <CloudArrowUpIcon className="w-8 h-8" strokeWidth={1.5} />
                            </div>
                            <p className="text-base font-medium text-neutral-900 mb-1">
                                {isDragging ? 'Drop files here' : 'Drag and drop your photos'}
                            </p>
                            <p className="text-sm text-neutral-500 mb-4">
                                or click to browse
                            </p>
                            <span className="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors duration-200">
                                Select Files
                            </span>
                            <p className="mt-4 text-xs text-neutral-400">
                                PNG, JPG, GIF up to 10MB
                            </p>
                            <input
                                type="file"
                                accept="image/png, image/gif, image/jpeg, image/webp"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="bg-white rounded-2xl border border-neutral-200/60 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/60">
                                <div>
                                    <h3 className="text-sm font-semibold text-neutral-900">
                                        Selected Files
                                    </h3>
                                    <p className="text-xs text-neutral-500 mt-0.5">
                                        {files.length} file{files.length !== 1 ? 's' : ''} • {successCount} uploaded
                                    </p>
                                </div>
                                <button
                                    onClick={clearAll}
                                    className="text-xs font-medium text-neutral-500 hover:text-red-500 transition-colors duration-200"
                                >
                                    Clear all
                                </button>
                            </div>

                            {/* File items */}
                            <div className="divide-y divide-neutral-100">
                                {files.map((file) => {
                                    const config = statusConfig[file.status];
                                    const StatusIcon = config.icon;
                                    
                                    return (
                                        <div 
                                            key={file.id}
                                            className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors duration-200"
                                        >
                                            {/* Preview */}
                                            <div className="w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0">
                                                {file.preview ? (
                                                    <img 
                                                        src={file.preview} 
                                                        alt={file.data.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <PhotoIcon className="w-6 h-6 text-neutral-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-neutral-900 truncate">
                                                    {file.data.name}
                                                </p>
                                                <p className="text-xs text-neutral-500">
                                                    {(file.data.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>

                                            {/* Status */}
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg}`}>
                                                <StatusIcon 
                                                    className={`w-4 h-4 ${config.color} ${config.animate ? 'animate-spin' : ''}`} 
                                                    strokeWidth={2} 
                                                />
                                                <span className={`text-xs font-medium ${config.color}`}>
                                                    {config.label}
                                                </span>
                                            </div>

                                            {/* Remove button */}
                                            {file.status !== 'uploading' && (
                                                <button
                                                    onClick={() => removeFile(file.id)}
                                                    className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                                                >
                                                    <TrashIcon className="w-4 h-4" strokeWidth={2} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {files.length > 0 && (
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={clearAll}
                                disabled={isUploading}
                                className="px-5 py-2.5 rounded-full text-sm font-medium text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={isUploading || pendingCount === 0}
                                className="px-5 py-2.5 rounded-full text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <ArrowPathIcon className="w-4 h-4 animate-spin" strokeWidth={2} />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <CloudArrowUpIcon className="w-4 h-4" strokeWidth={2} />
                                        Upload {pendingCount > 0 ? `(${pendingCount})` : ''}
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Empty state */}
                    {files.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-sm text-neutral-400">
                                No files selected yet
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Manage Tab - Photo Gallery */}
            {activeTab === 'manage' && (
                <div className="space-y-4">
                    {/* Gallery Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-neutral-900">
                                Your Photos
                            </h3>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                {images.length} photo{images.length !== 1 ? 's' : ''} in gallery
                            </p>
                        </div>
                        <button
                            onClick={refreshGallery}
                            disabled={galleryLoading}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 transition-colors"
                        >
                            <ArrowPathIcon className={`w-3.5 h-3.5 ${galleryLoading ? 'animate-spin' : ''}`} strokeWidth={2} />
                            Refresh
                        </button>
                    </div>

                    {/* Loading State */}
                    {galleryLoading && images.length === 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="aspect-square rounded-xl bg-neutral-100 animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!galleryLoading && images.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="p-4 rounded-2xl bg-neutral-100 mb-4">
                                <PhotoIcon className="w-8 h-8 text-neutral-400" />
                            </div>
                            <h3 className="text-base font-medium text-neutral-900 mb-1">
                                No photos yet
                            </h3>
                            <p className="text-sm text-neutral-500 mb-4">
                                Upload some photos to get started
                            </p>
                            <button
                                onClick={() => setActiveTab('upload')}
                                className="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                            >
                                Upload Photos
                            </button>
                        </div>
                    )}

                    {/* Photo Grid */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map((image) => (
                                <div
                                    key={image.imageID}
                                    className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-100"
                                >
                                    <img
                                        src={image.cloudFront}
                                        alt={image.title || image.fileName || 'Photo'}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200">
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={() => setDeleteConfirmId(image.imageID)}
                                                className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
                                                title="Delete photo"
                                            >
                                                <TrashIcon className="w-5 h-5" strokeWidth={2} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* File info on hover */}
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <p className="text-xs text-white truncate">
                                            {image.fileName || 'Untitled'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {deleteConfirmId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center shadow-xl">
                                <div className="p-3 rounded-full bg-red-50 inline-block mb-4">
                                    <ExclamationCircleIcon className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                                    Delete Photo?
                                </h3>
                                <p className="text-neutral-500 text-sm mb-6">
                                    This action cannot be undone. The photo will be permanently removed from your gallery.
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="px-5 py-2.5 rounded-full bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-neutral-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDeletePhoto(deleteConfirmId)}
                                        disabled={deleting}
                                        className="px-5 py-2.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {deleting ? (
                                            <>
                                                <ArrowPathIcon className="w-4 h-4 animate-spin" strokeWidth={2} />
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Upload;
