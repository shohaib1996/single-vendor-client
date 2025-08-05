
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
    getAllPayment: builder.query({
      query: (arg) => ({
        url: '/payment',
        method: 'GET',
        params: arg
      }),
      providesTags: [tagTypes.PAYMENT],
    }),
    updatePayment: builder.mutation({
       query: ({id, data}) => ({
        url: `/payment/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [tagTypes.PAYMENT],
    })
  }),
});

export const { useCreateCheckoutSessionMutation, usePaymentSuccessQuery, usePaymentCancelQuery, useGetAllPaymentQuery, useUpdatePaymentMutation } = paymentApi;
