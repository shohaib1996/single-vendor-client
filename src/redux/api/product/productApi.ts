import { baseApi } from '../api/baseApi';
import { tagTypes } from '../tagTypes/tagTypes';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (data) => ({
        url: '/products/create-product',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.PRODUCT],
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: '/products',
        method: 'GET',
      }),
      providesTags: [tagTypes.PRODUCT],
    }),
    getSingleProduct: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.PRODUCT],
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [tagTypes.PRODUCT],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.PRODUCT],
    }),
  }),
});

export const { useCreateProductMutation, useGetAllProductsQuery, useGetSingleProductQuery, useUpdateProductMutation, useDeleteProductMutation } = productApi;
