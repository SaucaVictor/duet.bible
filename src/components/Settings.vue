<template>
  <BottomSheet v-model="modelValue" full :manualToggle="manualClose" noShare>
    <div class="text-center text-5xl pt-6">
      <h6>duet.bible</h6>
    </div>
    <div
      class="justify-center h-full transition-all duration-300 ease-in-out mt-10"
      :class="{ 'flex overflow-hidden': !openLangChooser, 'max-sm:flex-col sm:flex': openLangChooser }"
    >
      <div :class="{'flex': openLangChooser}">
        <div
          class="bg-[var(--chapters)] rounded-xl flex items-center transition-all duration-300 ease-in-out justify-center"
        >
          <div class="p-3.5 flex flex-col items-center">
            <touch-ripple :duration="200" class="overflow-hidden rounded-md ">
              <div
                class="rounded-lg w-16 cursor-pointer h-10 justify-center items-center flex select-none bg-amber-200"
                @click="openLangChooser = !openLangChooser"
              >
                <img :src="icons[firstLang]" class="h-16" />
              </div>
            </touch-ripple>
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
            <touch-ripple :duration="200" class="overflow-hidden rounded-md ">
              <div
                class="rounded-lg w-16 cursor-pointer h-10 justify-center items-center flex select-none bg-amber-200"
                @click="openLangChooser = !openLangChooser"
              >
                <img :src="icons[secondLang]" class="h-16" />
              </div>
            </touch-ripple>
          </div>
        </div>
        <div class=" flex items-center justify-center transition-width duration-300 ease-in-out"
        :class="{ 'w-0 overflow-hidden h-0': !openLangChooser, 'w-full pl-3 h-auto overflow-hidden': openLangChooser }">
          <div
            class="bg-[var(--chapters)] rounded-xl flex flex-col items-center transition-all duration-300 ease-in-out w-full h-full justify-center"
          >
            <div class="flex overflow-x-auto overflow-y-hidden flex-nowrap">
              <div
                v-for="lang in availableLang"
                :key="lang"
              >
                <touch-ripple :duration="200" class="overflow-hidden rounded-md ">
                  <div
                    class="rounded-lg w-16 cursor-pointer h-10 justify-center items-center flex select-none bg-amber-200"
                    @click="firstLang = lang"
                  >
                    <img :src="icons[lang]" class="h-16" />
                  </div>
                </touch-ripple>
              </div>
            </div>
            <div class="py-1">
              <touch-ripple :duration="200" class="overflow-hidden rounded-full">
                <div class="flex items-center min-h-12 justify-center py-1 text-2xl text-[var(--chapter)]" @click="openLangChooser = false">
                  <i class="fa-solid fa-xmark"></i>
                </div>
              </touch-ripple>
            </div>
            <div class="flex overflow-x-auto overflow-y-hidden flex-nowrap">
              <div
                v-for="lang in availableLang"
                :key="lang"
              >
                <touch-ripple :duration="200" class="overflow-hidden rounded-md ">
                  <div
                    class="rounded-lg w-16 cursor-pointer h-10 justify-center items-center flex select-none bg-amber-200"
                    @click="firstLang = lang"
                  >
                    <img :src="icons[lang]" class="h-16" />
                  </div>
                </touch-ripple>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="w-full transition-all duration-300 ease-in-out flex"
        :class="{ 'ml-3': !openLangChooser, 'mt-3 sm:ml-3': openLangChooser }"
      >
        <div v-if="openLangChooser" class="pr-3 min-h-full">
          <div
              class="rounded-lg h-full w-16 cursor-pointer justify-center items-center select-none"
            >
              <touch-ripple :duration="200" class="overflow-hidden rounded-xl w-full bg-[var(--chapters)]">
                <div
                  class="bg-[var(--chapters)] flex items-center justify-center min-h-42"
                  @click="installApp"
                >
                  <i class="fa-solid fa-download"></i>
                </div>
              </touch-ripple>
            </div>
        </div>
        <div class="w-full">
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
            <div class="flex w-full mr-0 pl-2.5">
              <touch-ripple :duration="200" class="overflow-hidden rounded-xl w-full bg-[var(--chapters)]">
                <div
                  class="bg-[var(--chapters)] flex items-center justify-center h-full min-w-full"
                  @click="share('📖🤩Check out duet.bible!', '', 'https://duetbible.web.app/')"
                >
                  <i class="fa-solid fa-share-nodes"></i>
                </div>
              </touch-ripple>
            </div>
          </div>
          <div class="bg-[var(--chapters)] rounded-xl w-full mt-3 h-24">
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
    </div>
    <div class="pt-3 flex" v-if="!openLangChooser">
      <div class="flex w-full mr-0">
        <touch-ripple :duration="200" class="overflow-hidden rounded-xl w-full bg-[var(--chapters)]">
          <div
            class="bg-[var(--chapters)] flex items-center justify-center h-full min-w-full"
            @click="getRandomVerse(), random= true"
          >
            <i class="fa-solid fa-shuffle"></i>
          </div>
        </touch-ripple>
      </div>
      <div
        class="rounded-lg h-15 aspect-square cursor-pointer justify-center items-center select-none ml-2.5"
      >
        <touch-ripple :duration="200" class="overflow-hidden rounded-xl w-full bg-[var(--chapters)]">
          <div
            class="bg-[var(--chapters)] flex items-center justify-center aspect-square"
            @click="installApp"
          >
            <i class="fa-solid fa-download"></i>
          </div>
        </touch-ripple>
      </div>
    </div>
  </BottomSheet>
  <BottomSheet v-model="random" :manual-toggle="manualClose" :z="50" noShare>
    
    <div
      class="pl-2 pr-2 bg-[var(--saved)] mt-3 rounded-lg py-1 select-none relative"
      @click="goToRandom()"
    >
      <div class="flex items-center">
        <div class="rounded-lg w-5 cursor-pointer justify-center items-center flex select-none">
          <img :src="icons[firstLang]" />
        </div>
        <div
          class="text-md font-bold pl-2 truncate"
        >
          {{ getChapterName(firstLang, randomVerse[0], randomVerse[1]) }} : {{ randomVerse[2] + 1 }}
        </div>
      </div>
      <div
        class="text-sm pt-1.5 pr-1 break-words pl-2"
        v-html="getVerse(firstLang, randomVerse[0], randomVerse[1], randomVerse[2])"
      ></div>

      <div class="flex items-center pt-3">
        <div class="rounded-lg w-5 cursor-pointer justify-center items-center flex select-none">
          <img :src="icons[secondLang]" />
        </div>
        <div
          class="text-md font-bold pl-2 truncate"
        >
          {{ getChapterName(secondLang, randomVerse[0], randomVerse[1]) }} : {{ randomVerse[2] + 1 }}
        </div>
      </div>
      <div
        class="text-sm pt-1.5 pr-1 break-words pl-2"
        v-html="getVerse(secondLang, randomVerse[0], randomVerse[1], randomVerse[2])"
      >
      </div>
      <div class="absolute top-2 right-2 text-sm text-[var(--text-muted)]">
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </div>
    </div>
  </BottomSheet>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useStore, icons } from '@/store';
