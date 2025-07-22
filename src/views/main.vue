<template>
  <div class="flex flex-col h-screen relative">
    <div class="flex-1 overflow-scroll">
      <Verses :lang="firstLang" class="h-full" />
    </div>

    <div class=" h-2 bg-[var(--chapters)]">

    </div>
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      <div class="bg-[var(--chapters)] w-12 flex items-center justify-center aspect-square rounded-full" @click="swap">
        <i class="fa-solid fa-right-left transform rotate-90"></i>
      </div>
    </div>

    <div class="flex-1 overflow-scroll">
      <Verses :lang="secondLang" class="h-full" />
    </div>

    <div class="fixed bottom-2 pt-2 left-3 right-3 bg-inherit">
      <div class="rounded-4xl bg-[var(--chapters)] flex items-center justify-between h-[3.5rem]">
        <div
          class="min-w-[3.5rem] flex items-center justify-center h-full rounded-4xl"
          @click="previousChapter"
        >
          <i class="fa-solid fa-angle-left text-xl"></i>
        </div>
        <RouterLink to="/chapters" class="font-bold">
          {{ getChapterName() }}
        </RouterLink>
        <div
          class="min-w-[3.5rem] flex items-center justify-center h-full rounded-4xl"
          @click="nextChapter"
        >
          <i class="fa-solid fa-angle-right text-xl"></i>
        </div>
      </div>
    </div>

    <BottomSheet v-model="open">
      <h3 class="text-lg font-semibold">Galateni 1:4</h3>
      <p class="text-sm mt-2">S-a dat pe Sine Însuși pentru păcatele noastre...</p>
    </BottomSheet>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from "@/store";
import { useChapters } from '@/scripts/utils';
import BottomSheet from '../components/BottomSheet.vue'
import Verses from '@/components/Verses.vue';
const open = ref(false);
const { firstLang, secondLang } = useStore();

const { getChapterName, nextChapter, previousChapter } = useChapters();

function swap() {
  const l = firstLang.value;
  firstLang.value = secondLang.value;
  secondLang.value = l;
}
</script>
