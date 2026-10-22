<template>
  <Navbar 
    :right-icon="sortAlphabetically ? 'fa-solid fa-book' : 'fa-solid fa-arrow-down-a-z'"
    :rb-click="toggleSort"
    :lb-click="handleBack"
    :rb="!isVerseView"
  >
    <div>
      <touch-ripple :duration="200" class="overflow-hidden rounded-full" v-if="!isVerseView">
        <div class="rounded-4xl bg-[var(--chapters)] flex items-center pr-4">
          <div class="min-w-[3.5rem] flex items-center justify-center">
            <i class="fa-solid fa-search"></i>
          </div>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search"
            class="w-full py-3.5 focus:outline-none h-full"
          />
        </div>
      </touch-ripple>
    </div>
  </Navbar>
  
  <Transition name="pop" v-if="visible">
    <div v-if="!isVerseView" class="px-4 pb-6 h-full flex flex-col w-full fixed">
      <div
        ref="selectorScrollContainer"
        class="overflow-y-auto flex-grow pb-[4rem] mb-0.2"
        @scroll="onScroll"
      >
        <div
          v-for="book in filteredBooks"
          :key="book.original"
          :ref="(el) => setBookRef(el as HTMLDivElement | null, book.original)"
          class="mb-0.5"
        >
          <touch-ripple :duration="200" class="overflow-hidden rounded-lg">
            <button
              class="w-full text-left px-3 py-4 rounded-lg"
              @click="onBookClick(book.original)"
            >
              {{ book.book }}
            </button>
          </touch-ripple>
          <Transition name="expand" @after-leave="afterLeave">
            <div
              v-if="expandedBookIndex === book.original"
              class="grid grid-cols-5 gap-2 px-3 py-1 overflow-hidden"
            >
              <button
                v-for="chapter in book.chapters"
                :key="chapter"
                class="rounded-md text-center aspect-square transition-colors"
                :class="chapter - 1 === store.selectedChapter.value && book.original === store.selectedBook.value
                  ? 'bg-[var(--chapters)] font-bold ring-1 ring-white/40'
                  : 'bg-[var(--chapters)] text-white'"
                @click="selectChapter(book.original, chapter - 1)"
              >
                <touch-ripple :duration="200" class="overflow-hidden h-full text-center flex items-center justify-center rounded-md">
                  <div>
                    {{ chapter }}
                  </div>
                </touch-ripple>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
    <Transition name="expand" v-else>
      <div class="px-4 pb-6 h-full flex flex-col w-full fixed" >
        <div class="overflow-y-auto flex-grow pb-[4rem] mb-0.2">
          <div class="text-center pb-3 font-bold text-2xl">
            {{ getChapterName(store.firstLang.value) }}
          </div>
          <div class="grid grid-cols-5 gap-2 px-3 py-2.5">
            <button
              v-for="verse in getVersesLen()"
              :key="verse"
              class="rounded-md bg-[var(--chapters)] text-center aspect-square"
              @click="choose(verse)"
            >
              <touch-ripple :duration="200" class="overflow-hidden h-full text-center flex items-center justify-center rounded-md">
                <div>
                  {{ verse }}
                </div>
              </touch-ripple>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Transition>
  
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
import bookChapterCountsJson from "@/bibles/book_chapter_counts.json";
import { useChapters } from "@/scripts/utils";
import { TouchRipple } from 'vue-touch-ripple';
import 'vue-touch-ripple/style.css';
import Navbar from "./Navbar.vue";

interface BookChapterCounts {
  [lang: string]: {
    book: string;
    chapters: number;
  }[];
}

const store = useStore();
const route = useRoute();
const router = useRouter();
const { getVersesLen, getChapterName } = useChapters();

const expandedBookIndex = ref<number | null>(null);
const nextExpandedBookIndex = ref<number | null>(null);
const bookRefs = new Map<number, HTMLDivElement>();
const selectorScrollContainer = ref<HTMLDivElement | null>(null);
const savedScrollTop = ref(0);
const searchTerm = ref("");
const visible = ref(false);
const sortAlphabetically = ref(false);

const bookChapterCounts = bookChapterCountsJson as BookChapterCounts;

function validateParams(bookParam: unknown, chapterParam: unknown) {
  if (!bookParam && !chapterParam) {
    return { valid: true, isVerse: false, bookIndex: 0, chapterIndex: 0 };
  }
  if (!bookParam || !chapterParam) {
    return { valid: false, isVerse: false, bookIndex: 0, chapterIndex: 0 };
  }
  const bStr = String(bookParam);
  const cStr = String(chapterParam);
  if (!/^\d+$/.test(bStr) || !/^\d+$/.test(cStr)) {
    return { valid: false, isVerse: false, bookIndex: 0, chapterIndex: 0 };
  }
  const bookNum = parseInt(bStr, 10);
  const chapterNum = parseInt(cStr, 10);
  const lang = store.firstLang.value;
  const list = bookChapterCounts[lang] || [];
  const bookIndex = bookNum - 1;
  if (bookIndex < 0 || bookIndex >= list.length) {
    return { valid: false, isVerse: false, bookIndex: 0, chapterIndex: 0 };
  }
  const maxChapters = list[bookIndex].chapters;
  const chapterIndex = chapterNum - 1;
  if (chapterIndex < 0 || chapterIndex >= maxChapters) {
    return { valid: false, isVerse: false, bookIndex: 0, chapterIndex: 0 };
  }
  return { valid: true, isVerse: true, bookIndex, chapterIndex };
}

