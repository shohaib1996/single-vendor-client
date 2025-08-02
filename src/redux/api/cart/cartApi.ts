import { baseApi } from '../api/baseApi';
import { tagTypes } from '../tagTypes/tagTypes';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCart: builder.mutation({
      query: (data) => ({
        url: '/carts',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.CART],
    }),
    getCart: builder.query({
      query: () => ({
        url: '/carts',
        method: 'GET',
      }),
      providesTags: [tagTypes.CART],
    }),
    updateCartItem: builder.mutation({
      query: ({ id, data }) => ({
        url: `/carts/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [tagTypes.CART],
    }),
    deleteCartItem: builder.mutation({
      query: (id) => ({
        url: `/carts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.CART],
    }),
  }),
});

export const { useCreateCartMutation, useGetCartQuery, useUpdateCartItemMutation, useDeleteCartItemMutation } = cartApi;
