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
        })
    }),
});

export const {
    useGetAllProductsQuery
} = productApi;