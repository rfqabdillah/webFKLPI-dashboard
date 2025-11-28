# 🛠️ Employment Form Wizard - Panduan Implementasi Step Components

## 📋 Overview

Dokumen ini memberikan template dan panduan praktis untuk mengimplementasikan setiap step component dalam Employment Form Wizard.

---

## 🎯 Prinsip Dasar Implementasi

### 1. **Props Pattern**

Setiap step component harus menerima props berikut:

```javascript
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  currentUserId: {
    type: String,
    default: "",
  },
  fieldToEdit: {
    // Optional, hanya untuk Step 1
    type: Object,
    default: null,
  },
});
```

### 2. **Emits Pattern**

Setiap step component harus emit events berikut:

```javascript
const emit = defineEmits([
  "update:modelValue",
  "validation-change",
  "user-selected", // Hanya Step 1
]);
```

### 3. **Exposed Methods**

Setiap step component harus expose method `validate()`:

```javascript
defineExpose({
  validate,
  loadData, // Untuk Step 2-7
});
```

---

## 📝 Template Implementasi

### Step 1: Biodata (Already Implemented)

Step 1 sudah diimplementasikan dengan lengkap. Berikut checklist fitur:

✅ Card selection untuk mode "Existing" vs "New"  
✅ User selection table dengan search  
✅ Form biodata lengkap dengan validasi  
✅ Upload foto dengan preview dan compress  
✅ Dependent dropdown (Provinsi → Kabupaten)  
✅ Validasi wajib: nama, nik, email, idlevel  
✅ Emit `user-selected` event

**Tidak perlu perubahan** untuk Step 1.

---

### Step 2-7: Template Umum untuk Repeater

Berikut template yang harus diikuti untuk Step 2-7:

```vue
<template>
  <div class="step-{category}">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Memuat data referensi...</p>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="mb-1">
            <i class="fa fa-{icon} me-2"></i>Riwayat {Category}
          </h6>
          <p class="text-muted mb-0 small">
            Tambahkan riwayat {category} pegawai.
            <span class="text-danger"
              >*Hanya satu status aktif yang diperbolehkan.</span
            >
          </p>
        </div>
        <button class="btn btn-primary btn-sm" @click="addItem">
          <i class="fa fa-plus me-1"></i> Tambah {Category}
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-if="itemList.length === 0"
        class="text-center py-5 border rounded bg-light"
      >
        <i class="fa fa-{icon} fa-3x text-muted mb-3"></i>
        <p class="text-muted mb-2 small">Belum ada data {category}.</p>
        <button class="btn btn-outline-primary btn-sm" @click="addItem">
          <i class="fa fa-plus me-1"></i> Tambah {Category}
        </button>
      </div>

      <!-- List of Items -->
      <transition-group name="list" tag="div">
        <div
          v-for="(item, index) in itemList"
          :key="item._tempId"
          class="card mb-3 shadow-sm border-0"
        >
          <div
            class="card-header bg-white d-flex justify-content-between align-items-center py-3"
          >
            <h6 class="mb-0 fw-bold text-primary">
              <span class="badge bg-primary me-2">{{ index + 1 }}</span>
              {Category} #{{ index + 1 }}
            </h6>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="removeItem(index)"
              title="Hapus data ini"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>

          <div class="card-body">
            <div class="row g-3">
              <!-- Form fields here -->
              <!-- See specific implementation below -->

              <!-- Status Switch (if applicable) -->
              <div class="col-md-6" v-if="hasStatus">
                <label class="form-label fw-semibold d-block">Status</label>
                <div class="form-check form-switch mt-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    :id="'statusSwitch-' + index"
                    :checked="item.status === 'Aktif'"
                    @change="handleStatusChange(index, $event.target.checked)"
                  />
                  <label
                    class="form-check-label"
                    :for="'statusSwitch-' + index"
                  >
                    {{ item.status || "Tidak Aktif" }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { get{Category}Reference } from "@/services/referensi/{category}";
import { getUser{Category} } from "@/services/general/personnel/user{Category}";

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  currentUserId: { type: String, default: "" }
});

const emit = defineEmits(["update:modelValue", "validation-change"]);
const toast = useToast();

// State
const isLoading = ref(false);
const isDataLoaded = ref(false);
const itemList = ref([]);
const referenceOptions = ref([]);
const formErrors = ref([]);

// Watch modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && newVal.data) {
      itemList.value = newVal.data.map(item => ({
        ...item,
        _tempId: item._tempId || Date.now() + Math.random()
      }));
    }
  },
  { immediate: true, deep: true }
);

// Watch itemList and emit changes
watch(
  [itemList],
  () => {
    const data = {
      data: itemList.value.map(item => ({ ...item })),
      files: {}  // TODO: Collect files
    };

    emit("update:modelValue", data);
    emit("validation-change", true);  // Always valid for optional steps
  },
  { deep: true }
);

// Methods
async function loadData(userId) {
  if (!userId) return;

  isLoading.value = true;
  try {
    // Fetch reference data
    await fetchReferenceData();

    // Fetch existing user data
    const response = await getUser{Category}({
      filter: `idpengguna=${userId}`,
      limit: 999
    });

    if (response.data && Array.isArray(response.data)) {
      const data = response.data[0]?.data || response.data;
      itemList.value = data.map(item => ({
        ...item,
        _tempId: Date.now() + Math.random()
      }));
    }

    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error loading data:", error);
    toast.error("Gagal memuat data {category}");
  } finally {
    isLoading.value = false;
  }
}

async function fetchReferenceData() {
  try {
    const response = await get{Category}Reference({
      limit: 999,
      sort: "nama{category}",
      dir: "asc"
    });

    if (response.data && Array.isArray(response.data)) {
      referenceOptions.value = response.data[0]?.data || response.data;
    }
  } catch (error) {
    console.error("Error fetching reference:", error);
  }
}

function addItem() {
  const newItem = {
    _tempId: Date.now() + Math.random(),
    id{category}: "",
    tglmulai: "",
    tglselesai: "",
    filesk: null,
    status: "Tidak Aktif",
    _fileskFile: null
  };

  itemList.value.push(newItem);
  formErrors.value.push({});
}

function removeItem(index) {
  itemList.value.splice(index, 1);
  formErrors.value.splice(index, 1);
}

function handleStatusChange(index, isChecked) {
  if (isChecked) {
    // Set all others to "Tidak Aktif"
    itemList.value.forEach((item, i) => {
      item.status = i === index ? "Aktif" : "Tidak Aktif";
    });

    toast.info("Status aktif hanya boleh satu. Status lainnya diatur ke tidak aktif.");
  } else {
    itemList.value[index].status = "Tidak Aktif";
  }
}

function handleFileUpload(index, event) {
  const file = event.target.files[0];
  if (!file) return;

  // Store file reference
  itemList.value[index]._fileskFile = file;
  itemList.value[index].filesk = file.name;
}

async function validate() {
  // Optional steps always return true
  return true;
}

defineExpose({ validate, loadData });
</script>

<style scoped>
/* Add transition animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
```

