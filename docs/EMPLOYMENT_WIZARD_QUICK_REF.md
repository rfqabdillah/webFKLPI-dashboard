# 🚀 Employment Form Wizard - Quick Reference

## 📋 Ringkasan Singkat

Form wizard 7-step untuk manajemen data kepegawaian dengan **centralized state management** dan **consolidated final submission**.

---

## 🎯 Rekomendasi: **CENTRALIZED SUBMISSION** ✅

### Keputusan Akhir

**Gunakan pendekatan centralized submission** karena memberikan:

| Keuntungan            | Keterangan                                                      |
| --------------------- | --------------------------------------------------------------- |
| 🔒 **Data Integrity** | Semua data tersimpan dalam 1 transaksi atomik                   |
| 👤 **Better UX**      | User bebas navigasi forward/backward tanpa khawatir data hilang |
| ✅ **Validation**     | Dapat validasi cross-step & enforce "single active status" rule |
| 🐛 **Debugging**      | State terpusat mudah di-monitor & debug                         |
| ↩️ **Rollback**       | Mudah rollback jika ada error di tengah proses                  |
| ⚡ **Performance**    | 1x batch API call > multiple sequential calls                   |

### Anti-Pattern: Per-Step Submission ❌

Hindari per-step submission karena:

- ❌ Data bisa incomplete jika user cancel di tengah
- ❌ Sulit handle cascade delete/update
- ❌ Banyak API calls = lambat
- ❌ Kompleksitas rollback tinggi
- ❌ Tidak bisa validasi cross-step

---

## 🔄 Alur Wizard (7 Steps)

### Step 1: **Biodata** (REQUIRED ⚠️)

**Card Selection** → Pilih mode:

1. 🔍 **Gunakan Data yang Ada** → pilih dari tabel pengguna
2. ➕ **Input Data Baru** → isi form kosong

**Validasi Wajib:**

- ✅ Nama
- ✅ NIK
- ✅ Email
- ✅ Level/Role

**Fitur Khusus:**

- 🔄 Loading state: field disabled dengan "Memuat..." saat data loading
- 🔔 Alert validation: muncul jika field wajib belum diisi

---

### Step 2-7: **Repeater Steps** (OPTIONAL)

| Step | Kategori   | File Upload   | Single Active Status |
| ---- | ---------- | ------------- | -------------------- |
| 2    | Unit Kerja | ✅ SK         | ✅                   |
| 3    | Jabatan    | ✅ SK         | ✅                   |
| 4    | Pangkat    | ✅ SK         | ✅                   |
| 5    | Pendidikan | ❌            | ❌                   |
| 6    | Pelatihan  | ✅ Sertifikat | ✅                   |
| 7    | Prestasi   | ✅ Sertifikat | ✅                   |

**Rule: Single Active Status** ⚠️  
Setiap kategori hanya boleh memiliki **SATU** data dengan status "Aktif".

---

## 💾 Mekanisme Pengiriman Data

### Flow Diagram

```
User Fills Wizard
      ↓
Navigate Freely (All data saved in wizardState)
      ↓
Click "Selesai" (Last Step)
      ↓
Validate All Data
├─ Required fields (Step 1)
├─ Single active status (Step 2-7)
└─ File formats & sizes
      ↓
Save Biodata → Get userId
      ↓
Save All Related Data (Step 2-7)
├─ Attach userId to all records
├─ Handle file uploads
└─ Sequential API calls
      ↓
✅ Success → Show toast → Close modal
❌ Error → Show error → Stay in wizard
```

### Code Snippet

```javascript
async function submitForm() {
  try {
    // 1. Validate
    validateSingleActiveStatus();

    // 2. Save biodata
    const userId = await saveBiodataCreate();

    // 3. Save all related data
    await saveUnitKerja(userId);
    await saveJabatan(userId);
    await savePangkat(userId);
    await savePendidikan(userId);
    await savePelatihan(userId);
    await savePrestasi(userId);

    // 4. Success
    toast.success("Data berhasil disimpan");
    closeModal();
  } catch (error) {
    toast.error(error.message);
  }
}
```

---

## 🗂️ Struktur State (Centralized)

```javascript
wizardState = {
  biodata: {
    mode: "", // 'new' | 'existing' | 'edit'
    userId: null,
    userData: {}, // All biodata fields
    photoFile: null,
  },
  unitKerja: {
    data: [], // Array of records
    files: {}, // Map: index → File
  },
  jabatan: { data: [], files: {} },
  pangkat: { data: [], files: {} },
  pendidikan: { data: [] },
  pelatihan: { data: [], files: {} },
  prestasi: { data: [], files: {} },
};
```

---

## ✅ Checklist Implementasi

### Step 1: Biodata

- [x] Card selection UI
- [x] User selection table
- [x] Loading state dengan "Memuat..."
- [x] Validasi required fields (Nama, NIK, Email, Level)
- [x] Alert validation
- [x] Photo upload & compression
- [x] Province & Kabupaten dependent dropdown

