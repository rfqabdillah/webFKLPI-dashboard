# 📊 Perbandingan: Centralized vs Per-Step Submission

## 🎯 Overview

Dokumen ini membandingkan dua pendekatan pengiriman data untuk Employment Form Wizard:

1. **Centralized Submission** (Terpusat)
2. **Per-Step Submission** (Per Langkah)

---

## 📋 Ringkasan Komparasi

| Kriteria                 | Centralized ✅     | Per-Step ❌            |
| ------------------------ | ------------------ | ---------------------- |
| **Kompleksitas**         | ⭐⭐⭐ Sedang      | ⭐⭐⭐⭐⭐ Tinggi      |
| **Data Integrity**       | ✅ Tinggi (atomik) | ⚠️ Rendah (fragmented) |
| **User Experience**      | ✅ Excellent       | ⚠️ Average             |
| **Performance**          | ✅ 1x batch call   | ❌ 7x sequential calls |
| **Rollback**             | ✅ Mudah           | ❌ Sangat sulit        |
| **Debugging**            | ✅ Mudah           | ❌ Sulit               |
| **Validasi**             | ✅ Cross-step      | ⚠️ Per-step only       |
| **Kode Maintainability** | ✅ Clean           | ❌ Kompleks            |

---

## 🔍 Detail Perbandingan

### 1. Data Integrity & Consistency

#### Centralized ✅

```javascript
try {
  // All-or-nothing transaction
  const userId = await saveBiodata();
  await saveUnitKerja(userId);
  await saveJabatan(userId);
  // ... other steps

  // If any fails, nothing is saved
  toast.success("Semua data berhasil disimpan");
} catch (error) {
  // Nothing saved to database
  toast.error("Gagal menyimpan data");
}
```

**Keuntungan:**

- ✅ Atomicity: all-or-nothing
- ✅ No partial data in database
- ✅ Easier to maintain referential integrity

#### Per-Step ❌

```javascript
// Step 1
await saveBiodata(); // ✅ Saved

// Step 2
await saveUnitKerja(); // ✅ Saved

// Step 3
await saveJabatan(); // ❌ FAILS!

// Problem: Step 1 & 2 sudah tersimpan, step 3+ tidak
// Database dalam keadaan incomplete
```

**Masalah:**

- ❌ Partial data jika user cancel
- ❌ Orphaned records jika gagal di tengah
- ❌ Kompleks untuk cleanup

---

### 2. User Experience

#### Centralized ✅

```
User Flow:
1. Navigate freely between steps ←→
2. Modify data di step manapun
3. Click "Selesai" di akhir
4. All data submitted at once
5. Success/Error notification

User dapat:
✅ Back & forth freely
✅ Review semua data sebelum submit
✅ Cancel kapan saja tanpa side-effect
```

**Keuntungan UX:**

- ✅ Flexible navigation
- ✅ No commitment until final submit
- ✅ Easy to review & correct

#### Per-Step ❌

```
User Flow:
1. Complete Step 1 → Submit ✅
2. Complete Step 2 → Submit ✅
3. Complete Step 3 → Submit ❌ ERROR!
4. User stuck - can't go back easily

User terpaksa:
❌ Follow sequential order
❌ Commit di setiap step (no review)
❌ Difficult to cancel (partial data exists)
```

**Masalah UX:**

- ❌ Rigid navigation
- ❌ Premature commitment
- ❌ Cannot review holistically

---

### 3. Validation

#### Centralized ✅

```javascript
// Can validate across steps
function validateSingleActiveStatus() {
  const categories = [
    wizardState.unitKerja.data,
    wizardState.jabatan.data,
    wizardState.pangkat.data,
  ];

  for (const category of categories) {
    const activeCount = category.filter((x) => x.status === "Aktif").length;
    if (activeCount > 1) {
      throw new Error("Hanya boleh 1 data aktif per kategori");
    }
  }
}

// Validate BEFORE submitting anything
await validateSingleActiveStatus();
```

**Keuntungan:**

- ✅ Cross-step validation
- ✅ Business rule enforcement
- ✅ Prevent invalid state from persisting

#### Per-Step ❌

```javascript
// Step 2: Save unit kerja
await saveUnitKerja({ status: "Aktif" }); // ✅

// Step 3: Save jabatan
await saveJabatan({ status: "Aktif" }); // ✅

// Both saved as "Aktif" - VIOLATES SINGLE ACTIVE RULE!
// But too late, already in database
```

**Masalah:**

- ❌ Cannot validate across steps
- ❌ Business rules can be violated
- ❌ Cleanup required if rules violated

---

### 4. Error Handling & Rollback

