<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate :class="{ 'was-validated': wasValidated }" id="vocationalForm">
        
      <div class="mb-3">
        <label class="form-label fw-semibold">Pangkat</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.pangkat"
          :class="{
            'is-invalid': formErrors.pangkat,
            'is-valid': !formErrors.pangkat && wasValidated
          }"
          placeholder="Masukkan nama pangkat"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.pangkat }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Golongan</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.golongan"
          :class="{
            'is-invalid': formErrors.golongan,
            'is-valid': !formErrors.golongan && wasValidated
          }"
          placeholder="Masukkan jenis golongan"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.golongan }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Ruang</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.ruang"
          :class="{
            'is-invalid': formErrors.ruang,
            'is-valid': !formErrors.ruang && wasValidated
          }"
          placeholder="Masukkan jenis ruang"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.ruang }}
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
import { addRank, updateRank } from "@/services/referensi/ranks";
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
  pangkat: "",
  golongan: "",
  ruang: "",
});
const formErrors = reactive({
  pangkat: "",
  golongan: "",
  ruang: "",
});
const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);

const validationSchema = yup.object().shape({
  pangkat: yup
    .string()
    .required("Nama pangkat wajib diisi."),
  golongan: yup
    .string()
    .required("Jenis golongan wajib diisi."),
  ruang: yup
    .string()
    .required("Jenis ruang wajib diisi."),
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
      formData.pangkat = newData.pangkat;
      formData.golongan = newData.golongan;
      formData.ruang = newData.ruang;
    } else {
      formData.pangkat = "";
      formData.golongan = "";
      formData.ruang = "";
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
  data.append("record[pangkat]", formData.pangkat);
  data.append("record[golongan]", formData.golongan);
  data.append("record[ruang]", formData.ruang);

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idpangkat;
      data.append("_method", "PUT");
      await updateRank(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addRank(data);
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