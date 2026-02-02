/**
 * Lightbox Component
 * Full-screen image viewer with keyboard navigation, progressive loading, and photo info
 */

import { useEffect, useCallback, useState } from 'react';
import { Dialog, DialogPanel, DialogBackdrop, Transition, TransitionChild } from '@headlessui/react';
import clsx from 'clsx';
import { XMarkIcon, PhotoIcon } from './Icons';
import {
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineInformationCircle,
    HiOutlineCamera,
    HiOutlineCog6Tooth,
    HiOutlineCalendarDays,
    HiOutlineMapPin,
    HiOutlineDocumentChartBar,
    HiOutlinePhoto,
    HiOutlineRectangleGroup,
} from 'react-icons/hi2';

// Progressive image loader component
const ProgressiveImage = ({ src, alt, onLoad }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(null);

    useEffect(() => {
        setIsLoaded(false);
        setCurrentSrc(null);
        
        const img = new Image();
        img.onload = () => {
            setCurrentSrc(src);
            setIsLoaded(true);
            onLoad?.();
        };
        img.src = src;

        return () => {
            img.onload = null;
        };
    }, [src, onLoad]);

    const preventSave = (e) => {
        e.preventDefault();
    };

    return (
        <div
            className="relative flex items-center justify-center photo-protected"
            onContextMenu={preventSave}
            onDragStart={preventSave}
        >
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span className="text-white/60 text-sm">Loading...</span>
                    </div>
                </div>
            )}

            {currentSrc && (
                <img
                    src={currentSrc}
                    alt={alt}
                    className={clsx(
                        'max-w-full max-h-[85vh] object-contain rounded-lg select-none',
                        'transition-all duration-500 ease-out',
                        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    )}
                    draggable={false}
                    onContextMenu={preventSave}
                    onDragStart={preventSave}
                />
            )}

            {!currentSrc && (
                <div className="w-[60vw] h-[60vh] flex items-center justify-center" />
            )}
        </div>
    );
};

// Photo info item component
const InfoItem = ({ icon: Icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-center gap-3 py-2">
            <div className="p-1.5 rounded-lg bg-white/10">
                <Icon className="w-4 h-4 text-white/70" />
            </div>
            <div>
                <p className="text-xs text-white/50">{label}</p>
                <p className="text-sm text-white">{value}</p>
            </div>
        </div>
    );
};

// Camera settings display (aperture, shutter, ISO in one line)
const CameraSettings = ({ aperture, shutter, iso, focalLength }) => {
    const settings = [
        aperture && `ƒ/${aperture}`,
        shutter && `${shutter}s`,
        iso && `ISO ${iso}`,
        focalLength && `${focalLength}mm`,
    ].filter(Boolean);

    if (settings.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 py-2">
            {settings.map((setting, i) => (
                <span key={i} className="info-pill">
                    {setting}
                </span>
            ))}
        </div>
    );
};