---

## 🔧 Implementasi Spesifik Per Step

### Step 2: Unit Kerja

**Form Fields:**

```vue
<div class="col-md-12">
  <label class="form-label fw-semibold">
    Unit Kerja <span class="text-danger">*</span>
  </label>
  <select
    class="form-select"
    v-model="item.idunitkerja"
    :class="{ 'is-invalid': getError(index, 'idunitkerja') }"
  >
    <option value="" disabled>Pilih Unit Kerja</option>
    <option
      v-for="unit in unitKerjaOptions"
      :key="unit.idunitkerja"
      :value="unit.idunitkerja"
    >
      {{ unit.namaunitkerja }}
    </option>
  </select>
</div>

<div class="col-md-6">
  <label class="form-label fw-semibold">
    Tanggal Mulai <span class="text-danger">*</span>
  </label>
  <input
    type="date"
    class="form-control"
    v-model="item.tglmulai"
  />
</div>

<div class="col-md-6">
  <label class="form-label fw-semibold">Tanggal Selesai</label>
  <input
    type="date"
    class="form-control"
    v-model="item.tglselesai"
  />
  <div class="form-text small">
    Kosongkan jika masih aktif menjabat.
  </div>
</div>

<div class="col-md-6">
  <label class="form-label fw-semibold">File SK</label>
  <input
    type="file"
    class="form-control"
    @change="handleFileUpload(index, $event)"
    accept=".pdf,.jpg,.jpeg,.png"
  />
</div>
```

**Data Structure:**

```javascript
{
  idpenggunaunitkerja: null,
  idpengguna: null,
  idunitkerja: "",
  tglmulai: "",
  tglselesai: "",
  filesk: null,
  status: "Tidak Aktif",
  _fileskFile: null,
  _tempId: Date.now()
}
```

---

### Step 3: Jabatan

**Form Fields:**

```vue
<div class="col-md-12">
  <label class="form-label fw-semibold">
    Jenjang Jabatan <span class="text-danger">*</span>
  </label>
  <select
    class="form-select"
    v-model="item.idjenjang"
  >
    <option value="" disabled>Pilih Jenjang</option>
    <option
      v-for="jenjang in jenjangOptions"
      :key="jenjang.idjenjang"
      :value="jenjang.idjenjang"
    >
      {{ jenjang.namajenjang }}
    </option>
  </select>
</div>

<!-- Same date and file fields as Unit Kerja -->
```

**Data Structure:**

