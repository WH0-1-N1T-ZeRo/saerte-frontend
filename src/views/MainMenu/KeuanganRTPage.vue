<template>
  <div class="px-4 bg-gray-100 min-h-full">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Laporan Keuangan Kas RT</h2>

      <div class="grid grid-cols-2 gap-4 mb-6 text-center">
        <div class="bg-green-50 p-4 rounded-lg shadow-sm">
          <p class="text-green-700 text-sm font-semibold">Total Pemasukan</p>
          <p class="text-green-800 text-2xl font-bold mt-1">Rp {{ totalPemasukan.toLocaleString('id-ID') }}</p>
        </div>
        <div class="bg-red-50 p-4 rounded-lg shadow-sm">
          <p class="text-red-700 text-sm font-semibold">Total Pengeluaran</p>
          <p class="text-red-800 text-2xl font-bold mt-1">Rp {{ totalPengeluaran.toLocaleString('id-ID') }}</p>
        </div>
        <div class="col-span-2 bg-blue-50 p-4 rounded-lg shadow-sm">
          <p class="text-blue-700 text-sm font-semibold">Saldo Kas RT</p>
          <p class="text-blue-800 text-3xl font-bold mt-1">Rp {{ saldoKas.toLocaleString('id-ID') }}</p>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="text-xl font-semibold text-gray-700 mb-3">Filter Transaksi</h3>
        <div class="flex flex-col sm:flex-row gap-3">
            <select v-model="filterBulan" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="">Semua Bulan</option>
                <option v-for="(bulan, index) in months" :key="index" :value="bulan">{{ bulan }}</option>
            </select>
            <select v-model="filterTipe" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="">Semua Tipe</option>
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
            </select>
        </div>
      </div>

      <div>
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Riwayat Transaksi</h3>
        <div class="space-y-3">
          <div v-for="transaksi in filteredTransactions" :key="transaksi.id" class="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm">
            <div class="flex justify-between items-center text-sm font-semibold mb-1">
              <span class="text-gray-700">{{ transaksi.tanggal }}</span>
              <span :class="{'text-green-600': transaksi.tipe === 'pemasukan', 'text-red-600': transaksi.tipe === 'pengeluaran'}">
                Rp {{ transaksi.jumlah.toLocaleString('id-ID') }}
              </span>
            </div>
            <p class="text-gray-800 text-base font-bold">{{ transaksi.deskripsi }}</p>
            <p class="text-gray-600 text-xs mt-1">Kategori: {{ transaksi.kategori }}</p>
          </div>
          <p v-if="filteredTransactions.length === 0" class="text-center text-gray-500 italic py-4">Tidak ada riwayat transaksi yang cocok.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterBulan: '',
      filterTipe: '',
      transactions: [
        { id: 1, tanggal: '2025-06-01', deskripsi: 'Iuran Warga Juni', jumlah: 1500000, tipe: 'pemasukan', kategori: 'Iuran' },
        { id: 2, tanggal: '2025-06-03', deskripsi: 'Pembelian Alat Kebersihan', jumlah: 250000, tipe: 'pengeluaran', kategori: 'Operasional' },
        { id: 3, tanggal: '2025-06-05', deskripsi: 'Sumbangan Donatur', jumlah: 500000, tipe: 'pemasukan', kategori: 'Sumbangan' },
        { id: 4, tanggal: '2025-05-28', deskripsi: 'Perbaikan Lampu Jalan', jumlah: 150000, tipe: 'pengeluaran', kategori: 'Infrastruktur' },
        { id: 5, tanggal: '2025-05-20', deskripsi: 'Pemasukan dari Bazar RT', jumlah: 750000, tipe: 'pemasukan', kategori: 'Acara' },
        { id: 6, tanggal: '2025-05-10', deskripsi: 'Pembelian Logistik Acara', jumlah: 300000, tipe: 'pengeluaran', kategori: 'Acara' },
      ]
    };
  },
  computed: {
    totalPemasukan() {
      return this.transactions.filter(t => t.tipe === 'pemasukan').reduce((sum, t) => sum + t.jumlah, 0);
    },
    totalPengeluaran() {
      return this.transactions.filter(t => t.tipe === 'pengeluaran').reduce((sum, t) => sum + t.jumlah, 0);
    },
    saldoKas() {
      return this.totalPemasukan - this.totalPengeluaran;
    },
    months() {
      // Extract unique months from transactions
      const uniqueMonths = [...new Set(this.transactions.map(t => new Date(t.tanggal).toLocaleString('id-ID', { month: 'long', year: 'numeric' })))];
      return uniqueMonths.sort((a,b) => {
          // Simple sort, for more robust date sorting, convert to actual Date objects
          const [monthA, yearA] = a.split(' ');
          const [monthB, yearB] = b.split(' ');
          if (yearA !== yearB) return yearA - yearB;
          const monthOrder = {
            'Januari': 1, 'Februari': 2, 'Maret': 3, 'April': 4, 'Mei': 5, 'Juni': 6,
            'Juli': 7, 'Agustus': 8, 'September': 9, 'Oktober': 10, 'November': 11, 'Desember': 12
          };
          return monthOrder[monthA] - monthOrder[monthB];
      }).reverse(); // Most recent month first
    },
    filteredTransactions() {
      return this.transactions.filter(transaksi => {
        const matchesBulan = this.filterBulan === '' ||
                             new Date(transaksi.tanggal).toLocaleString('id-ID', { month: 'long', year: 'numeric' }) === this.filterBulan;
        const matchesTipe = this.filterTipe === '' || transaksi.tipe === this.filterTipe;
        return matchesBulan && matchesTipe;
      }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)); // Sort by date descending
    }
  }
};
</script>
