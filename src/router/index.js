import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/views/LoginPage.vue';
import LandingPage from '@/views/LandingPage.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import SuratPengantarPage from '@/views/MainMenu/SuratPengantarPage.vue';
import MasterWargaPage from '@/views/MasterWargaPage.vue';
import KegiatanPage from '@/views/MainMenu/KegiatanPage.vue';
import SaranKeluhanPage from '@/views/MainMenu/SaranKeluhanPage.vue';
import IuranWargaPage from '@/views/MainMenu/IuranWargaPage.vue';
import KeuanganRTPage from '@/views/MainMenu/KeuanganRTPage.vue';
import ChatListPage from '@/views/ChatListPage.vue'; // NEW
import ChatRoomPage from '@/views/ChatRoomPage.vue'; // Renamed
import DashboardPage from '@/views/MainMenu/DashboardPage.vue';
import BankSampahPage from '@/views/MainMenu/BankSampahPage.vue'; // NEW
import CCTVPage from '@/views/MainMenu/CCTVPage.vue'; // Import CCTVPage
import FormIuran from '@/views/Form/FormIuran.vue'; // Import FormIuran
import FormIuranEdit from '@/views/Form/FormIuranEdit.vue'
import FormBankSampah from '@/views/Form/FormBankSampah.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresAuth: false, title: 'Masuk SaERTE' }
  },
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: { requiresAuth: true, title: 'SaERTE - v.01' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true, title: 'Profil Saya' }
  },
  {
    path: '/surat-pengantar',
    name: 'SuratPengantar',
    component: SuratPengantarPage,
    meta: { requiresAuth: true, title: 'Permintaan Surat' }
  },
  {
    path: '/master-warga',
    name: 'MasterWarga',
    component: MasterWargaPage,
    meta: { requiresAuth: true, title: 'Master Warga' }
  },
  {
    path: '/cctv', // Path for CCTV
    name: 'CCTV',
    component: CCTVPage,
  },
  {
    path: '/kegiatan',
    name: 'Kegiatan',
    component: KegiatanPage,
    meta: { requiresAuth: true, title: 'Kegiatan RT' }
  },
  {
    path: '/saran-keluhan',
    name: 'SaranKeluhan',
    component: SaranKeluhanPage,
    meta: { requiresAuth: true, title: 'Saran dan Keluhan' }
  },
  {
    path: '/iuran-warga',
    name: 'IuranWarga',
    component: IuranWargaPage,
    meta: { requiresAuth: true, title: 'Iuran Warga' }
  },
  {
    path: '/keuangan-rt',
    name: 'KeuanganRT',
    component: KeuanganRTPage,
    meta: { requiresAuth: true, title: 'Keuangan RT' }
  },
  { // NEW CHAT LIST ROUTE
    path: '/chat',
    name: 'ChatList',
    component: ChatListPage,
    meta: { requiresAuth: true, title: 'Obrolan RT' }
  },
  { // NEW CHAT ROOM ROUTE
    path: '/chat/:id',
    name: 'ChatRoom',
    component: ChatRoomPage,
    props: true, // Pass route params as props to component
    meta: { requiresAuth: true, title: 'Obrolan', hideNav: true } // Hide nav for chat room
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true, title: 'Dashboard RT' }
  },
  { // NEW ROUTE
    path: '/bank-sampah',
    name: 'BankSampah',
    component: BankSampahPage,
    meta: { requiresAuth: true, title: 'Bank Sampah RT' }
  },
  {
    path: '/bank-sampah/new',
    name: 'FormBankSampah',
    component: FormBankSampah,
    meta: { requiresAuth: true, title: 'Tambah Setoran Sampah' }
  },

  // Redirect ke login jika path tidak ditemukan dan belum login
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'Login' }
  },
  {
    path: '/iuran/new',
    name: 'FormIuran',
    component: FormIuran,
    meta: { requiresAuth: true, title: 'Iuran' }
  },
  {
    path: '/iuran/edit/:id',
    name: 'EditIuran',
    component: FormIuranEdit,
    props: true, // agar id bisa diterima sebagai prop
    meta: { requiresAuth: true, title: 'Edit Iuran' }
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Basic Navigation Guard (untuk simulasi login)
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Simulasi status login
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && isLoggedIn) {
    next({ name: 'Landing' });
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title = to.meta.title || 'SaERTE';
});

export default router;
