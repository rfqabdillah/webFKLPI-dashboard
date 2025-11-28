# 🚀 Employment Form Wizard - Quick Reference

## 📋 TL;DR

**Rekomendasi:** **CENTRALIZED SUBMISSION** ✅

**Alasan Singkat:**

- ✅ Data integrity terjaga (all-or-nothing)
- ✅ State management lebih sederhana
- ✅ UX lebih baik (user bisa navigasi bebas)
- ✅ Lebih sedikit API calls
- ✅ Rollback lebih mudah

---

## 🏗️ Arsitektur Overview

```
EmploymentFormModal.vue (Parent)
    │
    ├─ wizardState (global state)
    │   ├─ biodata: { userData, photoFile, ... }
    │   ├─ unitKerja: { data: [...], files: {} }
    │   ├─ jabatan: { data: [...], files: {} }
    │   ├─ pangkat: { data: [...], files: {} }
    │   ├─ pendidikan: { data: [...] }
    │   ├─ pelatihan: { data: [...], files: {} }
    │   └─ prestasi: { data: [...], files: {} }
    │
    ├─ Step 1-7 (Children)
    │   └─ Update wizardState via v-model
    │
    └─ submitForm() - Final submission
        ├─ 1. Save Biodata → Get userId
        └─ 2. Save Step 2-7 with userId
```

---

## 📝 Struktur Data (Yang Harus Dipertahankan)

### Step 1: Biodata

```javascript
{
  idpengguna,
    idlevel,
    email,
    nama,
    telp,
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
    created_at,
    updated_at,
    deleted_at,
    email_verified_at,
    remember_token,
    lastlogin;
}
```

### Step 2: Unit Kerja

```javascript
{
  idpenggunaunitkerja,
    idpengguna,
    idunitkerja,
    tglmulai,
    tglselesai,
    filesk,
    status,
    created_at,
    updated_at,
    deleted_at;
}
```

### Step 3: Jabatan

```javascript
{
  idepnggunajenjang,
    idpengguna,
    idjenjang,
    tglmulai,
    tglselesai,
    filesk,
    status,
    created_at,
    updated_at,
    deleted_at;
}
```

### Step 4: Pangkat

```javascript
{
  idpenggunapangkat,
    idpengguna,
    idpangkat,
    tglmulai,
    tglselesai,
    filesk,
    status,
    created_at,
    updated_at,
    deleted_at;
}
```

### Step 5: Pendidikan

```javascript
{
  idpenggunapendidikan,
    idpengguna,
    idjenjangpendidikan,
    programstudi,
    namaperguruantinggi,
    tahunlulus,
    created_at,
    updated_at,
    deleted_at;
}
```

### Step 6: Pelatihan

```javascript
{
  idpenggunalatihan,
    idpengguna,
    namapelatihan,
    namapenyelenggara,
    filesertifikat,
    tglmulai,
    tglselesai,
    status,
    created_at,
    updated_at,
    deleted_at;
}
```

### Step 7: Prestasi

```javascript
{
  idpenggunaprestasi,
    idpengguna,
    idskala,
    namaprestasi,
    namapenyelenggara,
    filesertifikat,
    status,
    created_at,
    updated_at,
    deleted_at;
}
```

---

## ✅ Checklist Fitur

### Step 1: Biodata (REQUIRED)

- [x] Card selection (Existing/New)
- [x] User table dengan search
- [x] Form edit/empty
- [x] Validasi: nama, nik, email, idlevel
- [x] Alert jika field kosong
- [x] Upload foto dengan compress

### Step 2-7: Repeaters (OPTIONAL)

- [x] Multiple records
- [x] Single active status
- [x] Switch auto-enforce
- [x] Uses idpengguna dari Step 1

### Global

- [x] Centralized state
- [x] Lazy loading Step 2-7
- [x] Navigation dengan validasi
- [x] Final consolidated submission

---

## 🔧 Code Snippets

### Parent Component Setup

```javascript
const wizardState = reactive({
  biodata: { mode: "", userId: null, userData: {} },
  unitKerja: { data: [], files: {} },
  // ... other steps
});

async function submitForm() {
  let userId = await saveBiodata();
  await saveUnitKerja(userId);
  await saveJabatan(userId);
  // ... save other steps
}
```

### Child Component (Repeater)

