<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate :class="{ 'was-validated': wasValidated }" id="galleryForm">
      
      <div class="row">
        <div class="col-md-8">
          <div class="mb-3">
            <label class="form-label fw-semibold">Judul Galeri</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.judul"
              :class="{ 'is-invalid': formErrors.judul }"
              placeholder="Masukkan judul galeri"
              required
            />
            <div class="invalid-feedback">
              {{ formErrors.judul }}
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="mb-3">
            <label class="form-label fw-semibold">Status Tayang</label>
            <div class="form-check form-switch mt-2">
              <input 
                class="form-check-input" 
                type="checkbox" 
                role="switch" 
                id="tayangSwitch"
                v-model="formData.tayang"
                true-value="Tayang"
                false-value="Draft"
                :class="{ 'is-invalid': formErrors.tayang }"
              >
              <label class="form-check-label" for="tayangSwitch">
                {{ formData.tayang === 'Tayang' ? 'Tayang' : 'Draft' }}
              </label>
            </div>
            <div class="invalid-feedback">
              {{ formErrors.tayang }}
            </div>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Deskripsi</label>
        <textarea
          class="form-control"
          v-model="formData.deskripsi"
          :class="{ 'is-invalid': formErrors.deskripsi }"
          placeholder="Masukkan deskripsi galeri"
          rows="4"
        ></textarea>
        <div class="invalid-feedback">
          {{ formErrors.deskripsi }}
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
import { addGallery, updateGallery } from "@/services/general/website/gallery/gallery";
import { reactive, ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";

const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: 'Galeri' } 
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  judul: "",
  deskripsi: "",
  tayang: "Draft",
});

const formErrors = reactive({
  judul: "",
  deskripsi: "",
  tayang: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);

// === Skema Validasi ===
const validationSchema = yup.object().shape({
  judul: yup
    .string()
    .required("Judul wajib diisi."),
  deskripsi: yup
    .string()
    .nullable(),
  tayang: yup
    .string()
    .oneOf(['Tayang', 'Draft'], "Status tidak valid.")
    .required("Status tayang wajib diisi."),
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
      formData.judul = newData.judul;
      formData.deskripsi = newData.deskripsi;
      formData.tayang = newData.tayang;
    } else {
      formData.judul = "";
      formData.deskripsi = "";
      formData.tayang = "Draft";
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
  data.append("record[judul]", formData.judul);
  data.append("record[deskripsi]", formData.deskripsi || "");
  data.append("record[tayang]", formData.tayang);

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idgaleri; 
      data.append("_method", "PUT");
      
      await updateGallery(fieldId, data); 
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addGallery(data); 
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