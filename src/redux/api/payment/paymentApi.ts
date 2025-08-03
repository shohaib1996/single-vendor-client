import { tagTypes } from "@/redux/tagTypes/tagTypes";
import { baseApi } from "../baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (data) => ({
        url: '/payment/create-checkout-session',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.PAYMENT],
    }),
    paymentSuccess: builder.query({
      query: (arg) => ({
        url: '/payment/success',
        method: 'GET',
        params: arg
      }),
      providesTags: [tagTypes.PAYMENT],
    }),
    paymentCancel: builder.query({
      query: () => ({
        url: '/payment/cancel',
        method: 'GET',
      }),
      providesTags: [tagTypes.PAYMENT],
    }),
  }),
});

export const { useCreateCheckoutSessionMutation, usePaymentSuccessQuery, usePaymentCancelQuery } = paymentApi;
