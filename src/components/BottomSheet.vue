<template>
  <transition name="backdrop">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-40"
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
      :style="{ transform: `translateY(${translateY}px)`, backgroundColor: 'var(--sheet-bg)' }"
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

        <button 
          @click="close"
          class="mt-4 w-full py-3 px-4 rounded-lg font-medium transition-colors"
          :style="{ 
            backgroundColor: 'var(--button-bg)', 
            color: 'var(--button-text)' 
          }"
        >
          Close
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  closeOnBackdrop?: boolean
  closeThreshold?: number
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

function onTouchStart(event: TouchEvent) {
  if (!props.modelValue || isEntering.value) return

  dragging.value = true
  startY.value = event.touches[0].clientY
  startX.value = event.touches[0].clientX
  translateY.value = 0
}

function onTouchMove(event: TouchEvent) {
  if (!dragging.value || isEntering.value) return

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
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
    isEntering.value = true
    translateY.value = sheet.value?.offsetHeight || 400
    
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
})
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