<template>
  <div class="flex flex-col items-center min-h-screen bg-white p-4">
    <div class="w-full max-w-md py-8">

      <div class="flex justify-between items-center mb-6">
        <button class="focus:outline-none" @click="$router.go(-1)"> <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button class="text-sm text-gray-500 focus:outline-none">SKIP</button>
      </div>

      <div class="mb-6">
        <img src="../assets/happy-family.png" alt="Enter Phone Number" class="w-48 mx-auto">
        </div>

      <div v-if="!otpSent">
        <h2 class="text-xl font-semibold text-gray-800 text-center mb-2">Enter your Phone Number</h2>
        <p class="text-gray-600 text-center text-sm mb-4">We will send you the 4 digit verification code</p>

        <div class="mb-4">
          <label for="phone" class="block text-left text-gray-700 text-xs font-semibold mb-1">Mobile</label>
          <div class="flex border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-red-500">
            <div class="px-3 py-2 text-gray-700 text-sm border-r border-gray-300">+62</div>
            <input
              type="tel"
              id="phone"
              v-model="phoneNumber"
              placeholder="9065787380"
              class="flex-1 px-3 py-2 rounded-r-md focus:outline-none text-sm"
              @keyup.enter="requestOtp"
            />
          </div>
          <p v-if="errorMessage" class="text-red-500 text-xs mt-2 text-left">{{ errorMessage }}</p>
        </div>

        <button
          @click="requestOtp"
          :disabled="!isValidPhoneNumber || isLoading"
          class="w-full bg-red-500 text-white py-3 rounded-md text-sm font-semibold focus:outline-none hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span v-if="!isLoading">GENERATE OTP</span>
          <svg v-else class="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </div>

      <div v-if="otpSent">
        <h2 class="text-xl font-semibold text-gray-800 text-center mb-2">OTP Verification</h2>
        <p class="text-gray-600 text-center text-sm mb-4 flex items-center justify-center">
          Enter the OTP sent to +62 {{ formattedPhoneNumber }}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </p>

        <div class="mb-4">
          <div class="flex justify-around space-x-2">
            <input
              v-for="index in 6"
              :key="index"
              :ref="`otpInput${index - 1}`"
              type="tel"
              v-model="otpDigits[index - 1]"
              @input="handleOtpInput(index - 1)"
              @keydown.backspace="handleBackspace(index - 1)"
              maxlength="1"
              class="w-1/5 text-center py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-xl font-bold"
            />
          </div>
          <p v-if="errorMessage" class="text-red-500 text-xs mt-2 text-center">{{ errorMessage }}</p>
        </div>

        <button
          @click="verifyOtp"
          :disabled="otpCode.length !== 6 || isLoading"
          class="w-full bg-red-500 text-white py-3 rounded-md text-sm font-semibold focus:outline-none hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span v-if="!isLoading">VERIFY & CONTINUE</span>
          <svg v-else class="animate-spin h-5 w-5 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>

        <p class="mt-4 text-gray-500 text-xs text-center">
          Didn't receive OTP?
          <button
            @click="resendOtp"
            :disabled="resendTimer > 0 || isLoading"
            class="text-red-500 font-semibold focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            RESEND
            <span v-if="resendTimer > 0"> ({{ resendTimer }}s)</span>
          </button>
        </p>
      </div>

      <div class="mt-8 hidden">
        <div class="relative flex items-center justify-center mb-4">
          <div class="absolute left-0 w-1/3 border-t border-gray-300"></div>
          <span class="mx-2 text-gray-400 text-xs bg-white px-2 z-10">or Sign In using</span>
          <div class="absolute right-0 w-1/3 border-t border-gray-300"></div>
        </div>
        <div class="flex justify-center space-x-4">
          <button class="flex items-center bg-blue-50 text-blue-500 border border-blue-300 rounded-md py-2 px-4 text-xs font-semibold focus:outline-none hover:bg-blue-100 transition duration-200">
            <svg viewBox="0 0 24 24" class="h-4 w-4 mr-2"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.9 3.57 8.91 8.24 9.87V14.67h-2.54V12h2.54V9.77c0-2.52 1.53-3.9 3.77-3.9 1.09 0 2.05.08 2.32.12v2.7h-1.63c-1.27 0-1.52.6-1.52 1.49V12h3.01l-.4 2.67h-2.6V22c4.68-.97 8.24-4.99 8.24-9.87z"/></svg> Facebook
          </button>
          <button class="flex items-center bg-gray-50 text-gray-700 border border-gray-300 rounded-md py-2 px-4 text-xs font-semibold focus:outline-none hover:bg-gray-100 transition duration-200">
            <svg viewBox="0 0 24 24" class="h-4 w-4 mr-2"><path fill="currentColor" d="M12.24 10.29c-.35-.73-.56-1.5-.56-2.29 0-2.42 2.39-4.38 4.78-4.38 2.01 0 3.29.98 3.29 2.12v.11h-2.79c-.06-.52-.45-1.03-.97-1.03-.86 0-1.56.7-1.56 1.56 0 .86.7 1.56 1.56 1.56.45 0 .76-.17.97-.47l.45.42c-.67.65-1.58 1.02-2.39 1.02-2.39 0-4.38-1.96-4.38-4.38zM24 12c0 2.76-1.12 5.26-2.92 7.08L21 20.31c1.88-1.84 3.01-4.3 3.01-7.31zM11.69 19.89c-.19-.48-.31-.99-.31-1.53 0-1.68 1.34-3.05 3-3.05 1.04 0 1.93.53 2.5 1.32l.37.45h-2.81c-.06-.52-.45-1.03-.97-1.03-.86 0-1.56.7-1.56 1.56 0 .86.7 1.56 1.56 1.56.45 0 .76-.17.97-.47l.45.42c-.67.65-1.58 1.02-2.39 1.02-2.39 0-4.38-1.96-4.38-4.38zM20.33 11.21c0-.9-.8-1.6-1.7-1.6h-5.9v2.8h3.4c-.4-.9-1.5-1.4-3-1.4-2.2 0-4 1.8-4 4s1.8 4 4 4c1.6 0 2.8-.6 3.4-1.2h-3.4v-2.8h5.9c.9 0 1.7.7 1.7 1.6 0 2.4-2 3.9-4.5 3.9-2.5 0-4.5-1.5-4.5-3.9s2-3.9 4.5-3.9c1.3 0 2.3.5 3 1.2l2.3-2.3c-1.3-1.1-3-1.8-4.8-1.8-3.9 0-7 3.1-7 7s3.1 7 7 7c3.9 0 7-3.1 7-7 .1 0 0 0 0 0z"/></svg> Google
          </button>
        </div>
      </div>

      <p class="mt-6 text-gray-500 text-xs text-center">
        New User?
        <button class="text-red-500 font-semibold focus:outline-none">REGISTER HERE</button>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../services/api'; // Pastikan path ini benar ke file api.js Anda
