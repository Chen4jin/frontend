import axios from "axios";
import { BACKEND, API_VERSION } from "../common/common";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getPhoto = createAsyncThunk("photo", async (_, { rejectWithValue }) => {
    try {
        const url = BACKEND + API_VERSION + "images";
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Network error");
    }
});
