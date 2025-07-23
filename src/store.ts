import { inject, provide, ref, type Ref } from "vue";

const STORE_KEY = Symbol("BibleStore");

export function createStore() {
  const firstLang = ref("ro");
  const secondLang = ref("no");
  const selectedBook = ref(0);
  const selectedChapter = ref(0);
  const selectedVerse = ref(0);
  const selectVerse = ref(false);
  const selectedHighlightVerse = ref(0);
  const selectedLang = ref('');
  const linkHighlight = ref(false);

  const highlighted: Ref<{ [lang: string]: { [book: number]: { [chapter: number]: {[verseNumber: number]: number;} } } }> = ref({});
  return {
    firstLang,
    secondLang,
    selectedBook,
    selectedChapter,
    selectedVerse,
    selectVerse,
    selectedHighlightVerse,
    highlighted,
    selectedLang,
    linkHighlight
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
