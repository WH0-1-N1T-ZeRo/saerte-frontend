<template>
  <div class="px-4 bg-gray-100 min-h-full">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Data Profil</h2>

      <div class="mb-4">
        <label class="block text-gray-600 text-sm font-medium mb-1">Nomor Telepon:</label>
        <p class="text-gray-800 font-semibold text-lg">{{ userProfile.no_telp }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">Nama:</label>
          <p class="text-gray-800">{{ userProfile.nama }}</p>
        </div>
        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">Gender:</label>
          <p class="text-gray-800">{{ userProfile.gender }}</p>
        </div>
        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">Umur:</label>
          <p class="text-gray-800">{{ userProfile.umur }} tahun</p>
        </div>
        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">Pekerjaan:</label>
          <p class="text-gray-800">{{ userProfile.pekerjaan }}</p>
        </div>
        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">Golongan Darah:</label>
          <p class="text-gray-800">{{ userProfile.golonganDarah }}</p>
        </div>
        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">Hoby:</label>
          <p class="text-gray-800">{{ userProfile.hoby.join(', ') }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-gray-600 text-sm font-medium mb-1">Interes:</label>
          <p class="text-gray-800">{{ userProfile.interes.join(', ') }}</p>
        </div>
      </div>

      <h3 class="text-xl font-bold text-gray-800 mb-3 mt-6">Alamat Tinggal</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">Desa/Kelurahan:</label>
          <p class="text-gray-800">{{ userProfile.desa }}</p>
        </div>
        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">RW:</label>
          <p class="text-gray-800">{{ userProfile.rw }}</p>
        </div>
        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">RT:</label>
          <p class="text-gray-800">{{ userProfile.rt }}</p>
        </div>
        <div>
          <label class="block text-gray-600 text-sm font-medium mb-1">No. Rumah:</label>
          <p class="text-gray-800">{{ userProfile.noRumah }}</p>
        </div>
      </div>

      <h3 class="text-xl font-bold text-gray-800 mb-3 mt-6">Data Kartu Keluarga</h3>
      <div class="bg-gray-50 p-4 rounded-lg">
        <div v-for="(anggota, index) in userProfile.dataKk" :key="index" class="mb-3 pb-3 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
          <p class="font-semibold text-gray-800">{{ anggota.nama }} <span class="text-sm text-gray-500">({{ anggota.status }})</span></p>
          <p class="text-sm text-gray-600">NIK: {{ anggota.nik }}</p>
        </div>
        <p v-if="userProfile.dataKk.length === 0" class="text-gray-500 italic">Data KK belum terisi.</p>
      </div>

      <p class="mt-6 text-sm text-gray-600 text-center">Tipe Akses: <span class="font-bold text-blue-600">{{ userProfile.typeAkses }}</span></p>

      <button class="mt-8 w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200">
        Edit Profil
      </button>
      <button @click="logout" class="mt-4 w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200">
        Logout
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userProfile: {
      type: Object,
      required: true
    }
  },
  methods: {
    logout() {
      this.$emit('logout');
    }
  }
};
</script>
