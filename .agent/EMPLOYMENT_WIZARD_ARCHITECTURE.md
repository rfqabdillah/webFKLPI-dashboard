# 🏗️ Employment Form Wizard - Arsitektur & Implementasi

## 📋 Ringkasan Eksekutif

Dokumen ini menjelaskan arsitektur lengkap untuk komponen `EmploymentFormModal.vue` yang telah dibangun ulang dengan pendekatan **Centralized State Management** dan **Consolidated Submission**.

---

## 🎯 Keputusan Arsitektur: Pengiriman Terpusat

### ✅ Rekomendasi: **CENTRALIZED SUBMISSION**

**Alasan:**

1. **Data Integrity**: Semua data tersimpan secara atomik (all-or-nothing)
2. **Relational Consistency**: `idpengguna` dijamin konsisten di semua step
3. **Better UX**: User bisa navigasi bebas tanpa khawatir kehilangan data
4. **Easier Rollback**: Jika error, mudah untuk rollback
5. **Simpler State Management**: Single source of truth
6. **Better Performance**: Mengurangi multiple API calls

### ⚠️ Pertimbangan

- Payload besar → Mitigasi: compress data jika perlu
- Timeout risk → Mitigasi: implement proper timeout handling

---

## 🏛️ Struktur Arsitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                   EmploymentFormModal.vue                       │
│                      (Parent Component)                         │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │          CENTRALIZED WIZARD STATE                         │ │
│  │                                                             │ │
│  │  wizardState = {                                           │ │
│  │    biodata: {                                              │ │
│  │      mode, userId, userData, photoFile, isPhotoRemoved    │ │
│  │    },                                                       │ │
│  │    unitKerja: { data: [], files: {} },                    │ │
│  │    jabatan: { data: [], files: {} },                      │ │
│  │    pangkat: { data: [], files: {} },                      │ │
│  │    pendidikan: { data: [] },                              │ │
│  │    pelatihan: { data: [], files: {} },                    │ │
│  │    prestasi: { data: [], files: {} }                      │ │
│  │  }                                                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              STEP VALIDATION STATE                        │ │
│  │                                                             │ │
│  │  stepValidations = {                                       │ │
│  │    0: false,  // Step 1: Biodata (Required)               │ │
│  │    1: true,   // Step 2: Unit Kerja (Optional)            │ │
│  │    2: true,   // Step 3: Jabatan (Optional)               │ │
│  │    3: true,   // Step 4: Pangkat (Optional)               │ │
│  │    4: true,   // Step 5: Pendidikan (Optional)            │ │
│  │    5: true,   // Step 6: Pelatihan (Optional)             │ │
│  │    6: true    // Step 7: Prestasi (Optional)              │ │
│  │  }                                                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                  WIZARD STEPS                             │ │
│  │                                                             │ │
│  │  Step 1: Biodata (REQUIRED)                               │ │
│  │    ├─ Card Selection (Existing/New)                       │ │
│  │    ├─ User Table (if Existing selected)                   │ │
│  │    └─ Biodata Form (Edit mode with data/Empty)           │ │
│  │                                                             │ │
│  │  Step 2-7: Repeaters (OPTIONAL)                           │ │
│  │    ├─ Multiple records allowed                            │ │
│  │    ├─ Only ONE active status per category                 │ │
│  │    └─ Uses idpengguna from Step 1                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │            FINAL SUBMISSION FLOW                          │ │
│  │                                                             │ │
│  │  1. Save/Update Biodata                                   │ │
│  │     ├─ If Edit: Update existing user                      │ │
│  │     ├─ If Existing: Use selected userId (optional update) │ │
│  │     └─ If New: Create new user → get userId               │ │
│  │                                                             │ │
│  │  2. For each category (Unit Kerja to Prestasi):          │ │
│  │     ├─ Attach idpengguna to each record                   │ │
│  │     ├─ If record has ID: Update                           │ │
│  │     └─ If record no ID: Create new                        │ │
│  │                                                             │ │
│  │  3. Success: Emit save-successful & close modal          │ │
│  │     Error: Show error message & rollback if needed        │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌──────────────┐
│   User       │
│  Interaction │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────┐
│  Step 1: Biodata             │
│  - Select mode (New/Existing)│
│  - Fill/Edit form            │
│  - Upload photo              │
└──────┬───────────────────────┘
       │
       │ Emit: validation-change
       │ Emit: user-selected (userId)
       │
       ▼
┌──────────────────────────────┐
│  EmploymentFormModal         │
│  wizardState.biodata ← data  │
│  currentUserId ← userId      │
└──────┬───────────────────────┘
       │
       │ Navigate to Step 2
       │ Trigger: loadData(userId)
       │
       ▼