// Photo info panel component
const PhotoInfoPanel = ({ image, isOpen, onClose }) => {
    if (!isOpen) return null;

    // Check if there's any info to display
    const hasInfo = image.camera || image.lens || image.aperture || image.shutter ||
                    image.iso || image.focalLength || image.dateTaken || image.location ||
                    image.title || image.description || image.sizeBytes ||
                    (image.width && image.height);

    return (
        <Transition show={isOpen}>
            <TransitionChild
                enter="ease-out duration-300"
                enterFrom="translate-x-full opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="ease-in duration-200"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="translate-x-full opacity-0"
            >
                <div className="absolute top-0 right-0 h-full w-80 bg-black/80 backdrop-blur-xl border-l border-white/10 overflow-y-auto">
                    {/* Header */}
                    <div className="panel-header">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <HiOutlineInformationCircle className="w-5 h-5" />
                            Photo Info
                        </h3>
                        <button
                            onClick={onClose}
                            className="lightbox-btn"
                            aria-label="Close info panel"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                        {/* Title & Description */}
                        {(image.title || image.description) && (
                            <div className="panel-divider">
                                <h5 className="panel-section-title flex items-center gap-2">
                                    <HiOutlineDocumentChartBar className="w-4 h-4 text-white/50" />
                                    Title & description
                                </h5>
                                {image.title && (
                                    <h4 className="text-lg font-semibold text-white mb-1">
                                        {image.title}
                                    </h4>
                                )}
                                {image.description && (
                                    <p className="text-sm text-white/70">
                                        {image.description}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Camera & Lens */}
                        {(image.camera || image.lens) && (
                            <div className="panel-divider">
                                <h5 className="panel-section-title flex items-center gap-2">
                                    <HiOutlineCamera className="w-4 h-4 text-white/50" />
                                    Equipment
                                </h5>
                                <InfoItem 
                                    icon={HiOutlineCamera} 
                                    label="Camera" 
                                    value={image.camera} 
                                />
                                <InfoItem 
                                    icon={() => (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="12" cy="12" r="10" />
                                            <circle cx="12" cy="12" r="6" />
                                            <circle cx="12" cy="12" r="2" />
                                        </svg>
                                    )} 
                                    label="Lens" 
                                    value={image.lens} 
                                />
                            </div>
                        )}

                        {/* Camera Settings */}
                        {(image.aperture || image.shutter || image.iso || image.focalLength) && (
                            <div className="panel-divider">
                                <h5 className="panel-section-title flex items-center gap-2">
                                    <HiOutlineCog6Tooth className="w-4 h-4 text-white/50" />
                                    Settings
                                </h5>
                                <CameraSettings 
                                    aperture={image.aperture}
                                    shutter={image.shutter}
                                    iso={image.iso}
                                    focalLength={image.focalLength}
                                />
                            </div>
                        )}

                        {/* Date & Location */}
                        {(image.dateTaken || image.location) && (
                            <div className="panel-divider">
                                <h5 className="panel-section-title flex items-center gap-2">
                                    <HiOutlineCalendarDays className="w-4 h-4 text-white/50" />
                                    Date & location
                                </h5>
                                {image.dateTaken && (
                                    <InfoItem 
                                        icon={HiOutlineCalendarDays} 
                                        label="Date Taken" 
                                        value={typeof image.dateTaken === 'string' 
                                            ? image.dateTaken 
                                            : new Date(image.dateTaken).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                        } 
                                    />
                                )}
                                {image.location && (
                                    <InfoItem 
                                        icon={HiOutlineMapPin} 
                                        label="Location" 
                                        value={image.location} 
                                    />
                                )}
                            </div>
                        )}

                        {/* Size & dimensions (no File / fileName) */}
                        {(image.sizeBytes || (image.width && image.height)) && (
                            <div>
                                <h5 className="panel-section-title flex items-center gap-2">
                                    <HiOutlinePhoto className="w-4 h-4 text-white/50" />
                                    Size & dimensions
                                </h5>
                                {image.sizeBytes && (
                                    <InfoItem
                                        icon={HiOutlineDocumentChartBar}
                                        label="Size"
                                        value={`${(image.sizeBytes / (1024 * 1024)).toFixed(2)} MB`}
                                    />
                                )}
                                {image.width && image.height && (
                                    <InfoItem
                                        icon={HiOutlineRectangleGroup}
                                        label="Dimensions"
                                        value={`${image.width} × ${image.height}`}
                                    />
                                )}
                            </div>
                        )}

                        {/* No info message */}
                        {!hasInfo && (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <PhotoIcon className="w-12 h-12 text-white/20 mb-3" />
                                <p className="text-white/50 text-sm">
                                    No additional info available
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </TransitionChild>
        </Transition>
    );
};

export const Lightbox = ({
    isOpen,
    onClose,
    images = [],
    currentIndex = 0,
    onNavigate,
}) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const currentImage = images[currentIndex];
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < images.length - 1;

    // Reset states when image changes
    useEffect(() => {
        setIsImageLoaded(false);
    }, [currentIndex]);

    // Close info panel when lightbox closes
    useEffect(() => {
        if (!isOpen) {
            setShowInfo(false);
        }
    }, [isOpen]);

    const goToPrev = useCallback(() => {
        if (hasPrev) {
            onNavigate(currentIndex - 1);
        }
    }, [hasPrev, currentIndex, onNavigate]);

    const goToNext = useCallback(() => {
        if (hasNext) {
            onNavigate(currentIndex + 1);
        }
    }, [hasNext, currentIndex, onNavigate]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowLeft':
                    goToPrev();
                    break;
                case 'ArrowRight':
                    goToNext();
                    break;
                case 'Escape':
                    if (showInfo) {
                        setShowInfo(false);
                    } else {
                        onClose();
                    }
                    break;
                case 'i':
                case 'I':
                    setShowInfo(prev => !prev);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, goToPrev, goToNext, onClose, showInfo]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Preload adjacent images
    useEffect(() => {
        if (!isOpen || !images.length) return;

        const preloadImages = [];
        
        if (hasNext && images[currentIndex + 1]?.cloudFront) {
            const nextImg = new Image();
            nextImg.src = images[currentIndex + 1].cloudFront;
            preloadImages.push(nextImg);
        }
        
        if (hasPrev && images[currentIndex - 1]?.cloudFront) {
            const prevImg = new Image();
            prevImg.src = images[currentIndex - 1].cloudFront;
            preloadImages.push(prevImg);
        }

        return () => {
            preloadImages.forEach(img => {
                img.src = '';
            });
        };
    }, [isOpen, currentIndex, images, hasNext, hasPrev]);

    if (!currentImage) return null;

    return (
        <Transition show={isOpen}>
            <Dialog onClose={onClose} className="relative z-50">
                {/* Backdrop */}
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <DialogBackdrop className="fixed inset-0 bg-black/95" />
                </TransitionChild>

                {/* Content */}
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <DialogPanel className="fixed inset-0 flex items-center justify-center">
                        {/* Top bar */}
                        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
                            {/* Image counter */}
                            <div className="counter-badge">
                                {currentIndex + 1} / {images.length}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {/* Info toggle button */}
                                <button
                                    onClick={() => setShowInfo(!showInfo)}
                                    className={clsx('lightbox-btn', showInfo && 'lightbox-btn-active')}
                                    aria-label="Toggle photo info"
                                    title="Photo info (I)"
                                >
                                    <HiOutlineInformationCircle className="w-5 h-5" />
                                </button>

                                {/* Close button */}
                                <button
                                    onClick={onClose}
                                    className="lightbox-btn"
                                    aria-label="Close lightbox"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Previous button */}
                        {hasPrev && (
                            <button
                                onClick={goToPrev}
                                className="lightbox-btn-lg absolute left-4 z-10"
                                aria-label="Previous image"
                            >
                                <HiOutlineChevronLeft className="w-6 h-6" />
                            </button>
                        )}

                        {/* Next button */}
                        {hasNext && (
                            <button
                                onClick={goToNext}
                                className={clsx(
                                    'lightbox-btn-lg absolute z-10',
                                    showInfo ? 'right-[21rem]' : 'right-4'
                                )}
                                aria-label="Next image"
                            >
                                <HiOutlineChevronRight className="w-6 h-6" />
                            </button>
                        )}

                        {/* Main image with progressive loading - protected from save/drag */}
                        <div
                            className={clsx(
                                'relative flex items-center justify-center transition-all duration-300',
                                showInfo && 'mr-80'
                            )}
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                        >
                            <ProgressiveImage
                                src={currentImage.cloudFront}
                                alt={currentImage.title || `Photo ${currentIndex + 1}`}
                                onLoad={() => setIsImageLoaded(true)}
                            />
                        </div>

                        {/* Photo info panel */}
                        <PhotoInfoPanel 
                            image={currentImage}
                            isOpen={showInfo}
                            onClose={() => setShowInfo(false)}
                        />

                        {/* Bottom bar - keyboard hints */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            {/* Title */}
                            {currentImage.title && isImageLoaded && (
                                <div className="counter-badge animate-fade-in">
                                    {currentImage.title}
                                </div>
                            )}
                            
                            {!currentImage.title && <div />}

                            {/* Keyboard hints */}
                            <div className="hidden sm:flex items-center gap-3 text-white/50 text-xs">
                                <div className="flex items-center gap-1">
                                    <span className="kbd">←</span>
                                    <span className="kbd">→</span>
                                    <span className="ml-1">navigate</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="kbd">I</span>
                                    <span className="ml-1">info</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="kbd">Esc</span>
                                    <span className="ml-1">close</span>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
};

export default Lightbox;
