<template>
    <div class="bg-gray-100 min-h-full">
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
            <!-- <div class="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg text-center shadow-sm">
                <p class="text-blue-700 text-lg mb-1">Iuran Bulan {{ currentMonthFormatted }}:</p>
                <p class="text-2xl font-bold"
                    :class="{ 'text-green-600': isPaidThisMonth, 'text-red-600': !isPaidThisMonth }">
                    {{ isPaidThisMonth ? 'Lunas!' : 'Belum Lunas' }}
                </p>
            </div> -->

            <div class="mb-6">
                <div class="overflow-x-auto">
                    <div class="space-y-4">
                        <div v-for="item in iuranData" :key="item.id" class="p-4 bg-white rounded-lg shadow">
                            <div class="flex justify-between mb-2">
                                <h3 class="font-semibold text-sm">{{ item.name }}</h3>
                                <span :class="item.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'"
                                    class="px-2 py-0.5 rounded-full text-xs font-medium">
                                    {{ item.active ? 'Aktif' : 'Nonaktif' }}
                                </span>
                            </div>
                            <p class="text-sm text-gray-600">Tanggal: {{ item.date }}</p>
                        </div>


                        <div v-if="iuranData.length === 0" class="text-center text-gray-500 text-sm py-6">
                            Belum ada data iuran.
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="!isPaidThisMonth" class="mt-6 hidden">
                <!-- Bayar -->
            </div>
            <div v-else class="mt-6 text-center text-gray-600 italic">
                <p>Terima kasih, iuran Anda bulan ini sudah lunas!</p>
            </div>
        </div>
    </div>
    <!-- <CreateButton to="/iuran/new" /> -->
</template>
<script>
// import CreateButton from '@/components/CreateButton.vue';
import { useIuranStore } from '@/stores/iuran.js';

export default {
    name: 'IuranList',
    // components: { CreateButton },
    data() {
        return {
            store: useIuranStore()
        };
    },
    computed: {
        iuranData() {
            return this.store.state.iuranData;
        },
        sortedIuranData() {
            return [...this.iuranData].sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    },
    mounted() {
        this.store.fetchIuran(); // WAJIB ada ini
    }
};
</script>
