<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form
      @submit.prevent="submitForm"
      novalidate
      :class="{ 'was-validated': wasValidated }"
      id="genderForm"
    >
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Jenis Kelamin</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.namajeniskelamin"
          :class="{ 'is-invalid': formErrors.namajeniskelamin }"
          placeholder="Masukkan nama jenis kelamin"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.namajeniskelamin }}
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
import { addGender, updateGender } from "@/services/referensi/genders";
import { reactive, ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Data" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  namajeniskelamin: "",
});

const formErrors = reactive({
  namajeniskelamin: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  namajeniskelamin: yup.string().required("Nama jenis kelamin wajib diisi."),
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
      formData.namajeniskelamin = newData.namajeniskelamin;
    } else {
      formData.namajeniskelamin = "";
    }
  },
  { immediate: true, deep: true }
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
  data.append("record[namajeniskelamin]", formData.namajeniskelamin);

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idjeniskelamin;
      data.append("_method", "PUT");
      await updateGender(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addGender(data);
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
