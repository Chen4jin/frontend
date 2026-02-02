/**
 * Image Redux Slice
 * Manages image gallery state and fetching
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BACKEND, API_VERSION } from '../config';

// Constants
const DEFAULT_PAGE_SIZE = 20;

// Async thunk for fetching images
export const fetchImages = createAsyncThunk(
    'images/fetchImages',
    async ({ lastKey, page }, { rejectWithValue }) => {
        try {
            const url = `${BACKEND}${API_VERSION}images`;
            const params = lastKey ? { lastKey, page } : { page };
            
            const response = await axios.get(url, {
                params,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Network error');
        }
    }
);

// Async thunk for deleting an image
export const deleteImage = createAsyncThunk(
    'images/deleteImage',
    async (imageID, { rejectWithValue }) => {
        try {
            const url = `${BACKEND}${API_VERSION}images/${imageID}`;
            
            await axios.delete(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            return imageID;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete image');
        }
    }
);

// Metadata fields that can be updated (partial update)
const METADATA_FIELDS = [
    'title', 'description', 'camera', 'lens', 'location', 'dateTaken',
    'aperture', 'shutter', 'iso', 'focalLength',
];

// Async thunk for updating image metadata
export const updateImage = createAsyncThunk(
    'images/updateImage',
    async ({ imageID, ...payload }, { rejectWithValue }) => {
        try {
            const url = `${BACKEND}${API_VERSION}images/${imageID}`;
            const body = METADATA_FIELDS.reduce((acc, key) => {
                if (payload[key] !== undefined) acc[key] = payload[key];
                return acc;
            }, {});

            const response = await axios.patch(url, body, {
                headers: { 'Content-Type': 'application/json' },
            });
            const updated = response.data?.data ?? response.data;
            return { imageID, ...updated };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update image');
        }
    }
);

const initialState = {
    images: [],
    page: DEFAULT_PAGE_SIZE,
    hasMore: true,
    lastKey: null,
    loading: false,
    error: null,
    deleting: false,
    deleteError: null,
    updating: false,
    updateError: null,
};

const imageSlice = createSlice({
    name: 'imageList',
    initialState,
    reducers: {
        resetImages(state) {
            state.images = [];
            state.page = DEFAULT_PAGE_SIZE;
            state.hasMore = true;
            state.lastKey = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch images
            .addCase(fetchImages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchImages.fulfilled, (state, action) => {
                state.images.push(...action.payload.apiResponse.data);
                state.hasMore = action.payload.hasMore;
                state.lastKey = action.payload.lastKey;
                state.loading = false;
            })
            .addCase(fetchImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete image
            .addCase(deleteImage.pending, (state) => {
                state.deleting = true;
                state.deleteError = null;
            })
            .addCase(deleteImage.fulfilled, (state, action) => {
                state.images = state.images.filter(img => img.imageID !== action.payload);
                state.deleting = false;
            })
            .addCase(deleteImage.rejected, (state, action) => {
                state.deleting = false;
                state.deleteError = action.payload;
            })
            // Update image metadata
            .addCase(updateImage.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updateImage.fulfilled, (state, action) => {
                const { imageID, ...updated } = action.payload;
                const index = state.images.findIndex((img) => img.imageID === imageID);
                if (index !== -1) {
                    state.images[index] = { ...state.images[index], ...updated };
                }
                state.updating = false;
            })
            .addCase(updateImage.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload;
            });
    },
});

export const { resetImages } = imageSlice.actions;
export default imageSlice.reducer;
