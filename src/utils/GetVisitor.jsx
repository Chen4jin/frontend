import axios from "axios";
import { domain } from "../common/domain";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getVisitor = createAsyncThunk("visitor", async (_, { rejectWithValue }) => {
    try {
        const url = domain + "visitor";
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Network error");
    }
});
