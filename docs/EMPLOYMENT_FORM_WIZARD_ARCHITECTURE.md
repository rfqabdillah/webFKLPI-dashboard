# 📋 Employment Form Wizard - Architecture Documentation

## 🎯 Tujuan

Form wizard ini dirancang untuk mengelola data kepegawaian (employment) secara komprehensif dengan pendekatan **state-driven** dan **centralized submission**. Wizard ini memungkinkan penginputan data pegawai mulai dari biodata hingga riwayat pekerjaan, jabatan, pangkat,pendidikan, pelatihan, dan prestasi dalam satu alur yang terstruktur.

---

## 🏗️ Arsitektur Sistem

### 1. Centralized State Management

Semua data wizard disimpan dalam satu objek `wizardState` yang reaktif di komponen induk `EmploymentFormModal.vue`.

```javascript
const wizardState = reactive({
  biodata: {
    mode: "", // 'new' | 'existing' | 'edit'
    isExisting: false,
    userId: null,
    userData: {
      /* sesuai struktur API */
    },
    photoFile: null,
    isPhotoRemoved: false,
  },
  unitKerja: { data: [], files: {} },
  jabatan: { data: [], files: {} },
  pangkat: { data: [], files: {} },
  pendidikan: { data: [] },
  pelatihan: { data: [], files: {} },
  prestasi: { data: [], files: {} },
});
```

**Keuntungan:**

- ✅ Single source of truth
- ✅ Data persisten saat navigasi antar-step
- ✅ Mudah di-debug dan di-monitor
- ✅ Memungkinkan validasi cross-step

### 2. Struktur Data

#### Step 1: Biodata

```javascript
{
  idpengguna: "Value",
  idlevel: "Value",
  email: "Value",
  nama: "Value",
  telp: "Value",
  created_at: "Value",
  updated_at: "Value",
  deleted_at: "Value",
  email_verified_at: "Value",
  remember_token: "Value",
  lastlogin: "Value",
  nik: "Value",
  gelardepan: "Value",
  gelarbelakang: "Value",
  alamat: "Value",
  kodekabupaten: "Value",
  nip: "Value",
  no_karpeg: "Value",
  tempatlahir: "Value",
  tanggallahir: "Value",
  foto: "Value",
  status: "Value"
}
```

#### Step 2: Unit Kerja (Repeater)

```javascript
{
  idpenggunaunitkerja: "Value",
  idpengguna: "Value",
  idunitkerja: "Value",
  tglmulai: "Value",
  tglselesai: "Value",
  filesk: "Value",
  status: "Value",
  created_at: "Value",
  updated_at: "Value",
  deleted_at: "Value"
}
```

#### Step 3: Jabatan (Repeater)

```javascript
{
  idepnggunajenjang: "Value",
  idpengguna: "Value",
  idjenjang: "Value",
  tglmulai: "Value",
  tglselesai: "Value",
  filesk: "Value",
  status: "Value",
  created_at: "Value",
  updated_at: "Value",
  deleted_at: "Value"
}
```

#### Step 4: Pangkat (Repeater)

```javascript
{
  idpenggunapangkat: "Value",
  idpengguna: "Value",
  idpangkat: "Value",
  tglmulai: "Value",
  tglselesai: "Value",
  filesk: "Value",
  status: "Value",
  created_at: "Value",
  updated_at: "Value",
  deleted_at: "Value"
}
```

#### Step 5: Pendidikan (Repeater)

```javascript
{
  idpenggunapendidikan: "Value",
  idpengguna: "Value",
  idjenjangpendidikan: "Value",
  programstudi: "Value",
  namaperguruantinggi: "Value",
  tahunlulus: "Value",
  created_at: "Value",
  updated_at: "Value",
  deleted_at: "Value"
}
```

#### Step 6: Pelatihan (Repeater)

```javascript
{
  idpenggunalatihan: "Value",
  idpengguna: "Value",
  namapelatihan: "Value",
  namapenyelenggara: "Value",
  filesertifikat: "Value",
  created_at: "Value",
  updated_at: "Value",
  deleted_at: "Value",
  tglmulai: "Value",
  tglselesai: "Value",
  status: "Value"
}
```

