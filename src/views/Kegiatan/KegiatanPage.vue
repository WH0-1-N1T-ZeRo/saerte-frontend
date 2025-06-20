<template>
  <div class="px-4 bg-gray-100 min-h-full">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Jadwal dan Kegiatan RT</h2>

      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-700">Kegiatan Mendatang</h3>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-sm">
          <i class="fas fa-plus mr-1"></i> Tambah Kegiatan
        </button>
      </div>

      <div class="space-y-4 mb-6">
        <div v-for="kegiatan in upcomingActivities" :key="kegiatan.id" class="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
          <h4 class="font-bold text-lg text-blue-800">{{ kegiatan.nama }}</h4>
          <p class="text-blue-700 text-sm mb-2"><i class="fas fa-calendar-alt mr-1"></i> {{ kegiatan.tanggal }}</p>
          <p class="text-blue-700 text-sm mb-2"><i class="fas fa-map-marker-alt mr-1"></i> {{ kegiatan.lokasi }}</p>
          <p class="text-gray-700 text-sm line-clamp-2">{{ kegiatan.deskripsi }}</p>
          <div class="flex justify-end mt-3">
            <button @click="viewDetail(kegiatan.id)" class="text-blue-600 hover:underline text-sm font-semibold">Lihat Detail</button>
          </div>
        </div>
        <p v-if="upcomingActivities.length === 0" class="text-center text-gray-500 italic py-4">Tidak ada kegiatan mendatang.</p>
      </div>

      <h3 class="text-xl font-semibold text-gray-700 mb-4">Kegiatan Terlaksana</h3>
      <div class="space-y-4">
        <div v-for="kegiatan in pastActivities" :key="kegiatan.id" class="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
          <h4 class="font-bold text-lg text-gray-800">{{ kegiatan.nama }}</h4>
          <p class="text-gray-700 text-sm mb-2"><i class="fas fa-calendar-check mr-1"></i> {{ kegiatan.tanggal }}</p>
          <p class="text-gray-700 text-sm line-clamp-2">{{ kegiatan.deskripsi }}</p>
          <div class="flex justify-end mt-3">
            <button @click="viewDetail(kegiatan.id)" class="text-blue-600 hover:underline text-sm font-semibold">Lihat Detail</button>
          </div>
        </div>
        <p v-if="pastActivities.length === 0" class="text-center text-gray-500 italic py-4">Tidak ada riwayat kegiatan.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      upcomingActivities: [
        {
          id: 1,
          nama: 'Kerja Bakti Rutin',
          tanggal: 'Sabtu, 15 Juni 2025',
          lokasi: 'Area RT 002/001',
          deskripsi: 'Kegiatan kerja bakti membersihkan lingkungan RT, parit, dan fasilitas umum. Dimohon kehadiran seluruh warga.',
          status: 'Upcoming'
        },
        {
          id: 2,
          nama: 'Rapat Persiapan HUT RI',
          tanggal: 'Minggu, 23 Juni 2025',
          lokasi: 'Balai Warga RT 002/001',
          deskripsi: 'Rapat koordinasi untuk persiapan perayaan HUT Kemerdekaan RI ke-80. Akan membahas anggaran dan susunan panitia.',
          status: 'Upcoming'
        }
      ],
      pastActivities: [
        {
          id: 3,
          nama: 'Gotong Royong Perbaikan Jalan',
          tanggal: 'Sabtu, 11 Mei 2025',
          lokasi: 'Jalan Utama RT 002/001',
          deskripsi: 'Perbaikan jalan berlubang di area RT 002/001 bersama warga. Berjalan lancar dan selesai tepat waktu.',
          status: 'Done'
        },
        {
          id: 4,
          nama: 'Pengajian Rutin Bulanan',
          tanggal: 'Jumat, 3 Mei 2025',
          lokasi: 'Musala Al-Ikhlas',
          deskripsi: 'Pengajian rutin bulanan bersama ustaz setempat. Dihadiri banyak warga.',
          status: 'Done'
        }
      ]
    };
  },
  methods: {
    viewDetail(id) {
      alert('Melihat detail kegiatan ID: ' + id);
      // Di aplikasi nyata, Anda bisa navigasi ke halaman detail kegiatan
    }
  }
};
</script>

<style scoped>
/* Optional: styles for line-clamp if not directly supported by Tailwind version or needs polyfill */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
