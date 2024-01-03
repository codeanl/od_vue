import http from "@/utils/http";

//获取角色列表
export const reqSlideShowList = (data) => http.get("/api/banner/list", data);
//添加｜｜更新角色
export const SaveOrUpdateSlideShow = (data) =>
  http.post("/api/banner/banner", data);
//删除用户
export const reqSlideShowDelete = (data) => http.post("/api/banner/del", data);
