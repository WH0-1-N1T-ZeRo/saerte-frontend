<template>
  <button
    @click="$emit('click')"
    class="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  >
    <span class="text-sm font-semibold text-gray-700 text-center">{{ title }}</span>
  </button>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
};
</script>
