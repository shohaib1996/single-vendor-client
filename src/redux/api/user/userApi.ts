import { tagTypes } from "@/redux/tagTypes/tagTypes";
import { baseApi } from "../baseApi";


export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      providesTags: [tagTypes.USER],
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: `/users/profile`,
        method: 'GET',
      }),
      providesTags: [tagTypes.USER],
    }),
    userRegister: builder.mutation({
      query: (data) => ({
        url: 'users/signup', // Assuming a specific endpoint for registration
        method: 'POST',
        data,
      }),
      invalidatesTags: [tagTypes.USER],
    }),
    userLogin: builder.mutation({
      query: (data) => ({
        url: '/users/signin', // Common endpoint for login
        method: 'POST',
        data,
      }),
      // No invalidatesTags here as login doesn't invalidate user data directly
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [tagTypes.USER],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.USER],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserProfileQuery, useUserRegisterMutation, useUserLoginMutation, useUpdateUserMutation, useDeleteUserMutation } = userApi;
