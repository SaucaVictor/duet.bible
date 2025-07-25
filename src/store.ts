import { inject, provide, ref, type Ref } from "vue";

const STORE_KEY = Symbol("BibleStore");

export function createStore() {
  const firstLang = ref("ro");
  const secondLang = ref("no");
  const selectedBook = ref(39);
  const selectedChapter = ref(0);
  const selectedVerse = ref(0);
  const selectVerse = ref(false);
  const selectedHighlightVerse = ref(0);
  const selectedLang = ref('');
  const linkHighlight = ref(false);
  const showOpacityAnimation = ref(false);
  const lockedScroll = ref(true);
  const randomVerse: Ref<[number, number, number]> = ref([0, 0, 0]);

  const highlighted: Ref<{ [lang: string]: { [book: number]: { [chapter: number]: {[verseNumber: number]: [number, number]} } } }> = ref({});
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
    linkHighlight,
    showOpacityAnimation,
    lockedScroll,
    randomVerse
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

export const icons: Record<string, string> = {
  'ro': "https://cdn-icons-png.flaticon.com/512/330/330576.png",
  'no': "https://cdn-icons-png.flaticon.com/512/330/330542.png",
  'en': "https://cdn-icons-png.flaticon.com/128/330/330425.png",
  // "https://cdn-icons-png.flaticon.com/512/330/330557.png",
  // "https://cdn-icons-png.flaticon.com/512/330/330523.png"
};