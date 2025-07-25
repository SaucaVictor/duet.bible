<template>
  <Transition name="pop" v-if="visible">
    <div v-if="!openVerses" class="p-4 h-full flex flex-col w-full" id="chapters">
      <div class="overflow-y-auto flex-grow pb-[4rem] mb-0.2">
        <div
          v-for="(book, index) in filteredBooks"
          :key="book.original"
          ref="bookRefs"
          class="mb-0.5"
        >
          <touch-ripple :duration="200" class="overflow-hidden rounded-lg">
            <button
              class="w-full text-left px-3 py-4 rounded-lg"
              @click="onBookClick(index)"
            >
              {{ book.book }}
            </button>
          </touch-ripple>
          <Transition name="expand" @after-leave="afterLeave">
            <div
              v-if="expandedBookIndex === index"
              class="grid grid-cols-5 gap-2 px-3 py-1 overflow-hidden"
            >
              <button
                v-for="chapter in book.chapters"
                :key="chapter"
                class="rounded-md bg-[var(--chapters)] text-center aspect-square"
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

    <div v-else id="verses" class="w-full px-4 pb-20 overflow-auto max-h-[calc(100vh-3.5rem)]">
      <Transition name="expand">
        <div>
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
      </Transition>
    </div>
  </Transition>

  <div class="fixed top-2 pt-2 w-full bg-inherit flex justify-between">
    <touch-ripple :duration="200" class="overflow-hidden rounded-full mx-3">
      <div class="flex items-center h-full">
        <div
          class="min-w-[3rem] flex items-center justify-center bg-[var(--chapters)] rounded-4xl aspect-square"
          @click="() => { if (openVerses) openVerses = false; else { router.push('/'), store.showOpacityAnimation.value = false; } }"
        >
          <i class="fa-solid fa-angle-left text-xl"></i>
        </div>
      </div>
    </touch-ripple>
    <touch-ripple :duration="200" class="overflow-hidden rounded-full w-full max-w-[calc(100%-9rem)]"v-if="!openVerses">
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
    <touch-ripple :duration="200" class="overflow-hidden rounded-full mx-3" v-if="!openVerses">
      <div class="flex items-center h-full">
        <div
          class="min-w-[3rem] flex items-center justify-center bg-[var(--chapters)] rounded-4xl aspect-square"
          @click="toggleSort"
        >
          <i class="fa-solid fa-arrow-down-a-z text-xl"></i>
        </div>
      </div>
    </touch-ripple>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from "vue";
import { useStore } from "@/store";
import bookChapterCountsJson from "@/bibles/book_chapter_counts.json";
import router from "@/router";
import { useChapters } from "@/scripts/utils";
import { TouchRipple } from 'vue-touch-ripple';
import 'vue-touch-ripple/style.css';

interface BookChapterCounts {
  [lang: string]: {
    book: string;
    chapters: number;
  }[];
}

const store = useStore();
const { getVersesLen, getChapterName } = useChapters();

const expandedBookIndex = ref<number | null>(null);
const nextExpandedBookIndex = ref<number | null>(null);
const bookRefs = ref<(HTMLDivElement | null)[]>([]);
const searchTerm = ref("");
const openVerses = ref(false);
const visible = ref(false);
const sortAlphabetically = ref(false);

const bookChapterCounts = bookChapterCountsJson as BookChapterCounts;

const books = computed(() => {
  const lang = store.firstLang.value;
  const books = bookChapterCounts[lang] || [];
  return books.map((b, original) => ({
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

function onBookClick(originalIndex: number) {
  if (expandedBookIndex.value === originalIndex) {
    expandedBookIndex.value = null;
  } else if (expandedBookIndex.value === null || searchTerm.value) {
    expandedBookIndex.value = originalIndex;
    scrollToBook(originalIndex);
  } else {
    nextExpandedBookIndex.value = originalIndex;
    expandedBookIndex.value = null;
  }
}

function afterLeave() {
  if (nextExpandedBookIndex.value !== null) {
    expandedBookIndex.value = nextExpandedBookIndex.value;
    nextExpandedBookIndex.value = null;
    nextTick(() => {
      scrollToBook(expandedBookIndex.value!);
    });
  }
}

function scrollToBook(index: number) {
  bookRefs.value[index]?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function selectChapter(bookIndex: number, chapter: number) {
  store.selectedBook.value = bookIndex;
  store.selectedChapter.value = chapter;
  console.log(`Selected: Book ${bookIndex} Chapter ${chapter}`);
  openVerses.value = true;
}

onMounted(() => {
  store.showOpacityAnimation.value = true;
  store.selectedVerse.value = 0;
  setTimeout(() => {
    onBookClick(store.selectedBook.value);
  }, 100);
  visible.value = true;
})

function choose(verse: number) {
  store.selectedVerse.value = verse - 1;
  openVerses.value = false;
  router.push('/');
}

function toggleSort() {
  return
  sortAlphabetically.value = !sortAlphabetically.value;
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

#chapters {
  position: fixed;
  top: 3.5rem;
  scroll-margin-top: 60px;
}
#verses {
  position: fixed;
  top: 4.5rem;
  scroll-margin-top: 60px;
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
