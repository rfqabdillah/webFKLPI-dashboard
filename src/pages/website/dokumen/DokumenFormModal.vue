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
      id="dokumenForm"
    >
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Dokumen</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.nama_dokumen"
          :class="{
            'is-invalid': formErrors.nama_dokumen,
            shake: isShaking && formErrors.nama_dokumen,
          }"
          placeholder="Masukkan nama dokumen"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.nama_dokumen">
            {{ formErrors.nama_dokumen }}
          </div>
        </transition>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Organisasi</label>
          <BaseSearchSelect
            v-model="formData.id_organisasi"
            :api-fn="getOrganisasi"
            value-key="id_organisasi"
            label-key="nama_organisasi"
            filter-key="nama_organisasi"
            placeholder="Pilih Organisasi"
            search-placeholder="Ketik nama organisasi"
            :initial-label="initialOrganisasiLabel"
            :is-invalid="!!formErrors.id_organisasi"
            :shake="isShaking && !!formErrors.id_organisasi"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_organisasi">
              {{ formErrors.id_organisasi }}
            </div>
          </transition>
        </div>

        <div class="col-md-6 mb-3">
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

      <div class="mb-3">
        <label class="form-label fw-semibold">Deskripsi Dokumen</label>
        <textarea
          class="form-control"
          v-model="formData.deskripsi_dokumen"
          :class="{
            'is-invalid': formErrors.deskripsi_dokumen,
            shake: isShaking && formErrors.deskripsi_dokumen,
          }"
          placeholder="Masukkan deskripsi dokumen"
          rows="3"
        ></textarea>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.deskripsi_dokumen">
            {{ formErrors.deskripsi_dokumen }}
          </div>
        </transition>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Upload Gambar (Poster)</label>
        <input
          type="file"
          class="form-control"
          @change="handleImageUpload"
          accept="image/png, image/jpeg, image/jpg"
          :class="{
            'is-invalid': formErrors.gambar_dokumen,
            shake: isShaking && formErrors.gambar_dokumen,
          }"
          ref="imageFileInput"
          :disabled="isImageProcessing"
        />
        <div class="form-text">
          Otomatis kompres. Format: .jpg, .jpeg, .png.
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.gambar_dokumen"
            class="d-block"
          >
            *Kosongkan jika tidak ingin mengubah gambar.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.gambar_dokumen">
            {{ formErrors.gambar_dokumen }}
          </div>
        </transition>

        <div v-if="imagePreviewUrl" class="mt-3">
          <label class="form-label fw-semibold d-block">Preview Gambar</label>

          <div class="position-relative d-inline-block">
            <img
              :src="imagePreviewUrl"
              alt="Preview Gambar"
              class="img-thumbnail shadow-sm"
              style="
                max-height: 200px;
                max-width: 100%;
                object-fit: contain;
                background-color: #f8f9fa;
              "
            />
            <button
              type="button"
              class="btn btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style="
                width: 28px;
                height: 28px;
                padding: 0;
                border: 2px solid white;
              "
              @click="removeImage"
              title="Hapus Gambar"
              :disabled="isImageProcessing"
            >
              <i class="fa fa-times" style="font-size: 14px"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Upload File Dokumen (PDF)</label>
        <input
          type="file"
          class="form-control"
          @change="handleFileUpload"
          accept=".pdf"
          :class="{
            'is-invalid': formErrors.file_dokumen,
            shake: isShaking && formErrors.file_dokumen,
          }"
          ref="documentFileInput"
        />
        <div class="form-text">
          Maks 5MB. Format: .pdf
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.file_dokumen"
            class="d-block"
          >
            *Kosongkan jika tidak ingin mengubah file dokumen.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.file_dokumen">
            {{ formErrors.file_dokumen }}
          </div>
        </transition>

        <div v-if="documentPreviewName" class="mt-3">
          <label class="form-label fw-semibold">File Terpilih</label>

          <div class="position-relative d-inline-block w-100">
            <div
              class="alert alert-info py-2 pe-5 mb-0 d-flex align-items-center"
            >
              <i class="fa fa-file-pdf-o me-2 fs-5"></i>
              <span class="text-truncate">{{ documentPreviewName }}</span>
            </div>

            <button
              type="button"
              class="btn btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style="
                width: 24px;
                height: 24px;
                padding: 0;
                border: 2px solid white;
              "
              @click="removeFile"
              title="Hapus File"
            >
              <i class="fa fa-times" style="font-size: 12px"></i>
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
import BaseSearchSelect from "@/components/base/BaseSearchSelect.vue";
import { reactive, ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";
import { compressImage } from "@/utils/imageCompressor";
import { addDokumen, updateDokumen } from "@/services/general/website/dokumen";
import { getOrganisasi } from "@/services/general/organisasi/organisasi";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Dokumen" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  id_organisasi: "",
  nama_dokumen: "",
  deskripsi_dokumen: "",
  file_dokumen: null,
  gambar_dokumen: null,
  tayang: "Draft",
});

