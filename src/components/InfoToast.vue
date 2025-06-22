<!-- components/Toast.vue -->
<template>
  <transition name="fade">
    <div class="fixed bottom-17 right-17 flex justify-end z-10">
      <div v-if="visible"
        class="bottom-4 max-w-[480px] right-4 bg-yellow-50 border border-yellow-200 rounded-md p-3 shadow-lg w-[300px] z-50">
        <div class="flex items-start space-x-2">
          <svg class="w-5 h-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd" />
          </svg>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-blue-800">{{ title }}</h3>
            <p class="text-md text-blue-700 mt-1 leading-snug">{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  title: String,
  message: String,
  duration: {
    type: Number,
    default: 3000
  },
  show: Boolean
})

const visible = ref(false)

watch(() => props.show, (val) => {
  if (val) {
    visible.value = true
    setTimeout(() => {
      visible.value = false
    }, props.duration)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>