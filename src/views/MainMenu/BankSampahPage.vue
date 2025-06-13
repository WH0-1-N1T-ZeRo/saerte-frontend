<template>
  <div class="px-4 bg-gray-100 min-h-full">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Bank Sampah RT</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <div class="flex flex-col items-center justify-center mb-6">
            <i class="fas fa-recycle text-green-500 text-6xl mb-4"></i>
            <p class="text-gray-700 text-lg text-center mb-2">Total Poin Anda: <span
                class="font-bold text-green-600">1250
                Poin</span></p>
            <p class="text-gray-600 text-sm text-center">100 poin = Rp 1.000</p>
          </div>

          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-700 mb-4">Setor Sampah</h3>
            <p class="text-gray-600 text-sm mb-4">Pilih jenis sampah dan masukkan perkiraan berat (kg) untuk disetor.
            </p>

            <div class="mb-4">
              <label for="jenisSampah" class="block text-gray-700 text-sm font-bold mb-2">Jenis Sampah:</label>
              <select id="jenisSampah" v-model="setorData.jenis"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="">Pilih Jenis Sampah</option>
                <option value="plastik">Plastik (Botol, Kemasan)</option>
                <option value="kertas">Kertas (Koran, Kardus, HVS)</option>
                <option value="logam">Logam (Kaleng)</option>
                <option value="kaca">Kaca (Botol Kaca)</option>
                <option value="organik">Organik (Sisa Makanan, Daun - hanya diterima di titik tertentu)</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="beratSampah" class="block text-gray-700 text-sm font-bold mb-2">Perkiraan Berat (kg):</label>
              <input type="number" id="beratSampah" v-model.number="setorData.berat" placeholder="e.g., 2.5" step="0.1"
                min="0"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div class="mb-4">
              <label for="catatan" class="block text-gray-700 text-sm font-bold mb-2">Catatan Tambahan
                (opsional):</label>
              <textarea id="catatan" v-model="setorData.catatan"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-20"></textarea>
            </div>

            <button @click="requestSetor" :disabled="!isValidSetor"
              class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Ajukan Setoran Sampah
            </button>
          </div>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-700 mb-4">Riwayat Setoran</h3>
          <div class="space-y-3">
            <div v-for="setoran in riwayatSetoran" :key="setoran.id"
              class="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm">
              <div class="flex justify-between items-center text-sm font-semibold mb-1">
                <span class="text-gray-700">{{ setoran.tanggal }}</span>
                <span
                  :class="{ 'text-blue-600': setoran.status === 'Pending', 'text-green-600': setoran.status === 'Selesai', 'text-red-600': setoran.status === 'Dibatalkan' }">{{
                    setoran.status }}</span>
              </div>
              <p class="text-gray-800 text-base font-bold">{{ setoran.jenis }} ({{ setoran.berat }} kg)</p>
              <p v-if="setoran.poin" class="text-green-600 text-sm">Poin diterima: +{{ setoran.poin }}</p>
              <p v-if="setoran.catatan" class="text-gray-600 text-xs mt-1">Catatan: {{ setoran.catatan }}</p>
            </div>
            <p v-if="riwayatSetoran.length === 0" class="text-center text-gray-500 italic py-4">Belum ada riwayat
              setoran sampah.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalPoints: 1250,
      setorData: {
        jenis: '',
        berat: null,
        catatan: '',
      },
      riwayatSetoran: [
        { id: 1, tanggal: '2025-06-01', jenis: 'Plastik', berat: 3.2, poin: 320, status: 'Selesai', catatan: 'Botol plastik dan kemasan' },
        { id: 2, tanggal: '2025-05-20', jenis: 'Kertas', berat: 5.0, poin: 500, status: 'Selesai', catatan: 'Koran bekas' },
        { id: 3, tanggal: '2025-06-10', jenis: 'Logam', berat: 1.5, poin: null, status: 'Pending', catatan: 'Kaleng bekas minuman' },
      ]
    };
  },
  computed: {
    isValidSetor() {
      return this.setorData.jenis && this.setorData.berat > 0;
    }
  },
  methods: {
    requestSetor() {
      if (!this.isValidSetor) {
        alert('Mohon lengkapi jenis sampah dan berat yang valid.');
        return;
      }
      const newId = this.riwayatSetoran.length ? Math.max(...this.riwayatSetoran.map(s => s.id)) + 1 : 1;
      const newSetoran = {
        id: newId,
        tanggal: new Date().toISOString().slice(0, 10), // Current date
        jenis: this.setorData.jenis,
        berat: this.setorData.berat,
        poin: null, // Poin akan diisi setelah disetujui
        status: 'Pending',
        catatan: this.setorData.catatan,
      };
      this.riwayatSetoran.unshift(newSetoran); // Add to beginning
      alert('Pengajuan setoran sampah berhasil! Menunggu verifikasi pengurus.');
      this.setorData = { jenis: '', berat: null, catatan: '' }; // Reset form
    }
  }
};
</script>
