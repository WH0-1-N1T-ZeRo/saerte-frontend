<template>
  <div class=" bg-gray-100 min-h-full">
    <div class="bg-white p-6 px-10 shadow-md mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Data Profil</h2>

      <div class="mb-4">
        <label class="block text-gray-600 text-sm font-medium mb-1">Nomor Telepon:</label>
        <p class="text-gray-800 font-semibold text-lg">{{ userProfile.phone }}</p>
      </div>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">Nama:</label>
          <p class="text-gray-800">{{ userProfile.nama }}</p>
        </div>
        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">nik:</label>
          <p class="text-gray-800">{{ userProfile.nik }}</p>
        </div>
        <!-- <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">Umur:</label>
          <p class="text-gray-800">{{ userProfile.umur }} tahun</p>
        </div> -->

        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">Hoby:</label>
          <p class="text-gray-800">{{ userProfile.hoby.join(', ') }}</p>
        </div>
        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">Interes:</label>
          <p class="text-gray-800">{{ userProfile.interes.join(', ') }}</p>
        </div>
        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">Alamat:</label>
          <p class="text-gray-800">{{ userProfile.alamat }}</p>
        </div>
      </div>

      <h3 class="text-xl font-bold text-gray-800 mb-3 mt-6">Data Kartu Keluarga</h3>
      <div class="bg-gray-50 p-4 rounded-lg">
        <div v-for="(anggota, index) in userProfile.dataKk" :key="index"
          class="mb-3 pb-3 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
          <p class="font-semibold text-gray-800">{{ anggota.nama }} <span class="text-sm text-gray-500">({{
            anggota.status }})</span></p>
          <p class="text-sm text-gray-600">NIK: {{ anggota.nik }}</p>
        </div>
        <p v-if="userProfile.dataKk.length === 0" class="text-gray-500 italic">Data KK belum terisi.</p>
      </div>

      <p class="mt-6 text-sm text-gray-600 text-center">Tipe Akses: <span class="font-bold text-blue-600">{{
        userProfile.typeAkses }}</span></p>

      <router-link to="/profile/edit/"
        class="mt-8 block w-full text-center bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200">
        Edit Profil
      </router-link>

      <button @click="logout"
        class="mt-4 w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200">
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
export default {
  props: {
    userProfile: {
      type: Object,
      required: true
    }
  },
  methods: {
    async logout() {
      try {
        const response = await api.post("/auth/logout", {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (response.status === 200) {
          this.$emit('logout');
          localStorage.removeItem('authToken'); // optional, kalau mau hapus token setelah logout sukses
        } else {
          console.warn("Logout gagal, status bukan 200:", response.status);
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  }
};
</script>
