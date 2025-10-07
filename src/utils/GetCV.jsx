import axios from "axios";
import { BACKEND, API_VERSION } from "../common/common";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCV = createAsyncThunk("cv", async (_, { rejectWithValue }) => {
    try {
        const url = BACKEND + API_VERSION + "cv";
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data || "Network error");
    }
});
