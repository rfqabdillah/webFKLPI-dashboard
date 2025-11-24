<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate :class="{ 'was-validated': wasValidated }" id="measurementBookForm">
      
      <div class="mb-3">
        <label class="form-label fw-semibold">Judul (Bahasa)</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.judul"
          :class="{ 'is-invalid': formErrors.judul }"
          placeholder="Masukkan judul buku pengukuran"
          required
        />
        <div class="invalid-feedback">
          {{ formErrors.judul }}
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Judul (English)</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.judul_en"
          :class="{ 'is-invalid': formErrors.judul_en }"
          placeholder="Masukkan judul buku (English)"
        />
        <div class="invalid-feedback">
          {{ formErrors.judul_en }}
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label fw-semibold">Jenis Dokumen</label>
            <select
              class="form-select"
              v-model="formData.idjenisdokumen"
              :class="{ 'is-invalid': formErrors.idjenisdokumen }"
              required
              :disabled="typesLoading"
            >
              <option value="" disabled>Pilih kategori</option>
              <option v-if="typesLoading" value="" disabled>Memuat kategori...</option>
              <option v-for="documentType in documentTypesList" :key="documentType.idjenisdokumen" :value="documentType.idjenisdokumen">
                {{ documentType.namajenisdokumen }}
              </option>
            </select>
            <div class="invalid-feedback">
              {{ formErrors.idjenisdokumen }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Tahun</label>
            <input
              type="number"
              class="form-control"
              v-model="formData.tahun"
              :class="{ 'is-invalid': formErrors.tahun }"
              placeholder="Mis: 2024"
              required
            />
            <div class="invalid-feedback">
              {{ formErrors.tahun }}
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="row">
             <div class="col-6 mb-3">
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
                <div class="invalid-feedback">{{ formErrors.tayang }}</div>
            </div>
            <div class="col-6 mb-3">
                <label class="form-label fw-semibold">Status Flash</label>
                <div class="form-check form-switch mt-2">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    role="switch"
                    v-model="formData.flash" 
                    id="flashCheck"
                  >
                  <label class="form-check-label" for="flashCheck">
                    {{ formData.flash ? 'Aktif' : 'Nonaktif' }}
                  </label>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Deskripsi (Bahasa)</label>
          <textarea
            class="form-control"
            v-model="formData.deskripsi"
            :class="{ 'is-invalid': formErrors.deskripsi }"
            placeholder="Masukkan deskripsi singkat (Bahasa)"
            rows="3"
          ></textarea>
          <div class="invalid-feedback">{{ formErrors.deskripsi }}</div>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Deskripsi (English)</label>
          <textarea
            class="form-control"
            v-model="formData.deskripsi_en"
            :class="{ 'is-invalid': formErrors.deskripsi_en }"
            placeholder="Masukkan deskripsi singkat (English)"
            rows="3"
          ></textarea>
          <div class="invalid-feedback">{{ formErrors.deskripsi_en }}</div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Upload Poster (Gambar)</label>
        <input
          type="file"
          class="form-control"
          @change="handlePosterUpload"
          accept="image/png, image/jpeg, image/jpg"
          :class="{ 'is-invalid': formErrors.poster }"
          ref="posterFileInput" 
        />
        <div class="form-text">
          Otomatis kompres. Format: .jpg, .jpeg, .png.
          <span v-if="isEditMode && fieldToEdit.poster" class="d-block">
            *Kosongkan jika tidak ingin mengubah poster.
          </span>
        </div>
        <div class="invalid-feedback">
          {{ formErrors.poster }}
        </div>

        <div v-if="posterPreviewUrl" class="mt-3">
          <label class="form-label fw-semibold d-block">Preview Poster</label>
          
          <div class="position-relative d-inline-block">
            <img 
              :src="posterPreviewUrl" 
              alt="Preview Poster" 
              class="img-thumbnail shadow-sm" 
              style="max-height: 200px; max-width: 100%; object-fit: contain; background-color: #f8f9fa;"
            >
            <button 
              type="button" 
              class="btn btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style="width: 28px; height: 28px; padding: 0; border: 2px solid white;"
              @click="removePoster"
              title="Hapus Poster"
            >
              <i class="fa fa-times" style="font-size: 14px;"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Upload Dokumen (PDF)</label>
        <input
          type="file"
          class="form-control"
          @change="handleDocumentUpload"
          accept=".pdf"
          :class="{ 'is-invalid': formErrors.dokumen }"
          ref="documentFileInput" 
        />
        <div class="form-text">
          Maks 10MB. Format: .pdf
          <span v-if="isEditMode && fieldToEdit.dokumen" class="d-block">
            *Kosongkan jika tidak ingin mengubah dokumen.
          </span>
        </div>
        <div class="invalid-feedback">
          {{ formErrors.dokumen }}
        </div>

        <div v-if="documentPreviewName" class="mt-3">
          <label class="form-label fw-semibold">File Terpilih</label>
          
          <div class="position-relative d-inline-block w-100">
            <div class="alert alert-info py-2 pe-5 mb-0 d-flex align-items-center">
                <i class="fa fa-file-pdf-o me-2 fs-5"></i>
                <span class="text-truncate">{{ documentPreviewName }}</span>
            </div>

            <button 
                type="button" 
                class="btn btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                style="width: 24px; height: 24px; padding: 0; border: 2px solid white;"
                @click="removeDocument"
                title="Hapus Dokumen"
              >
                <i class="fa fa-times" style="font-size: 12px;"></i>
              </button>
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
import { reactive, ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { compressImage } from '@/utils/imageCompressor'; 
import { addMeasurementBook, updateMeasurementBook } from "@/services/general/website/measurementBooks/measurementBooks";
import { getDocumentTypes } from "@/services/general/website/documentTypes/documentTypes";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: 'Buku Pengukuran' } 
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  tahun: "",
  judul: "",
  judul_en: "",
  deskripsi: "",
  deskripsi_en: "",
  idjenisdokumen: "", 
  dokumen: null,
  poster: null,
  tayang: "Draft", 
  flash: false, 
});

