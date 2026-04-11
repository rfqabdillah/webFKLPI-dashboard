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
      id="agendaCategoryForm"
    >
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Kategori (Bahasa)</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.nama_kategori_berita"
          :class="{
            'is-invalid': formErrors.nama_kategori_berita,
            'is-valid': wasValidated && !formErrors.nama_kategori_berita,
            shake: isShaking && formErrors.nama_kategori_berita,
          }"
          placeholder="Masukkan nama kategori"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.nama_kategori_berita">
            {{ formErrors.nama_kategori_berita }}
          </div>
        </transition>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Slug (Otomatis)</label>
        <input
          type="text"
          class="form-control bg-light"
          v-model="formData.slug"
          disabled
          readonly
          placeholder="Slug akan muncul otomatis"
        />
        <div class="form-text">Slug dibuat otomatis dari nama kategori.</div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Kategori (English)</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.nama_kategori_berita_en"
          :class="{
            'is-invalid': formErrors.nama_kategori_berita_en,
            'is-valid':
              wasValidated &&
              !formErrors.nama_kategori_berita_en &&
              formData.nama_kategori_berita_en !== '',
          }"
          placeholder="Masukkan nama kategori (English)"
        />
        <div class="invalid-feedback">
          {{ formErrors.nama_kategori_berita_en }}
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
import {
  addKategoriBerita,
  updateKategoriBerita,
} from "@/services/referensi/kategoriBerita";

import { reactive, ref, computed, watch, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Data" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  nama_kategori_berita: "",
  nama_kategori_berita_en: "",
  slug: "",
});

const formErrors = reactive({});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);
const slugDebounceTimer = ref(null);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  nama_kategori_berita: yup
    .string()
    .required("Nama kategori (Bahasa) wajib diisi."),
  nama_kategori_berita_en: yup.string().nullable(),
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
    Object.keys(formErrors).forEach((key) => delete formErrors[key]);
    wasValidated.value = false;
    errorMessage.value = null;

    if (newData) {
      formData.nama_kategori_berita = newData.nama_kategori_berita
        ? newData.nama_kategori_berita.trim()
        : "";
      formData.nama_kategori_berita_en = newData.nama_kategori_berita_en
        ? newData.nama_kategori_berita_en.trim()
        : "";
      formData.slug = newData.slug ? newData.slug.trim() : "";
    } else {
      formData.nama_kategori_berita = "";
      formData.nama_kategori_berita_en = "";
      formData.slug = "";
    }
  },
  { immediate: true, deep: true },
);

watch(
  () => formData.nama_kategori_berita,
  (newVal) => {
    if (slugDebounceTimer.value) {
      clearTimeout(slugDebounceTimer.value);
    }
    slugDebounceTimer.value = setTimeout(() => {
      formData.slug = slugify(newVal);
    }, 500);
  },
);

function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

onUnmounted(() => {
  if (slugDebounceTimer.value) {
    clearTimeout(slugDebounceTimer.value);
  }
});

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
  Object.keys(formErrors).forEach((key) => delete formErrors[key]);
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    return true;
  } catch (err) {
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

  isLoading.value = true;
  errorMessage.value = null;

  formData.slug = slugify(formData.nama_kategori_berita);

  const data = new FormData();
  data.append("record[nama_kategori_berita]", formData.nama_kategori_berita);
  data.append(
    "record[nama_kategori_berita_en]",
    formData.nama_kategori_berita_en || "",
  );
  data.append("record[slug]", formData.slug);

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_kategori_berita;
      data.append("_method", "PUT");
      await updateKategoriBerita(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addKategoriBerita(data);
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
  transition: opacity 0.3s ease;
}

.fade-error-enter-from,
.fade-error-leave-to {
  opacity: 0;
}
</style>
