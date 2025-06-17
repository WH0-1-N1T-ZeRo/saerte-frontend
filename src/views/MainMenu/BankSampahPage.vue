<template>
  <div class="px-4 bg-gray-100 min-h-full">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Bank Sampah RT</h2>
      <div class="grid grid-cols-1 gap-4">
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
  <CreateButton to="/bank-sampah/new" />
</template>
<script setup>
import CreateButton from '@/components/CreateButton.vue';
</script>
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