const formErrors = reactive({
  tahun: "",
  judul: "",
  judul_en: "",
  deskripsi: "",
  deskripsi_en: "",
  idjenisdokumen: "",
  dokumen: "",
  poster: "",
  tayang: "",
  flash: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const documentTypesList = ref([]);
const typesLoading = ref(false); 

// State untuk file
const posterPreviewUrl = ref(null); 
const posterFileInput = ref(null); 
const isPosterRemoved = ref(false); 

const documentPreviewName = ref(null);
const documentFileInput = ref(null);
const isDocumentRemoved = ref(false);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  idjenisdokumen: yup
    .string()
    .required("Jenis dokumen wajib dipilih."),
  tahun: yup
    .number()
    .typeError("Tahun harus berupa angka")
    .required("Tahun wajib diisi.")
    .integer("Tahun harus bilangan bulat.")
    .min(1900, "Tahun tidak valid.")
    .max(new Date().getFullYear() + 5, "Tahun tidak valid."),
  judul: yup
    .string()
    .required("Judul wajib diisi."),
  judul_en: yup
    .string()
    .nullable(),
  deskripsi: yup
    .string()
    .nullable(),
  deskripsi_en: yup
    .string()
    .nullable(),
  poster: yup.mixed().nullable()
    .test("fileType", "Format file tidak didukung (Hanya .jpg, .jpeg, .png)", (value) => {
      if (!value) return true;
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
    }),
  dokumen: yup.mixed().nullable()
    .test("fileType", "Format file tidak didukung (Hanya .pdf)", (value) => {
      if (!value) return true;
      return ['application/pdf'].includes(value.type);
    })
    .test("fileSize", "Ukuran file terlalu besar (Maks 10MB)", (value) => {
      if (!value) return true; 
      return value.size <= 10485760; // 10MB
    }),
  tayang: yup
    .string()
    .oneOf(['Tayang', 'Draft'], "Status tidak valid.")
    .required("Status tayang wajib diisi."),
  flash: yup
    .boolean(),
});

