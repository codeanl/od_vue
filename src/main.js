import { createApp } from "vue";
// import './style.css'
import App from "./App.vue";
const app = createApp(App);

// 引入icon
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

//引入路由
import router from "./router";
app.use(router);

//引入pinia
import pinia from "./store";
app.use(pinia);

//引入路由鉴权
import "./permission";

// 如果只想导入css变量
import "element-plus/theme-chalk/dark/css-vars.css";

app.mount("#app");
