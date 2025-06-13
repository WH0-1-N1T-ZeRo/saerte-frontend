<template>
  <div class="flex flex-col h-screen bg-gray-100">
    <div class="bg-blue-600 p-4 text-white shadow-md flex items-center fixed top-0 left-0 w-full z-10">
      <button @click="goBack" class="text-white text-xl mr-4">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1 class="text-xl font-semibold flex-grow">{{ chatName }}</h1>
      <button @click="showInfo" class="text-white text-xl ml-4">
        <i class="fas fa-info-circle"></i>
      </button>
    </div>

    <div class="flex-grow overflow-y-auto p-4 pt-5 pb-4 relative">
      <div v-for="msg in messages" :key="msg.id" :class="{'text-right': msg.sender === 'Anda'}" class="mb-4">
        <div :class="{
            'bg-green-200 ml-auto': msg.sender === 'Anda',
            'bg-white mr-auto': msg.sender !== 'Anda'
          }" class="inline-block p-3 rounded-lg max-w-[80%] shadow-sm">
          <p class="font-semibold text-sm mb-1" :class="{'text-green-800': msg.sender === 'Anda', 'text-gray-800': msg.sender !== 'Anda'}" v-if="msg.sender !== 'Anda'">{{ msg.sender }}</p>
          <p class="text-gray-800">{{ msg.text }}</p>
          <p class="text-gray-600 text-xs mt-1">{{ msg.timestamp }}</p>
        </div>
      </div>
      <p v-if="messages.length === 0" class="text-center text-gray-500 italic mt-8">Mulai percakapan Anda di sini.</p>
      <div ref="messagesEnd"></div> </div>

    <div class="bg-white p-4 shadow-md flex items-center fixed bottom-0 left-0 w-full z-10">
      <input
        type="text"
        v-model="newMessage"
        placeholder="Ketik pesan..."
        class="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keyup.enter="sendMessage"
      />
      <button
        @click="sendMessage"
        :disabled="!newMessage.trim()"
        class="ml-3 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id'], // Menerima ID chat dari route parameter
  data() {
    return {
      chatName: 'Memuat...', // Akan diisi berdasarkan ID
      newMessage: '',
      messages: [],
      allChatData: {
        'group-rt': {
          name: 'Grup Warga RT 002/001',
          messages: [
            { id: 1, sender: 'Ketua RT', text: 'Assalamualaikum Bapak/Ibu, Pengumuman: Kerja bakti rutin akan dilaksanakan pada Sabtu, 15 Juni 2025 pukul 07.00 WIB. Mohon partisipasinya.', timestamp: '10 Juni 2025, 14:30' },
            { id: 2, sender: 'Anda', text: 'Waalaikumsalam Pak RT, siap laksanakan!', timestamp: '10 Juni 2025, 14:35' },
            { id: 3, sender: 'Budi Santoso', text: 'Izin bertanya Pak RT, apakah ada alat yang perlu dibawa dari rumah?', timestamp: '10 Juni 2025, 14:40' },
            { id: 4, sender: 'Ketua RT', text: 'Cukup bawa alat kebersihan pribadi seperti sapu, cangkul kecil, atau sabit. Terima kasih.', timestamp: '10 Juni 2025, 14:45' },
          ]
        },
        'group-pengajian': {
          name: 'Grup Pengajian Warga',
          messages: [
            { id: 1, sender: 'Ustazah', text: 'Assalamu\'alaikum Wr. Wb. Jamaah sekalian, untuk jadwal pengajian minggu ini diundur menjadi hari Ahad, 16 Juni pukul 19.30 karena ada kegiatan lain. Mohon maklum.', timestamp: '09 Juni 2025, 18:00' },
            { id: 2, sender: 'Siti Aminah', text: 'Waalaikumsalam Wr. Wb. Baik Ustazah, terima kasih infonya.', timestamp: '09 Juni 2025, 18:05' },
          ]
        },
        'contact-budi': {
          name: 'Budi Santoso',
          messages: [
            { id: 1, sender: 'Budi Santoso', text: 'Halo, tadi berkas surat pengantar saya sudah bisa diambil belum ya?', timestamp: '11 Juni 2025, 09:30' },
            { id: 2, sender: 'Anda', text: 'Halo Budi, sudah bisa. Silakan diambil di pos RT ya.', timestamp: '11 Juni 2025, 09:35' },
            { id: 3, sender: 'Budi Santoso', text: 'Oke, terima kasih banyak!', timestamp: '11 Juni 2025, 09:40' },
          ]
        },
        'contact-siti': {
            name: 'Siti Aminah',
            messages: [
                { id: 1, sender: 'Siti Aminah', text: 'Assalamu\'alaikum, Mbak. Apa kabarmu?', timestamp: '10 Juni 2025, 15:00' },
                { id: 2, sender: 'Anda', text: 'Waalaikumsalam, Alhamdulillah baik Bu Siti. Ada apa ya?', timestamp: '10 Juni 2025, 15:05' },
            ]
        },
        'contact-bendahara': {
            name: 'Bendahara RT',
            messages: [
                { id: 1, sender: 'Bendahara RT', text: 'Selamat pagi. Iuran bulan Mei sudah tercatat lunas ya.', timestamp: '05 Mei 2025, 10:00' },
                { id: 2, sender: 'Anda', text: 'Baik Pak/Bu Bendahara, terima kasih informasinya.', timestamp: '05 Mei 2025, 10:05' },
            ]
        }
      }
    };
  },
  created() {
    this.loadChatData();
  },
  watch: {
    // Watch for changes in route ID to load new chat data
    '$route.params.id': 'loadChatData'
  },
  methods: {
    loadChatData() {
      const chat = this.allChatData[this.id];
      if (chat) {
        this.chatName = chat.name;
        this.messages = [...chat.messages]; // Create a copy to avoid modifying original data
      } else {
        this.chatName = 'Chat Tidak Ditemukan';
        this.messages = [{ id: 0, sender: 'System', text: 'Obrolan ini tidak ditemukan.', timestamp: '' }];
      }
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    sendMessage() {
      if (this.newMessage.trim() === '') return;

      const newId = this.messages.length ? Math.max(...this.messages.map(m => m.id)) + 1 : 1;
      const now = new Date();
      const timestamp = now.toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      this.messages.push({
        id: newId,
        sender: 'Anda',
        text: this.newMessage.trim(),
        timestamp: timestamp
      });
      this.newMessage = '';
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      if (this.$refs.messagesEnd) {
        this.$refs.messagesEnd.scrollIntoView({ behavior: 'smooth' });
      }
    },
    goBack() {
      this.$router.push({ name: 'ChatList' });
    },
    showInfo() {
      alert(`Info chat untuk: ${this.chatName}\nID: ${this.id}\n(Fitur detail info akan dikembangkan)`);
    }
  },
  mounted() {
    this.scrollToBottom();
  }
};
</script>

<style scoped>
/* Ensure the overall container takes full height */
.h-screen {
  height: 100vh; /* Use 100vh to ensure it spans full viewport height */
}

/* Adjust padding-top for fixed header and padding-bottom for fixed input */
.p-4.pt-20.pb-4 {
    padding-top: calc(4rem + 16px); /* Navbar height (64px/4rem) + some extra spacing */
    padding-bottom: calc(4rem + 16px); /* Input area height + some extra spacing */
}
</style>