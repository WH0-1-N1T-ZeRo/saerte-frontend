<template>
  <div class="px-4 bg-gray-100 min-h-full">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Obrolan RT</h2>

      <div class="mb-4">
        <input
          type="text"
          placeholder="Cari kontak atau grup..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          v-model="searchQuery"
          @input="filterChats"
        />
      </div>

      <div class="space-y-3">
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Grup</h3>
        <div v-for="group in filteredGroups" :key="group.id" @click="goToChatRoom(group.id)" class="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer transition-colors duration-200">
          <div class="flex-shrink-0 w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl mr-4">
            <i class="fas fa-users"></i>
          </div>
          <div class="flex-grow max-w-[60%]">
            <p class="font-semibold text-gray-800 ">{{ group.name }}</p>
            <p class="text-gray-600 text-sm truncate">{{ group.lastMessage.sender }}: {{ group.lastMessage.text }}</p>
          </div>
          <p class="text-gray-500 text-xs ml-auto">{{ group.lastMessage.time }}</p>
        </div>
        <p v-if="filteredGroups.length === 0" class="text-center text-gray-500 italic py-2">Tidak ada grup yang cocok.</p>
      </div>

      <div class="space-y-3 mt-6">
        <h3 class="text-xl font-semibold text-gray-700 mb-2">Pesan Pribadi</h3>
        <div v-for="contact in filteredContacts" :key="contact.id" @click="goToChatRoom(contact.id)" class="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer transition-colors duration-200">
          <div class="flex-shrink-0 w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold text-xl mr-4">
            <i class="fas fa-user"></i>
          </div>
          <div class="flex-grow max-w-[60%]">
            <p class="font-semibold text-gray-800">{{ contact.name }}</p>
            <p class="text-gray-600 text-sm truncate">{{ contact.lastMessage.text }}</p>
          </div>
          <p class="text-gray-500 text-xs ml-auto">{{ contact.lastMessage.time }}</p>
        </div>
        <p v-if="filteredContacts.length === 0" class="text-center text-gray-500 italic py-2">Tidak ada kontak yang cocok.</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      chatGroups: [
        {
          id: 'group-rt',
          name: 'Grup Warga RT 002/001',
          lastMessage: { sender: 'Ketua RT', text: 'Pengumuman: Kerja bakti rutin hari Sabtu...', time: '10:30' }
        },
        {
          id: 'group-pengajian',
          name: 'Grup Pengajian Warga',
          lastMessage: { sender: 'Ustazah', text: 'Jadwal pengajian minggu ini diundur...', time: 'Kemarin' }
        },
      ],
      chatContacts: [
        {
          id: 'contact-budi',
          name: 'Budi Santoso',
          lastMessage: { text: 'Sudah di rumah ya, terima kasih', time: '12:00' }
        },
        {
          id: 'contact-siti',
          name: 'Siti Aminah',
          lastMessage: { text: 'Nanti sore bisa datang rapat?', time: 'Kemarin' }
        },
        {
          id: 'contact-bendahara',
          name: 'Bendahara RT',
          lastMessage: { text: 'Iuran bulan ini sudah saya catat', time: 'Selasa' }
        },
      ],
      filteredGroups: [],
      filteredContacts: [],
    };
  },
  created() {
    this.filterChats(); // Initialize lists
  },
  methods: {
    filterChats() {
      const query = this.searchQuery.toLowerCase();
      this.filteredGroups = this.chatGroups.filter(group =>
        group.name.toLowerCase().includes(query) ||
        group.lastMessage.text.toLowerCase().includes(query) ||
        group.lastMessage.sender.toLowerCase().includes(query)
      );
      this.filteredContacts = this.chatContacts.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.lastMessage.text.toLowerCase().includes(query)
      );
    },
    goToChatRoom(chatId) {
      this.$router.push({ name: 'ChatRoom', params: { id: chatId } });
    }
  }
};
</script>

<style scoped>
/* Optional scoped styles */
</style>