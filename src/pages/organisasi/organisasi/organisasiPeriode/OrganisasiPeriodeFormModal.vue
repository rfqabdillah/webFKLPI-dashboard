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
      id="periodeForm"
    >
      <!-- Organisasi -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Organisasi FKLPI</label>
        <BaseSearchSelect
          v-model="formData.id_organisasi"
          :api-fn="getOrganisasi"
          value-key="id_organisasi"
          label-key="nama_organisasi"
          filter-key="nama_organisasi"
          :initial-label="initialOrganisasiLabel || fixedFilters?._nama_organisasi"
          placeholder="Pilih Organisasi"
          search-placeholder="Ketik nama organisasi"
          :is-invalid="!!formErrors.id_organisasi"
          :shake="isShaking && !!formErrors.id_organisasi"
          :disabled="!!fixedFilters?.id_organisasi"
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.id_organisasi">
            {{ formErrors.id_organisasi }}
          </div>
        </transition>
      </div>

      <div class="row">
        <!-- Tahun Awal -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Tahun Awal</label>
          <input
            type="number"
            class="form-control"
            v-model="formData.tahun_awal"
            :class="{
              'is-invalid': formErrors.tahun_awal,
              shake: isShaking && formErrors.tahun_awal,
            }"
            placeholder="Contoh: 2024"
            min="1900"
            max="2100"
            required
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.tahun_awal">
              {{ formErrors.tahun_awal }}
            </div>
          </transition>
        </div>

        <!-- Tahun Akhir -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Tahun Akhir</label>
          <input
            type="number"
            class="form-control"
            v-model="formData.tahun_akhir"
            :class="{
              'is-invalid': formErrors.tahun_akhir,
              shake: isShaking && formErrors.tahun_akhir,
            }"
            placeholder="Contoh: 2029"
            min="1900"
            max="2100"
            required
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.tahun_akhir">
              {{ formErrors.tahun_akhir }}
            </div>
          </transition>
        </div>
      </div>

      <hr class="my-4" />
      <h6 class="fw-semibold text-muted mb-3">Dokumen Surat Keputusan (SK)</h6>

      <!-- Nomor SK -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Nomor SK</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.nomor_sk"
          :class="{
            'is-invalid': formErrors.nomor_sk,
            shake: isShaking && formErrors.nomor_sk,
          }"
          placeholder="Masukkan Nomor SK Kepengurusan"
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.nomor_sk">
            {{ formErrors.nomor_sk }}
          </div>
        </transition>
      </div>

      <!-- Tanggal SK -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Tanggal SK</label>
        <input
          type="date"
          class="form-control"
          v-model="formData.tanggal_sk"
          :class="{
            'is-invalid': formErrors.tanggal_sk,
            shake: isShaking && formErrors.tanggal_sk,
          }"
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.tanggal_sk">
            {{ formErrors.tanggal_sk }}
          </div>
        </transition>
      </div>

      <!-- File SK -->
      <div class="mb-3">
        <label class="form-label fw-semibold">File SK (PDF)</label>
        <input
          type="file"
          class="form-control"
          @change="handleFileUpload"
          accept="application/pdf"
          :class="{
            'is-invalid': formErrors.file_sk,
            shake: isShaking && formErrors.file_sk,
          }"
          ref="fileInputRef"
          :disabled="isFileProcessing"
        />
        <div class="form-text">
          Unggah dokumen SK dalam format PDF (Maks. 5MB).
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.file_sk"
            class="d-block text-primary"
          >
            *Kosongkan jika tidak ingin mengubah file SK yang sudah ada.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.file_sk">
            {{ formErrors.file_sk }}
          </div>
        </transition>

        <!-- Current File Preview/Link -->
        <div
          v-if="
            isEditMode && fieldToEdit && fieldToEdit.file_sk && !isFileRemoved
          "
          class="mt-3 p-3 bg-light rounded d-flex align-items-center justify-content-between border"
        >
          <div class="d-flex align-items-center">
            <i class="fa fa-file-pdf-o text-danger fs-3 me-3"></i>
            <div>
              <p class="mb-0 fw-semibold text-dark">File SK Saat Ini</p>
              <a
                :href="fieldToEdit.file_sk"
                target="_blank"
                class="text-decoration-none small"
                >Lihat Dokumen</a
              >
            </div>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="removeFile"
            title="Hapus File SK"
            :disabled="isFileProcessing"
          >
            <i class="fa fa-trash"></i> Hapus
          </button>
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
import { reactive, ref, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";
import {
  addOrganisasiPeriode,
  updateOrganisasiPeriode,
} from "@/services/general/organisasi/organisasiPeriode";
import { getOrganisasi } from "@/services/general/organisasi/organisasi";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Periode Kepengurusan" },
  fixedFilters: { type: Object, default: () => ({}) },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  id_organisasi: "",
  tahun_awal: "",
  tahun_akhir: "",
  nomor_sk: "",
  tanggal_sk: "",
  file_sk: null,
});

