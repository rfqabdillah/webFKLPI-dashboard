<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate :class="{ 'was-validated': wasValidated }" id="vocationalForm">
        
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Kategori Jenjang</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.namajenjangkategori"
          :class="{
            'is-invalid': formErrors.namajenjangkategori,
            'is-valid': !formErrors.namajenjangkategori && wasValidated
          }"
          placeholder="Masukkan nama jenjang kategori"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.namajenjangkategori }}
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
import { addLevelCategory, updateLevelCategory } from "@/services/referensi/levelCategories";
import { reactive, ref, computed, watch } from "vue";
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
  namajenjangkategori: "",

});
const formErrors = reactive({
  namajenjangkategori: "",

});
const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);

const validationSchema = yup.object().shape({
  namajenjangkategori: yup
    .string()
    .required("Nama jenjang kategori wajib diisi."),
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
      formData.namajenjangkategori = newData.namajenjangkategori;
    } else {
      formData.namajenjangkategori = "";
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
  data.append("record[namajenjangkategori]", formData.namajenjangkategori);

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idjenjangkategori;
      data.append("_method", "PUT");
      await updateLevelCategory(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addLevelCategory(data);
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