<template>
  <div class="bg-white p-6 rounded-lg shadow-md mb-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Riwayat Pengajuan Surat</h2>
    <div v-if="submissionHistory.length > 0" class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr class="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-left">No. Ref</th>
            <th class="py-3 px-6 text-left">Jenis Surat</th>
            <th class="py-3 px-6 text-left">Tanggal Ajuan</th>
            <th class="py-3 px-6 text-center">Status</th>
            <th class="py-3 px-6 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-for="submission in submissionHistory" :key="submission.id"
            class="border-b border-gray-200 hover:bg-gray-100">
            <td class="py-3 px-6 text-left whitespace-nowrap">#{{ submission.id }}</td>
            <td class="py-3 px-6 text-left">{{ submission.jenisSuratDisplay }}</td>
            <td class="py-3 px-6 text-left">{{ submission.tanggalAjuan }}</td>
            <td class="py-3 px-6 text-center">
              <span :class="{
                'bg-yellow-200 text-yellow-800': submission.status === 'Pending',
                'bg-blue-200 text-blue-800': submission.status === 'Diproses',
                'bg-green-200 text-green-800': submission.status === 'Selesai',
                'bg-red-200 text-red-800': submission.status === 'Ditolak'
              }" class="py-1 px-3 rounded-full text-xs font-semibold">
                {{ submission.status }}
              </span>
            </td>
            <td class="py-3 px-6 text-center">
              <button v-if="submission.status === 'Selesai'" @click="downloadSurat(submission.id)"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-xs">
                Unduh
              </button>
              <button v-else-if="submission.status === 'Ditolak'" @click="viewRejectionReason(submission.id)"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs">
                Lihat Alasan
              </button>
              <span v-else class="text-gray-500 text-xs italic">

                <span v-if="true">Menunggu...</span>
                <span v-else class=" grid grid-cols-1 md:grid-cols-2 gap-1">
                  <button @click="Tolak(submission.id)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs">Tolak</button>
                    <button @click="Terima(submission.id)" class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded text-xs">Terima</button>
                </span>

              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center text-gray-500 italic py-4">
      Belum ada riwayat pengajuan surat.
    </div>
  </div>
  <div class="px-4 bg-gray-100 min-h-full">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Permintaan Surat Digital</h2>

      <div class="flex justify-around mb-6 text-sm font-semibold">
        <div class="text-center">
          <div :class="{ 'bg-blue-600 text-white': currentStep === 1, 'bg-gray-200 text-gray-600': currentStep !== 1 }"
            class="w-8 h-8 flex items-center justify-center rounded-full mx-auto mb-1">1</div>
          Isi Data
        </div>
        <div class="text-center">
          <div :class="{ 'bg-blue-600 text-white': currentStep === 2, 'bg-gray-200 text-gray-600': currentStep !== 2 }"
            class="w-8 h-8 flex items-center justify-center rounded-full mx-auto mb-1">2</div>
          Unggah Dokumen
        </div>
        <div class="text-center">
          <div :class="{ 'bg-blue-600 text-white': currentStep === 3, 'bg-gray-200 text-gray-600': currentStep !== 3 }"
            class="w-8 h-8 flex items-center justify-center rounded-full mx-auto mb-1">3</div>
          Pratinjau & Kirim
        </div>
      </div>

      <div v-if="currentStep === 1">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Detail Permintaan</h3>
        <div class="mb-4">
          <label for="jenisSurat" class="block text-gray-700 text-sm font-bold mb-2">Jenis Surat:</label>
          <select id="jenisSurat" v-model="formData.jenisSurat"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Pilih Jenis Surat</option>
            <option value="domisili">Surat Keterangan Domisili</option>
            <option value="usaha">Surat Keterangan Usaha</option>
            <option value="nikah">Surat Pengantar Nikah</option>
            <option value="kematian">Surat Keterangan Kematian</option>
          </select>
        </div>
        <div class="mb-4">
          <label for="keperluan" class="block text-gray-700 text-sm font-bold mb-2">Keperluan:</label>
          <textarea id="keperluan" v-model="formData.keperluan"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"></textarea>
        </div>
        <div v-if="formData.jenisSurat === 'usaha'" class="mb-4">
          <label for="namaUsaha" class="block text-gray-700 text-sm font-bold mb-2">Nama Usaha:</label>
          <input type="text" id="namaUsaha" v-model="formData.namaUsaha"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        </div>
        <button @click="nextStep" :disabled="!isStep1Valid"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Lanjut</button>
      </div>

      <div v-if="currentStep === 2">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Unggah Dokumen Pendukung</h3>
        <p class="text-gray-600 text-sm mb-4">Unggah dokumen seperti KTP, KK, atau dokumen pendukung lain yang
          diperlukan. (Max 5MB per file)</p>
        <input type="file" multiple @change="handleFileUpload" accept=".pdf,.jpg,.jpeg,.png"
          class="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
        <div class="file-list bg-gray-50 p-3 rounded-lg mb-4">
          <div v-for="(file, index) in uploadedFiles" :key="index"
            class="flex items-center justify-between py-1 border-b last:border-b-0">
            <span class="text-gray-700 text-sm">{{ file.name }}</span>
            <button @click="removeFile(index)" class="text-red-500 hover:text-red-700 text-lg ml-2">
              <i class="fas fa-times-circle"></i>
            </button>
          </div>
          <p v-if="uploadedFiles.length === 0" class="text-gray-500 text-sm italic text-center py-2">Belum ada dokumen
            diunggah.</p>
        </div>
        <div class="flex justify-between">
          <button @click="prevStep"
            class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Kembali</button>
          <button @click="nextStep"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Lanjut</button>
        </div>
      </div>

      <div v-if="currentStep === 3">
        <h3 class="text-xl font-semibold text-gray-700 mb-4">Pratinjau Permintaan</h3>
        <div class="bg-gray-50 p-4 rounded-lg mb-4 text-gray-800">
          <p class="mb-2"><strong>Jenis Surat:</strong> {{ displayJenisSurat }}</p>
          <p class="mb-2"><strong>Keperluan:</strong> {{ formData.keperluan }}</p>
          <p v-if="formData.namaUsaha" class="mb-2"><strong>Nama Usaha:</strong> {{ formData.namaUsaha }}</p>

          <h4 class="font-semibold mt-4 mb-2">Dokumen Terunggah:</h4>
          <ul v-if="uploadedFiles.length > 0" class="list-disc list-inside">
            <li v-for="(file, index) in uploadedFiles" :key="index" class="text-sm">{{ file.name }}</li>
          </ul>
          <p v-else class="text-gray-500 italic text-sm">Tidak ada dokumen terunggah.</p>
        </div>
        <div class="flex justify-between">
          <button @click="prevStep"
            class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Kembali</button>
          <button @click="submitRequest"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Ajukan
            Permintaan</button>
        </div>
      </div>

      <div v-if="submissionSuccess"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-20">
        <div class="bg-white p-8 rounded-lg shadow-xl text-center">
          <i class="fas fa-check-circle text-green-500 text-6xl mb-4"></i>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Permintaan Berhasil Diajukan!</h3>
          <p class="text-gray-600 mb-4">Nomor Referensi Anda: <strong>#{{ submittedRequestId }}</strong></p>
          <p class="text-gray-600 mb-6">Anda akan menerima notifikasi jika surat sudah dapat diunduh.</p>
          <button @click="resetFormAndGoHome"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Kembali
            ke Beranda</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentStep: 1,
      formData: {
        jenisSurat: '',
        keperluan: '',
        namaUsaha: '',
      },
      uploadedFiles: [],
      submissionSuccess: false,
      submittedRequestId: null,
      // NEW: Riwayat Pengajuan Surat
      submissionHistory: [
        {
          id: 'SRT-001',
          jenisSurat: 'domisili',
          jenisSuratDisplay: 'Surat Keterangan Domisili',
          tanggalAjuan: '01 Juni 2025',
          status: 'Selesai',
          downloadLink: '/path/to/surat_domisili_001.pdf'
        },
        {
          id: 'SRT-002',
          jenisSurat: 'usaha',
          jenisSuratDisplay: 'Surat Keterangan Usaha',
          tanggalAjuan: '05 Juni 2025',
          status: 'Diproses'
        },
        {
          id: 'SRT-003',
          jenisSurat: 'nikah',
          jenisSuratDisplay: 'Surat Pengantar Nikah',
          tanggalAjuan: '08 Juni 2025',
          status: 'Pending'
        },
        {
          id: 'SRT-004',
          jenisSurat: 'kematian',
          jenisSuratDisplay: 'Surat Keterangan Kematian',
          tanggalAjuan: '10 Mei 2025',
          status: 'Ditolak',
          rejectionReason: 'Dokumen KTP tidak jelas.'
        },
      ],
    };
  },
  computed: {
    isStep1Valid() {
      return this.formData.jenisSurat && this.formData.keperluan.trim() !== '';
    },
    displayJenisSurat() {
      const types = {
        domisili: 'Surat Keterangan Domisili',
        usaha: 'Surat Keterangan Usaha',
        nikah: 'Surat Pengantar Nikah', // This line is correct and doesn't need changes.
        kematian: 'Surat Keterangan Kematian',
      };
      return types[this.formData.jenisSurat] || this.formData.jenisSurat;
    }
  },
  methods: {
    nextStep() {
      if (this.currentStep === 1 && !this.isStep1Valid) {
        alert('Mohon lengkapi semua data yang diperlukan di langkah ini.');
        return;
      }
      this.currentStep++;
    },
    prevStep() {
      this.currentStep--;
    },
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      this.uploadedFiles = [...this.uploadedFiles, ...files];
    },
    removeFile(index) {
      this.uploadedFiles.splice(index, 1);
    },
    async submitRequest() {
      console.log('Mengirim permintaan simulasi:', {
        formData: this.formData,
        fileNames: this.uploadedFiles.map(f => f.name)
      });

      setTimeout(() => {
        this.submittedRequestId = 'SRT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        this.submissionSuccess = true;
      }, 1000);
    },
    resetFormAndGoHome() {
      this.submissionSuccess = false;
      this.currentStep = 1;
      this.formData = { jenisSurat: '', keperluan: '', namaUsaha: '' };
      this.uploadedFiles = [];
      this.submittedRequestId = null;
      // FIX: Removed the backslash before $router
      this.$router.push('/');
    }
  }
};
</script>
