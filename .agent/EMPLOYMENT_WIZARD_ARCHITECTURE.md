# Employment Form Wizard - Arsitektur Baru

## 📋 Overview

File `EmploymentFormModal.vue` telah **dibangun ulang** dengan arsitektur wizard yang lebih bersih, konsisten, dan mudah dimaintain.

## 🎯 Fitur Utama

### 1. **Alur Wizard yang Bersih**

#### Step 0: Pemilihan Mode (Biodata)

- **Tampilan Awal**: Card selection yang dapat diklik
  - **Gunakan Data yang Ada**: Pilih dari pengguna yang sudah terdaftar
  - **Input Data Baru**: Buat pengguna baru
- Tidak bisa lanjut ke step berikutnya tanpa memilih mode
- Mode edit langsung menampilkan form biodata

#### Step 1: Form Biodata

Setelah memilih mode, tampilkan form biodata dengan:

**Validasi Wajib (Required)**:

- ✅ Nama Lengkap
- ✅ NIK
- ✅ Email
- ✅ Level / Role

Jika ada field yang kosong, sistem akan menampilkan **alert** dan mencegah user melanjutkan.

**Field Opsional**:

- Gelar Depan/Belakang
- No. Telepon
- NIP
- No. Karpeg
- Status Akun
- Tempat/Tanggal Lahir
- Alamat
- Provinsi/Kabupaten
- Upload Foto

#### Steps 2-7: Repeater Steps (Opsional)

Setiap step bersifat **repeater** dengan karakteristik:

| Step | Nama       | Repeater | Wajib | Mekanisme Switch     |
| ---- | ---------- | -------- | ----- | -------------------- |
| 2    | Unit Kerja | ✅       | ❌    | Hanya 1 Status Aktif |
| 3    | Jabatan    | ✅       | ❌    | Hanya 1 Status Aktif |
| 4    | Pangkat    | ✅       | ❌    | Hanya 1 Status Aktif |
| 5    | Pendidikan | ✅       | ❌    | Hanya 1 Status Aktif |
| 6    | Pelatihan  | ✅       | ❌    | Hanya 1 Status Aktif |
| 7    | Prestasi   | ✅       | ❌    | Hanya 1 Status Aktif |

**Fitur Repeater**:

- ➕ Dapat menambah lebih dari satu riwayat
- ⏭️ Dapat dilewati (skip) karena tidak wajib diisi
- 🔄 Switch mechanism: Hanya satu data yang boleh berstatus "Aktif" pada satu waktu
- 🔗 Semua menggunakan `idpengguna` dari Step 1

### 2. **Centralized Data Management**

```javascript
const stepData = reactive({
  biodata: {
    mode: "", // "" | "existing" | "new"
    userId: null, // ID pengguna yang dipilih (mode existing)
    userData: {}, // Data form biodata
    photoFile: null, // File foto baru
    isPhotoRemoved: false,
  },
  unitKerja: { list: [] },
  jabatan: { list: [] },
  pangkat: { list: [] },
  pendidikan: { list: [] },
  pelatihan: { list: [] },
  prestasi: { list: [] },
});
```

**Keuntungan**:

- Single source of truth untuk semua data wizard
- Mudah di-track dan di-debug
- Konsisten di semua steps

### 3. **ID Pengguna Management**

```javascript
const currentUserId = computed(() => {
  // Priority 1: Edit mode
  if (isEditMode.value && props.fieldToEdit) {
    return props.fieldToEdit.idpengguna;
  }
  // Priority 2: User dipilih dari existing
  if (stepData.biodata.userId) {
    return stepData.biodata.userId;
  }
  // Priority 3: User baru yang sudah dibuat
  if (createdUserId.value) {
    return createdUserId.value;
  }
  return null;
});
```

**Tracking ID Pengguna**:

1. **Edit Mode**: Ambil dari `props.fieldToEdit.idpengguna`
2. **Existing User**: Ambil dari `stepData.biodata.userId`
3. **New User**: Ambil dari `createdUserId` (setelah create di Step 1)

Computed property `currentUserId` otomatis di-pass ke Steps 2-7.

### 4. **Data Submission Flow**

#### A. Submit Step 1 (Biodata)

**Case 1: Create New User**

```javascript
if (mode === "new" && !createdUserId) {
  const userData = new FormData();
  // ... append fields
  const res = await addUser(userData);
  userId = res.data.idpengguna;
  createdUserId.value = userId; // Save untuk steps berikutnya
}
```

**Case 2: Update Existing User**

```javascript
if (isEditMode || mode === "existing") {
  const userData = new FormData();
  // ... append fields
  userData.append("_method", "PUT");
  await updateUser(userId, userData);
}
```

**Case 3: Using Existing User (tanpa perubahan)**

```javascript
if (mode === "existing" && userId) {
  // Langsung pakai userId yang ada
}
```

#### B. Submit Steps 2-7 (Repeater)

```javascript
const createFormData = (item, fileKey) => {
  const fd = new FormData();
  fd.append("record[idpengguna]", userId); // ← ID dari Step 1

  // Append semua field
  Object.keys(item).forEach((key) => {
    if (!isInternalKey(key)) {
      fd.append(`record[${key}]`, item[key]);
    }
  });

  // Append file jika ada
  if (item[fileKey] instanceof File) {
    fd.append(fileKey, item[fileKey]);
  }

  return fd;
};

// Submit semua data secara parallel
const promises = [];

stepData.unitKerja.list.forEach((item) => {
  if (item.idunitkerja && item.tglmulai) {
    promises.push(addUserWorkUnit(createFormData(item, "filesk")));
  }
});

// ... step 3-7 similar

await Promise.all(promises); // Execute all
```

**Karakteristik Submission**:

