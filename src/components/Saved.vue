<template>
  <div class="overflow-y-scroll pb-6 pt-[4rem]" :style="{ height: `${windowHeight}px` }">
    <div
      v-for="item in highlightedVerses"
      :key="`${item.book}-${item.chapter}-${item.verse}`"
      style="margin-bottom: 1rem;"
      
      class="bg-[var(--saved)] m-2 rounded-lg p-2 overflow-y-scroll"
      :style="{
            transition: 'all 0.2s ease',
          }"
    >
      <div
        v-if="item.textFirstLang"
        class="relative"
        @touchstart.stop="(e) => handleSwipeStart(e, `${item.lang}-${item.book}-${item.chapter}-${item.verse}-first`)"
        @touchmove="(e) => handleSwipeMove(e, `${item.lang}-${item.book}-${item.chapter}-${item.verse}-first`)"
        @touchend="() => handleSwipeEnd(`${item.lang}-${item.book}-${item.chapter}-${item.verse}-first`)"
      >
        <div
          class="absolute top-0 left-0 right-0 bottom-0 flex items-center rounded-2xl overflow-hidden min-w-1.5 z-10"
          :style="{
            width: `${
              swipeStates[`${item.lang}-${item.book}-${item.chapter}-${item.verse}-first`] >= SWIPE_THRESHOLD + 130
                ? DELETE_BOX_WIDTH
                : Math.min(swipeStates[`${item.lang}-${item.book}-${item.chapter}-${item.verse}-first`] || 0, DELETE_BOX_WIDTH)
            }px`,
            background:
              swipeStates[`${item.lang}-${item.book}-${item.chapter}-${item.verse}-first`] >=( SWIPE_THRESHOLD + 5)
                ? 'var(--d)'
                : highlightColor[item.colorFirst],
            transition: 'width 0.3s ease, background 0.7s ease',
            willChange: 'width, background',
            zIndex: 10,
          }"
        >
          <button
            v-if="swipeStates[`${item.lang}-${item.book}-${item.chapter}-${item.verse}-first`] >= SWIPE_THRESHOLD + 130 &&
              !isTouchingMap[`${item.lang}-${item.book}-${item.chapter}-${item.verse}-first`]"
            @click.stop.prevent="removeHighlight(item.book, item.chapter, item.verse, item.lang)"
            class="w-full h-full flex items-center justify-center text-white"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>

        <div
          class="pl-2 pr-2 bg-[var(--saved)] ml-2 rounded-lg"
          :style="{ transition: 'all 0.2s ease', paddingLeft: Math.min(swipeStates[`${item.lang}-${item.book}-${item.chapter}-${item.verse}-first`] + 7, DELETE_BOX_WIDTH)  + 'px' }"
        >
          <div class="flex items-center">
            <div class="rounded-lg w-5 cursor-pointer justify-center items-center flex select-none">
              <img :src="icons[item.lang]" />
            </div>
            <div
              class="text-md font-bold pl-2 truncate"
              @click="goToVerse(item.book, item.chapter, item.verse)"
            >
              {{ item.chapterNameFirst }} : {{ item.verse + 1 }}
            </div>
            <div class="text-[0.6rem] pl-2 opacity-70">
              {{ formatTimeAgo(item.timestampFirst) }}
            </div>
          </div>
          <div
            class="text-sm pt-1.5 pr-1 break-words pl-2"
            v-html="item.textFirstLang"
          ></div>
        </div>
      </div>

      <div
        v-if="item.textSecondLang"
        class="relative"
        :class="{ 'mt-4': item.textFirstLang }"
        @touchstart.stop="(e) => handleSwipeStart(e, `${secondLang}-${item.book}-${item.chapter}-${item.verse}-first`)"
        @touchmove="(e) => handleSwipeMove(e, `${secondLang}-${item.book}-${item.chapter}-${item.verse}-first`)"
        @touchend="() => handleSwipeEnd(`${secondLang}-${item.book}-${item.chapter}-${item.verse}-first`)"
      >
        <div
          class="absolute top-0 left-0 right-0 bottom-0 flex items-center rounded-2xl overflow-hidden min-w-1.5"
          :style="{
            width: `${
              swipeStates[`${secondLang}-${item.book}-${item.chapter}-${item.verse}-first`] >= SWIPE_THRESHOLD + 130
                ? DELETE_BOX_WIDTH
                : Math.min(swipeStates[`${secondLang}-${item.book}-${item.chapter}-${item.verse}-first`] || 0, DELETE_BOX_WIDTH)
            }px`,
            background:
              swipeStates[`${secondLang}-${item.book}-${item.chapter}-${item.verse}-first`] >=( SWIPE_THRESHOLD + 5)
                ? 'var(--d)'
                : highlightColor[item.colorSecond],
            transition: 'width 0.3s ease, background 0.7s ease',
            willChange: 'width, background',
            zIndex: 10,
          }"
        >
          <button
            v-if="swipeStates[`${secondLang}-${item.book}-${item.chapter}-${item.verse}-first`] >= SWIPE_THRESHOLD + 130 &&
              !isTouchingMap[`${secondLang}-${item.book}-${item.chapter}-${item.verse}-first`]"
            @click.stop.prevent="removeHighlight(item.book, item.chapter, item.verse, secondLang)"
            class="w-full h-full flex items-center justify-center text-white"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>

        <div
          class="pl-2 pr-2 bg-[var(--saved)] ml-2 rounded-lg"
          :style="{ transition: 'all 0.2s ease', paddingLeft: Math.min(swipeStates[`${secondLang}-${item.book}-${item.chapter}-${item.verse}-first`] + 7, DELETE_BOX_WIDTH)  + 'px' }"
        >
          <div class="flex items-center">
            <div class="rounded-lg w-5 cursor-pointer justify-center items-center flex select-none">
              <img :src="icons[secondLang]" />
            </div>
            <div
              class="text-md font-bold pl-2 truncate"
              @click="goToVerse(item.book, item.chapter, item.verse)"
            >
              {{ item.chapterNameSecond }} : {{ item.verse + 1 }}
            </div>
            <div class="text-[0.6rem] pl-2 opacity-70">
              {{ formatTimeAgo(item.timestampSecond) }}
            </div>
          </div>
          <div
            class="text-sm pt-1.5 pr-1 break-words pl-2"
            v-html="item.textSecondLang"
          ></div>
        </div>
      </div>
    </div>
    <div v-if="!highlightedVerses.length" class="h-full flex items-center justify-center">
      <div
        class=" flex items-center justify-center text-4xl gap-1"
        @click="router.push('/saved')"
      >
        <i class="fa-solid fa-bookmark" :style="{ color: highlightColor[1] }"></i>
        <i class="fa-solid fa-book-bible pl-2" :style="{ color: highlightColor[2] }"></i>
        <i class="fa-solid fa-equals px-3" :style="{ color: highlightColor[3] }"></i>
        <i class="fa-solid fa-0" :style="{ color: highlightColor[4] }"></i>
        <i class="fa-solid fa-question pl-1" :style="{ color: highlightColor[5] }"></i>
      </div>
    </div>
  </div>
  
  <div class="fixed top-0 pt-3 w-full flex justify-between bg-[var(--bg)] z-999">
    <touch-ripple :duration="200" class="overflow-hidden rounded-full mx-3 mb-2">
      <div class="flex items-center h-full">
        <div
          class="min-w-[3rem] flex items-center justify-center bg-[var(--chapters)] rounded-4xl aspect-square"
          @click="() => { showOpacityAnimation = false; selectedVerse = 0; router.push('/'); }"
        >
          <i class="fa-solid fa-angle-left text-xl"></i>
        </div>
      </div>
    </touch-ripple>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, reactive, watch } from 'vue';