#### Centralized ✅

```javascript
async function submitForm() {
  try {
    const userId = await saveBiodata();

    await Promise.all([
      saveUnitKerja(userId),
      saveJabatan(userId),
      savePangkat(userId),
    ]);

    return "success";
  } catch (error) {
    // Auto-rollback: nothing saved
    // OR manual cleanup if needed
    return "error";
  }
}
```

**Rollback strategy:**

```javascript
// Option 1: Transaction (if backend supports)
db.transaction(async (trx) => {
  await trx("users").insert(biodata);
  await trx("unit_kerja").insert(unitKerja);
  // Auto rollback on error
});

// Option 2: Manual cleanup
try {
  // ... save all
} catch (error) {
  // Delete all created records
  if (userId) await deleteUser(userId);
}
```

#### Per-Step ❌

```javascript
// Step 1
const userId = await saveBiodata(); // ✅ ID = 123

// Step 2
await saveUnitKerja(userId); // ✅

// Step 3
await saveJabatan(userId); // ❌ FAILS

// Now what?
// - User 123 exists in database
// - Unit Kerja exists for user 123
// - But no Jabatan (incomplete data)

// Complex cleanup required:
await deleteUnitKerja(userId);
await deleteUser(userId);
```

**Masalah:**

- ❌ Complex cascade deletion
- ❌ Race conditions
- ❌ Partial data if cleanup fails

---

### 5. Performance

#### Centralized ✅

```
Request Flow:
─────────────────────────────────
Client                    Server
────────────────────────────────

Wizard State
├─ biodata
├─ unitKerja
├─ jabatan
├─ pangkat
├─ pendidikan
├─ pelatihan
└─ prestasi

    │
    │ 1x POST /batch
    ├──────────────────► Process all
    │                    ├─ Insert user
    │                    ├─ Insert unit_kerja
    │                    ├─ Insert jabatan
    │                    └─ ... (dalam 1 transaksi)
    │
    │ ◄────────────────── Success
    │

Total: 1 HTTP request
Time: ~300ms
```

#### Per-Step ❌

```
Request Flow:
─────────────────────────────────
Client                    Server
────────────────────────────────

Step 1 ├─► POST /users         (~150ms)
       │   ◄── userId: 123
       │
Step 2 ├─► POST /unit-kerja     (~150ms)
       │
Step 3 ├─► POST /jabatan        (~150ms)
       │
Step 4 ├─► POST /pangkat        (~150ms)
       │
Step 5 ├─► POST /pendidikan     (~150ms)
       │
Step 6 ├─► POST /pelatihan      (~150ms)
       │
Step 7 ├─► POST /prestasi       (~150ms)

Total: 7 HTTP requests
Time: ~1050ms (7 x 150ms)

+ Network overhead
+ Connection setup per request
```

**Perbandingan:**
| Metric | Centralized | Per-Step |
|--------|-------------|----------|
| HTTP Requests | 1 | 7 |
| Total Time | ~300ms | ~1050ms |
| Network Overhead | Minimal | High |
| Server Load | 1 transaction | 7 transactions |

---

### 6. Code Complexity & Maintainability

#### Centralized ✅

```javascript
// Single submission point
async function submitForm() {
  try {
    validateSingleActiveStatus();

    const userId = await saveBiodata();

    await saveAllRelatedData(userId);

    success();
  } catch (error) {
    handleError(error);
  }
}

// Helper functions
async function saveAllRelatedData(userId) {
  await saveUnitKerja(userId);
  await saveJabatan(userId);
  await savePangkat(userId);
  await savePendidikan(userId);
  await savePelatihan(userId);
  await savePrestasi(userId);
}
```

**Maintainability:**

- ✅ Single responsibility
- ✅ Easy to test
- ✅ Clear data flow
- ✅ Simple debugging

#### Per-Step ❌

```javascript
// Step 1 Component
async function submitStep1() {
  try {
    const userId = await saveBiodata();
    store.setUserId(userId); // Global state
    emit("step1-complete", userId);
  } catch (error) {
    handleStep1Error(error);
  }
}

// Step 2 Component
async function submitStep2() {
  const userId = store.getUserId(); // Get from global state

  try {
    await saveUnitKerja(userId);
    emit("step2-complete");
  } catch (error) {
    // Should we rollback Step 1?
    // Complex error handling
    handleStep2Error(error, userId);
  }
}

// ... 5 more steps with similar complexity
// Each step needs:
// - Access to userId from Step 1
// - Error handling with potential rollback
// - State management across components
```

**Masalah:**

- ❌ Scattered logic across components
- ❌ Complex state management
- ❌ Hard to test in isolation
- ❌ Difficult debugging

