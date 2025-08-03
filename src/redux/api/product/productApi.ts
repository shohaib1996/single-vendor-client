import { tagTypes } from "@/redux/tagTypes/tagTypes";
import { baseApi } from "../baseApi";

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
      query: (arg) => ({
        url: '/products',
        method: 'GET',
        params: arg,
      }),
      providesTags: [tagTypes.PRODUCT],
    }),
    getSingleProduct: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{
        type: tagTypes.PRODUCT,
        id,
      }],
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