const formErrors = reactive({
  id_organisasi: "",
  tahun_awal: "",
  tahun_akhir: "",
  nomor_sk: "",
  tanggal_sk: "",
  file_sk: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);

const initialOrganisasiLabel = ref("");

// File upload state
const fileInputRef = ref(null);
const isFileProcessing = ref(false);
const isFileRemoved = ref(false);
const selectedFile = ref(null);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  id_organisasi: yup.string().required("Organisasi wajib dipilih."),
  tahun_awal: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Tahun awal wajib diisi.")
    .integer("Tahun harus berupa angka genap.")
    .min(1900, "Tahun tidak valid."),
  tahun_akhir: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required("Tahun akhir wajib diisi.")
    .integer("Tahun harus berupa angka genap.")
    .min(
      yup.ref("tahun_awal"),
      "Tahun akhir harus lebih besar atau sama dengan Tahun awal.",
    ),
  nomor_sk: yup.string().nullable(),
  tanggal_sk: yup.string().nullable(),
  file_sk: yup
    .mixed()
    .nullable()
    .test("fileSize", "Ukuran file terlalu besar (Maks. 5MB)", (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test("fileType", "Format file tidak didukung (Hanya .pdf)", (value) => {
      if (!value) return true;
      return ["application/pdf"].includes(value.type);
    }),
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

onMounted(() => {});

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;
    isFileRemoved.value = false;
    selectedFile.value = null;

    if (newData) {
      formData.id_organisasi = newData.id_organisasi || "";
      initialOrganisasiLabel.value = newData.fklpi?.nama_organisasi || newData.organisasi?.nama_organisasi || newData.nama_organisasi || "";
      formData.tahun_awal = newData.tahun_awal || "";
      formData.tahun_akhir = newData.tahun_akhir || "";
      formData.nomor_sk = newData.nomor_sk || "";
      formData.tanggal_sk = newData.tanggal_sk || "";
      formData.file_sk = null; // Don't bind URL to input File!
    } else {
      formData.id_organisasi = props.fixedFilters?.id_organisasi || "";
      initialOrganisasiLabel.value = props.fixedFilters?._nama_organisasi || "";
      formData.tahun_awal = "";
      formData.tahun_akhir = "";
      formData.nomor_sk = "";
      formData.tanggal_sk = "";
      formData.file_sk = null;
    }

    if (fileInputRef.value) fileInputRef.value.value = null;
  },
  { immediate: true, deep: true },
);

// === Methods ===
function closeModal() {
  if (!isFileProcessing.value) {
    emit("close");
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  const input = event.target;

  const resetToOriginal = () => {
    formData.file_sk = null;
    selectedFile.value = null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    formErrors.file_sk = "";
    return;
  }

  if (file.type !== "application/pdf") {
    toast.error("Format file tidak didukung (Hanya .pdf).");
    resetToOriginal();
    formErrors.file_sk = "Format file tidak didukung. Harap unggah PDF.";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Ukuran file terlalu besar (Maks. 5MB).");
    resetToOriginal();
    formErrors.file_sk = "Ukuran file terlalu besar (Maks. 5MB).";
    return;
  }

  formData.file_sk = file;
  selectedFile.value = file;
  formErrors.file_sk = "";
  isFileRemoved.value = false;
}

function removeFile() {
  if (fileInputRef.value) {
    fileInputRef.value.value = null;
  }
  formData.file_sk = null;
  selectedFile.value = null;
  isFileRemoved.value = true;
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
  data.append("record[tahun_awal]", formData.tahun_awal);
  data.append("record[tahun_akhir]", formData.tahun_akhir);
  data.append("record[nomor_sk]", formData.nomor_sk || "");
  data.append("record[tanggal_sk]", formData.tanggal_sk || "");

  // File SK upload management
  if (formData.file_sk) {
    data.append("upload_file_sk", formData.file_sk);
  } else if (isFileRemoved.value) {
    data.append("record[file_sk]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_organisasi_periode;
      data.append("_method", "PUT");
      await updateOrganisasiPeriode(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addOrganisasiPeriode(data);
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
