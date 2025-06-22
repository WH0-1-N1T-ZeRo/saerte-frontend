<template>
    <div class="bg-white pt-5 min-h-full">
        <div class="mb-6">
            <div class="px-6">
                <h3 class="text-xl font-semibold text-gray-700 my-4">Sahabat Asri</h3>
            </div>
            <button @click="addLine" class="ml-6 mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                + Tambah Jenis Sampah
            </button>
            <DynamicForm :fields="userFields" :model="existingUserData" :on-submit="createData" :on-cancel="cancelEdit"
                class="grid sm:grid-cols-2 gap-x-4" />

        </div>
    </div>
</template>

<script>
import DynamicForm from '@/components/DynamicForm.vue'
import api from '@/services/api'
import router from '@/router'
import { useUserStore } from '@/stores/user'

export default {
    components: {
        DynamicForm
    },
    setup() {
        const userStore = useUserStore();
        return { userStore };
    },
    data() {
        return {
            existingUserData: {
                tanggal: new Date().toISOString().slice(0, 10)
            },
            userFields: [],
            wasteItems: [],
            token: localStorage.getItem('authToken'),
            lineCount: 1
        };
    },
    watch: {
        existingUserData: {
            handler(val) {
                for (let i = 0; i < this.lineCount; i++) {
                    const id = val[`jenisSampah_${i}`];
                    const berat = parseFloat(val[`berat_${i}`] || 0);
                    const item = this.wasteItems.find(w => w.id === id);
                    if (item) {
                        this.existingUserData, `total_${i}`, item.price_unit * berat;
                    }
                }
            },
            immediate: true,
            deep: true
        }
    },
    async created() {
        await this.fetchWasteItems();
        this.initializeUserFields();
    },
    methods: {
        async fetchWasteItems() {
            try {
                const response = await api.get("/wbnk/waste_item", {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });
                this.wasteItems = response.data;

                // Set default jenisSampah_0 jika belum ada
                if (this.wasteItems.length > 0 && !this.existingUserData[`jenisSampah_0`]) {
                    this.existingUserData[`jenisSampah_0`] = this.wasteItems[0].id;
                }
            } catch (error) {
                console.error("Gagal mengambil data jenis sampah:", error);
            }
        },
        initializeUserFields() {
            const jenisSampahOptions = (this.wasteItems || []).map(item => ({
                value: item.id,
                label: `${item.code} - ${item.name} - ${item.price_unit}/${item.unit}`
            }));

            const fields = [{ name: 'tanggal', label: 'Tanggal', type: 'date' }];

            for (let i = 0; i < this.lineCount; i++) {
                fields.push(
                    { name: `jenisSampah_${i}`, label: `Jenis Sampah #${i + 1}`, type: 'select', options: jenisSampahOptions },
                    { name: `berat_${i}`, label: `Berat (KG) #${i + 1}`, type: 'number' }
                );

                // Inisialisasi data
                if (this.existingUserData[`jenisSampah_${i}`] === undefined) {
                    this.existingUserData = {
                        ...this.existingUserData,
                        [`jenisSampah_${i}`]: jenisSampahOptions[0]?.value || null
                    };
                }

                if (this.existingUserData[`berat_${i}`] === undefined) {
                    this.existingUserData = {
                        ...this.existingUserData,
                        [`berat_${i}`]: 0
                    };
                }
            }

            fields.push({ name: 'deskripsi', label: 'Keterangan', type: 'text' });
            this.userFields = fields;
        },
        addLine() {
            if (!Array.isArray(this.wasteItems) || this.wasteItems.length === 0) {
                alert("Data jenis sampah belum dimuat. Silakan coba lagi nanti.");
                return;
            }

            this.lineCount++;
            this.initializeUserFields();
        },
        async createData(formData) {
            const account_id = this.userStore.profile?.id;

            if (!account_id) {
                alert("Akun pengguna tidak ditemukan atau belum login.");
                return;
            }

            const lines = [];

            for (let i = 0; i < this.lineCount; i++) {
                lines.push({
                    waste_item_id: formData[`jenisSampah_${i}`],
                    quantity: formData[`berat_${i}`],
                    price: 0 // Karena dihitung otomatis di backend (berdasarkan ID)
                });
            }

            const payload = {
                date: new Date(formData.tanggal).toISOString(),
                account_id,
                status: 'draft',
                lines
            };

            try {
                const res = await api.post('/wbnk/deposit', payload, {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                if (res.status === 200 || res.status === 201) {
                    alert('Deposit berhasil!');
                    router.push('/bank-sampah');
                } else {
                    alert('Gagal menyimpan data.');
                }
            } catch (err) {
                console.error('Gagal submit:', err);
                alert('Terjadi kesalahan saat menyimpan data.');
            }
        },
        cancelEdit() {
            router.back();
        }
    }
}
</script>
