<template>
  <router-view />
</template>
<script setup lang="ts">
import { provideStore } from "@/store";

const store = provideStore();
const saved = localStorage.getItem('highlighted');
if (saved) {
  try {
    store.highlighted.value = JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse saved highlights:', e);
  }
}

store.selectedBook.value = Number(localStorage.getItem('selectedBook')) || 39;
store.selectedChapter.value = Number(localStorage.getItem('selectedChapter')) || 0;
function loadLang(key: string, fallback: string) {
  const raw = localStorage.getItem(key);
  try {
    const parsed = JSON.parse(raw ?? '""');
    return typeof parsed === 'string' ? parsed : fallback;
  } catch {
    return raw || fallback;
  }
}

store.firstLang.value = loadLang('firstLang', 'ro');
store.secondLang.value = loadLang('secondLang', 'no');
</script>