import { share } from '@/scripts/utils';
import { TouchRipple } from 'vue-touch-ripple';
import 'vue-touch-ripple/style.css';
import BottomSheet from '@/components/BottomSheet.vue';
import { useRouter } from 'vue-router';
import { useChapters } from '@/scripts/utils';
const modelValue = defineModel<boolean>({ default: false })

const { firstLang, secondLang, lockedScroll, randomVerse, selectedVerse } = useStore();
const openLangChooser = ref(false);
const { getRandomVerse, getVerse, goToVerse, getChapterName } = useChapters();

const router = useRouter();

function swap() {
  const l = firstLang.value;
  firstLang.value = secondLang.value;
  secondLang.value = l;
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

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
  }

let deferredPrompt: BeforeInstallPromptEvent | null = null

const isIos = (): boolean => {
  return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
}

const isInStandaloneMode = (): boolean => {
  return 'standalone' in window.navigator && (window.navigator as any).standalone
}

const showInstall = ref(false)
const isIosDevice = ref(false)

const installApp = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('App installed')
    } else {
      console.log('Install dismissed')
    }
    deferredPrompt = null
  } else if (isIosDevice.value) {
    alert (
      'Looks like you are on not on a Android device, so to install this app:\n' +
      '> iPhone (Apple devices, use Safari): \n' +
      '1. Tap the Share icon\n' +
      '2. Tap "Add to Home Screen\n\n' +
      '> Android (if it doesn\'t work the first time, use Google Chrome): \n' +
      '1. Tap the Tree dots (top right)\n' +
      '2. Tap "Add to Home Screen"'
    );
  } else {
    alert('Install not available');
  }
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    showInstall.value = true;
  })

  if (isIos() && !isInStandaloneMode()) {
    isIosDevice.value = true;
    showInstall.value = true;
  }
})
const manualClose = ref(false);
function goToRandom() {
  manualClose.value = !manualClose.value;
  setTimeout(() => { goToVerse(randomVerse.value[0], randomVerse.value[1], randomVerse.value[2]) }, 400);
}
const random = ref(false);
</script>

<style scoped>
h6 {
  font-family: 'Alice', serif;
  font-weight: 700;
}
</style>