import { useStore, icons } from '@/store';
import { useChapters, highlightColor, formatTimeAgo } from '@/scripts/utils';
import router from '@/router';
import { TouchRipple } from 'vue-touch-ripple';
import 'vue-touch-ripple/style.css';

const { highlighted, firstLang, secondLang, selectedBook, selectedChapter, selectedVerse, showOpacityAnimation } = useStore();
const { getVerse, getChapterName } = useChapters();

const highlightedVerses = computed(() => {
  const result: {
    book: number;
    chapter: number;
    verse: number;
    chapterNameFirst: string;
    chapterNameSecond: string;
    textFirstLang: string;
    textSecondLang: string;
    colorFirst: number;
    colorSecond: number;
    lang: string;
    timestampFirst: number;
    timestampSecond: number;
  }[] = [];

  const first = firstLang.value;
  const second = secondLang.value;

  const byFirst = highlighted.value[first] || {};
  const bySecond = highlighted.value[second] || {};

  const uniqueKeys = new Set<string>();

  for (const book in byFirst) {
    for (const chapter in byFirst[+book]) {
      for (const verse in byFirst[+book][+chapter]) {
        const color = byFirst[+book][+chapter][+verse][0];
        if (color && color !== 0) uniqueKeys.add(`${book}-${chapter}-${verse}`);
      }
    }
  }

  for (const book in bySecond) {
    for (const chapter in bySecond[+book]) {
      for (const verse in bySecond[+book][+chapter]) {
        const color = bySecond[+book][+chapter][+verse][0];
        if (color && color !== 0) uniqueKeys.add(`${book}-${chapter}-${verse}`);
      }
    }
  }

  uniqueKeys.forEach((key) => {
    const [book, chapter, verse] = key.split('-').map(Number);

    const firstHas =
      byFirst[book]?.[chapter]?.[verse] &&
      byFirst[book][chapter][verse][0] !== 0;

    const secondHas =
      bySecond[book]?.[chapter]?.[verse] &&
      bySecond[book][chapter][verse][0] !== 0;

    let primaryLang = '';
    if (firstHas) primaryLang = first;
    else if (secondHas) primaryLang = second;
    else return;

    const chapterNameFirst = getChapterName(first, book, chapter);
    const chapterNameSecond = getChapterName(second, book, chapter);

    const textFirstLang = firstHas ? getVerse(first, book, chapter, verse) : '';
    const textSecondLang = secondHas ? getVerse(second, book, chapter, verse) : '';

    const colorFirst = firstHas ? byFirst[book][chapter][verse][0] : 0;
    const colorSecond = secondHas ? bySecond[book][chapter][verse][0] : 0;

    const timestampFirst = firstHas ? byFirst[book][chapter][verse][1] : 0;
    const timestampSecond = secondHas ? bySecond[book][chapter][verse][1] : 0;

    result.push({
      book,
      chapter,
      verse,
      chapterNameFirst,
      chapterNameSecond,
      textFirstLang: textFirstLang.replace(/<wj>(.*?)<\/wj>/g, '<span class="wj">$1</span>'),
      textSecondLang: textSecondLang.replace(/<wj>(.*?)<\/wj>/g, '<span class="wj">$1</span>'),
      colorFirst,
      colorSecond,
      lang: primaryLang,
      timestampFirst,
      timestampSecond
    });
  });


  result.sort((a, b) => {
    const timeA = Math.max(a.timestampFirst, a.timestampSecond);
    const timeB = Math.max(b.timestampFirst, b.timestampSecond);
    return timeB - timeA;
  });

  return result;
});

