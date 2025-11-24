<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" id="officialForm">
      
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Pejabat</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.nama"
          :class="{ 'is-invalid': formErrors.nama }"
          placeholder="Masukkan nama pejabat"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.nama }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Jabatan (ID)</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.jabatan"
          :class="{ 'is-invalid': formErrors.jabatan }"
          placeholder="Masukkan jabatan (Bahasa Indonesia)"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.jabatan }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Jabatan (EN)</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.jabatan_en"
          :class="{ 'is-invalid': formErrors.jabatan_en }"
          placeholder="Masukkan jabatan (English)"
        />
        <div class="invalid-feedback">
          {{ formErrors.jabatan_en }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Upload Foto</label>
        <input
          type="file"
          class="form-control"
          @change="handleFotoUpload"
          accept="image/*"
          :class="{ 'is-invalid': formErrors.foto }"
          :required="!isEditMode"
          ref="fileInput"
        />
        <div class="invalid-feedback">{{ formErrors.foto }}</div>
        <small v-if="isEditMode" class="form-text text-muted"
          >Kosongkan jika tidak ingin mengubah foto.</small
        >

        <div class="mt-3" v-if="fotoPreviewUrl || (isEditMode && formData.foto)">
          <label class="form-label fw-semibold d-block">Preview Foto</label>
          
          <div class="position-relative d-inline-block">
            
            <img
              :src="fotoPreviewUrl || formData.foto"
              alt="Preview Foto"
              class="img-thumbnail shadow-sm"
              style="max-width: 200px; max-height: 200px; object-fit: contain; background-color: #f8f9fa;"
            />

            <button 
              type="button" 
              class="btn btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style="width: 28px; height: 28px; padding: 0; border: 2px solid white;"
              @click="removeFoto"
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
import { addOfficial, updateOfficial } from "@/services/general/website/profiles/officials"; 
import { reactive, ref, computed, watch, onUnmounted } from "vue"; 
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { compressImage } from '@/utils/imageCompressor'; 

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Pejabat" }, 
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  nama: "",
  jabatan: "",
  jabatan_en: "",
  foto: null, 
});

const formErrors = reactive({
  nama: "",
  jabatan: "",
  jabatan_en: "",
  foto: "",
});

const selectedFotoFile = ref(null); 
const fotoPreviewUrl = ref(null); 
const isLoading = ref(false);
const errorMessage = ref(null);
const fileInput = ref(null);
const isFotoRemoved = ref(false);

// === Skema Validasi ===
const validationSchema = yup.object().shape({
  nama: yup.string().required("Nama pejabat wajib diisi."),
  jabatan: yup.string().required("Jabatan wajib diisi."),
  jabatan_en: yup.string().nullable(),
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
    selectedFotoFile.value = null;
    if (fotoPreviewUrl.value && fotoPreviewUrl.value.startsWith('blob:')) { 
      URL.revokeObjectURL(fotoPreviewUrl.value);
    }
    fotoPreviewUrl.value = null;

    isFotoRemoved.value = false;
    if (fileInput.value) {
      fileInput.value.value = null;
    }

    if (newData) {
      formData.nama = newData.nama;
      formData.jabatan = newData.jabatan;
      formData.jabatan_en = newData.jabatan_en;
      formData.foto = newData.foto; 
    } else {
      formData.nama = "";
      formData.jabatan = "";
      formData.jabatan_en = "";
      formData.foto = null;
    }

    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    errorMessage.value = null;
  },
  { immediate: true }
);

// === Lifecycle Hooks ===
onUnmounted(() => {
  if (fotoPreviewUrl.value && fotoPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(fotoPreviewUrl.value);
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

async function handleFotoUpload(event) {
  const file = event.target.files[0];
  const input = event.target; 

  if (fotoPreviewUrl.value && fotoPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(fotoPreviewUrl.value);
  }

  const resetToOriginal = () => {
    selectedFotoFile.value = null;
    fotoPreviewUrl.value = isEditMode.value ? formData.foto : null; 
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
    toast.info("Sedang mengompres foto...", { timeout: 2000 }); 

    const compressedFile = await compressImage(file);
    selectedFotoFile.value = compressedFile; 
    fotoPreviewUrl.value = URL.createObjectURL(compressedFile); 
    
    formErrors.foto = ''; 
    isFotoRemoved.value = false; 
  } catch (error) {
    toast.error("Gagal memproses foto: " + error.message);
    resetToOriginal();
    formErrors.foto = "Gagal memproses foto.";
  } finally {
    isLoading.value = false; 
  }
}

function removeFoto() {
  const isBlobPreview = fotoPreviewUrl.value && fotoPreviewUrl.value.startsWith('blob:');

  if (isBlobPreview) {
    URL.revokeObjectURL(fotoPreviewUrl.value);
  }

  if (fileInput.value) {
    fileInput.value.value = null;
  }
  selectedFotoFile.value = null; 

  if (isEditMode.value && formData.foto) {
    if (!isBlobPreview) {
      fotoPreviewUrl.value = null;    
      formData.foto = null; 
      isFotoRemoved.value = true; 
    } else {
      fotoPreviewUrl.value = null; 
      isFotoRemoved.value = false; 
    }
  } else {
    fotoPreviewUrl.value = null;
    isFotoRemoved.value = false;
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
  if (!isEditMode.value && !selectedFotoFile.value) {
    formErrors.foto = "Foto wajib diisi saat menambah data baru.";
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
  data.append("record[nama]", formData.nama);
  data.append("record[jabatan]", formData.jabatan);
  data.append("record[jabatan_en]", formData.jabatan_en || "");

  if (selectedFotoFile.value) {
    data.append(
      "upload_foto", 
      selectedFotoFile.value,
      selectedFotoFile.value.name 
    );
  } else if (isFotoRemoved.value) {
    data.append("record[foto]", ""); 
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idpejabat; 
      data.append("_method", "PUT");
      await updateOfficial(fieldId, data); 
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addOfficial(data); 
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
  object-fit: contain;
}
</style>