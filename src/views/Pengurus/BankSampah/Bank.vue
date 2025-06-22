<template>
    <div class="bank-list-container p-4 py-10">
        <!-- <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">Daftar Rekening Bank</h2> -->

        <div v-if="loading" class="text-center text-yellow-600 h-screen flex items-center justify-center">
            <span>
                Connecting...
            </span>
        </div>

        <div v-else-if="error" class="text-center text-gray-500 h-screen flex items-center">
            Gagal memuat data: {{ error }}
        </div>

        <div v-else-if="banks.length === 0" class="text-center text-gray-600 h-screen flex items-center justify-center">
            <span>
                Rekening tidak tersedia.
            </span>
        </div>

        <div v-else class="grid grid-cols-1 gap-4">
            <router-link v-for="bank in banks" :key="bank.id" :to="{ name: 'BankSampahPengurus', params: { id: bank.id } }"
                class="block">

                <div
                    class="relative rounded-2xl bg-white border border-gray-300 pt-4 shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200">
                    <!-- Badge label -->
                    <div v-if="bank.active !== null"
                        class="absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-2xl rounded-tr-2xl z-10"
                        :class="bank.active ? 'bg-green-500 text-white' : 'bg-yellow-400 text-gray-800'">
                        {{ bank.active ? 'Active' : 'Pending' }}
                    </div>

                    <div class="flex items-center justify-between mb-2">
                        <div class="ms-4">
                            <p class="text-gray-700 text-xl text-start">
                                <span class="font-bold text-gray-800">{{ bank.name }}</span>
                            </p>
                            <p class="text-gray-700 text-xl text-start">
                                <span class="text-gray-800">{{ bank.account }}</span>
                            </p>
                        </div>
                        <p class="text-gray-700 text-3xl text-end me-4">
                            <span class="font-bold text-gray-800">{{ bank.balance }}</span>
                        </p>
                    </div>
                    <p class="text-center text-gray-500 mb-2">{{ bank.address }}</p>
                    <div class="grid grid-cols-2 border-t border-gray-200 pt-2 pb-2">
                        <p class="text-gray-700 text-sm text-center">
                            Proses Setor:
                            <span class="font-bold text-gray-800">{{ bank.trx_in }}</span>
                        </p>
                        <p class="text-700 text-sm text-center">
                            Proses Tarik:
                            <span class="font-bold text-gray-800">{{ bank.trx_out }}</span>
                        </p>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>
<script>
import { useBankStore } from '@/stores/pengurus-bank-sampah';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

export default {
    name: 'BankListView',
    setup() {
        const bankStore = useBankStore();
        const { banks, loading, error } = storeToRefs(bankStore);

        onMounted(() => {
            bankStore.fetchBankAccounts();
        });
        return {
            banks,
            loading,
            error
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