- ✅ Hanya submit item yang memiliki field required
- ✅ Menggunakan `idpengguna` dari Step 1
- ✅ Parallel execution dengan `Promise.all()`
- ✅ Auto-skip jika list kosong (tidak wajib)

## 🔐 Validation Logic

### Step 0 (Biodata) - REQUIRED

```javascript
async function validateStep(stepIndex) {
  if (stepIndex === 0) {
    // 1. Validate form fields via component
    const isValid = await step1Ref.value.validate();

    if (!isValid) return false;

    // 2. Check mode selected
    if (!biodataData.mode) {
      toast.warning("Silakan pilih mode terlebih dahulu");
      return false;
    }

    // 3. Check user selected (for existing mode)
    if (mode === "existing" && !biodataData.userId) {
      toast.warning("Silakan pilih pengguna");
      return false;
    }

    // 4. Check required fields
    const requiredFields = {
      nama: "Nama",
      nik: "NIK",
      email: "Email",
      idlevel: "Level/Role",
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!userData[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      toast.error(`Field wajib: ${missingFields.join(", ")}`);
      return false;
    }
  }
}
```

### Steps 1-6 (Repeater) - OPTIONAL

Steps 2-7 menggunakan validation dari masing-masing component:

```javascript
if (stepIndex === 1 && step2Ref.value) {
  isValid = await step2Ref.value.validate();
}
```

**Validation di Component**:

```javascript
function validate() {
  // Empty list = valid (optional step)
  if (list.length === 0) return true;

  // Validate each item's required fields
  list.forEach((item, index) => {
    if (!item.requiredField) {
      formErrors[index].requiredField = "Wajib diisi";
      isValid = false;
    }
  });

  return isValid;
}
```

## 🔄 Lazy Loading Data

Data untuk steps 2-7 di-load secara **lazy** saat user berpindah tab:

```javascript
function onChangeCurrentTab(prevIndex, nextIndex) {
  const userId = currentUserId.value;

  if (userId) {
    nextTick(() => {
      if (nextIndex === 1 && step2Ref.value?.loadData) {
        step2Ref.value.loadData(userId);
      }
      // ... step 3-7 similar
    });
  }
}
```

**Keuntungan**:

- ⚡ Performa lebih baik (tidak load semua data di awal)
- 🎯 Load hanya saat diperlukan
- 🔄 Support edit mode (load existing data)

## 🎨 Switch Mechanism (Only One Active)

Setiap repeater step memiliki alert info:

```html
<div class="alert alert-info">
  <i class="fa fa-info-circle"></i>
  <strong>Catatan:</strong> Hanya satu data yang boleh memiliki status
  <span class="badge bg-success">Aktif</span>. Ketika Anda mengaktifkan satu
  data, data lainnya akan otomatis menjadi "Tidak Aktif".
</div>
```

**Implementasi di Component**:

```javascript
function handleStatusChange(index, isChecked) {
  const newStatus = isChecked ? "Aktif" : "Tidak Aktif";
  list[index].status = newStatus;

  // Auto-deactivate others when one is activated
  if (newStatus === "Aktif") {
    list.forEach((item, i) => {
      if (i !== index) {
        item.status = "Tidak Aktif";
      }
    });
  }
}
```

## 📁 File Structure

```
employment/
├── EmploymentFormModal.vue   # Main wizard controller (REBUILT)
└── steps/
    ├── Step1Biodata.vue       # Biodata form (UPDATED)
    ├── Step2UnitKerja.vue     # Unit Kerja repeater
    ├── Step3Jabatan.vue       # Jabatan repeater
    ├── Step4Pangkat.vue       # Pangkat repeater
    ├── Step5Pendidikan.vue    # Pendidikan repeater
    ├── Step6Pelatihan.vue     # Pelatihan repeater
    └── Step7Prestasi.vue      # Prestasi repeater
```

## ✨ Best Practices Applied

1. ✅ **Single Source of Truth**: Centralized `stepData`
2. ✅ **Reactive Data Flow**: v-model binding untuk semua steps
3. ✅ **Validation at Each Step**: Mencegah user lanjut jika ada error
4. ✅ **Lazy Loading**: Load data hanya saat dibutuhkan
5. ✅ **Error Handling**: Try-catch dengan pesan error yang jelas
6. ✅ **User Feedback**: Toast notifications untuk setiap aksi
7. ✅ **Clean Code**: Komentar dan struktur yang jelas
8. ✅ **Maintainability**: Mudah ditambah/ubah step baru

## 🚀 Testing Flow

### Scenario 1: Create New User + Add History

1. Open modal → Klik "Input Data Baru"
2. Isi biodata (nama, nik, email, level wajib) → Next
3. (Optional) Tambah Unit Kerja → Next
4. (Optional) Tambah Jabatan → Next
5. ... dst sampai Step 7
6. Klik "Selesai" → Submit semua data

### Scenario 2: Use Existing User + Add History

1. Open modal → Klik "Gunakan Data yang Ada"
2. Pilih user dari tabel → Data auto-populate → Next
3. (Optional) Tambah/Edit Unit Kerja → Next
4. ... dst

### Scenario 3: Edit Existing Employee

1. Open modal dengan `fieldToEdit` → Langsung tampil form
2. Edit biodata → Next
3. Edit/tambah riwayat → Next
4. ... dst

## 📝 Notes

- **idpengguna** selalu tersedia di Steps 2-7 via `currentUserId` computed property
- Semua repeater steps **OPTIONAL** - bisa di-skip tanpa error
- **Switch mechanism** memastikan hanya 1 data aktif per step
- Data submission menggunakan **Promise.all()** untuk parallel execution
- **FormData** digunakan untuk handle file uploads dengan benar

---

**Last Updated**: 2025-11-28  
**Status**: ✅ Complete Rebuild