```javascript
const itemList = ref([]);

watch(
  [itemList],
  () => {
    emit("update:modelValue", {
      data: itemList.value,
    });
  },
  { deep: true }
);

function handleStatusChange(index, isChecked) {
  if (isChecked) {
    itemList.value.forEach((item, i) => {
      item.status = i === index ? "Aktif" : "Tidak Aktif";
    });
  }
}
```

### FormData Creation

```javascript
const formData = new FormData();
formData.append("record[idpengguna]", userId);
formData.append("record[field]", value);

if (fileObject) {
  formData.append("upload_file", fileObject, fileObject.name);
}
```

---

## 🎯 Validasi Rules

### Step 1

- Must select mode (Existing/New)
- If Existing: must select user
- Required: nama, nik, email, idlevel
- Email must be valid format

### Step 2-7

- Optional (return true if empty)
- If has data: validate required fields
- Single active status enforced automatically

---

## 🔐 Single Active Status

```javascript
// ✅ CORRECT: Force single active
function handleStatusChange(index, isChecked) {
  if (isChecked) {
    itemList.value.forEach((item, i) => {
      item.status = i === index ? "Aktif" : "Tidak Aktif";
    });
  }
}

// ❌ WRONG: Allow multiple active
function handleStatusChange(index, isChecked) {
  itemList.value[index].status = isChecked ? "Aktif" : "Tidak Aktif";
}
```

---

## 📡 API Services

```javascript
// Biodata
import { addUser, updateUser } from "@/services/referensi/users";

// Step 2
import {
  addUserWorkUnit,
  updateUserWorkUnit,
} from "@/services/general/personnel/userWorkUnits";

// Step 3
import {
  addUserPosition,
  updateUserPosition,
} from "@/services/general/personnel/userPositions";

// Step 4
import {
  addUserRank,
  updateUserRank,
} from "@/services/general/personnel/userRanks";

// Step 5
import {
  addUserEducation,
  updateUserEducation,
} from "@/services/general/personnel/userEducation";

// Step 6
import {
  addUserTraining,
  updateUserTraining,
} from "@/services/general/personnel/userTrainings";

// Step 7
import {
  addUserAchievement,
  updateUserAchievement,
} from "@/services/general/personnel/userAchievments";
```

---

## 🐛 Common Issues & Quick Fixes

| Issue                         | Quick Fix                                             |
| ----------------------------- | ----------------------------------------------------- |
| userId not passed to Step 2-7 | Check `currentUserId` computed & emit `user-selected` |
| Multiple active status        | Implement force single active in `handleStatusChange` |
| File not uploaded             | Store file in `_fileField` property                   |
| Data not persist              | Ensure watch emits `update:modelValue`                |
| Step loads multiple times     | Add `isDataLoaded` guard clause                       |

---

## 📊 Comparison Chart

| Feature        | Centralized | Per-Step   |
| -------------- | ----------- | ---------- |
| Data Integrity | ⭐⭐⭐⭐⭐  | ⭐⭐⭐     |
| UX             | ⭐⭐⭐⭐⭐  | ⭐⭐⭐     |
| State Mgmt     | ⭐⭐⭐⭐⭐  | ⭐⭐       |
| Rollback       | ⭐⭐⭐⭐⭐  | ⭐⭐       |
| Performance    | ⭐⭐⭐⭐⭐  | ⭐⭐⭐     |
| API Calls      | 1 submit    | 7+ submits |

**Winner:** Centralized ✅

---

## 🚀 Quick Start

1. **Review** `EmploymentFormModal.vue`
2. **Read** `.agent/EMPLOYMENT_WIZARD_ARCHITECTURE.md`
3. **Follow** `.agent/STEP_IMPLEMENTATION_GUIDE.md`
4. **Test** all scenarios:
   - New user creation
   - Existing user selection
   - Edit mode
   - Add/remove items in Step 2-7
   - Single active status enforcement
   - Final submission

---

## 📚 Full Documentation

- **Architecture:** `.agent/EMPLOYMENT_WIZARD_ARCHITECTURE.md`
- **Implementation:** `.agent/STEP_IMPLEMENTATION_GUIDE.md`
- **Summary:** `.agent/EMPLOYMENT_WIZARD_SUMMARY.md`
- **This File:** `.agent/QUICK_REFERENCE.md`

---

**Last Updated:** 2025-11-28  
**Status:** ✅ Ready for Implementation
