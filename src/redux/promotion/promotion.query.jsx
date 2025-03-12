import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../axios/axios";

export const promotionApi = createApi({
    reducerPath: "promotionApi",
    baseQuery: async (args, api, extraOptions) => {
        const { url, method, data, params } = args;
        return baseQuery({ url, method, data, params });
    },
    endpoints: (builder) => ({
        getAllPromotion: builder.query({
            query: ({ page = 1, pageSize = 10 }) => ({
                url: `/admin/promotions?page=${page}&pageSize=${pageSize}`,
                method: "GET",
            }),
            transformResponse: (response) => response.data,
        }),
    }),
});

export const { useGetAllPromotionQuery } = promotionApi;