#### Step 7: Prestasi (Repeater)

```javascript
{
  idpenggunaprestasi: "Value",
  idpengguna: "Value",
  idskala: "Value",
  namaprestasi: "Value",
  namapenyelenggara: "Value",
  filesertifikat: "Value",
  created_at: "Value",
  updated_at: "Value",
  deleted_at: "Value",
  status: "Value"
}
```

---

## 🔄 Alur Wizard

### Step 1: Biodata (Required)

#### Mode Selection

Pengguna harus memilih salah satu:

1. **Gunakan Data yang Ada** → Pilih pengguna dari tabel
2. **Input Data Baru** → Isi form biodata kosong

#### Fitur Khusus:

- **Card Selection**: UI card interaktif untuk pemilihan mode
- **User Selection Table**: Tabel searchable untuk memilih pengguna existing
- **Loading State**: Field disabled dengan placeholder "Memuat..." saat data loading
- **Validasi Wajib**: Nama, NIK, Email, dan Level harus diisi
- **Alert Validation**: Muncul alert jika field wajib belum diisi

```vue
<!-- Card Selection -->
<div class="selection-cards">
  <div class="selection-card" @click="selectMode('existing')">
    Gunakan Data yang Ada
  </div>
  <div class="selection-card" @click="selectMode('new')">
    Input Data Baru
  </div>
</div>
```

#### Validasi:

```javascript
const validationSchema = yup.object().shape({
  nama: yup.string().required("Nama wajib diisi."),
  nik: yup.string().required("NIK wajib diisi."),
  email: yup.string().email().required("Email wajib diisi."),
  idlevel: yup.string().required("Level wajib dipilih."),
});
```

### Step 2-7: Repeater Steps

#### Karakteristik:

- **Repeater**: Dapat menambahkan multiple records per kategori
- **Single Active Status**: Hanya 1 record dapat berstatus "Aktif" per kategori
- **Optional**: Tidak wajib diisi
- **File Upload**: Beberapa kategori memiliki file upload (SK, sertifikat)

#### Switch Button Logic:

```javascript
// Ketika user mengaktifkan satu item
function toggleStatus(index) {
  // Non-aktifkan semua item lain
  wizardState.unitKerja.data.forEach((item, i) => {
    item.status = i === index ? "Aktif" : "Tidak Aktif";
  });
}
```

---

## 💾 Mekanisme Pengiriman Data

### **REKOMENDASI: Centralized Submission** ✅

#### Mengapa Centralized?

| Aspek               | Centralized                   | Per-Step              |
| ------------------- | ----------------------------- | --------------------- |
| **Integritas Data** | ✅ Terjamin dalam 1 transaksi | ❌ Bisa incomplete    |
| **Validasi**        | ✅ Dapat validasi cross-step  | ❌ Terbatas per step  |
| **User Experience** | ✅ Bebas navigasi             | ❌ Harus sequential   |
| **Rollback**        | ✅ Mudah                      | ❌ Kompleks           |
| **Performance**     | ✅ 1x API batch               | ❌ Multiple API calls |
| **Debugging**       | ✅ Mudah tracking             | ❌ Sulit tracking     |

#### Alur Submission:

```
┌─────────────────────────────────────────────────────┐
│  STEP 1: User clicks "Selesai" on final step        │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  STEP 2: Validate all wizard data                   │
│  - Check required fields in Step 1                  │
│  - Validate single active status rule (Step 2-7)    │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  STEP 3: Save/Update Biodata                        │
│  - Create new user OR update existing               │
│  - Get userId from response                         │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  STEP 4: Save Related Data (sequentially)           │
│  For each category (Unit Kerja → Prestasi):         │
│  ├─ Attach userId to all records                    │
│  ├─ Handle file uploads                             │
│  ├─ Create new records OR update existing           │
│  └─ Move to next category                           │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  STEP 5: Success                                     │
│  - Show success toast                               │
│  - Emit save-successful event                       │
│  - Close modal                                      │
└─────────────────────────────────────────────────────┘
```

