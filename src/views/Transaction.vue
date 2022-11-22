<template>
  <div class="transaction">
    <component :is="'Transaction_' + language"></component>
  </div>
</template>
<script>
// @ is an alias to /src
import Transaction_en from "@/components/transaction/Transaction_en.vue";
export default {
  name: "Transaction",
  components: {
    Transaction_en,
  },
  computed: {
    language() {
      return this.$store.getters.language;
    },
  },
};
</script>
