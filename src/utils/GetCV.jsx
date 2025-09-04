import axios from "axios";
import { domain } from "../common/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCV = createAsyncThunk("cv", async (_, { rejectWithValue }) => {
    try {
        const url = domain + "cv";
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error)
        return rejectWithValue(error.response?.data || "Network error");
    }
});