#### Implementation:

```javascript
async function submitForm() {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    // 1. Validate single active status
    validateSingleActiveStatus();

    // 2. Save biodata → get userId
    let userId = null;
    if (isEditMode.value) {
      userId = props.fieldToEdit.idpengguna;
      await saveBiodataUpdate(userId);
    } else if (wizardState.biodata.mode === "new") {
      userId = await saveBiodataCreate();
    } else if (wizardState.biodata.isExisting) {
      userId = wizardState.biodata.userId;
      await saveBiodataUpdate(userId);
    }

    if (!userId) throw new Error("Gagal mendapatkan ID pengguna");

    // 3. Save all related data
    await saveUnitKerja(userId);
    await saveJabatan(userId);
    await savePangkat(userId);
    await savePendidikan(userId);
    await savePelatihan(userId);
    await savePrestasi(userId);

    // 4. Success
    toast.success("Data berhasil disimpan");
    emit("save-successful");
    closeModal();
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error(error.message);
  } finally {
    isLoading.value = false;
  }
}
```

---

## 🎨 Component Architecture

```
EmploymentFormModal.vue (Parent)
├── wizardState (Centralized State)
├── Step1Biodata.vue
│   ├── Card Selection UI
│   ├── User Selection Table
│   ├── Biodata Form
│   └── Validation (required fields)
├── Step2UnitKerja.vue (Repeater)
│   ├── Add/Remove items
│   ├── Single active status
│   └── File upload (SK)
├── Step3Jabatan.vue (Repeater)
│   ├── Add/Remove items
│   ├── Single active status
│   └── File upload (SK)
├── Step4Pangkat.vue (Repeater)
│   ├── Add/Remove items
│   ├── Single active status
│   └── File upload (SK)
├── Step5Pendidikan.vue (Repeater)
│   └── Add/Remove items
├── Step6Pelatihan.vue (Repeater)
│   ├── Add/Remove items
│   ├── Single active status
│   └── File upload (Sertifikat)
└── Step7Prestasi.vue (Repeater)
    ├── Add/Remove items
    ├── Single active status
    └── File upload (Sertifikat)
```

### Data Flow:

```
┌──────────────────────┐
│  User Interaction    │
│  (Edit Form Field)   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Step Component      │
│  (v-model binding)   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Update wizardState  │
│  (Parent Component)  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Emit Events         │
│  - validation-change │
│  - user-selected     │
└──────────────────────┘
```

---

## ✅ Validasi

### Step 1 (Biodata)

- ✅ Mode selection (existing/new) harus dipilih
- ✅ Jika mode existing, user harus dipilih dari tabel
- ✅ Field wajib: Nama, NIK, Email, Level
- ✅ Email harus format valid
- ✅ Alert muncul jika validasi gagal

### Step 2-7 (Repeaters)

- ✅ Optional (boleh kosong)
- ✅ Single active status rule: max 1 item aktif per kategori
- ✅ Validasi file upload (format, size)
- ✅ Validasi tanggal (tglmulai < tglselesai)

### Validasi Final (Before Submit)

```javascript
function validateSingleActiveStatus() {
  const categories = [
    { name: "Unit Kerja", data: wizardState.unitKerja.data },
    { name: "Jabatan", data: wizardState.jabatan.data },
    { name: "Pangkat", data: wizardState.pangkat.data },
    { name: "Pelatihan", data: wizardState.pelatihan.data },
    { name: "Prestasi", data: wizardState.prestasi.data },
  ];

  for (const category of categories) {
    if (!category.data || category.data.length === 0) continue;

    const activeCount = category.data.filter(
      (item) => item.status === "Aktif"
    ).length;

    if (activeCount > 1) {
      throw new Error(`${category.name} hanya boleh memiliki 1 data aktif`);
    }
  }
}
```

---

## 🚀 Best Practices

### 1. State Management

- ✅ Gunakan `reactive()` untuk nested objects
- ✅ Gunakan `ref()` untuk primitive values
- ✅ Avoid direct mutation, use spread operator

### 2. Component Communication

