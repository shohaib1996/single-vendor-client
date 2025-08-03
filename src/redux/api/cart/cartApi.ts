import { tagTypes } from "@/redux/tagTypes/tagTypes";
import { baseApi } from "../baseApi";


export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCart: builder.mutation({
      query: (data) => ({
        url: '/cart',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.CART],
    }),
    getCart: builder.query({
      query: () => ({
        url: '/cart',
        method: 'GET',
      }),
      providesTags: [tagTypes.CART],
    }),
    updateCartItem: builder.mutation({
      query: ({ id, data }) => ({
        url: `/cart/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [tagTypes.CART],
    }),
    deleteCartItem: builder.mutation({
      query: (id) => ({
        url: `/cart/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.CART],
    }),
  }),
});

export const { useCreateCartMutation, useGetCartQuery, useUpdateCartItemMutation, useDeleteCartItemMutation } = cartApi;
