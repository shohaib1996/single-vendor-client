import { createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, Method } from "axios";
import chatbotAxiosInstance from "@/lib/chatbotAxiosInstance";

// Separate createApi (not injected into the shared baseApi) because this
// targets the Python AI service (NEXT_PUBLIC_CHATBOT_API_URL), not the
// Node backend baseApi's endpoints all assume.
const chatbotBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params }: { url: string; method: Method; data?: unknown; params?: unknown }) => {
    try {
      const result = await chatbotAxiosInstance({ url: baseUrl + url, method, data, params });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return { error: { status: err.response?.status, data: err.response?.data || err.message } };
    }
  };

export interface ITrainingDocument {
  id: string;
  title: string;
  source_type: "text" | "file";
  original_filename: string | null;
  chunk_count: number;
  createdAt: string;
}

export const trainApi = createApi({
  reducerPath: "trainApi",
  baseQuery: chatbotBaseQuery({ baseUrl: "/api/v1/train" }),
  tagTypes: ["TrainingDocument"],
  endpoints: (builder) => ({
    submitTrainingText: builder.mutation<{ id: string; chunks_indexed: number }, { title: string; content: string }>({
      query: (data) => ({ url: "/text", method: "POST", data }),
      invalidatesTags: ["TrainingDocument"],
    }),
    uploadTrainingFile: builder.mutation<{ id: string; chunks_indexed: number }, { title: string; file: File }>({
      query: ({ title, file }) => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);
        return { url: "/upload", method: "POST", data: formData };
      },
      invalidatesTags: ["TrainingDocument"],
    }),
    getTrainingDocuments: builder.query<ITrainingDocument[], void>({
      query: () => ({ url: "/documents", method: "GET" }),
      providesTags: ["TrainingDocument"],
    }),
    deleteTrainingDocument: builder.mutation<{ deleted: string }, string>({
      query: (id) => ({ url: `/documents/${id}`, method: "DELETE" }),
      invalidatesTags: ["TrainingDocument"],
    }),
  }),
});

export const {
  useSubmitTrainingTextMutation,
  useUploadTrainingFileMutation,
  useGetTrainingDocumentsQuery,
  useDeleteTrainingDocumentMutation,
} = trainApi;
