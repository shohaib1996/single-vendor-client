import { baseApi } from '../api/baseApi';
import { tagTypes } from '../tagTypes/tagTypes';

export const productAnswerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProductAnswer: builder.mutation({
      query: (data) => ({
        url: '/product-answers',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.PRODUCT_ANSWER],
    }),
    getAllProductAnswers: builder.query({
      query: () => ({
        url: '/product-answers',
        method: 'GET',
      }),
      providesTags: [tagTypes.PRODUCT_ANSWER],
    }),
    getSingleProductAnswer: builder.query({
      query: (id) => ({
        url: `/product-answers/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.PRODUCT_ANSWER],
    }),
    updateProductAnswer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product-answers/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [tagTypes.PRODUCT_ANSWER],
    }),
    deleteProductAnswer: builder.mutation({
      query: (id) => ({
        url: `/product-answers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.PRODUCT_ANSWER],
    }),
  }),
});

export const { useCreateProductAnswerMutation, useGetAllProductAnswersQuery, useGetSingleProductAnswerQuery, useUpdateProductAnswerMutation, useDeleteProductAnswerMutation } = productAnswerApi;
