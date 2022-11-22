import axios from "axios";
import Qs from "qs";
// import { Message } from "element-ui";
import store from "../store";

var instance = axios.create({
  // baseURL: '', //
  timeout: 18000, //
});
let reqList = [];
/**
 * @param {array} reqList
 * @param {string} url
 * @param {function} cancel
 * @param {string} errorMessage
 */
const stopRepeatRequest = function (reqList, url, cancel, errorMessage) {
  const errorMsg = errorMessage || "";
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      cancel(errorMsg);
      return;
    }
  }
  reqList.push(url);
};
/**
 * @param {array} reqList
 * @param {string} url
 */
const allowRequest = function (reqList, url) {
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      reqList.splice(i, 1);
      break;
    }
  }
};
instance.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] =
      "application/x-www-form-urlencoded;charset=UTF-8";
    // let token = JSON.parse(localStorage.getItem("token")) || {}
    // config.headers['token'] =
    //   token.token;
    config.headers["lang"] = store.state.language ? store.state.language : "en";
    // config.headers["tm"] = myFn.setGuid();
    let urlArr = [];
    if (urlArr.includes(config.url)) {
      let cancel;
      config.cancelToken = new axios.CancelToken(function (c) {
        cancel = c;
      });
      stopRepeatRequest(reqList, config.url, cancel, `${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    setTimeout(() => {
      allowRequest(reqList, response.config.url);
    }, 1000);
    if (response.data) {
      let res = response.data;
      // let code = res.code
      // if (code == 403) {
      //   store.commit('setTokenTime', code)
      // }
      //   let code = res.code;
      //   if (code != 0) {
      //     message.error('error');
      //     return res;
      //   } else {
      //     return res;
      //   }
      return res;
    }
  },
  (error) => {
    if (axios.isCancel(error)) {
      try {
        throw new Error("Please do not repeat the request!");
      } catch (e) {
        console.log(e);
      }
    } else {
      // let tipTxt = "The network is unstable, please try again later!";
      // if (error.message.indexOf("timeout") > -1) {
      //   tipTxt = "Request timed out, please try again!";
      // }
      // Message.error(tipTxt);
    }
    return Promise.reject(error);
  }
);

class http {
  static async get(url, params) {
    return await instance.get(url, { params });
  }
  static async post(url, params) {
    return await instance.post(url, Qs.stringify(params));
  }
}

export default http;
