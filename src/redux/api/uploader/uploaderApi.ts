import { tagTypes } from "@/redux/tagTypes/tagTypes";
import { baseApi } from "../baseApi";

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
