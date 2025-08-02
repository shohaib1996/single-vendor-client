import { baseApi } from '../api/baseApi';
import { tagTypes } from '../tagTypes/tagTypes';

export const uploaderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFiles: builder.mutation({
      query: (files) => ({
        url: '/upload',
        method: 'POST',
        body: files,
      }),
      invalidatesTags: [tagTypes.UPLOADER],
    }),
  }),
});

export const { useUploadFilesMutation } = uploaderApi;
