<template>
  <div class="overflow-y-scroll pb-6 pt-[3.65rem]" :style="{ height: `${windowHeight}px` }">
    <div
      v-for="item in highlightedVerses"
      :key="`${item.book}-${item.chapter}-${item.verse}`"
      style="margin-bottom: 1rem;"
      
      class="bg-[var(--saved)] m-2 rounded-lg p-2 overflow-y-scroll"
    >
      <div v-if="item.textFirstLang" class="flex">
        <div class="min-h-full min-w-1.5 w-1.5 mr-2 flex rounded-2xl" :style="{background: highlightColor[item.colorFirst]}">
        </div>
        <div>
          <div class="flex items-center">
            <div class="rounded-lg w-5 cursor-pointer justify-center items-center flex select-none" > 
              <img :src="icons[item.lang]">
            </div>
            <div class="text-md font-bold pl-2 truncate" @click="goToVerse(item.book, item.chapter, item.verse)"> 
              {{ item.chapterNameFirst }} : {{ item.verse + 1 }}
            </div>
            <div class="text-[0.6rem] pl-2 opacity-70">
              {{ formatTimeAgo(item.timestampFirst) }}
            </div>
          </div>
          <div class="text-sm pt-1.5 pl-2.5 pr-1" v-html="item.textFirstLang"></div>
        </div>
      </div>

      <div v-if="item.textSecondLang" class="flex" :class="{'pt-4': item.textFirstLang}">
        <div class="min-h-full min-w-1.5 w-1.5 mr-2 flex rounded-2xl" :style="{background: highlightColor[item.colorSecond]}">
        </div>
        <div>
          <div class="flex items-center">
            <div class="rounded-lg w-5 cursor-pointer justify-center items-center flex select-none" > 
              <img :src="icons[secondLang]">
            </div>
            <div class="text-md font-bold pl-2 truncate"  @click="goToVerse(item.book, item.chapter, item.verse)"> 
              {{ item.chapterNameSecond }} : {{ item.verse + 1 }}
            </div>
            <div class="text-[0.6rem] pl-2 opacity-70">
              {{ formatTimeAgo(item.timestampSecond) }}
            </div>
          </div>
          <div class="text-sm pt-1.5 pl-2.5 pr-1" v-html="item.textSecondLang"></div>
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
  
  <div class="fixed top-0 pt-2 w-full bg-[var(--bg)] flex justify-between">
    <touch-ripple :duration="200" class="overflow-hidden rounded-full mx-3 mb-2">
      <div class="flex items-center h-full">
        <div
          class="min-w-[3rem] flex items-center justify-center bg-[var(--chapters)] rounded-4xl aspect-square"
          @click="router.push('/')"
        >
          <i class="fa-solid fa-angle-left text-xl"></i>
        </div>
      </div>
    </touch-ripple>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useStore, icons } from '@/store';
import { useChapters, highlightColor, formatTimeAgo } from '@/scripts/utils';
import router from '@/router';
import { TouchRipple } from 'vue-touch-ripple';
import 'vue-touch-ripple/style.css';

const { highlighted, firstLang, secondLang, selectedBook, selectedChapter, selectedVerse } = useStore();
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
</script>
