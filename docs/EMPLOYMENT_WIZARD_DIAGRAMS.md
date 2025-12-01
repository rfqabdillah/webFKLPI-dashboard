# 📐 Employment Form Wizard - Visual Diagrams

## 🎨 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EMPLOYMENT FORM WIZARD                                  │
│                      (EmploymentFormModal.vue)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    CENTRALIZED STATE                                 │   │
│  │                      (wizardState)                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  biodata: {                                                          │   │
│  │    mode, userId, userData, photoFile                                │   │
│  │  }                                                                   │   │
│  │  unitKerja: { data: [], files: {} }                                │   │
│  │  jabatan: { data: [], files: {} }                                  │   │
│  │  pangkat: { data: [], files: {} }                                  │   │
│  │  pendidikan: { data: [] }                                           │   │
│  │  pelatihan: { data: [], files: {} }                                │   │
│  │  prestasi: { data: [], files: {} }                                 │   │
│  └─────────────────┬───────────────────────────────────────────────────┘   │
│                    │ v-model binding                                         │
│  ┌─────────────────▼───────────────────────────────────────────────────┐   │
│  │                      WIZARD STEPS                                    │   │
│  ├──────────┬──────────┬──────────┬──────────┬──────────┬──────────────┤   │
│  │  Step 1  │  Step 2  │  Step 3  │  Step 4  │  Step 5  │  Step 6 & 7  │   │
│  │ Biodata  │ Unit     │ Jabatan  │ Pangkat  │Pendidikan│ Pelatihan &  │   │
│  │(Required)│  Kerja   │          │          │          │   Prestasi   │   │
│  │          │(Optional)│(Optional)│(Optional)│(Optional)│  (Optional)  │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┴──────────────┘   │
│                    │ Navigation (Free movement)                              │
│                    │ Update state on each interaction                        │
│                    │                                                          │
│  ┌─────────────────▼───────────────────────────────────────────────────┐   │
│  │              CLICK "SELESAI" (FINAL STEP)                           │   │
│  └─────────────────┬───────────────────────────────────────────────────┘   │
│                    │                                                          │
│  ┌─────────────────▼───────────────────────────────────────────────────┐   │
│  │              VALIDATION & SUBMISSION                                 │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  1. Validate required fields (nama, nik, email, level)              │   │
│  │  2. Validate single active status rule                              │   │
│  │  3. Save biodata → get userId                                       │   │
│  │  4. Save all related data (unitKerja → prestasi)                    │   │
│  │  5. Handle file uploads                                              │   │
│  └─────────────────┬───────────────────────────────────────────────────┘   │
│                    │                                                          │
│                    ▼                                                          │
│         ┌──────────────────┐                                                 │
│         │   ✅ SUCCESS     │                                                 │
│         │   Show Toast     │                                                 │
│         │   Close Modal    │                                                 │
│         └──────────────────┘                                                 │
│                    │                                                          │
│                    OR                                                         │
│                    ▼                                                          │
│         ┌──────────────────┐                                                 │
│         │   ❌ ERROR       │                                                 │
│         │   Show Error     │                                                 │
│         │   Stay in Wizard │                                                 │
│         └──────────────────┘                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
USER INTERACTION
       │
       ▼
┌──────────────────┐
│ Edit Form Field  │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────┐
│ Step Component (v-model)        │
│ - Step1Biodata.vue              │
│ - Step2UnitKerja.vue            │
│ - etc...                        │
└────────┬────────────────────────┘
         │ emit('update:modelValue')
         ▼
┌─────────────────────────────────┐
│ Parent Component                │
│ wizardState.biodata = newValue  │
│ (Reactive Update)               │
└────────┬────────────────────────┘
         │
         ├─► Emit validation-change
         ├─► Emit user-selected
         └─► Emit user-data-loaded

         │
         ▼
┌─────────────────────────────────┐
│ UI Updates (Reactivity)         │
│ - Validation state              │
│ - Navigation buttons            │
│ - Progress indicator            │
└─────────────────────────────────┘
```

---

## 🎭 Step 1: Biodata Flow

```
┌─────────────────────────────────────────────┐
│         Open Employment Modal                │
└───────────────┬─────────────────────────────┘
                │
                ▼
        ┌───────────────┐
        │   Edit Mode?  │
        └───────┬───────┘
                │
       ┌────────┴────────┐
       │                 │
      YES               NO
       │                 │
       ▼                 ▼
