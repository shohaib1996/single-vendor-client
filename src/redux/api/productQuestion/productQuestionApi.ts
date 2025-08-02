import { tagTypes } from "@/redux/tagTypes/tagTypes";
import { baseApi } from "../baseApi";

export const productQuestionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProductQuestion: builder.mutation({
      query: (data) => ({
        url: '/product-questions',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.PRODUCT_QUESTION],
    }),
    getAllProductQuestions: builder.query({
      query: () => ({
        url: '/product-questions',
        method: 'GET',
      }),
      providesTags: [tagTypes.PRODUCT_QUESTION],
    }),
    getSingleProductQuestion: builder.query({
      query: (id) => ({
        url: `/product-questions/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.PRODUCT_QUESTION],
    }),
    updateProductQuestion: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product-questions/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [tagTypes.PRODUCT_QUESTION],
    }),
    deleteProductQuestion: builder.mutation({
      query: (id) => ({
        url: `/product-questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.PRODUCT_QUESTION],
    }),
  }),
});

export const { useCreateProductQuestionMutation, useGetAllProductQuestionsQuery, useGetSingleProductQuestionQuery, useUpdateProductQuestionMutation, useDeleteProductQuestionMutation } = productQuestionApi;
