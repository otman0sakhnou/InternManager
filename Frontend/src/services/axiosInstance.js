import axios from "axios";
import useAuthStore from "store/AuthStore";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//handling the token refresh 
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    //the response is 401 unauthorized = the access token has expired => calling the  refreshToken method
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshToken, setAccessToken } = useAuthStore.getState();
        if (refreshToken) {
          const response = await useAuthStore.getState().refreshToken(refreshToken);
          if (response) {
            setAccessToken(response.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        // Handle refresh token failure (logout the user)
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

// api.interceptors.response.error.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Handle unauthorized access, e.g., redirect to login
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
