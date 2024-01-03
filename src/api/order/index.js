import http from "@/utils/http";
//获取用户列表
export const reqOrderList = (data) => http.get("/api/order/list", data);
export const reqOrderInfo = (data) => http.get("/api/order/info", data);
export const reqOrderUpdate = (data) => http.post("/api/order/update", data);
