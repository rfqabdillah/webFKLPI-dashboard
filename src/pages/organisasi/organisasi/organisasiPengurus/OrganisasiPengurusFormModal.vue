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
      id="pengurusForm"
    >
      <!-- Nama Pengurus -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Pengurus</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.nama_pengurus"
          :class="{
            'is-invalid': formErrors.nama_pengurus,
            shake: isShaking && formErrors.nama_pengurus,
          }"
          placeholder="Masukkan nama pengurus"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.nama_pengurus">
            {{ formErrors.nama_pengurus }}
          </div>
        </transition>
      </div>

      <div class="row">
        <!-- Jabatan Dropdown -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Jabatan</label>
          <select
            class="form-select"
            v-model="formData.id_jabatan"
            :class="{
              'is-invalid': formErrors.id_jabatan,
              shake: isShaking && formErrors.id_jabatan,
            }"
            :disabled="isLoadingJabatan"
            required
          >
            <option value="" disabled>
              {{ isLoadingJabatan ? "Memuat..." : "Pilih Jabatan" }}
            </option>
            <option
              v-for="item in jabatanOptions"
              :key="item.id_jabatan"
              :value="item.id_jabatan"
            >
              {{ item.nama_jabatan }}
            </option>
          </select>
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_jabatan">
              {{ formErrors.id_jabatan }}
            </div>
          </transition>
        </div>

        <!-- Status Pengurus Dropdown -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Status Pengurus</label>
          <select
            class="form-select"
            v-model="formData.id_status_pengurus"
            :class="{
              'is-invalid': formErrors.id_status_pengurus,
              shake: isShaking && formErrors.id_status_pengurus,
            }"
            :disabled="isLoadingStatusPengurus"
            required
          >
            <option value="" disabled>
              {{
                isLoadingStatusPengurus ? "Memuat..." : "Pilih Status Pengurus"
              }}
            </option>
            <option
              v-for="item in statusPengurusOptions"
              :key="item.id_status_pengurus"
              :value="item.id_status_pengurus"
            >
              {{ item.nama_status_pengurus }}
            </option>
          </select>
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_status_pengurus">
              {{ formErrors.id_status_pengurus }}
            </div>
          </transition>
        </div>
      </div>

      <!-- Periode Dropdown -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Periode Kepengurusan</label>
        <select
          class="form-select"
          v-model="formData.id_organisasi_periode"
          :class="{
            'is-invalid': formErrors.id_organisasi_periode,
            shake: isShaking && formErrors.id_organisasi_periode,
          }"
          :disabled="isLoadingPeriode || !!fixedFilters?.id_organisasi_periode"
          required
        >
          <option value="" disabled>
            {{ isLoadingPeriode ? "Memuat..." : "Pilih Periode" }}
          </option>
          <option
            v-for="item in periodeOptions"
            :key="item.id_organisasi_periode"
            :value="item.id_organisasi_periode"
          >
            {{ item.tahun_awal }} - {{ item.tahun_akhir }}
          </option>
        </select>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.id_organisasi_periode">
            {{ formErrors.id_organisasi_periode }}
          </div>
        </transition>
      </div>

      <!-- Foto Pengurus -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Foto Pengurus</label>
        <input
          type="file"
          class="form-control"
          @change="handleFotoUpload"
          accept="image/png, image/jpeg, image/jpg"
          :class="{
            'is-invalid': formErrors.foto_pengurus,
            shake: isShaking && formErrors.foto_pengurus,
          }"
          ref="fotoFileInput"
          :disabled="isFotoProcessing"
        />
        <div class="form-text">
          Otomatis kompres. Format: .jpg, .jpeg, .png.
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.foto_pengurus"
            class="d-block text-primary"
          >
            *Kosongkan jika tidak ingin mengubah foto.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.foto_pengurus">
            {{ formErrors.foto_pengurus }}
          </div>
        </transition>

        <div v-if="fotoPreviewUrl" class="mt-3">
          <label class="form-label fw-semibold d-block">Preview Foto</label>
          <div class="position-relative d-inline-block">
            <img
              :src="fotoPreviewUrl"
              alt="Preview Foto"
              class="img-thumbnail shadow-sm"
              style="
                max-height: 150px;
                max-width: 150px;
                object-fit: cover;
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
              @click="removeFoto"
              title="Hapus Foto"
              :disabled="isFotoProcessing"
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
import { reactive, ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";
import { compressImage } from "@/utils/imageCompressor";
import {
  addOrganisasiPengurus,
  updateOrganisasiPengurus,
} from "@/services/general/organisasi/organisasiPengurus";
import { getJabatan } from "@/services/referensi/jabatan";
import { getOrganisasiPeriode } from "@/services/general/organisasi/organisasiPeriode";
import { getStatusPengurus } from "@/services/referensi/statusPengurus";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Pengurus" },
  fixedFilters: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  nama_pengurus: "",
  id_jabatan: "",
  id_organisasi_periode: "",
  id_status_pengurus: "",
  foto_pengurus: null,
});

