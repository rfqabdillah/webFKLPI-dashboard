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
      id="wilayahForm"
    >
      <div class="mb-4">
        <label class="form-label fw-semibold">Kode Wilayah</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.kode_wilayah"
          :class="{
            'is-invalid': formErrors.kode_wilayah,
            shake: isShaking && formErrors.kode_wilayah,
          }"
          placeholder="Contoh: 33"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.kode_wilayah">
            {{ formErrors.kode_wilayah }}
          </div>
        </transition>
      </div>

      <div class="mb-4">
        <label class="form-label fw-semibold">Nama Wilayah</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.nama_wilayah"
          :class="{
            'is-invalid': formErrors.nama_wilayah,
            shake: isShaking && formErrors.nama_wilayah,
          }"
          placeholder="Contoh: Jawa Tengah"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.nama_wilayah">
            {{ formErrors.nama_wilayah }}
          </div>
        </transition>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Tipe Wilayah</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.tipe_wilayah"
          :class="{
            'is-invalid': formErrors.tipe_wilayah,
            shake: isShaking && formErrors.tipe_wilayah,
          }"
          placeholder="Contoh: A"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.tipe_wilayah">
            {{ formErrors.tipe_wilayah }}
          </div>
        </transition>
      </div>

      <div
        v-if="errorMessage"
        class="alert alert-danger mt-3 mb-0 d-flex align-items-center"
      >
        <i class="fa-solid fa-circle-exclamation me-2"></i>
        <div>{{ errorMessage }}</div>
      </div>
    </form>
  </BaseFormModal>
</template>

<script setup>
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import { addWilayah, updateWilayah } from "@/services/referensi/wilayah";
import { reactive, ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Wilayah" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  kode_wilayah: "",
  nama_wilayah: "",
  tipe_wilayah: "",
});

const formErrors = reactive({
  kode_wilayah: "",
  nama_wilayah: "",
  tipe_wilayah: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  kode_wilayah: yup.string().required("Kode wilayah wajib diisi."),
  nama_wilayah: yup.string().required("Nama wilayah wajib diisi."),
  tipe_wilayah: yup.string().required("Tipe wilayah wajib diisi."),
});

// === Computed Helpers ===
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
      formData.kode_wilayah = newData.kode_wilayah;
      formData.nama_wilayah = newData.nama_wilayah;
      formData.tipe_wilayah = newData.tipe_wilayah;
    } else {
      formData.kode_wilayah = "";
      formData.nama_wilayah = "";
      formData.tipe_wilayah = "";
    }
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
    setTimeout(() => {
      isShaking.value = false;
    }, 300);
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[kode_wilayah]", formData.kode_wilayah);
  data.append("record[nama_wilayah]", formData.nama_wilayah);
  data.append("record[tipe_wilayah]", formData.tipe_wilayah);

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_wilayah;
      data.append("_method", "PUT");
      await updateWilayah(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addWilayah(data);
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
