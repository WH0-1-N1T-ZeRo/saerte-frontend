<template>
  <DynamicForm :fields="userFields" :model="existingUserData" :on-submit="createData" :on-cancel="cancelEdit"
    class="grid sm:grid-cols-2 gap-x-4" />
</template>

<script>
import DynamicForm from '@/components/DynamicForm.vue'
import { generateMonthYearOptions } from '@/utils/otomation_fuction.js';
import api from '../../services/api';
import router from '@/router';
 
export default {
  components: {
    DynamicForm
  },
  data() {
    this.monthYearOptions = generateMonthYearOptions(2025, 2025); // Dari Januari 2023 sampai Desember 2025
    // console.log(this.monthYearOptions);
    return {
      // Contoh data yang akan diedit. Ini akan menjadi prop 'model'
      existingUserData: {
        id: 1,
        periode: 'Juni 2025',
        tanggal: '2025-06-15',
        jumlah: 50.000,
        deskripsi: 'Seorang pengembang web yang antusias.',
        metodePembayaran: 'QRIS',
      },
      // Definisi field untuk form Anda
      userFields: [
        { name: 'id', label: 'Nomor', type: 'int' },
        { name: 'periode', label: 'Periode', type: 'select', options: this.monthYearOptions },
        { name: 'tanggal', label: 'Tanggal', type: 'date' },
        { name: 'jumlah', label: 'Jumlah Pembayaran', type: 'number' },
        { name: 'metodePembayaran', label: 'Metode Pembayaran', type: 'select', options: ['QRIS', 'E-Wallet', 'Cash'] },
        { name: 'deskripsi', label: 'Description', type: 'textarea' },
      ],
      token: localStorage.getItem('authToken')
    };
  },
  methods: {
    async createData(data) {
      console.log('Data yang diperbarui:', data);
      const request = await api.post("/iuran/", {
        akun_id: 1, // ID akun bisa tetap integer
        status: "Pending", // string tetap
        referensi: String(data.id), // pastikan string
        tangal: String(data.tanggal),     // format: 'YYYY-MM-DD'
        warga_id: 1,   // pastikan integer
        jenis: String(data.metodePembayaran),
        nominal: Number(data.jumlah),      // pastikan integer
        keterangan: String(data.deskripsi),
        bukti_id: 1 // atau Number(data.bukti_id) jika dari input
      }, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });



      // Lakukan panggilan API untuk memperbarui data
      // Contoh: axios.put(`/api/users/${data.id}`, data)
      alert('Buat data Berhasil!');
      // Mungkin arahkan pengguna kembali setelah update
      router.push('/iuran-warga');
    },
    cancelEdit() {
      this.$router.push('/iuran-warga');  // Ganti dengan rute yang sesuai untuk kembali ke daftar pengguna
    }
  },
  mounted() {
    // Dalam aplikasi nyata, Anda akan mengambil existingUserData dari API
    // misalnya: this.existingUserData = await fetchUserData(this.$route.params.id);
  }
};
</script>