┌──────────────┐   ┌─────────────────────┐
│ Populate     │   │  Show Card          │
│ Form with    │   │  Selection:         │
│ Existing     │   │  1. Existing User   │
│ Data         │   │  2. New User        │
└──────┬───────┘   └─────────┬───────────┘
       │                     │
       │           ┌─────────┴─────────┐
       │           │                   │
       │      EXISTING               NEW
       │           │                   │
       │           ▼                   │
       │   ┌──────────────────┐       │
       │   │  User Selection  │       │
       │   │  Table           │       │
       │   │  - Search        │       │
       │   │  - Select user   │       │
       │   └─────────┬────────┘       │
       │             │                 │
       │             ▼                 │
       │   ┌──────────────────┐       │
       │   │  Load User Data  │       │
       │   │  (isLoading=true)│       │
       │   │  Fields:         │       │
       │   │  "Memuat..."     │       │
       │   └─────────┬────────┘       │
       │             │                 │
       └─────────────┴─────────────────┘
                     │
                     ▼
           ┌──────────────────┐
           │  Biodata Form    │
           │  - Nama *        │
           │  - NIK *         │
           │  - Email *       │
           │  - Level *       │
           │  - Other fields  │
           └────────┬─────────┘
                    │
                    ▼
           ┌──────────────────┐
           │   Validate       │
           │   - Required     │
           │   - Email format │
           └────────┬─────────┘
                    │
            ┌───────┴────────┐
            │               │
           VALID          INVALID
            │               │
            ▼               ▼
     ┌────────────┐   ┌──────────┐
     │ Enable     │   │  Show    │
     │ "Next"     │   │  Errors  │
     │ Button     │   │  (Alert) │
     └────────────┘   └──────────┘
```

---

## 🔁 Repeater Step Flow (Steps 2-7)

```
┌────────────────────────────────────┐
│    Enter Repeater Step             │
│    (e.g., Unit Kerja)              │
└─────────────┬──────────────────────┘
              │
              ▼
      ┌───────────────┐
      │  Has userId?  │
      └───────┬───────┘
              │
     ┌────────┴────────┐
     │                 │
    YES               NO
     │                 │
     ▼                 ▼
┌─────────────┐   ┌──────────────┐
│ loadData()  │   │ Show Empty   │
│ from API    │   │ State        │
└──────┬──────┘   └──────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Display Data List               │
│  ┌────────────────────────────┐ │
│  │ Item 1  [Aktif]   [Edit]   │ │
│  │ Item 2  [Tidak]   [Edit]   │ │
│  │ Item 3  [Tidak]   [Delete] │ │
│  └────────────────────────────┘ │
│  [+ Tambah Data Baru]           │
└────────────┬─────────────────────┘
             │
     ┌───────┴────────┐
     │                │
   EDIT             ADD
     │                │
     ▼                ▼
┌──────────┐   ┌──────────────┐
│ Edit     │   │ Add New      │
│ Form     │   │ Form         │
│          │   │              │
│ [Save]   │   │ [Save]       │
└────┬─────┘   └──────┬───────┘
     │                │
     └────────┬───────┘
              │
              ▼
    ┌──────────────────┐
    │  Toggle Status   │
    │  to "Aktif"?     │
    └─────────┬────────┘
              │
     ┌────────┴─────────┐
     │                  │
    YES                NO
     │                  │
     ▼                  │
┌─────────────────┐    │
│ Deactivate All  │    │
│ Other Items     │    │
│ (Single Active) │    │
└────────┬────────┘    │
         │             │
         └──────┬──────┘
                │
                ▼
       ┌─────────────────┐
       │ Update State    │
       │ wizardState     │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ Show in List    │
       │ (No API call)   │
       └─────────────────┘
```

---

## 🎯 Validation Flow

```
┌────────────────────────────────┐
│  User clicks "Selesai"         │
└───────────┬────────────────────┘
            │
            ▼
   ┌──────────────────┐
   │ validateStep(6)  │
   │ (Final Step)     │
   └────────┬─────────┘
            │
            ▼
┌────────────────────────────────────┐
│  Step-level Validation             │
│  - Check required fields           │
│  - Validate formats                │
└────────────┬───────────────────────┘
             │
     ┌───────┴────────┐
     │                │
   VALID            INVALID
     │                │
     ▼                ▼
     │         ┌──────────────┐
     │         │ Show Error   │
     │         │ Return false │
     │         └──────────────┘
     │
     ▼
┌──────────────────────────────────┐
│  wizardCompleted()               │
└────────────┬─────────────────────┘
             │
             ▼
