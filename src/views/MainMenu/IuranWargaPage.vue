<template>
  <div class="px-4 bg-gray-100 min-h-full">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Status Iuran Warga</h2>

      <div class="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg text-center shadow-sm">
        <p class="text-blue-700 text-lg mb-1">Status Iuran Anda Bulan Ini (Juni 2025):</p>
        <p class="text-2xl font-bold" :class="{ 'text-green-600': isPaidThisMonth, 'text-red-600': !isPaidThisMonth }">
          {{ isPaidThisMonth ? 'Lunas!' : 'Belum Lunas' }}
        </p>
      </div>

      <div class="mb-6">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Riwayat Pembayaran Iuran</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                <th class="py-3 px-4 border-b border-gray-200">Periode</th>
                <th class="py-3 px-4 border-b border-gray-200">Jumlah</th>
                <th class="py-3 px-4 border-b border-gray-200">Tgl Bayar</th>
                <th class="py-3 px-4 border-b border-gray-200 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="text-gray-700 text-sm font-light">
              <tr v-for="iuran in sortedIuranData" :key="iuran.id" class="border-b border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-4">{{ iuran.bulan }}</td>
                <td class="py-3 px-4">Rp {{ iuran.jumlah.toLocaleString('id-ID') }}</td>
                <td class="py-3 px-4">{{ iuran.tanggalBayar || '-' }}</td>
                <td class="py-3 px-4 text-center">
                  <span :class="{
                    'bg-green-100 text-green-800': iuran.status === 'Validate',
                    'bg-red-100 text-red-800': iuran.status === 'Confirm',
                    'bg-gray-100 text-blue-800': iuran.status === 'Draft',
                  }" class="px-2 py-0.5 rounded-full text-xs font-semibold">
                    {{ iuran.status }}
                  </span>
                </td>
              </tr>
              <tr v-if="iuranData.length === 0">
                <td colspan="4" class="py-4 text-center text-gray-500">Belum ada riwayat iuran.</td>
              </tr>
            </tbody>
          </table>
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
export default {
  name: 'App',
  components: {
    CreateButton
  },
  data() {
    return {
      iuranData: [
        { id: 1, bulan: 'Juni 2025', jumlah: 50000, tanggalBayar: '2025-07-21', status: 'Draft' },
        { id: 2, bulan: 'Mei 2025', jumlah: 50000, tanggalBayar: '2025-05-03', status: 'Validate' },
        { id: 3, bulan: 'April 2025', jumlah: 50000, tanggalBayar: '2025-04-01', status: 'Confirm' },
        { id: 4, bulan: 'Maret 2025', jumlah: 50000, tanggalBayar: '2025-03-05', status: 'Validate' },
      ],
      currentMonth: 'Juni 2025' // Simulasi bulan saat ini
    };
  },
  computed: {
    isPaidThisMonth() {
      return this.iuranData.some(item => item.bulan === this.currentMonth && item.status === 'Validate');
    },
    sortedIuranData() {
      // Sort by month (descending)
      const monthOrder = {
        'Januari': 1, 'Februari': 2, 'Maret': 3, 'April': 4, 'Mei': 5, 'Juni': 6,
        'Juli': 7, 'Agustus': 8, 'September': 9, 'Oktober': 10, 'November': 11, 'Desember': 12
      };
      return [...this.iuranData].sort((a, b) => {
        const [aMonth, aYear] = a.bulan.split(' ');
        const [bMonth, bYear] = b.bulan.split(' ');

        if (aYear !== bYear) {
          return parseInt(bYear) - parseInt(aYear); // Sort by year descending
        }
        return monthOrder[bMonth] - monthOrder[aMonth]; // Sort by month descending
      });
    }
  },
  methods: {
    payWithQRIS() {
      alert('Simulasi: Anda akan diarahkan ke halaman pembayaran QRIS. Setelah pembayaran, status akan otomatis Lunas.');
      // Di aplikasi nyata, ini akan menampilkan QR code atau navigasi ke gateway pembayaran
      this.simulatePaymentSuccess();
    },
    payWithEwallet() {
      alert('Simulasi: Anda akan diarahkan ke pilihan E-Wallet. Setelah pembayaran, status akan otomatis Lunas.');
      // Di aplikasi nyata, ini akan navigasi ke halaman E-Wallet
      this.simulatePaymentSuccess();
    },
    payWithCash() {
      alert('Silakan hubungi Bendahara RT untuk pembayaran tunai. Status akan diperbarui setelah pembayaran diterima.');
      // Di aplikasi nyata, ini mungkin mencatat permintaan bayar tunai
    },
    simulatePaymentSuccess() {
      const index = this.iuranData.findIndex(item => item.bulan === this.currentMonth);
      if (index !== -1) {
        this.iuranData[index].status = 'Lunas';
        this.iuranData[index].tanggalBayar = new Date().toISOString().slice(0, 10);
        alert('Pembayaran iuran bulan ini berhasil disimulasikan lunas!');
      }
    }
  }
};
</script>

<style scoped>
/* Optional: styles for line-clamp if not directly supported by Tailwind version or needs polyfill */
</style>
