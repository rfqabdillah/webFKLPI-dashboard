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
      id="relatedLinkForm"
    >
      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-semibold">Nama Link (Bahasa)</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.nama"
              :class="{
                'is-invalid': formErrors.nama,
                shake: isShaking && formErrors.nama,
              }"
              placeholder="Masukkan nama link"
              required
            />
            <transition name="fade-error">
              <div class="invalid-feedback" v-if="formErrors.nama">
                {{ formErrors.nama }}
              </div>
            </transition>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Nama Link (English)</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.nama_en"
              :class="{
                'is-invalid': formErrors.nama_en,
                shake: isShaking && formErrors.nama_en,
              }"
              placeholder="Masukkan nama link (English)"
            />
            <transition name="fade-error">
              <div class="invalid-feedback" v-if="formErrors.nama_en">
                {{ formErrors.nama_en }}
              </div>
            </transition>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">URL Link</label>
            <input
              type="url"
              class="form-control"
              v-model="formData.link"
              :class="{
                'is-invalid': formErrors.link,
                shake: isShaking && formErrors.link,
              }"
              placeholder="https://contoh.com"
              required
            />
            <transition name="fade-error">
              <div class="invalid-feedback" v-if="formErrors.link">
                {{ formErrors.link }}
              </div>
            </transition>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Target Link</label>
            <select
              class="form-select"
              v-model="formData.target"
              :class="{
                'is-invalid': formErrors.target,
                shake: isShaking && formErrors.target,
              }"
              required
            >
              <option value="_blank">Tab Baru (_blank)</option>
              <option value="_self">Tab Ini (_self)</option>
            </select>
            <transition name="fade-error">
              <div class="invalid-feedback" v-if="formErrors.target">
                {{ formErrors.target }}
              </div>
            </transition>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Status Tayang</label>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="tayangSwitch"
                v-model="formData.tayang"
                true-value="Tayang"
                false-value="Draft"
                :class="{
                  'is-invalid': formErrors.tayang,
                  shake: isShaking && formErrors.tayang,
                }"
              />
              <label class="form-check-label" for="tayangSwitch">
                {{ formData.tayang === "Tayang" ? "Tayang" : "Draft" }}
              </label>
            </div>
            <transition name="fade-error">
              <div class="invalid-feedback" v-if="formErrors.tayang">
                {{ formErrors.tayang }}
              </div>
            </transition>
          </div>
        </div>

        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-semibold">Upload Logo</label>
            <input
              type="file"
              class="form-control"
              @change="handleLogoUpload"
              accept="image/png, image/jpeg, image/jpg"
              :class="{
                'is-invalid': formErrors.logo,
                shake: isShaking && formErrors.logo,
              }"
              ref="fileInput"
            />
            <div class="form-text">
              Otomatis kompres. Format: .jpg, .jpeg, .png.
              <span v-if="isEditMode && fieldToEdit && fieldToEdit.logo" class="d-block">
                *Kosongkan jika tidak ingin mengubah logo.
              </span>
            </div>
            <transition name="fade-error">
              <div class="invalid-feedback" v-if="formErrors.logo">
                {{ formErrors.logo }}
              </div>
            </transition>

            <div v-if="logoPreviewUrl" class="mt-3">
              <label class="form-label fw-semibold">Preview Logo</label>
              <div>
                <img
                  :src="logoPreviewUrl"
                  alt="Preview Logo"
                  class="img-thumbnail"
                  style="max-height: 100px; max-width: 100%"
                />
              </div>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger mt-2"
                @click="removeLogo"
              >
                Hapus/Batal
              </button>
            </div>
          </div>
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
  addLinkTerkait,
  updateLinkTerkait,
} from "@/services/general/website/linkTerkait";
import { reactive, ref, computed, watch, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { compressImage } from "@/utils/imageCompressor";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";

const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Link Terkait" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  nama: "",
  nama_en: "",
  link: "",
  logo: null,
  target: "_blank",
  tayang: "Draft",
});
const formErrors = reactive({
  nama: "",
  nama_en: "",
  link: "",
  logo: "",
  target: "",
  tayang: "",
});
const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);

