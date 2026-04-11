<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate id="programPelatihanForm">
      <!-- Nama Program -->
      <div class="mb-3">
        <label class="form-label fw-semibold"
          >Nama Program <span class="text-danger">*</span></label
        >
        <input
          type="text"
          class="form-control"
          v-model="formData.nama_program"
          :class="{
            'is-invalid': formErrors.nama_program,
            'is-valid': wasValidated && !formErrors.nama_program,
            shake: isShaking && formErrors.nama_program,
          }"
          placeholder="Masukkan nama program pelatihan"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.nama_program">
            {{ formErrors.nama_program }}
          </div>
        </transition>
      </div>

      <div class="row">
        <!-- Kode Program -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Kode Program</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.kode_program"
            :class="{
              'is-invalid': formErrors.kode_program,
              'is-valid':
                wasValidated &&
                !formErrors.kode_program &&
                formData.kode_program !== '',
              shake: isShaking && formErrors.kode_program,
            }"
            placeholder="Masukkan kode program"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.kode_program">
              {{ formErrors.kode_program }}
            </div>
          </transition>
        </div>

        <!-- JP (Jam Pelajaran) -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">JP (Jam Pelajaran)</label>
          <input
            type="number"
            class="form-control"
            v-model="formData.jp"
            :class="{
              'is-invalid': formErrors.jp,
              'is-valid': wasValidated && !formErrors.jp && formData.jp !== '',
              shake: isShaking && formErrors.jp,
            }"
            placeholder="Contoh: 40"
            min="0"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.jp">
              {{ formErrors.jp }}
            </div>
          </transition>
        </div>
      </div>

      <!-- Kode KBJI (BaseSearchSelect) -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Kode KBJI</label>
        <BaseSearchSelect
          v-model="formData.kode_kbji"
          :api-fn="getKbji"
          value-key="kode_kbji"
          label-key="nama_kbji"
          filter-key="nama_kbji"
          placeholder="Pilih Kode KBJI"
          search-placeholder="Ketik nama KBJI"
          :initial-label="initialKbjiLabel"
          :is-invalid="!!formErrors.kode_kbji"
          :shake="isShaking && !!formErrors.kode_kbji"
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.kode_kbji">
            {{ formErrors.kode_kbji }}
          </div>
        </transition>
      </div>

      <!-- Deskripsi -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Deskripsi</label>
        <textarea
          class="form-control"
          v-model="formData.deskripsi"
          :class="{
            'is-invalid': formErrors.deskripsi,
            'is-valid':
              wasValidated &&
              !formErrors.deskripsi &&
              formData.deskripsi !== '',
            shake: isShaking && formErrors.deskripsi,
          }"
          placeholder="Masukkan deskripsi program pelatihan"
          rows="3"
        ></textarea>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.deskripsi">
            {{ formErrors.deskripsi }}
          </div>
        </transition>
      </div>

      <!-- Upload Cover -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Upload Cover</label>
        <input
          type="file"
          class="form-control"
          @change="handleImageUpload"
          accept="image/png, image/jpeg, image/jpg"
          :class="{
            'is-invalid': formErrors.cover,
            shake: isShaking && formErrors.cover,
          }"
          ref="fileInput"
        />
        <div class="form-text">
          Format: .jpg, .jpeg, .png. Otomatis dikompres.
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.cover"
            class="d-block"
          >
            *Kosongkan jika tidak ingin mengubah cover.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.cover">
            {{ formErrors.cover }}
          </div>
        </transition>

        <div v-if="imagePreviewUrl" class="mt-3">
          <label class="form-label fw-semibold d-block">Preview Cover</label>
          <div class="position-relative d-inline-block">
            <img
              :src="imagePreviewUrl"
              alt="Preview Cover"
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
              title="Hapus Cover"
            >
              <i class="fa fa-times" style="font-size: 14px"></i>
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
import {
  addProgramPelatihan,
  updateProgramPelatihan,
} from "@/services/referensi/programPelatihan";
import { getKbji } from "@/services/referensi/kbji";
import { reactive, ref, computed, watch, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";
import { compressImage } from "@/utils/imageCompressor";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Program Pelatihan" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  nama_program: "",
  kode_program: "",
  cover: null,
  deskripsi: "",
  kejuruan: "",
  sub_kejuruan: "",
  kode_kbji: "",
  link: "",
  jp: "",
});

