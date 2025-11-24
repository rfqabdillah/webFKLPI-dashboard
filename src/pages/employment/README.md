# Employment Form Wizard

Form wizard untuk mengelola data pegawai dengan 7 langkah (steps).

## 📁 Struktur File

```
employment/
├── EmploymentFormModal.vue      # Main wizard container
├── EmploymentsTable.vue          # Table untuk menampilkan data pegawai
└── steps/
    ├── Step1Biodata.vue          # ✅ Step 1: Biodata (SELESAI)
    ├── Step2UnitKerja.vue        # ⏳ Step 2: Unit Kerja (Placeholder)
    ├── Step3Jabatan.vue          # ⏳ Step 3: Jabatan (Placeholder)
    ├── Step4Pangkat.vue          # ⏳ Step 4: Pangkat (Placeholder)
    ├── Step5Pendidikan.vue       # ⏳ Step 5: Pendidikan (Placeholder)
    ├── Step6Pelatihan.vue        # ⏳ Step 6: Pelatihan (Placeholder)
    └── Step7Prestasi.vue         # ⏳ Step 7: Prestasi (Placeholder)
```

## 🎯 Fitur Step 1: Biodata

### Mode Pilihan (Card Selection)

User dapat memilih antara:

1. **Gunakan Data yang Sudah Ada** - Memilih dari daftar pengguna existing
2. **Buat Data Baru** - Mengisi form biodata lengkap

### Mode: Gunakan Data yang Sudah Ada

- Dropdown untuk memilih user dari database (via `getUsers` API)
- Preview card menampilkan foto, nama, email, dan NIP user yang dipilih
- Tombol "Kembali" untuk kembali ke pilihan mode

### Mode: Buat Data Baru

Form input lengkap dengan field:

- **Data Pribadi**: Nama lengkap\*, Gelar depan, Gelar belakang
- **Identitas**: NIK, NIP, No. Karpeg
- **Kontak**: Email\*, No. Telepon
- **Akun**: Level/Role\*, Status Akun
- **Kelahiran**: Tempat lahir, Tanggal lahir
- **Alamat**: Alamat lengkap, Provinsi, Kabupaten (dependent dropdown)
- **Foto**: Upload foto dengan preview dan kompresi otomatis

\*) Field wajib diisi

## 🔄 Alur Data

### Step 1 (Biodata)

```javascript
stepData.biodata = {
  mode: "existing" | "new",
  isExisting: boolean,
  userId: string, // Jika mode = 'existing'
  userData: {
    // Jika mode = 'new'
    nama,
    email,
    idlevel,
    nik,
    nip,
    telp,
    gelardepan,
    gelarbelakang,
    tempatlahir,
    tanggallahir,
    alamat,
    kodepropinsi,
    kodekabupaten,
    no_karpeg,
    status,
    foto,
  },
  photoFile: File, // File foto yang diupload
};
```

### Step 2-7 (Placeholder)

Akan menghasilkan ID yang diperlukan:

- Step 2: `idpenggunaunitkerja`
- Step 3: `idpenggunajenjang`
- Step 4: `idpenggunapangkat`
- Step 5: `idpenggunapendidikan`
- Step 6: `idpenggunapelatihan`
- Step 7: `idpenggunaprestasi`

## 🎨 UI/UX Features

### Card Selection (Step 1)

- Hover effect dengan animasi smooth
- Gradient icon background
- Responsive layout (2 kolom di desktop, 1 kolom di mobile)

### Wizard Navigation

- **7 step indicator** dengan icon di header:
  - 📱 Biodata
  - 🏢 Unit Kerja
  - 💼 Jabatan
  - ⭐ Pangkat
  - 🎓 Pendidikan
  - 📜 Pelatihan
  - 🏆 Prestasi

### Tombol Navigasi (Built-in Wizard)

Wizard menyediakan tombol navigasi otomatis di bawah content area:

- **Sebelumnya**: Kembali ke step sebelumnya (muncul di step 2-7)
- **Selanjutnya**: Lanjut ke step berikutnya (muncul di step 1-6, disabled jika validasi gagal)
- **Selesai**: Submit semua data (hanya muncul di step 7)

**Catatan:** Modal dapat ditutup dengan tombol X di header.

### Validasi

- Setiap step memiliki validasi sendiri
- Tombol "Selanjutnya" disabled jika step belum valid
- Tombol "Selesai" akan otomatis trigger submission

## 🔧 State Management

### Wizard State

```javascript
const stepData = reactive({
  biodata: {}, // Data dari Step 1
  unitKerja: {}, // Data dari Step 2
  jabatan: {}, // Data dari Step 3
  pangkat: {}, // Data dari Step 4
  pendidikan: {}, // Data dari Step 5
  pelatihan: {}, // Data dari Step 6
  prestasi: {}, // Data dari Step 7
});

const stepValidations = reactive([
  false, // Step 1: Biodata (validasi dinamis)
  true, // Step 2-7: Auto-valid (placeholder)
]);
```

## 📝 TODO: Implementasi Selanjutnya

### Step 2: Unit Kerja

- [ ] Form untuk memilih/menambah unit kerja
- [ ] API integration dengan service unit kerja
- [ ] Validasi dan emit `idpenggunaunitkerja`

### Step 3: Jabatan

- [ ] Form untuk memilih/menambah jabatan
- [ ] API integration dengan service jabatan
- [ ] Validasi dan emit `idpenggunajenjang`

### Step 4: Pangkat

- [ ] Form untuk memilih/menambah pangkat
- [ ] API integration dengan service pangkat
- [ ] Validasi dan emit `idpenggunapangkat`

### Step 5: Pendidikan

- [ ] Form untuk menambah riwayat pendidikan
- [ ] Support multiple entries
- [ ] Validasi dan emit `idpenggunapendidikan`

### Step 6: Pelatihan

- [ ] Form untuk menambah riwayat pelatihan
- [ ] Support multiple entries
- [ ] Validasi dan emit `idpenggunapelatihan`

### Step 7: Prestasi

- [ ] Form untuk menambah riwayat prestasi
- [ ] Support multiple entries
- [ ] Validasi dan emit `idpenggunaprestasi`

### Submission Logic

- [ ] Implementasi logic untuk mode "existing user"
- [ ] Sequential submission: Create user → Create related records
- [ ] Error handling untuk setiap step submission
- [ ] Rollback mechanism jika ada error di tengah proses

## 🚀 Cara Menggunakan

1. Buka halaman Employment Table
2. Klik tombol "Tambah Data"
3. Pilih mode: Gunakan data existing atau Buat baru
4. Isi/pilih data di Step 1 (Biodata)
5. Klik "Selanjutnya" untuk melanjutkan ke step berikutnya
6. Ulangi untuk step 2-7
7. Klik "Simpan" di step terakhir

## 🎯 Validasi

### Step 1 Validasi

- **Mode Existing**: Harus memilih user dari dropdown
- **Mode New**: Harus mengisi Nama, Email, dan Level/Role

### Step 2-7 Validasi

- Saat ini auto-valid (placeholder)
- Akan diimplementasikan sesuai kebutuhan masing-masing step

## 📦 Dependencies

- `form-wizard-vue3`: Wizard component
- `vue-toastification`: Toast notifications
- `yup`: Validation (untuk step yang memerlukan)
- `@/utils/imageCompressor`: Kompresi foto

## 🎨 Styling

- Bootstrap 5 untuk layout dan form
- Custom CSS untuk card selection
- Gradient backgrounds untuk visual appeal
- Smooth animations dan transitions
