<template>
  <div class="flex flex-col items-center min-h-screen bg-white p-6">
    <div class="w-full max-w-md">

      <!-- Header -->
      <div class="flex justify-end items-center">
        <button class="focus:outline-none" @click="$router.go(-1)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <!-- <button class="text-sm text-gray-500 focus:outline-none">SKIP</button> -->
      </div>

      <!-- Image -->
      <div class="mb-6">
        <img src="@/assets/logo_2.png" alt="Register" class="w-48 mx-auto">
      </div>

      <!-- Form -->
      <!-- <h2 class="text-xl font-semibold text-gray-800 text-center mb-2">Create your account</h2>
      <p class="text-gray-600 text-center text-sm mb-4">Please fill in the information below</p> -->

      <div class="space-y-4">
        <!-- Name -->
        <div>
          <label for="name" class="block text-left text-gray-700 text-xs font-semibold mb-1">Nama</label>
          <input id="name" v-model="name" type="text" placeholder="Fahmi Nur"
            class="w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <!-- Phone -->
        <div>
          <label for="phone" class="block text-left text-gray-700 text-xs font-semibold mb-1">Telepon</label>
          <div class="flex border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
            <div class="px-3 py-2 text-gray-700 text-sm border-r border-gray-300">+62</div>
            <input id="phone" v-model="phone" type="tel" placeholder="08xxxxxxxxx"
              class="flex-1 px-3 py-2 rounded-r-md focus:outline-none text-sm" />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-left text-gray-700 text-xs font-semibold mb-1">Sandi</label>
          <div class="relative w-full">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" placeholder="********"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <!-- Toggle Icon -->
            <button type="button" @click="togglePassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <button @click="submitRegister"
        class="mt-6 w-full bg-blue-500 text-white py-3 rounded-md text-sm font-semibold focus:outline-none hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center">
        REGISTER
      </button>

      <!-- Login Link -->
      <p class="mt-6 text-gray-500 text-xs text-center">
        Already have an account?
        <router-link to="/login" class="text-blue-500 font-semibold">LOGIN</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'RegisterLayout',
  data() {
    return {
      name: '',
      phone: '',
      password: '',
      showPassword:false
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async submitRegister() {
      // Validasi data terlebih dahulu
      if (!this.name || !this.phone || !this.password) {
        alert("Semua field wajib diisi!");
        return;
      }

      try {
        const response = await api.post("/user/register", {
          //fname: this.name,
          uname: this.name,
          pswrd: this.password
        });

        console.log("Register sukses:", response.data);
        // Redirect atau notifikasi sukses
      } catch (error) {
        console.error("Gagal register:", error);
        alert("Terjadi kesalahan saat mendaftar.");
      }
    }
  }
};

</script>
