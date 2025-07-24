<template>
  <div
    class="pb-[1rem]"
    :style="{ paddingInline: '0.75rem', lineHeight: '1.6' }"
  >
    <div class="text-center pt-7 pb-5 font-bold text-2xl">
      {{ getChapterName(lang) }}
    </div>
    <div
      v-for="(verse, index) in verses"
      :key="index"
      class="verse-wrapper pl-2"
      :style="{ marginBottom: '0.5rem' }"
      ref="verseSpans"
    >
      <span
        class="verse-number"
        :style="{
          userSelect: 'none',
          marginRight: '0.4rem'
        }"
      >
        {{ verse.verse }}.
      </span>
      <span
        class="verse-text"
        :style="{
          transition: 'all 0.2s ease',
          backgroundColor: getColor(index),
          userSelect: 'none',
          cursor: 'pointer'
        }"
        @click="toggleVerse(index)"
        v-html="verse.text"
      ></span>
    </div>

    <div
      class="text-center opacity-30 text-[0.6rem] pt-4 w-full flex items-center justify-center"
    >
      <div class="max-w-40">{{ getDisclaimer(lang) }}</div>
    </div>
  </div>
  <br />
  
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useChapters, highlightColor } from "@/scripts/utils";
import { useStore } from "@/store";

const store = useStore();
const { selectedVerse, selectVerse, selectedHighlightVerse, highlighted, selectedBook, selectedChapter, selectedLang } = store;
const { getVerses, getDisclaimer, getChapterName } = useChapters();

const props = defineProps<{ lang: string }>();

const verses = computed(() => {
  const rawVerses = getVerses(props.lang) as string[];
  if (!Array.isArray(rawVerses)) return [];
  return rawVerses.map((text, i) => ({
    verse: i + 1,
    text: text.replace(/<wj>(.*?)<\/wj>/g, '<span class="wj">$1</span>')
  }));
});

const selectedVerses = ref(new Set<number>());

function toggleVerse(index: number) {
  try {
    if (selectedVerses.value.has(index)) selectedVerses.value.delete(index);
    else selectedVerses.value.add(index);
    selectVerse.value = true;
    selectedHighlightVerse.value = index;
    selectedLang.value = props.lang;
  } catch (_) {}
}

const verseSpans = ref<(HTMLDivElement | null)[]>([]);

onMounted(()=>{
  const el = verseSpans.value[selectedVerse.value];
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})

function getColor(index: number) {
  const langHighlights = highlighted.value[props.lang];
  if (!langHighlights) return 'transparent';

  const bookHighlights = langHighlights[selectedBook.value];
  if (!bookHighlights) return 'transparent';

  const chapterHighlights = bookHighlights[selectedChapter.value];
  if (!chapterHighlights) return 'transparent';

  if (!chapterHighlights[index]) return 'transparent';

  const colorIndex = chapterHighlights[index][0];
  return highlightColor[colorIndex] ?? 'transparent';
}
</script>