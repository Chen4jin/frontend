/**
 * ImageWithPlaceholder Component
 * Image component with skeleton loading and error states
 */

import { useState } from 'react';
import { PhotoIcon } from './Icons';

export const ImageWithPlaceholder = ({ 
    src, 
    alt,
    className = '',
    aspectRatio = 'auto', // 'auto', 'square', '16/9', '4/3'
    rounded = 'xl',
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const aspectClasses = {
        auto: '',
        square: 'aspect-square',
        '16/9': 'aspect-video',
        '4/3': 'aspect-[4/3]',
    };

    const roundedClasses = {
        none: '',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        full: 'rounded-full',
    };

    return (
        <div className={`
            relative overflow-hidden bg-apple-bg-secondary
            ${roundedClasses[rounded]} ${aspectClasses[aspectRatio]} ${className}
        `}>
            {/* Skeleton placeholder */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 skeleton-loading" />
            )}
            
            {/* Actual image - protected from save/drag (discourage download) */}
            <img
                className={`
                    h-auto w-full transition-opacity duration-500 ease-out photo-protected
                    ${roundedClasses[rounded]}
                    ${isLoaded ? 'opacity-100' : 'opacity-0'}
                `}
                src={src}
                alt={alt}
                loading="lazy"
                draggable={false}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
            />

            {/* Error state */}
            {hasError && (
                <div className={`
                    flex items-center justify-center aspect-square 
                    bg-apple-bg-secondary text-apple-gray
                    ${roundedClasses[rounded]}
                `}>
                    <PhotoIcon className="w-8 h-8" />
                </div>
            )}
        </div>
    );
};

export default ImageWithPlaceholder;
