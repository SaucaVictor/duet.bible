<script setup lang="ts">
import { ref } from 'vue';
import Settings from './Settings.vue';
import { TouchRipple } from 'vue-touch-ripple';
import 'vue-touch-ripple/style.css';

const settings = ref(false);
</script>

<template>
  <div class=" absolute bottom-0 flex justify-end bg-transparent w-full floating">
    <div class="h-[3.5rem] pl-2 bottom-2 m-2">
        <touch-ripple :duration="200" class="overflow-hidden w-full h-full rounded-full">
          <div
            class="min-w-[3.5rem] flex h-full items-center justify-center rounded-4xl bg-[var(--chapters)] aspect-square"
            @click="settings = true"
          >
            <i class="fa-solid fa-gear text-xl"></i>
          </div>
        </touch-ripple>
      </div>
  </div>
  <Settings v-model="settings" />
</template>

<style scoped>
.floating {
  padding-bottom: env(safe-area-inset-bottom);
}
h6 {
  font-family: 'Alice', serif;
  font-weight: 700;
}
</style>