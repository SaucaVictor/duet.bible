<template>
  <BottomSheet v-model="modelValue" full>
    <div class="text-center text-5xl pt-6">
      <h6>duet.bible</h6>
    </div>
    <div
      class="justify-center max-h-55 h-full transition-all duration-300 ease-in-out mt-10"
      :class="{ 'flex overflow-hidden': !openLangChooser, 'max-sm:flex-col sm:flex': openLangChooser }"
    >
      <div
        ref="langBox"
        class="bg-[var(--chapters)] rounded-xl flex items-center transition-all duration-300 ease-in-out"
        :class="{ 'w-[33%] justify-center': !openLangChooser, 'w-full': openLangChooser }"
      >
        <div ref="selected" class="p-2">
          <div
            class="rounded-lg w-20 cursor-pointer h-12 justify-center items-center flex select-none"
            @click="() => { openLangChooser = !openLangChooser; getSpace(); }"
          >
            <img :src="icons[firstLang]" class="h-15" />
          </div>
          <div class="flex items-center justify-center py-1">
            <touch-ripple :duration="200" class="overflow-hidden rounded-full">
              <div
                class="bg-[var(--chapters)] w-12 flex items-center justify-center aspect-square rounded-full"
                @click="swap"
              >
                <i class="fa-solid fa-right-left transform rotate-90"></i>
              </div>
            </touch-ripple>
          </div>
          <div
            class="rounded-lg w-20 cursor-pointer h-12 justify-center items-center flex select-none"
            @click="() => { openLangChooser = !openLangChooser; getSpace(); }"
          >
            <img :src="icons[secondLang]" class="h-15" />
          </div>
        </div>
        <div
          ref="sepBar"
          class="flex items-center min-h-full justify-center"
          :class="{ 'w-0 overflow-hidden': !openLangChooser, 'px-2': openLangChooser }"
        >
          <div
            class="bg-[var(--txt)] min-h-36 w-1 flex items-center justify-center rounded-full opacity-30"
          ></div>
        </div>
        <div
          :class="{ 'w-0 overflow-hidden': !openLangChooser, 'w-full pl-5 flex-col items-center': openLangChooser }"
        >
          <div class="flex overflow-x-auto overflow-y-hidden flex-nowrap">
            <div
              class="rounded-lg min-w-15 max-w-15 max-h-10 mr-2 cursor-pointer items-center flex select-none"
              v-for="lang in availableLang"
              :key="lang"
              @click="firstLang = lang"
            >
              <img :src="icons[lang]" class="h-15" />
            </div>
          </div>
          <div class="py-2 pr-4">
            <touch-ripple :duration="200" class="overflow-hidden rounded-full">
              <div class="flex items-center min-h-12 justify-center py-1 text-2xl text-[var(--chapter)]" @click="openLangChooser = false">
                <i class="fa-solid fa-xmark"></i>
              </div>
            </touch-ripple>
          </div>
          <div class="flex overflow-x-auto overflow-y-hidden flex-nowrap">
            <div
              class="rounded-lg min-w-15 max-w-15 max-h-10 mr-2 cursor-pointer items-center flex select-none"
              v-for="lang in availableLang"
              :key="lang + '2'"
              @click="secondLang = lang"
            >
              <img :src="icons[lang]" class="h-15" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="w-full min-h-full transition-all duration-300 ease-in-out"
        :class="{ 'ml-3': !openLangChooser, 'mt-2.5 sm:ml-3': openLangChooser }"
      >
        <div class="flex min-h-12 min-w-full">
          <div
            class="rounded-lg h-15 aspect-square cursor-pointer justify-center items-center select-none"
          >
            <touch-ripple :duration="200" class="overflow-hidden rounded-xl w-full bg-[var(--chapters)]">
              <div
                class="bg-[var(--chapters)] flex items-center justify-center aspect-square"
                @click="lockedScroll = !lockedScroll"
              >
                <i class="fa-solid fa-lock" v-if="lockedScroll"></i>
                <i class="fa-solid fa-lock-open" v-else></i>
              </div>
            </touch-ripple>
          </div>
          <div class="flex w-full mr-0 h-15 pl-2">
            <touch-ripple :duration="200" class="overflow-hidden rounded-xl w-full h-full bg-[var(--chapters)]">
              <div
                class="bg-[var(--chapters)] flex items-center justify-center h-full min-w-full"
                @click="share('📖🤩Check out duet.bible!', '', 'https://duetbible.web.app/')"
              >
                <i class="fa-solid fa-share-nodes"></i>
              </div>
            </touch-ripple>
          </div>
        </div>
        <div class="bg-[var(--chapters)] rounded-xl w-full mt-3 h-25">
          <div class="rounded-lg cursor-pointer justify-center items-center flex select-none w-full h-full">
            <touch-ripple :duration="200" class="overflow-hidden rounded-xl w-full h-full">
              <div
                class="bg-[var(--chapters)] flex items-center justify-center w-full h-full text-xl"
                @click="router.push('/saved')"
              >
                <i class="fa-solid fa-bookmark"></i>
                <i class="fa-solid fa-book-bible pl-3"></i>
              </div>
            </touch-ripple>
          </div>
        </div>
      </div>
    </div>
  </BottomSheet>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useStore, icons } from '@/store';
import { share } from '@/scripts/utils';
import { TouchRipple } from 'vue-touch-ripple';
import 'vue-touch-ripple/style.css';
import BottomSheet from '@/components/BottomSheet.vue';
import { useRouter } from 'vue-router';

const modelValue = defineModel<boolean>({ default: false })

const { firstLang, secondLang, lockedScroll } = useStore();
const openLangChooser = ref(false);
const langBox = ref<HTMLElement | null>(null);
const selected = ref<HTMLElement | null>(null);
const sepBar = ref<HTMLElement | null>(null);
const router = useRouter();

function swap() {
  const l = firstLang.value;
  firstLang.value = secondLang.value;
  secondLang.value = l;
}

function getSpace() {
  if (langBox.value) {
    console.log('Lang box width:', langBox.value.getBoundingClientRect().width);
  }
}

const availableLang = computed(() => {
  return Object.keys(icons).filter(
    (lang) => lang !== firstLang.value && lang !== secondLang.value
  );
});

watch(firstLang, (newVal) => {
  localStorage.setItem('firstLang', newVal);
}, { immediate: true });

watch(secondLang, (newVal) => {
  localStorage.setItem('secondLang', newVal);
}, { immediate: true });

watch(modelValue, () => {
  openLangChooser.value = false;   
});
</script>

<style scoped>
h6 {
  font-family: 'Alice', serif;
  font-weight: 700;
}
</style>