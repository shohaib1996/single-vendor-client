import { baseApi } from '../api/baseApi';
import { tagTypes } from '../tagTypes/tagTypes';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/orders/create-order',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.ORDER],
    }),
    getAllOrders: builder.query({
      query: () => ({
        url: '/orders',
        method: 'GET',
      }),
      providesTags: [tagTypes.ORDER],
    }),
    getSingleOrder: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.ORDER],
    }),
    updateOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [tagTypes.ORDER],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.ORDER],
    }),
  }),
});

export const { useCreateOrderMutation, useGetAllOrdersQuery, useUseGetSingleOrderQuery, useUpdateOrderMutation, useDeleteOrderMutation } = orderApi;
