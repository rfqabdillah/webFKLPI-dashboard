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
          v-model="formData.namakategoriberita"
          :class="{ 'is-invalid': formErrors.namakategoriberita }"
          placeholder="Masukkan nama kategori"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.namakategoriberita }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Kategori (English)</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.namakategoriberita_en"
          :class="{ 'is-invalid': formErrors.namakategoriberita_en }"
          placeholder="Masukkan nama kategori (English)"
        />
        <div class="invalid-feedback">
          {{ formErrors.namakategoriberita_en }}
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
import { addNewsCategory, updateNewsCategory } from "@/services/general/website/news/newsCategories"; 
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
  namakategoriberita: "",
  namakategoriberita_en: "",
});

const formErrors = reactive({
  namakategoriberita: "",
  namakategoriberita_en: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  namakategoriberita: yup
    .string()
    .required("Nama kategori (Bahasa) wajib diisi."),
  namakategoriberita_en: yup
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
      formData.namakategoriberita = newData.namakategoriberita;
      formData.namakategoriberita_en = newData.namakategoriberita_en;
    } else {
      formData.namakategoriberita = "";
      formData.namakategoriberita_en = "";
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

  const generatedSlug = slugify(formData.namakategoriberita);

  const data = new FormData();
  data.append("record[namakategoriberita]", formData.namakategoriberita);
  data.append("record[namakategoriberita_en]", formData.namakategoriberita_en || "");
  data.append("record[slug]", generatedSlug); 

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idkategoriberita; 
      data.append("_method", "PUT");
      await updateNewsCategory(fieldId, data); 
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addNewsCategory(data); 
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