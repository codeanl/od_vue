import http from "@/utils/http";
//获取角色列表
export const reqMenuList = (data) => http.get("/api/menu/list", data);
//添加｜｜更新
export const SaveOrUpdateMenu = (data) => http.post("/api/menu/menu", data);
//删除
export const reqMenuDelete = (data) => http.post("/api/menu/del", data);

//
export const reqMenuListList = (data) => http.get("/api/menu/llist", data);

export const getMenuByRoleId = (data) =>
  http.get("/api/menu/getMenuByRoleId", data);
