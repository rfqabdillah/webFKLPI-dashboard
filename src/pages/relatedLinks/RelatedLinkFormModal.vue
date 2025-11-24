<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate :class="{ 'was-validated': wasValidated }" id="relatedLinkForm">
      
      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-semibold">Nama Link (Bahasa)</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.nama"
              :class="{ 'is-invalid': formErrors.nama }"
              placeholder="Masukkan nama link"
              required
            />
            <div class="invalid-feedback">
              {{ formErrors.nama }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Nama Link (English)</label>
            <input
              type="text"
              class="form-control"
              v-model="formData.nama_en"
              :class="{ 'is-invalid': formErrors.nama_en }"
              placeholder="Masukkan nama link (English)"
            />
            <div class="invalid-feedback">
              {{ formErrors.nama_en }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">URL Link</label>
            <input
              type="url"
              class="form-control"
              v-model="formData.link"
              :class="{ 'is-invalid': formErrors.link }"
              placeholder="https://contoh.com"
              required
            />
            <div class="invalid-feedback">
              {{ formErrors.link }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Target Link</label>
            <select
              class="form-select"
              v-model="formData.target"
              :class="{ 'is-invalid': formErrors.target }"
              required
            >
              <option value="_blank">Tab Baru (_blank)</option>
              <option value="_self">Tab Ini (_self)</option>
            </select>
            <div class="invalid-feedback">
              {{ formErrors.target }}
            </div>
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

        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-semibold">Upload Logo</label>
            <input
              type="file"
              class="form-control"
              @change="handleLogoUpload"
              accept="image/png, image/jpeg, image/jpg"
              :class="{ 'is-invalid': formErrors.logo }"
              ref="fileInput" />
            <div class="form-text">
              Otomatis kompres. Format: .jpg, .jpeg, .png.
              <span v-if="isEditMode && fieldToEdit.logo" class="d-block">
                *Kosongkan jika tidak ingin mengubah logo.
              </span>
            </div>
            <div class="invalid-feedback">
              {{ formErrors.logo }}
            </div>

            <div v-if="logoPreviewUrl" class="mt-3">
              <label class="form-label fw-semibold">Preview Logo</label>
              <div>
                <img 
                  :src="logoPreviewUrl" 
                  alt="Preview Logo" 
                  class="img-thumbnail" 
                  style="max-height: 100px; max-width: 100%;"
                >
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
import { addRelatedLink, updateRelatedLink } from '@/services/general/website/relatedLinks/relatedLinks';
import { reactive, ref, computed, watch, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { compressImage } from '@/utils/imageCompressor'; 

const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: 'Link Terkait' } 
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

const logoPreviewUrl = ref(null); 
const fileInput = ref(null); 
const isLogoRemoved = ref(false); 

const validationSchema = yup.object().shape({
  nama: yup
    .string()
    .required("Nama link wajib diisi."),
  nama_en: yup
    .string()
    .nullable(),
  link: yup
    .string()
    .url("Format URL tidak valid")
    .required("URL link wajib diisi."),
  logo: yup.mixed().nullable()
    .test("fileType", "Format file tidak didukung (Hanya .jpg, .jpeg, .png)", (value) => {
      if (!value) return true;
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
    }),
  target: yup
    .string()
    .oneOf(['_self', '_blank'], "Target tidak valid.")
    .required("Target link wajib diisi."),
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
    isLogoRemoved.value = false; 

    if (logoPreviewUrl.value && logoPreviewUrl.value.startsWith('blob:')) {
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
  { immediate: true }
);

// === Hook Lifecycle ===
onUnmounted(() => {
  if (logoPreviewUrl.value && logoPreviewUrl.value.startsWith('blob:')) {
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

  if (logoPreviewUrl.value && logoPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(logoPreviewUrl.value);
  }

  const resetToOriginal = () => {
    formData.logo = null; 
    logoPreviewUrl.value = isEditMode.value ? props.fieldToEdit.logo : null; 
    if (input) input.value = null; 
  };

  if (!file) {
    resetToOriginal();
    formErrors.logo = ''; 
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
    formErrors.logo = ''; 
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
  if (logoPreviewUrl.value && logoPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(logoPreviewUrl.value);
  }

  if (fileInput.value) {
    fileInput.value.value = null;
  }
  formData.logo = null; 

  if (isEditMode.value && props.fieldToEdit.logo) {
    const isBlobPreview = logoPreviewUrl.value && logoPreviewUrl.value.startsWith('blob:');

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
      const fieldId = props.fieldToEdit.idlinkterkait; 
      data.append("_method", "PUT");
      await updateRelatedLink(fieldId, data); 
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addRelatedLink(data); 
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
</style>