- ✅ Parent → Child: Props
- ✅ Child → Parent: Emits
- ✅ Two-way binding: `v-model`

### 3. Validation

- ✅ Client-side validation first (yup schema)
- ✅ Show inline errors (per field)
- ✅ Show toast for form-level errors
- ✅ Server-side validation as backup

### 4. File Handling

- ✅ Kompres image sebelum upload
- ✅ Validate file size & type
- ✅ Use FormData untuk multipart uploads
- ✅ Show preview sebelum submit

### 5. Error Handling

```javascript
try {
  await submitForm();
} catch (error) {
  console.error("Error:", error);
  errorMessage.value =
    error.response?.data?.message || error.message || "Terjadi kesalahan";
  toast.error(errorMessage.value);
}
```

---

## 📊 Performance Optimization

### 1. Lazy Loading

- Step 2-7 data di-load hanya saat step dikunjungi
- Gunakan flag `stepLoaded` untuk tracking

### 2. Debouncing

- Search di user selection table
- Auto-save draft (optional)

### 3. Memoization

- Use `computed()` untuk derived state
- Cache reference data (roles, regions, dll)

---

## 🧪 Testing Guidelines

### Unit Tests

```javascript
describe("Step1Biodata", () => {
  it("should show card selection for new wizard", () => {
    // Test card visibility
  });

  it("should validate required fields", async () => {
    // Test validation
  });

  it("should load user data when selected", async () => {
    // Test user selection
  });
});
```

### Integration Tests

```javascript
describe("EmploymentFormModal", () => {
  it("should complete full wizard flow", async () => {
    // 1. Select mode
    // 2. Fill biodata
    // 3. Add unit kerja
    // 4. Submit
    // 5. Verify API calls
  });
});
```

---

## 🔧 Maintenance Notes

### Adding New Step

1. Create new step component in `/steps/`
2. Add to `wizardState` in parent
3. Add tab-content in template
4. Add save function in `submitForm()`
5. Update validation if needed

### Modifying Data Structure

1. Update `wizardState` initialization
2. Update API payload mapping
3. Update validation schema
4. Update documentation

---

## 📚 API Integration

### Endpoints Used

#### Biodata

- `POST /users` - Create user
- `PUT /users/{id}` - Update user

#### Unit Kerja

- `POST /user-work-units` - Create
- `PUT /user-work-units/{id}` - Update

#### Jabatan

- `POST /user-positions` - Create
- `PUT /user-positions/{id}` - Update

#### Pangkat

- `POST /user-ranks` - Create
- `PUT /user-ranks/{id}` - Update

#### Pendidikan

- `POST /user-education` - Create
- `PUT /user-education/{id}` - Update

#### Pelatihan

- `POST /user-trainings` - Create
- `PUT /user-trainings/{id}` - Update

#### Prestasi

- `POST /user-achievements` - Create
- `PUT /user-achievements/{id}` - Update

### FormData Structure

```javascript
// For biodata
FormData {
  "record[nama]": "Value",
  "record[nik]": "Value",
  "upload_foto": File,
  ...
}

// For repeaters with file
FormData {
  "record[idpengguna]": "123",
  "record[idunitkerja]": "456",
  "upload_filesk": File,
  ...
}
```

---

## 🎯 Kesimpulan

Arsitektur **Centralized Submission** dipilih karena:

1. ✅ **Data Integrity**: Semua data tersimpan dalam satu transaksi
2. ✅ **Better UX**: User bebas navigasi tanpa khawatir data hilang
3. ✅ **Single Active Status**: Mudah enforce constraint di client-side
4. ✅ **Easier Debugging**: State terpusat mudah di-monitor
5. ✅ **Atomic Operations**: All-or-nothing submission
6. ✅ **Performance**: 1 batch API call lebih efisien

Pendekatan ini memberikan soliditas, maintainability, dan user experience yang superior dibanding per-step submission.

---

**Dokumentasi ini adalah living document**. Update seiring dengan perubahan requirement atau improvement yang dilakukan.

**Last Updated**: 2025-11-28  
**Version**: 1.0.0  
**Maintainer**: Development Team