┌──────────────────────────────┐
│  Step 2-7: Repeaters         │
│  - Fetch existing data       │
│  - Add/Edit/Remove records   │
│  - Handle file uploads       │
│  - Enforce single active     │
└──────┬───────────────────────┘
       │
       │ Emit: update:modelValue
       │
       ▼
┌──────────────────────────────┐
│  EmploymentFormModal         │
│  wizardState.{category} ← data│
└──────┬───────────────────────┘
       │
       │ User clicks "Selesai"
       │
       ▼
┌──────────────────────────────┐
│  submitForm()                │
│  ┌────────────────────────┐  │
│  │ 1. Save Biodata        │  │
│  │    → Get userId        │  │
│  │                         │  │
│  │ 2. Save Unit Kerja     │  │
│  │    (with userId)       │  │
│  │                         │  │
│  │ 3. Save Jabatan        │  │
│  │    (with userId)       │  │
│  │                         │  │
│  │ 4. Save Pangkat        │  │
│  │    (with userId)       │  │
│  │                         │  │
│  │ 5. Save Pendidikan     │  │
│  │    (with userId)       │  │
│  │                         │  │
│  │ 6. Save Pelatihan      │  │
│  │    (with userId)       │  │
│  │                         │  │
│  │ 7. Save Prestasi       │  │
│  │    (with userId)       │  │
│  └────────────────────────┘  │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│  Success!                    │
│  - Show toast notification   │
│  - Emit save-successful      │
│  - Close modal               │
└──────────────────────────────┘
```

---

## 🔧 Implementasi Per Step

### Step 1: Biodata (WAJIB)

**Struktur Data:**

```javascript
wizardState.biodata = {
  mode: "new" | "existing" | "edit",
  isExisting: boolean,
  userId: string | null,
  userData: {
    idpengguna,
    idlevel,
    email,
    nama,
    telp,
    created_at,
    updated_at,
    deleted_at,
    email_verified_at,
    remember_token,
    lastlogin,
    nik,
    gelardepan,
    gelarbelakang,
    alamat,
    kodekabupaten,
    nip,
    no_karpeg,
    tempatlahir,
    tanggallahir,
    foto,
    status,
  },
  photoFile: File | null,
  isPhotoRemoved: boolean,
};
```

**Validasi Wajib:**

- `nama` (required)
- `nik` (required)
- `email` (required, valid email format)
- `idlevel` (required)

**Alur:**

1. **Card Selection** (hanya untuk mode create, tidak untuk edit)

   - Card "Gunakan Data yang Ada"
   - Card "Input Data Baru"

2. **Jika pilih "Data yang Ada"**:

   - Tampilkan tabel pengguna dengan search
   - User pilih → load data → tampilkan form edit

3. **Jika pilih "Data Baru"**:

   - Tampilkan form biodata kosong

4. **Validasi sebelum next**:
   - Cek mode sudah dipilih
   - Cek field wajib terisi
   - Emit `user-selected(userId)` ke parent

---

### Step 2: Unit Kerja (OPSIONAL REPEATER)

**Struktur Data:**

```javascript
wizardState.unitKerja = {
  data: [
    {
      idpenggunaunitkerja, idpengguna, idunitkerja,
      tglmulai, tglselesai, filesk, status,
      created_at, updated_at, deleted_at,
      _filesk: File | null  // File to upload
    },
    ...
  ],
  files: {
    [index]: File  // Files mapped by index
  }
}
```

**Aturan:**

- User bisa tambah multiple records
- Hanya SATU record dengan `status = "Aktif"`
- Switch status → otomatis set yang lain jadi "Tidak Aktif"

**Implementasi dalam component:**

```javascript
function handleStatusChange(index, isChecked) {
  if (isChecked) {
    // Set semua status jadi "Tidak Aktif" kecuali yang dipilih
    unitKerjaList.value.forEach((item, i) => {
      item.status = i === index ? "Aktif" : "Tidak Aktif";
    });
  } else {
    unitKerjaList.value[index].status = "Tidak Aktif";
  }
}
```

---

### Step 3: Jabatan (OPSIONAL REPEATER)

**Struktur Data:**

```javascript
wizardState.jabatan = {
  data: [
    {
      idepnggunajenjang, idpengguna, idjenjang,
      tglmulai, tglselesai, filesk, status,
      created_at, updated_at, deleted_at,
      _filesk: File | null
    },
    ...
  ],
  files: { }
}
```

**Aturan yang sama dengan Step 2**

---

### Step 4: Pangkat (OPSIONAL REPEATER)

**Struktur Data:**

```javascript
wizardState.pangkat = {
  data: [
    {
      idpenggunapangkat, idpengguna, idpangkat,
      tglmulai, tglselesai, filesk, status,
      created_at, updated_at, deleted_at,
      _filesk: File | null
    },
    ...
  ],
  files: { }
}
```

---

### Step 5: Pendidikan (OPSIONAL REPEATER)

**Struktur Data:**

```javascript
wizardState.pendidikan = {
  data: [
    {
      idpenggunapendidikan, idpengguna, idjenjangpendidikan,
      programstudi, namaperguruantinggi, tahunlulus,
      created_at, updated_at, deleted_at
    },
    ...
  ]
}
```

**Catatan:** Step ini tidak memiliki status aktif/tidak aktif dan tidak ada file upload

---

### Step 6: Pelatihan (OPSIONAL REPEATER)

**Struktur Data:**

```javascript
wizardState.pelatihan = {
  data: [
    {
      idpenggunalatihan, idpengguna, namapelatihan,
      namapenyelenggara, filesertifikat, tglmulai, tglselesai,
      status, created_at, updated_at, deleted_at,
      _filesertifikat: File | null
    },
    ...
  ],
  files: { }
}
```

---

### Step 7: Prestasi (OPSIONAL REPEATER)

**Struktur Data:**

```javascript
wizardState.prestasi = {
  data: [
    {
      idpenggunaprestasi, idpengguna, idskala,
      namaprestasi, namapenyelenggara, filesertifikat,
      status, created_at, updated_at, deleted_at,
      _filesertifikat: File | null
    },
    ...
  ],
  files: { }
}
```

---

## 🔄 State Management Pattern

### Parent → Child Communication

```javascript
// EmploymentFormModal.vue
<Step2UnitKerja
  v-model="wizardState.unitKerja"
  :currentUserId="currentUserId"
  @validation-change="(isValid) => updateStepValidation(1, isValid)"
