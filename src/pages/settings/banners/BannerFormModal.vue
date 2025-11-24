<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" id="bannerForm">
      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Judul (ID)</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.judul"
            :class="{ 'is-invalid': formErrors.judul }"
            placeholder="Masukkan judul (Bahasa Indonesia)"
            required
          />
          <div class="invalid-feedback">
            {{ formErrors.judul }}
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Judul (EN)</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.judul_en"
            :class="{ 'is-invalid': formErrors.judul_en }"
            placeholder="Masukkan judul (English)"
          />
          <div class="invalid-feedback">
            {{ formErrors.judul_en }}
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Subjudul (ID)</label>
          <textarea
            class="form-control"
            v-model="formData.subjudul"
            :class="{ 'is-invalid': formErrors.subjudul }"
            rows="3"
            placeholder="Masukkan subjudul (Bahasa Indonesia)"
          ></textarea>
          <div class="invalid-feedback">
            {{ formErrors.subjudul }}
          </div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Subjudul (EN)</label>
          <textarea
            class="form-control"
            v-model="formData.subjudul_en"
            :class="{ 'is-invalid': formErrors.subjudul_en }"
            rows="3"
            placeholder="Masukkan subjudul (English)"
          ></textarea>
          <div class="invalid-feedback">
            {{ formErrors.subjudul_en }}
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Upload Gambar</label>
        <input
          type="file"
          class="form-control"
          @change="handlePhotoUpload"
          accept="image/*"
          :class="{ 'is-invalid': formErrors.gambar }"
          :required="!isEditMode"
          ref="fileInput" 
        /> <div class="invalid-feedback">{{ formErrors.gambar }}</div>
        <small v-if="isEditMode" class="form-text text-muted"
          >Kosongkan jika tidak ingin mengubah gambar.</small
        >

        <div class="mt-3" v-if="photoPreviewUrl || (isEditMode && formData.gambar)">
          <label class="form-label fw-semibold d-block">Preview Gambar</label>
          
          <div class="position-relative d-inline-block">
            
            <img
              :src="photoPreviewUrl || formData.gambar"
              alt="Preview Gambar"
              class="img-thumbnail shadow-sm"
              style="max-width: 200px; max-height: 200px; object-fit: contain; background-color: #f8f9fa;"
            />

            <button 
              type="button" 
              class="btn btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style="width: 28px; height: 28px; padding: 0; border: 2px solid white;"
              @click="removePhoto"
              title="Hapus Gambar"
            >
              <i class="fa fa-times" style="font-size: 14px;"></i>
            </button>
            
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Status</label>
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckTayang"
            v-model="formData.tayang"
            true-value="Tayang"
            false-value="Draft"
            :class="{ 'is-invalid': formErrors.tayang }"
          />
          <label class="form-check-label" for="flexSwitchCheckTayang">
            {{ formData.tayang === "Tayang" ? "Tayang" : "Draft" }}
          </label>
        </div>
        <div class="invalid-feedback">
          {{ formErrors.tayang }}
        </div>
      </div>
      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
        {{ errorMessage }}
      </div>
    </form>
  </BaseFormModal>
</template>

<script setup>
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import { addBanner, updateBanner } from "@/services/general/website/settings/banners";
import { reactive, ref, computed, watch, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { compressImage } from '@/utils/imageCompressor'; 

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Banner" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  judul: "",
  judul_en: "",
  subjudul: "",
  subjudul_en: "",
  gambar: null, 
  tayang: "Draft",
});
const formErrors = reactive({
  judul: "",
  judul_en: "",
  subjudul: "",
  subjudul_en: "",
  gambar: "",
  tayang: "",
});

const selectedPhotoFile = ref(null); 
const photoPreviewUrl = ref(null); 
const isLoading = ref(false);
const errorMessage = ref(null);
const fileInput = ref(null);
const isPhotoRemoved = ref(false);

