// 统一管理用户相关接口
import http from "@/utils/http";

//获取列表
export const reqAricalList = (data) => http.get("/api/artical/list", data);

//删除
export const reqAricalDelete = (data) => http.post("/api/artical/del", data);
//
export const SaveOrUpdateArtical = (data) =>
  http.post("/api/artical/artical", data);
