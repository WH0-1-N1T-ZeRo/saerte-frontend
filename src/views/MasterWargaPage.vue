<template>
  <div class="px-4 bg-gray-100 min-h-full">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Master Data Warga</h2>

      <div class="mb-4">
        <input type="text" placeholder="Cari warga (Nama/No. Rumah/RT/RW)"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          v-model="searchQuery" @input="filterWarga" />
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-4 border-b border-gray-200">Nama</th>
              <th class="py-3 px-4 border-b border-gray-200">NIK</th>
              <th class="py-3 px-4 border-b border-gray-200">Status</th>
              <th class="py-3 px-4 border-b border-gray-200 hidden">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 text-sm font-light">
            <tr v-for="warga in filteredWarga" :key="warga.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-4">{{ warga.nama }}</td>
              <td class="py-3 px-4">{{ warga.nik }}</td>
              <td class="py-3 px-4">{{ warga.status }}</td>
                <td class="py-3 px-4 text-center hidden">
                  <button @click="viewDetail(warga.id)" class="text-blue-500 hover:text-blue-700 text-lg mx-1">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="editWarga(warga.id)" class="text-green-500 hover:text-green-700 text-lg mx-1">
                    <i class="fas fa-edit"></i>
                  </button>
                </td>
            </tr>

            <tr v-if="filteredWarga.length === 0">
              <td colspan="4" class="py-4 text-center text-gray-500">Tidak ada data warga yang cocok.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="hidden">
        <button
          class="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
          Tambah Warga Baru
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import api from '../services/api';

export default {
  data() {
    return {
      searchQuery: '',
      wargaData: [],
      filteredWarga: [],
      token: localStorage.getItem('authToken'),
    };
  },
  mounted() {
    this.fetchWarga();
  },
  methods: {
    async fetchWarga() {
      try {
        const response = await api.get('/warga/', {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json'
          }
        });

        // Map response data untuk menyederhanakan tampilannya
        this.wargaData = response.data.map((item) => ({
          id: item.id,
          nama: item.ktp_obj?.nama || 'Tidak ada nama',
          nik: item.nik_id || '-', // atau bisa pakai informasi RT asli jika tersedia
          status: item.ktp_obj?.active ? 'Aktif' : 'Non-aktif',
          noRumah: item.ktp_obj?.kk_urutan?.toString() || '-',
        }));

        this.filteredWarga = this.wargaData;
      } catch (error) {
        console.error("Gagal mengambil data warga:", error);
      }
    },
    filterWarga() {
      const query = this.searchQuery.toLowerCase();
      this.filteredWarga = this.wargaData.filter(warga =>
        warga.nama.toLowerCase().includes(query) ||
        warga.nik.includes(query) ||
        warga.noRumah.includes(query)
      );
    },
    viewDetail(id) {
      alert('Melihat detail warga ID: ' + id);
    },
    editWarga(id) {
      alert('Mengedit warga ID: ' + id);
    }
  }
};
</script>


<style scoped>
/* Scoped styles if needed, but Tailwind handles most of it */
</style>
