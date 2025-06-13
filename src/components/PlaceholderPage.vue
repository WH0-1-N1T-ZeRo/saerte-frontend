<template>
  <div class="px-4 bg-gray-100 min-h-full flex items-center justify-center text-center">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
      <i :class="icon" class="text-blue-500 text-5xl mb-4"></i>
      <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ pageTitle }}</h2>
      <p class="text-gray-600">{{ description }}</p>
      <p class="text-sm text-gray-400 mt-4">(Fitur ini akan dikembangkan lebih lanjut)</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageTitle: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'fas fa-cogs' // Default icon for "under development"
    },
    description: {
      type: String,
      default: 'Halaman ini sedang dalam tahap pengembangan.'
    }
  },
};
</script>
