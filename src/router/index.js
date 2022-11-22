import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};
Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/",
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/chain",
    name: "Chain",
    component: () => import("../views/Chain.vue"),
  },
  {
    path: "/blocks",
    name: "Blocks",
    component: () => import("../views/Blocks.vue"),
  },
  {
    path: "/txs",
    name: "Transactions",
    component: () => import("../views/Transactions.vue"),
  },
  {
    path: "/address/:id?",
    name: "Address",
    component: () => import("../views/Address.vue"),
  },
  {
    path: "/block/:id?",
    name: "Block",
    component: () => import("../views/Block.vue"),
  },
  {
    path: "/tx/:id?",
    name: "Transaction",
    component: () => import("../views/Transaction.vue"),
  },
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
