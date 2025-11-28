# Employment Form Wizard - Flow Diagram

## 🎯 Complete Wizard Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    OPEN EMPLOYMENT MODAL                        │
│                                                                 │
│  Props: { fieldToEdit: null/Object, entityName: "Pegawai" }   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  Is Edit Mode? │
                    └────────┬───────┘
                             │
                ┌────────────┴────────────┐
                │                         │
               YES                       NO
                │                         │
                ▼                         ▼
    ┌────────────────────┐    ┌─────────────────────┐
    │  Load Existing     │    │  Show Card Selection│
    │  User Data         │    │                     │
    │  → Step 1 Form     │    │  ┌───────────────┐  │
    └────────┬───────────┘    │  │ Use Existing  │  │
             │                │  │     User      │  │
             │                │  └───────┬───────┘  │
             │                │          │          │
             │                │  ┌───────▼───────┐  │
             │                │  │ Create New    │  │
             │                │  │     User      │  │
             │                │  └───────┬───────┘  │
             │                └──────────┼──────────┘
             │                           │
             └───────────────────────────┘
                             │
                             ▼
```

## 📝 Step 1: Biodata Form

```
┌─────────────────────────────────────────────────────────────────┐
│                        STEP 1: BIODATA                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  MODE SELECTED:                                                 │
│  ┌────────────────┐         ┌────────────────┐                │
│  │  "existing"    │   OR    │     "new"      │                │
│  └────────┬───────┘         └────────┬───────┘                │
│           │                          │                         │
│           ▼                          ▼                         │
│  ┌────────────────┐         ┌────────────────┐                │
│  │ Show User List │         │ Empty Form     │                │
│  │ Select User    │         │                │                │
│  │ Populate Data  │         │                │                │
│  └────────┬───────┘         └────────┬───────┘                │
│           │                          │                         │
│           └──────────┬───────────────┘                         │
│                      │                                         │
│                      ▼                                         │
│         ┌──────────────────────────┐                          │
│         │   FILL FORM BIODATA      │                          │
│         │                          │                          │
│         │  ⚠️  REQUIRED FIELDS:     │                          │
│         │  • Nama Lengkap          │                          │
│         │  • NIK                   │                          │
│         │  • Email                 │                          │
│         │  • Level/Role            │                          │
│         │                          │                          │
│         │  OPTIONAL FIELDS:        │                          │
│         │  • Gelar, NIP, Telp      │                          │
│         │  • Alamat, Provinsi      │                          │
│         │  • Foto, dll             │                          │
│         └──────────┬───────────────┘                          │
│                    │                                           │
│                    ▼                                           │
│         ┌──────────────────────────┐                          │
│         │   VALIDATION CHECK       │                          │
│         │                          │                          │
│         │  1. Mode selected?       │                          │
│         │  2. User selected? (ex)  │                          │
│         │  3. Required filled?     │                          │
│         └──────────┬───────────────┘                          │
│                    │                                           │
│         ┌──────────┴──────────┐                               │
│        FAIL                 PASS                              │
│         │                      │                               │
│         ▼                      ▼                               │
│  ┌──────────────┐      ┌─────────────┐                       │
│  │ Show Alert   │      │ Click Next  │                       │
│  │ Prevent Next │      │ → Step 2    │                       │
│  └──────────────┘      └─────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Steps 2-7: Repeater Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│              STEP 2-7: REPEATER PATTERN                         │
│          (Unit Kerja, Jabatan, Pangkat, Pendidikan,            │
│               Pelatihan, Prestasi)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ON ENTER STEP:                                                 │
│  ┌────────────────────────────────────────────┐                │
│  │ currentUserId available?                   │                │
│  └─────────────┬──────────────────────────────┘                │
│               YES                                               │
│                │                                                │
│                ▼                                                │
│  ┌────────────────────────────────────────────┐                │
│  │ loadData(userId)                           │                │
│  │ → Fetch existing records from API          │                │
│  │ → Populate list                            │                │
│  └────────────┬───────────────────────────────┘                │
│               │                                                 │
│               ▼                                                 │
│  ┌────────────────────────────────────────────┐                │
│  │         REPEATER INTERFACE                 │                │
│  │                                            │                │
│  │  ┌──────────────────────────────────────┐ │                │
│  │  │ ℹ️  Info Alert:                       │ │                │
│  │  │ Hanya 1 data boleh berstatus AKTIF   │ │                │
│  │  └──────────────────────────────────────┘ │                │
│  │                                            │                │
│  │  List is empty?                            │                │
│  │  ┌─────────────────┐                      │                │
│  │  │ Show empty state│                      │                │
│  │  │ + Add button    │                      │                │
│  │  └─────────────────┘                      │                │
│  │                                            │                │
│  │  List has items:                           │                │
│  │  ┌──────────────────────────────────────┐ │                │
│  │  │ 📋 Item #1                           │ │                │
│  │  │ • Field 1 (required) ⚠️               │ │                │
│  │  │ • Field 2 (required) ⚠️               │ │                │
│  │  │ • Field 3 (optional)                 │ │                │
│  │  │ • Status: [✓ Aktif / ☐ Tidak Aktif] │ │                │
│  │  │ • [🗑️ Delete]                        │ │                │
│  │  └──────────────────────────────────────┘ │                │
│  │                                            │                │
│  │  ┌──────────────────────────────────────┐ │                │
│  │  │ 📋 Item #2                           │ │                │
│  │  │ • Field 1 (required) ⚠️               │ │                │
│  │  │ • Field 2 (required) ⚠️               │ │                │
│  │  │ • Field 3 (optional)                 │ │                │
│  │  │ • Status: [☐ Aktif / ✓ Tidak Aktif] │ │                │
│  │  │ • [🗑️ Delete]                        │ │                │
│  │  └──────────────────────────────────────┘ │                │
│  │                                            │                │
│  │  [➕ Tambah Data]                          │                │
│  │                                            │                │
│  └────────────┬───────────────────────────────┘                │
│               │                                                 │
│               ▼                                                 │
│  ┌────────────────────────────────────────────┐                │
│  │ CLICK NEXT / SKIP                          │                │
│  └────────────┬───────────────────────────────┘                │
│               │                                                 │
│               ▼                                                 │
│  ┌────────────────────────────────────────────┐                │
│  │ VALIDATION                                 │                │
│  │                                            │                │
│  │ List empty? → VALID (skip)                │                │
│  │ List has items?                           │                │
│  │   → Check required fields of each item    │                │
│  │   → All valid? PASS : FAIL                │                │
│  └────────────┬───────────────────────────────┘                │
│               │                                                 │
│    ┌──────────┴─────────┐                                      │
│   FAIL              PASS                                       │
│    │                    │                                       │
│    ▼                    ▼                                       │
│  ┌─────────┐      ┌──────────┐                                │
│  │Alert    │      │Next Step │                                │
│  │Prevent  │      │or Finish │                                │
│  └─────────┘      └──────────┘                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 💾 Data Submission Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   CLICK "SELESAI" BUTTON                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │  submitForm()            │
              │  isLoading = true        │
              └──────────┬───────────────┘
                         │
                         ▼
   ┌─────────────────────────────────────────────────┐
   │           PHASE 1: SAVE BIODATA                 │
   ├─────────────────────────────────────────────────┤
   │                                                 │
   │  Mode: "new" + !createdUserId?                 │
   │  ┌───────────────────────────────────────┐     │
   │  │ CREATE NEW USER                       │     │
   │  │ • Build FormData from userData        │     │
   │  │ • Append photo if exists              │     │
   │  │ • Call addUser(formData)             │     │
   │  │ • Get userId from response            │     │
   │  │ • Save to createdUserId               │     │
   │  │ ✅ Success Toast                      │     │
   │  └───────────────────────────────────────┘     │
   │                                                 │
   │  Mode: Edit OR Mode: "existing"?               │
   │  ┌───────────────────────────────────────┐     │
   │  │ UPDATE USER                           │     │
   │  │ • Build FormData from userData        │     │
   │  │ • Append photo if changed             │     │
   │  │ • Append _method = "PUT"              │     │
   │  │ • Call updateUser(userId, formData)  │     │
   │  │ ✅ Success Toast                      │     │
   │  └───────────────────────────────────────┘     │
   │                                                 │
   │  Mode: "existing" (no changes)?                │
   │  ┌───────────────────────────────────────┐     │
   │  │ USE EXISTING userId                   │     │
   │  │ • No API call needed                  │     │
   │  └───────────────────────────────────────┘     │
   │                                                 │
   └────────────────────┬────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────┐
        │  userId Available?        │
        └───────┬───────────────────┘
               YES
                │
                ▼
   ┌─────────────────────────────────────────────────┐
   │     PHASE 2: SAVE REPEATER DATA (Steps 2-7)    │
   ├─────────────────────────────────────────────────┤
   │                                                 │
   │  FOR EACH STEP (unitKerja, jabatan, etc):     │
   │                                                 │
   │  ┌────────────────────────────────────────┐    │
   │  │ IF list.length > 0:                    │    │
   │  │                                        │    │
   │  │ FOR EACH item in list:                │    │
   │  │   IF item has required fields:        │    │
   │  │                                        │    │
   │  │   1. Create FormData                  │    │
   │  │      • append record[idpengguna]      │    │
   │  │      • append all item fields         │    │
   │  │      • append file if exists          │    │
   │  │                                        │    │
   │  │   2. Add API call to promises[]       │    │
   │  │      • Step 2: addUserWorkUnit()      │    │
   │  │      • Step 3: addUserLevel()         │    │
   │  │      • Step 4: addUserRank()          │    │
   │  │      • Step 5: addUserEducation()     │    │
   │  │      • Step 6: addUserTraining()      │    │
   │  │      • Step 7: addUserAchievement()   │    │
   │  │                                        │    │
   │  └────────────────────────────────────────┘    │
   │                                                 │
   │  ┌────────────────────────────────────────┐    │
   │  │ Execute All Promises:                  │    │
   │  │ await Promise.all(promises)           │    │
   │  │                                        │    │
   │  │ ✅ All saved in parallel              │    │
   │  └────────────────────────────────────────┘    │
   │                                                 │
   └────────────────────┬────────────────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │ SUCCESS!        │
              │                 │
              │ ✅ Toast        │
              │ emit("save-    │
              │   successful") │
              │ closeModal()   │
              └─────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │ END             │
              └─────────────────┘
```

## 🎯 Switch Mechanism (Only One Active)

```
┌─────────────────────────────────────────────────────────────┐
│              STATUS SWITCH MECHANISM                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Initial State:                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │ Item 1: Status = "Aktif"      [✓ Active]        │      │
│  │ Item 2: Status = "Tidak Aktif" [☐ Inactive]     │      │
│  │ Item 3: Status = "Tidak Aktif" [☐ Inactive]     │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
│  User clicks switch on Item 2:                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │ handleStatusChange(index=1, checked=true)        │      │
│  │                                                  │      │
│  │ 1. item[1].status = "Aktif"                     │      │
│  │                                                  │      │
│  │ 2. Loop through ALL items:                      │      │
│  │    IF index !== 1:                              │      │
│  │       item.status = "Tidak Aktif"               │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
│  Result:                                                    │
│  ┌──────────────────────────────────────────────────┐      │
│  │ Item 1: Status = "Tidak Aktif" [☐ Inactive]     │      │
│  │ Item 2: Status = "Aktif"      [✓ Active]  ← NEW │      │
│  │ Item 3: Status = "Tidak Aktif" [☐ Inactive]     │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
│  ✅ Only ONE item has "Aktif" status at a time             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Structure Flow

```
stepData (Reactive Object)
│
├── biodata
│   ├── mode: "" | "existing" | "new"
│   ├── userId: null | String
│   ├── userData: Object
│   │   ├── nama: String ⚠️
│   │   ├── nik: String ⚠️
│   │   ├── email: String ⚠️
│   │   ├── idlevel: String ⚠️
│   │   ├── ... (other fields)
│   ├── photoFile: File | null
│   └── isPhotoRemoved: Boolean
│
├── unitKerja
│   └── list: Array<{
│         idunitkerja: String ⚠️
│         tglmulai: Date ⚠️
│         tglselesai: Date
│         status: "Aktif" | "Tidak Aktif"
│         filesk: File | null
│       }>
│
├── jabatan
│   └── list: Array<{...}>
│
├── pangkat
│   └── list: Array<{...}>
│
├── pendidikan
│   └── list: Array<{...}>
│
├── pelatihan
│   └── list: Array<{...}>
│
└── prestasi
    └── list: Array<{...}>


currentUserId (Computed)
│
├── Priority 1: props.fieldToEdit?.idpengguna (Edit Mode)
├── Priority 2: stepData.biodata.userId (Existing User)
└── Priority 3: createdUserId.value (New User Created)
```

---

## Legend

- ⚠️ = Required field
- ✅ = Success state
- ❌ = Error state
- 🔄 = Process/Action
- 📋 = Data/List
- ➕ = Add action
- 🗑️ = Delete action
- ✓ = Checked/Active
- ☐ = Unchecked/Inactive
- ℹ️ = Information

---

**Last Updated**: 2025-11-28
