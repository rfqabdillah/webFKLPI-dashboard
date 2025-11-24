<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate :class="{ 'was-validated': wasValidated }" id="vocationalForm">
      
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Unit Kerja</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.namaunitkerja"
          :class="{
            'is-invalid': formErrors.namaunitkerja,
            'is-valid': !formErrors.namaunitkerja && wasValidated
          }"
          placeholder="Masukkan nama unit kerja"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.namaunitkerja }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Alamat Unit Kerja</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.alamatunitkerja"
          :class="{
            'is-invalid': formErrors.alamatunitkerja,
            'is-valid': !formErrors.alamatunitkerja && wasValidated
          }"
          placeholder="Masukkan alamat unit kerja"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.alamatunitkerja }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Provinsi</label>
        <select
          class="form-select"
          v-model="formData.kodepropinsi"
          :class="{
            'is-invalid': formErrors.kodepropinsi,
            'is-valid': !formErrors.kodepropinsi && wasValidated
          }"
          :disabled="regionsLoading" 
          required
        >
          <option value="" disabled>
            {{ regionsLoading ? 'Memuat...' : 'Pilih Provinsi' }}
          </option>
          
          <template v-if="!regionsLoading">
            <option 
              v-for="prov in provinceOptions" 
              :key="prov.idwilayah" 
              :value="prov.kodewilayah"
            >
              {{ prov.kodewilayah }} - {{ prov.namawilayah }}
            </option>
          </template>
        </select>
        <div class="invalid-feedback">
          {{ formErrors.kodepropinsi }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Kabupaten</label>
        <select
          class="form-select"
          v-model="formData.kodekabupaten"
          :class="{
            'is-invalid': formErrors.kodekabupaten,
            'is-valid': !formErrors.kodekabupaten && wasValidated
          }"
          :disabled="!formData.kodepropinsi || regionsLoading"
          required
        >
          <option value="" disabled>
            {{ 
              regionsLoading 
                ? 'Memuat...' 
                : (formData.kodepropinsi ? 'Pilih Kabupaten' : 'Silakan pilih Provinsi terlebih dahulu') 
            }}
          </option>
          
          <template v-if="!regionsLoading">
            <option 
              v-for="kab in kabupatenOptions" 
              :key="kab.idwilayah" 
              :value="kab.kodewilayah"
            >
              {{ kab.kodewilayah }} - {{ kab.namawilayah }}
            </option>
          </template>
        </select>
        
        <div class="invalid-feedback">
          {{ formErrors.kodekabupaten }}
        </div>
      </div>

      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
        <i class="bi bi-x-circle me-2"></i>{{ errorMessage }}
      </div>
    </form>
  </BaseFormModal>
</template>

<script setup>
import BaseFormModal from "@/components/base/BaseFormModal.vue"; 
import { addWorkUnit, updateWorkUnit } from "@/services/referensi/workUnits";
import { getRegions } from "@/services/referensi/regions"; 
import { reactive, ref, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";

const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: 'Data' }
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  namaunitkerja: "",
  alamatunitkerja: "",
  kodepropinsi: "",
  kodekabupaten: "",
});

const formErrors = reactive({
  namaunitkerja: "",
  alamatunitkerja: "",
  kodepropinsi: "",
  kodekabupaten: "",
});

const isLoading = ref(false);       
const regionsLoading = ref(false);  
const errorMessage = ref(null);
const wasValidated = ref(false);

// State untuk menyimpan Master Data Wilayah (Semua Halaman digabung)
const allRegions = ref([]); 

const validationSchema = yup.object().shape({
  namaunitkerja: yup.string().required("Nama unit kerja wajib diisi."),
  alamatunitkerja: yup.string().required("Alamat unit kerja wajib diisi."),
  kodepropinsi: yup.string().required("Provinsi wajib dipilih."),
  kodekabupaten: yup.string().required("Kabupaten wajib dipilih."),
});

