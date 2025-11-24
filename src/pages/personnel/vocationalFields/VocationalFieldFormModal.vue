<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate :class="{ 'was-validated': wasValidated }" id="vocationalForm">
        
      <div class="mb-3">
        <label class="form-label fw-semibold">Kode Kejuruan</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.kodekejuruan"
          :class="{
            'is-invalid': formErrors.kodekejuruan,
            'is-valid': !formErrors.kodekejuruan && wasValidated
          }"
          placeholder="Masukkan kode kejuruan"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.kodekejuruan }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Kejuruan</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.namakejuruan"
          :class="{
            'is-invalid': formErrors.namakejuruan,
            'is-valid': !formErrors.namakejuruan && wasValidated
          }"
          placeholder="Masukkan nama kejuruan"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.namakejuruan }}
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
import { addVocationalField, updateVocationalField } from "@/services/referensi/vocationalFields";
import { reactive, ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";

// ---
// SEMUA LOGIKA <script setup> (props, emit, state, methods)
// DARI FILE ASLI ANDA TETAP SAMA DI SINI.
// Tidak perlu diubah sama sekali.
// ---

const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: 'Data' }
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  kodekejuruan: "",
  namakejuruan: "",
});
const formErrors = reactive({
  kodekejuruan: "",
  namakejuruan: "",
});
const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);

const validationSchema = yup.object().shape({
  kodekejuruan: yup
    .string()
    .required("Kode kejuruan wajib diisi."),
  namakejuruan: yup
    .string()
    .required("Nama kejuruan wajib diisi."),
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
      formData.kodekejuruan = newData.kodekejuruan;
      formData.namakejuruan = newData.namakejuruan;
    } else {
      formData.kodekejuruan = "";
      formData.namakejuruan = "";
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
  data.append("record[kodekejuruan]", formData.kodekejuruan);
  data.append("record[namakejuruan]", formData.namakejuruan);

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idkejuruan;
      data.append("_method", "PUT");
      await updateVocationalField(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addVocationalField(data);
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