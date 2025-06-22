// src/stores/user.js
import { defineStore } from 'pinia';
import api from '../services/api'; // Pastikan path ke api.js benar

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: {
      no_telp: '',
      id: null,
      nama: 'Guest User',
      nik: '',
      hoby: [],
      interes: [],
      desa: '',
      address: '',
      dataKk: [],
      typeAkses: '',
      color: ['#4A90E2', '#50E3C2', '#F5A623', '#9013FE'],
    },
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    // isLoadingProfile: false, // Opsi untuk menampilkan loading state
  }),
  getters: {
    getUserProfile: (state) => state.profile,
    getIsLoggedIn: (state) => state.isLoggedIn,
  },
  actions: {
    setLoginStatus(status) {
      this.isLoggedIn = status;
      localStorage.setItem('isLoggedIn', status);
    },
    setAuthToken(token) {
      localStorage.setItem('authToken', token);
    },
    clearAuthToken() {
      localStorage.removeItem('authToken');
    },
    // Fungsi untuk memuat profil pengguna dari cache atau API
    async fetchUserProfile() {
      if (!this.isLoggedIn) {
        console.log('Belum login, tidak bisa fetch profil.');
        return;
      }

      // this.isLoadingProfile = true; // Set loading state

      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.warn('Authentication token not found. Cannot fetch user profile.');
        this.logout(); // Otomatis logout jika token tidak ada
        // this.isLoadingProfile = false;
        return;
      }

      // Cek apakah data profil sudah ada di localStorage (cache)
      const cachedProfile = localStorage.getItem('userProfileData');
      if (cachedProfile) {
        try {
          const parsedProfile = JSON.parse(cachedProfile);
          // Hanya gunakan cache jika 'id' profil sudah ada
          if (parsedProfile && parsedProfile.id) {
            this.profile = parsedProfile;
            console.log('User profile loaded from cache.');
            // this.isLoadingProfile = false;
            return;
          }
        } catch (e) {
          console.error('Error parsing cached profile:', e);
          localStorage.removeItem('userProfileData'); // Hapus cache yang rusak
        }
      }

      // Jika tidak ada di cache atau cache rusak, baru fetch dari API
      try {
        const response = await api.get('/user/profile', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const apiData = response.data;
        console.log('Data dari API /profile:', apiData);

        // Memetakan data dari API ke state profil
        this.profile.id = apiData.resident_id;
        this.profile.phone = apiData.resident.phone;
        this.profile.nama = apiData?.name || 'Nama Tidak Diketahui';
        this.profile.nik = apiData.resident?.nik_id || '';
        this.profile.hoby = apiData.resident?.hobby ? apiData.resident.hobby.split(',').map(item => item.trim()) : [];
        this.profile.interes = apiData.resident?.interest ? apiData.resident.interest.split(',').map(item => item.trim()) : [];
        this.profile.alamat = apiData.resident.address;
        this.profile.typeAkses = apiData.waste_bank_id!=null ? 'Pengurus' :'Warga'; // Sesuaikan jika ada logika peran

        // Simpan data profil yang baru diambil ke localStorage
        localStorage.setItem('userProfileData', JSON.stringify(this.profile));

      } catch (error) {
        console.error('Gagal mengambil data user dari API:', error);
        if (error.response && error.response.status === 401) {
          console.log('Token tidak valid atau kadaluarsa. Mengarahkan ke halaman login.');
          this.logout(); // Otomatis logout jika token tidak valid
        }
      } finally {
        // this.isLoadingProfile = false; // Selesai loading
      }
    },
    // Fungsi untuk menangani login
    handleLogin(phoneNumber, token) {
      this.setLoginStatus(true);
      this.setLoggedInPhone(phoneNumber);
      this.setAuthToken(token); // Simpan token yang didapat saat login
      this.fetchUserProfile(); // Panggil fetchUserProfile setelah login berhasil
      // Tidak perlu redirect di store, biarkan komponen yang melakukan itu
    },
    // Fungsi untuk menangani logout
    logout() {
      this.setLoginStatus(false);
      localStorage.removeItem('loggedInPhone');
      this.clearAuthToken();
      localStorage.removeItem('userProfileData'); // Hapus cache profil saat logout
      // Reset userProfile di store
      this.profile = {
        no_telp: '',
        id: null,
        nama: 'Guest User',
        nik: '',
        hoby: [],
        interes: [],
        desa: '',
        address: '',
        dataKk: [],
        typeAkses: '',
        color: ['#4A90E2', '#50E3C2', '#F5A623', '#9013FE'],
      };
      // Tidak perlu redirect di store
    }
  }
});