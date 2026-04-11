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
      id="periodeForm"
    >
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Periode</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.nama_periode"
          :class="{
            'is-invalid': formErrors.nama_periode,
            shake: isShaking && formErrors.nama_periode,
            'is-valid': !formErrors.nama_periode && wasValidated,
          }"
          placeholder="Masukkan nama periode"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.nama_periode">
            {{ formErrors.nama_periode }}
          </div>
        </transition>
      </div>

      <!-- Koordinat -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Koordinat</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.koordinat"
          placeholder="Contoh: -6.200000, 106.816666"
        />
      </div>

      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
        <i class="bi bi-x-circle me-2"></i>{{ errorMessage }}
      </div>
    </form>
  </BaseFormModal>
</template>

<script setup>
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import { addPeriode, updatePeriode } from "@/services/referensi/periode";
import { reactive, ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";

const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Data" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  nama_periode: "",
  koordinat: "",
});
const formErrors = reactive({
  nama_periode: "",
  koordinat: "",
});
const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);

const validationSchema = yup.object().shape({
  nama_periode: yup.string().required("Nama periode wajib diisi."),
  koordinat: yup.string().nullable(),
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
      formData.nama_periode = newData.nama_periode;
      formData.koordinat = newData.koordinat || "";
    } else {
      formData.nama_periode = "";
      formData.koordinat = "";
    }
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;
  },
  { immediate: true },
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

useRealtimeValidation({ formData, formErrors, wasValidated, validationSchema });

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
  if (!isValid) {
    isShaking.value = true;
    setTimeout(() => (isShaking.value = false), 300);
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[nama_periode]", formData.nama_periode);
  data.append("record[koordinat]", formData.koordinat || "");

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_periode;
      data.append("_method", "PUT");
      await updatePeriode(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addPeriode(data);
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

.shake {
  animation: shake 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.fade-error-enter-active,
.fade-error-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-error-enter-from,
.fade-error-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
