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
  const raw = localStorage.getItem(key) || fallback;
  return raw;
}

store.firstLang.value = loadLang('firstLang', 'ro');
store.secondLang.value = loadLang('secondLang', 'no');

const sv1 = localStorage.getItem('showVerses1stLang');
const sv2 = localStorage.getItem('showVerses2stLang');
store.showVerses1stLang.value = sv1 ? JSON.parse(sv1) : true;
store.showVerses2stLang.value = sv2 ? JSON.parse(sv2) : true;
</script>