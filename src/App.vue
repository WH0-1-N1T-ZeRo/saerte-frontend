<template>
  <div class="app-container min-h-screen bg-gray-100 flex flex-col">
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

export default {
  components: {
    Navbar,
    BottomNav,
  },
  data() {
    return {
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
      userProfile: {
        no_telp: localStorage.getItem('loggedInPhone') || '',
        nama: 'Ahmad Fauzi',
        gender: 'Pria',
        umur: 30,
        pekerjaan: 'Pengembang Web',
        golonganDarah: 'A',
        hoby: ['Membaca', 'Coding', 'Olahraga'],
        interes: ['Teknologi', 'Komunitas', 'Lingkungan'],
        desa: 'Karangsari',
        rw: '001',
        rt: '002',
        noRumah: '15',
        dataKk: [
          { nama: 'Siti Aminah', status: 'Istri', nik: '3501xxxxxxxxxxxx' },
          { nama: 'Budi Santoso', status: 'Anak', nik: '3501xxxxxxxxxxxx' }
        ],
        typeAkses: 'Warga' || 'Ketua' || 'Serkertaris' || 'Bendahara', // Default type, can be changed based on user role
      },
    };
  },
  created() {
    if (!this.isLoggedIn && this.$route.name !== 'Login') {
      this.$router.push({ name: 'Login' });
    } else if (this.isLoggedIn && this.$route.name === 'Login') {
      this.$router.push({ name: 'Landing' });
    }
  },
  methods: {
    handleLoginSuccess(phoneNumber) {
      this.isLoggedIn = true;
      this.userProfile.no_telp = phoneNumber;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedInPhone', phoneNumber);
      this.$router.push({ name: 'Landing' });
    },
    handleLogout() {
      this.isLoggedIn = false;
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loggedInPhone');
      this.$router.push({ name: 'Login' });
    }
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
