<template>
  <form @submit.prevent="handleSubmit" class="md:max-w-[97%] mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
    <div v-for="field in fields" :key="field.name" class="flex flex-col mb-4">
      <label :for="field.name" class="block text-gray-700 border-gray-400 text-sm font-bold mb-2">{{ field.label
        }}</label>

      <input v-if="['text', 'email', 'number', 'date'].includes(field.type)" :type="field.type" :id="field.name"
        v-model="formData[field.name]" :disabled="field.disabled"
        class="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 border-gray-400 leading-tight focus:outline-none focus:shadow-outline text-xl"
        :class="{ 'bg-gray-100 cursor-not-allowed': field.disabled }" />

      <textarea v-else-if="field.type === 'textarea'" :id="field.name" v-model="formData[field.name]" rows="4"
        :disabled="field.disabled"
        class="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 border-gray-400 leading-tight focus:outline-none focus:shadow-outline text-xl"
        :class="{ 'bg-gray-100 cursor-not-allowed': field.disabled }"></textarea>

      <select v-else-if="field.type === 'select'" :id="field.name" v-model="formData[field.name]"
        :disabled="field.disabled"
        class="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 border-gray-400 leading-tight focus:outline-none focus:shadow-outline text-xl"
        :class="{ 'bg-gray-100 cursor-not-allowed': field.disabled }">
        <option disabled value="">Pilih salah satu</option>
        <option v-for="(option, index) in field.options" :key="index"
          :value="getSelectOptionValue(option, field.defaultValue)">
          {{ getSelectOptionLabel(option) }}
        </option>
      </select>

      <div v-else-if="field.type === 'checkbox'" class="flex items-center mt-2">
        <input type="checkbox" :id="field.name" v-model="formData[field.name]" :disabled="field.disabled"
          class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out mr-2"
          :class="{ 'cursor-not-allowed': field.disabled }" />
        <label :for="field.name" class="text-gray-700 border-gray-400">{{ field.label }}</label>
      </div>

      <div v-else-if="field.type === 'file'">
        <input type="file" :id="field.name" @change="handleFileUpload($event, field.name)" :disabled="field.disabled"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          :class="{ 'cursor-not-allowed': field.disabled, 'file:bg-gray-200 file:text-gray-600 hover:file:bg-gray-200': field.disabled }" />
        <p v-if="formData[field.name] && typeof formData[field.name] === 'string'" class="text-xs text-gray-500 mt-1">
          File saat ini: {{ formData[field.name].split('/').pop() }}
        </p>
      </div>

      <input v-else type="text" :id="field.name" v-model="formData[field.name]" :disabled="field.disabled"
        class="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 border-gray-400 leading-tight focus:outline-none focus:shadow-outline text-xl"
        :class="{ 'bg-gray-100 cursor-not-allowed': field.disabled }" />
    </div>

    <div class="grid grid-cols-1 gap-2 h-fit">
      <button type="button" @click="handleCancel"
        class="bg-gray-600 hidden hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-xl transition duration-150 ease-in-out">
        Cancel
      </button>
      <button type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-xl transition duration-150 ease-in-out">
        SIMPAN
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    fields: {
      type: Array,
      required: true
    },
    model: {
      type: Object,
      default: () => ({})
    },
    onSubmit: {
      type: Function,
      required: true
    },
    onCancel: {
      type: Function,
      default: () => { }
    }
  },
  data() {
    return {
      formData: {}
    }
  },
  watch: {
    model: {
      handler(newVal) {
        this.formData = { ...newVal };
        // Inisialisasi nilai default untuk checkbox jika tidak ada di model
        this.fields.forEach(field => {
          if (field.type === 'checkbox' && this.formData[field.name] === undefined) {
            this.$set(this.formData, field.name, false); // Set default to false
          }
        });
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // Helper untuk menentukan nilai 'value' untuk opsi 'select'
    getSelectOptionValue(option, defaultValue) {
      if (typeof option === 'object' && option !== null && 'value' in option) {
        return option.value;
      }
      return defaultValue !== undefined ? defaultValue : option; // Gunakan defaultValue atau opsi itu sendiri
    },
    // Helper untuk menentukan label yang ditampilkan untuk opsi 'select'
    getSelectOptionLabel(option) {
      if (typeof option === 'object' && option !== null && 'label' in option) {
        return option.label;
      }
      return option; // Jika bukan objek atau tidak ada 'label', tampilkan opsi itu sendiri
    },
    handleSubmit() {
      const dataToSubmit = { ...this.formData };
      for (const field of this.fields) {
        if (field.type === 'file' && typeof dataToSubmit[field.name] === 'string') {
          delete dataToSubmit[field.name];
        }
      }
      this.onSubmit(dataToSubmit);
    },
    handleFileUpload(event, fieldName) {
      const file = event.target.files[0];
      this.formData[fieldName] = file;
    },
    handleCancel() {
      this.onCancel();
      this.formData = { ...this.model };
    }
  }
}
</script>

<style scoped>
/* Styling dasar, Anda bisa menambahkan lebih banyak dengan Tailwind CSS atau CSS biasa */
form {
  max-width: 600px;
}

/* Menambahkan gaya untuk input yang disabled */
input:disabled,
textarea:disabled,
select:disabled {
  background-color: #e2e8f0;
  /* Tailwind gray-200 */
  cursor: not-allowed;
  opacity: 0.8;
}

/* Gaya tambahan untuk file input disabled agar terlihat konsisten */

</style>