// === Helper ===
function getFilenameFromUrl(url) {
  if (!url) return null;
  try {
    const path = new URL(url).pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    return decodeURIComponent(filename);
  } catch (e) {
    return url;
  }
}

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
    isPosterRemoved.value = false; 
    isDocumentRemoved.value = false;

    if (posterPreviewUrl.value && posterPreviewUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(posterPreviewUrl.value);
    }
    
    if (newData) {
      formData.tahun = newData.tahun;
      formData.judul = newData.judul;
      formData.judul_en = newData.judul_en;
      formData.deskripsi = newData.deskripsi;
      formData.deskripsi_en = newData.deskripsi_en;
      formData.idjenisdokumen = newData.idjenisdokumen;
      formData.dokumen = null;
      formData.poster = null; 
      formData.tayang = newData.tayang;
      formData.flash = newData.flash === '1' || newData.flash === true;
      
      posterPreviewUrl.value = newData.poster; 
      documentPreviewName.value = getFilenameFromUrl(newData.dokumen);
    } else {
      formData.tahun = "";
      formData.judul = "";
      formData.judul_en = "";
      formData.deskripsi = "";
      formData.deskripsi_en = "";
      formData.idjenisdokumen = "";
      formData.dokumen = null;
      formData.poster = null;
      formData.tayang = "Draft"; 
      formData.flash = false;
      
      posterPreviewUrl.value = null; 
      documentPreviewName.value = null;
    }

    if (posterFileInput.value) posterFileInput.value.value = null;
    if (documentFileInput.value) documentFileInput.value.value = null;
  },
  { immediate: true, deep: true }
);

// === Hook Lifecycle ===
onMounted(() => {
  fetchDocumentTypes();
});

onUnmounted(() => {
  if (posterPreviewUrl.value && posterPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(posterPreviewUrl.value);
  }
});

// === Methods ===
// 4. Fungsi Fetch Data
async function fetchDocumentTypes() {
  typesLoading.value = true;
  try {
    const params = { 
      page: 1, 
      limit: 999, 
      sort: 'namajenisdokumen', 
      dir: 'asc' 
    };
      const response = await getDocumentTypes(params);
      if (response.data && Array.isArray(response.data)) {
        if (response.data[0] && response.data[0].data) {
          documentTypesList.value = response.data[0].data;
        } else {
          documentTypesList.value = response.data;
        }
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        documentTypesList.value = response.data.data;
      } else {
        console.warn("Struktur data jenis dokumen tidak terduga:", response.data);
        documentTypesList.value = [];
      }
    } catch (error) {
      console.error("Gagal memuat jenis dokumen:", error); 
      toast.error("Gagal memuat daftar jenis dokumen.");
    } finally {
      typesLoading.value = false;
    }
}

function closeModal() {
  emit("close");
}

async function handlePosterUpload(event) {
  const file = event.target.files[0];
  const input = event.target; 
  if (posterPreviewUrl.value && posterPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(posterPreviewUrl.value);
  }
  const resetToOriginal = () => {
    formData.poster = null; 
    posterPreviewUrl.value = isEditMode.value ? props.fieldToEdit.poster : null; 
    if (input) input.value = null; 
  };
  if (!file) {
    resetToOriginal();
    formErrors.poster = ''; 
    return;
  }
  if (!file.type.startsWith("image/")) {
    toast.error("File yang diupload harus berupa gambar.");
    resetToOriginal();
    formErrors.poster = "Format file tidak didukung.";
    return;
  }
  try {
    isLoading.value = true; 
    toast.info("Sedang mengompres poster...", { timeout: 2000 }); 
    const compressedFile = await compressImage(file);
    formData.poster = compressedFile; 
    posterPreviewUrl.value = URL.createObjectURL(compressedFile);
    formErrors.poster = ''; 
    isPosterRemoved.value = false; 
  } catch (error) {
    toast.error("Gagal memproses poster: " + error.message);
    resetToOriginal();
    formErrors.poster = "Gagal memproses poster.";
  } finally {
    isLoading.value = false; 
  }
}