```javascript
{
  idepnggunajenjang: null,
  idpengguna: null,
  idjenjang: "",
  tglmulai: "",
  tglselesai: "",
  filesk: null,
  status: "Tidak Aktif",
  _fileskFile: null,
  _tempId: Date.now()
}
```

---

### Step 4: Pangkat

**Form Fields:**

```vue
<div class="col-md-12">
  <label class="form-label fw-semibold">
    Pangkat <span class="text-danger">*</span>
  </label>
  <select
    class="form-select"
    v-model="item.idpangkat"
  >
    <option value="" disabled>Pilih Pangkat</option>
    <option
      v-for="pangkat in pangkatOptions"
      :key="pangkat.idpangkat"
      :value="pangkat.idpangkat"
    >
      {{ pangkat.namapangkat }}
    </option>
  </select>
</div>

<!-- Same date and file fields as Unit Kerja -->
```

**Data Structure:**

```javascript
{
  idpenggunapangkat: null,
  idpengguna: null,
  idpangkat: "",
  tglmulai: "",
  tglselesai: "",
  filesk: null,
  status: "Tidak Aktif",
  _fileskFile: null,
  _tempId: Date.now()
}
```

---

### Step 5: Pendidikan

**Form Fields:**

```vue
<div class="col-md-6">
  <label class="form-label fw-semibold">
    Jenjang Pendidikan <span class="text-danger">*</span>
  </label>
  <select
    class="form-select"
    v-model="item.idjenjangpendidikan"
  >
    <option value="" disabled>Pilih Jenjang</option>
    <option
      v-for="jenjang in jenjangPendidikanOptions"
      :key="jenjang.idjenjangpendidikan"
      :value="jenjang.idjenjangpendidikan"
    >
      {{ jenjang.namajenjang }}
    </option>
  </select>
</div>

<div class="col-md-6">
  <label class="form-label fw-semibold">Program Studi</label>
  <input
    type="text"
    class="form-control"
    v-model="item.programstudi"
    placeholder="Contoh: Teknik Informatika"
  />
</div>

<div class="col-md-6">
  <label class="form-label fw-semibold">Nama Perguruan Tinggi</label>
  <input
    type="text"
    class="form-control"
    v-model="item.namaperguruantinggi"
    placeholder="Contoh: Universitas Indonesia"
  />
</div>

<div class="col-md-6">
  <label class="form-label fw-semibold">Tahun Lulus</label>
  <input
    type="number"
    class="form-control"
    v-model="item.tahunlulus"
    placeholder="2020"
    min="1950"
    :max="new Date().getFullYear()"
  />
</div>
```

**Data Structure:**

```javascript
{
  idpenggunapendidikan: null,
  idpengguna: null,
  idjenjangpendidikan: "",
  programstudi: "",
  namaperguruantinggi: "",
  tahunlulus: "",
  _tempId: Date.now()
}
```

**Note:** Step 5 TIDAK memiliki:

- Status aktif/tidak aktif
- File upload
- Tanggal mulai/selesai

---

### Step 6: Pelatihan

**Form Fields:**

```vue
<div class="col-md-12">
  <label class="form-label fw-semibold">
    Nama Pelatihan <span class="text-danger">*</span>
  </label>
  <input
    type="text"
    class="form-control"
    v-model="item.namapelatihan"
    placeholder="Contoh: Pelatihan Leadership"
  />
</div>

<div class="col-md-6">
  <label class="form-label fw-semibold">Nama Penyelenggara</label>
  <input
    type="text"
    class="form-control"
    v-model="item.namapenyelenggara"
    placeholder="Contoh: LAN"
  />
</div>

<div class="col-md-6">
  <label class="form-label fw-semibold">File Sertifikat</label>
  <input
    type="file"
    class="form-control"
    @change="handleFileUpload(index, $event)"
    accept=".pdf,.jpg,.jpeg,.png"
  />
</div>

<div class="col-md-6">
  <label class="form-label fw-semibold">Tanggal Mulai</label>
  <input
    type="date"
    class="form-control"
    v-model="item.tglmulai"
  />
</div>

<div class="col-md-6">
  <label class="form-label fw-semibold">Tanggal Selesai</label>
  <input
    type="date"
    class="form-control"
    v-model="item.tglselesai"
  />
</div>

<!-- Status field -->
```

**Data Structure:**

```javascript
{
  idpenggunalatihan: null,
  idpengguna: null,
  namapelatihan: "",
  namapenyelenggara: "",
  filesertifikat: null,
  tglmulai: "",
  tglselesai: "",
  status: "Tidak Aktif",
  _filesertifikatFile: null,
  _tempId: Date.now()
}
```

---

### Step 7: Prestasi

**Form Fields:**

