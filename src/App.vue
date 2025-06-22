<template>
  <div class="app-container min-h-screen bg-gray-100 flex flex-col p-0 m-0">
    <!-- Navbar hanya muncul jika login dan bukan halaman login -->
    <Navbar v-if="isLoggedIn && showNavbarAndBottomNav" :title="$route.meta.title" />

    <!-- Main content -->
    <main class="flex-grow overflow-auto" :class="{ 'pt-16': isLoggedIn, 'pb-16': isLoggedIn }">
      <router-view
        :userProfile="userProfile"
        @login-success="handleLoginSuccess"
        @logout="handleLogout"
      />
    </main>

    <!-- BottomNav hanya muncul jika login dan bukan halaman login -->
    <BottomNav v-if="isLoggedIn && showNavbarAndBottomNav" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import BottomNav from './components/BottomNav.vue';
import { useUserStore } from './stores/user';
import { mapState } from 'pinia';

export default {
  name: 'App',
  components: {
    Navbar,
    BottomNav,
  },
  computed: {
    // Ambil data dari Pinia store
    ...mapState(useUserStore, {
      isLoggedIn: 'getIsLoggedIn',
      userProfile: 'getUserProfile',
    }),
    // Digunakan untuk menyembunyikan Nav di halaman login
    showNavbarAndBottomNav() {
      return this.$route.name !== 'Login' && this.$route.name !== 'Register';
    },
  },
  created() {
    const userStore = useUserStore();

    // Coba isi userProfile jika belum ada (misalnya reload halaman)
    if (this.isLoggedIn && !this.userProfile?.id) {
      userStore.fetchUserProfile();
    }

    // Redirect user jika status login dan halaman tidak sinkron
    // if (!this.isLoggedIn && this.$route.name !== 'Login') {
    //   this.$router.replace({ name: 'Login' });
    // } else if (this.isLoggedIn && this.$route.name === 'Login') {
    //   this.$router.replace({ name: 'Beranda' });
    // }
  },
  watch: {
    '$route.name': function () {
      const userStore = useUserStore();
      if (this.isLoggedIn && !this.userProfile?.id) {
        userStore.fetchUserProfile();
      }
    }
  },
  methods: {
    handleLoginSuccess(data) {
      const userStore = useUserStore();
      userStore.handleLogin(data.phoneNumber, data.authToken);
      this.$router.push({ name: 'Beranda' });
    },
    handleLogout() {
      const userStore = useUserStore();
      userStore.logout();
      this.$router.push({ name: 'Login' });
    }
  },
};
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  height: 100%;
}
</style>
