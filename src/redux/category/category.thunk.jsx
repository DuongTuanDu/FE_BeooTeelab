import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios/axios";

export const getCategoryAdmin = createAsyncThunk(
  "category/getCategoryAdmin",
  async (_, { rejectWithValue }) => {
    try {
      return await axios.get("/admin/categories");
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCategoryList = createAsyncThunk(
  "category/getCategoryList",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.get(
        `/admin/categories?page=${payload.page}&pageSize=${payload.pageSize
        }&name=${payload.name || ""}`
      );
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);