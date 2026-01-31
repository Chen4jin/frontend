/**
 * useInfiniteScroll Hook
 * Custom hook for infinite scroll using Intersection Observer
 * More performant and lighter than react-infinite-scroll-component
 */

import { useRef, useCallback, useEffect } from 'react';

export const useInfiniteScroll = ({ 
    onLoadMore, 
    hasMore, 
    isLoading = false,
    threshold = 0.1,
    rootMargin = '100px',
}) => {
    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);

    const handleObserver = useCallback((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
            onLoadMore();
        }
    }, [hasMore, isLoading, onLoadMore]);

    useEffect(() => {
        // Disconnect previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Create new observer
        observerRef.current = new IntersectionObserver(handleObserver, {
            threshold,
            rootMargin,
        });

        // Observe the sentinel element
        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        // Cleanup
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleObserver, threshold, rootMargin]);

    return { loadMoreRef };
};

export default useInfiniteScroll;
