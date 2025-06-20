export function generateMonthYearOptions(startYear, endYear) {
  const optionsLabels = []; // Mengganti nama variabel untuk mencerminkan isi
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  for (let year = startYear; year <= endYear; year++) {
    for (let month = 0; month < 12; month++) {
      // Kita tetap butuh monthValue jika Anda ingin format 'YYYY-MM' untuk value,
      // tapi karena Anda hanya ingin label, kita bisa langsung buat labelnya.
      // const monthValue = (month + 1).toString().padStart(2, '0'); 
      // const value = `${year}-${monthValue}`; // Tidak digunakan jika hanya mengambil label

      const label = `${monthNames[month]} ${year}`;
      
      optionsLabels.push(label); // Langsung masukkan label ke array
    }
  }
  return optionsLabels; // Mengembalikan array of string (label)
}