<template>
  <!-- Pembungkus FAB agar berada di kanan dalam batas max-w -->
  <div class="fixed bottom-18 left-0 right-0 z-50 flex justify-center">
    <div class="w-full max-w-[480px] relative px-8">
      <button
        class="absolute right-8 bottom-5 w-14 h-14 rounded-full bg-blue-500 text-white text-2xl flex items-center justify-center border-none shadow-lg cursor-pointer transition-all hover:bg-blue-700 hover:scale-105 active:scale-100"
        @click="handleClick"
      >
        <i class="fas fa-plus font-bold"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateButton',
  props: {
    // Properti 'to' untuk menentukan rute saat tombol diklik
    // Contoh: "/user/new", "/iuran/new"
    to: {
      type: String,
      required: true,
      default: '/' // Default fallback jika tidak disediakan (meskipun required)
    }
  },
  methods: {
    handleClick() {
      // Memastikan Vue Router terinstal dan digunakan
      if (this.$router) {
        this.$router.push(this.to)
          .then(() => {
            console.log(`Navigasi ke rute: ${this.to}`);
          })
          .catch(err => {
            // Tangani error navigasi (misalnya, jika rute tidak ditemukan)
            console.error(`Gagal navigasi ke rute ${this.to}:`, err);
            // Anda bisa menampilkan pesan error kepada pengguna di sini
            // (gunakan modal kustom, bukan alert)
          });
      } else {
        console.warn('Vue Router tidak terdeteksi. Tombol tidak dapat menavigasi.');
        console.log('Tombol "Buat" diklik! Harusnya ke rute:', this.to);
        // Jika Vue Router tidak ada, Anda mungkin ingin mengeluarkan event atau melakukan hal lain
        this.$emit('create');
      }
    }
  }
}
</script>

<!-- Tidak ada lagi bagian <style scoped> karena kita menggunakan Tailwind CSS -->
