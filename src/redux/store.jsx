// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import imageListReducer from './imageListSlice';
import setupReducer from './setup';
import statsReducer from './stats'
import userReducer from './user'

export const store = configureStore({
  reducer: {
    imageList: imageListReducer,
    setup: setupReducer,
    stats: statsReducer,
    user: userReducer
  },
});