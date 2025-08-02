import { createApi } from '@reduxjs/toolkit/query/react';
import { AxiosError, Method } from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import { tagTypesList } from '../tagTypes/tagTypes';

const axiosBaseQuery = (
  { baseUrl } = { baseUrl: '' }
) => async ({ url, method, data, params }: { url: string; method: Method; data?: any; params?: any }) => {
  try {
    const result = await axiosInstance({
      url: baseUrl + url,
      method,
      data,
      params,
    });
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};

export const baseApi = createApi({
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: tagTypesList,
});
