<template>
    <div class="bank-list-container p-4 py-10">
        <!-- <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Daftar Rekening Bank</h2> -->

        <div v-if="loading" class="text-center text-gray-600">
            Memuat data bank...
        </div>

        <div v-else-if="error" class="text-center text-red-600">
            Gagal memuat data: {{ error }}
        </div>

        <div v-else-if="banks.length === 0" class="text-center text-gray-600">
            Tidak ada data rekening bank yang tersedia.
        </div>

        <div v-else class="grid grid-cols-1 gap-4">
            <router-link v-for="bank in banks" :key="bank.id" :to="{ name: 'BankSampah', params: { id: bank.id } }"
                class="block">
                <div
                    class="rounded-2xl bg-white border border-gray-300 pt-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200">
                    <div class="flex items-center justify-between mb-2">
                        <div class="ms-4">
                            <p class="text-gray-700 text-xl text-start">
                                <span class="font-bold text-gray-800">{{ bank.bank }}</span>
                            </p>
                            <p class="text-gray-700 text-xl text-start">
                                <span class="text-gray-800">{{ bank.account }}</span>
                            </p>
                        </div>
                        <p class="text-gray-700 text-3xl text-end me-4">
                            <span class="font-bold text-gray-800">{{ formatCurrency(bank.balance) }}</span>
                        </p>
                    </div>
                    <div class="grid grid-cols-2 border-t border-gray-200 pt-2 pb-2">
                        <p class="text-gray-700 text-sm text-center">
                            Proses Setor:
                            <span class="font-bold text-gray-800">{{ formatCurrency(bank.trx_in) }}</span>
                        </p>
                        <p class="text-700 text-sm text-center">
                            Proses Tarik:
                            <span class="font-bold text-gray-800">{{ formatCurrency(bank.trx_out) }}</span>
                        </p>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
    <CreateButton to="/bank-accont/new" />
</template>
<script>
import CreateButton from '@/components/CreateButton.vue';
import { useBankStore } from '@/stores/bank-sampah';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

export default {
    name: 'BankListView',
    components: {
        CreateButton // Daftarkan CreateButton agar bisa digunakan di template
    },
    setup() {
        const bankStore = useBankStore();
        const { banks, loading, error } = storeToRefs(bankStore);

        onMounted(() => {
            bankStore.fetchBankAccounts();
        });

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

        return {
            banks,
            loading,
            error,
            formatCurrency,
        };
    },
};
</script>

<style scoped>
/* Styling dasar, Anda bisa menambahkan lebih banyak dengan Tailwind CSS atau CSS biasa */
.bank-list-container {
    max-width: 100dvh;
    background-color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.rounded-2xl {
    border-radius: 1rem;
    /* 16px */
}

/* Menggunakan padding dan margin Tailwind CSS langsung di template */
/* Contoh warna latar belakang putih dan border abu-abu yang sedikit lebih terang */
.bg-white {
    background-color: #ffffff;
}

.border-gray-300 {
    border-color: #d1d5db;
}

.shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>