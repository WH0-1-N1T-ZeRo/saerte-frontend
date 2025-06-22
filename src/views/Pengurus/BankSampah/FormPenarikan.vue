<template>
  <div class="bg-gray-100 min-h-screen">
      <DynamicForm
        :fields="formFields"
        :model="formData"
        :on-submit="submitWithdraw"
        :on-cancel="cancel"
      />
  </div>
</template>

<script>
import DynamicForm from '@/components/DynamicForm.vue';
import api from '@/services/api';
import router from '@/router';
import { useUserStore } from '@/stores/user';

export default {
  components: {
    DynamicForm
  },
  data() {
    return {
      userStore: useUserStore(),
      formFields: [
        { name: 'amount', label: 'Jumlah Penarikan (Rp)', type: 'number' }
      ],
      formData: {
        amount: 0
      },
      token: localStorage.getItem('authToken')
    };
  },
  async created() {
    // Pastikan data profil ada
    if (!this.userStore.profile?.id) {
      await this.userStore.fetchUserProfile();
    }
  },
  methods: {
    async submitWithdraw(data) {
      const account_id = this.userStore.profile?.id;

      if (!account_id) {
        alert('Akun tidak ditemukan. Silakan login ulang.');
        return;
      }

      const payload = {
        account_id,
        amount: parseFloat(data.amount)
      };

      try {
        const res = await api.post('/wbnk/withdraw', payload, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });

        if (res.status === 200 || res.status === 201) {
          alert('Penarikan berhasil!');
          router.push('/bank-sampah');
        } else {
          alert('Penarikan gagal.');
        }
      } catch (error) {
        console.error('Gagal melakukan penarikan:', error);
        alert('Terjadi kesalahan saat mengirim data.');
      }
    },
    cancel() {
      router.back();
    }
  }
};
</script>
