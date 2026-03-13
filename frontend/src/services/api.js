import axios from "axios";

const runtimeApiBaseUrl = window.__ENV?.VITE_API_BASE_URL;
const API_BASE_URL =
  runtimeApiBaseUrl ||
  import.meta.env.VITE_API_BASE_URL ||
  "https://email-analyzer-shqm.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    // Handle specific error cases for free tier deployments
    if (error.code === "ECONNABORTED") {
      error.message =
        "Server is taking longer to respond. This may be because the server is starting up (free tier limitation). Please wait and try again.";
    } else if (error.code === "ERR_NETWORK" || !error.response) {
      error.message =
        "Unable to connect to server. The server may be starting up (free tier limitation). Please wait a moment and try again.";
    } else if (error.response?.status === 503) {
      error.message =
        "Server is temporarily unavailable. Please wait a moment and try again.";
    }

    return Promise.reject(error);
  }
);

export const emailAPI = {
  // Classify a single email
  classifyEmail: async (emailText) => {
    const response = await api.post("/classify", {
      text: emailText,
    });
    return response.data;
  },

  // Classify multiple emails
  classifyBatch: async (emailTexts) => {
    const requests = emailTexts.map((text) => ({ text }));
    const response = await api.post("/classify-batch", requests);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get("/health");
    return response.data;
  },
};

export default api;
