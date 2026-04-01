import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const API = axios.create({
  baseURL: BASE_URL
});

export const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const safeUrl = url.startsWith("/") ? url : `/${url}`;
  return `${BASE_URL}${safeUrl}`;
};


API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Axios Response Interceptor to handle 401 Unauthorized
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            //🔥 Auto Logout on Invalid or Deleted User
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const subscribeNewsletter = () => API.post("/api/subscribe/");
export const getTodayOffer = () => API.get("/api/today-offer/offers/");
export const getProfile = () => API.get("/api/profile/");

export default API;