const logoPreviewUrl = ref(null);
const fileInput = ref(null);
const isLogoRemoved = ref(false);

const validationSchema = yup.object().shape({
  nama: yup.string().required("Nama link wajib diisi."),
  nama_en: yup.string().nullable(),
  link: yup
    .string()
    .url("Format URL tidak valid")
    .required("URL link wajib diisi."),
  logo: yup
    .mixed()
    .nullable()
    .test(
      "fileType",
      "Format file tidak didukung (Hanya .jpg, .jpeg, .png)",
      (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      },
    ),
  target: yup
    .string()
    .oneOf(["_self", "_blank"], "Target tidak valid.")
    .required("Target link wajib diisi."),
  tayang: yup
    .string()
    .oneOf(["Tayang", "Draft"], "Status tidak valid.")
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
    isLogoRemoved.value = false;

    if (logoPreviewUrl.value && logoPreviewUrl.value.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreviewUrl.value);
    }

    if (newData) {
      formData.nama = newData.nama;
      formData.nama_en = newData.nama_en;
      formData.link = newData.link;
      formData.logo = null;
      formData.target = newData.target;
      formData.tayang = newData.tayang;
      logoPreviewUrl.value = newData.logo;
    } else {
      formData.nama = "";
      formData.nama_en = "";
      formData.link = "";
      formData.logo = null;
      formData.target = "_blank";
      formData.tayang = "Draft";
      logoPreviewUrl.value = null;
    }

    if (fileInput.value) {
      fileInput.value.value = null;
    }
  },
  { immediate: true },
);

// === Hook Lifecycle ===
onUnmounted(() => {
  if (logoPreviewUrl.value && logoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(logoPreviewUrl.value);
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

async function handleLogoUpload(event) {
  const file = event.target.files[0];
  const input = event.target;

  if (logoPreviewUrl.value && logoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(logoPreviewUrl.value);
  }

  const resetToOriginal = () => {
    formData.logo = null;
    logoPreviewUrl.value = isEditMode.value ? props.fieldToEdit.logo : null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    formErrors.logo = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    toast.error("File yang diupload harus berupa gambar.");
    resetToOriginal();
    formErrors.logo = "Format file tidak didukung.";
    return;
  }

  try {
    isLoading.value = true;
    toast.info("Sedang mengompres logo...", { timeout: 2000 });

    const compressedFile = await compressImage(file);
    formData.logo = compressedFile;
    logoPreviewUrl.value = URL.createObjectURL(compressedFile);
    formErrors.logo = "";
    isLogoRemoved.value = false;
  } catch (error) {
    toast.error("Gagal memproses logo: " + error.message);
    resetToOriginal();
    formErrors.logo = "Gagal memproses logo.";
  } finally {
    isLoading.value = false;
  }
}

function removeLogo() {
  if (logoPreviewUrl.value && logoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(logoPreviewUrl.value);
  }

  if (fileInput.value) {
    fileInput.value.value = null;
  }
  formData.logo = null;

  if (isEditMode.value && props.fieldToEdit.logo) {
    const isBlobPreview =
      logoPreviewUrl.value && logoPreviewUrl.value.startsWith("blob:");

    if (!isBlobPreview) {
      logoPreviewUrl.value = null;
      isLogoRemoved.value = true;
    } else {
      logoPreviewUrl.value = props.fieldToEdit.logo;
      isLogoRemoved.value = false;
    }
  } else {
    logoPreviewUrl.value = null;
    isLogoRemoved.value = false;
  }
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
  data.append("record[nama]", formData.nama);
  data.append("record[nama_en]", formData.nama_en || "");
  data.append("record[link]", formData.link);
  data.append("record[target]", formData.target);
  data.append("record[tayang]", formData.tayang);

  if (formData.logo) {
    data.append("upload_logo", formData.logo);
  } else if (isLogoRemoved.value) {
    data.append("record[logo]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_link_terkait;
      data.append("_method", "PUT");
      await updateLinkTerkait(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addLinkTerkait(data);
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
.img-thumbnail {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  object-fit: contain;
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