// === Skema Validasi ===
const validationSchema = yup.object().shape({
  judul: yup.string().required("Judul (ID) wajib diisi."),
  judul_en: yup.string(),
  subjudul: yup.string(),
  subjudul_en: yup.string(),
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
    selectedPhotoFile.value = null;
    if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith('blob:')) { 
      URL.revokeObjectURL(photoPreviewUrl.value);
    }
    photoPreviewUrl.value = null;

    isPhotoRemoved.value = false;
    if (fileInput.value) {
      fileInput.value.value = null;
    }

    if (newData) {
      formData.judul = newData.judul;
      formData.judul_en = newData.judul_en;
      formData.subjudul = newData.subjudul;
      formData.subjudul_en = newData.subjudul_en;
      formData.gambar = newData.gambar; 
      formData.tayang = newData.tayang; 
    } else {
      formData.judul = "";
      formData.judul_en = "";
      formData.subjudul = "";
      formData.subjudul_en = "";
      formData.gambar = null;
      formData.tayang = "Draft"; 
    }

    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    errorMessage.value = null;
  },
  { immediate: true }
);

// === Lifecycle Hooks ===
onUnmounted(() => {
  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(photoPreviewUrl.value);
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

async function handlePhotoUpload(event) {
  const file = event.target.files[0];
  const input = event.target; 

  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }

  const resetToOriginal = () => {
    selectedPhotoFile.value = null;
    photoPreviewUrl.value = isEditMode.value ? formData.gambar : null; 
    if (input) input.value = null; 
  };

  if (!file) {
    resetToOriginal();
    formErrors.gambar = ''; 
    return;
  }

  if (!file.type.startsWith("image/")) {
    toast.error("File yang diupload harus berupa gambar.");
    resetToOriginal();
    formErrors.gambar = "Format file tidak didukung.";
    return;
  }

  try {
    isLoading.value = true; 
    toast.info("Sedang mengompres gambar...", { timeout: 2000 }); 

    const compressedFile = await compressImage(file);
    selectedPhotoFile.value = compressedFile; 
    photoPreviewUrl.value = URL.createObjectURL(compressedFile); 
    
    formErrors.gambar = ''; 
    isPhotoRemoved.value = false; 
  } catch (error) {
    toast.error("Gagal memproses gambar: " + error.message);
    resetToOriginal();
    formErrors.gambar = "Gagal memproses gambar.";
  } finally {
    isLoading.value = false; 
  }
}


function removePhoto() {
  const isBlobPreview = photoPreviewUrl.value && photoPreviewUrl.value.startsWith('blob:');

  if (isBlobPreview) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }

  if (fileInput.value) {
    fileInput.value.value = null;
  }
  selectedPhotoFile.value = null; 

  if (isEditMode.value && formData.gambar) {
    if (!isBlobPreview) {
      photoPreviewUrl.value = null;   
      formData.gambar = null; 
      isPhotoRemoved.value = true; 
    } else {
      photoPreviewUrl.value = null; 
      isPhotoRemoved.value = false; 
    }
  } else {
    photoPreviewUrl.value = null;
    isPhotoRemoved.value = false;
  }
}

async function validateForm() {
  Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));

  let isYupValid = false;
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    isYupValid = true;
  } catch (err) {
    err.inner.forEach((e) => {
      formErrors[e.path] = e.message;
    });
  }

  let isFileValid = true;
  if (!isEditMode.value && !selectedPhotoFile.value) {
    formErrors.gambar = "Gambar wajib diisi saat menambah data baru.";
    isFileValid = false;
  }
  return isYupValid && isFileValid;
}

async function submitForm() {
  const isValid = await validateForm();
  if (!isValid) return;

  isLoading.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[judul]", formData.judul);
  data.append("record[judul_en]", formData.judul_en || "");
  data.append("record[subjudul]", formData.subjudul || "");
  data.append("record[subjudul_en]", formData.subjudul_en || "");
  data.append("record[tayang]", formData.tayang);

  if (selectedPhotoFile.value) {
    data.append(
      "upload_gambar",
      selectedPhotoFile.value,
      selectedPhotoFile.value.name 
    );
  } else if (isPhotoRemoved.value) {
    data.append("record[gambar]", ""); 
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idbanner;
      data.append("_method", "PUT");
      await updateBanner(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addBanner(data);
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