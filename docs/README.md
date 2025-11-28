# 📚 Employment Form Wizard - Documentation Index

Selamat datang di dokumentasi komprehensif untuk **Employment Form Wizard**. Dokumentasi ini mencakup arsitektur, implementasi, dan best practices untuk wizard 7-step yang mengelola data kepegawaian.

---

## 🎯 Kesimpulan Singkat

**Mekanisme Pengiriman Data yang Digunakan:**

# ✅ CENTRALIZED SUBMISSION (Terpusat dalam Satu Proses Lengkap)

Semua data dari 7 step dikumpulkan dalam satu `wizardState` dan dikirim dalam satu proses submission yang terkoordinasi pada saat user menekan tombol "Selesai" di step terakhir.

**Mengapa?** Karena memberikan:

- 🔒 **Data Integrity**: Semua data tersimpan dalam 1 transaksi atomik
- 👤 **Better UX**: User bebas navigasi tanpa khawatir data hilang
- ✅ **Validation**: Dapat enforce "single active status" rule
- ⚡ **Performance**: 1x batch API call > 7x sequential calls
- 🐛 **Easier Debugging**: State terpusat mudah di-monitor

---

## 📖 Dokumen yang Tersedia

### 1. 📐 [EMPLOYMENT_WIZARD_DIAGRAMS.md](./EMPLOYMENT_WIZARD_DIAGRAMS.md)

**Visual Diagrams & Flow Charts**

Diagram visual menggunakan ASCII art untuk memahami:

- System Architecture Diagram
- Data Flow Diagram
- Step 1 (Biodata) Flow
- Repeater Steps Flow (Steps 2-7)
- Validation Flow
- Single Active Status Logic
- Submission Sequence Diagram
- Component Hierarchy
- State Management Pattern
- Security & Validation Layers

**Cocok untuk:** Visual learners, onboarding developer baru

---

### 2. 📋 [EMPLOYMENT_WIZARD_QUICK_REF.md](./EMPLOYMENT_WIZARD_QUICK_REF.md)

**Quick Reference Guide**

Ringkasan singkat untuk referensi cepat:

- ✅ Rekomendasi: Centralized Submission
- 🔄 Alur Wizard (7 Steps)
- 💾 Mekanisme Pengiriman Data
- 🗂️ Struktur State
- ✅ Checklist Implementasi
- 🔒 Business Rules
- 🚨 Error Handling
- 💡 Tips & Best Practices

**Cocok untuk:** Developer yang sudah familiar, quick lookup

---

### 3. 🏗️ [EMPLOYMENT_FORM_WIZARD_ARCHITECTURE.md](./EMPLOYMENT_FORM_WIZARD_ARCHITECTURE.md)

**Comprehensive Architecture Documentation**

Dokumentasi lengkap mencakup:

- Centralized State Management
- Struktur Data (7 steps dengan field detail)
- Alur Wizard per Step
- Mekanisme Pengiriman Data (detail implementasi)
- Component Architecture
- Validasi Rules
- Best Practices
- Performance Optimization
- Testing Guidelines
- API Integration
- Maintenance Notes

**Cocok untuk:** In-depth understanding, future maintenance

---

### 4. 📊 [CENTRALIZED_VS_PERSTEP_COMPARISON.md](./CENTRALIZED_VS_PERSTEP_COMPARISON.md)

**Detailed Comparison: Centralized vs Per-Step**

Analisis mendalam membandingkan dua pendekatan:

1. Data Integrity & Consistency
2. User Experience
3. Validation
4. Error Handling & Rollback
5. Performance
6. Code Complexity & Maintainability
7. Debugging & Monitoring

**Dengan:**

- Code examples untuk kedua approach
- Scoring matrix (1-10 per kriteria)
- Decision matrix (kapan pakai yang mana)
- Final recommendation dengan reasoning

**Cocok untuk:** Architectural decisions, stakeholder discussions

---

## 🚀 Quick Start

### Untuk Developer Baru:

1. **Mulai dengan Visual** 📐  
   Baca [EMPLOYMENT_WIZARD_DIAGRAMS.md](./EMPLOYMENT_WIZARD_DIAGRAMS.md) untuk memahami flow secara visual

