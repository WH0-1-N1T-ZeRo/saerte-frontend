<template>
  <div class="px-4 bg-gray-100 min-h-full">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Saran dan Keluhan</h2>

      <div class="mb-6">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Sampaikan Saran atau Keluhan Anda</h3>
        <div class="mb-4">
          <label for="kategori" class="block text-gray-700 text-sm font-bold mb-2">Kategori:</label>
          <select id="kategori" v-model="formData.kategori" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Pilih Kategori</option>
            <option value="saran">Saran</option>
            <option value="keluhan">Keluhan</option>
            <option value="infrastruktur">Infrastruktur Lingkungan</option>
            <option value="keamanan">Keamanan</option>
            <option value="sosial">Sosial/Kemasyarakatan</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="judul" class="block text-gray-700 text-sm font-bold mb-2">Judul:</label>
          <input type="text" id="judul" v-model="formData.judul" placeholder="Ringkasan saran/keluhan" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <div class="mb-4">
          <label for="isi" class="block text-gray-700 text-sm font-bold mb-2">Isi Saran/Keluhan:</label>
          <textarea id="isi" v-model="formData.isi" placeholder="Jelaskan secara rinci saran atau keluhan Anda" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"></textarea>
        </div>
        <button @click="submitSaranKeluhan" :disabled="!isFormValid" class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          Kirim Saran/Keluhan
        </button>
      </div>

      <div>
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Riwayat Saran & Keluhan Saya</h3>
        <div class="space-y-4">
          <div v-for="item in riwayat" :key="item.id" class="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-semibold text-gray-700">{{ item.tanggal }}</span>
              <span :class="{
                'bg-yellow-100 text-yellow-800': item.status === 'Pending',
                'bg-green-100 text-green-800': item.status === 'Ditanggapi',
                'bg-red-100 text-red-800': item.status === 'Ditolak'
              }" class="px-2 py-0.5 rounded-full text-xs font-semibold">
                {{ item.status }}
              </span>
            </div>
            <h4 class="font-bold text-lg text-gray-800">{{ item.judul }} <span class="text-sm text-gray-500">({{ item.kategoriDisplay }})</span></h4>
            <p class="text-gray-700 text-sm mt-1 line-clamp-3">{{ item.isi }}</p>
            <p v-if="item.tanggapan" class="text-blue-700 text-sm mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                <span class="font-semibold">Tanggapan Pengurus:</span> {{ item.tanggapan }}
            </p>
            <div class="flex justify-end mt-3">
              <button @click="viewDetail(item.id)" class="text-blue-600 hover:underline text-sm font-semibold">Lihat Detail</button>
            </div>
          </div>
          <p v-if="riwayat.length === 0" class="text-center text-gray-500 italic py-4">Belum ada saran atau keluhan yang diajukan.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        kategori: '',
        judul: '',
        isi: '',
      },
      riwayat: [
        {
          id: 1,
          tanggal: '2025-06-05',
          kategori: 'keluhan',
          kategoriDisplay: 'Keluhan',
          judul: 'Lampu Jalan Mati di Gang Melati',
          isi: 'Sudah seminggu lampu jalan di gang melati mati, membuat area tersebut gelap dan rawan kejahatan. Mohon segera diperbaiki.',
          status: 'Pending',
          tanggapan: ''
        },
        {
          id: 2,
          tanggal: '2025-05-28',
          kategori: 'saran',
          kategoriDisplay: 'Saran',
          judul: 'Pengadaan Tempat Sampah Organik',
          isi: 'Saran untuk menambah tempat sampah khusus organik di beberapa titik agar pemilahan sampah lebih mudah bagi warga.',
          status: 'Ditanggapi',
          tanggapan: 'Saran diterima dengan baik, akan kami bahas dalam rapat pengurus berikutnya dan dipertimbangkan untuk anggaran tahun depan.'
        },
        {
          id: 3,
          tanggal: '2025-05-15',
          kategori: 'infrastruktur',
          kategoriDisplay: 'Infrastruktur Lingkungan',
          judul: 'Genangan Air di Depan Pos Ronda',
          isi: 'Setiap hujan deras selalu ada genangan air cukup tinggi di depan pos ronda, sepertinya drainase tersumbat.',
          status: 'Ditanggapi',
          tanggapan: 'Terima kasih atas laporannya. Tim kebersihan RT sudah meninjau dan akan segera melakukan pembersihan drainase.'
        }
      ]
    };
  },
  computed: {
    isFormValid() {
      return this.formData.kategori && this.formData.judul.trim() !== '' && this.formData.isi.trim() !== '';
    }
  },
  methods: {
    submitSaranKeluhan() {
      if (!this.isFormValid) {
        alert('Mohon lengkapi semua field yang diperlukan.');
        return;
      }
      const newId = this.riwayat.length ? Math.max(...this.riwayat.map(i => i.id)) + 1 : 1;
      const newEntry = {
        id: newId,
        tanggal: new Date().toISOString().slice(0, 10),
        kategori: this.formData.kategori,
        kategoriDisplay: this.getKategoriDisplay(this.formData.kategori),
        judul: this.formData.judul,
        isi: this.formData.isi,
        status: 'Pending',
        tanggapan: ''
      };
      this.riwayat.unshift(newEntry); // Add to beginning
      alert('Saran/Keluhan Anda berhasil diajukan! Menunggu tanggapan dari pengurus.');
      this.formData = { kategori: '', judul: '', isi: '' }; // Reset form
    },
    getKategoriDisplay(kategori) {
        const categories = {
            saran: 'Saran',
            keluhan: 'Keluhan',
            infrastruktur: 'Infrastruktur Lingkungan',
            keamanan: 'Keamanan',
            sosial: 'Sosial/Kemasyarakatan',
            lainnya: 'Lainnya'
        };
        return categories[kategori] || kategori;
    },
    viewDetail(id) {
      alert('Melihat detail saran/keluhan ID: ' + id);
      // Anda bisa membuka modal atau navigasi ke halaman detail
    }
  }
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
