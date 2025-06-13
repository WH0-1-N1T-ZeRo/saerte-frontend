<template>
  <button
    class="fixed bottom-18 right-5 w-16 h-16 rounded-full bg-blue-600 text-white text-2xl flex items-center justify-center border-none shadow-lg cursor-pointer transition-all hover:bg-blue-700 hover:scale-105 active:scale-50 z-50"
    @click="handleClick"
  >
    <i class="fas fa-plus"></i>
  </button>
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