```vue
<div class="col-md-6">
  <label class="form-label fw-semibold">
    Skala Prestasi <span class="text-danger">*</span>
  </label>
  <select
    class="form-select"
    v-model="item.idskala"
  >
    <option value="" disabled>Pilih Skala</option>
    <option
      v-for="skala in skalaOptions"
      :key="skala.idskala"
      :value="skala.idskala"
    >
      {{ skala.namaskala }}
    </option>
  </select>
</div>

<div class="col-md-6">
  <label class="form-label fw-semibold">
    Nama Prestasi <span class="text-danger">*</span>
  </label>
  <input
    type="text"
    class="form-control"
    v-model="item.namaprestasi"
    placeholder="Contoh: Juara 1 Inovasi"
  />
</div>

<div class="col-md-6">
  <label class="form-label fw-semibold">Nama Penyelenggara</label>
  <input
    type="text"
    class="form-control"
    v-model="item.namapenyelenggara"
    placeholder="Contoh: Kementerian PANRB"
  />
</div>

<div class="col-md-6">
  <label class="form-label fw-semibold">File Sertifikat</label>
  <input
    type="file"
    class="form-control"
    @change="handleFileUpload(index, $event)"
    accept=".pdf,.jpg,.jpeg,.png"
  />
</div>

<!-- Status field -->
```

**Data Structure:**

```javascript
{
  idpenggunaprestasi: null,
  idpengguna: null,
  idskala: "",
  namaprestasi: "",
  namapenyelenggara: "",
  filesertifikat: null,
  status: "Tidak Aktif",
  _filesertifikatFile: null,
  _tempId: Date.now()
}
```

---

## 🎨 CSS Animations

Tambahkan ke setiap step component:

```css
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.card {
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

---

## ✅ Checklist Implementasi

Gunakan checklist ini untuk setiap step:

### Step 2: Unit Kerja

- [ ] Template dasar dari template umum
- [ ] Form fields sesuai struktur data
- [ ] Fetch reference data (unit kerja)
- [ ] Load user data saat `loadData()` dipanggil
- [ ] Handle file upload untuk SK
- [ ] Enforce single active status
- [ ] Watch dan emit changes
- [ ] Expose validate dan loadData
- [ ] Test add/remove items
- [ ] Test status switching

### Step 3: Jabatan

- [ ] Same as Step 2 (ganti kategori)

### Step 4: Pangkat

- [ ] Same as Step 2 (ganti kategori)

### Step 5: Pendidikan

- [ ] Template dasar (TANPA status dan file)
- [ ] Form fields tanpa status
- [ ] Tidak ada file upload
- [ ] Load data pendidikan
- [ ] Watch dan emit changes

### Step 6: Pelatihan

- [ ] Template dasar
- [ ] Form fields dengan nama pelatihan (bukan dropdown)
- [ ] File upload untuk sertifikat
- [ ] Tanggal mulai dan selesai
- [ ] Single active status

### Step 7: Prestasi

- [ ] Template dasar
- [ ] Form fields dengan skala dropdown
- [ ] Nama prestasi dan penyelenggara
- [ ] File upload untuk sertifikat
- [ ] Single active status

---

## 🐛 Common Pitfalls & Solutions

### 1. Data tidak ter-update ke parent

**Problem:** Perubahan di child tidak terdeteksi di parent

**Solution:**

```javascript
// Pastikan watch menggunakan deep: true
watch(
  [itemList],
  () => {
    emit("update:modelValue", { data: itemList.value });
  },
  { deep: true }
);
```

### 2. File upload tidak ter-attach

**Problem:** File tidak ikut saat submit

**Solution:**

```javascript
// Simpan File object di property dengan prefix _
item._fileskFile = file;

// Jangan simpan file langsung di item.filesk
// item.filesk hanya untuk nama file atau URL existing
```

### 3. Status aktif lebih dari satu

**Problem:** User bisa set multiple status aktif

**Solution:**

```javascript
function handleStatusChange(index, isChecked) {
  if (isChecked) {
    // PAKSA semua jadi tidak aktif kecuali yang dipilih
    itemList.value.forEach((item, i) => {
      item.status = i === index ? "Aktif" : "Tidak Aktif";
    });
  }
}
```

### 4. loadData dipanggil berkali-kali

**Problem:** Data di-load multiple kali

**Solution:**

```javascript
const isDataLoaded = ref(false);

async function loadData(userId) {
  if (isDataLoaded.value) return; // Guard clause

  // ... load data

  isDataLoaded.value = true;
}
```

---

## 📚 Resources

- **Vue 3 Docs:** https://vuejs.org/
- **Form Wizard:** https://www.npmjs.com/package/vue3-form-wizard
- **Toast:** https://www.npmjs.com/package/vue-toastification

---

**Last Updated:** 2025-11-28  
**Version:** 1.0
