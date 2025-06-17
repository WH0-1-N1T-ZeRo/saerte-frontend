<template>
  <div class="px-4 bg-gray-100 min-h-full">
    <div
      class="alert-box bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg relative mb-6 shadow-sm">
      <p><i class="fas fa-bell mr-2"></i>Ada pengumuman baru dari Ketua RT!</p>
    </div>

    <!-- Image Slider -->
    <div class="relative w-full h-48 rounded-lg overflow-hidden shadow-md mb-6">
      <div
        class="flex transition-transform duration-700 ease-in-out"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="w-full flex-shrink-0 h-48"
        >
          <img :src="image" alt="Slide" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
    

    <div class="grid sm:grid-cols-4 gap-2">
      <FeatureCard title="Surat Pengantar" @click="$router.push('/surat-pengantar')" />
      <FeatureCard title="Iuran Warga" @click="$router.push('/iuran-warga')" />
      <FeatureCard title="Bank Sampah" @click="$router.push('/bank-sampah')" />
      <FeatureCard title="CCTV" @click="$router.push('/cctv')" />
      <FeatureCard title="Saran dan Aduan" @click="$router.push('/saran-keluhan')" />

      <!-- <div class="hidden"> -->
        <FeatureCard title="Kegiatan RT" @click="$router.push('/kegiatan')" />
        <FeatureCard title="Keuangan RT" @click="$router.push('/keuangan-rt')" />
        <FeatureCard title="Dashboard" @click="$router.push('/dashboard')" />
      <!-- </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import FeatureCard from '@/components/FeatureCard.vue'

const images = [
  'https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/p1/332/2023/10/30/vintage-pahlawan-heroes-day-background-with-fist_23-2148701986-3768961948.jpg',
  'https://www.shutterstock.com/image-vector/pemilu-pemilihan-umum-presidential-election-260nw-2392558341.jpg',
  'https://www.shutterstock.com/image-vector/17-agustus-mean-indonesia-independence-260nw-1766884247.jpg'
]

const currentSlide = ref(0)
let sliderInterval = null

onMounted(() => {
  sliderInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % images.length
  }, 3000)
})

onBeforeUnmount(() => {
  clearInterval(sliderInterval)
})
</script>
