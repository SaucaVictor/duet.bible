<template>
  <div class="sticky top-0 z-50 max-w-full w-full flex justify-between items-center ptsafe">
    <div class="py-3 w-full max-w-full flex justify-between items-center">
      <div class=" mx-3" v-if="lb !== undefined ? lb : leftIcon">
        <touch-ripple :duration="200" class="overflow-hidden rounded-full">
          <div class="flex items-center h-full">
            <div
              class="w-[3rem] flex items-center justify-center bg-[var(--chapters)] rounded-full aspect-square"
              @click="handleLeftClick"
            >
              <i :class="leftIcon" class="text-xl"></i>
            </div>
          </div>
        </touch-ripple>
      </div>

      <div class="w-full" :class="{ 'mr-3': !rightIcon && !centerWNoRB }">
        <slot />
      </div>
      <div class="mx-3" v-if="(centerWNoRB ? centerWNoRB : rb !== undefined ? rb : rightIcon) || slotRb" :class="{ 'min-w-[3rem] max-w-[3rem]': centerWNoRB }">
        <touch-ripple :duration="200" class="overflow-hidden rounded-full" v-if="!centerWNoRB">
          <div class="flex items-center h-full">
            <div
              class="w-[3rem] h-[3rem] max-w-[3rem] max-h-[3rem] flex items-center justify-center bg-[var(--chapters)] rounded-full aspect-square"
              @click="rbClick?.()"
            >
              <slot v-if="slotRb" name="slotRb"></slot>
              <i v-else :class="rightIcon" class="text-xl"></i>
            </div>
          </div>
        </touch-ripple>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { TouchRipple } from 'vue-touch-ripple';
import 'vue-touch-ripple/style.css';
import { useStore } from '@/store';

const props = withDefaults(defineProps<{
  lbClick?: () => void,
  rbClick?: () => void,
  leftIcon?: string,
  rightIcon?: string,
  lb?: boolean,
  rb?: boolean,
  centerWNoRB?: boolean,
  toHome?: boolean,
  toCustom?: string,
  slotRb?: boolean
}>(), {
  lb: true,
  leftIcon: 'fa-solid fa-angle-left',
  centerWNoRB: false,
});

const router = useRouter();
const { showOpacityAnimation } = useStore();

function handleLeftClick() {
  console.log('[]')
  if (props.lbClick) {
    props.lbClick();
  } else {
    showOpacityAnimation.value = false;
    if (props.toHome) router.push('/');
    else if (typeof props.toCustom === "string") router.push(props.toCustom);
    else router.back();
  }
}
</script>
