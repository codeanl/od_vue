// 二次封装axios
import axios from "axios";
//创建axios实例
let request = axios.create({
  baseURL: "http://localhost:8080",
  // baseURL: "http://localhost:9876",
  // baseURL: "http://114.115.183.226:6666",
  timeout: 10000, //超时时间
});

import useUserStore from "@/store/user";
//添加请求与响应拦截器
request.interceptors.request.use((config) => {
  //获取token携带给服务器
  let userStore = useUserStore();
  if (userStore.token) {
    config.headers.Authorization = userStore.token;
  }
  return config;
});

export default request;
// config.headers.token = userStore.token
// config.headers.Authorization = `Bearer ${userStore.token}`;
