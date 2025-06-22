// stores/iuran.js
import { reactive } from 'vue';
import api from '@/services/api';

export const useIuranStore = () => {
    const state = reactive({
        iuranData: [],
        currentMonthFormatted: getCurrentMonthAndYear(),
        token: localStorage.getItem('authToken')
    });

    function extractMonthYear(keterangan) {
        const match = keterangan ? keterangan.match(/Iuran bulanan (\w+ \d{4})/i) : null;
        return match ? match[1] : 'Jan 2025';
    }

    function getCurrentMonthAndYear() {
        const date = new Date();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
            'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }

    async function fetchIuran() {
        try {
            const response = await api.get(`/cntr/contribution`, {
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Accept': 'application/json'
                }
            });

            // Pakai langsung, tanpa map
            state.iuranData = typeof response.data === 'string'
                ? JSON.parse(response.data)
                : response.data;

        } catch (error) {
            console.error('Gagal fetch iuran:', error);
        }
    }


    async function detail(id) {
        try {
            const response = await api.get(`/cntr/contribution?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Gagal mengambil detail iuran:", error);
        }
    }

    async function updateIuran(id, payload) {
        try {
            const response = await api.post(`/cntr/contribution/${id}`, payload, {
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Gagal update iuran:', error);
            throw error;
        }
    }

    return {
        state,
        fetchIuran,
        detail,
        updateIuran,
        extractMonthYear,
        getCurrentMonthAndYear
    };
};