const isVerseView = computed(() => {
  const result = validateParams(route.params.book, route.params.chapter);
  return result.valid && result.isVerse;
});

watch(
  () => [route.params.book, route.params.chapter, store.firstLang.value],
  ([bookParam, chapterParam]) => {
    if (route.name !== 'Chapters') return;
    const result = validateParams(bookParam, chapterParam);
    if (!result.valid) {
      router.replace('/chapters');
      return;
    }
    if (result.isVerse) {
      store.selectedBook.value = result.bookIndex;
      store.selectedChapter.value = result.chapterIndex;
      expandedBookIndex.value = result.bookIndex;
    }
  },
  { immediate: true }
);

watch(isVerseView, async (isVerse, wasVerse) => {
  if (!isVerse && wasVerse) {
    await nextTick();
    requestAnimationFrame(() => {
      if (selectorScrollContainer.value) {
        if (savedScrollTop.value > 0) {
          selectorScrollContainer.value.scrollTop = savedScrollTop.value;
        } else {
          scrollToBook(store.selectedBook.value, 'auto');
        }
      }
    });
  }
});

const books = computed(() => {
  const lang = store.firstLang.value;
  const booksList = bookChapterCounts[lang] || [];
  return booksList.map((b, original) => ({
    ...b,
    chapters: b.chapters, 
    original
  }));
});

const filteredBooks = computed(() => {
  let booksList = books.value;

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    booksList = booksList.filter(book => book.book.toLowerCase().includes(term));
  }

  if (sortAlphabetically.value) {
    return [...booksList].sort((a, b) => a.book.localeCompare(b.book, undefined, { sensitivity: 'base' }));
  }

  return booksList;
});

function setBookRef(el: HTMLDivElement | null, originalIndex: number) {
  if (el) {
    bookRefs.set(originalIndex, el);
  } else {
    bookRefs.delete(originalIndex);
  }
}

function scrollToBook(originalIndex: number, behavior: ScrollBehavior = 'smooth') {
  const el = bookRefs.get(originalIndex);
  el?.scrollIntoView({
    behavior,
    block: "start"
  });
}

function onBookClick(originalIndex: number) {
  if (expandedBookIndex.value === originalIndex) {
    expandedBookIndex.value = null;
  } else if (expandedBookIndex.value === null || searchTerm.value) {
    expandedBookIndex.value = originalIndex;
    nextTick(() => {
      scrollToBook(originalIndex);
    });
  } else {
    nextExpandedBookIndex.value = originalIndex;
    expandedBookIndex.value = null;
  }
}

function afterLeave() {
  if (nextExpandedBookIndex.value !== null) {
    const target = nextExpandedBookIndex.value;
    expandedBookIndex.value = target;
    nextExpandedBookIndex.value = null;
    nextTick(() => {
      scrollToBook(target);
    });
  }
}

function selectChapter(bookIndex: number, chapterIndex: number) {
  store.selectedBook.value = bookIndex;
  store.selectedChapter.value = chapterIndex;
  if (selectorScrollContainer.value) {
    savedScrollTop.value = selectorScrollContainer.value.scrollTop;
  }
  router.push(`/chapters/${bookIndex + 1}/${chapterIndex + 1}`);
}

onMounted(async () => {
  store.showOpacityAnimation.value = true;
  if (expandedBookIndex.value === null) {
    expandedBookIndex.value = store.selectedBook.value;
  }
  visible.value = true;
  if (!isVerseView.value) {
    await nextTick();
    scrollToBook(store.selectedBook.value, 'auto');
  }
});

function choose(verse: number) {
  store.selectedVerse.value = verse - 1;
  router.push('/');
}

function toggleSort() {
  sortAlphabetically.value = !sortAlphabetically.value;
  nextTick(() => {
    scrollToBook(expandedBookIndex.value || 0);
  });
}

function handleBack() {
  if (isVerseView.value) {
    if (window.history.state?.back) {
      router.back();
    } else {
      router.replace('/chapters');
    }
  } else {
    store.showOpacityAnimation.value = false;
    if (window.history.state?.back) {
      router.back();
    } else {
      router.push('/');
    }
  }
}

function onScroll(e: Event) {
  const target = e.target as HTMLElement;
  savedScrollTop.value = target.scrollTop;
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1500px;
  opacity: 1;
}

.pop-enter-active,
.pop-leave-active {
  transition: all 0.3s ease;
}

.pop-enter-from {
  transform: scale(0.95);
  opacity: 0;
}

.pop-enter-to {
  transform: scale(1);
  opacity: 1;
}

.pop-leave-from {
  transform: scale(1);
  opacity: 1;
}

.pop-leave-to {
  transform: scale(0.95);
  opacity: 0;
}

</style>