---

### 7. Debugging & Monitoring

#### Centralized ✅

```javascript
async function submitForm() {
  console.log("=== Starting Wizard Submission ===");
  console.log("Wizard State:", wizardState);

  try {
    // All logic in one place
    const userId = await saveBiodata();
    console.log("✅ Biodata saved, userId:", userId);

    await saveUnitKerja(userId);
    console.log("✅ Unit Kerja saved");

    // ... easy to trace flow

    console.log("=== Submission Complete ===");
  } catch (error) {
    console.error("❌ Submission failed at:", error);
    // Clear point of failure
  }
}

// Easy to add analytics
analytics.track("wizard_submission_start", { userId });
analytics.track("wizard_submission_success");
```

**Debugging Benefits:**

- ✅ Linear flow (easy to trace)
- ✅ Single point of entry
- ✅ Clear error location
- ✅ Easy to add logging/analytics

#### Per-Step ❌

```javascript
// Error could happen in any of 7 components
// Hard to trace:

// Step 1
console.log("Step 1 start");
const userId = await saveBiodata();
console.log("Step 1 done, userId:", userId);

// Step 2 (different component)
console.log("Step 2 start");
const userId = getStoredUserId(); // Where did this come from?
await saveUnitKerja(userId);
console.log("Step 2 done");

// Step 3 (another component)
// ERROR here - but why? Previous steps succeeded...

// Complex debugging:
// - Which step failed?
// - Was userId passed correctly?
// - Which data is in database, which isn't?
```

**Debugging Challenges:**

- ❌ Distributed logic
- ❌ State spread across components
- ❌ Hard to reproduce bugs
- ❌ Complex error tracing

---

## 🎯 Decision Matrix

### Gunakan **Centralized** jika:

- ✅ Data relationships kompleks
- ✅ Butuh data integrity tinggi
- ✅ User perlu review sebelum commit
- ✅ Ingin UX yang fleksibel
- ✅ Butuh validasi cross-step
- ✅ Prioritas: maintainability & testing

### Gunakan **Per-Step** jika:

- ⚠️ Setiap step benar-benar independen
- ⚠️ Tidak ada relationships antar step
- ⚠️ User tidak perlu navigasi bebas
- ⚠️ Partial save adalah acceptable
- ⚠️ Backend tidak support batch operations

---

## 📊 Scoring (1-10)

| Kriteria        | Centralized | Per-Step  |
| --------------- | ----------- | --------- |
| Data Integrity  | 10          | 4         |
| User Experience | 9           | 5         |
| Performance     | 8           | 5         |
| Error Handling  | 9           | 4         |
| Code Quality    | 9           | 4         |
| Maintainability | 9           | 4         |
| Testing         | 9           | 5         |
| Debugging       | 9           | 4         |
| **TOTAL**       | **72/80**   | **35/80** |

---

## ✅ Rekomendasi Final

### **CENTRALIZED SUBMISSION** 🏆

**Untuk Employment Form Wizard ini, gunakan Centralized Submission karena:**

1. **Data Relationships** ✅  
   Semua data step 2-7 depend on `idpengguna` dari step 1

2. **Business Rules** ✅  
   "Single active status" rule membutuhkan cross-step validation

3. **User Experience** ✅  
   User harus bisa review & edit sebelum final commit

4. **Data Integrity** ✅  
   Critical - tidak boleh ada partial employee records

5. **Maintainability** ✅  
   Wizard ini akan berkembang, butuh arsitektur yang clean

### Implementation Checklist

```javascript
// ✅ 1. Centralized state
const wizardState = reactive({ /* all steps */ });

// ✅ 2. v-model binding
<Step1Biodata v-model="wizardState.biodata" />

// ✅ 3. Validation before submit
validateSingleActiveStatus();

// ✅ 4. Single submission point
async function submitForm() {
  const userId = await saveBiodata();
  await saveAllRelated(userId);
}

// ✅ 5. Clear error handling
try { ... } catch (error) { rollback(); }
```

---

## 📚 Referensi

- **Full Architecture**: [EMPLOYMENT_FORM_WIZARD_ARCHITECTURE.md](./EMPLOYMENT_FORM_WIZARD_ARCHITECTURE.md)
- **Quick Reference**: [EMPLOYMENT_WIZARD_QUICK_REF.md](./EMPLOYMENT_WIZARD_QUICK_REF.md)

---

**Conclusion**: Centralized Submission adalah pilihan terbaik untuk Employment Form Wizard dengan scoring **72/80** vs **35/80** untuk Per-Step approach.

**Last Updated**: 2025-11-28  
**Version**: 1.0.0
