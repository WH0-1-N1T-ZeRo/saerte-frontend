<template>
  <div class="p-6 bg-white rounded-2xl shadow-md max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4 text-center">Edit Profil</h2>

    <DynamicForm
      :fields="userFields"
      :model="localFormData"
      :on-submit="updateProfile"
      :on-cancel="cancelEdit"
      class="grid sm:grid-cols-2 gap-x-4"
    />

    <p v-if="message" class="text-center mt-4" :class="success ? 'text-green-600' : 'text-red-600'">
      {{ message }}
    </p>
  </div>
</template>

<script>
import api from '@/services/api';
import DynamicForm from '@/components/DynamicForm.vue';
import { useUserStore } from '@/stores/user';
import { mapState } from 'pinia'; // Untuk memetakan state Pinia

export default {
  name: 'EditProfile',
  components: { DynamicForm }, // Perhatikan DynamicForm saja
  data() {
    return {
      // localFormData akan menyimpan data yang diikat ke form
      localFormData: {
        nama: '', // Dipetakan dari userProfile.nama
        no_telp: '', // Dipetakan dari userProfile.no_telp
        password: '', // Password baru, mungkin kosong jika tidak ingin diubah
        nik: '', // Dipetakan dari userProfile.nik (No. KTP)
        no_kk: '', // Properti baru untuk No. KK jika ada di API Anda
        hoby: '', // Untuk hobi, mungkin diubah dari array ke string
        interes: '', // Untuk interes, mungkin diubah dari array ke string
      },
      userFields: [
        { name: 'nama', label: 'Nama Lengkap', type: 'text', required: true },
        { name: 'no_telp', label: 'No. Telepon', type: 'text', required: true },
        { name: 'password', label: 'Password Baru', type: 'password' }, // Opsional
        { name: 'nik', label: 'NIK (No. KTP)', type: 'text', required: true },
        { name: 'no_kk', label: 'No. Kartu Keluarga', type: 'text' }, // Asumsi ada field KK
        { name: 'hoby', label: 'Hobi (pisahkan dengan koma)', type: 'text' },
        { name: 'interes', label: 'Minat (pisahkan dengan koma)', type: 'text' },
      ],
      message: '',
      success: false,
    };
  },
  computed: {
    // Memetakan userProfile dari Pinia store ke properti computed
    ...mapState(useUserStore, {
      userProfile: 'getUserProfile',
    }),
  },
  created() {
    // Inisialisasi localFormData dari userProfile yang ada di store
    // Ini penting agar form terisi dengan data pengguna saat ini
    if (this.userProfile) {
      this.localFormData.nama = this.userProfile.nama || '';
      this.localFormData.no_telp = this.userProfile.no_telp || '';
      this.localFormData.nik = this.userProfile.nik || '';
      // Jika hobi dan interes adalah array di store, ubah ke string untuk form input
      this.localFormData.hoby = this.userProfile.hoby ? this.userProfile.hoby.join(', ') : '';
      this.localFormData.interes = this.userProfile.interes ? this.userProfile.interes.join(', ') : '';
      // Asumsi 'no_kk' mungkin akan diisi jika ada di API profil atau default kosong
      this.localFormData.no_kk = this.userProfile.no_kk || '';
      // Password tidak diisi di sini demi keamanan
    }
  },
  methods: {
    async updateProfile() {
      // Pastikan ada token sebelum mencoba update
      const token = localStorage.getItem('authToken');
      if (!token) {
        this.success = false;
        this.message = 'Autentikasi diperlukan. Silakan login kembali.';
        const userStore = useUserStore();
        userStore.logout(); // Logout jika tidak ada token
        this.$router.push({ name: 'Login' });
        return;
      }

      // Buat objek data yang akan dikirim ke API
      const dataToUpdate = {
        name: this.localFormData.nama, // Sesuaikan dengan nama field di API Anda
        telepon: this.localFormData.no_telp, // Sesuaikan dengan nama field di API Anda
        nik_id: this.localFormData.nik, // Sesuaikan dengan nama field di API Anda
        hobby: this.localFormData.hoby, // API mungkin mengharapkan string koma
        interes: this.localFormData.interes, // API mungkin mengharapkan string koma
        // Tambahkan field lain yang relevan seperti no_kk jika API Anda mendukung
        no_kk: this.localFormData.no_kk,
      };

      // Hanya tambahkan password jika pengguna memasukkannya (tidak kosong)
      if (this.localFormData.password) {
        dataToUpdate.password = this.localFormData.password;
      }

      try {
        // Gunakan endpoint PUT atau POST yang sesuai untuk update profil di API Anda
        // Saya asumsikan '/user/profile' bisa digunakan untuk PUT/PATCH update
        const response = await api.put('/user/profile', dataToUpdate, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Panggil fetchUserProfile dari store untuk memperbarui data di seluruh aplikasi
        const userStore = useUserStore();
        await userStore.fetchUserProfile(); // Tunggu hingga data di store terupdate

        this.success = true;
        this.message = 'Profil berhasil diperbarui!';
        // Opsional: reset password field setelah update berhasil
        this.localFormData.password = '';

      } catch (error) {
        console.error('Gagal memperbarui profil:', error.response?.data || error.message);
        this.success = false;
        this.message = `Gagal memperbarui profil: ${error.response?.data?.message || 'Terjadi kesalahan.'}`;

        if (error.response && error.response.status === 401) {
          // Jika token tidak valid, arahkan ke login
          const userStore = useUserStore();
          userStore.logout();
          this.$router.push({ name: 'Login' });
        }
      }
    },
    cancelEdit() {
      // Anda bisa mengembalikan form ke nilai awal dari store
      if (this.userProfile) {
        this.localFormData.nama = this.userProfile.nama || '';
        this.localFormData.no_telp = this.userProfile.no_telp || '';
        this.localFormData.nik = this.userProfile.nik || '';
        this.localFormData.hoby = this.userProfile.hoby ? this.userProfile.hoby.join(', ') : '';
        this.localFormData.interes = this.userProfile.interes ? this.userProfile.interes.join(', ') : '';
        this.localFormData.no_kk = this.userProfile.no_kk || '';
        this.localFormData.password = ''; // Hapus password yang mungkin sudah diketik
      }
      this.message = 'Edit dibatalkan.';
      this.success = false;
    },
  },
};
</script>
