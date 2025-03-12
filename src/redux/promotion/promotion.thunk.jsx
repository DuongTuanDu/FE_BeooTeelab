import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios/axios";
import { message } from "antd";

export const createPromotionAction = createAsyncThunk(
  "promotion/createPromotionAction",
  async (payload, { rejectWithValue }) => {
    try {
      return await axios.post("/admin/promotions", payload);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePromotionAction = createAsyncThunk(
  "promotion/updatePromotionAction",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await axios.put(`/admin/promotions/${id}`, data);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);

export const removePromotion = createAsyncThunk(
  "promotion/removePromotion",
  async (id, { rejectWithValue }) => {
    try {
      return await axios.delete(`/admin/promotions/${id}`);
    } catch (error) {
      message.error(error.response.data.message);
      return rejectWithValue(error.response.data);
    }
  }
);