┌──────────────────────────────────┐
│  submitForm()                    │
│  ┌────────────────────────────┐ │
│  │ 1. Validate All Data       │ │
│  │    - Required fields       │ │
│  │    - Single active status  │ │
│  └─────────────┬──────────────┘ │
│                │                 │
│        ┌───────┴────────┐       │
│        │                │       │
│      VALID            INVALID   │
│        │                │       │
│        │                ▼       │
│        │      ┌──────────────┐ │
│        │      │ Throw Error  │ │
│        │      │ Show Toast   │ │
│        │      └──────────────┘ │
│        │                        │
│        ▼                        │
│  ┌──────────────────────┐      │
│  │ 2. Save Biodata      │      │
│  │    → get userId      │      │
│  └──────────┬───────────┘      │
│             │                   │
│             ▼                   │
│  ┌──────────────────────┐      │
│  │ 3. Save Related Data │      │
│  │    for each step     │      │
│  └──────────┬───────────┘      │
│             │                   │
│     ┌───────┴────────┐         │
│     │                │         │
│   SUCCESS          ERROR       │
│     │                │         │
│     ▼                ▼         │
│ ┌─────────┐   ┌──────────────┐│
│ │ Toast   │   │ Toast Error  ││
│ │ Close   │   │ Stay Open    ││
│ └─────────┘   └──────────────┘│
└──────────────────────────────────┘
```

---

## 📊 Single Active Status Logic

```
┌──────────────────────────────────────────┐
│  Unit Kerja Data (Example)               │
├──────────────────────────────────────────┤
│  [1] BPKD       Aktif    2020-2023       │
│  [2] Dinsos     Tidak    2018-2020       │
│  [3] Dishub     Tidak    2015-2018       │
└───────────────┬──────────────────────────┘
                │
                ▼
    User toggles Item[3] to "Aktif"
                │
                ▼
┌────────────────────────────────────────────┐
│  Smart Toggle Logic:                       │
│  ┌──────────────────────────────────────┐ │
│  │ if (newStatus === "Aktif") {         │ │
│  │   // Deactivate all others           │ │
│  │   data.forEach((item, i) => {        │ │
│  │     if (i !== currentIndex) {        │ │
│  │       item.status = "Tidak Aktif";   │ │
│  │     }                                 │ │
│  │   });                                 │ │
│  │ }                                     │ │
│  └──────────────────────────────────────┘ │
└────────────────┬───────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│  Updated Data:                            │
├──────────────────────────────────────────┤
│  [1] BPKD       Tidak    2020-2023       │
│  [2] Dinsos     Tidak    2018-2020       │
│  [3] Dishub     Aktif ✓  2015-2018       │
└──────────────────────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │ Update State  │
         │ (No API call) │
         └───────────────┘
```

---

## 🚀 Submission Sequence Diagram

```
User          Step1        Step2-7      Parent         API
 │              │            │            │             │
 │ Fill Forms   │            │            │             │
 ├─────────────►│            │            │             │
 │              ├────────────┼───────────►│             │
 │              │ v-model    │  wizardState updates    │
 │              │            │            │             │
 │ Navigate ◄───┼────────────┼────────────┤             │
 │  Freely      │            │            │             │
 │              │            │            │             │
 │ Click "Selesai"           │            │             │
 ├───────────────────────────┼───────────►│             │
 │              │            │            │             │
 │              │            │       ┌────┴─────┐       │
 │              │            │       │ Validate │       │
 │              │            │       │ All Data │       │
 │              │            │       └────┬─────┘       │
 │              │            │            │             │
 │              │            │       POST /users        │
 │              │            │            ├────────────►│
 │              │            │            │  biodata    │
 │              │            │            │◄────────────┤
 │              │            │            │  userId:123 │
 │              │            │            │             │
 │              │            │       POST /unit-kerja   │
 │              │            │            ├────────────►│
 │              │            │            │  + userId   │
 │              │            │            │◄────────────┤
 │              │            │            │   Success   │
 │              │            │            │             │
 │              │            │       POST /jabatan      │
 │              │            │            ├────────────►│
 │              │            │            │  + userId   │
 │              │            │            │◄────────────┤
 │              │            │            │   Success   │
 │              │            │            │             │
 │              │            │       ... (Steps 4-7)    │
 │              │            │            │             │
 │              │            │       ┌────┴─────┐       │
 │              │            │       │ Success  │       │
 │              │            │       │ Toast &  │       │
 │              │            │       │ Close    │       │
 │              │            │       └────┬─────┘       │
 │◄───────────────────────────────────────┘             │
 │  ✅ Done                  │            │             │
