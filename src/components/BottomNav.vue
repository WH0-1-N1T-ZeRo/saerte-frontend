<template>
  <div class="fixed bottom-0 left-0 right-0 flex justify-center z-10">
    <nav class="w-full max-w-[480px] bg-white border-t border-gray-200 shadow-lg flex justify-around py-2">
      <router-link to="/beranda" class="flex flex-col items-center text-xl p-2 rounded-lg transition-colors duration-200"
        :class="{ 'text-blue-600': $route.path === '/Beranda', 'text-gray-500': $route.path !== '/Beranda' }">
        <i class="fas fa-home text-md mb-1"></i>
        <!-- <span>Beranda</span> -->
      </router-link>
      <router-link v-if="profile.typeAkses == 'Pengurus'" to="/pengurus"
        class="flex flex-col items-center text-xl p-2 rounded-lg transition-colors duration-200"
        :class="{ 'text-blue-600': $route.path.startsWith('/pengurus'), 'text-gray-500': !$route.path.startsWith('/pengurus') }">
        <i class="fas fa-users text-md mb-1"></i>
        <!-- <span>Warga</span> -->
      </router-link>
      <router-link to="/artikel"
        class="flex flex-col items-center text-xl p-2 rounded-lg transition-colors duration-200"
        :class="{ 'text-blue-600': $route.path.startsWith('/artikel'), 'text-gray-500': !$route.path.startsWith('/artikel') }">
        <i class="fas fa-newspaper text-md mb-1"></i>
        <!-- <span>Warga</span> -->
      </router-link>
      <router-link to="/chat" class="flex flex-col items-center text-xl p-2 rounded-lg transition-colors duration-200"
        :class="{ 'text-blue-600': $route.path === '/chat', 'text-gray-500': $route.path !== '/chat' }">
        <i class="fas fa-comment-dots text-md mb-1"></i>
        <!-- <span>Ngobrol</span> -->
      </router-link>
      <router-link to="/profile"
        class="flex flex-col items-center text-xl p-2 rounded-lg transition-colors duration-200"
        :class="{ 'text-blue-600': $route.path === '/profile', 'text-gray-500': $route.path !== '/profile' }">
        <i class="fas fa-user text-md mb-1"></i>
        <!-- <span>Profil</span> -->
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { profile } = storeToRefs(userStore)

</script>