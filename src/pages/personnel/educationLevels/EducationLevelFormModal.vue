<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate :class="{ 'was-validated': wasValidated }" id="vocationalForm">
        
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Jenjang Pendidikan</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.namajenjangpendidikan"
          :class="{
            'is-invalid': formErrors.namajenjangpendidikan,
            'is-valid': !formErrors.namajenjangpendidikan && wasValidated
          }"
          placeholder="Masukkan nama jenjang pendidikan"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.namajenjangpendidikan }}
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
import { addEducationLevel, updateEducationLevel } from "@/services/referensi/educationLevels";
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
  namajenjangpendidikan: "",
});
const formErrors = reactive({
  namajenjangpendidikan: "",
});
const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);

const validationSchema = yup.object().shape({
  namajenjangpendidikan: yup
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
      formData.namajenjangpendidikan = newData.namajenjangpendidikan;
    } else {
      formData.namajenjangpendidikan = "";
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
  data.append("record[namajenjangpendidikan]", formData.namajenjangpendidikan);

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idjenjangpendidikan;
      data.append("_method", "PUT");
      await updateEducationLevel(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addEducationLevel(data);
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