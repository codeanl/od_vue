import { defineStore } from "pinia";
import { reqLogin, reqUserInfo } from "@/api/user";
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from "@/utils/token";

let useUserStore = defineStore("User", {
  state: () => {
    return {
      token: GET_TOKEN(),
      menuList: [],
      username: "",
      nickname: "",
      avatar: "",
      roles: [],
    };
  },
  actions: {
    //用户登录方法
    async userLogin(loginForm) {
      let res = await reqLogin(loginForm);
      if (res.data.code === 200) {
        this.token = res.data.data;
        // 持久化
        SET_TOKEN(res.data.data);
        return "ok";
      } else {
        return res.message;
      }
    },
    async userInfo() {
      let token = GET_TOKEN(); // 获取存储在本地的 Token
      // const config = {
      //   headers: {
      //     "Content-Type": "application/json", // 请求头
      //     Authorization: token, // 身份验证令牌
      //   },
      // };
      let res1 = await reqUserInfo();
      if (res1.data.code === 200) {
        this.username = res1.data.data.username;
        this.nickname = res1.data.data.nickname;
        this.avatar = res1.data.data.avatar;
        this.roles = res1.data.data.roles;
        this.menuList = GetMenuList(res1.data.data.menu);
        return "ok";
      } else {
        REMOVE_TOKEN();
        return res.message;
      }
    },
    async userLogout() {
      this.token = "";
      this.username = "";
      this.nickname = "";
      this.avatar = "";
      REMOVE_TOKEN();
    },
  },
});
//
const GetMenuList = (menuListErr) => {
  let menu = [];
  for (const i in menuListErr) {
    if (menuListErr[i].length == 0) {
      menu.push({
        name: menuListErr[i].name,
        key: menuListErr[i].name,
        path: menuListErr[i].path,
        icon: menuListErr[i].icon,
      });
    } else {
      let menuChildren = [];
      for (const j in menuListErr[i].children) {
        menuChildren.push({
          name: menuListErr[i].children[j].name,
          icon: menuListErr[i].icon,
          key: menuListErr[i].children[j].name,
          path: menuListErr[i].children[j].path,
        });
      }
      menu.push({
        name: menuListErr[i].name,
        key: menuListErr[i].name,
        path: menuListErr[i].path,
        icon: menuListErr[i].icon,
        children: menuChildren,
      });
    }
  }
  return menu;
};

export default useUserStore;
