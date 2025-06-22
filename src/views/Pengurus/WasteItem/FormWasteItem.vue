<template>
  <DynamicForm
    :fields="fields"
    :model="wasteItem"
    :on-submit="createWasteItem"
    :on-cancel="cancelCreate"
    class="grid sm:grid-cols-2 gap-x-4"
  />
</template>

<script>
import DynamicForm from '@/components/DynamicForm.vue'
import api from '@/services/api'
import router from '@/router'

export default {
  components: {
    DynamicForm
  },
  data() {
    return {
      wasteItem: {
        code: '',
        name: '',
        unit: 'KG',
        price_unit: 0,
        category: '',
        active: true
      },
      fields: [
        { name: 'code', label: 'Kode', type: 'text' },
        { name: 'name', label: 'Nama', type: 'text' },
        { name: 'unit', label: 'Satuan', type: 'select', options: ['KG', 'Liter', 'Pcs'] },
        { name: 'price_unit', label: 'Harga Satuan', type: 'number' },
        { name: 'category', label: 'Kategori', type: 'text' },
        { name: 'active', label: 'Aktif', type: 'checkbox' }
      ],
      token: localStorage.getItem('authToken')
    }
  },
  methods: {
    async createWasteItem(data) {
      try {
        const res = await api.post('/waste_item', {
          code: String(data.code),
          name: String(data.name),
          unit: String(data.unit),
          price_unit: Number(data.price_unit),
          category: data.category ? String(data.category) : null,
          active: Boolean(data.active)
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })

        alert('✅ Item berhasil dibuat!')
        router.push('/waste-item') // Ganti dengan route tujuan setelah submit
      } catch (err) {
        console.error('❌ Gagal membuat item:', err)
        alert('Gagal membuat item.')
      }
    },

    cancelCreate() {
      router.push('/waste-item') // Route kembali
    }
  }
}
</script>
