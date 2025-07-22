import { inject, provide, ref } from "vue";

const STORE_KEY = Symbol("BibleStore");

export function createStore() {
  const firstLang = ref("ro");
  const secondLang = ref("no");
  const selectedBook = ref(0);
  const selectedChapter = ref(0);
  const selectedVerse = ref(0);
  const selectVerse = ref(false);
  const selectedHighlightVerse = ref(0);
  const selectedHighlightVerseText = ref('');
  const selectedHighlightVerseTitle = ref('');
  
  return {
    firstLang,
    secondLang,
    selectedBook,
    selectedChapter,
    selectedVerse,
    selectVerse,
    selectedHighlightVerse,
    selectedHighlightVerseText,
    selectedHighlightVerseTitle
  };
}

export type Store = ReturnType<typeof createStore>;

export function provideStore() {
  const store = createStore();
  provide(STORE_KEY, store);
  return store;
}

export function useStore(): Store {
  const store = inject<Store>(STORE_KEY);
  if (!store) {
    throw new Error("BibleStore not provided");
  }
  return store;
}