function goToVerse(book: number, chapter: number, verse: number) {
  selectedBook.value = book;
  selectedChapter.value = chapter;
  selectedVerse.value = verse;
  showOpacityAnimation.value = true;
  router.push('/');
}

const windowHeight = ref(window.innerHeight);
onMounted(() => {
  const updateHeight = () => {
    windowHeight.value = window.innerHeight;
  };

  window.addEventListener("resize", updateHeight);

  updateHeight();

  onUnmounted(() => {
    window.removeEventListener("resize", updateHeight);
  });
});

function removeHighlight(book: number, chapter: number, verse: number, lang: string) {
  const langHighlights = highlighted.value[lang];
  if (langHighlights?.[book]?.[chapter]?.[verse]) {
    delete langHighlights[book][chapter][verse];

    if (Object.keys(langHighlights[book][chapter]).length === 0)
      delete langHighlights[book][chapter];
    if (Object.keys(langHighlights[book]).length === 0)
      delete langHighlights[book];
  }
}

const swipeStates = reactive<{ [key: string]: number }>({});
const isTouchingMap = reactive<{ [key: string]: boolean }>({});
const SWIPE_THRESHOLD = 40;
const DELETE_BOX_WIDTH = 60;

function handleSwipeStart(e: TouchEvent, key: string) {
  if (isTouchingMap[key]) return;

  const target = e.target as HTMLElement;
  if (target.closest("button")) return;

  isTouchingMap[key] = true;
  swipeStates[key] = 0;
  swipeStartX[key] = e.touches[0].clientX;
  swipeStartY[key] = e.touches[0].clientY;
}

const swipeStartX: { [key: string]: number } = {};
const swipeStartY: { [key: string]: number } = {};

function handleSwipeMove(e: TouchEvent, key: string) {
  if (!isTouchingMap[key]) return;

  const deltaX = e.touches[0].clientX - swipeStartX[key];
  const deltaY = e.touches[0].clientY - swipeStartY[key];

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    e.preventDefault();
    const clamped = Math.min(Math.max(0, Math.floor(deltaX)), SWIPE_THRESHOLD + 180);
    swipeStates[key] = Math.round(clamped / 5) * 5;
  }
}


function handleSwipeEnd(key: string) {
  if (!isTouchingMap[key]) return;

  isTouchingMap[key] = false;
  swipeStates[key] = swipeStates[key] > SWIPE_THRESHOLD / 2 ? SWIPE_THRESHOLD + 130 : 0;
}


watch(
  highlighted,
  (newValue) => {
    localStorage.setItem('highlighted', JSON.stringify(newValue));
  },
  { deep: true, immediate: true }
);
</script>