const formErrors = reactive({
  nama_program: "",
  kode_program: "",
  cover: "",
  deskripsi: "",
  kode_kbji: "",
  jp: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);

const initialKbjiLabel = ref("");

// Image
const imagePreviewUrl = ref(null);
const fileInput = ref(null);
const isImageRemoved = ref(false);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  nama_program: yup.string().required("Nama program wajib diisi."),
  kode_program: yup.string().nullable(),
  deskripsi: yup.string().nullable(),
  kode_kbji: yup.string().nullable(),
  jp: yup.string().nullable(),
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
    isImageRemoved.value = false;

    if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl.value);
    }

    if (newData) {
      formData.nama_program = newData.nama_program
        ? newData.nama_program.trim()
        : "";
      formData.kode_program = newData.kode_program
        ? newData.kode_program.trim()
        : "";
      formData.cover = null;
      formData.deskripsi = newData.deskripsi ? newData.deskripsi.trim() : "";
      formData.kejuruan = newData.kejuruan ? newData.kejuruan.trim() : "";
      formData.sub_kejuruan = newData.sub_kejuruan
        ? newData.sub_kejuruan.trim()
        : "";
      formData.kode_kbji = newData.kode_kbji || "";
      initialKbjiLabel.value = newData.kbji?.nama_kbji || newData.nama_kbji || "";
      formData.link = newData.link ? newData.link.trim() : "";
      formData.jp = newData.jp ? String(newData.jp).trim() : "";
      imagePreviewUrl.value = newData.cover || null;
    } else {
      Object.keys(formData).forEach((key) => (formData[key] = ""));
      initialKbjiLabel.value = "";
      formData.cover = null;
      imagePreviewUrl.value = null;
    }

    if (fileInput.value) fileInput.value.value = null;
  },
  { immediate: true, deep: true },
);

onUnmounted(() => {
  if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }
});

// === Methods ===
function closeModal() {
  emit("close");
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  const input = event.target;

  if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }

  const resetToOriginal = () => {
    formData.cover = null;
    imagePreviewUrl.value =
      isEditMode.value && props.fieldToEdit ? props.fieldToEdit.cover : null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    formErrors.cover = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    toast.error("File yang diupload harus berupa gambar.");
    resetToOriginal();
    formErrors.cover = "Format file tidak didukung.";
    return;
  }

  try {
    isLoading.value = true;
    toast.info("Sedang mengompres gambar...", { timeout: 2000 });
    const compressedFile = await compressImage(file);
    formData.cover = compressedFile;
    imagePreviewUrl.value = URL.createObjectURL(compressedFile);
    formErrors.cover = "";
    isImageRemoved.value = false;
  } catch (error) {
    toast.error("Gagal memproses gambar: " + error.message);
    resetToOriginal();
    formErrors.cover = "Gagal memproses gambar.";
  } finally {
    isLoading.value = false;
  }
}

function removeImage() {
  if (imagePreviewUrl.value && imagePreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreviewUrl.value);
  }

  if (fileInput.value) fileInput.value.value = null;
  formData.cover = null;

  if (isEditMode.value && props.fieldToEdit && props.fieldToEdit.cover) {
    imagePreviewUrl.value = null;
    isImageRemoved.value = true;
  } else {
    imagePreviewUrl.value = null;
    isImageRemoved.value = false;
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
  Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    return true;
  } catch (err) {
    err.inner.forEach((e) => {
      if (e.path in formErrors) {
        formErrors[e.path] = e.message;
      }
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
  data.append("record[nama_program]", formData.nama_program);
  data.append("record[kode_program]", formData.kode_program || "");
  data.append("record[deskripsi]", formData.deskripsi || "");
  data.append("record[kejuruan]", formData.kejuruan || "");
  data.append("record[sub_kejuruan]", formData.sub_kejuruan || "");
  data.append("record[kode_kbji]", formData.kode_kbji || "");
  data.append("record[link]", formData.link || "");
  data.append("record[jp]", formData.jp || "");

  if (formData.cover) {
    data.append("upload_cover", formData.cover);
  } else if (isImageRemoved.value) {
    data.append("record[cover]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_program_pelatihan;
      data.append("_method", "PUT");
      await updateProgramPelatihan(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addProgramPelatihan(data);
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
