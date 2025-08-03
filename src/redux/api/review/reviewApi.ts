import { tagTypes } from "@/redux/tagTypes/tagTypes";
import { baseApi } from "../baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (data) => ({
        url: '/reviews',
        method: 'POST',
        data,
      }),
      invalidatesTags: (result, error, arg) => [
        tagTypes.REVIEW,
        { type: tagTypes.PRODUCT, id: arg.productId },
      ],
    }),
    getAllReviews: builder.query({
      query: () => ({
        url: '/reviews',
        method: 'GET',
      }),
      providesTags: [tagTypes.REVIEW],
    }),
    getSingleReview: builder.query({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.REVIEW],
    }),
    updateReview: builder.mutation({
      query: ({ id, data }) => ({
        url: `/reviews/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [tagTypes.REVIEW],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.REVIEW],
    }),
  }),
});

export const { useCreateReviewMutation, useGetAllReviewsQuery, useGetSingleReviewQuery, useUpdateReviewMutation, useDeleteReviewMutation } = reviewApi;