const formErrors = reactive({
  nama_pengurus: "",
  id_jabatan: "",
  id_organisasi_periode: "",
  id_status_pengurus: "",
  foto_pengurus: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);

// Dropdown options
const jabatanOptions = ref([]);
const isLoadingJabatan = ref(false);
const periodeOptions = ref([]);
const isLoadingPeriode = ref(false);
const statusPengurusOptions = ref([]);
const isLoadingStatusPengurus = ref(false);

// Foto state
const isFotoProcessing = ref(false);
const fotoPreviewUrl = ref(null);
const fotoFileInput = ref(null);
const isFotoRemoved = ref(false);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  nama_pengurus: yup.string().required("Nama pengurus wajib diisi."),
  id_jabatan: yup.string().required("Jabatan wajib dipilih."),
  id_organisasi_periode: yup.string().required("Periode wajib dipilih."),
  id_status_pengurus: yup.string().required("Status pengurus wajib dipilih."),
  foto_pengurus: yup
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
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

// === Fetch Dropdown Options ===
async function fetchJabatan() {
  isLoadingJabatan.value = true;
  try {
    const res = await getJabatan({ per_page: 100 });
    const responseBody = res.data?.[0] || {};
    jabatanOptions.value = responseBody.data || [];
  } catch (err) {
    console.error("Gagal memuat jabatan:", err);
    toast.error("Gagal memuat data jabatan.");
  } finally {
    isLoadingJabatan.value = false;
  }
}

async function fetchPeriode() {
  isLoadingPeriode.value = true;
  try {
    const res = await getOrganisasiPeriode({ per_page: 500 });
    const responseBody = res.data?.[0] || {};
    periodeOptions.value = responseBody.data || [];
  } catch (err) {
    console.error("Gagal memuat periode:", err);
    toast.error("Gagal memuat data periode.");
  } finally {
    isLoadingPeriode.value = false;
  }
}

async function fetchStatusPengurus() {
  isLoadingStatusPengurus.value = true;
  try {
    const res = await getStatusPengurus({ per_page: 100 });
    const responseBody = res.data?.[0] || {};
    statusPengurusOptions.value = responseBody.data || [];
  } catch (err) {
    console.error("Gagal memuat status pengurus:", err);
    toast.error("Gagal memuat data status pengurus.");
  } finally {
    isLoadingStatusPengurus.value = false;
  }
}

onMounted(() => {
  fetchJabatan();
  fetchPeriode();
  fetchStatusPengurus();
});

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;
    isFotoRemoved.value = false;

    if (fotoPreviewUrl.value && fotoPreviewUrl.value.startsWith("blob:")) {
      URL.revokeObjectURL(fotoPreviewUrl.value);
    }

    if (newData) {
      formData.nama_pengurus = newData.nama_pengurus || "";
      formData.id_jabatan = newData.id_jabatan || "";

      formData.id_organisasi_periode =
        newData["organisasi-periode"]?.id_organisasi_periode || "";

      formData.id_status_pengurus =
        newData["status-pengurus"]?.id_status_pengurus || "";

      formData.foto_pengurus = null;

      fotoPreviewUrl.value = newData.foto_pengurus || null;
    } else {
      formData.nama_pengurus = "";
      formData.id_jabatan = "";
      formData.id_organisasi_periode =
        props.fixedFilters?.id_organisasi_periode || "";
      formData.id_status_pengurus = "";
      formData.foto_pengurus = null;

      fotoPreviewUrl.value = null;
    }

    if (fotoFileInput.value) fotoFileInput.value.value = null;
  },
  { immediate: true, deep: true },
);

