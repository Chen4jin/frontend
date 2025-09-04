import axios from "axios";
import { domain } from "../common/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getPhoto = createAsyncThunk("photo", async (_, { rejectWithValue }) => {
    try {
        const url = domain + "photoStats";
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Network error");
    }
});
