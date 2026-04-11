<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" id="bannerForm">
      <div class="mb-3">
        <label class="form-label fw-semibold">Judul</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.judul"
          :class="{
            'is-invalid': formErrors.judul,
            shake: isShaking && formErrors.judul,
          }"
          placeholder="Masukkan judul banner"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.judul">
            {{ formErrors.judul }}
          </div>
        </transition>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Subjudul</label>
        <textarea
          class="form-control"
          v-model="formData.sub_judul"
          :class="{
            'is-invalid': formErrors.sub_judul,
            shake: isShaking && formErrors.sub_judul,
          }"
          rows="2"
          placeholder="Masukkan subjudul"
        ></textarea>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.sub_judul">
            {{ formErrors.sub_judul }}
          </div>
        </transition>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Deskripsi</label>
        <textarea
          class="form-control"
          v-model="formData.deskripsi"
          :class="{
            'is-invalid': formErrors.deskripsi,
            shake: isShaking && formErrors.deskripsi,
          }"
          rows="3"
          placeholder="Masukkan deskripsi banner"
        ></textarea>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.deskripsi">
            {{ formErrors.deskripsi }}
          </div>
        </transition>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">Upload Gambar</label>
        <input
          type="file"
          class="form-control"
          @change="handlePhotoUpload"
          accept="image/*"
          :class="{
            'is-invalid': formErrors.gambar,
            shake: isShaking && formErrors.gambar,
          }"
          :required="!isEditMode"
          ref="fileInput"
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.gambar">
            {{ formErrors.gambar }}
          </div>
        </transition>
        <small v-if="isEditMode" class="form-text text-muted"
          >Kosongkan jika tidak ingin mengubah gambar.</small
        >

        <div
          class="mt-3"
          v-if="photoPreviewUrl || (isEditMode && formData.gambar)"
        >
          <label class="form-label fw-semibold d-block">Preview Gambar</label>

          <div class="position-relative d-inline-block">
            <img
              :src="photoPreviewUrl || formData.gambar"
              alt="Preview Gambar"
              class="img-thumbnail shadow-sm"
              style="
                max-width: 200px;
                max-height: 200px;
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
              @click="removePhoto"
              title="Hapus Gambar"
            >
              <i class="fa fa-times" style="font-size: 14px"></i>
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
            :class="{
              'is-invalid': formErrors.tayang,
              shake: isShaking && formErrors.tayang,
            }"
          />
          <label class="form-check-label" for="flexSwitchCheckTayang">
            {{ formData.tayang === "Tayang" ? "Tayang" : "Draft" }}
          </label>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.tayang">
            {{ formErrors.tayang }}
          </div>
        </transition>
      </div>
      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
        {{ errorMessage }}
      </div>
    </form>
  </BaseFormModal>
</template>

<script setup>
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import { addBanner, updateBanner } from "@/services/referensi/banner";
import { reactive, ref, computed, watch, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { compressImage } from "@/utils/imageCompressor";

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
  sub_judul: "",
  deskripsi: "",
  gambar: null,
  tayang: "Draft",
});
const formErrors = reactive({
  judul: "",
  sub_judul: "",
  deskripsi: "",
  gambar: "",
  tayang: "",
});

const selectedPhotoFile = ref(null);
const photoPreviewUrl = ref(null);
const isLoading = ref(false);
const errorMessage = ref(null);
const fileInput = ref(null);
const isPhotoRemoved = ref(false);
const isShaking = ref(false);

// === Skema Validasi ===
const validationSchema = yup.object().shape({
  judul: yup.string().required("Judul wajib diisi."),
  sub_judul: yup.string(),
  deskripsi: yup.string(),
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
    if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreviewUrl.value);
    }
    photoPreviewUrl.value = null;

    isPhotoRemoved.value = false;
    if (fileInput.value) {
      fileInput.value.value = null;
    }

    if (newData) {
      formData.judul = newData.judul;
      formData.sub_judul = newData.sub_judul;
      formData.deskripsi = newData.deskripsi;
      formData.gambar = newData.gambar;
      formData.tayang = newData.tayang || "Draft";
    } else {
      formData.judul = "";
      formData.sub_judul = "";
      formData.deskripsi = "";
      formData.gambar = null;
      formData.tayang = "Draft";
    }

    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    errorMessage.value = null;
  },
  { immediate: true },
);

// === Lifecycle Hooks ===
onUnmounted(() => {
  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:")) {
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

  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }

  const resetToOriginal = () => {
    selectedPhotoFile.value = null;
    photoPreviewUrl.value = isEditMode.value ? formData.gambar : null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    formErrors.gambar = "";
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

    formErrors.gambar = "";
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
  const isBlobPreview =
    photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:");

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
  data.append("record[judul]", formData.judul);
  data.append("record[sub_judul]", formData.sub_judul || "");
  data.append("record[deskripsi]", formData.deskripsi || "");
  data.append("record[tayang]", formData.tayang);

  if (selectedPhotoFile.value) {
    data.append(
      "upload_gambar",
      selectedPhotoFile.value,
      selectedPhotoFile.value.name,
    );
  } else if (isPhotoRemoved.value) {
    data.append("record[gambar]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_banner;
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
