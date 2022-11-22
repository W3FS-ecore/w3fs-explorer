<template>
  <div class="blocks">
    <component :is="'Blocks_' + language"></component>
  </div>
</template>
<script>
// @ is an alias to /src
import Blocks_en from "@/components/blocks/Blocks_en.vue";
export default {
  name: "Blocks",
  components: {
    Blocks_en,
  },
  computed: {
    language() {
      return this.$store.getters.language;
    },
  },
};
</script>