const formErrors = reactive({
  id_organisasi: "",
  nama_dokumen: "",
  deskripsi_dokumen: "",
  file_dokumen: "",
  gambar_dokumen: "",
  tayang: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);

const initialOrganisasiLabel = ref("");

const isImageProcessing = ref(false);

const imagePreviewUrl = ref(null);
const imageFileInput = ref(null);
const isImageRemoved = ref(false);

const documentPreviewName = ref(null);
const documentFileInput = ref(null);
const isFileRemoved = ref(false);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  id_organisasi: yup.string().required("Organisasi wajib dipilih."),
  nama_dokumen: yup.string().required("Nama dokumen wajib diisi."),
  deskripsi_dokumen: yup.string().nullable(),
  gambar_dokumen: yup
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
  file_dokumen: yup
    .mixed()
    .nullable()
    .test("fileType", "Format file tidak didukung (Hanya .pdf)", (value) => {
      if (!value) return true;
      return ["application/pdf"].includes(value.type);
    })
    .test("fileSize", "Ukuran file terlalu besar (Maks 5MB)", (value) => {
      if (!value) return true;
      return value.size <= 5242880; // 5MB
    }),
  tayang: yup
    .string()
    .oneOf(["Tayang", "Draft"], "Status tidak valid.")
    .required("Status tayang wajib diisi."),
});

// === Helper ===
function getFilenameFromUrl(url) {
  if (!url) return null;
  try {
    const path = new URL(url).pathname;
    const filename = path.substring(path.lastIndexOf("/") + 1);
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

// === Fetch Dropdown Options ===
async function fetchOrganisasi() {
  isLoadingOrganisasi.value = true;
  try {
    const res = await getOrganisasi({ per_page: 500 });
    const responseBody = res.data?.[0] || {};
    organisasiOptions.value = responseBody.data || [];
  } catch (err) {
    console.error("Gagal memuat organisasi:", err);
    toast.error("Gagal memuat data organisasi.");
  } finally {
    isLoadingOrganisasi.value = false;
  }
}

onMounted(() => {
  fetchOrganisasi();
});

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;
    isImageRemoved.value = false;
    isFileRemoved.value = false;

    if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl.value);
    }

    if (newData) {
      formData.id_organisasi = newData.id_organisasi;
      initialOrganisasiLabel.value = newData.fklpi?.nama_organisasi || newData.organisasi?.nama_organisasi || newData.nama_organisasi || "";
      formData.nama_dokumen = newData.nama_dokumen;
      formData.deskripsi_dokumen = newData.deskripsi_dokumen;
      formData.file_dokumen = null;
      formData.gambar_dokumen = null;
      formData.tayang = newData.tayang;

      imagePreviewUrl.value = newData.gambar_dokumen;
      documentPreviewName.value = getFilenameFromUrl(newData.file_dokumen);
    } else {
      formData.id_organisasi = "";
      initialOrganisasiLabel.value = "";
      formData.nama_dokumen = "";
      formData.deskripsi_dokumen = "";
      formData.file_dokumen = null;
      formData.gambar_dokumen = null;
      formData.tayang = "Draft";

      imagePreviewUrl.value = null;
      documentPreviewName.value = null;
    }

    if (imageFileInput.value) imageFileInput.value.value = null;
    if (documentFileInput.value) documentFileInput.value.value = null;
  },
  { immediate: true, deep: true },
);

// === Hook Lifecycle ===
onUnmounted(() => {
  if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }
});

