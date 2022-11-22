<template>
  <div
    id="app"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <component :is="'Header_' + language"></component>
    <router-view :key="$route.fullPath" v-if="isLoad" />
    <component :is="'Footer_' + language"></component>
  </div>
</template>

<script>
import Header_en from "@/components/header/Header_en.vue";
import Footer_en from "@/components/footer/Footer_en.vue";

export default {
  name: "app",
  data() {
    return {
      isLoad: false,
    };
  },
  components: {
    Header_en,
    Footer_en,
  },
  computed: {
    loading() {
      if (this.$store.state.language) {
        return false;
      } else {
        return true;
      }
    },
    language() {
      return this.$store.getters.language;
    },
  },
  created() {
    this.getNetwork();
  },
  mounted() {
    window.removeEventListener("scroll", this.scrollHandle);
    window.addEventListener("scroll", this.scrollHandle);
  },
  methods: {
    async getNetwork() {
      let data = await this.$http.get(
        "/link.json?time=" + new Date().getTime()
      );
      if (data) {
        this.isLoad = true;
        this.$store.dispatch("SetContants", data);
        this.$web3.setProvider(
          new this.$web3.providers.HttpProvider(data.CHAIN_RPC)
        );
      }
    },
    scrollHandle() {
      var top = document.body.scrollTop || document.documentElement.scrollTop;
      if (top > 10) {
        this.$store.dispatch("SetHeader", true);
      } else {
        this.$store.dispatch("SetHeader", false);
      }
    },
  },
};
</script>
