// 统一管理用户相关接口
import http from "@/utils/http";

//获取用户列表
export const reqMemberList = (data) => http.get("/api/member/list", data);
//更新用户
export const reqMemberUpdata = (data) => http.put("/api/member/update", data);
//删除用户
export const reqMemberDelete = (data) => http.post("/api/member/del", data);
//
export const reqMemberLoginLog = (data) =>
  http.get("/api/member/memberLoginLog", data);
