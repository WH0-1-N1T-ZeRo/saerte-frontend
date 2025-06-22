<template>
  <div class="bg-gray-100 min-h-full">
    <div class="bg-white p-6 shadow-md mb-6 min-h-full w-full">
      <div class="grid grid-cols-1 gap-4">
        <div>
          <div v-if="selectedLoading" class="text-center text-gray-600 py-4">
            Memuat detail rekening...
          </div>
          <div v-else-if="selectedError" class="text-center text-red-600 py-4">
            Error: {{ selectedError }}
          </div>
          <div v-else-if="selectedBank" class="rounded-2xl mb-4 bg-gray-200 border border-gray-400 pt-4 shadow-md">
            <div class="flex items-center justify-between">
              <div class="">
                <p class="text-gray-700 text-xl text-start ms-4">
                  <span class="font-bold text-gray-800">{{ selectedBank.bank }}</span>
                </p>
                <p class="text-gray-700 text-xl text-start mb-2 ms-4">
                  <span class="text-gray-800">{{ selectedBank.account }}</span>
                </p>
              </div>
              <p class="text-gray-700 text-4xl text-end mb-2 mr-4">
                <span class="font-bold text-gray-800">{{ selectedBank.balance }}</span>
              </p>
            </div>
            <div class="grid grid-cols-2">
              <p class="text-gray-700 text-sm text-center mb-2">
                Proses Setor: <span class="font-bold text-gray-800">
                  {{ Bank_trx_in }} </span>
              </p>
              <p class="text-gray-700 text-sm text-center mb-2">
                Proses Tarik: <span class="font-bold text-gray-800">
                  {{ Bank_trx_out }} </span>
              </p>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 py-4">
            Tidak ada detail rekening yang dipilih.
          </div>

          <!-- <h3 class="text-xl font-semibold text-gray-700 mb-4 mt-6">Riwayat Transaksi</h3> -->
          <div v-if="selectedLoading" class="text-center text-gray-600">
            Memuat riwayat transaksi...
          </div>
          <div v-else-if="selectedError" class="text-center text-red-600">
            Gagal memuat riwayat: {{ selectedError }}
          </div>
          <div v-else-if="selectedTransactions.length === 0" class="text-center text-gray-500 italic py-4">
            Belum ada riwayat transaksi untuk rekening ini.
          </div>
          <div v-else class="space-y-3">
            <div class="flex justify-between gap-4 mt-4">
              <!-- Tombol Deposit -->
              <a href="/bank-sampah/new"
                class="w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out">
                Deposit
              </a>

              <!-- Tombol Withdraw -->
              <a href="/bank-sampah/pengurus/widraw"
                class="w-full text-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out">
                Withdraw
              </a>
            </div>
            <div v-for="transaction in selectedTransactions" :key="transaction.id"
              class="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm">
              <div class="flex justify-between items-center text-sm font-semibold mb-1">
                <span class="text-gray-700">
                  {{ transaction.date }} / {{ transaction.number }}
                </span>
                <span :class="{
                  'bg-green-300 text-gray-800': transaction.status === 'done',
                  'bg-yellow-300 text-gray-800': transaction.status === 'draft',
                  'bg-red-300 text-gray-800': transaction.status === 'cancelled' || transaction.status === 'rejected',
                  // 'bg-gray-300 text-gray-800': transaction.status === 'draft',
                }" class="px-2 py-0.5 rounded-full text-xs font-semibold uppercase">
                  {{ transaction.status }}
                </span>
              </div>
              <div class="flex justify-between">
                <p class="text-gray-600 text-base">
                  <span class="">
                    {{ transaction.reference }}
                  </span>
                </p>
                <p v-if="transaction.amount" class="text-gray-800 text-base font-bold">
                  {{ transaction.amount }}
                </p>
              </div>
              <p v-if="transaction.description" class="text-gray-600 text-xs mt-1">
                Catatan: {{ transaction.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'; // Tambahkan 'ref'
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useBankStore } from '@/stores/bank-sampah';

const route = useRoute();
const bankStore = useBankStore();

const {
  banks, // `banks` adalah array semua rekening
  selectedBank, // `selectedBank` adalah detail rekening yang sedang dilihat
  selectedTransactions,
  selectedLoading,
  selectedError,
} = storeToRefs(bankStore);

// Deklarasikan ref baru untuk menyimpan nama bank yang akan ditampilkan
const bankName = ref('');
const bankNominal = ref('');
const Bank_trx_in = ref('');
const Bank_trx_out = ref('');

// --- Fungsi formatCurrency yang sudah diperbaiki ---
const formatCurrency = (val) => {
  // Cek jika nilai null, undefined, atau 0
  if (val === null || val === undefined || val === 0) {
    return '-'; // Tampilkan '-'
  }

  // Gunakan NumberFormat untuk memformat angka
  const formattedValue = new Intl.NumberFormat('id-ID', {
    // style: 'currency', // Hapus baris ini untuk menghilangkan simbol mata uang
    // currency: 'IDR',    // Hapus baris ini juga
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);

  return formattedValue;
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const loadBankDetailById = async (id) => {
  if (!id) {
    selectedError.value = 'ID rekening tidak ditemukan di URL.';
    return;
  }

  await bankStore.fetchBankAccounts();     // Isi daftar akun (di `banks` ref)
  await bankStore.fetchBankDetail(id);     // Isi detail bank dengan ID (di `selectedBank` ref)

  // Setelah kedua data (daftar bank dan detail bank) terisi
  // Cari nama bank yang cocok dari daftar `banks`
  const selectedBankName = selectedBank.value?.account;
  console.log(selectedBankName)
  const match = banks.value.find((b) => b.account === selectedBankName);
  if (match) {
    console.log(match)
    bankName.value = match.bank; // Simpan nama bank ke `bankName` ref
    bankNominal.value = match.balance
    Bank_trx_in.value = match.trx_in
    Bank_trx_out.value = match.trx_out
  } else {
    bankName.value = selectedBank.value.bank; // Fallback: gunakan nama dari selectedBank jika tidak ditemukan di daftar
    console.warn('⚠️ Bank tidak ditemukan di daftar, menggunakan nama dari detail bank.');
  }
};

// 🔃 Jalankan saat komponen pertama kali dimuat
onMounted(() => {
  loadBankDetailById(route.params.id);
});

// 🔁 Jalankan jika `route.params.id` berubah (misal user klik bank lain)
watch(
  () => route.params.id,
  (newId) => {
    loadBankDetailById(newId);
  }
);
</script>

<style scoped>
.bg-gray-100 {
  background-color: #f3f4f6;
}

.bg-white {
  background-color: #ffffff;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.rounded-2xl {
  border-radius: 1rem;
}

.border-gray-400 {
  border-color: #9ca3af;
}

.bg-gray-200 {
  background-color: #e5e7eb;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.border-gray-200 {
  border-color: #e5e7eb;
}

/* Status colors */
.bg-green-300 {
  background-color: #a7f3d0;
}

.bg-yellow-300 {
  background-color: #fde68a;
}

.bg-red-300 {
  background-color: #fca5a5;
}

.bg-gray-300 {
  background-color: #d1d5db;
}
</style>