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
import api from './services/api'; // Pastikan api.js mengimpor axios dan memiliki base URL yang benar
import axios from 'axios'; // Import axios jika Anda tidak menggunakan instance 'api'

export default {
  components: {
    Navbar,
    BottomNav,
  },
  data() {
    return {
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
      userProfile: {
        // Default / fallback values
        no_telp: localStorage.getItem('loggedInPhone') || '',
        id: null,
        nama: 'Guest User', // Akan diisi dari API, jika ktp_obj tidak null. Jika null, akan tetap default ini.
        nik: '', // Akan diisi dari API (dari KTP), jika ktp_obj tidak null
        // umur: null, // Akan dihitung dari API (dari KTP), jika ktp_obj tidak null
        hoby: [], // Akan diisi dari API
        interes: [], // Akan diisi dari API
        desa: '', // Properti ini tidak ada di contoh API yang diberikan, akan tetap default
        rw: '', // Akan diisi dari API (dari rukunwarga_kd)
        rt: '', // Akan diisi dari API (dari nama_rt)
        noRumah: '', // Properti ini tidak ada di contoh API yang diberikan, akan tetap default
        dataKk: [], // Properti ini tidak ada di contoh API yang diberikan, akan tetap default
        typeAkses: '', // Akan diisi berdasarkan peran pengguna yang mungkin diinfer dari data administrator
        color:['#4A90E2', '#50E3C2', '#F5A623', '#9013FE'], // Contoh warna, bisa tetap di sini
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
      this.fetchUserProfile(); // Panggil fetchUserProfile setelah login berhasil
      this.$router.push({ name: 'Landing' });
    },
    handleLogout() {
      this.isLoggedIn = false;
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loggedInPhone');
      localStorage.removeItem('authToken'); // Hapus token saat logout
      // Reset userProfile saat logout
      this.userProfile = {
        no_telp: '',
        id: null,
        nama: 'Guest User',
        nik: '',
        // umur: null,
        hoby: [],
        interes: [],
        desa: '',
        rw: '',
        rt: '',
        noRumah: '',
        dataKk: [],
        typeAkses: '',
        color:['#4A90E2', '#50E3C2', '#F5A623', '#9013FE'],
      };
      this.$router.push({ name: 'Login' });
    },
    async fetchUserProfile() {
      if (!this.isLoggedIn) {
        return; // Jangan fetch jika belum login
      }

      // Ambil token dari localStorage
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        console.warn('Authentication token not found. Cannot fetch user profile.');
        // Anda mungkin ingin mengarahkan pengguna ke halaman login atau menampilkan pesan
        // this.$router.push({ name: 'Login' });
        return;
      }

      try {
        const response = await api.get('/users/me/', {
          headers: {
            'Authorization': `Bearer ${authToken}` // Tambahkan header Authorization
          }
        });
        const apiData = response.data;
        console.log('Data dari API /users/me/:', apiData);

        // Memetakan data dari API ke userProfile
        this.userProfile.id = apiData.id;
        this.userProfile.no_telp = apiData.telepon || this.userProfile.no_telp;
        this.userProfile.nama = apiData.administrator?.ktp_obj?.nama || 'Nama Tidak Diketahui'; // Akan tetap 'Nama Tidak Diketahui' jika ktp_obj null
        this.userProfile.nik = apiData.administrator?.nik_id || ''; // Akan tetap kosong jika ktp_obj null
        // this.userProfile.golonganDarah = apiData.administrator?.ktp_obj?.gol_darah || ''; // Akan tetap kosong jika ktp_obj null

        // Hitung umur jika tgl_lahir tersedia dari ktp_obj, jika ktp_obj null maka umur akan null
        // if (apiData.administrator?.ktp_obj?.tgl_lahir) {
        //   const birthDate = new Date(apiData.administrator.ktp_obj.tgl_lahir);
        //   const today = new Date();
        //   let age = today.getFullYear() - birthDate.getFullYear();
        //   const m = today.getMonth() - birthDate.getMonth();
        //   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        //     age--;
        //   }
        //   this.userProfile.umur = age;
        // } else {
        //   this.userProfile.umur = null;
        // }

        // Memisahkan string hobi dan interes menjadi array
        this.userProfile.hoby = apiData.administrator?.hobby ? apiData.administrator.hobby.split(',').map(item => item.trim()) : [];
        this.userProfile.interes = apiData.administrator?.interes ? apiData.administrator.interes.split(',').map(item => item.trim()) : [];

        // Pemetaan untuk RT dan RW berdasarkan contoh API baru
        this.userProfile.rw = apiData.rukunwarga_kd || ''; // Menggunakan rukunwarga_kd sebagai RW
        this.userProfile.rt = apiData.nama_rt || ''; // Menggunakan nama_rt sebagai RT

        // Properti 'desa', 'noRumah', dan 'dataKk' tidak ada di contoh API yang Anda berikan,
        // jadi mereka akan tetap menggunakan nilai default yang ada di 'data()'.
        // this.userProfile.desa = apiData.desa || '';
        // this.userProfile.noRumah = apiData.noRumah || '';
        // this.userProfile.dataKk = apiData.data_kk || [];

        // Contoh bagaimana menentukan typeAkses. Karena tidak ada flag eksplisit di API,
        // Anda mungkin perlu logika yang lebih kompleks atau menambahkan flag di backend.
        // Untuk saat ini, akan tetap sebagai "Warga" atau berdasarkan logika yang Anda miliki.
        // Misalnya, jika ada administrator_id, mungkin bisa dianggap "Warga" default.
        this.userProfile.typeAkses = 'Warga'; // Default ke Warga
        // Anda bisa menambahkan logika di sini jika ada indikator lain dari peran di API data
        // if (apiData.is_ketua) { this.userProfile.typeAkses = 'Ketua'; }
        // else if (apiData.is_sekretaris) { this.userProfile.typeAkses = 'Sekretaris'; }
        // else if (apiData.is_bendahara) { this.userProfile.typeAkses = 'Bendahara'; }

      } catch (error) {
        console.error('Gagal mengambil data user dari API:', error);
        // Pertimbangkan untuk menampilkan pesan error kepada pengguna
        // Jika error 401 (Unauthorized), mungkin token sudah kadaluarsa atau tidak valid
        if (error.response && error.response.status === 401) {
          console.log('Token tidak valid atau kadaluarsa. Mengarahkan ke halaman login.');
          this.handleLogout(); // Secara otomatis logout jika token tidak valid
        }
      }
    }
  },
  mounted() {
    // Panggil fetchUserProfile saat komponen dimuat, jika sudah login
    if (this.isLoggedIn) {
      this.fetchUserProfile();
    }
  }
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
