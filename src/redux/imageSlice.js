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

const initialState = {
    images: [],
    page: DEFAULT_PAGE_SIZE,
    hasMore: true,
    lastKey: null,
    loading: false,
    error: null,
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
            });
    },
});

export const { resetImages } = imageSlice.actions;
export default imageSlice.reducer;
