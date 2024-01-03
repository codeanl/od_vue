export const constantRoute = [
  {
    path: "/",
    component: () => import("@/Layout/index.vue"),
    name: "layout",
    meta: {
      title: "首页",
      icon: "HomeFilled",
    },
    redirect: "/",
    children: [
      {
        path: "/",
        component: () => import("@/view/home/index.vue"),
        name: "home",
        meta: {
          title: "首页",
          icon: "HomeFilled",
        },
      },
      {
        path: "/profile",
        component: () => import("@/view/profile/index.vue"),
        name: "Profile",
        meta: {
          title: "个人中心",
          icon: "HomeFilled",
        },
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/view/login/index.vue"),
    name: "login",
  },
  {
    path: "/sys",
    component: () => import("@/Layout/index.vue"),
    name: "system",
    redirect: "/sys/user",
    meta: {
      title: "系统管理",
      icon: "HomeFilled",
    },
    children: [
      {
        path: "/sys/user",
        component: () => import("@/view/system/user/index.vue"),
        name: "user",
        meta: {
          title: "用户列表",
          icon: "HomeFilled",
        },
      },
      {
        path: "/sys/role",
        component: () => import("@/view/system/role/index.vue"),
        name: "role",
        meta: {
          title: "角色列表",
          icon: "HomeFilled",
        },
      },
      {
        path: "/sys/menu",
        component: () => import("@/view/system/menu/index.vue"),
        name: "menu",
        meta: {
          title: "菜单列表",
          icon: "HomeFilled",
        },
      },
      {
        path: "/sys/slideShow",
        component: () => import("@/view/system/slideShow/index.vue"),
        name: "slideShow",
        meta: {
          title: "轮播图",
          icon: "HomeFilled",
        },
      },
    ],
  },
  {
    path: "/product",
    component: () => import("@/Layout/index.vue"),
    name: "product",
    redirect: "/product/product",
    meta: {
      title: "商品管理",
      icon: "HomeFilled",
    },
    children: [
      {
        path: "/product/product",
        component: () => import("@/view/product/product/index.vue"),
        name: "product",
        meta: {
          title: "商品管理",
          icon: "HomeFilled",
        },
      },
      {
        path: "/product/category",
        component: () => import("@/view/product/category/index.vue"),
        name: "category",
        meta: {
          title: "分类列表",
          icon: "HomeFilled",
        },
      },
    ],
  },

  {
    path: "/member",
    component: () => import("@/Layout/index.vue"),
    name: "member",
    redirect: "/member/member",
    meta: {
      title: "会员管理",
      icon: "HomeFilled",
    },
    children: [
      {
        path: "/member/member",
        component: () => import("@/view/member/index.vue"),
        name: "member",
        meta: {
          title: "会员管理",
          icon: "HomeFilled",
        },
      },
    ],
  },

  {
    path: "/order",
    component: () => import("@/Layout/index.vue"),
    name: "order",
    redirect: "/order/order",
    meta: {
      title: "订单管理",
      icon: "HomeFilled",
    },
    children: [
      {
        path: "/order/order",
        component: () => import("@/view/order/index.vue"),
        name: "order",
        meta: {
          title: "订单管理",
          icon: "HomeFilled",
        },
      },
    ],
  },
  {
    path: "/artical",
    component: () => import("@/Layout/index.vue"),
    name: "artical",
    redirect: "/artical/artical",
    meta: {
      title: "文章管理",
      icon: "HomeFilled",
    },
    children: [
      {
        path: "/artical/artical",
        component: () => import("@/view/artical/index.vue"),
        name: "artical",
      },
    ],
  },
  {
    path: "/log",
    component: () => import("@/Layout/index.vue"),
    name: "log",
    redirect: "/log/loginLog",
    meta: {
      title: "登录日志",
      icon: "HomeFilled",
    },
    children: [
      {
        path: "/log/loginLog",
        component: () => import("@/view/log/loginLog/index.vue"),
        name: "loginLog",
      },
    ],
  },
];
