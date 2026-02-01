/**
 * Collections Page
 * Photo gallery with infinite scroll, lightbox, and proper loading/error states
 */

import { useEffect, useState, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import Navbar from '../components/navbar';
import { ImageWithPlaceholder, Lightbox, PhotoIcon, ExclamationCircleIcon, ArrowPathIcon } from '../components/ui';
import { useInfiniteScroll } from '../hooks';
import { fetchImages, resetImages } from '../redux/imageSlice';
import { loadImage } from '../redux/setupSlice';

// Pre-generate skeleton heights to avoid random values on each render
const SKELETON_HEIGHTS = [280, 320, 250, 300, 270, 310, 260, 290];

// Skeleton loader for initial load (memoized)
const GallerySkeleton = memo(() => (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 500: 2, 750: 3, 1000: 4 }}>
        <Masonry gutter="16px">
            {SKELETON_HEIGHTS.map((height, i) => (
                <div
                    key={i}
                    className="skeleton-loading rounded-xl"
                    style={{ 
                        height: `${height}px`,
                        animationDelay: `${i * 100}ms`
                    }}
                />
            ))}
        </Masonry>
    </ResponsiveMasonry>
));

GallerySkeleton.displayName = 'GallerySkeleton';

// Empty state component (memoized)
const EmptyState = memo(() => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 rounded-2xl bg-apple-bg-secondary mb-4">
            <PhotoIcon className="w-12 h-12 text-apple-gray" />
        </div>
        <h3 className="text-lg font-semibold text-apple-black mb-2">
            No photos yet
        </h3>
        <p className="text-apple-gray max-w-sm">
            The gallery is empty. Check back later for new photos.
        </p>
    </div>
));

EmptyState.displayName = 'EmptyState';

// Error state component (memoized)
const ErrorState = memo(({ error, onRetry }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 rounded-2xl bg-red-50 mb-4">
            <ExclamationCircleIcon className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-apple-black mb-2">
            Failed to load photos
        </h3>
        <p className="text-apple-gray max-w-sm mb-6">
            {error || 'Something went wrong. Please try again.'}
        </p>
        <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-apple-black text-white text-sm font-medium hover:bg-apple-gray-dark transition-colors duration-200"
        >
            <ArrowPathIcon className="w-4 h-4" />
            Try again
        </button>
    </div>
));

ErrorState.displayName = 'ErrorState';

const Collections = () => {
    const dispatch = useDispatch();
    const { images, hasMore, page, lastKey, loading, error } = useSelector((state) => state.imageList);
    const { imagesLoaded } = useSelector((state) => state.setup);
    
    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    
    // Track if initial load
    const [initialLoading, setInitialLoading] = useState(true);

    const loadMoreImages = useCallback(() => {
        if (loading) return;
        dispatch(fetchImages({ lastKey, page }));
    }, [dispatch, lastKey, page, loading]);

    // Use custom infinite scroll hook
    const { loadMoreRef } = useInfiniteScroll({
        onLoadMore: loadMoreImages,
        hasMore,
        isLoading: loading,
    });

    // Initial load
    useEffect(() => {
        if (!imagesLoaded) {
            dispatch(fetchImages({ lastKey: "", page }))
                .finally(() => setInitialLoading(false));
            dispatch(loadImage());
        } else {
            setInitialLoading(false);
        }
    }, [dispatch, imagesLoaded, page]);

    // Retry handler
    const handleRetry = () => {
        dispatch(resetImages());
        setInitialLoading(true);
        dispatch(fetchImages({ lastKey: "", page }))
            .finally(() => setInitialLoading(false));
    };

    // Open lightbox
    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    // Determine what to render
    const showSkeleton = initialLoading && images.length === 0;
    const showError = error && images.length === 0;
    const showEmpty = !loading && !error && images.length === 0 && !initialLoading;
    const showGallery = images.length > 0;

    return (
        <div className="min-h-screen bg-apple-bg">
            <Navbar />
            <div className="container-default">
                {/* Header Section */}
                <div className="max-w-2xl py-16 sm:py-24 lg:py-20">
                    <p className="text-label mb-3 opacity-0 animate-fade-in-up animation-delay-100">
                        Photography
                    </p>
                    <h1 className="text-hero-lg text-apple-black opacity-0 animate-fade-in-up animation-delay-200">
                        Collections
                    </h1>
                    <p className="mt-6 text-body-lg max-w-xl opacity-0 animate-fade-in-up animation-delay-300">
                        Through my lens: a journey of moments, memories, and inspiration.
                        {showGallery && (
                            <span className="text-apple-gray ml-2">
                                ({images.length} photo{images.length !== 1 ? 's' : ''})
                            </span>
                        )}
                    </p>
                </div>

                {/* Gallery Section */}
                <div className="pb-16">
                    {/* Initial loading skeleton */}
                    {showSkeleton && <GallerySkeleton />}

                    {/* Error state */}
                    {showError && <ErrorState error={error} onRetry={handleRetry} />}

                    {/* Empty state */}
                    {showEmpty && <EmptyState />}

                    {/* Gallery */}
                    {showGallery && (
                        <>
                            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 500: 2, 750: 3, 1000: 4 }}>
                                <Masonry gutter="16px">
                                    {images.map((image, index) => (
                                        <button
                                            key={image.imageID}
                                            onClick={() => openLightbox(index)}
                                            className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-apple-black focus-visible:ring-offset-2 rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                                            aria-label={`View ${image.title || `Photo ${index + 1}`}`}
                                        >
                                            <ImageWithPlaceholder
                                                src={image.cloudFront}
                                                alt={image.title || `Photo ${image.imageID}`}
                                            />
                                        </button>
                                    ))}
                                </Masonry>
                            </ResponsiveMasonry>

                            {/* Sentinel element for infinite scroll trigger */}
                            <div ref={loadMoreRef} className="h-1" />

                            {/* Loading more indicator */}
                            {loading && images.length > 0 && (
                                <div className="flex justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-apple-gray-light border-t-apple-black rounded-full animate-spin" />
                                </div>
                            )}

                            {/* End message */}
                            {!hasMore && images.length > 0 && (
                                <p className="text-center text-apple-gray py-8 text-sm">
                                    You've seen all {images.length} photos
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            <Lightbox
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                images={images}
                currentIndex={lightboxIndex}
                onNavigate={setLightboxIndex}
            />
        </div>
    );
};

export default Collections;
