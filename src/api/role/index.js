import http from "@/utils/http";

//获取角色列表
export const reqRoleList = (data) => http.get("/api/role/list", data);
//添加｜｜更新角色
export const SaveOrUpdateRole = (data) => http.post("/api/role/role", data);
//删除用户
export const reqRoleDelete = (data) => http.post("/api/role/del", data);
//
export const reqRoleMenuAdd = (data) => http.post("/api/role/roleMenuAdd", data);
