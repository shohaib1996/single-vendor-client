import { tagTypes } from "@/redux/tagTypes/tagTypes";
import { baseApi } from "../baseApi";


export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (data) => ({
        url: '/categories/create-category',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.CATEGORY],
    }),
    getAllCategories: builder.query({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      providesTags: [tagTypes.CATEGORY],
    }),
    getSingleCategory: builder.query({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.CATEGORY],
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [tagTypes.CATEGORY],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.CATEGORY],
    }),
  }),
});

export const { useCreateCategoryMutation, useGetAllCategoriesQuery, useGetSingleCategoryQuery, useUpdateCategoryMutation, useDeleteCategoryMutation } = categoryApi;
