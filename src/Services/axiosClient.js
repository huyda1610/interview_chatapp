import axios from "axios";

const accessKey = localStorage.getItem("accessToken");

const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api",
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return error.response;
  }
);

axiosClient.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers.Authorization = `Bearer ${accessKey}`;
  }
  return config;
});

export default axiosClient;