// === Method ===
async function fetchRegions() {
  regionsLoading.value = true;
  try {
    const params = { 
      page: 1, 
      limit: 100, 
      sort: 'kodewilayah', 
      dir: 'asc' 
    };
    
    const response = await getRegions(params);
    
    let accumulatedData = [];
    let lastPage = 1;
    if (Array.isArray(response.data) && response.data.length > 0) {
      const rootData = response.data[0]; 
      
      if (rootData.data) {
        accumulatedData = rootData.data;
      }
      
      if (rootData.meta && rootData.meta.pagination) {
        lastPage = rootData.meta.pagination.last_page;
      }
    }

    if (lastPage > 1) {
      const promises = [];
      for (let i = 2; i <= lastPage; i++) {
          promises.push(getRegions({ ...params, page: i }));
      }

      const results = await Promise.all(promises);

      results.forEach(res => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            accumulatedData = accumulatedData.concat(res.data[0].data);
          }
      });
    }
    allRegions.value = accumulatedData;

  } catch (error) {
    console.error("Gagal memuat data wilayah:", error); 
    toast.error("Gagal memuat daftar wilayah lengkap.");
  } finally {
    regionsLoading.value = false;
  }
}

// === Lifecycle ===
onMounted(() => {
  fetchRegions();
});

// === Computed Options ===
const isEditMode = computed(() => !!props.fieldToEdit);

const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

// Filter Tipe A (Provinsi)
const provinceOptions = computed(() => {
  return allRegions.value
    .filter(r => r.tipewilayah === 'A')
    .sort((a, b) => a.kodewilayah.localeCompare(b.kodewilayah, undefined, { numeric: true }));
});

// Filter Tipe B (Kabupaten) sesuai Provinsi terpilih
const kabupatenOptions = computed(() => {
  if (!formData.kodepropinsi) return [];
  
  return allRegions.value
    .filter(r => {
      return r.tipewilayah === 'B' && r.kodewilayah.startsWith(formData.kodepropinsi + '.');
    })
    .sort((a, b) => a.kodewilayah.localeCompare(b.kodewilayah, undefined, { numeric: true }));
});

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    if (newData) {
      formData.namaunitkerja = newData.namaunitkerja;
      formData.alamatunitkerja = newData.alamatunitkerja;
      formData.kodepropinsi = newData.kodepropinsi;
      formData.kodekabupaten = newData.kodekabupaten;
    } else {
      formData.namaunitkerja = "";
      formData.alamatunitkerja = "";
      formData.kodepropinsi = "";
      formData.kodekabupaten = "";
    }
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;
  },
  { immediate: true }
);

watch(
  () => formData.kodepropinsi,
  (newProv) => {
    if (!newProv) {
      formData.kodekabupaten = "";
      return;
    }
    if (formData.kodekabupaten && !formData.kodekabupaten.startsWith(newProv)) {
      formData.kodekabupaten = "";
    }
  }
);

// === Methods Submit & Close ===
function closeModal() {
  emit("close");
}

function handleError(error) {
  errorMessage.value =
    error.response?.data?.failed ||
    error.response?.data?.message ||
    "Gagal menyimpan data. Silakan coba lagi.";
  toast.error(errorMessage.value);
}

async function validateForm() {
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    return true;
  } catch (err) {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    err.inner.forEach((e) => {
      formErrors[e.path] = e.message;
    });
    return false;
  }
}

async function submitForm() {
  wasValidated.value = true;
  const isValid = await validateForm();
  if (!isValid) return;

  isLoading.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[namaunitkerja]", formData.namaunitkerja);
  data.append("record[alamatunitkerja]", formData.alamatunitkerja);
  data.append("record[kodepropinsi]", formData.kodepropinsi);
  data.append("record[kodekabupaten]", formData.kodekabupaten);

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idunitkerja;
      data.append("_method", "PUT");
      await updateWorkUnit(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addWorkUnit(data);
      toast.success(`Data ${props.entityName} berhasil ditambah`);
    }
    emit("save-successful");
    closeModal();
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.invalid-feedback {
  display: block;
}
</style>