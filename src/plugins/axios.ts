import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const request = axios.create({
  baseURL: "http://127.0.0.1:8080/api/v1/", // edit it!
  headers: {
    "Content-type": "application/json",
  },
  timeout: 6000,
});

request.interceptors.request.use(
  (config) => {
    NProgress.start();
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export default request;
