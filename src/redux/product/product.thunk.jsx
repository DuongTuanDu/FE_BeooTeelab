import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios/axios";
import { message } from "antd";

export const getProductAdmin = createAsyncThunk(
    "product/getProductAdmin",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `/admin/products?page=${payload.page}&pageSize=${payload.pageSize}&search=${payload.search}`
            );
            return res;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createProduct = createAsyncThunk(
    "product/createProduct",
    async (payload, { rejectWithValue }) => {
        try {
            return await axios.post("/admin/products", payload);
        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async (payload, { rejectWithValue }) => {
        try {
            return await axios.put(`/admin/products/${payload._id}`, payload);
        } catch (error) {
            message.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (payload, { rejectWithValue }) => {
        try {
            return await axios.delete(`/admin/products/${payload}`);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getDetailProduct = createAsyncThunk(
    "product/getDetailProduct",
    async (slug) => {
        try {
            return await axios.get(`/product-detail/${slug}`);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getProductHome = createAsyncThunk(
    "product/getProductHome",
    async (slugs) => {
        try {
            return await axios.get(`/products-home?categories=${slugs}`);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getProductSearch = createAsyncThunk(
    "product/getProductSearch",
    async (search) => {
        try {
            return await axios.get(`/products-search?search=${search}`);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getProductByCategory = createAsyncThunk(
    "product/getProductByCategory",
    async (payload) => {
        try {
            return await axios.get(
                `/products-by-category/${payload.slug}?page=${payload.page}&pageSize=${payload.pageSize}`
            );
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);