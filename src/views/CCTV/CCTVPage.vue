<template>
  <div class="px-4 bg-gray-100 min-h-screen flex flex-col">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6 flex-grow">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Pantau CCTV Lingkungan</h2>

      <div class="w-full bg-gray-200 rounded-lg overflow-hidden relative mb-6 aspect-video">
        <img src="https://via.placeholder.com/800x450/B0BEC5/FFFFFF?text=CCTV+Feed+Offline" alt="CCTV Placeholder" class="w-full h-full object-cover">
        <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-semibold">
          <i class="fas fa-video-slash mr-2"></i>
          <span class="max-w-[60%]">Video Streaming Tidak Tersedia (Simulasi)</span>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-center justify-between text-sm mb-4">
        <div class="flex items-center">
          <i class="fas fa-circle text-green-500 text-xs mr-2 animate-pulse"></i>
          <span>Status: Live (Update terakhir: {{ lastUpdateTime }})</span>
        </div>
        <button @click="refreshCCTV" class="text-blue-600 hover:text-blue-800 font-medium focus:outline-none flex items-center">
          <i class="fas fa-sync-alt mr-1"></i>
          Refresh
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 class="font-semibold text-gray-700 mb-2">Lokasi CCTV 1</h3>
          <p class="text-gray-600 text-sm">Gerbang Utama RW 03</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 class="font-semibold text-gray-700 mb-2">Kualitas Streaming</h3>
          <p class="text-gray-600 text-sm">HD 720p</p>
        </div>
        </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'CCTVPage',
  data() {
    return {
      lastUpdateTime: new Date().toLocaleTimeString('id-ID'), // Initial time
    };
  },
  methods: {
    refreshCCTV() {
      // Simulate refreshing the CCTV feed
      // In a real application, this would trigger an API call to refresh the stream URL
      this.lastUpdateTime = new Date().toLocaleTimeString('id-ID');
      console.log('CCTV feed refreshed at:', this.lastUpdateTime);
      // Optionally, add a loading state here and then hide it
    }
  },
  mounted() {
    // Optional: Auto-refresh every minute (adjust as needed)
    // this.refreshInterval = setInterval(() => {
    //   this.refreshCCTV();
    // }, 60 * 1000); // Every 60 seconds
  },
  beforeUnmount() {
    // Optional: Clear the interval when the component is destroyed
    // if (this.refreshInterval) {
    //   clearInterval(this.refreshInterval);
    // }
  }
};
</script>

<style scoped>
/* Scoped styles for CCTVPage if needed, but Tailwind handles most of it */

/* For the pulse animation on the green circle */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>