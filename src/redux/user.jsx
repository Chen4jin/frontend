import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        status: null,
    },
    reducers: {
        setUser(state, action) {
            state.user = action.payload.email;
            state.status = action.payload.status
        },
        clearUser(state) {
            state.user = null;
            state.status = null;
        },

    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
