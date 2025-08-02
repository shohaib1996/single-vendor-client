import { baseApi } from '../api/baseApi';
import { tagTypes } from '../tagTypes/tagTypes';

export export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBrand: builder.mutation({
      query: (data) => ({
        url: '/brands/create-brand',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.BRAND],
    }),
    getAllBrands: builder.query({
      query: () => ({
        url: '/brands',
        method: 'GET',
      }),
      providesTags: [tagTypes.BRAND],
    }),
    getSingleBrand: builder.query({
      query: (id) => ({
        url: `/brands/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.BRAND],
    }),
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/brands/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [tagTypes.BRAND],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.BRAND],
    }),
  }),
});

export const { useCreateBrandMutation, useGetAllBrandsQuery, useGetSingleBrandQuery, useUpdateBrandMutation, useDeleteBrandMutation } = brandApi;
