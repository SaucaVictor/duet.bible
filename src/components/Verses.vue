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
      class="verse-wrapper"
      :style="{ marginBottom: '0.3rem', display: 'flex', alignItems: 'flex-start' }"
      ref="verseSpans"
    >
      <span
        class="verse-number text-center pr-1"
        :style="{ color: 'var(--verse-number-color)', userSelect: 'none' }"
      >
        {{ verse.verse }}
      </span>

      <span
        class="verse-text pl-2"
        :style="{
          transition: 'all 0.2s ease',
          backgroundColor: selectedVerses.has(index)
            ? 'var(--verse-selected-bg)'
            : 'transparent',
          userSelect: 'none',
          cursor: 'pointer',
        }"
        @click="toggleVerse(index, verse.text, getChapterName(lang))"
      >
        {{ verse.text }}
      </span>
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
import { useChapters } from "@/scripts/utils";
import { useStore } from "@/store";

const store = useStore();
const { secondLang, selectedVerse, selectVerse, selectedHighlightVerse, selectedHighlightVerseText, selectedHighlightVerseTitle } = store;
const { getVerses, getDisclaimer, getChapterName } = useChapters();

const props = defineProps<{ lang: string }>();

const verses = computed(() => {
  const rawVerses = getVerses(props.lang) as string[];
  if (!Array.isArray(rawVerses)) return [];
  return rawVerses.map((text, i) => ({ verse: i + 1, text }));
});

const selectedVerses = ref(new Set<number>());

function toggleVerse(index: number, t: string, title: string) {
  if (selectedVerses.value.has(index)) selectedVerses.value.delete(index);
  else selectedVerses.value.add(index);
  selectVerse.value = true;
  selectedHighlightVerse.value = index;
  selectedHighlightVerseText.value = t;
  selectedHighlightVerseTitle.value = title;
}

const verseSpans = ref<HTMLElement[]>([]);

onMounted(()=>{
  const el = verseSpans.value[selectedVerse.value];
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})
</script>
