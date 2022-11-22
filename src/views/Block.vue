<template>
  <div class="block">
    <component :is="'Block_' + language"></component>
  </div>
</template>
<script>
// @ is an alias to /src
import Block_en from "@/components/block/Block_en.vue";
export default {
  name: "Block",
  components: {
    Block_en,
  },
  computed: {
    language() {
      return this.$store.getters.language;
    },
  },
};
</script>
