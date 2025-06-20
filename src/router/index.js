import { createRouter, createWebHistory } from 'vue-router';

// 📁 views/Auth
import LoginPage from '@/views/Auth/LoginPage.vue';
import Register from '@/views/Auth/Register.vue';
import ResetPassword from '@/views/Auth/ResetPassword.vue';

import ProfilePage from '@/views/Auth/ProfilePage.vue';
import EditProfile from '@/views/Auth/EditProfile.vue';

// 📁 views/
import LandingPage from '@/views/LandingPage.vue';
import MasterWargaPage from '@/views/MasterWargaPage.vue';

// import DashboardPage from '@/views/MainMenu/DashboardPage.vue';

// 📁 views/SuratPengantar/
import SuratPengantarPage from '@/views/SuratPengantar/SuratPengantarPage.vue';

// 📁 views/Kegiatan/
import KegiatanPage from '@/views/Kegiatan/KegiatanPage.vue';

// 📁 views/Saran/
import SaranKeluhanPage from '@/views/Saran/SaranKeluhanPage.vue';

// 📁 views/Iuran/
import IuranWargaPage from '@/views/Iuran/IuranWargaPage.vue';
import FormIuran from '@/views/Iuran/FormIuran.vue';
import FormIuranEdit from '@/views/Iuran/FormIuranEdit.vue';

// 📁 views/Keuangan/
import KeuanganRTPage from '@/views/Keuangan/KeuanganRTPage.vue';

// 📁 views/BankSampah/
import Bank from '@/views/BankSampah/Bank.vue';
import FormBankAccount from '@/views/BankSampah/FormBankAccount.vue';
import BankSampahPage from '@/views/BankSampah/BankSampahPage.vue';

// 📁 views/CCTV/
import CCTVPage from '@/views/CCTV/CCTVPage.vue';

// 📁 views/Form/
import FormBankSampah from '@/views/BankSampah/FormBankSampah.vue';

// 📁 views/
import ChatListPage from '@/views/ChatListPage.vue';
import ChatRoomPage from '@/views/ChatRoomPage.vue';

const routes = [
  { path: '/login', name: 'Login', component: LoginPage, meta: { requiresAuth: false, title: 'SaERTE' } },
  { path: '/register', name: 'Register', component: Register, meta: { requiresAuth: false, title: 'Daftar SaERTE' } },
  { path: '/lupa-sandi', name: 'ResetPassword', component: ResetPassword, meta: { requiresAuth: false, title: 'Lupa Sandi' } },
  { path: '/', name: 'Landing', component: LandingPage, meta: { requiresAuth: true, title: 'SaERTE - v.01' } },

  { path: '/profile', name: 'Profil', component: ProfilePage, meta: { requiresAuth: true, title: 'Profil' } },
  { path: '/profile/edit', name: 'Edit Profil', component: EditProfile, meta: { requiresAuth: true, title: 'Edit Profil' } },

  { path: '/master-warga', name: 'MasterWarga', component: MasterWargaPage, meta: { requiresAuth: true, title: 'Master Warga' } },

  // { path: '/dashboard', name: 'Dashboard', component: DashboardPage, meta: { requiresAuth: true, title: 'Dashboard RT' } },

  { path: '/surat-pengantar', name: 'SuratPengantar', component: SuratPengantarPage, meta: { requiresAuth: true, title: 'Permintaan Surat' } },

  { path: '/kegiatan', name: 'Kegiatan', component: KegiatanPage, meta: { requiresAuth: true, title: 'Kegiatan RT' } },

  { path: '/saran-keluhan', name: 'SaranKeluhan', component: SaranKeluhanPage, meta: { requiresAuth: true, title: 'Saran dan Keluhan' } },

  { path: '/iuran-warga', name: 'IuranWarga', component: IuranWargaPage, meta: { requiresAuth: true, title: 'Iuran Warga' } },
  { path: '/iuran/new', name: 'FormIuran', component: FormIuran, meta: { requiresAuth: true, title: 'Tambah Iuran' } },
  { path: '/iuran/edit/:id', name: 'EditIuran', component: FormIuranEdit, props: true, meta: { requiresAuth: true, title: 'Edit Iuran' } },

  { path: '/keuangan-rt', name: 'KeuanganRT', component: KeuanganRTPage, meta: { requiresAuth: true, title: 'Keuangan RT' } },

  { path: '/cctv', name: 'CCTV', component: CCTVPage, meta: { requiresAuth: true, title: 'Live CCTV RT' } },

  { path: '/bank', name: 'Bank', component: Bank, meta: { requiresAuth: true, title: 'Bank Sampah - Rekening' } },
  { path: '/bank-accont/new', name: 'AkunBank', component: FormBankAccount, meta: { requiresAuth: true, title: 'Daftar Akun Bank' } },
  { path: '/bank-sampah/:id', name: 'BankSampah', component: BankSampahPage, meta: { requiresAuth: true, title: 'Bank Sampah - Transaksi' } },
  { path: '/bank-sampah/new', name: 'FormBankSampah', component: FormBankSampah, meta: { requiresAuth: true, title: 'Setoran Sampah' } },
  // { path: '/bank-sampah/edit/:id',name: 'FormBankSampah', component: FormBankSampah, meta: { requiresAuth: true, title: 'Tambah Setoran Sampah'} },

  { path: '/chat', name: 'ChatList', component: ChatListPage, meta: { requiresAuth: true, title: 'Obrolan RT' } },
  { path: '/chat/:id', name: 'ChatRoom', component: ChatRoomPage, props: true, meta: { requiresAuth: true, title: 'Obrolan', hideNav: true } },

  // { path: '/:catchAll(.*)', redirect: { name: 'Login' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Guard login sederhana
// router.beforeEach((to, from, next) => {
//   // const isLoggedIn = 'true'; // Bypass login protection
  
//   if (to.meta.requiresAuth && !isLoggedIn) {
//     next({ name: 'Login' });
//   } else if (to.name === 'Login' && isLoggedIn) {
//     next({ name: 'Landing' });
//   } else {
//     next();
//   }
// });
// Contoh Navigation Guard untuk cek otentikasi
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // const isAuthenticated = localStorage.getItem('token'); // Asumsi token disimpan di localStorage
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login' }); // Redirect ke login jika tidak terotentikasi
  } else {
    next();
  }
});

// ✅ Set judul halaman
router.afterEach((to) => {
  document.title = to.meta.title || 'SaERTE';
});

export default router;
