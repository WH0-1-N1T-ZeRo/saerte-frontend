<template>
  <div class="min-h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
    <div class="fixed top-0 left-0 right-0 flex justify-center z-20">
      <nav class="w-full max-w-[480px] bg-white text-gray-600 shadow-md p-4 px-8 flex justify-between items-center">

        <div class="flex">
          <img src="@/assets/logo_1.png" alt="icon" class="w-10" />
          <h1 class="text-xl font-semibold ms-2">Saerte</h1>
        </div>
        <a href="/login" class="cursor-pointer">
          <i class="font-bold fas"
            :class="isLoggedIn ? 'fa-user-check text-green-600' : 'fa-sign-in-alt text-gray-700'"></i>
        </a>
      </nav>
    </div>

    <section class="bg-gray-50 py-16 px-6">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <!-- Text Content -->
        <div class="text-center md:text-left">
          <h1 class="text-3xl font-bold text-blue-700 mb-4">SaERTE - Superapps Rukun Tetangga</h1>
          <p class="text-gray-600 text-lg mb-6">
            Solusi Digital Terintegrasi untuk Lingkungan RT, RW, hingga Kelurahan/Desa
          </p>

          <div class="flex flex-wrap justify-center md:justify-start gap-4">
            <a href="/register"
              class="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
              <span>Daftar Sekarang</span>
            </a>
          </div>
        </div>

        <!-- Phone Mockup -->
        <div class="relative w-full md:w-1/2 flex justify-center">
          <img src="/beranda.png" alt="Mockup 1" class="w-[160px] rotate-[-12deg] drop-shadow-xl z-10" />
          <img src="/beranda.png" alt="Mockup 2" class="w-[160px] rotate-[10deg] -ml-8 drop-shadow-xl z-0" />
        </div>
      </div>
    </section>


    <section class="px-4 py-8 bg-white shadow-sm">
      <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">Fitur SaERTE</h2>
      <p class="text-sm text-gray-600 mb-6 text-center">SaERTE sangat kaya dengan berbagai fitur dan kemampuan dalam
        mengelola lingkungan.</p>

      <div class="grid grid-cols-1 gap-6">
        <div v-for="(card, index) in paginatedCards" :key="index"
          class="bg-gray-100 p-4 rounded-lg shadow-sm flex items-start">
          <img :src="card.icon" :alt="card.title" class="w-10 h-auto mr-4 flex-shrink-0" />
          <div>
            <h3 class="font-bold text-blue-600 text-lg">{{ card.title }}</h3>
            <p class="text-sm text-gray-700">{{ card.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Pagination Button -->
      <div class="flex justify-center items-center gap-3 pt-5">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
          Sebelumnya
        </button>
        <span class="text-sm text-gray-600">Halaman {{ currentPage }} dari {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
          Selanjutnya
        </button>
      </div>
    </section>

    <section class="px-4 py-8 bg-blue-100">
      <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">E-Gate System</h2>
      <p class="text-sm text-gray-700 mb-6 text-center">Integrasi dengan sistem e-gate yang terintegrasi dengan data
        warga untuk keamanan yang lebih baik.</p>
      <div class="flex flex-col items-center space-y-4">
        <div class="flex items-center bg-white p-3 rounded-lg shadow-sm w-full max-w-xs">
          <img src="/beranda.png" alt="Icon Cepat" class="w-8 h-8 mr-3 flex-shrink-0">
          <p class="text-sm text-gray-700">Mencatat dan lapor keluar masuk warga dengan cepat.</p>
        </div>
        <div class="flex items-center bg-white p-3 rounded-lg shadow-sm w-full max-w-xs">
          <img src="/beranda.png" alt="Icon Akurat" class="w-8 h-8 mr-3 flex-shrink-0">
          <p class="text-sm text-gray-700">Informasi yang terlindungi dengan sistem keamanan yang andal.</p>
        </div>
      </div>
      <img
        src="https://cdn.dribbble.com/userupload/7788725/file/original-214b6938dc058dfdb75afb644c91bd0d.png?resize=1024x768&vertical=center"
        alt="E-Gate System Illustration" class="w-full h-auto rounded-[10%] shadow-md mx-auto mt-6">
    </section>

    <section class="px-4 py-8 bg-white shadow-sm">
      <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">Q&A Seputar SaERTE</h2>
      <p class="text-sm text-gray-600 mb-6 text-center">Kadang banyak yang bertanya seputar SaERTE. Berikut adalah
        pertanyaan dan jawaban umum seputar aplikasi ini.</p>

      <div class="space-y-4">
        <div class="bg-gray-100 rounded-lg p-4 shadow-sm">
          <h3 class="font-bold text-blue-600 mb-2">Pertanyaan Umum</h3>
          <details class="mb-2">
            <summary class="font-semibold text-gray-700 cursor-pointer text-sm">Apa itu SaERTE?</summary>
            <p class="text-sm text-gray-600 mt-2">SaERTE adalah sebuah aplikasi digital berbasis web yang dirancang
              untuk membantu penataan dan pengelolaan data warga, administrasi, keuangan, serta penyampaian informasi di
              lingkungan Rukun Tetangga (RT).</p>
          </details>
          <details class="mb-2">
            <summary class="font-semibold text-gray-700 cursor-pointer text-sm">Apakah SaERTE bisa digunakan untuk RW
              dan Desa?</summary>
            <p class="text-sm text-gray-600 mt-2">Ya, SaERTE dirancang fleksibel untuk mengakomodasi RT, RW, bahkan
              skala Kelurahan/Desa.</p>
          </details>
          <details>
            <summary class="font-semibold text-gray-700 cursor-pointer text-sm">Apakah ada biaya tambahan untuk update
              fitur?</summary>
            <p class="text-sm text-gray-600 mt-2">Update fitur minor biasanya gratis, untuk fitur mayor atau kustomisasi
              bisa ada biaya tambahan.</p>
          </details>
        </div>

        <div class="bg-gray-100 rounded-lg p-4 shadow-sm">
          <h3 class="font-bold text-blue-600 mb-2">Privasi & Keamanan Data</h3>
          <details class="mb-2">
            <summary class="font-semibold text-gray-700 cursor-pointer text-sm">Bagaimana SaERTE melindungi data warga?
            </summary>
            <p class="text-sm text-gray-600 mt-2">Kami menggunakan enkripsi data, firewall, dan mengikuti standar
              keamanan data internasional.</p>
          </details>
          <details>
            <summary class="font-semibold text-gray-700 cursor-pointer text-sm">Apakah data saya aman jika terjadi
              masalah teknis?</summary>
            <p class="text-sm text-gray-600 mt-2">Kami melakukan backup data secara berkala dan memiliki sistem
              pemulihan bencana.</p>
          </details>
        </div>
      </div>
    </section>

    <section class="px-4 py-8 bg-blue-700 text-white text-center">
      <h2 class="text-xl font-bold mb-6">Bersama Kami, Tingkatkan Lingkungan Anda</h2>
      <div class="grid grid-cols-2 gap-4 text-center">
        <div>
          <p class="text-3xl font-bold">100+</p>
          <p class="text-sm">Jumlah Komunitas Aktif</p>
        </div>
        <div>
          <p class="text-3xl font-bold">2.400</p>
          <p class="text-sm">Jumlah Pengguna Aktif</p>
        </div>
        <div>
          <p class="text-3xl font-bold">20.3K</p>
          <p class="text-sm">Jumlah Transaksi Bulanan</p>
        </div>
        <div>
          <p class="text-3xl font-bold">50</p>
          <p class="text-sm">Jumlah Fitur Tersedia</p>
        </div>
      </div>
    </section>

    <section class="px-4 py-8 bg-white shadow-sm">
      <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">Bergabung Bersama Kami</h2>
      <p class="text-sm text-gray-600 mb-6 text-center">Cukup anda siapkan komitment maka kami akan bantu anda menjadi
        RT/RW yang siap beradaptasi tanpa harus memikirkan pengolahan data dan laporan.</p>

      <div class="space-y-4">
        <div class="bg-blue-100 p-4 rounded-lg shadow-sm text-center">
          <h3 class="font-bold text-blue-700 text-lg mb-2">Sampaikan pada kami apa yang anda butuhkan</h3>
          <p class="text-sm text-gray-700">Kami akan menyediakan solusi terbaik untuk kebutuhan Anda.</p>
          <button class="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-blue-700">Mulai
            Diskusi</button>
        </div>
        <div class="bg-green-100 p-4 rounded-lg shadow-sm text-center">
          <h3 class="font-bold text-green-700 text-lg mb-2">Menjadi Bagian Dari SaERTE</h3>
          <p class="text-sm text-gray-700">Anda dapat berkontribusi dalam pengembangan aplikasi kami.</p>
          <button
            class="mt-4 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-green-700">Daftar
            Sekarang</button>
        </div>
        <div class="bg-purple-100 p-4 rounded-lg shadow-sm text-center">
          <h3 class="font-bold text-purple-700 text-lg mb-2">Berkembang Bersama untuk Indonesia</h3>
          <p class="text-sm text-gray-700">Membangun lingkungan digital yang lebih baik untuk masyarakat.</p>
          <button
            class="mt-4 bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-purple-700">Pelajari
            Lebih Lanjut</button>
        </div>
      </div>
    </section>

    <footer class="bg-gray-800 text-white py-6 px-4 text-center text-xs">
      <p>&copy; {{ currentYear }} SaERTE. All rights reserved.</p>
      <p class="mt-1">Powered by Sarana Teknologi Nusantara</p>
      <div class="flex justify-center mt-4 space-x-4">
        <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-facebook-f"></i></a>
        <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-twitter"></i></a>
        <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-instagram"></i></a>
        <a href="#" class="text-gray-400 hover:text-white"><i class="fab fa-linkedin-in"></i></a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "MobileLandingPage",
  data() {
    return {
      isLoggedIn: false,
      currentYear: new Date().getFullYear(),
      pageSize: 3,
      currentPage: 1,
      cards: [
        { title: "Kelola Data Warga", icon: "/beranda.png", desc: "Pencatatan data identitas, keluarga, status kependudukan, dan keanggotaan secara rapi dan terstruktur." },
        { title: "Iuran Warga", icon: "/beranda.png", desc: "Pencatatan dan pelacakan iuran rutin maupun insidental, dengan histori pembayaran yang jelas dan transparan." },
        { title: "Saran & Aduan", icon: "/beranda.png", desc: "Saluran resmi bagi warga untuk menyampaikan aspirasi, usulan, atau keluhan kepada pengurus secara langsung." },
        { title: "Bank Sampah", icon: "/beranda.png", desc: "Pengelolaan sampah berbasis tabungan, mendukung kegiatan ekonomi dan pelestarian lingkungan secara berkelanjutan." },
        { title: "Koperasi Warga", icon: "/beranda.png", desc: "Fasilitas pengelolaan koperasi simpan pinjam dan usaha bersama warga dengan pencatatan digital yang mudah diakses." },
        { title: "Akses Pengurus", icon: "/beranda.png", desc: "Alat bantu bagi pengurus RT/RW dalam mengelola data, membuat laporan, memantau kegiatan warga, dan mengambil keputusan berbasis data." },
        { title: "Dashboard & Statistik", icon: "/beranda.png", desc: "Penyajian data dalam bentuk grafik dan statistik interaktif untuk memudahkan monitoring dan evaluasi lingkungan." },
        { title: "Login Pengguna", icon: "/beranda.png", desc: "Masuk untuk mengakses layanan pribadi dan komunitas Anda secara aman dan cepat." }
      ]

    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.cards.length / this.pageSize);
    },
    paginatedCards() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.cards.slice(start, start + this.pageSize);
    },
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
  },
  mounted() {
    // Ini baru jalan dengan benar
    this.isLoggedIn = !!localStorage.getItem("authToken");
  },
};
</script>
