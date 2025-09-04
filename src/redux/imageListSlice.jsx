import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { domain } from "../common/domain";
import axios from "axios";

export const fetchImages = createAsyncThunk("images/fetchImages", async ({ lastKey, page }, { rejectWithValue }) => {
    try {
        const url = domain + "photo";
        const params = lastKey  ? { lastKey: lastKey, page: page } : {page: page }
        const response = await axios.get(url, {
            params: params,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Network error");
    }
});

const imageListSlice = createSlice({
    name: "imageList",
    initialState: {
        images: [],
        page: 10,
        hasMore: true,
        lastKey: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetImages(state) {
            state.images = [];
            state.page = 20;
            state.hasMore = true;
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
                console.log(action.payload);
                state.images.push(...action.payload.apiResponse.data);
                state.page = 10;
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

export const { resetImages } = imageListSlice.actions;
export default imageListSlice.reducer;
