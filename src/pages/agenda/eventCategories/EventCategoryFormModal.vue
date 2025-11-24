<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate :class="{ 'was-validated': wasValidated }" id="agendaCategoryForm">
      
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Kategori (Bahasa)</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.namakategoriagenda"
          :class="{ 'is-invalid': formErrors.namakategoriagenda }"
          placeholder="Masukkan nama kategori"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.namakategoriagenda }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Kategori (English)</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.namakategoriagenda_en"
          :class="{ 'is-invalid': formErrors.namakategoriagenda_en }"
          placeholder="Masukkan nama kategori (English)"
        />
        <div class="invalid-feedback">
          {{ formErrors.namakategoriagenda_en }}
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
import { addEventCategory, updateEventCategory } from "@/services/general/events/eventsCategories"; 
import { reactive, ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: 'Data' }
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  namakategoriagenda: "",
  namakategoriagenda_en: "",
});

const formErrors = reactive({
  namakategoriagenda: "",
  namakategoriagenda_en: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  namakategoriagenda: yup
    .string()
    .required("Nama kategori (Bahasa) wajib diisi."),
  namakategoriagenda_en: yup
    .string()
    .nullable(),
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
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;

    if (newData) {
      formData.namakategoriagenda = newData.namakategoriagenda;
      formData.namakategoriagenda_en = newData.namakategoriagenda_en;
    } else {
      formData.namakategoriagenda = "";
      formData.namakategoriagenda_en = "";
    }
  },
  { immediate: true, deep: true }
);

function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')      
    .replace(/[^\w-]+/g, '')  
    .replace(/--+/g, '-');    
}

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

  const generatedSlug = slugify(formData.namakategoriagenda);

  const data = new FormData();
  data.append("record[namakategoriagenda]", formData.namakategoriagenda);
  data.append("record[namakategoriagenda_en]", formData.namakategoriagenda_en || "");
  data.append("record[slug]", generatedSlug); 

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idakategoriagenda; 
      data.append("_method", "PUT");
      await updateEventCategory(fieldId, data); 
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addEventCategory(data); 
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
.form-text {
  font-size: 0.875em;
}
</style>