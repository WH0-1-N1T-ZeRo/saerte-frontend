<template>
    <div class="max-w-md mx-auto mt-6 bg-white shadow">
        <!-- <h2 class="text-xl font-bold mb-4 text-gray-800">Pilih Bank Sampah</h2> -->

        <DynamicForm :fields="bankSelectFields" :model="formData" @submit="handleFormSubmit"
            @cancel="handleFormCancel" />

        <Toast :title="toast.title" :message="toast.message" :duration="toast.duration" :show="toast.show" />
        <p class="text-gray-500 px-6 pb-4">Pendaftaran akan melalui tahap persetujuan petugas</p>
    </div>
</template>

<script setup>
import { reactive, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useBankStore } from '@/stores/bank-sampah';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

import api from '@/services/api'; // ⬅️ PENTING: import axios instance
import DynamicForm from '@/components/DynamicForm.vue';
import Toast from '@/components/InfoToast.vue'; // optional

const router = useRouter(); // ⬅️ untuk redirect

// --- Toast reactive state ---
const toast = reactive({
    title: '',
    message: '',
    duration: 1000,
    show: false,
});
const showToast = (title, message, duration = 3000) => {
    toast.title = title;
    toast.message = message;
    toast.duration = duration;
    toast.show = true;
};

// --- Pinia Stores ---
const bankStore = useBankStore();
const userStore = useUserStore();
const { bankList, banks } = storeToRefs(bankStore);
const { profile } = storeToRefs(userStore);

// --- Form state ---
const formData = ref({ selectedBankId: '' });
const bankSelectFields = ref([]);

// Watch daftar bank
watch(bankList, (newBankList) => {
    if (newBankList.length > 0) {
        bankSelectFields.value = [
            {
                name: 'selectedBankId',
                label: 'Pilih Bank Sampah',
                type: 'select',
                options: newBankList.map(bank => ({
                    label: bank.name,
                    value: bank.id
                })),
                defaultValue: '',
            }
        ];
    }
}, { immediate: true });

// --- Fetch data onMounted ---
onMounted(async () => {
    await Promise.all([
        bankStore.fetchBankList(),
        bankStore.fetchBankAccounts(),
        userStore.fetchUserProfile()
    ]);
    console.log('✅ Bank user:', banks.value);
    console.log('✅ Semua bank:', bankList.value);
});

// --- HANDLE SUBMIT ---
const handleFormSubmit = async (data) => {
    const waste_bank_id = data.selectedBankId;
    const resident_id = profile.value.id //||1;
    // 
    const token = localStorage.getItem('authToken') //||'c739084314eddb8d8fead52fcae358585fc0a0a41350b9035493d4cf69badacf';
    //
    const selectedBank = bankList.value.find(bank => bank.id === waste_bank_id);

    if (!selectedBank) {
        showToast('Data tidak ditemukan', 'Bank tidak tersedia dalam daftar');
        return;
    }

    const alreadyHasAccount = banks.value.find(b => b.bank === selectedBank.name);

    if (alreadyHasAccount) {
        showToast('Sudah Terdaftar', `Anda sudah punya akun di "${selectedBank.name}"`);
        return;
    }

    try {
        const response = await api.post('/wbnk/register', {
            waste_bank_id,
            resident_id
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        showToast('Berhasil', `Berhasil mendaftar ke "${selectedBank.name}"`, 3000);

        // Refresh akun bank user
        await bankStore.fetchBankAccounts();

        // Redirect atau reset form
        router.push('/bank');

    } catch (error) {
        console.error('❌ Gagal register:', error.response?.data || error.message);
        showToast('Gagal', 'Pendaftaran bank sampah gagal.');
    }
};

// --- Cancel handler ---
const handleFormCancel = () => {
    formData.value.selectedBankId = '';
    showToast('Dibatalkan', 'Pemilihan bank dibatalkan.', 2000);
};
</script>


<style scoped>
/* Anda bisa menambahkan gaya khusus di sini jika diperlukan */
.max-w-md {
    max-width: 28rem;
    /* Atur max-width sesuai keinginan, misal 448px */
}
</style>