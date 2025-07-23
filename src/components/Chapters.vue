<template>
  <div class="p-4 h-full flex flex-col w-full" v-if="!openVerses" id="chapters">
    <div class="overflow-y-auto flex-grow pb-[4rem] mb-0.2">
      <div
        v-for="(book, index) in filteredBooks"
        :key="index"
        ref="bookRefs"
        class="mb-0.5"
      >
        <button
          class="w-full text-left px-3 py-4 rounded-lg"
          @click="onBookClick(index)"
        >
          {{ book.book }}
        </button>

        <Transition name="expand" @after-leave="afterLeave">
          <div
            v-if="expandedBookIndex === index"
            class="grid grid-cols-5 gap-2 px-3 py-1 overflow-hidden"
          >
            <button
              v-for="chapter in book.chapters"
              :key="chapter"
              class="rounded-md bg-[var(--chapters)] text-center aspect-square"
              @click="selectChapter(index, chapter - 1)"
            >
              {{ chapter }}
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
  <div
  v-else
    id="verses"
    class="w-full px-4 pb-20 overflow-auto max-h-[calc(100vh-3.5rem)]"
  >
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
            {{ verse }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
  <div class="fixed top-2 pt-2 left-3 right-3 bg-inherit flex" >
    <div class="flex items-center h-full pr-3">
      <div
        class="min-w-[3rem] flex items-center justify-center bg-[var(--chapters)] rounded-4xl aspect-square"
        @click="() => { if (openVerses) openVerses = false; else router.push('/') }"
      >
        <i class="fa-solid fa-angle-left text-xl"></i>
      </div>
    </div>
    <div class="rounded-4xl bg-[var(--chapters)] flex items-center" v-if="!openVerses">
      <div class=" min-w-[3.5rem] flex items-center justify-center">
        <i class="fa-solid fa-search"></i>
      </div>
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Search"
        class="w-full pr-3 py-3.5 focus:outline-none h-full"
      />
    </div>
  </div>
 
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import { useStore } from "@/store";
import bookChapterCountsJson from "@/bibles/book_chapter_counts.json";
import router from "@/router";
import { useChapters } from "@/scripts/utils";

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
const bookRefs = ref<HTMLDivElement[]>([]);
const searchTerm = ref("");
const openVerses = ref(false);

const bookChapterCounts = bookChapterCountsJson as BookChapterCounts;

const books = computed(() => {
  const lang = store.firstLang.value;
  const books = bookChapterCounts[lang] || [];
  return books.map(b => ({
    ...b,
    chapters: Array.from({ length: b.chapters }, (_, i) => i + 1)
  }));
});

const filteredBooks = computed(() => {
  if (!searchTerm.value) return books.value;
  const term = searchTerm.value.toLowerCase();
  return books.value.filter(book => book.book.toLowerCase().includes(term));
});

function onBookClick(index: number) {
  if (expandedBookIndex.value === index) {
    expandedBookIndex.value = null;
  } else if (expandedBookIndex.value === null) {
    expandedBookIndex.value = index;
    scrollToBook(index);
  } else {
    nextExpandedBookIndex.value = index;
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
  store.selectedVerse.value = 0;
  setTimeout(() => {
    onBookClick(store.selectedBook.value);
  }, 100);
})

function choose(verse: number) {
  store.selectedVerse.value = verse - 1;
  openVerses.value = false;
  router.push('/');
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
</style>
