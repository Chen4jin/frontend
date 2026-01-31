/**
 * Setup Redux Slice
 * Manages application initialization state
 */

import { createSlice } from '@reduxjs/toolkit';

const setupSlice = createSlice({
    name: 'setup',
    initialState: {
        imagesLoaded: false,
    },
    reducers: {
        setImagesLoaded(state, action) {
            state.imagesLoaded = action.payload ?? true;
        },
    },
});

export const { setImagesLoaded } = setupSlice.actions;

// Legacy export for compatibility
export const loadImage = setImagesLoaded;

export default setupSlice.reducer;
