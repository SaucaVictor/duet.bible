<template>
  <router-view  />
</template>
<script setup lang="ts">
import { provideStore } from "@/store";

const store = provideStore();
</script>