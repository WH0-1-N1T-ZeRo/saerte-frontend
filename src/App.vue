<template>
  <div class="app-container min-h-screen bg-gray-100 flex flex-col p-0 m-0">
    <Navbar v-if="isLoggedIn" :title="$route.meta.title" />

    <main class="flex-grow overflow-auto" :class="{'pt-16': isLoggedIn, 'pb-16': isLoggedIn}">
      <router-view :userProfile="userProfile" @login-success="handleLoginSuccess" @logout="handleLogout" />
    </main>

    <BottomNav v-if="isLoggedIn && $route.name !== 'Login'" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import BottomNav from './components/BottomNav.vue';
import { useUserStore } from './stores/user'; // Import store Pinia
import { mapState } from 'pinia'; // Helper untuk memetakan state Pinia

export default {
  components: {
    Navbar,
    BottomNav,
  },
  computed: {
    // Memetakan state dari Pinia store
    ...mapState(useUserStore, {
      isLoggedIn: 'getIsLoggedIn',
      userProfile: 'getUserProfile',
    }),
    // Logic untuk menampilkan Navbar dan BottomNav
    showNavbarAndBottomNav() {
      // Sembunyikan Nav jika rute adalah 'Login' atau 'Register' (jika ada)
      return this.$route.name !== 'Login'; // Anda bisa menambahkan rute lain di sini
    }
  },
  created() {
    // Menggunakan action dari Pinia store
    const userStore = useUserStore();

    // Redirect jika belum login atau sudah login tapi di halaman login
    // if (!this.isLoggedIn && this.$route.name !== 'Login') {
    //   this.$router.push({ name: 'Login' });
    // } else if (this.isLoggedIn && this.$route.name === 'Login') {
    //   this.$router.push({ name: 'Landing' });
    // }

    // Panggil fetchUserProfile saat aplikasi dimuat, agar data profil tersedia
    // Ini akan menggunakan cache jika ada, atau fetch dari API jika tidak ada/diperlukan.
    if (this.isLoggedIn) {
      userStore.fetchUserProfile();
    }
  },
  watch: {
    // Awasi perubahan rute untuk mungkin memicu fetch profil jika diperlukan
    // Misalnya, jika pengguna langsung masuk ke halaman non-login setelah refresh
    '$route.name': {
      immediate: true, // Jalankan watch saat komponen pertama kali dimuat
      handler(newRouteName) {
        const userStore = useUserStore();
        if (userStore.getIsLoggedIn && userStore.getUserProfile.id === null) {
          // Jika sudah login tapi profil belum terisi (mungkin setelah hard refresh)
          userStore.fetchUserProfile();
        }
      }
    }
  },
  methods: {
    // Panggil aksi dari Pinia store
    handleLoginSuccess(data) {
      const userStore = useUserStore();
      userStore.handleLogin(data.phoneNumber, data.authToken); // Pastikan login success memberikan token
      this.$router.push({ name: 'Landing' });
    },
    handleLogout() {
      const userStore = useUserStore();
      userStore.logout();
      this.$router.push({ name: 'Login' });
    },
  },
};
</script>

<style>
/* Global styles from src/assets/main.css will apply */
/* No specific style tag here, relying on Tailwind */
/* Ensure html and body take full height for flex-grow to work */
html, body {
  height: 100%;
}
#app {
  height: 100%;
}
</style>
