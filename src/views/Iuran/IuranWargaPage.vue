<template>
  <div class="bg-gray-100 min-h-full">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <!-- <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Status Iuran Warga</h2> -->

      <div class="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg text-center shadow-sm">
        <p class="text-blue-700 text-lg mb-1">Iuran Bulan {{ currentMonthFormatted }}:</p>
        <p class="text-2xl font-bold" :class="{ 'text-green-600': isPaidThisMonth, 'text-red-600': !isPaidThisMonth }">
          {{ isPaidThisMonth ? 'Lunas!' : 'Belum Lunas' }}
        </p>
      </div>

      <div class="mb-6">
        <!-- <h3 class="text-xl font-semibold text-gray-700 mb-4">Riwayat Pembayaran Iuran</h3> -->
        <div class="overflow-x-auto">
          <div class="space-y-4">
            <router-link v-for="iuran in sortedIuranData" :key="iuran.id" :to="`/iuran/new`" custom>
              <!-- <div 
                class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative"> -->
              <div
                class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                @mousedown="startPress(iuran.id)" @mouseup="cancelPress" @mouseleave="cancelPress">
                <!-- Isi iuran -->
                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-sm font-semibold text-gray-700">{{ iuran.bulan }}</h3>
                  <div class="flex justify-between items-center">
                  <h3 class="text-sm font-semibold text-gray-800"></h3>
                  <span :class="{
                    'bg-green-100 text-gray-800': iuran.status === 'Validate',
                    'bg-red-100 text-gray-800': iuran.status === 'Pending',
                    'bg-gray-100 text-gray-800': iuran.status === 'Draft',
                  }" class="px-2 py-0.5 rounded-full text-xs font-semibold uppercase">
                    {{ iuran.status }}
                  </span>
                </div>
                </div>
                

                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-sm font-semibold text-gray-700">Jumlah</h3>
                  <span class="text-sm text-green-700 font-bold">{{ iuran.jumlah.toLocaleString('id-ID') }}</span>
                </div>

                <div class="flex justify-between items-center mb-2">
                  <h3 class="text-sm font-semibold text-gray-700">Tanggal Bayar</h3>
                  <span class="text-sm text-gray-600">{{ iuran.tanggalBayar || '-' }}</span>
                </div>

                

                <!-- Tombol hapus -->
                <div v-if="deleteMode && selectedId === iuran.id"
                  class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-xl gap-4">
                  <button @click="hapusIuran(iuran.id)"
                    class="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition">
                    Hapus Iuran
                  </button>
                  <button @click="deleteMode = false; selectedId = null"
                    class="bg-gray-800 text-white px-3 py-2 rounded shadow">
                    Batal
                  </button>
                  <button @click="editIuraan(iuran.id); selectedId = null"
                    class="bg-yellow-800 text-white px-3 py-2 rounded shadow">
                    Edit data
                  </button>
                </div>
              </div>
            </router-link>


            <!-- Pesan jika kosong -->
            <div v-if="iuranData.length === 0" class="text-center text-gray-500 text-sm py-6">
              Belum ada riwayat iuran.
            </div>
          </div>

        </div>
      </div>

      <div v-if="!isPaidThisMonth" class="mt-6 hidden">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Bayar Iuran Sekarang</h3>
        <p class="text-gray-600 text-sm mb-4">Pilih metode pembayaran:</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button @click="payWithQRIS"
            class="bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center">
            <i class="fas fa-qrcode mr-2"></i> Bayar dengan QRIS
          </button>
          <button @click="payWithEwallet"
            class="bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center">
            <i class="fas fa-wallet mr-2"></i> Bayar dengan E-Wallet
          </button>
          <button @click="payWithCash"
            class="bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center col-span-full">
            <i class="fas fa-hand-holding-usd mr-2"></i> Bayar Tunai (Ke Bendahara)
          </button>
        </div>
      </div>
      <div v-else class="mt-6 text-center text-gray-600 italic">
        <p>Terima kasih, iuran Anda bulan ini sudah lunas!</p>
      </div>
    </div>
  </div>
  <CreateButton to="/iuran/new" />
</template>

<script>
import CreateButton from '@/components/CreateButton.vue';
import axios from 'axios'; // Pastikan axios diimpor jika digunakan
import api from '@/services/api'; // Pastikan path ini benar

