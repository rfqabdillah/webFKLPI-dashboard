# Step1Biodata Refactoring Documentation

## Overview

Step1Biodata.vue telah di-refactor dari 1000+ lines menjadi struktur modular dengan 4 files terpisah untuk meningkatkan maintainability dan readability.

## File Structure

```
src/pages/employment/steps/
├── Step1Biodata.vue                    (~200 lines) - Main orchestrator
└── components/
    ├── ModeSelectionCards.vue          (~80 lines)  - Card pilihan mode
    ├── UserSelectionTable.vue          (~150 lines) - Tabel user selection
    └── BiodataFormFields.vue           (~450 lines) - Form fields + validation
```

## Component Responsibilities

### 1. Step1Biodata.vue (Main Orchestrator)

**Tugas:**

- Koordinasi antara child components
- Manage state (mode, selection, loading)
- Handle user selection flow
- Emit events ke parent (EmploymentFormModal)
- Expose `validate()` method

**Props:**

- `modelValue`: Object - Data from parent
- `fieldToEdit`: Object - User data for edit mode

**Emits:**

- `update:modelValue`: Update parent dengan data baru
- `validation-change`: Notification status validasi
- `user-selected`: User dipilih dari tabel
- `user-data-loaded`: Data user selesai dimuat

**Key Methods:**

- `selectMode(mode)`: Set mode ('new' atau 'existing')
- `selectUser(user)`: Handle user selection
- `populateFormData(data)`: Fill form dengan data user
- `validate()`: Validasi keseluruhan step

---

### 2. ModeSelectionCards.vue

**Tugas:**

- Tampilkan 2 cards: "Gunakan Data yang Ada" dan "Input Data Baru"
- Handle hover effects
- Emit pilihan user

**Emits:**

- `select-mode`: Mode yang dipilih ('existing' atau 'new')

**Features:**

- Interactive hover animations
- Gradient icon backgrounds
- Responsive card layout

---

### 3. UserSelectionTable.vue

**Tugas:**

- Fetch list users dari API
- Display tabel users dengan search
- Handle user selection

**Props:**

- `show`: Boolean - Trigger fetch saat ditampilkan

**Emits:**

- `back`: Kembali ke mode selection
- `select-user`: User yang dipilih

**Features:**

- Real-time client-side search (nama, NIP, NIK, email)
- Photo preview dengan fallback ke initial
- Loading & empty states
- Auto-fetch saat component ditampilkan

**API Calls:**

- `getUsers()` dari `@/services/referensi/users`

---

### 4. BiodataFormFields.vue

**Tugas:**

- Display semua form input fields
- Handle validation per field dan keseluruhan
- Fetch & manage dropdowns (Roles, Provinces, Kabupatens)
- Handle photo upload

**Props:**

- `modelValue`: Object - Form data
- `mode`: String - 'new' atau 'existing'
- `isEditMode`: Boolean - Edit mode flag
- `isLoading`: Boolean - Loading state

**Emits:**

- `update:modelValue`: Update form data
- `back`: Kembali ke selection
- `photo-change`: File foto berubah

**Features:**

- Form inputs lengkap (23 fields)
- Yup validation schema
- Province/Kabupaten dependent dropdowns
- Photo upload dengan compress
- Photo preview dengan remove button

**API Calls:**

- `getRoles()` dari `@/services/referensi/roles`
- `getRegions()` dari `@/services/referensi/regions`
- `compressImage()` dari `@/utils/imageCompressor`

**Exposed Methods:**

- `validate()`: Validasi semua fields

---

## Data Flow

### New User Flow:

```
1. User klik "Input Data Baru"
   ↓
2. ModeSelectionCards emits 'select-mode' → 'new'
   ↓
3. Step1Biodata sets mode='new', selectionMade=true
   ↓
4. BiodataFormFields ditampilkan dengan form kosong
   ↓
5. User isi form
   ↓
6. BiodataFormFields emits update formData
   ↓
7. Step1Biodata emits ke EmploymentFormModal
```

### Existing User Flow:

```
1. User klik "Gunakan Data yang Ada"
   ↓
2. ModeSelectionCards emits 'select-mode' → 'existing'
   ↓
3. Step1Biodata sets mode='existing'
   ↓
4. UserSelectionTable ditampilkan & fetch users
   ↓
5. User search & pilih user dari tabel
   ↓
6. UserSelectionTable emits 'select-user' → user object
   ↓
7. Step1Biodata calls populateFormData(user)
   ↓
8. BiodataFormFields ditampilkan dengan data ter-populate
   ↓
9. User confirm/edit data
   ↓
10. Step1Biodata emits ke EmploymentFormModal
```

---

## Validation

### Validasi dilakukan di 2 level:

**1. Field-level (BiodataFormFields)**

- Trigger: `@blur` event pada input
- Method: `validateField(fieldName)`
- Display: Error message langsung di bawah field

**2. Form-level (Step1Biodata)**

- Trigger: Click "Selanjutnya" button
- Method: `validate()`
- Checks:
  - Mode sudah dipilih?
  - Jika existing, user sudah dipilih?
  - All required fields valid?

**Required Fields:**

- Nama Lengkap \*
- NIK \*
- Email \*
- Level / Role \*

---

## Benefits of Refactoring

### Before:

- ❌ 1000+ lines dalam 1 file
- ❌ Sulit debug
- ❌ Sulit maintain
- ❌ Code duplication

### After:

- ✅ 4 files, masing-masing focus pada 1 responsibility
- ✅ Easy to debug (isolate komponen yang error)
- ✅ Easy to maintain (edit 1 component tidak affect yang lain)
- ✅ Reusable components
- ✅ Better testability
- ✅ Clearer code organization

---

## Future Enhancements

### Possible Improvements:

1. **Pagination** di UserSelectionTable (saat ini load all)
2. **Server-side search** untuk performa lebih baik
3. **Caching** data roles & regions
4. **Form auto-save** draft
5. **Photo crop** sebelum upload
6. **Keyboard navigation** di tabel user selection

---

## Troubleshooting

### Component tidak muncul?

- Check di console: ada error import?
- Verify file path: `./components/...`
- Check props yang dikirim dari parent

### Data tidak populate?

- Check console log di `populateFormData()`
- Verify struktur data dari API match dengan formData structure
- Check if watcher triggered dengan `watch` di Vue DevTools

### Validation tidak jalan?

- Check if `formRef` sudah ter-assign
- Verify `validate()` method di-expose dari BiodataFormFields
- Check Yup schema sesuai dengan field names

---

## Migration Notes

Jika ada custom modifications di Step1Biodata.vue lama yang perlu dipindahkan:

1. **Custom fields** → Tambahkan di BiodataFormFields.vue
2. **Custom validation** → Update Yup schema di BiodataFormFields.vue
3. **Custom API calls** → Tambahkan di component yang sesuai
4. **Custom events** → Tambahkan emit di child & propagate di parent

---

Generated: 2025-11-29
Version: 1.0
