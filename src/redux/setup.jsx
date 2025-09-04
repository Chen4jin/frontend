import { createSlice } from "@reduxjs/toolkit";

export const setup = createSlice({
    name: "setup",
    initialState: {
        imagesLoad: false,
    },
    reducers: {
        loadImage(state) {
            state.imagesLoad = true;
        },
    },
});
export const { loadImage } = setup.actions;
export default setup.reducer;