/>
```

### Child → Parent Communication

```javascript
// Step2UnitKerja.vue
watch(
  [unitKerjaList],
  () => {
    const data = {
      data: unitKerjaList.value.map((item) => ({ ...item })),
      files: {}, // Collect files if needed
    };

    emit("update:modelValue", data);
    emit("validation-change", isValid);
  },
  { deep: true }
);
```

---

## 📡 API Integration

### Service Layer Structure

```
src/services/
├── referensi/
│   ├── users.js              # addUser, updateUser
│   ├── roles.js
│   ├── regions.js
│   ├── workUnits.js
│   ├── positions.js
│   ├── ranks.js
│   └── educationLevels.js
│
└── general/personnel/
    ├── userWorkUnits.js      # addUserWorkUnit, updateUserWorkUnit
    ├── userPositions.js      # addUserPosition, updateUserPosition
    ├── userRanks.js          # addUserRank, updateUserRank
    ├── userEducations.js     # addUserEducation, updateUserEducation
    ├── userTrainings.js      # addUserTraining, updateUserTraining
    └── userAchievements.js   # addUserAchievement, updateUserAchievement
```

### FormData Structure for Each Step

**Step 1: Biodata**

```javascript
const formData = new FormData();
formData.append("record[idlevel]", value);
formData.append("record[email]", value);
formData.append("record[nama]", value);
// ... all biodata fields
formData.append("upload_foto", photoFile, photoFile.name);
```

**Step 2-7: Repeaters**

```javascript
const formData = new FormData();
formData.append("record[idpengguna]", userId); // Always attach userId
formData.append("record[idunitkerja]", value);
formData.append("record[tglmulai]", value);
formData.append("record[tglselesai]", value);
formData.append("record[status]", value);
formData.append("upload_filesk", file, file.name); // If file exists
```

---

## ✅ Validation Strategy

### Step 1 Validation

```javascript
async function validate() {
  // 1. Check mode selected
  if (!selectionMade.value && !isEditMode.value) {
    toast.error("Silakan pilih mode terlebih dahulu");
    return false;
  }

  // 2. Check user selected (if existing mode)
  if (mode.value === "existing" && !selectedUser.value) {
    toast.error("Silakan pilih pengguna");
    return false;
  }

  // 3. Validate required fields
  await validationSchema.validate(formData, { abortEarly: false });

  return true;
}
```

### Step 2-7 Validation

```javascript
async function validate() {
  // Optional steps always return true
  // But can validate if user has added data

  if (itemList.value.length === 0) {
    return true; // No data, skip
  }

  // Validate each item in the list
  for (const item of itemList.value) {
    if (!item.requiredField) {
      toast.error("Field wajib belum terisi");
      return false;
    }
  }

  return true;
}
```

---

## 🚨 Error Handling

### Submission Error Handling

```javascript
try {
  await submitForm();
} catch (error) {
  console.error("Submission error:", error);

  // Display user-friendly error
  errorMessage.value =
    error.response?.data?.message ||
    error.message ||
    "Terjadi kesalahan saat menyimpan data";

  toast.error(errorMessage.value);

  // Optionally: Rollback changes if needed
  // For centralized submission, rollback is simpler
}
```

### Network Error Handling

```javascript
// In each API call
try {
  const response = await apiCall(data);
  return response;
} catch (error) {
  if (error.code === "ECONNABORTED") {
    throw new Error("Koneksi timeout. Silakan coba lagi.");
  }
  if (!error.response) {
    throw new Error("Tidak ada koneksi internet.");
  }
  throw error;
}
```

---

## 🎨 UI/UX Considerations

### Loading States

```javascript
// Global loading for final submission
const isLoading = ref(false);

