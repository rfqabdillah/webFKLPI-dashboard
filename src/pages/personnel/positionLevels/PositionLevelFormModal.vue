<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate :class="{ 'was-validated': wasValidated }" id="vocationalForm">
        
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Jenjang Jabatan</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.namajenjang"
          :class="{
            'is-invalid': formErrors.namajenjang,
            'is-valid': !formErrors.namajenjang && wasValidated
          }"
          placeholder="Masukkan nama jenjang jabatan"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.namajenjang }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Jenjang Kategori</label>
        <select
          class="form-select"
          v-model="formData.idjenjangkategori"
          :class="{ 'is-invalid': formErrors.idjenjangkategori }"
          required
          :disabled="categoriesLoading"
        >
          <option value="" disabled>Pilih kategori</option>
          <option v-if="categoriesLoading" value="" disabled>Memuat kategori...</option>
          <option v-for="category in levelCategories" :key="category.idjenjangkategori" :value="category.idjenjangkategori">
            {{ category.namajenjangkategori }}
          </option>
        </select>
        <div class="invalid-feedback">
          {{ formErrors.idjenjangkategori }}
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
import { getLevelCategories } from "@/services/referensi/levelCategories";
import { addPositionLevel, updatePositionLevel } from "@/services/referensi/positionLevels";
import { reactive, ref, computed, watch, onMounted} from "vue";
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
  namajenjang: "",
  idjenjangkategori: "",
});
const formErrors = reactive({
  namajenjang: "",
  idjenjangkategori: "",
});

const isLoading = ref(false);
const categoriesLoading = ref(false);
const levelCategories = ref([]); 
const errorMessage = ref(null);
const wasValidated = ref(false);

const validationSchema = yup.object().shape({
  namajenjang: yup
    .string()
    .required("Nama jenjang pendidikan wajib diisi."),
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    if (newData) {
      formData.namajenjang = newData.namajenjang;
      formData.idjenjangkategori = newData.idjenjangkategori;
    } else {
      formData.namajenjang = "";
      formData.idjenjangkategori = "";
    }
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;
  },
  { immediate: true }
);

// === Methods ===
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

async function fetchLevelCategories() {
  categoriesLoading.value = true;
  try {
    const params = { 
      page: 1, 
      limit: 999, 
      sort: 'namajenjangkategori', 
      dir: 'asc' 
    };
      const response = await getLevelCategories(params);
      levelCategories.value =  response.data?.[0]?.data 
    } catch (error) {
      console.error("Gagal memuat jenjang kategori:", error); 
      toast.error("Gagal memuat daftar jenjang kategori.");
    } finally {
      categoriesLoading.value = false;
    }
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
  data.append("record[namajenjang]", formData.namajenjang);
  data.append("record[idjenjangkategori]", formData.idjenjangkategori);

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idjenjang;
      data.append("_method", "PUT");
      await updatePositionLevel(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addPositionLevel(data);
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

onMounted(() => {
  fetchLevelCategories(); 
});
</script>

<style scoped>
.invalid-feedback {
  display: block;
}
</style>