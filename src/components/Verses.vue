<template>
  <div class="pb-[10rem]"  :class="{'pb-[7rem]': lang === secondLang}"
    :style="{
      paddingInline: '0.75rem',
      lineHeight: '1.6'
    }"
  >
    <div
      v-for="(verse, index) in verses"
      :key="index"
      class="verse-wrapper"
      :style="{ 
        marginBottom: '0.3rem',
        display: 'flex',
        alignItems: 'flex-start',
      }"
    >
      <span 
        class="verse-number text-center pr-1"
        :style="{
          color: 'var(--verse-number-color)',
          userSelect: 'none'
        }"
      >
        {{ verse.verse }}
      </span>
      
      <span
        class="verse-text pl-2"
        :style="{
          transition: 'all 0.2s ease',
          backgroundColor: selectedVerses.has(index) ? 'var(--verse-selected-bg)' : 'transparent',
          userSelect: 'none'
        }"
        @click="toggleVerse(index)"
        @touchstart="toggleVerse(index)"
      >
        {{ verse.text }}
      </span>
    </div>
    <div class="text-center opacity-30 text-[0.6rem] pt-4 w-full flex items-center justify-center">
      <div class="max-w-40">
      {{ getDisclaimer(lang) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useChapters } from "@/scripts/utils";
import { useStore } from "@/store";
const { secondLang } = useStore();
const { getVerses, getDisclaimer } = useChapters();

const props = defineProps<{
  lang: string
}>();

const verses = computed(() => {
  const rawVerses = getVerses(props.lang) as string[];

  if (!Array.isArray(rawVerses)) return [];

  return rawVerses.map((verseData: string, index: number) => ({
    verse: index + 1,
    text: verseData,
  }));
});


const selectedVerses = ref(new Set<number>());

function toggleVerse(index: number) {
  if (selectedVerses.value.has(index)) {
    selectedVerses.value.delete(index);
  } else {
    selectedVerses.value.add(index);
  }
}
</script>