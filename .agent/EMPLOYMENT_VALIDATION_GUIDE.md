# Panduan Validasi Form Employment

## ✅ Step 1: Biodata - FIELD WAJIB

Sebelum user dapat melanjutkan ke step berikutnya, field-field berikut **WAJIB** diisi:

### 1. **Nama Lengkap** ⚠️

- Field: `nama`
- Type: Text
- Validasi: Required, tidak boleh kosong
- Error: "Nama wajib diisi."

### 2. **NIK** ⚠️

- Field: `nik`
- Type: Text
- Validasi: Required, tidak boleh kosong
- Error: "NIK wajib diisi."

### 3. **Email** ⚠️

- Field: `email`
- Type: Email
- Validasi:
  - Required, tidak boleh kosong
  - Format email harus valid
- Error:
  - "Email wajib diisi."
  - "Format email salah"

### 4. **Level / Role** ⚠️

- Field: `idlevel`
- Type: Select/Dropdown
- Validasi: Required, harus pilih salah satu
- Error: "Level wajib dipilih."

---

## 📝 Field Opsional (Tidak Wajib)

Field berikut boleh dikosongkan:

- Gelar Depan
- Gelar Belakang
- No. Telepon
- NIP
- No. Karpeg
- Status Akun (default: "Aktif")
- Tempat Lahir
- Tanggal Lahir
- Alamat
- Provinsi
- Kabupaten
- Upload Foto

---

## 🔄 Steps 2-7: Repeater (Semua Opsional)

### Step 2: Unit Kerja

**Jika diisi**, wajib lengkapi:

- Unit Kerja (dropdown) ⚠️
- Tanggal Mulai ⚠️

Optional:

- Tanggal Selesai
- File SK

### Step 3: Jabatan

**Jika diisi**, wajib lengkapi:

- Jabatan/Jenjang (dropdown) ⚠️
- Tanggal Mulai ⚠️

Optional:

- Tanggal Selesai
- File SK

### Step 4: Pangkat

**Jika diisi**, wajib lengkapi:

- Pangkat (dropdown) ⚠️
- Tanggal Mulai ⚠️

Optional:

- Tanggal Selesai
- File SK

### Step 5: Pendidikan

**Jika diisi**, wajib lengkapi:

- Jenjang Pendidikan (dropdown) ⚠️
- Nama Sekolah/Universitas ⚠️

Optional:

- Jurusan
- Tahun Lulus
- File Ijazah

### Step 6: Pelatihan

**Jika diisi**, wajib lengkapi:

- Nama Pelatihan ⚠️

Optional:

- Penyelenggara
- Tanggal Mulai
- Tanggal Selesai
- File Sertifikat

### Step 7: Prestasi

**Jika diisi**, wajib lengkapi:

- Nama Prestasi ⚠️

Optional:

- Tingkat (Lokal/Nasional/Internasional)
- Tahun
- File Sertifikat

---

## 🚨 Alert System

### Saat Validation Gagal

**Step 1 (Biodata)**:

```
❌ Mode belum dipilih:
"Silakan pilih apakah Anda ingin menggunakan data yang ada atau membuat data baru."

❌ User belum dipilih (mode existing):
"Silakan pilih pengguna dari daftar yang ada."

❌ Field wajib kosong:
"Field berikut wajib diisi: Nama, NIK, Email, Level/Role"
```

**Steps 2-7 (Repeater)**:

```
❌ Field wajib dalam repeater kosong:
"Mohon lengkapi data yang wajib diisi pada langkah ini."
```

### Saat Validation Berhasil

```
✅ Step 1 completed → Lanjut ke Step 2
✅ Data tersimpan → "Data Berhasil Disimpan!"
✅ User baru dibuat → "Data pengguna baru berhasil dibuat."
```

---

## 💡 Tips Pengisian

1. **Mode Selection** (Step awal):

   - Pilih "Gunakan Data yang Ada" jika pegawai sudah pernah terdaftar
   - Pilih "Input Data Baru" untuk pegawai baru

2. **Required Fields**:

   - Field dengan tanda bintang merah (\*) wajib diisi
   - Tidak bisa lanjut ke step berikutnya jika ada yang kosong

3. **Repeater Steps**:

   - Boleh dilewati/skip jika tidak ada data
   - Bisa tambah lebih dari 1 riwayat
   - Hanya 1 data yang boleh berstatus "Aktif"

4. **File Upload**:

   - Format yang diterima: PDF, JPG, JPEG, PNG
   - Maksimal ukuran: 5MB
   - Foto pengguna akan otomatis dikompres

5. **Navigation**:
   - Gunakan tombol "Selanjutnya" untuk lanjut
   - Gunakan tombol "Sebelumnya" untuk kembali
   - Data tidak akan hilang saat navigasi antar step

---

**⚠️ PENTING**:

Jika ada field wajib yang belum diisi, sistem akan:

1. Menampilkan alert/toast error
2. Highlight field yang bermasalah dengan border merah
3. Mencegah user lanjut ke step berikutnya
4. Scroll otomatis ke field pertama yang error

---

**Last Updated**: 2025-11-28
