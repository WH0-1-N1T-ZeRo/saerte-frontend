<template>
  <div class="flex flex-col items-center min-h-screen bg-white p-6">
    <div class="w-full max-w-md">

      <!-- Header -->
      <div class="flex justify-end items-center">
        <routerLink class="focus:outline-none" to="/">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </routerLink>
        <!-- <button class="text-md text-gray-500 focus:outline-none">SKIP</button> -->
      </div>

      <!-- Image -->
      <div class="mb-6">
        <img src="@/assets/logo_2.png" alt="Login Illustration" class="w-48 mx-auto">
      </div>

      <!-- Login Form -->
      <!-- <h2 class="text-md font-semibold text-gray-800 text-center mb-2">Login to Your Account</h2>
      <p class="text-gray-600 text-center text-md mb-4">Enter your email and password to continue</p> -->

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="uname" class="block text-left text-gray-700 text-md font-semibold mb-1">Akun</label>
          <input type="text" id="uname" v-model="email" placeholder="Username-xxx"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="mb-4 relative">
          <label for="password" class="block text-left text-gray-700 text-md font-semibold mb-1">Sandi</label>
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

        <div class="flex justify-between">
          <div class="">
            <p v-if="errorMessage" class="text-red-500 text-md mt-1 mb-3">{{ errorMessage }}</p>
          </div>
          <a href="/lupa-sandi" class="text-blue-500 text-md mt-1 mb-3">Lupa Sandi?</a>
        </div>

        <button type="submit" :disabled="!isValid || isLoading"
          class="w-full bg-blue-500 text-white py-3 rounded-md text-md font-semibold focus:outline-none hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center">
          <span v-if="!isLoading">LOGIN</span>
          <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </button>
      </form>

      <p class="mt-6 text-gray-500 text-md text-center">
        Belum punya akun?
        <a href="/register" class="text-blue-500 font-semibold focus:outline-none">Daftar Disini</a>
      </p>

      <!-- <div class="mt-8">
        <div class="relative flex items-center justify-center mb-4">
          <div class="absolute left-0 w-1/3 border-t border-gray-300"></div>
          <span class="mx-2 text-gray-400 text-md bg-white px-2 z-10">or Sign In using</span>
          <div class="absolute right-0 w-1/3 border-t border-gray-300"></div>
        </div>
        <div class="flex justify-center space-x-4">
          <button
            class="flex items-center bg-blue-50 text-blue-500 border border-blue-300 rounded-md py-2 px-4 text-md font-semibold focus:outline-none hover:bg-blue-100 transition duration-200">
            <svg viewBox="0 0 24 24" class="h-4 w-4 mr-2">
              <path fill="currentColor"
                d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.9 3.57 8.91 8.24 9.87V14.67h-2.54V12h2.54V9.77c0-2.52 1.53-3.9 3.77-3.9 1.09 0 2.05.08 2.32.12v2.7h-1.63c-1.27 0-1.52.6-1.52 1.49V12h3.01l-.4 2.67h-2.6V22c4.68-.97 8.24-4.99 8.24-9.87z" />
            </svg> Facebook
          </button>
          <button @click="$emit('switch-view', 'otp')" class="flex items-center bg-gray-50 text-gray-500 border border-gray-300 rounded-md py-2 px-4 text-md font-semibold focus:outline-none hover:bg-blue-100 transition duration-200"><i class="fas fa-phone mr-2"></i>
 Phone</button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      errorMessage: '',
      showPassword: false
    }
  },
  computed: {
    isValid() {
      return this.email && this.password.length >= 6
    }
  },
  methods: { 
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      this.errorMessage = ''
      this.isLoading = true
      try {
        const response = await api.post('/auth/login', {
          uname: this.email,
          pswrd: this.password
        }, {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })

        const token = response.data.access_token
        if (token) {
          localStorage.setItem('authToken', token)
          console.log(token)
          localStorage.setItem('isLoggedIn', 'true')
          this.$router.push('/beranda') // Arahkan ke halaman dashboard
        } else {
          this.errorMessage = 'Token tidak ada.'
        }

      } catch (err) {
        this.errorMessage = err.response?.data?.detail || 'Data login salah.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
