<template>
  <div class="flex flex-col relative select-none" :style="{ height: `${windowHeight}px` }">
    <div
      ref="scrollRef1"
      class="flex-1 overflow-y-scroll overflow-x-hidden"
      @scroll="onScroll(1)"
    >
      <Verses :lang="firstLang" ptsafe :key="`${firstLang}-${selectedBook}-${selectedChapter}-${selectedVerse}`"/>
    </div>
    <div
      class="h-2 bg-[var(--chapters)] z-10 items-center flex justify-center gap-2"
    >
      <touch-ripple :duration="200" class="overflow-hidden rounded-full">
        <div
          class="bg-[var(--chapters)] w-12 flex items-center justify-center aspect-square rounded-full"
          @click="swap"
        >
          <i class="fa-solid fa-right-left transform rotate-90"></i>
        </div>
      </touch-ripple>
      <touch-ripple :duration="200" class="overflow-hidden rounded-full">
        <div
          class="bg-[var(--chapters)] w-12 flex items-center justify-center aspect-square rounded-full"
          @click="lockedScroll = !lockedScroll"
        >
          <i class="fa-solid fa-lock" v-if="lockedScroll"></i>
          <i class="fa-solid fa-lock-open" v-else></i>
        </div>
      </touch-ripple>
    </div>

    <div
      ref="scrollRef2"
      class="flex-1 overflow-y-scroll overflow-x-hidden"
      @scroll="onScroll(2)"
    >
      <Verses :lang="secondLang" :key="`${secondLang}-${selectedBook}-${selectedChapter}-${selectedVerse}`"/>
    </div>

    <div class="flex w-full p-2 bg-[var(--bg)] chapters border-t border-t-[var(--chapters)] ">
      <div class="w-full max-w-[calc(100%-4rem)] pb-2">
        <div class="rounded-full bg-[var(--chapters)] flex items-center justify-between h-[3.5rem] w-full">
          <touch-ripple :duration="200" class="overflow-hidden w-full h-full rounded-full max-w-[3.5rem]">
            <div
              class="min-w-[3.5rem] flex items-center justify-center h-full rounded-full"
              @click="() => { 
                previousChapter(); 
                scrollRef1?.scrollTo({ top: 0, behavior: 'smooth' }); 
                scrollRef2?.scrollTo({ top: 0, behavior: 'smooth' }); 
              }"
            >
              <i class="fa-solid fa-angle-left text-xl"></i>
            </div>
          </touch-ripple>
          <RouterLink
            to="/chapters"
            class="font-bold w-full h-full flex items-center overflow-hidden"
          >
            <div class="truncate w-full px-2 text-center">
              {{ getChapterName(firstLang) }}
            </div>
          </RouterLink>
          <touch-ripple :duration="200" class="overflow-hidden w-full h-full rounded-full max-w-[3.5rem]">
            <div
              class="min-w-[3.5rem] flex items-center justify-center h-full rounded-4xl"
              @click="() => { 
                nextChapter(); 
                scrollRef1?.scrollTo({ top: 0, behavior: 'smooth' }); 
                scrollRef2?.scrollTo({ top: 0, behavior: 'smooth' }); 
              }"
            >
              <i class="fa-solid fa-angle-right text-xl"></i>
            </div>
          </touch-ripple>
        </div>
      </div>
      <div class="h-[3.5rem] pl-2 fixed right-2">
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

    <BottomSheet v-model="selectVerse" 
      :extraButton="{
        icon: 'fa-solid fa-share-nodes',
        onClick: shareVerse
      }"
    >
      <h3 class="text-lg font-semibold pb-1">{{ getChapterName(linkHighlight ? firstLang : undefined) + ':' + (selectedHighlightVerse + 1) }}</h3>
      <span class="text-sm mt-3" :style="{
          transition: 'all 0.2s ease',
          backgroundColor: String(getColor()),
          userSelect: 'none',
          cursor: 'pointer'
        }" v-html="getVerse(linkHighlight ? firstLang : undefined)"></span>
      <div v-if="linkHighlight" class="pt-6 pb-1 transition-all duration-300 ease-in-out">
        <h3 class="text-lg font-semibold pb-1">{{ getChapterName(secondLang) + ':' + (selectedHighlightVerse + 1) }}</h3>
        <span class="text-sm mt-3" :style="{
          transition: 'all 0.2s ease',
          backgroundColor: String(getColor()),
          userSelect: 'none',
          cursor: 'pointer'
        }" v-html="getVerse(secondLang)"></span>
      </div>

      <div class="flex overflow-x-auto w-full pt-4 pb-6 items-center">
        <div class="flex items-center h-full pr-3">
          <touch-ripple :duration="200" class="overflow-hidden rounded-full">
            <div
              class="min-w-[3rem] flex items-center justify-center bg-[var(--chapters)] rounded-4xl aspect-square"
              @click="() => { linkHighlight = !linkHighlight; if (linkHighlight) addHighlightWithLink(selectedLang, selectedBook, selectedChapter, selectedHighlightVerse, wasColor)}"
            >
              <i class="fa-solid fa-link" v-if="linkHighlight"></i>
              <i class="fa-solid fa-link-slash" v-else></i>
            </div>
          </touch-ripple>
        </div>
       <div
          v-for="(color, index) in highlightColor"
          :key="color"
          class="flex-shrink-0 w-15 aspect-square rounded-2xl border-[0.1rem] mr-3"
          :style="!index ? { backgroundColor: 'transparent' } : { backgroundColor: color }"
          @click="addHighlightWithLink(selectedLang, selectedBook, selectedChapter, selectedHighlightVerse, index)"
        >
          <touch-ripple :duration="200" class="overflow-hidden rounded-2xl h-full">
            <div class="w-full h-full flex items-center justify-center" v-if="!index">
              <i class="fa-solid fa-xmark"></i>
            </div>
          </touch-ripple>
        </div>
      </div>
    </BottomSheet>

    <Settings v-model="settings"/>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { useStore } from "@/store";
