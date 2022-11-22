<template>
  <div id="footer" class="footer">
    <div class="container footerBox">
      <div class="logo">
        <img src="../../assets/logo.png" alt="" />
      </div>
      <ul class="contact-list" v-show="suspensionBar.length != 0">
        <li
          class="li"
          v-for="(bar, index) in suspensionBar"
          :key="index"
          v-show="bar.url"
          :title="bar.name"
          @click="openLink(bar)"
        >
          <i :class="'icon-' + bar.name"></i>
          <!-- <img class="icon" :src="bar.iconPc" alt="" /> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {};
  },
  created() {},
  computed: {
    suspensionBar() {
      return this.$store.state.Contact;
    },
  },
  methods: {
    openLink(obj) {
      if (obj.name == "email") {
        window.open("mailto:" + obj.url, "_self");
      } else if (obj.url) {
        window.open(obj.url, "_blank");
      }
    },
  },
};
</script>
