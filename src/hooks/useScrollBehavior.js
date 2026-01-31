/**
 * useScrollBehavior Hook
 * Tracks scroll position and direction for navbar hide/show behavior
 */

import { useState, useEffect, useCallback } from 'react';

export const useScrollBehavior = ({
    threshold = 100,      // Pixels to scroll before hide/show kicks in
    sensitivity = 5,      // Minimum scroll delta to trigger change
    scrolledOffset = 10,  // Pixels to consider "scrolled"
} = {}) => {
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [scrollDirection, setScrollDirection] = useState('up');

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY;
        
        // Update scrolled state
        setScrolled(currentScrollY > scrolledOffset);
        
        // Determine scroll direction and visibility
        if (currentScrollY > threshold) {
            const delta = currentScrollY - lastScrollY;
            
            if (delta > sensitivity) {
                // Scrolling down
                setScrollDirection('down');
                setHidden(true);
            } else if (delta < -sensitivity) {
                // Scrolling up
                setScrollDirection('up');
                setHidden(false);
            }
        } else {
            setHidden(false);
        }
        
        setLastScrollY(currentScrollY);
    }, [lastScrollY, threshold, sensitivity, scrolledOffset]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return {
        scrolled,
        hidden,
        scrollDirection,
        scrollY: lastScrollY,
    };
};

export default useScrollBehavior;
