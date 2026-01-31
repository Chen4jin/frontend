/**
 * User Redux Slice
 * Manages user authentication state
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    status: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload.email;
            state.status = action.payload.status;
            state.error = null;
        },
        clearUser(state) {
            state.user = null;
            state.status = null;
            state.error = null;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
