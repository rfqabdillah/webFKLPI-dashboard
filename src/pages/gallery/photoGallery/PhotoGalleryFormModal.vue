<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" id="photoGalleryForm">
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Galeri</label>
        <select
          class="form-select"
          v-model="formData.idgaleri"
          :class="{ 'is-invalid': formErrors.idgaleri }"
          required
        >
          <option value="" disabled>Pilih Galeri</option>
          <option 
            v-for="item in galleryOptions" 
            :key="item.idgaleri" 
            :value="item.idgaleri"
          >
            {{ item.judul }} </option>
        </select>
        <div class="invalid-feedback">
          {{ formErrors.idgaleri }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Upload Foto</label>
        <input
          type="file"
          class="form-control"
          @change="handlePhotoUpload"
          accept="image/*"
          :class="{ 'is-invalid': formErrors.foto }"
          :required="!isEditMode"
          ref="fileInput" 
        /> 
        <div class="invalid-feedback">{{ formErrors.foto }}</div>
        <small v-if="isEditMode" class="form-text text-muted"
          >Kosongkan jika tidak ingin mengubah foto.</small
        >

        <div class="mt-3" v-if="photoPreviewUrl || (isEditMode && formData.foto)">
          <label class="form-label fw-semibold d-block">Preview Foto</label>
          
          <div class="position-relative d-inline-block">
            
            <img
              :src="photoPreviewUrl || formData.foto"
              alt="Preview Foto"
              class="img-thumbnail shadow-sm"
              style="max-width: 200px; max-height: 200px; object-fit: contain; background-color: #f8f9fa;"
            />

            <button 
              type="button" 
              class="btn btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style="width: 28px; height: 28px; padding: 0; border: 2px solid white;"
              @click="removePhoto"
              title="Hapus Foto"
            >
              <i class="fa fa-times" style="font-size: 14px;"></i>
            </button>
            
          </div>
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
import { getGallery } from '@/services/general/website/gallery/gallery';
import { addPhotoGallery, updatePhotoGallery } from "@/services/general/website/gallery/photoGallery";
import { reactive, ref, computed, watch, onUnmounted, onMounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { compressImage } from '@/utils/imageCompressor'; 

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Foto Galeri" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const galleryOptions = ref([]); 
const formData = reactive({
  idgaleri: "",
  foto: null, 
});
const formErrors = reactive({
  idgaleri: "",
  foto: "",
});

const selectedPhotoFile = ref(null); 
const photoPreviewUrl = ref(null); 
const isLoading = ref(false);
const errorMessage = ref(null);
const fileInput = ref(null);
const isPhotoRemoved = ref(false);

// === Skema Validasi ===
const validationSchema = yup.object().shape({
  idgaleri: yup.string().required("Galeri wajib dipilih."),
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

// === Methods ===
async function fetchGalleries() {
  try {
    const response = await getGallery({ limit: 100 });
    if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].data) {
        galleryOptions.value = response.data[0].data;
    } 
    else if (response.data && response.data.data) {
        galleryOptions.value = response.data.data;
    } 
    else {
        galleryOptions.value = response.data;
    }

  } catch (error) {
    console.error("Gagal mengambil data galeri", error);
    toast.error("Gagal memuat daftar galeri.");
  }
}

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
      formData.idgaleri = newData.idgaleri;
      formData.foto = newData.foto; 
    } else {
      formData.idgaleri = "";
      formData.foto = null;
    }

    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    errorMessage.value = null;
  },
  { immediate: true }
);

// === Lifecycle Hooks ===
onMounted(() => {
  fetchGalleries();
});

onUnmounted(() => {
  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }
});

// === Methods Form Actions ===
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
    photoPreviewUrl.value = isEditMode.value ? formData.foto : null; 
    if (input) input.value = null; 
  };

  if (!file) {
    resetToOriginal();
    formErrors.foto = ''; 
    return;
  }

  if (!file.type.startsWith("image/")) {
    toast.error("File yang diupload harus berupa gambar.");
    resetToOriginal();
    formErrors.foto = "Format file tidak didukung.";
    return;
  }

  try {
    isLoading.value = true; 
    toast.info("Sedang mengompres gambar...", { timeout: 2000 }); 

    const compressedFile = await compressImage(file);
    selectedPhotoFile.value = compressedFile; 
    photoPreviewUrl.value = URL.createObjectURL(compressedFile); 
    
    formErrors.foto = ''; 
    isPhotoRemoved.value = false; 
  } catch (error) {
    toast.error("Gagal memproses gambar: " + error.message);
    resetToOriginal();
    formErrors.foto = "Gagal memproses gambar.";
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

  if (isEditMode.value && formData.foto) {
    if (!isBlobPreview) {
      photoPreviewUrl.value = null;   
      formData.foto = null; 
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
    formErrors.foto = "Foto wajib diupload saat menambah data baru.";
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
  // Sesuai struktur record: idgaleri
  data.append("record[idgaleri]", formData.idgaleri);

  // Handle file upload
  // Menggunakan 'upload_foto' (asumsi nama field upload di backend sesuai kolom DB 'foto')
  if (selectedPhotoFile.value) {
    data.append(
      "upload_foto", 
      selectedPhotoFile.value,
      selectedPhotoFile.value.name 
    );
  } else if (isPhotoRemoved.value) {
    data.append("record[foto]", ""); // Kosongkan kolom foto jika dihapus
  }

  try {
    if (isEditMode.value) {
      // Menggunakan Primary Key: idgalerifoto
      const fieldId = props.fieldToEdit.idgalerifoto;
      data.append("_method", "PUT");
      await updatePhotoGallery(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addPhotoGallery(data);
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