import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../axios/axios";

export const categoryApi = createApi({
    reducerPath: "categoryApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, data, params } = args;
        return baseQuery({ url, method, data, params });
    },
    endpoints: (builder) => ({
        getAllCategory: builder.query({
            query: () => ({
                url: "/admin/categories",
                method: "GET",
            }),
        }),
    }),
});

export const { useGetAllCategoryQuery } = categoryApi;