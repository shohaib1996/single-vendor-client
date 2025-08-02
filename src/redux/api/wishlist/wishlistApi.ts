import { tagTypes } from "@/redux/tagTypes/tagTypes";
import { baseApi } from "../baseApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWishlist: builder.mutation({
      query: (data) => ({
        url: '/wishlists',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.WISHLIST],
    }),
    getWishlist: builder.query({
      query: () => ({
        url: '/wishlists',
        method: 'GET',
      }),
      providesTags: [tagTypes.WISHLIST],
    }),
    deleteWishlist: builder.mutation({
      query: (id) => ({
        url: `/wishlists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.WISHLIST],
    }),
  }),
});

export const { useCreateWishlistMutation, useGetWishlistQuery, useDeleteWishlistMutation } = wishlistApi;