// === Methods ===
function closeModal() {
  if (!isImageProcessing.value) {
    emit("close");
  }
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  const input = event.target;

  if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }

  const resetToOriginal = () => {
    formData.gambar_dokumen = null;
    imagePreviewUrl.value = isEditMode.value
      ? props.fieldToEdit.gambar_dokumen
      : null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    formErrors.gambar_dokumen = "";
    return;
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Format file tidak didukung (Hanya .jpg, .jpeg, .png).");
    resetToOriginal();
    formErrors.gambar_dokumen = "Format file tidak didukung.";
    return;
  }

  try {
    isImageProcessing.value = true;
    toast.info("Sedang mengompres gambar...", { timeout: 1500 });

    const compressedFile = await compressImage(file);
    formData.gambar_dokumen = compressedFile;
    imagePreviewUrl.value = URL.createObjectURL(compressedFile);
    formErrors.gambar_dokumen = "";
    isImageRemoved.value = false;
  } catch (error) {
    toast.error("Gagal memproses gambar: " + error.message);
    resetToOriginal();
    formErrors.gambar_dokumen = "Gagal memproses gambar.";
  } finally {
    isImageProcessing.value = false;
  }
}

function removeImage() {
  if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }

  if (imageFileInput.value) {
    imageFileInput.value.value = null;
  }
  formData.gambar_dokumen = null;

  if (
    isEditMode.value &&
    props.fieldToEdit &&
    props.fieldToEdit.gambar_dokumen
  ) {
    const isBlobPreview =
      imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:");

    if (!isBlobPreview) {
      imagePreviewUrl.value = null;
      isImageRemoved.value = true;
    } else {
      imagePreviewUrl.value = props.fieldToEdit.gambar_dokumen;
      isImageRemoved.value = false;
    }
  } else {
    imagePreviewUrl.value = null;
    isImageRemoved.value = false;
  }
}

async function handleFileUpload(event) {
  const file = event.target.files[0];
  const input = event.target;

  const resetToOriginal = () => {
    formData.file_dokumen = null;
    documentPreviewName.value = isEditMode.value
      ? getFilenameFromUrl(props.fieldToEdit.file_dokumen)
      : null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    formErrors.file_dokumen = "";
    return;
  }

  if (file.type !== "application/pdf") {
    toast.error("Format file tidak didukung (Hanya .pdf).");
    resetToOriginal();
    formErrors.file_dokumen = "Format file tidak didukung.";
    return;
  }

  try {
    formData.file_dokumen = file;
    documentPreviewName.value = file.name;
    formErrors.file_dokumen = "";
    isFileRemoved.value = false;
  } catch (error) {
    toast.error("Gagal memproses dokumen: " + error.message);
    resetToOriginal();
    formErrors.file_dokumen = "Gagal memproses dokumen.";
  }
}

function removeFile() {
  if (documentFileInput.value) {
    documentFileInput.value.value = null;
  }
  formData.file_dokumen = null;

  if (isEditMode.value && props.fieldToEdit && props.fieldToEdit.file_dokumen) {
    const isNewFile =
      documentPreviewName.value &&
      documentPreviewName.value !==
        getFilenameFromUrl(props.fieldToEdit.file_dokumen);

    if (!isNewFile) {
      documentPreviewName.value = null;
      isFileRemoved.value = true;
    } else {
      documentPreviewName.value = getFilenameFromUrl(
        props.fieldToEdit.file_dokumen,
      );
      isFileRemoved.value = false;
    }
  } else {
    documentPreviewName.value = null;
    isFileRemoved.value = false;
  }
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
  data.append("record[id_organisasi]", formData.id_organisasi);
  data.append("record[nama_dokumen]", formData.nama_dokumen);
  data.append("record[deskripsi_dokumen]", formData.deskripsi_dokumen || "");
  data.append("record[tayang]", formData.tayang);

  if (formData.gambar_dokumen) {
    data.append("upload_gambar_dokumen", formData.gambar_dokumen);
  } else if (isImageRemoved.value) {
    data.append("record[gambar_dokumen]", "");
  }

  if (formData.file_dokumen) {
    data.append("upload_file_dokumen", formData.file_dokumen);
  } else if (isFileRemoved.value) {
    data.append("record[file_dokumen]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_dokumen;
      data.append("_method", "PUT");
      await updateDokumen(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addDokumen(data);
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