2. **Pahami Keputusan Arsitektur** 📊  
   Baca [CENTRALIZED_VS_PERSTEP_COMPARISON.md](./CENTRALIZED_VS_PERSTEP_COMPARISON.md) untuk tahu "mengapa" kita pakai centralized

3. **Implementasi Detail** 🏗️  
   Baca [EMPLOYMENT_FORM_WIZARD_ARCHITECTURE.md](./EMPLOYMENT_FORM_WIZARD_ARCHITECTURE.md) untuk detail implementasi

4. **Pakai sebagai Referensi** 📋  
   Bookmark [EMPLOYMENT_WIZARD_QUICK_REF.md](./EMPLOYMENT_WIZARD_QUICK_REF.md) untuk lookup cepat saat coding

---

## 🎨 Fitur Utama Wizard

### Step 1: Biodata (Required)

- ✅ **Card Selection**: Pilih antara "Data Existing" atau "Data Baru"
- 🔍 **User Table**: Table searchable untuk pilih pengguna existing
- ⏳ **Loading State**: Field disabled dengan "memuat..." saat data loading
- 🔔 **Alert Validation**: Muncul alert jika field wajib (Nama, NIK, Email, Level) belum diisi

### Steps 2-7: Repeaters

- ➕ **Add/Remove Items**: Dapat menambah/menghapus multiple records
- 🔒 **Single Active Status**: Hanya 1 record boleh status "Aktif" per kategori
- 📁 **File Upload**: SK untuk Unit Kerja/Jabatan/Pangkat, Sertifikat untuk Pelatihan/Prestasi
- 🔄 **Smart Toggle**: Auto non-aktifkan items lain saat satu item diaktifkan

---

## 🗂️ Struktur Folder

```
WebProduktivitas-main/
├── docs/
│   ├── README.md (this file)
│   ├── EMPLOYMENT_WIZARD_DIAGRAMS.md
│   ├── EMPLOYMENT_WIZARD_QUICK_REF.md
│   ├── EMPLOYMENT_FORM_WIZARD_ARCHITECTURE.md
│   └── CENTRALIZED_VS_PERSTEP_COMPARISON.md
│
├── src/pages/employment/
│   ├── EmploymentFormModal.vue (Parent - Centralized State)
│   └── steps/
│       ├── Step1Biodata.vue
│       ├── Step2UnitKerja.vue
│       ├── Step3Jabatan.vue
│       ├── Step4Pangkat.vue
│       ├── Step5Pendidikan.vue
│       ├── Step6Pelatihan.vue
│       └── Step7Prestasi.vue
│
└── src/services/
    ├── referensi/
    │   └── users.js
    └── general/personnel/
        ├── userWorkUnits.js
        ├── userPositions.js
        ├── userRanks.js
        ├── userEducation.js
        ├── userTrainings.js
        └── userAchievments.js
```

---

## 🔑 Konsep Kunci

### Centralized State

```javascript
const wizardState = reactive({
  biodata: { mode, userId, userData, photoFile },
  unitKerja: { data: [], files: {} },
  jabatan: { data: [], files: {} },
  pangkat: { data: [], files: {} },
  pendidikan: { data: [] },
  pelatihan: { data: [], files: {} },
  prestasi: { data: [], files: {} },
});
```

**Single source of truth** untuk semua data wizard.

### v-model Binding

```vue
<Step1Biodata v-model="wizardState.biodata" />
<Step2UnitKerja v-model="wizardState.unitKerja" />
```

Two-way binding antara parent dan child components.

### Consolidated Submission

```javascript
async function submitForm() {
  // 1. Validate all
  validateSingleActiveStatus();

  // 2. Save biodata → get userId
  const userId = await saveBiodata();

  // 3. Save all related data
  await saveUnitKerja(userId);
  await saveJabatan(userId);
  // ... steps 4-7

  // 4. Success
  toast.success("Semua data berhasil disimpan");
}
```

**Satu kali submission** untuk semua data.

### Single Active Status Rule

