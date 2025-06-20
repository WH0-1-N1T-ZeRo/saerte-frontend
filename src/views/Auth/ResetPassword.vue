<template>
  <div class="flex flex-col items-center min-h-screen bg-white p-6">
    <div class="w-full max-w-md py-8">

      <div class="flex justify-end items-center mb-6">
        <button class="focus:outline-none" @click="$router.go(-1)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <h2 class="text-2xl font-semibold text-gray-800 text-center mb-6">Reset Kata Sandi</h2>

      <form @submit.prevent="handleResetPassword">
        <div class="mb-4">
          <label for="reset-email" class="block text-left text-gray-700 text-xl font-semibold mb-1">Email</label>
          <input type="email" id="reset-email" v-model="email" required placeholder="email@example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button type="submit"
          class="w-full bg-blue-500 text-white py-3 rounded-md text-xl font-semibold focus:outline-none hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center">
          Kirim Link Reset
        </button>
      </form>

      <p class="mt-6 text-gray-500 text-xl text-center">
        <router-link to="/login" class="text-blue-500 font-semibold focus:outline-none">Kembali ke Login</router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter jika Anda menggunakan router-link

const email = ref('');
const router = useRouter(); // Inisialisasi useRouter

const handleResetPassword = async () => {
  try {
    // Di sini kamu akan memanggil API untuk mengirim link reset password
    // Contoh sederhana:
    alert(`Link reset password akan dikirimkan ke ${email.value}.`);
    // Anda bisa arahkan ke halaman login atau halaman informasi setelah ini
    // router.push('/login'); // Contoh pengalihan ke halaman login
  } catch (error) {
    console.error('Reset password gagal:', error);
    alert('Terjadi kesalahan saat meminta reset password.');
  }
};
</script>

<style scoped>
/* Anda bisa menambahkan styling kustom di sini jika diperlukan */
</style>