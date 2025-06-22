<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">
    <!-- <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 flex items-center">
      <span class="mr-2 text-green-500">♻️</span> Item Sampah
    </h1> -->

    <div v-if="wasteItemStore.loading" class="flex items-center justify-center py-10 text-gray-500">
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Memuat data item sampah...
    </div>

    <div v-else-if="wasteItemStore.items.length === 0" class="flex flex-col items-center justify-center py-10 text-gray-400 h-[70vh]">
      <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m0-10a2 2 0 110-4 2 2 0 010 4zm-8 4a2 2 0 110-4 2 2 0 010 4zm16 0a2 2 0 110-4 2 2 0 010 4z"></path></svg>
      <p class="text-lg font-medium">Belum ada item sampah yang terdaftar.</p>
      <p class="text-sm">Silakan tambahkan item sampah baru untuk memulai.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="item in wasteItemStore.items"
        :key="item.id"
        class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col justify-between"
      >
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base font-semibold text-gray-800 truncate">
              {{ item.name }}
            </h3>
            <span class="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {{ item.code }}
            </span>
          </div>
          <!-- <p class="text-sm text-gray-500 mb-1">
            Satuan: <span class="font-medium text-gray-700">{{ item.unit }}</span>
          </p> -->
          <p class="text-sm text-gray-500">
            Harga:
            <span class="font-bold text-green-600">Rp{{ parseFloat(item.price_unit).toLocaleString('id-ID') }}</span> / {{ item.unit }}
          </p>
        </div>
        
        <div class="border-t border-gray-100 p-3 bg-gray-50 flex justify-end">
            <button class="text-sm text-blue-600 hover:text-blue-800 transition-colors mr-3">Edit</button>
            <button class="text-sm text-red-600 hover:text-red-800 transition-colors">Hapus</button>
        </div>
      </div>
    </div>
  </div>
  <CreateButton to="/waste-item/new"/>
</template>

<script setup>
import CreateButton from '@/components/CreateButton.vue'
import { onMounted, watch } from 'vue'
import { useWasteItemStore } from '@/stores/wasteItemStore'

const wasteItemStore = useWasteItemStore()

// Fetch data saat komponen di-mount
onMounted(() => {
  wasteItemStore.fetchItems()
})

// Debug: log setiap kali items berubah
watch(
  () => wasteItemStore.items,
  (val) => {
    console.log('📦 Items berhasil dimuat:', val)
  }
)
</script>

<style scoped>
/* Anda bisa menambahkan gaya kustom di sini jika diperlukan */
</style>