// === Lifecycle ===
onUnmounted(() => {
  if (fotoPreviewUrl.value && fotoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(fotoPreviewUrl.value);
  }
});

// === Methods ===
function closeModal() {
  if (!isFotoProcessing.value) {
    emit("close");
  }
}

async function handleFotoUpload(event) {
  const file = event.target.files[0];
  const input = event.target;

  if (fotoPreviewUrl.value && fotoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(fotoPreviewUrl.value);
  }

  const resetToOriginal = () => {
    formData.foto_pengurus = null;
    fotoPreviewUrl.value = isEditMode.value
      ? props.fieldToEdit?.foto_pengurus
      : null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    formErrors.foto_pengurus = "";
    return;
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Format file tidak didukung (Hanya .jpg, .jpeg, .png).");
    resetToOriginal();
    formErrors.foto_pengurus = "Format file tidak didukung.";
    return;
  }

  try {
    isFotoProcessing.value = true;
    toast.info("Sedang mengompres gambar...", { timeout: 1500 });

    const compressedFile = await compressImage(file);
    formData.foto_pengurus = compressedFile;
    fotoPreviewUrl.value = URL.createObjectURL(compressedFile);
    formErrors.foto_pengurus = "";
    isFotoRemoved.value = false;
  } catch (error) {
    toast.error("Gagal memproses gambar: " + error.message);
    resetToOriginal();
    formErrors.foto_pengurus = "Gagal memproses gambar.";
  } finally {
    isFotoProcessing.value = false;
  }
}

function removeFoto() {
  if (fotoPreviewUrl.value && fotoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(fotoPreviewUrl.value);
  }

  if (fotoFileInput.value) {
    fotoFileInput.value.value = null;
  }
  formData.foto_pengurus = null;

  if (
    isEditMode.value &&
    props.fieldToEdit &&
    props.fieldToEdit.foto_pengurus
  ) {
    const isBlobPreview =
      fotoPreviewUrl.value && fotoPreviewUrl.value.startsWith("blob:");

    if (!isBlobPreview) {
      fotoPreviewUrl.value = null;
      isFotoRemoved.value = true;
    } else {
      fotoPreviewUrl.value = props.fieldToEdit.foto_pengurus;
      isFotoRemoved.value = false;
    }
  } else {
    fotoPreviewUrl.value = null;
    isFotoRemoved.value = false;
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
  data.append("record[nama_pengurus]", formData.nama_pengurus);
  data.append("record[id_jabatan]", formData.id_jabatan);
  data.append("record[id_organisasi_periode]", formData.id_organisasi_periode);
  data.append("record[id_status_pengurus]", formData.id_status_pengurus);

  // Foto upload
  if (formData.foto_pengurus) {
    data.append("upload_foto_pengurus", formData.foto_pengurus);
  } else if (isFotoRemoved.value) {
    data.append("record[foto_pengurus]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_pengurus;
      data.append("_method", "PUT");
      await updateOrganisasiPengurus(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addOrganisasiPengurus(data);
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
  object-fit: cover;
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