import router from '../router'; // Import Vue Router jika Anda menggunakannya untuk navigasi

export default {
  data() {
    return {
      phoneNumber: '',
      otpSent: false,
      otpDigits: ['', '', '', '', '', ''], // Array untuk menyimpan setiap digit OTP
      errorMessage: '',
      // simulatedOtp: '123456', // Ini dihapus karena kita pakai OTP asli dari backend
      isLoading: false,
      resendTimer: 0, //seconds, mulai dari 0 karena akan diset saat OTP dikirim
      timerInterval: null,
    };
  },
  computed: {
    isValidPhoneNumber() {
      // Validasi dasar: harus digit dan antara 10-12 karakter
      return /^\d{10,12}$/.test(this.phoneNumber);
    },
    formattedPhoneNumber() {
      // Contoh format: ambil 4 digit terakhir dan sisanya ditutupi X
      if (this.phoneNumber.length >= 4) {
        return 'XXXXXX' + this.phoneNumber.slice(-4);
      }
      return this.phoneNumber;
    },
    otpCode() {
      // Menggabungkan digit-digit OTP menjadi satu string
      return this.otpDigits.join('');
    },
  },
  methods: {
    async requestOtp() {
      if (!this.isValidPhoneNumber || this.isLoading) {
        this.errorMessage = 'Nomor HP tidak valid. Pastikan 10-12 digit angka.';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';
      this.otpDigits = ['', '', '', '', '', '']; // Hapus OTP sebelumnya
      this.resendTimer = 0; // Reset timer untuk permintaan baru

      try {
        // Panggil endpoint backend untuk request OTP
        const response = await api.post('/auth/request-otp', { phoneNumber: this.phoneNumber });
        // Asumsi backend mengirim pesan sukses di `response.data.message`
        alert(response.data.message || 'OTP berhasil dikirim!');

        this.otpSent = true;
        this.$nextTick(() => {
          // Fokus ke input OTP pertama setelah tampilan diperbarui
          if (this.$refs.otpInput0 && this.$refs.otpInput0[0]) {
            this.$refs.otpInput0[0].focus();
          }
        });
        this.startResendTimer();
        console.log(`Mengirim OTP ke ${this.phoneNumber}`);
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Gagal mengirim OTP. Silakan coba lagi.';
        console.error("Error requesting OTP:", error);
      } finally {
        this.isLoading = false;
      }
    },

    handleOtpInput(index) {
      // Hapus karakter non-digit
      this.otpDigits[index] = this.otpDigits[index].replace(/\D/g, '');

      // Pindah fokus ke input selanjutnya jika digit sudah terisi
      if (this.otpDigits[index] && index < this.otpDigits.length - 1) {
        this.$nextTick(() => {
          if (this.$refs[`otpInput${index + 1}`] && this.$refs[`otpInput${index + 1}`][0]) {
            this.$refs[`otpInput${index + 1}`][0].focus();
          }
        });
      }

      // Jika semua digit terisi, otomatis panggil verifyOtp
      if (this.otpCode.length === 6) {
        this.verifyOtp();
      }
    },

    handleBackspace(index) {
      // Pindah fokus ke input sebelumnya jika menekan backspace pada input kosong
      if (!this.otpDigits[index] && index > 0) {
        this.$nextTick(() => {
          if (this.$refs[`otpInput${index - 1}`] && this.$refs[`otpInput${index - 1}`][0]) {
            this.$refs[`otpInput${index - 1}`][0].focus();
          }
        });
      }
    },

    async verifyOtp() {
      if (this.otpCode.length !== 6 || this.isLoading) {
        // Pesan error sudah dihandle oleh computed property atau input handler,
        // atau jika loading, jangan lakukan apa-apa
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      try {
        // Panggil endpoint backend untuk verifikasi OTP
        const response = await api.post('/auth/verify-otp', {
          phoneNumber: this.phoneNumber,
          otp: this.otpCode, // Gunakan otpCode yang sudah digabung
        });

        const token = response.data.token;
        if (token) {
          localStorage.setItem('authToken', token); // Simpan token ke localStorage
          if (this.timerInterval) clearInterval(this.timerInterval); // Hentikan timer
          alert('Login berhasil!');
          // Emit event untuk komponen induk atau gunakan Vue Router
          this.$emit('login-success', this.phoneNumber);
          if (router) { // Pastikan router terimport dan tersedia
            router.push('/home'); // Ganti dengan path halaman utama Anda
          } else {
            console.warn('Vue Router tidak ditemukan. Pastikan Anda mengimpor dan menggunakannya.');
            // Fallback: reload halaman atau navigasi manual
            window.location.href = '/home';
          }
        } else {
          // Ini seharusnya tidak terjadi jika backend selalu mengembalikan token saat berhasil
          this.errorMessage = 'Login gagal: Token tidak diterima.';
        }
      } catch (error) {
        // Tangani error dari backend (misalnya, OTP salah/kadaluarsa)
        this.errorMessage = error.response?.data?.message || 'Gagal verifikasi OTP. Silakan coba lagi.';
        console.error("Error verifying OTP:", error);
      } finally {
        this.isLoading = false;
      }
    },

    startResendTimer() {
      this.resendTimer = 30; // Atur durasi timer (detik)
      if (this.timerInterval) clearInterval(this.timerInterval); // Hentikan timer yang mungkin sudah berjalan

      this.timerInterval = setInterval(() => {
        if (this.resendTimer > 0) {
          this.resendTimer--;
        } else {
          clearInterval(this.timerInterval);
        }
      }, 1000);
    },

    async resendOtp() {
      if (this.resendTimer > 0 || this.isLoading) return; // Mencegah pengiriman ulang sebelum timer habis atau saat loading

      this.isLoading = true;
      this.errorMessage = '';
      this.otpDigits = ['', '', '', '', '', '']; // Bersihkan field OTP saat kirim ulang

      try {
        // Panggil endpoint backend untuk kirim ulang OTP
        const response = await api.post('/auth/send-otp', { phoneNumber: this.phoneNumber });
        alert(response.data.message || 'OTP berhasil dikirim ulang!');
        this.startResendTimer();
        console.log(`Mengirim ulang OTP ke ${this.phoneNumber}`);
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Gagal mengirim ulang OTP. Silakan coba lagi.';
        console.error("Error resending OTP:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  // Lifecycle hook untuk membersihkan timer jika komponen dihancurkan
  beforeUnmount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
};
</script>

<style scoped>
/* Pastikan Anda sudah menginstal Tailwind CSS */

/* Untuk Animasi Loading Spinner (diperlukan CSS global atau di <style>) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>