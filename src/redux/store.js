/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import imageReducer from './imageSlice';
import setupReducer from './setupSlice';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        imageList: imageReducer,
        setup: setupReducer,
        user: userReducer,
    },
});

export default store;
