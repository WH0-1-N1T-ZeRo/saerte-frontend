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
import BankSampahPengurus from '@/views/Pengurus/BankSampah/BankSampahPage.vue';
import FormBankSampah from '@/views/Pengurus/BankSampah/FormBankSampah.vue';

// 📁 views/
import ChatListPage from '@/views/ChatListPage.vue';
import ChatRoomPage from '@/views/ChatRoomPage.vue';

// 📁 views/WasteItem
import WasteItem from '@/views/Pengurus/WasteItem/WasteItem.vue';
import FormWasteItem from '@/views/Pengurus/WasteItem/FormWasteItem.vue';

// Type User
import { useUserStore } from '@/stores/user';
// 📁 views/WasteItem
import MenuPengurus from '@/views/MenuPengurus.vue';
import PengurusBank from '@/views/Pengurus/BankSampah/Bank.vue';
import MenuWarga from '@/views/MenuWarga.vue';
import FormPenarikan from '@/views/Pengurus/BankSampah/FormPenarikan.vue';
import PengurusIuran from '@/views/Pengurus/Iuran/PengurusIuran.vue';


const routes = [
  { path: '/login', name: 'Login', component: LoginPage, meta: { guestOnly: true, requiresAuth: false, title: 'Login SaERTE' } },
  { path: '/register', name: 'Register', component: Register, meta: { guestOnly: true, requiresAuth: false, title: 'Daftar SaERTE' } },
  { path: '/lupa-sandi', name: 'ResetPassword', component: ResetPassword, meta: { guestOnly: true, requiresAuth: false, title: 'Lupa Sandi' } },

  { path: '/', name: 'Landing', component: LandingPage, meta: { requiresAuth: false, title: 'SaERTE' } },
  { path: '/Beranda', name: 'Beranda', component: MenuWarga, meta: { requiresAuth: true, title: 'SaERTE - v.1.25.6.22' } },
  { path: '/Pengurus', name: 'MenuPengurus', component: MenuPengurus, meta: { requiresAuth: true, title: 'SaERTE - Pengurus' } },


  { path: '/profile', name: 'Profil', component: ProfilePage, meta: { requiresAuth: true, title: 'Profil' } },
  { path: '/profile/edit', name: 'Edit Profil', component: EditProfile, meta: { requiresAuth: true, title: 'Edit Profil' } },

  { path: '/master-warga', name: 'MasterWarga', component: MasterWargaPage, meta: { requiresAuth: true, title: 'Master Warga' } },

  // { path: '/dashboard', name: 'Dashboard', component: DashboardPage, meta: { requiresAuth: true, title: 'Dashboard RT' } },

  { path: '/waste-bank-pengurus', name: 'Pengurus', component: PengurusBank, meta: { requiresAuth: true, requiresAkses: 'Pengurus', title: 'Nasabah' } },
  { path: '/waste-item', name: 'Item-Sampah', component: WasteItem, meta: { requiresAuth: true, requiresAkses: 'Pengurus', title: 'Item Sampah' } },
  { path: '/waste-item/new', name: 'Form-Item-Sampah', component: FormWasteItem, meta: { requiresAuth: true, requiresAkses: 'Pengurus', title: 'Item Baru' } },

  { path: '/surat-pengantar', name: 'SuratPengantar', component: SuratPengantarPage, meta: { requiresAuth: true, title: 'Permintaan Surat' } },

  { path: '/kegiatan', name: 'Kegiatan', component: KegiatanPage, meta: { requiresAuth: true, title: 'Kegiatan RT' } },

  { path: '/saran-keluhan', name: 'SaranKeluhan', component: SaranKeluhanPage, meta: { requiresAuth: true, title: 'Saran dan Keluhan' } },

  { path: '/pengurus-iuran', name: 'PengurusIuran', component: PengurusIuran, meta: { requiresAuth: true, title: 'Pengurus Iuran' } },

  { path: '/iuran-warga', name: 'IuranWarga', component: IuranWargaPage, meta: { requiresAuth: true, title: 'Iuran Warga' } },
  { path: '/iuran/new', name: 'FormIuran', component: FormIuran, meta: { requiresAuth: true, title: 'Tambah Iuran' } },
  { path: '/iuran/edit/:id', name: 'EditIuran', component: FormIuranEdit, props: true, meta: { requiresAuth: true, title: 'Edit Iuran' } },

  { path: '/keuangan-rt', name: 'KeuanganRT', component: KeuanganRTPage, meta: { requiresAuth: true, title: 'Keuangan RT' } },

  { path: '/cctv', name: 'CCTV', component: CCTVPage, meta: { requiresAuth: true, title: 'Live CCTV RT' } },

  { path: '/bank', name: 'Bank', component: Bank, meta: { requiresAuth: true, title: 'Bank Sampah - Rekening' } },
  { path: '/bank-accont/register', name: 'AkunBank', component: FormBankAccount, meta: { requiresAuth: true, title: 'Daftar Akun Bank' } },
  { path: '/bank-sampah/:id', name: 'BankSampah', component: BankSampahPage, meta: { requiresAuth: true, title: 'Bank Sampah - Transaksi' } },
  { path: '/bank-sampah/pengurus/:id', name: 'BankSampahPengurus', component: BankSampahPengurus, meta: { requiresAuth: true,requiresAkses: 'Pengurus', title: 'Detail Nasabah' } },
  { path: '/bank-sampah/new', name: 'FormBankSampah', component: FormBankSampah, meta: { requiresAuth: true, title: 'Setoran Sampah' } },
  { path: '/bank-sampah/pengurus/widraw',name: 'FormPenarikan', component: FormPenarikan, meta: { requiresAuth: true,requiresAkses: 'Pengurus' , title: 'Penarikan Dana'} },

  { path: '/chat', name: 'ChatList', component: ChatListPage, meta: { requiresAuth: true, title: 'Obrolan RT' } },
  { path: '/chat/:id', name: 'ChatRoom', component: ChatRoomPage, props: true, meta: { requiresAuth: true, title: 'Obrolan', hideNav: true } },

  { path: '/:catchAll(.*)', redirect: { name: 'Landing' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiredAkses = to.meta.requiresAkses // misalnya 'pengurus' atau 'admin'

  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true'
  const loggedIn = !!localStorage.getItem('authToken');
  const userStore = useUserStore()

  if (requiresAuth && !isAuthenticated) {
    // Tidak login, redirect ke login
    return next({ name: 'Login' })
  }

   if (to.meta.guestOnly && loggedIn) {
    return next('/beranda'); // kalau udah login, cegah buka login
  }

  if (requiredAkses && userStore.profile.typeAkses !== requiredAkses) {
    // Login, tapi tidak punya akses sesuai meta.requiresAkses
    return next({ name: 'Landing' }) // Buatkan halaman ini kalau belum ada
  }

  next()
})


export default router;
