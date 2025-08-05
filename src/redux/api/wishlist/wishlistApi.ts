import { tagTypes } from "@/redux/tagTypes/tagTypes";
import { baseApi } from "../baseApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWishlist: builder.mutation({
      query: (data) => ({
        url: '/wishlist',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.WISHLIST],
    }),
    getWishlist: builder.query({
      query: (arg) => ({
        url: '/wishlist',
        method: 'GET',
        params: arg
      }),
      providesTags: [tagTypes.WISHLIST],
    }),
    deleteWishlist: builder.mutation({
      query: (id) => ({
        url: `/wishlist/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.WISHLIST],
    }),
  }),
});

export const { useCreateWishlistMutation, useGetWishlistQuery, useDeleteWishlistMutation } = wishlistApi;
