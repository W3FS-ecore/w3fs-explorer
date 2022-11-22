<template>
  <div class="transactions">
    <component :is="'Transactions_' + language"></component>
  </div>
</template>
<script>
// @ is an alias to /src
import Transactions_en from "@/components/transactions/Transactions_en.vue";
export default {
  name: "Transactions",
  components: {
    Transactions_en,
  },
  computed: {
    language() {
      return this.$store.getters.language;
    },
  },
};
</script>
