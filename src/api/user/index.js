// 统一管理用户相关接口
import http from "@/utils/http";

//登录
export const reqLogin = (data) => http.post("/api/user/login", data);
//获取用户信息
export const reqUserInfo = () => http.get("/api/user/info");
//获取用户列表
export const reqUserList = (data) => http.get("/api/user/list", data);
//删除用户
export const reqUserDelete = (data) => http.post("/api/user/del", data);
//添加用户
export const reqUserAdd = (data) => http.post("/api/user", data);
//更新用户
export const reqUserUpdata = (data) => http.put("/api/user", data);
//获取用户信息
export const reqUserByID = (data) => http.get("/api/user", data);
//更新密码
export const reqUserUpPass = (data) => http.post("/api/user/setPass", data);
//更新个人信息
export const reqUserProflie = (data) => http.post("/api/user/updateInfo", data);
//
export const reqSaveOrUpadteUser = (data) => http.post("/api/user/user", data);
//
export const reqUpdateUserRole = (data) =>
  http.post("/api/user/updateUserRole", data);
//
export const reqUpdatePwd = (data) =>
  http.post("/api/user/updatePwd", data);
