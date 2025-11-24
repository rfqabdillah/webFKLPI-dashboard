<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate :class="{ 'was-validated': wasValidated }" id="wilayahForm">
      
      <div class="mb-4">
        <label class="form-label fw-semibold">Kode Wilayah</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.kodewilayah"
          :class="{ 'is-invalid': formErrors.kodewilayah }"
          placeholder="Contoh: 33"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.kodewilayah }}
        </div>
      </div>

      <div class="mb-4">
        <label class="form-label fw-semibold">Nama Wilayah</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.namawilayah"
          :class="{ 'is-invalid': formErrors.namawilayah }"
          placeholder="Contoh: Jawa Tengah"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.namawilayah }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Tipe Wilayah</label>
        
        <div class="input-group">
          <span class="input-group-text bg-light text-muted border-end-0">
            <i :class="tipeIcon"></i>
          </span>
          
          <input 
            type="text" 
            class="form-control bg-light text-muted border-start-0 fw-bold" 
            :value="tipeDisplay" 
            disabled
          />
        </div>
        
        <small class="text-muted fst-italic mt-1 d-block">
          *Tipe wilayah ditentukan otomatis oleh tab yang aktif.
        </small>

        <input type="hidden" v-model="formData.tipewilayah">
      </div>

      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0 d-flex align-items-center">
        <i class="fa-solid fa-circle-exclamation me-2"></i>
        <div>{{ errorMessage }}</div>
      </div>

    </form>
  </BaseFormModal>
</template>

<script setup>
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import { addRegion, updateRegion } from "@/services/referensi/regions";
import { reactive, ref, computed, watch, inject } from "vue"; 
import { useToast } from "vue-toastification";
import * as yup from "yup";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: 'Wilayah' },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// Mengambil nilai 'activeTabType' yang dikirim oleh RegionsTable.vue
const activeTabType = inject('activeTabType', ref('A'));

// === State ===
const formData = reactive({
  kodewilayah: "",
  namawilayah: "",
  tipewilayah: "",
});

const formErrors = reactive({
  kodewilayah: "",
  namawilayah: "",
  tipewilayah: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  kodewilayah: yup.string().required("Kode wilayah wajib diisi."),
  namawilayah: yup.string().required("Nama wilayah wajib diisi."),
  tipewilayah: yup.string().oneOf(['A', 'B']).required("Tipe wilayah error."), 
});

// === Computed Helpers ===
const isEditMode = computed(() => !!props.fieldToEdit);

const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

const tipeDisplay = computed(() => {
  if (formData.tipewilayah === 'A') return 'Provinsi';
  if (formData.tipewilayah === 'B') return 'Kabupaten';
  return '-';
});

const tipeIcon = computed(() => {
  if (formData.tipewilayah === 'A') return 'fa-solid fa-map-location-dot';
  if (formData.tipewilayah === 'B') return 'fa-solid fa-city';
  return 'fa-solid fa-question';
});

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;

    if (newData) {
      formData.kodewilayah = newData.kodewilayah;
      formData.namawilayah = newData.namawilayah;
      formData.tipewilayah = newData.tipewilayah;
    } else {
      formData.kodewilayah = "";
      formData.namawilayah = "";
      formData.tipewilayah = activeTabType.value; 
    }
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
  data.append("record[kodewilayah]", formData.kodewilayah);
  data.append("record[namawilayah]", formData.namawilayah);
  data.append("record[tipewilayah]", formData.tipewilayah); 

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idwilayah;
      data.append("_method", "PUT");
      await updateRegion(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addRegion(data);
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