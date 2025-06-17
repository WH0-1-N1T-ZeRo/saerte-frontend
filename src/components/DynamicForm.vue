<template>
  <form @submit.prevent="handleSubmit" class="md:max-w-[97%] mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
    <div v-for="field in fields" :key="field.name" class="flex flex-col">
      <label :for="field.name" class="block text-gray-700 text-sm font-bold mb-2">{{ field.label }}</label>

      <input
        v-if="['text', 'email', 'number', 'date'].includes(field.type)"
        :type="field.type"
        :id="field.name"
        v-model="formData[field.name]"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />

      <textarea
        v-else-if="field.type === 'textarea'"
        :id="field.name"
        v-model="formData[field.name]"
        rows="4"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      ></textarea>

      <select
        v-else-if="field.type === 'select'"
        :id="field.name"
        v-model="formData[field.name]"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option disabled value="">Pilih salah satu</option>
        <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
      </select>

      <div v-else-if="field.type === 'checkbox'" class="flex items-center mt-2">
        <input
          type="checkbox"
          :id="field.name"
          v-model="formData[field.name]"
          class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out mr-2"
        />
        <label :for="field.name" class="text-gray-700">{{ field.label }}</label>
      </div>

      <div v-else-if="field.type === 'file'">
        <input
          type="file"
          :id="field.name"
          @change="handleFileUpload($event, field.name)"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p v-if="formData[field.name] && typeof formData[field.name] === 'string'" class="text-xs text-gray-500 mt-1">
          File saat ini: {{ formData[field.name].split('/').pop() }}
        </p>
      </div>

      <input
        v-else
        type="text"
        :id="field.name"
        v-model="formData[field.name]"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>

    <div class="grid grid-cols-2 gap-2 h-fit">
      <button
        type="button"
        @click="handleCancel"
        class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
      >
        Submit
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
      default: () => ({}) // Default to an empty object if no model is provided
    },
    onSubmit: {
      type: Function,
      required: true
    },
    onCancel: { // Tambahkan prop onCancel
      type: Function,
      default: () => {} // Default empty function
    }
  },
  data() {
    return {
      formData: {} // Inisialisasi kosong, akan diisi di created/watch
    }
  },
  watch: {
    // Watch 'model' prop for changes to update formData
    model: {
      handler(newVal) {
        this.formData = { ...newVal };
      },
      immediate: true, // Run handler immediately on component creation
      deep: true // Watch for deep changes in the model object
    }
  },
  methods: {
    handleSubmit() {
      // Emit data bersih, pisahkan file object dari string path jika ada
      const dataToSubmit = { ...this.formData };
      for (const field of this.fields) {
        if (field.type === 'file' && typeof dataToSubmit[field.name] === 'string') {
          // Jika nilai file adalah string (path), jangan kirim sebagai file object
          // Ini berarti file tidak diubah oleh user, biarkan backend yang mengurus path lama
          delete dataToSubmit[field.name]; // Atau bisa juga dikirim sebagai string path jika backend mengharapkan itu
        }
      }
      this.onSubmit(dataToSubmit);
    },
    handleFileUpload(event, fieldName) {
      const file = event.target.files[0];
      this.formData[fieldName] = file;
    },
    handleCancel() {
      // Emit event cancel, atau bisa juga mereset form ke nilai awal model
      this.onCancel();
      // Untuk mereset form ke nilai awal model:
      this.formData = { ...this.model };
    }
  }
}
</script>