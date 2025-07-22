<template>
  <div class="flex flex-col h-[100vh] relative">
    <div
      ref="scrollRef1"
      class="flex-1 overflow-y-scroll overflow-x-hidden"
      @scroll="onScroll(1)"
    >
      <Verses :lang="firstLang"/>
    </div>

    <div
      class="h-2 bg-[var(--chapters)] z-10 items-center flex justify-center"
    >
      <div
        class="bg-[var(--chapters)] w-12 flex items-center justify-center aspect-square rounded-full"
        @click="swap"
      >
        <i class="fa-solid fa-right-left transform rotate-90"></i>
      </div>
      <div
        class="bg-[var(--chapters)] ml-2 w-12 flex items-center justify-center aspect-square rounded-full"
        @click="lock = !lock"
      >
        <i class="fa-solid fa-lock" v-if="lock"></i>
        <i class="fa-solid fa-lock-open" v-else></i>
      </div>
    </div>

    <div
      ref="scrollRef2"
      class="flex-1 overflow-y-scroll overflow-x-hidden"
      @scroll="onScroll(2)"
    >
      <Verses :lang="secondLang"/>
    </div>

    <div class="flex w-full p-2 left-3 right-3 bg-[var(--bg)]">
      <div class="rounded-4xl bg-[var(--chapters)] flex items-center justify-between h-[3.5rem] w-full">
        <div
          class="min-w-[3.5rem] flex items-center justify-center h-full rounded-4xl"
          @click="previousChapter"
        >
          <i class="fa-solid fa-angle-left text-xl"></i>
        </div>
        <RouterLink to="/chapters" class="font-bold w-full h-full flex items-center justify-center">
          <div>
            {{ getChapterName() }}
          </div>
        </RouterLink>
        <div
          class="min-w-[3.5rem] flex items-center justify-center h-full rounded-4xl"
          @click="nextChapter"
        >
          <i class="fa-solid fa-angle-right text-xl"></i>
        </div>
      </div>
    </div>

    <BottomSheet v-model="selectVerse">
      <h3 class="text-lg font-semibold">{{ selectedHighlightVerseTitle + ':' + (selectedHighlightVerse + 1) }}</h3>
      <p class="text-sm mt-2">{{ selectedHighlightVerseText }}</p>
    </BottomSheet>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useStore } from "@/store";
import { useChapters } from '@/scripts/utils';
import BottomSheet from '../components/BottomSheet.vue'
import Verses from '@/components/Verses.vue';

const lock = ref(true);
const { selectedVerse, selectVerse, selectedHighlightVerse, selectedHighlightVerseText, selectedHighlightVerseTitle } = useStore();
const { firstLang, secondLang } = useStore();
const { getChapterName, nextChapter, previousChapter } = useChapters();

const scrollRef1 = ref<HTMLElement | null>(null);
const scrollRef2 = ref<HTMLElement | null>(null);
let isSyncingScroll = false;

function onScroll(scrolledDiv: number) {
  if (isSyncingScroll || !lock.value || selectedVerse.value) return;

  isSyncingScroll = true;

  if (scrolledDiv === 1 && scrollRef1.value && scrollRef2.value) {
    scrollRef2.value.scrollTop = scrollRef1.value.scrollTop;
  } else if (scrolledDiv === 2 && scrollRef1.value && scrollRef2.value) {
    scrollRef1.value.scrollTop = scrollRef2.value.scrollTop;
  }

  requestAnimationFrame(() => {
    isSyncingScroll = false;
  });
}

function swap() {
  const l = firstLang.value;
  firstLang.value = secondLang.value;
  secondLang.value = l;
}

onMounted(() => {
  setTimeout(() => {
    selectedVerse.value = 0;
  }, 100);
})
</script>