```

---

## 🎨 Component Hierarchy

```
EmploymentFormModal.vue
│
├── wizardState (Centralized State)
│   ├── biodata
│   ├── unitKerja
│   ├── jabatan
│   ├── pangkat
│   ├── pendidikan
│   ├── pelatihan
│   └── prestasi
│
├── FormWizard (vue3-form-wizard)
│   │
│   ├── TabContent[0] - Step 1
│   │   └── Step1Biodata.vue
│   │       ├── Props: modelValue, fieldToEdit
│   │       ├── Emits: update:modelValue, validation-change,
│   │       │         user-selected, user-data-loaded
│   │       ├── State:
│   │       │   ├── mode ('new' | 'existing')
│   │       │   ├── formData
│   │       │   ├── selectedUser
│   │       │   └── isLoadingUserData
│   │       └── Methods:
│   │           ├── selectMode()
│   │           ├── selectUser()
│   │           ├── validate()
│   │           └── populateFormData()
│   │
│   ├── TabContent[1] - Step 2
│   │   └── Step2UnitKerja.vue
│   │       ├── Props: modelValue, currentUserId
│   │       ├── Emits: update:modelValue, validation-change
│   │       ├── State:
│   │       │   ├── items: []
│   │       │   └── files: {}
│   │       └── Methods:
│   │           ├── addItem()
│   │           ├── removeItem()
│   │           ├── toggleStatus()
│   │           └── loadData()
│   │
│   ├── TabContent[2] - Step 3
│   │   └── Step3Jabatan.vue (similar to Step2)
│   │
│   ├── TabContent[3] - Step 4
│   │   └── Step4Pangkat.vue (similar to Step2)
│   │
│   ├── TabContent[4] - Step 5
│   │   └── Step5Pendidikan.vue (similar to Step2, no files)
│   │
│   ├── TabContent[5] - Step 6
│   │   └── Step6Pelatihan.vue (similar to Step2)
│   │
│   └── TabContent[6] - Step 7
│       └── Step7Prestasi.vue (similar to Step2)
│
└── Methods:
    ├── submitForm()
    ├── validateSingleActiveStatus()
    ├── saveBiodata()
    ├── saveUnitKerja()
    ├── saveJabatan()
    ├── savePangkat()
    ├── savePendidikan()
    ├── savePelatihan()
    └── savePrestasi()
```

---

## 💡 State Management Pattern

```
┌─────────────────────────────────────────────────────┐
│                 Parent Component                     │
│              (EmploymentFormModal.vue)               │
│                                                       │
│  const wizardState = reactive({                     │
│    biodata: { ... },                                │
│    unitKerja: { data: [], files: {} },             │
│    // ...                                            │
│  });                                                 │
└────────────┬────────────────────────────────────────┘
             │
             │ Props (read-only)
             │ ─────────────────►
             │                    ┌──────────────────┐
             │                    │ Child Component  │
             │                    │ (Step1Biodata)   │
             │                    │                  │
             │                    │ const localData  │
             │                    │   = modelValue   │
             │                    └─────────┬────────┘
             │                              │
             │ Emits                        │
             │ ◄───────────────────────────┘
             │
             │ emit('update:modelValue', newData)
             │
             ▼
  wizardState.biodata = newData
  (Reactive update triggers re-render)
```

---

## 🔐 Security & Validation Layers

```
┌──────────────────────────────────────────┐
│          Browser (Client-Side)            │
├──────────────────────────────────────────┤
│                                           │
│  Layer 1: Field-level Validation         │
│  ┌────────────────────────────────────┐ │
│  │ @blur="validateField('email')"     │ │
│  │ ✓ Email format                     │ │
│  │ ✓ Required check                   │ │
│  └────────────────────────────────────┘ │
│                   │                      │
│                   ▼                      │
│  Layer 2: Form-level Validation         │
│  ┌────────────────────────────────────┐ │
│  │ async validate()                   │ │
│  │ ✓ Yup schema validation           │ │
│  │ ✓ Cross-field validation          │ │
│  └────────────────────────────────────┘ │
│                   │                      │
│                   ▼                      │
│  Layer 3: Wizard-level Validation       │
│  ┌────────────────────────────────────┐ │
│  │ validateSingleActiveStatus()       │ │
│  │ ✓ Business rules                   │ │
│  │ ✓ Cross-step validation            │ │
│  └────────────────────────────────────┘ │
│                   │                      │
└───────────────────┼──────────────────────┘
                    │
                    ▼ HTTP Request
┌──────────────────────────────────────────┐
│          Server (Backend)                 │
├──────────────────────────────────────────┤
│                                           │
│  Layer 4: Server-side Validation         │
│  ┌────────────────────────────────────┐ │
│  │ Request validation                 │ │
│  │ ✓ Re-validate all data            │ │
│  │ ✓ Authorization check             │ │
│  │ ✓ Business logic enforcement      │ │
│  └────────────────────────────────────┘ │
│                   │                      │
│                   ▼                      │
│  Layer 5: Database Constraints           │
│  ┌────────────────────────────────────┐ │
│  │ ✓ NOT NULL constraints            │ │
│  │ ✓ UNIQUE constraints              │ │
│  │ ✓ FOREIGN KEY constraints         │ │
│  │ ✓ CHECK constraints               │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

---

**Visual Documentation Version**: 1.0.0  
**Last Updated**: 2025-11-28  
**Related Docs**:

- [Architecture](./EMPLOYMENT_FORM_WIZARD_ARCHITECTURE.md)
- [Quick Reference](./EMPLOYMENT_WIZARD_QUICK_REF.md)
- [Comparison](./CENTRALIZED_VS_PERSTEP_COMPARISON.md)
