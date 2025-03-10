import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios/axios";
import { message } from "antd";

export const loginAdmin = createAsyncThunk(
    "auth/loginAdmin",
    async (data, { rejectWithValue }) => {
        try {
            return await axios.post("/admin/login", data);
        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
);

export const getAccountAdmin = createAsyncThunk(
    "auth/getAccountAdmin",
    async (_, { rejectWithValue }) => {
        try {
            return await axios.get("/admin/account");
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);