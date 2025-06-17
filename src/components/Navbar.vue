<template>
  <nav class="bg-blue-600 p-4 text-white shadow-md fixed top-0 left-0 w-full z-10">
    <h1 class="text-xl font-semibold text-center">{{ title }}</h1>
  </nav>
</template>

<script>
export default {
  props: {
    userProfile: {
      type: Object,
      required: true
    }
  },
  props: {
    title: {
      type: String,
      default: 'Aplikasi SaERTE'
    }
  }
};
</script>
