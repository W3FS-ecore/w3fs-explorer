<template>
  <div class="header" :class="{ active: isActive || $route.path != '/' }">
    <div class="container">
      <div class="header-logo">
        <router-link to="/">
          <img
            :src="
              isActive || $route.path != '/'
                ? require('../../assets/logoblack.png')
                : require('../../assets/logoblack.png')
            "
            alt=""
        /></router-link>
        <!--<router-link to="/chain"> Blockchain Info </router-link> -->
        <div class="nav-pc" v-if="$route.path != '/'">
          <el-input
            placeholder="Tx Hash, Address, or Block #"
            v-model="ethRequest"
          >
            <el-button slot="suffix" class="search-btn" @click="processRequest"
              ><i class="icon-search"></i
            ></el-button>
          </el-input>
        </div>
      </div>

      <div class="header-nav">
        <a href="javascript:;" class="header-contact" @click="goFooter"
          >Contact Us</a
        >

        <el-dropdown
          class="nav-mobile"
          trigger="click"
          @visible-change="closeIcon"
          :hide-on-click="false"
        >
          <button
            class="hamburger hamburger--spin el-dropdown-link"
            :class="{ 'is-active': isClick }"
            type="button"
          >
            <span class="hamburger-box">
              <span class="hamburger-inner"></span>
            </span>
          </button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <a href="javascript:;" @click="goFooter">Contact Us</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-input
                placeholder="Tx Hash, Address, or Block #"
                v-model="ethRequest"
              >
                <el-button
                  slot="suffix"
                  class="search-btn"
                  @click="processRequest"
                  ><i class="icon-search"></i
                ></el-button>
              </el-input>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-dropdown @command="handleCommand" class="header-dropdown">
          <span class="el-dropdown-link">
            {{ command }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="EN">EN</el-dropdown-item>
            <el-dropdown-item command="CN">CN</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </div>
    </div>
  </div>
</template>

<script>
import Fn from "../../utils/fn";
export default {
  name: "Header",
  data() {
    return {
      isClick: false,
      ethRequest: "",
      command: "EN",
    };
  },
  computed: {
    isActive() {
      return this.$store.state.header;
    },
  },
  created() {},
  methods: {
    handleCommand(command) {
      this.command = command;
    },
    processRequest() {
      Fn.processRequest(this.ethRequest, this.$router);
    },
    goLink(path) {
      this.$router.push({
        path: path,
      });
    },
    closeIcon() {
      this.isClick = !this.isClick;
    },
    goFooter() {
      window.scrollTo(0, document.documentElement.clientHeight);
    },
  },
};
</script>
