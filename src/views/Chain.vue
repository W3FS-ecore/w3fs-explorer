<template>
  <div class="chain">
    <component :is="'Chain_' + language"></component>
  </div>
</template>
<script>
// @ is an alias to /src
import Chain_en from "@/components/chain/Chain_en.vue";
export default {
  name: "Chain",
  components: {
    Chain_en,
  },
  computed: {
    language() {
      return this.$store.getters.language;
    },
  },
};
</script>