### Step 2-7: Repeaters

- [x] Add/Remove items
- [x] Single active status enforcement
- [x] File upload handling
- [x] Validation per item
- [x] Alert untuk "single active status" rule

### Parent Component

- [x] Centralized wizardState
- [x] Step validation tracking
- [x] Lazy loading data per step
- [x] Final consolidated submission
- [x] Single active status validation
- [x] Error handling & rollback
- [x] Success notification

---

## 🎨 UI/UX Highlights

### Card Selection

```vue
<div class="selection-card" @click="selectMode('existing')">
  <div class="card-icon">👥</div>
  <h6>Gunakan Data yang Ada</h6>
  <p>Pilih dari daftar pengguna yang sudah terdaftar</p>
</div>
```

### Loading State

```vue
<input
  :placeholder="isLoadingUserData ? 'Memuat...' : 'Nama lengkap'"
  :disabled="isLoadingUserData"
  v-model="formData.nama"
/>
```

### Alert Validation

```javascript
if (!formData.nama || !formData.nik || !formData.email || !formData.idlevel) {
  toast.error("Silakan lengkapi semua field yang wajib diisi.");
  return false;
}
```

---

## 🔒 Business Rules

### 1. Single Active Status

✅ **Enforced Client-Side** sebelum submit:

```javascript
function validateSingleActiveStatus() {
  const activeCount = wizardState.unitKerja.data.filter(
    (item) => item.status === "Aktif"
  ).length;

  if (activeCount > 1) {
    throw new Error("Hanya boleh ada 1 Unit Kerja aktif");
  }
}
```

### 2. Required Fields (Step 1)

- Nama ✅
- NIK ✅
- Email ✅ (valid format)
- Level/Role ✅

### 3. idpengguna Consistency

Semua data di Step 2-7 **HARUS** menggunakan `idpengguna` dari Step 1:

- Mode new → dari response `create user`
- Mode existing → dari user yang dipilih
- Mode edit → dari `props.fieldToEdit`

---

## 🚨 Error Handling

### Strategi

1. **Client-side validation first** (yup schema)
2. **toast.error()** untuk error user-facing
3. **console.error()** untuk debugging
4. **Stay in wizard** jika ada error (jangan close modal)
5. **Highlight error fields** dengan class `is-invalid`

### Example

```javascript
try {
  await submitForm();
} catch (error) {
  console.error("Submission error:", error);

  // Extract user-friendly message
  const message =
    error.response?.data?.message ||
    error.message ||
    "Terjadi kesalahan saat menyimpan data";

  toast.error(message);

  // Stay in wizard untuk koreksi
}
```

---

## 📦 Dependencies

```json
{
  "vue": "^3.x",
  "vue3-form-wizard": "^x.x",
  "vue-toastification": "^x.x",
  "yup": "^x.x"
}
```

---

## 🔗 Related Files

```
src/pages/employment/
├── EmploymentFormModal.vue          # Parent wizard
└── steps/
    ├── Step1Biodata.vue
    ├── Step2UnitKerja.vue
    ├── Step3Jabatan.vue
    ├── Step4Pangkat.vue
    ├── Step5Pendidikan.vue
    ├── Step6Pelatihan.vue
    └── Step7Prestasi.vue

src/services/
├── referensi/
│   └── users.js                     # User API
└── general/personnel/
    ├── userWorkUnits.js
    ├── userPositions.js
    ├── userRanks.js
    ├── userEducation.js
    ├── userTrainings.js
    └── userAchievments.js
```

---

## 💡 Tips & Best Practices

### DO ✅

- ✅ Gunakan centralized state
- ✅ Validate sebelum submit
- ✅ Show loading states
- ✅ Compress images sebelum upload
- ✅ Handle errors gracefully
- ✅ Use TypeScript untuk type safety (optional)

### DON'T ❌

- ❌ Submit data per-step
- ❌ Mutate state directly (use spread operator)
- ❌ Skip validation
- ❌ Ignore error messages dari server
- ❌ Close modal saat masih ada error

---

## 🎓 Kesimpulan

**Mekanisme pengiriman data yang direkomendasikan:**

## ✅ CENTRALIZED SUBMISSION (One Complete Process)

**Alasan:**

1. 🔒 Data integrity terjamin
2. 👤 User experience lebih baik
3. ✅ Validasi lebih komprehensif
4. 🐛 Debugging lebih mudah
5. ⚡ Performance lebih optimal

**Implementation:**

- Semua data disimpan di `wizardState`
- User bebas navigasi antar step
- Validation dilakukan sebelum final submit
- Satu kali batch submission ke API
- Rollback otomatis jika ada error

---

**Quick Ref Version**: 1.0.0  
**Last Updated**: 2025-11-28  
**Full Documentation**: [EMPLOYMENT_FORM_WIZARD_ARCHITECTURE.md](./EMPLOYMENT_FORM_WIZARD_ARCHITECTURE.md)