export default {
  name: 'App',
  components: {
    CreateButton
  },
  data() {
    return {
      deleteMode: false,
      selectedId: null,
      pressTimer: null,
      iuranData: [],
      currentMonthFormatted: '', // Properti untuk menyimpan bulan dan tahun saat ini yang diformat
      token: localStorage.getItem('authToken')
    };
  },
  computed: {
    akunId() {
      // Jika userProfile digunakan untuk mendapatkan ID akun, pastikan itu tersedia di komponen
      // Jika tidak, Anda mungkin perlu mengambilnya dari token atau tempat lain.
      return this.userProfile?.id; // Sesuaikan dengan cara Anda mendapatkan akunId
    },
    isPaidThisMonth() {
      // Memeriksa apakah ada iuran yang lunas untuk bulan saat ini
      if (!this.currentMonthFormatted) return false; // Pastikan bulan sudah diatur
      return this.iuranData.some(item =>
        this.extractMonthYear(item.keterangan) === this.currentMonthFormatted &&
        item.status === 'Pending' // Diasumsikan status API 'Lunas' dimapping ke 'Validate' di UI
      );
    },
    sortedIuranData() {
      // Mengurutkan data iuran berdasarkan tahun dan bulan
      const monthOrder = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'Mei': 5, 'Jun': 6,
        'Jul': 7, 'Agu': 8, 'Sep': 9, 'Okt': 10, 'Nov': 11, 'Des': 12
      };

      return [...this.iuranData].sort((a, b) => {
        const aKeterangan = a.keterangan || '';
        const bKeterangan = b.keterangan || '';

        const [aMonthName, aYear] = this.extractMonthYear(aKeterangan).split(' ');
        const [bMonthName, bYear] = this.extractMonthYear(bKeterangan).split(' ');

        // Urutkan berdasarkan tahun (terbaru ke terlama)
        if (aYear !== bYear) {
          return parseInt(bYear) - parseInt(aYear);
        }
        // Jika tahun sama, urutkan berdasarkan bulan (terbaru ke terlama)
        return monthOrder[bMonthName] - monthOrder[aMonthName];
      });
    }
  },
  methods: {
    startPress(id) {
      this.pressTimer = setTimeout(() => {
        this.deleteMode = true;
        this.selectedId = id;
      }, 100);
    },
    cancelPress() {
      clearTimeout(this.pressTimer);
    },
    extractMonthYear(keterangan) {
      // Mengekstrak bulan dan tahun dari string keterangan
      // Contoh: "Iuran bulanan Juni 2025 warga Angga Pratama" -> "Juni 2025"
      const match = keterangan ? keterangan.match(/Iuran bulanan (\w+ \d{4})/i) : null;
      return match ? match[1] : 'Jan 2025';
    },
    getCurrentMonthAndYear() {
      // Mendapatkan bulan dan tahun saat ini dalam format "Bulan Tahun"
      const date = new Date();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${month} ${year}`;
    },
    async fetchIuran() {
      try {
        const response = await api.get(`/iuran/?skip=0&limit=100&akun_id=1`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json'
          }
        });

        // Memetakan data dari respons API ke format yang diharapkan oleh template
        this.iuranData = response.data.map(item => {
          let uiStatus = item.status;
          // Memetakan status API ke status yang digunakan di UI untuk styling
          if (item.status === 'Lunas') {
            uiStatus = 'Validate';
          } else if (item.status === 'Confirm') { // Jika ada status 'Confirm' dari API
            uiStatus = 'Confirm';
          } else if (item.status === 'Draft') { // Jika ada status 'Draft' dari API
            uiStatus = 'Draft';
          }
          // Tambahkan mapping untuk status lain jika diperlukan

          return {
            id: item.id,
            // Ekstrak bulan dari 'keterangan'
            bulan: this.extractMonthYear(item.keterangan),
            // Konversi 'nominal' string ke float
            jumlah: parseFloat(item.nominal),
            // Gunakan 'tangal' sebagai 'tanggalBayar'
            tanggalBayar: item.tangal,
            // Gunakan status yang sudah dimapping
            status: uiStatus,
            keterangan: item.keterangan // Pertahankan keterangan untuk extractMonthYear
          };
        });
      } catch (error) {
        console.error('Gagal memuat data iuran:', error);
        // Handle error, misalnya menampilkan pesan kepada pengguna
      }
    },
    // Metode pembayaran ini hanya simulasi, Anda dapat mengimplementasikannya lebih lanjut
    payWithQRIS() {
      // Mengganti alert dengan modal UI kustom jika diperlukan di lingkungan produksi
      console.log('Simulasi: Anda akan diarahkan ke halaman pembayaran QRIS.');
      // this.simulatePaymentSuccess(); // Panggil ini jika Anda ingin mensimulasikan pembayaran berhasil
    },
    payWithEwallet() {
      console.log('Simulasi: Anda akan diarahkan ke pilihan E-Wallet.');
      // this.simulatePaymentSuccess();
    },
    payWithCash() {
      console.log('Silakan hubungi Bendahara RT untuk pembayaran tunai.');
    }, async hapusIuran(id) {
      if (!confirm("Yakin ingin menghapus iuran ini?")) return;
      try {
        await api.delete(`/iuran/${id}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json'
          }
        });
        alert("Iuran berhasil dihapus.");
        // Set bulan dan tahun saat ini ketika komponen dimuat
        this.currentMonthFormatted = this.getCurrentMonthAndYear();
        // Panggil fungsi fetchIuran untuk memuat data
        this.fetchIuran();
      } catch (error) {
        console.error("Gagal menghapus iuran:", error);
        alert("Terjadi kesalahan saat menghapus.");
      }
    },
    async editIuraan(id){
      this.$router.push(`/iuran/edit/${id}`)
    }
  },
  mounted() {
    // Set bulan dan tahun saat ini ketika komponen dimuat
    this.currentMonthFormatted = this.getCurrentMonthAndYear();
    // Panggil fungsi fetchIuran untuk memuat data
    this.fetchIuran();
  }
};
</script>

<style scoped>
/* Optional: styles for line-clamp if not directly supported by Tailwind version or needs polyfill */
</style>
