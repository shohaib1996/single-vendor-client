import { tagTypes } from "@/redux/tagTypes/tagTypes";
import { baseApi } from "../baseApi";

export const dashboardAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query({
      query: () => ({
        url: '/dashboard/analytics',
        method: 'GET',
      }),
      providesTags: [tagTypes.DASHBOARD_ANALYTICS],
    }),
  }),
});

export const { useGetDashboardAnalyticsQuery } = dashboardAnalyticsApi;
