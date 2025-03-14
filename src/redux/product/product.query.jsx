import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../axios/axios";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, data, params } = args;
        return baseQuery({ url, method, data, params });
    },
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: ({ page = "", pageSize = "", search = "" }) => ({
                url: `/admin/products?page=${page}&pageSize=${pageSize}&search=${search}`,
                method: "GET",
            }),
        }),
        getFilterOptions: builder.query({
            query: () => ({
                url: "/filter-options",
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
        getProductsByCategory: builder.query({
            query: ({
                slug = "",
                priceRange = [],
                categories = [],
                rating = "",
                colors = [],
                page = 1,
                pageSize = 12,
            }) => {
                const queryString = new URLSearchParams({
                    priceRange,
                    categories,
                    rating,
                    colors,
                    page,
                    pageSize,
                }).toString();
                return {
                    url: `/products-by-category/${slug}?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (response) => response.data,
        }),
        getProductsByPromotion: builder.query({
            query: ({
                priceRange = [],
                categories = [],
                rating = "",
                colors = [],
                page = 1,
                pageSize = 12,
            }) => {
                const queryString = new URLSearchParams({
                    priceRange,
                    categories,
                    rating,
                    colors,
                    page,
                    pageSize,
                }).toString();
                return {
                    url: `/products-by-promotion/?${queryString}`,
                    method: "GET",
                };
            },
            transformResponse: (response) => response.data,
        }),
    }),
});

export const {
    useGetAllProductsQuery,
    useGetFilterOptionsQuery,
    useGetProductsByCategoryQuery,
    useGetProductsByPromotionQuery,
} = productApi;