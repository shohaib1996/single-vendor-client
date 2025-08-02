import { baseApi } from '../api/baseApi';
import { tagTypes } from '../tagTypes/tagTypes';

export const filterOptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFilterOption: builder.mutation({
      query: (data) => ({
        url: '/filter-options',
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.FILTER_OPTION],
    }),
    getFilterOptions: builder.query({
      query: () => ({
        url: '/filter-options',
        method: 'GET',
      }),
      providesTags: [tagTypes.FILTER_OPTION],
    }),
    getFilterOption: builder.query({
      query: (id) => ({
        url: `/filter-options/${id}`,
        method: 'GET',
      }),
      providesTags: [tagTypes.FILTER_OPTION],
    }),
    updateFilterOption: builder.mutation({
      query: ({ id, data }) => ({
        url: `/filter-options/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [tagTypes.FILTER_OPTION],
    }),
    deleteFilterOption: builder.mutation({
      query: (id) => ({
        url: `/filter-options/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.FILTER_OPTION],
    }),
  }),
});

export const { useCreateFilterOptionMutation, useGetFilterOptionsQuery, useGetFilterOptionQuery, useUpdateFilterOptionMutation, useDeleteFilterOptionMutation } = filterOptionApi;
