<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate id="laporanForm">
      <!-- Organisasi (FKLPI) -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Organisasi (FKLPI)</label>
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

      <div class="row">
        <!-- Periode -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Periode</label>
          <select
            class="form-select"
            v-model="formData.id_periode"
            :class="{
              'is-invalid': formErrors.id_periode,
              'is-valid':
                wasValidated &&
                !formErrors.id_periode &&
                formData.id_periode !== '',
              shake: isShaking && formErrors.id_periode,
            }"
            :disabled="periodeLoading"
          >
            <option value="">
              {{ periodeLoading ? "Memuat..." : "Pilih Periode" }}
            </option>
            <option
              v-for="item in periodeOptions"
              :key="item.id_periode"
              :value="item.id_periode"
            >
              {{ item.nama_periode || `Periode #${item.id_periode}` }}
            </option>
          </select>
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_periode">
              {{ formErrors.id_periode }}
            </div>
          </transition>
        </div>

        <!-- Tahun Laporan -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold"
            >Tahun Laporan <span class="text-danger">*</span></label
          >
          <input
            type="number"
            class="form-control"
            v-model="formData.tahun_laporan"
            :class="{
              'is-invalid': formErrors.tahun_laporan,
              'is-valid': wasValidated && !formErrors.tahun_laporan,
              shake: isShaking && formErrors.tahun_laporan,
            }"
            placeholder="Contoh: 2026"
            min="2000"
            max="2100"
            required
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.tahun_laporan">
              {{ formErrors.tahun_laporan }}
            </div>
          </transition>
        </div>
      </div>

      <!-- Keterangan Laporan -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Keterangan Laporan</label>
        <textarea
          class="form-control"
          v-model="formData.keterangan_laporan"
          :class="{
            'is-invalid': formErrors.keterangan_laporan,
            'is-valid':
              wasValidated &&
              !formErrors.keterangan_laporan &&
              formData.keterangan_laporan !== '',
            shake: isShaking && formErrors.keterangan_laporan,
          }"
          placeholder="Masukkan keterangan laporan"
          rows="3"
        ></textarea>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.keterangan_laporan">
            {{ formErrors.keterangan_laporan }}
          </div>
        </transition>
      </div>

      <!-- Upload File Laporan -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Upload File Laporan</label>
        <input
          type="file"
          class="form-control"
          @change="handleFileUpload"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          :class="{
            'is-invalid': formErrors.file_laporan,
            shake: isShaking && formErrors.file_laporan,
          }"
          ref="fileInput"
        />
        <div class="form-text">
          Format: .pdf, .doc, .docx, .xls, .xlsx.
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.file_laporan"
            class="d-block"
          >
            *Kosongkan jika tidak ingin mengubah file.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.file_laporan">
            {{ formErrors.file_laporan }}
          </div>
        </transition>

        <div v-if="fileName" class="mt-2">
          <a
            v-if="filePreviewUrl"
            :href="filePreviewUrl"
            target="_blank"
            class="badge bg-light text-primary border text-decoration-none"
            title="Klik untuk preview"
          >
            <i class="fa fa-eye me-1"></i>{{ fileName }}
          </a>
          <span v-else class="badge bg-light text-dark border">
            <i class="fa fa-file me-1"></i>{{ fileName }}
          </span>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger ms-2"
            @click="removeFile"
            title="Hapus File"
          >
            <i class="fa fa-times"></i>
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
import { addLaporan, updateLaporan } from "@/services/general/dokumen/laporan";
import { getPeriode } from "@/services/referensi/periode";
import { getOrganisasi } from "@/services/general/organisasi/organisasi";
import { reactive, ref, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Laporan" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  id_organisasi: "",
  id_periode: "",
  tahun_laporan: "",
  file_laporan: null,
  keterangan_laporan: "",
});

const formErrors = reactive({
  id_organisasi: "",
  id_periode: "",
  tahun_laporan: "",
  file_laporan: "",
  keterangan_laporan: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const isShaking = ref(false);
const wasValidated = ref(false);

const initialOrganisasiLabel = ref("");

// Periode dropdown
const periodeOptions = ref([]);
const periodeLoading = ref(false);

// File Laporan
const selectedFile = ref(null);
const fileInput = ref(null);
const isFileRemoved = ref(false);
const fileName = ref("");
const filePreviewUrl = ref("");

// === Validation Schema ===
const validationSchema = yup.object().shape({
  tahun_laporan: yup
    .string()
    .required("Tahun laporan wajib diisi.")
    .matches(/^\d{4}$/, "Tahun laporan harus 4 digit."),
  id_organisasi: yup.string().nullable(),
  id_periode: yup.string().nullable(),
  keterangan_laporan: yup.string().nullable(),
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

// === Fetch Periode ===
async function fetchPeriode() {
  periodeLoading.value = true;
  try {
    const res = await getPeriode({
      limit: 100,
      sort: "nama_periode",
      dir: "desc",
    });
    periodeOptions.value = res.data?.[0]?.data || [];
  } catch (err) {
    console.error("Gagal memuat periode:", err);
    toast.error("Gagal memuat daftar periode.");
  } finally {
    periodeLoading.value = false;
  }
}

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
      formData.id_periode = newData.id_periode || "";
      formData.tahun_laporan = newData.tahun_laporan
        ? String(newData.tahun_laporan).trim()
        : "";
      formData.file_laporan = null;
      formData.keterangan_laporan = newData.keterangan_laporan
        ? newData.keterangan_laporan.trim()
        : "";

      fileName.value = newData.file_laporan
        ? newData.file_laporan.split("/").pop()
        : "";
      filePreviewUrl.value = newData.file_laporan || "";
    } else {
      Object.keys(formData).forEach((key) => (formData[key] = ""));
      initialOrganisasiLabel.value = "";
      formData.file_laporan = null;
      fileName.value = "";
      filePreviewUrl.value = "";
    }

    if (fileInput.value) fileInput.value.value = null;
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  fetchPeriode();
});

// === Methods ===
function closeModal() {
  emit("close");
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    selectedFile.value = null;
    fileName.value =
      isEditMode.value && props.fieldToEdit
        ? props.fieldToEdit.file_laporan?.split("/").pop() || ""
        : "";
    return;
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Format file tidak didukung.");
    formErrors.file_laporan = "Format file tidak didukung.";
    if (fileInput.value) fileInput.value.value = null;
    return;
  }

  selectedFile.value = file;
  fileName.value = file.name;
  filePreviewUrl.value = URL.createObjectURL(file);
  formErrors.file_laporan = "";
  isFileRemoved.value = false;
}

function removeFile() {
  selectedFile.value = null;
  if (fileInput.value) fileInput.value.value = null;

  if (isEditMode.value && props.fieldToEdit && props.fieldToEdit.file_laporan) {
    fileName.value = "";
    filePreviewUrl.value = "";
    isFileRemoved.value = true;
  } else {
    fileName.value = "";
    filePreviewUrl.value = "";
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
  Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    return true;
  } catch (err) {
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
  data.append("record[id_organisasi]", formData.id_organisasi || "");
  data.append("record[id_periode]", formData.id_periode || "");
  data.append("record[tahun_laporan]", formData.tahun_laporan);
  data.append("record[keterangan_laporan]", formData.keterangan_laporan || "");

  if (selectedFile.value) {
    data.append("upload_file_laporan", selectedFile.value);
  } else if (isFileRemoved.value) {
    data.append("record[file_laporan]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_laporan;
      data.append("_method", "PUT");
      await updateLaporan(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addLaporan(data);
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
