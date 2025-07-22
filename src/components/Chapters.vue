<template>
  <div class="p-4 h-full flex flex-col w-full" id="chapters">
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
  <div class="fixed top-2 pt-2 left-3 right-3 bg-inherit">
    <div class="rounded-4xl bg-[var(--chapters)] flex items-center">
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
import { ref, computed, nextTick } from "vue";
import { useStore } from "@/store";
import bookChapterCountsJson from "@/bibles/book_chapter_counts.json";
import router from "@/router";

interface BookChapterCounts {
  [lang: string]: {
    book: string;
    chapters: number;
  }[];
}

const store = useStore();

const expandedBookIndex = ref<number | null>(null);
const nextExpandedBookIndex = ref<number | null>(null);
const bookRefs = ref<HTMLDivElement[]>([]);
const searchTerm = ref("");

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
</style>
