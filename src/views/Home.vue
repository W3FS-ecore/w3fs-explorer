<template>
  <div class="home">
    <component :is="'Home_' + language"></component>
  </div>
</template>

<script>
// @ is an alias to /src
import Home_en from "@/components/home/Home_en.vue";
export default {
  name: "Home",
  components: {
    Home_en,
  },
  computed: {
    language() {
      return this.$store.getters.language;
    },
  },
  created() {},
};
</script>
