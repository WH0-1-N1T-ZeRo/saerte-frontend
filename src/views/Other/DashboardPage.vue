<template>
  <div class="px-4 py-6 bg-gray-100 min-h-screen">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Dashboard Statistik RT</h2>

      <div class="grid md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg shadow-sm text-center">
          <p class="text-blue-700 text-sm font-semibold">Total Warga</p>
          <p class="text-blue-800 text-3xl font-bold mt-1">{{ totalWarga }}</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg shadow-sm text-center">
          <p class="text-green-700 text-sm font-semibold">Iuran Lunas Bulan Ini</p>
          <p class="text-green-800 text-3xl font-bold mt-1">98</p>
        </div>
        <div class="bg-yellow-50 p-4 rounded-lg shadow-sm text-center">
          <p class="text-yellow-700 text-sm font-semibold">Kegiatan Bulan Ini</p>
          <p class="text-yellow-800 text-3xl font-bold mt-1">3</p>
        </div>
        <div class="bg-red-50 p-4 rounded-lg shadow-sm text-center">
          <p class="text-red-700 text-sm font-semibold">Aduan Bulan Ini</p>
          <p class="text-red-800 text-3xl font-bold mt-1">3</p>
        </div>
      </div>

      <h3 class="text-xl font-semibold text-gray-700 mb-4">Statistik Demografi Warga</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
          <h4 class="font-semibold text-lg text-gray-800 mb-3">Distribusi Gender</h4>
          <div class="relative w-full max-w-xs h-64">
            <canvas ref="genderChart"></canvas>
          </div>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
          <h4 class="font-semibold text-lg text-gray-800 mb-3">Kelompok Usia</h4>
          <div class="relative w-full h-64">
            <canvas ref="ageGroupChart"></canvas>
          </div>
        </div>

        <div class="md:col-span-2 bg-gray-50 p-4 rounded-lg shadow-sm">
          <h4 class="font-semibold text-lg text-gray-800 mb-3">Top 3 Pekerjaan Warga</h4>
          <div v-for="(job, index) in topPekerjaan" :key="index" class="flex items-center mb-2">
            <span class="text-gray-700 w-32">{{ job.name }}</span>
            <div class="flex-grow bg-teal-200 h-4 rounded-full">
              <div class="bg-teal-600 h-full rounded-full" :style="{ width: job.percentage + '%' }"></div>
            </div>
            <span class="ml-2 text-gray-800 text-sm">{{ job.percentage }}% ({{ job.count }})</span>
          </div>
        </div>
      </div>

      <div class="mt-6 text-center text-gray-600 text-sm">
        <p>Data ini adalah simulasi dan dapat diperbarui secara real-time.</p>
        <button class="text-blue-600 hover:underline mt-2">Lihat Laporan Lengkap</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      genderChartInstance: null,
      ageGroupChartInstance: null,
      wargaData: [
        { id: 1, gender: 'Pria', umur: 35, pekerjaan: 'Karyawan Swasta' },
        { id: 2, gender: 'Wanita', umur: 28, pekerjaan: 'Wirausaha' },
        { id: 3, gender: 'Pria', umur: 50, pekerjaan: 'Pensiunan' },
        { id: 4, gender: 'Wanita', umur: 22, pekerjaan: 'Mahasiswa' },
        { id: 5, gender: 'Pria', umur: 40, pekerjaan: 'Guru' },
        { id: 6, gender: 'Wanita', umur: 31, pekerjaan: 'Karyawan Swasta' },
        { id: 7, gender: 'Pria', umur: 18, pekerjaan: 'Pelajar' },
        { id: 8, gender: 'Wanita', umur: 65, pekerjaan: 'Ibu Rumah Tangga' },
        { id: 9, gender: 'Pria', umur: 29, pekerjaan: 'Wirausaha' },
        { id: 10, gender: 'Pria', umur: 45, pekerjaan: 'Karyawan Swasta' },
        { id: 11, gender: 'Wanita', umur: 38, pekerjaan: 'Karyawan Swasta' },
        { id: 12, gender: 'Pria', umur: 10, pekerjaan: 'Pelajar' },
        { id: 13, gender: 'Pria', umur: 25, pekerjaan: 'Wiraswasta' },
        { id: 14, gender: 'Wanita', umur: 42, pekerjaan: 'PNS' },
        { id: 15, gender: 'Pria', umur: 58, pekerjaan: 'Pensiunan' },
        { id: 16, gender: 'Wanita', umur: 30, pekerjaan: 'Pegawai Bank' },
        { id: 17, gender: 'Pria', umur: 15, pekerjaan: 'Pelajar' },
        { id: 18, gender: 'Wanita', umur: 5, pekerjaan: 'Belum Sekolah' },
        { id: 19, gender: 'Pria', umur: 62, pekerjaan: 'Petani' },
        { id: 20, gender: 'Wanita', umur: 26, pekerjaan: 'Desainer' },
      ]
    };
  },
  computed: {
    totalWarga() {
      return this.wargaData.length;
    },
    genderStats() {
      const priaCount = this.wargaData.filter(w => w.gender === 'Pria').length;
      const wanitaCount = this.wargaData.filter(w => w.gender === 'Wanita').length;
      return {
        pria: {
          count: priaCount,
          percentage: ((priaCount / this.totalWarga) * 100).toFixed(0)
        },
        wanita: {
          count: wanitaCount,
          percentage: ((wanitaCount / this.totalWarga) * 100).toFixed(0)
        }
      };
    },
    ageGroups() {
      const groups = {
        '0-12 Tahun': 0,
        '13-18 Tahun': 0,
        '19-35 Tahun': 0,
        '36-55 Tahun': 0,
        '56+ Tahun': 0,
      };
      this.wargaData.forEach(w => {
        if (w.umur >= 0 && w.umur <= 12) groups['0-12 Tahun']++;
        else if (w.umur >= 13 && w.umur <= 18) groups['13-18 Tahun']++;
        else if (w.umur >= 19 && w.umur <= 35) groups['19-35 Tahun']++;
        else if (w.umur >= 36 && w.umur <= 55) groups['36-55 Tahun']++;
        else if (w.umur >= 56) groups['56+ Tahun']++;
      });
      return groups;
    },
    topPekerjaan() {
      const jobCounts = {};
      this.wargaData.forEach(w => {
        jobCounts[w.pekerjaan] = (jobCounts[w.pekerjaan] || 0) + 1;
      });

      const sortedJobs = Object.entries(jobCounts)
        .map(([name, count]) => ({
          name,
          count,
          percentage: ((count / this.totalWarga) * 100).toFixed(0)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3); // Top 3

      return sortedJobs;
    }
  },
  methods: {
    createGenderChart() {
      if (this.genderChartInstance) {
        this.genderChartInstance.destroy(); // Hancurkan instance chart yang lama
      }
      const ctx = this.$refs.genderChart.getContext('2d');
      this.genderChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Pria', 'Wanita'],
          datasets: [
            {
              backgroundColor: ['#3B82F6', '#EC4899'], // Biru untuk pria, Pink untuk wanita
              data: [this.genderStats.pria.count, this.genderStats.wanita.count],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                font: {
                  size: 14
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed !== null) {
                    // Pastikan total tidak nol untuk menghindari Infinity
                    const total = context.dataset.data.reduce((a, b) => a + b, 0) || 1;
                    label += context.parsed + ' (' + ((context.parsed / total) * 100).toFixed(0) + '%)';
                  }
                  return label;
                },
              },
            },
          },
        },
      });
    },
    createAgeGroupChart() {
      if (this.ageGroupChartInstance) {
        this.ageGroupChartInstance.destroy(); // Hancurkan instance chart yang lama
      }
      const labels = Object.keys(this.ageGroups);
      const dataValues = Object.values(this.ageGroups);

      const ctx = this.$refs.ageGroupChart.getContext('2d');
      this.ageGroupChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Jumlah Warga',
              backgroundColor: '#8B5CF6', // Ungu
              data: dataValues,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0) || 1;
                    const percentage = ((context.parsed.y / total) * 100).toFixed(0);
                    label += context.parsed.y + ' (' + percentage + '%)';
                  }
                  return label;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  if (Number.isInteger(value)) {
                    return value;
                  }
                }
              }
            },
          },
        },
      });
    }
  },
  mounted() {
    this.createGenderChart();
    this.createAgeGroupChart();
  },
  watch: {
    genderStats: {
      handler() {
        this.createGenderChart();
      },
      deep: true,
    },
    ageGroups: {
      handler() {
        this.createAgeGroupChart();
      },
      deep: true,
    },
    totalWarga() { // Watch totalWarga juga, karena ageGroups persentase bergantung padanya
      this.createAgeGroupChart();
    }
  },
  beforeUnmount() {
    if (this.genderChartInstance) {
      this.genderChartInstance.destroy();
    }
    if (this.ageGroupChartInstance) {
      this.ageGroupChartInstance.destroy();
    }
  },
};
</script>

<style>
/* Pastikan Chart.js bisa responsif dengan container */
canvas {
  max-width: 100%;
  height: auto;
}
</style>