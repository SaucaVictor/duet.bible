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
            {{ getChapterName(firstLang) }}
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
      <h3 class="text-lg font-semibold pb-1">{{ getChapterName(linkHighlight ? firstLang : undefined) + ':' + (selectedHighlightVerse + 1) }}</h3>
      <span class="text-sm mt-3" :style="{
          transition: 'all 0.2s ease',
          backgroundColor: String(getColor()),
          userSelect: 'none',
          cursor: 'pointer'
        }">{{ getVerse(linkHighlight ? firstLang : undefined) }}</span>
      <div v-if="linkHighlight" class="pt-6 pb-1 transition-all duration-300 ease-in-out">
        <h3 class="text-lg font-semibold pb-1">{{ getChapterName(secondLang) + ':' + (selectedHighlightVerse + 1) }}</h3>
        <span class="text-sm mt-3" :style="{
          transition: 'all 0.2s ease',
          backgroundColor: String(getColor()),
          userSelect: 'none',
          cursor: 'pointer'
        }">{{ getVerse(secondLang) }}</span>
      </div>

      <div class="flex overflow-x-auto w-full pt-4 pb-6 items-center">
        <div class="flex items-center h-full pr-3">
          <div
            class="min-w-[3rem] flex items-center justify-center bg-[var(--chapters)] rounded-4xl aspect-square"
            @click="() => { linkHighlight = !linkHighlight; if (linkHighlight) addHighlightWithLink(selectedLang, selectedBook, selectedChapter, selectedHighlightVerse, wasColor)}"
          >
            <i class="fa-solid fa-link" v-if="linkHighlight"></i>
            <i class="fa-solid fa-link-slash" v-else></i>
          </div>
        </div>
        <div
          v-for="(color, index) in highlightColor"
          :key="color"
          class="flex-shrink-0 w-15 aspect-square rounded-2xl border-[0.1rem] mr-3"
          :class="['bg-[' + color + ']']"
          @click="addHighlightWithLink(selectedLang, selectedBook, selectedChapter, selectedHighlightVerse, index)"
        >
          <div class="w-full h-full flex items-center justify-center" v-if="!index">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>
      </div>
    </BottomSheet>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useStore } from "@/store";
import { useChapters, highlightColor } from '@/scripts/utils';
import BottomSheet from '../components/BottomSheet.vue'
import Verses from '@/components/Verses.vue';

const lock = ref(true);
const wasColor = ref(0);
const { selectedVerse, selectVerse, selectedHighlightVerse, highlighted, selectedBook, selectedChapter, selectedLang, linkHighlight } = useStore();
const { firstLang, secondLang } = useStore();
const { getChapterName, nextChapter, previousChapter, getVerse } = useChapters();

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

function addHighlightWithLink(lang: string, book: number, chapter: number, verse: number, colorIndex: number){
  wasColor.value = colorIndex;
  addHighlight(lang, book, chapter, verse, colorIndex);
  if (!linkHighlight.value) return;
  if (lang === firstLang.value) {
    addHighlight(secondLang.value, book, chapter, verse, colorIndex);
  } else {
    addHighlight(firstLang.value, book, chapter, verse, colorIndex);
  }
}

function addHighlight(lang: string, book: number, chapter: number, verse: number, colorIndex: number) {
  if (!colorIndex && highlighted.value[lang][book][chapter][verse]) {
    delete highlighted.value[lang][book][chapter][verse];
    return;
  }
  if (!highlighted.value[lang]) {
    highlighted.value[lang] = {};
  }
  if (!highlighted.value[lang][book]) {
    highlighted.value[lang][book] = {};
  }
  if (!highlighted.value[lang][book][chapter]) {
    highlighted.value[lang][book][chapter] = {};
  }
  highlighted.value[lang][book][chapter][verse] = colorIndex;
}

function getColor(index?: boolean) {
  const langHighlights = highlighted.value[selectedLang.value];
  if (!langHighlights) return 'transparent';

  const bookHighlights = langHighlights[selectedBook.value];
  if (!bookHighlights) return 'transparent';

  const chapterHighlights = bookHighlights[selectedChapter.value];
  if (!chapterHighlights) return 'transparent';

  const colorIndex = chapterHighlights[selectedHighlightVerse.value];
  return index ? colorIndex : highlightColor[colorIndex] ?? 'transparent';
}

watch(
  highlighted,
  (newValue) => {
    localStorage.setItem('highlighted', JSON.stringify(newValue));
  },
  { deep: true, immediate: true }
);

watch(selectVerse, (v) => {
  if (v) {
    wasColor.value = getColor(true) as number;
  }
})

watch(selectedBook, (newVal) => {
  localStorage.setItem('selectedBook', JSON.stringify(newVal))
  },
  { deep: true, immediate: true }
)

watch(selectedChapter, (newVal) => {
  localStorage.setItem('selectedChapter', JSON.stringify(newVal))
  },
  { deep: true, immediate: true }
)
</script>