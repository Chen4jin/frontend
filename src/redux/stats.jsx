import { createSlice } from "@reduxjs/toolkit";
import { getCV } from "../utils/GetCV";
import { getVisitor } from "../utils/GetVisitor";
import { getPhoto } from "../utils/GetPhoto";

export const stats = createSlice({
    name: "stats",
    initialState: {
        monthlyVisitor: 0,
        photoCollections: 0,
        cvDownload: 0,
    },
    reducers: {
        clearData(state) {
            state.monthlyVisitor = 0;
            state.photoCollections = 0;
            state.cvDownload = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCV.pending, (state) => {})
            .addCase(getCV.fulfilled, (state, action) => {
            })
            .addCase(getCV.rejected, (state, action) => {})

            .addCase(getPhoto.pending, (state) => {})
            .addCase(getPhoto.fulfilled, (state, action) => {
                state.photoCollections = action.payload.data["count"];
            })
            .addCase(getPhoto.rejected, (state, action) => {})

            .addCase(getVisitor.pending, (state) => {})
            .addCase(getVisitor.fulfilled, (state, action) => {
                state.monthlyVisitor = action.payload.data["count"];
            })
            .addCase(getVisitor.rejected, (state, action) => {});
    },
});
export default stats.reducer;
