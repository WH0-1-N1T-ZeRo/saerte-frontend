<template>
    <div class="bg-white">
        <div class="flex flex-col items-center justify-center mb-6 px-6">
            <i class="fas fa-recycle text-green-500 text-6xl mb-4"></i>
            <p class="text-gray-700 text-lg text-center mb-2">Total Poin Anda: <span
                    class="font-bold text-green-600">1250
                    Poin</span></p>
            <p class="text-gray-600 text-sm text-center">100 poin = Rp 1.000</p>
        </div>

        <div class="mb-6">
            <div class="px-6">

                <h3 class="text-xl font-semibold text-gray-700 mb-4">Setor Sampah</h3>
                <p class="text-gray-600 text-sm mb-4">Pilih jenis sampah dan masukkan perkiraan berat (kg) untuk disetor.
                </p>
            </div>
            <DynamicForm :fields="userFields" :model="existingUserData" :on-submit="createData" :on-cancel="cancelEdit"
                class="grid sm:grid-cols-2 gap-x-4" />
        </div>
    </div>

</template>

<script>
import DynamicForm from '@/components/DynamicForm.vue'
import { generateMonthYearOptions } from '@/utils/otomation_fuction.js';
import api from '../../services/api';
import router from '@/router';

export default {
    components: {
        DynamicForm
    },
    data() {
        this.monthYearOptions = generateMonthYearOptions(2025, 2025); // misal hanya 2025 dulu
        return {
            existingUserData: {
                id: 1,
                periode: 'Juni 2025',
                tanggal: '2025-06-15',
                jenisSampah: 'Plastik',
                berat: 3.5, // dalam kilogram
                hargaPerKg: 2000,
                total: 7000,
                deskripsi: 'Setoran dari warga RW 04',
            },
            userFields: [
                { name: 'id', label: 'No. Setoran', type: 'int' },
                { name: 'periode', label: 'Periode', type: 'select', options: this.monthYearOptions },
                { name: 'tanggal', label: 'Tanggal Setor', type: 'date' },
                { name: 'jenisSampah', label: 'Jenis Sampah', type: 'select', options: ['Plastik', 'Kertas', 'Logam', 'Kaca', 'Organik'] },
                { name: 'berat', label: 'Berat (kg)', type: 'number' },
                { name: 'hargaPerKg', label: 'Harga per Kg (Rp)', type: 'number' },
                { name: 'total', label: 'Total (Rp)', type: 'number', readonly: true },
                { name: 'deskripsi', label: 'Keterangan', type: 'textarea' },
            ],
            token: localStorage.getItem('authToken')
        };
    },
    methods: {
        createData(formData) {
            // Simulasi kirim ke server
            console.log('Data disubmit:', formData);
            // router.push('/bank-sampah');
        },
        cancelEdit() {
            router.back();
        }
    }
}
</script>
