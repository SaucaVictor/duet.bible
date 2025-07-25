<template>
  <transition name="backdrop">
    <div
      v-if="modelValue"
      class="fixed inset-0" 
      :class="[`z-${z ?? 40}`]"
      :style="{ backgroundColor: 'var(--backdrop-color)' }"
      @click="handleBackdropClick"
    />
  </transition>

  <transition name="slide-up" @after-leave="resetPosition">
    <div
      v-if="modelValue"
      ref="sheet"
      class="fixed bottom-0 inset-x-0 rounded-t-2xl shadow-xl z-50 touch-pan-y"
      :class="{ 'transition-transform duration-300 ease-out': !dragging || isEntering }"
      :style="{ transform: `translateY(${translateY}px)`, backgroundColor: 'var(--sheet-bg)',  height: full ? `${windowHeight}px` : '' }"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <div class="flex items-center justify-center py-3">
        <div class="w-12 h-1 rounded-full" :style="{ backgroundColor: 'var(--handle-color)' }" />
      </div>

      <div class="px-6 pb-6">
        <slot>
          <p class="text-center py-8" :style="{ color: 'var(--text-muted)' }">
            No content provided.
          </p>
        </slot>
        <div
          class="overflow-y-auto max-h-[60vh] -mx-6 px-6 mb-4"
          @touchmove.stop
          @wheel.stop
        >
          <slot name="scrollable" ></slot>
        </div>
        <div class="flex">
          <button v-if="!full"
            @click="close"
            class="mt-4 w-full py-3 px-4 rounded-lg font-medium transition-colors"
            :style="{ 
              backgroundColor: 'var(--button-bg)', 
              color: 'var(--button-text)' 
            }"
          >
            Close
          </button>
          <div class="mt-4 ml-2">
          <touch-ripple :duration="200" class="overflow-hidden rounded-lg">
            <div v-if="!noShare"
              @click="shareVerse"
              class="rounded-lg font-medium transition-colors py-3 px-4.5"
              :style="{ 
                backgroundColor: 'var(--button-bg)', 
                color: 'var(--button-text)' 
              }"
            >
              <i class="fa-solid fa-share-nodes"></i>
            </div>
          </touch-ripple></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useChapters, encodeCBase58, share } from '@/scripts/utils';
import { useStore } from '@/store';
import { TouchRipple } from 'vue-touch-ripple';
import 'vue-touch-ripple/style.css';

const { getChapterName } = useChapters();
const { selectedBook, selectedChapter, selectedHighlightVerse } = useStore();

const props = withDefaults(defineProps<{
  modelValue: boolean;
  closeOnBackdrop?: boolean;
  closeThreshold?: number;
  full?: boolean;
  manualToggle?: boolean;
  z?: number;
  noShare?: boolean;
}>(), {
  closeOnBackdrop: true,
  closeThreshold: 100
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const sheet = ref<HTMLElement | null>(null)
const startY = ref(0)
const translateY = ref(0)
const isEntering = ref(false)
const dragging = ref(false)
const startX = ref(0)
const windowHeight = ref(window.innerHeight * 0.95);

function onTouchStart(event: TouchEvent) {
  if (!props.modelValue || isEntering.value) return
  //preventTouchMove(event);
  dragging.value = true
  startY.value = event.touches[0].clientY
  startX.value = event.touches[0].clientX
  translateY.value = 0
}

function onTouchMove(event: TouchEvent) {
  if (!dragging.value || isEntering.value) return
  preventTouchMove(event);
  const currentY = event.touches[0].clientY
  const currentX = event.touches[0].clientX

  const deltaY = currentY - startY.value
  const deltaX = Math.abs(currentX - startX.value)

  const threshold = 10
  if (deltaX > deltaY && deltaX > threshold) {
    dragging.value = false
    resetPosition()
    return
  }

  if (deltaY > 0) {
    translateY.value = deltaY
  }
}


function onTouchEnd() {
  if (!dragging.value) return
  
  dragging.value = false
  
  if (translateY.value > props.closeThreshold) {
    close()
  } else {
    resetPosition()
  }
}

function resetPosition() {
  translateY.value = 0
}

function close() {
  translateY.value = sheet.value?.offsetHeight || 400
  
  setTimeout(() => {
    emit('update:modelValue', false)
  }, 50)
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    close()
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  const updateHeight = () => {
    windowHeight.value = window.innerHeight * 0.95;
  };

  window.addEventListener("resize", updateHeight);

  updateHeight();

  onUnmounted(() => {
    window.removeEventListener("resize", updateHeight);
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
  });
});

watch(() => props.modelValue, (isOpen) => {
  try {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      isEntering.value = true

      translateY.value = props.full ? windowHeight.value : (sheet.value?.offsetHeight || 400)

      setTimeout(() => {
        translateY.value = 0
        setTimeout(() => {
          isEntering.value = false
        }, 300)
      }, 50)
    } else {
      document.body.style.overflow = ''
      isEntering.value = false
    }
  } catch (_) {}
});

watch(() => props.manualToggle, (newV, oldV) => {
  if (newV !== oldV) {
    close();
  }
});

function preventTouchMove(event: TouchEvent) {
  if (props.modelValue) {
    event.preventDefault();
  }
}



function shareVerse(){
  const t = getChapterName() + ':' + (selectedHighlightVerse.value + 1);
  const l = 'https://duetbible.web.app/' + encodeCBase58(selectedBook.value, selectedChapter.value, selectedHighlightVerse.value)
  share(t, '', l);
}
</script>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.touch-pan-y {
  touch-action: pan-y;
}
</style>