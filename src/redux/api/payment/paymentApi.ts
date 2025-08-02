import { baseApi } from '../api/baseApi';
import { tagTypes } from '../tagTypes/tagTypes';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (data) => ({
        url: '/payments/create-checkout-session',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.PAYMENT],
    }),
    paymentSuccess: builder.query({
      query: () => ({
        url: '/payments/success',
        method: 'GET',
      }),
      providesTags: [tagTypes.PAYMENT],
    }),
    paymentCancel: builder.query({
      query: () => ({
        url: '/payments/cancel',
        method: 'GET',
      }),
      providesTags: [tagTypes.PAYMENT],
    }),
  }),
});

export const { useCreateCheckoutSessionMutation, usePaymentSuccessQuery, usePaymentCancelQuery } = paymentApi;
