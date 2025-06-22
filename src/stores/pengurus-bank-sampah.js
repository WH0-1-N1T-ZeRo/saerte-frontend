// stores/bank.js
import { defineStore } from 'pinia';
import api from '@/services/api';

export const useBankStore = defineStore('bank', {
    state: () => ({
        token: localStorage.getItem('authToken'), //Temper data auth
        // 
        banks: [],
        loading: false,
        error: null,

        selectedBank: null,
        selectedTransactions: [],
        selectedLoading: false,
        selectedError: null,

        // Tambahkan di state:
        bankList: [],
        bankListLoading: false,
        bankListError: null,

    }),

    actions: {
        async fetchBankAccounts() {
            this.loading = true;
            this.error = null;
            try {
                const token = localStorage.getItem('authToken');
                const response = await api.get('/wbnk/accounts', {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                });
                this.banks = response.data;
            } catch (err) {
                console.error('Error fetching bank accounts:', err);
                this.error = 'Gagal memuat data rekening bank.';
            } finally {
                this.loading = false;
            }
        },

        async fetchBankDetail(id) {
            this.selectedLoading = true;
            this.selectedError = null;
            try {
                const token = localStorage.getItem('authToken');
                const response = await api.get(`/wbnk/accounts?id=${id}`, {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                });
                this.selectedBank = {
                    account: response.data.account,
                    bank: response.data.bank,
                    balance: response.data.balance,
                };
                this.selectedTransactions = response.data.transactions || [];
            } catch (err) {
                console.error('Error fetching bank detail:', err);
                this.selectedError = 'Gagal memuat detail rekening.';
            } finally {
                this.selectedLoading = false;
            }
        },
        // Tambahkan di actions:
        async fetchBankList() {
            this.bankListLoading = true;
            this.bankListError = null;
            try {
                const token = localStorage.getItem('authToken');
                const response = await api.get('/wbnk/bank', {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                });
                this.bankList = response.data;
            } catch (err) {
                console.error('Error fetching bank list:', err);
                this.bankListError = 'Gagal memuat daftar bank.';
            } finally {
                this.bankListLoading = false;
            }
        }

    },
});
