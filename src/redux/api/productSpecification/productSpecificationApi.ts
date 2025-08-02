import { tagTypes } from "@/redux/tagTypes/tagTypes";
import { baseApi } from "../baseApi";

export const productSpecificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProductSpecification: builder.mutation({
      query: (data) => ({
        url: '/product-specifications',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.PRODUCT_SPECIFICATION],
    }),
    getProductSpecifications: builder.query({
      query: () => ({
        url: '/product-specifications',
        method: 'GET',
      }),
      providesTags: [tagTypes.PRODUCT_SPECIFICATION],
    }),
    getProductSpecification: builder.query({
      query: (id) => ({
        url: `/product-specifications/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.PRODUCT_SPECIFICATION],
    }),
    updateProductSpecification: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product-specifications/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [tagTypes.PRODUCT_SPECIFICATION],
    }),
    deleteProductSpecification: builder.mutation({
      query: (id) => ({
        url: `/product-specifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.PRODUCT_SPECIFICATION],
    }),
  }),
});

export const { useCreateProductSpecificationMutation, useGetProductSpecificationsQuery, useGetProductSpecificationQuery, useUpdateProductSpecificationMutation, useDeleteProductSpecificationMutation } = productSpecificationApi;
