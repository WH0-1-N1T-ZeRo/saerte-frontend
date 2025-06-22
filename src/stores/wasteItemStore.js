import { defineStore } from 'pinia'
import api from '@/services/api'

export const useWasteItemStore = defineStore('wasteItem', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),

  getters: {
    activeItems: (state) => state.items.filter(item => item.active),
    getItemById: (state) => (id) => state.items.find(item => item.id === id)
  },

  actions: {
    getAuthHeader() {
      const token = localStorage.getItem('authToken')
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    },

    async fetchItems() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/wbnk/waste_item', this.getAuthHeader())
        this.items = res.data
      } catch (err) {
        this.error = err
        console.error('❌ Gagal fetch data:', err)
      } finally {
        this.loading = false
      }
    },

    async updateItem(id, payload) {
      try {
        await api.post(`/wbnk/waste_item/${id}`, payload, this.getAuthHeader())
        const index = this.items.findIndex(i => i.id === id)
        if (index !== -1) this.items[index] = { ...this.items[index], ...payload }
      } catch (err) {
        console.error(`❌ Gagal update item ${id}:`, err)
        throw err
      }
    },

    async deleteItem(id) {
      try {
        await api.delete(`/wbnk/waste_item/${id}`, this.getAuthHeader())
        this.items = this.items.filter(i => i.id !== id)
      } catch (err) {
        console.error(`❌ Gagal hapus item ${id}:`, err)
        throw err
      }
    }
  }
})