import { useChapters, highlightColor, decodeCBase58 } from '@/scripts/utils';
import Settings from "@/components/Settings.vue";
import BottomSheet from '../components/BottomSheet.vue'
import Verses from '@/components/Verses.vue';
import { TouchRipple } from 'vue-touch-ripple';
import 'vue-touch-ripple/style.css';


const wasColor = ref(0);
const { selectedVerse, selectVerse, selectedHighlightVerse, highlighted, selectedBook, selectedChapter, selectedLang, linkHighlight, showOpacityAnimation, lockedScroll } = useStore();
const { firstLang, secondLang } = useStore();
const { getChapterName, nextChapter, previousChapter, getVerse, shareVerse } = useChapters();
const windowHeight = ref(window.innerHeight);
const settings = ref(false);


const scrollRef1 = ref<HTMLElement | null>(null);
const scrollRef2 = ref<HTMLElement | null>(null);
let isSyncingScroll = false;

function onScroll(scrolledDiv: number) {
  if (isSyncingScroll || !lockedScroll.value) return;

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
  const route = useRoute();
  const router = useRouter();
  let maybeVerse = route.params.verse;
  
  if (typeof maybeVerse === 'string') {
    showOpacityAnimation.value = true;
    router.replace({ path: '/' });
    const { book, chapter, verse } = decodeCBase58(maybeVerse);
    
    selectedBook.value = book;
    selectedChapter.value = chapter;
    selectedVerse.value = verse;
  }

  const updateHeight = () => {
    windowHeight.value = window.innerHeight;
  };

  window.addEventListener("resize", updateHeight);

  updateHeight();

  onUnmounted(() => {
    window.removeEventListener("resize", updateHeight);
  });
});

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

function addHighlight(
  lang: string,
  book: number,
  chapter: number,
  verse: number,
  colorIndex: number | string
) {

  if (typeof colorIndex !== 'number' || colorIndex === 0) {
    const langMap = highlighted.value[lang];
    if (!langMap) return;

    const bookMap = langMap[book];
    if (!bookMap) return;

    const chapterMap = bookMap[chapter];
    if (!chapterMap) return;

    delete chapterMap[verse];

    if (Object.keys(chapterMap).length === 0) {
      delete bookMap[chapter];
    }

    if (Object.keys(bookMap).length === 0) {
      delete langMap[book];
    }

    if (Object.keys(langMap).length === 0) {
      delete highlighted.value[lang];
    }

    return;
  }

  const langMap = highlighted.value[lang] ??= {};
  const bookMap = langMap[book] ??= {};
  const chapterMap = bookMap[chapter] ??= {};

  const now = Date.now();
  chapterMap[verse] = [colorIndex, now];
}

function getColor(index?: boolean) {
  const langHighlights = highlighted.value[selectedLang.value];
  if (!langHighlights) return 'transparent';

  const bookHighlights = langHighlights[selectedBook.value];
  if (!bookHighlights) return 'transparent';

  const chapterHighlights = bookHighlights[selectedChapter.value];
  if (!chapterHighlights) return 'transparent';

  const highlight = chapterHighlights[selectedHighlightVerse.value];
  if (!highlight || !highlight[0]) return index ? 0 : 'transparent';

  const colorIndex = highlight[0];
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
    try {
    wasColor.value = getColor(true) as number;
    } catch (_) {}
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

<style scoped>
.chapters {
  padding-bottom: env(safe-area-inset-bottom);
}
h6 {
  font-family: 'Alice', serif;
  font-weight: 700;
}

</style>
