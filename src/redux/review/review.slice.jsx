import { createSlice } from "@reduxjs/toolkit";
import { getReviewlist } from "./review.thunk";

const initialState = {
    isLoading: false,
    error: {},
    reviews: [],
    averageRating: "",
    rateDistribution: {},
    pagination: {
        page: 1,
        totalPage: 0,
        totalItems: 0,
        pageSize: 10,
    },
};

export const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        setReview(state, action) {
            state.reviews = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            //Get review list by admin
            .addCase(getReviewlist.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(getReviewlist.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.isLoading = false;
                    state.reviews = action.payload.data;
                    state.pagination = action.payload.pagination;
                }
            })
            .addCase(getReviewlist.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});

export const { setReview } = reviewSlice.actions;
export default reviewSlice.reducer;