```javascript
// Only ONE item can be "Aktif" per category
function toggleStatus(index) {
  data.forEach((item, i) => {
    item.status = i === index ? "Aktif" : "Tidak Aktif";
  });
}
```

Business rule enforcement di client-side.

---

## 🔒 Business Rules

### 1. Required Fields (Step 1)

- ✅ Nama
- ✅ NIK
- ✅ Email (valid format)
- ✅ Level/Role

### 2. Single Active Status (Steps 2-7)

Setiap kategori hanya boleh memiliki **SATU** data dengan status "Aktif":

- Unit Kerja: max 1 aktif
- Jabatan: max 1 aktif
- Pangkat: max 1 aktif
- Pelatihan: max 1 aktif
- Prestasi: max 1 aktif

### 3. idpengguna Consistency

Semua data di Steps 2-7 **HARUS** menggunakan `idpengguna` dari Step 1.

---

## ✅ Validasi Layers

1. **Field-level**: `@blur` validation per field
2. **Form-level**: Yup schema validation
3. **Wizard-level**: Cross-step business rules
4. **Server-side**: Backend re-validation (backup)

---

## 🚨 Error Handling Strategy

```javascript
try {
  await submitForm();
  // Success handling
} catch (error) {
  console.error("Error:", error);

  // User-friendly message
  const message =
    error.response?.data?.message || error.message || "Terjadi kesalahan";

  toast.error(message);

  // Stay in wizard untuk koreksi
}
```

**Prinsip:**

- ✅ Validate sebelum submit
- ✅ Show user-friendly errors
- ✅ Log detail errors untuk debugging
- ✅ Stay in wizard jika ada error (jangan auto-close)

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

## 🎓 Learning Path

### Level 1: Beginner

1. Baca [Quick Reference](./EMPLOYMENT_WIZARD_QUICK_REF.md)
2. Lihat [Visual Diagrams](./EMPLOYMENT_WIZARD_DIAGRAMS.md)
3. Pahami flow Step 1 (Biodata)
4. Coba implement wizard sederhana

### Level 2: Intermediate

1. Baca [Architecture Documentation](./EMPLOYMENT_FORM_WIZARD_ARCHITECTURE.md)
2. Pahami centralized state management
3. Implement repeater steps (Steps 2-7)
4. Handle validation & error

### Level 3: Advanced

1. Baca [Comparison Document](./CENTRALIZED_VS_PERSTEP_COMPARISON.md)
2. Understand architectural decisions
3. Optimize performance
4. Write tests

---

## 💡 Best Practices Highlights

### DO ✅

- ✅ Use centralized state management
- ✅ Validate before submit
- ✅ Show loading states
- ✅ Compress images before upload
- ✅ Handle errors gracefully

### DON'T ❌

- ❌ Submit data per-step
- ❌ Mutate state directly
- ❌ Skip validation
- ❌ Ignore server errors
- ❌ Close modal saat masih ada error

---

## 🔄 Update History

| Version | Date       | Changes                       |
| ------- | ---------- | ----------------------------- |
| 1.0.0   | 2025-11-28 | Initial documentation release |

---

## 🤝 Contributing

Jika ada yang perlu diperbaiki atau ditambahkan di dokumentasi ini:

1. Update file dokumentasi yang relevan
2. Update version di section "Update History"
3. Ensure contoh code masih sesuai dengan implementasi aktual
4. Test semua link cross-reference

---

## 📞 Support

Untuk pertanyaan atau diskusi:

- Lihat dokumentasi terkait di folder ini
- Check code comments di file implementasi
- Konsultasi dengan technical lead

---

## 🎯 Kesimpulan

**Employment Form Wizard** menggunakan **Centralized Submission** approach untuk memastikan:

- Data integrity
- Optimal user experience
- Clean & maintainable code
- Easy debugging & testing

Semua dokumentasi di folder ini dirancang untuk mendukung development, maintenance, dan onboarding yang efektif.

**Happy Coding! 🚀**

---

**Documentation Set Version**: 1.0.0  
**Last Updated**: 2025-11-28  
**Maintained By**: Development Team