function removePoster() {
  if (posterPreviewUrl.value && posterPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(posterPreviewUrl.value);
  }
  if (posterFileInput.value) {
    posterFileInput.value.value = null;
  }
  formData.poster = null; 
  if (isEditMode.value && props.fieldToEdit.poster) {
    const isBlobPreview = posterPreviewUrl.value && posterPreviewUrl.value.startsWith('blob:');
    if (!isBlobPreview) {
      posterPreviewUrl.value = null;   
      isPosterRemoved.value = true; 
    } else {
      posterPreviewUrl.value = props.fieldToEdit.poster; 
      isPosterRemoved.value = false; 
    }
  } else {
    posterPreviewUrl.value = null;
    isPosterRemoved.value = false;
  }
}

async function handleDocumentUpload(event) {
  const file = event.target.files[0];
  const input = event.target; 

  const resetToOriginal = () => {
    formData.dokumen = null; 
    documentPreviewName.value = isEditMode.value ? getFilenameFromUrl(props.fieldToEdit.dokumen) : null; 
    if (input) input.value = null; 
  };

  if (!file) {
    resetToOriginal();
    formErrors.dokumen = ''; 
    return;
  }


  if (file.type !== 'application/pdf') {
    toast.error("Format file tidak didukung (Hanya .pdf).");
    resetToOriginal();
    formErrors.dokumen = "Format file tidak didukung.";
    return;
  }

  try {
    formData.dokumen = file; 
    documentPreviewName.value = file.name;
    formErrors.dokumen = ''; 
    isDocumentRemoved.value = false; 
  } catch (error) {
    toast.error("Gagal memproses dokumen: " + error.message);
    resetToOriginal();
    formErrors.dokumen = "Gagal memproses dokumen.";
  }
}

function removeDocument() {
  if (documentFileInput.value) {
    documentFileInput.value.value = null;
  }
  formData.dokumen = null; 

  if (isEditMode.value && props.fieldToEdit.dokumen) {
    const isNewFile = documentPreviewName.value && documentPreviewName.value !== getFilenameFromUrl(props.fieldToEdit.dokumen);
    
    if (!isNewFile) {
      documentPreviewName.value = null;   
      isDocumentRemoved.value = true; 
    } else {
      documentPreviewName.value = getFilenameFromUrl(props.fieldToEdit.dokumen); 
      isDocumentRemoved.value = false; 
    }
  } else {
    documentPreviewName.value = null;
    isDocumentRemoved.value = false;
  }
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
  data.append("record[tahun]", formData.tahun);
  data.append("record[judul]", formData.judul);
  data.append("record[judul_en]", formData.judul_en || "");
  data.append("record[deskripsi]", formData.deskripsi || "");
  data.append("record[deskripsi_en]", formData.deskripsi_en || "");
  data.append("record[tayang]", formData.tayang);
  data.append("record[flash]", formData.flash ? '1' : '0');
  data.append("record[idjenisdokumen]", formData.idjenisdokumen);

  if (formData.poster) {
    data.append("upload_poster", formData.poster); 
  } else if (isPosterRemoved.value) {
    data.append("record[poster]", "");
  }
  
  if (formData.dokumen) {
    data.append("upload_dokumen", formData.dokumen); 
  } else if (isDocumentRemoved.value) {
    data.append("record[dokumen]", "");
  }
  
  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.idbukupengukuran; 
      data.append("_method", "PUT");
      await updateMeasurementBook(fieldId, data); 
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addMeasurementBook(data); 
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
.img-thumbnail {
  background-color: #f8f9fa; 
  border: 1px solid #dee2e6;
  object-fit: contain; 
}
.alert-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>