// Per-step loading for data fetching
const isDataLoading = ref(false);
```

### User Feedback

```javascript
// Step validation feedback
toast.error("Silakan lengkapi field yang wajib diisi");

// Successful submission
toast.success("Data pegawai berhasil disimpan");

// Single active status enforcement
toast.info(
  "Status aktif hanya boleh satu. Status lainnya diatur ke tidak aktif."
);
```

### Disabled State Logic

```javascript
// Disable "Next" button if current step invalid
:disabled="isLoading || !stepValidations[currentTabIndex]"

// Disable form inputs during submission
:disabled="isLoading"
```

---

## 🔐 Security Considerations

1. **File Upload Validation**

   - Validate file type (images, PDFs only)
   - Validate file size (max 5MB recommended)
   - Implement virus scanning if possible

2. **Data Sanitization**

   - Sanitize all text inputs before submission
   - Validate email format
   - Validate date ranges

3. **Authorization**
   - Ensure user has permission to create/edit
   - Validate idpengguna on backend
   - Check ownership before update

---

## 📈 Performance Optimization

### Lazy Loading

```javascript
// Only load data when step is visited
async function onChangeCurrentTab(prevIndex, nextIndex) {
  if (nextIndex > 0 && !stepLoaded[nextIndex]) {
    await stepRef.value.loadData(currentUserId.value);
    stepLoaded[nextIndex] = true;
  }
}
```

### Debouncing

```javascript
// Debounce search input
const handleSearch = debounce(() => {
  // Perform search
}, 300);
```

### File Compression

```javascript
// Compress images before upload
const compressedFile = await compressImage(file, {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
});
```

---

## 🧪 Testing Strategy

### Unit Tests

- Test each validation function
- Test state mutations
- Test FormData creation

### Integration Tests

- Test wizard navigation
- Test data persistence across steps
- Test submission flow

### E2E Tests

- Test complete user journey
- Test error scenarios
- Test file uploads

---

## 📝 Maintenance Notes

### Common Issues & Solutions

**Issue 1: userId not propagated to steps 2-7**

```javascript
// Solution: Ensure currentUserId computed property is reactive
const currentUserId = computed(() => {
  if (isEditMode.value) return props.fieldToEdit.idpengguna;
  if (wizardState.biodata.userId) return wizardState.biodata.userId;
  if (createdUserId.value) return createdUserId.value;
  return null;
});
```

**Issue 2: Multiple active status**

```javascript
// Solution: Enforce in handleStatusChange
function handleStatusChange(index, isChecked) {
  if (isChecked) {
    itemList.value.forEach((item, i) => {
      item.status = i === index ? "Aktif" : "Tidak Aktif";
    });
  }
}
```

**Issue 3: File upload not working**

```javascript
// Solution: Use correct FormData key and ensure file object is File instance
if (item._filesk instanceof File) {
  formData.append("upload_filesk", item._filesk, item._filesk.name);
}
```

---

## 🚀 Future Enhancements

1. **Auto-save Draft**

   - Save wizardState to localStorage
   - Restore on modal reopen

2. **Bulk Import**

   - Import multiple employees from Excel/CSV

3. **Validation Summary**

   - Show all validation errors at once

4. **Progress Indicator**

   - Show completion percentage

5. **Conditional Steps**
   - Hide/show steps based on user type

---

## 📚 References

- Vue 3 Documentation: https://vuejs.org/
- Vue Form Wizard: https://www.npmjs.com/package/vue3-form-wizard
- Yup Validation: https://github.com/jquense/yup
- FormData API: https://developer.mozilla.org/en-US/docs/Web/API/FormData

---

**Last Updated:** 2025-11-28  
**Version:** 2.0  
**Author:** Antigravity AI
