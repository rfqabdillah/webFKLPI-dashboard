<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate :class="{ 'was-validated': wasValidated }" id="subfieldForm">
        
      <div class="mb-3">
        <label class="form-label fw-semibold">Induk Kejuruan</label>
        <select
          class="form-control form-select"
          v-model="formData.idkejuruan"
          :class="{
            'is-invalid': formErrors.idkejuruan,
            'is-valid': !formErrors.idkejuruan && wasValidated
          }"
          :disabled="isDropdownLoading"
          required
        >
          <option value="" disabled>
            {{ isDropdownLoading ? 'Memuat data...' : 'Pilih kejuruan' }}
          </option>
          <option 
            v-for="field in vocationalFieldsOptions" 
            :key="field.idkejuruan" 
            :value="field.idkejuruan"
          >
            {{ field.namakejuruan }} ({{ field.kodekejuruan }})
          </option>
        </select>
        <div class="invalid-feedback">
          {{ formErrors.idkejuruan }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Kode Subkejuruan</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.kodesubkejuruan"
          :class="{
            'is-invalid': formErrors.kodesubkejuruan,
            'is-valid': !formErrors.kodesubkejuruan && wasValidated
          }"
          placeholder="Masukkan kode subkejuruan"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.kodesubkejuruan }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Subkejuruan</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.namasubkejuruan"
          :class="{
            'is-invalid': formErrors.namasubkejuruan,
            'is-valid': !formErrors.namasubkejuruan && wasValidated
          }"
          placeholder="Masukkan nama subkejuruan"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.namasubkejuruan }}
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
// Import API untuk subfield
import { addVocationalSubfield, updateVocationalSubfield } from "@/services/referensi/vocationalSubfields";
// Import API untuk mengambil data kejuruan (parent)
import { getVocationalFields } from "@/services/referensi/vocationalFields"; 
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
  idkejuruan: "",
  kodesubkejuruan: "",
  namasubkejuruan: "",
});
const formErrors = reactive({
  idkejuruan: "",
  kodesubkejuruan: "",
  namasubkejuruan: "",
});
const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);

// State untuk dropdown
const vocationalFieldsOptions = ref([]);
const isDropdownLoading = ref(false);

// Skema validasi baru
const validationSchema = yup.object().shape({
  // idkejuruan: yup
  //   .string() // atau .number() jika nilainya angka
  //   .required("Induk kejuruan wajib dipilih."),
  kodesubkejuruan: yup
    .string()
    .required("Kode subkejuruan wajib diisi."),
  namasubkejuruan: yup
    .string()
    .required("Nama subkejuruan wajib diisi."),
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

// === Lifecycle Hook ===
onMounted(() => {
  fetchVocationalFieldsDropdown();
});

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    if (newData) {
      // Sesuaikan dengan nama field dari data subkejuruan
      formData.idkejuruan = newData.idkejuruan;
      formData.kodesubkejuruan = newData.kodesubkejuruan;
      formData.namasubkejuruan = newData.namasubkejuruan;
    } else {
      formData.idkejuruan = "";
      formData.kodesubkejuruan = "";
      formData.namasubkejuruan = "";
    }
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;
  },
  { immediate: true }
);

// === Methods ===

// Fungsi baru untuk mengambil data dropdown
async function fetchVocationalFieldsDropdown() {
  isDropdownLoading.value = true;
  try {
    // Ambil semua data kejuruan (limit 999 atau -1, tergantung API Anda)
    const params = { limit: 999 }; 
    const res = await getVocationalFields(params);
    const responseData = Array.isArray(res.data) ? res.data[0] : res.data;
    vocationalFieldsOptions.value = responseData?.data || [];
  } catch (err) {
    toast.error("Gagal memuat data kejuruan.");
  } finally {
    isDropdownLoading.value = false;
  }
}

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

// Fungsi submit yang diperbarui
async function submitForm() {
  wasValidated.value = true;

  const isValid = await validateForm();
  if (!isValid) return;

  isLoading.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[idkejuruan]", formData.idkejuruan);
  data.append("record[kodesubkejuruan]", formData.kodesubkejuruan);
  data.append("record[namasubkejuruan]", formData.namasubkejuruan);

  try {
    if (isEditMode.value) {
      // Pastikan Anda menggunakan Primary Key yang benar untuk SUBKEJURUAN
      // Saya asumsikan 'idsubkejuruan'
      const fieldId = props.fieldToEdit.idsubkejuruan; 
      data.append("_method", "PUT");
      await updateVocationalSubfield(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addVocationalSubfield(data);
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