<template>
  <div class="address">
    <component :is="'Address_' + language"></component>
  </div>
</template>
<script>
// @ is an alias to /src
import Address_en from "@/components/address/Address_en.vue";
export default {
  name: "Address",
  components: {
    Address_en,
  },
  computed: {
    language() {
      return this.$store.getters.language;
    },
  },
};
</script>
