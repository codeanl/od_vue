// 统一管理用户相关接口
import http from "@/utils/http";

//获取列表
export const reqLoginLogList = (data) => http.get("/api/loginLog/list", data);

//删除
export const reqLoginLogDelete = (data) => http.post("/api/loginLog/del", data);
