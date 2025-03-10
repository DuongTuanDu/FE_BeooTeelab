import { createSlice } from "@reduxjs/toolkit";
import {
    getAccountAdmin,
    loginAdmin,
} from "./auth.thunk";
import { remove } from "../../storage/storage";

const initialState = {
    adminInfo: {},
    isLoading: false,
    error: {},
    isAuthenticatedAdmin: false,
    emailVerify: "",
};

export const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logoutAdmin(state, action) {
            remove("ACCESS_TOKEN_ADMIN");
            state.isAuthenticatedAdmin = false;
            state.adminInfo = {};
        },
    },
    extraReducers: (builder) => {
        builder
            //Login Admin
            .addCase(loginAdmin.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isLoading = false;
                    state.adminInfo = action.payload.data;
                    state.isAuthenticatedAdmin = true;
                    state.error = {};
                }
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })

            //Get account admin
            .addCase(getAccountAdmin.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getAccountAdmin.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isLoading = false;
                    state.adminInfo = action.payload.data;
                    state.isAuthenticatedAdmin = true;
                    state.error = {};
                }
            })
            .addCase(getAccountAdmin.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});
export const { logoutAdmin } =
    authSlice.actions;
export default authSlice.reducer;