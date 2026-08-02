import axios from "axios";

// Same pattern as axiosInstance.ts, pointed at the separate Python AI
// service (single-vendor-ai) instead of the Node backend — different
// base URL, same auth token.
const chatbotAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CHATBOT_API_URL,
});

chatbotAxiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default chatbotAxiosInstance;
