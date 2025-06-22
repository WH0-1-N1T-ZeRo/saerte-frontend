<template>
  <!-- Bungkus fixed top nav agar bisa dibatasi lebar -->
  <div class="fixed top-0 left-0 right-0 flex justify-center z-50">
    <nav
      class="w-full max-w-[480px] bg-white text-gray-600 shadow-md p-4 px-8 flex justify-between items-center">
      
      <div class="flex">
        <img src="../assets/logo_1.png" alt="icon" class="w-10" />
        <h1 class="text-xl font-semibold ms-2">{{ title }}</h1>
      </div>
      <a v-if="$route.path !== '/beranda'" @click="goBack" class="cursor-pointer">
        <i class="fas fa-x font-bold"></i>
      </a>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Aplikasi SaERTE'
    }
  },
  methods: {
    goBack() {
      window.history.back();
    }
  }
};
</script>
