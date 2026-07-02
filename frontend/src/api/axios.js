import axios from "axios";
// import { refreshTokenService } from "./api.service";

const API_URL = import.meta.env.VITE_API_URL+'/api' || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const get = (url, params) => api.get(url, { params });
export const post = (url, data) => api.post(url, data);
// export const put = (url, data) => api.put(url, data);
// export const del = (url) => api.delete(url);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
      //   &&
      //   localStorage.getItem("isLoggedIn") === "true"
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // await refreshTokenService();
        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        console.log("interceptor force redirect");
        // localStorage.setItem("isLoggedIn", "false");
        // if (window.location.pathname !== "/login") {
        window.location.href = "/login";
        // }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
