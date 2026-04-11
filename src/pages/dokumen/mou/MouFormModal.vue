<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate id="mouForm">
      <!-- Tanggal MOU -->
      <div class="mb-3">
        <label class="form-label fw-semibold"
          >Tanggal MOU <span class="text-danger">*</span></label
        >
        <input
          type="date"
          class="form-control"
          v-model="formData.tanggal_mou"
          :class="{
            'is-invalid': formErrors.tanggal_mou,
            shake: isShaking && formErrors.tanggal_mou,
          }"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.tanggal_mou">
            {{ formErrors.tanggal_mou }}
          </div>
        </transition>
      </div>

      <!-- TNA -->
      <div class="mb-3">
        <label class="form-label fw-semibold">TNA</label>
        <select
          class="form-select"
          v-model="formData.id_tna"
          :class="{
            'is-invalid': formErrors.id_tna,
            shake: isShaking && formErrors.id_tna,
          }"
          :disabled="tnaLoading"
        >
          <option value="">
            {{ tnaLoading ? "Memuat..." : "Pilih TNA" }}
          </option>
          <option
            v-for="item in tnaOptions"
            :key="item.id_tna"
            :value="item.id_tna"
          >
            {{ item.nama_tna || item.judul || `TNA #${item.id_tna}` }}
          </option>
        </select>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.id_tna">
            {{ formErrors.id_tna }}
          </div>
        </transition>
      </div>

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
        <!-- Perusahaan -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Perusahaan</label>
          <BaseSearchSelect
            v-model="formData.id_perusahaan"
            :api-fn="getPerusahaan"
            value-key="id_perusahaan"
            label-key="nama_perusahaan"
            filter-key="nama_perusahaan"
            placeholder="Pilih Perusahaan"
            search-placeholder="Ketik nama perusahaan"
            :initial-label="initialPerusahaanLabel"
            :is-invalid="!!formErrors.id_perusahaan"
            :shake="isShaking && !!formErrors.id_perusahaan"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_perusahaan">
              {{ formErrors.id_perusahaan }}
            </div>
          </transition>
        </div>

        <!-- Lembaga -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Lembaga</label>
          <BaseSearchSelect
            v-model="formData.id_lembaga"
            :api-fn="getLembaga"
            value-key="id_lembaga"
            label-key="nama_lembaga"
            filter-key="nama_lembaga"
            placeholder="Pilih Lembaga"
            search-placeholder="Ketik nama lembaga"
            :initial-label="initialLembagaLabel"
            :is-invalid="!!formErrors.id_lembaga"
            :shake="isShaking && !!formErrors.id_lembaga"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_lembaga">
              {{ formErrors.id_lembaga }}
            </div>
          </transition>
        </div>
      </div>

      <!-- Upload File MOU -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Upload File MOU</label>
        <input
          type="file"
          class="form-control"
          @change="handleFileUpload"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          :class="{
            'is-invalid': formErrors.file_mou,
            shake: isShaking && formErrors.file_mou,
          }"
          ref="fileInput"
        />
        <div class="form-text">
          Format: .pdf, .doc, .docx, .jpg, .jpeg, .png.
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.file_mou"
            class="d-block"
          >
            *Kosongkan jika tidak ingin mengubah file.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.file_mou">
            {{ formErrors.file_mou }}
          </div>
        </transition>

        <div v-if="mouFileName" class="mt-2">
          <a
            v-if="mouFilePreviewUrl"
            :href="mouFilePreviewUrl"
            target="_blank"
            class="badge bg-light text-primary border text-decoration-none"
            title="Klik untuk preview"
          >
            <i class="fa fa-eye me-1"></i>{{ mouFileName }}
          </a>
          <span v-else class="badge bg-light text-dark border">
            <i class="fa fa-file me-1"></i>{{ mouFileName }}
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
import { addMou, updateMou } from "@/services/general/pelatihan/mou";
import { getTna } from "@/services/general/website/tna";
import { getOrganisasi } from "@/services/general/organisasi/organisasi";
import { getPerusahaan } from "@/services/general/organisasi/perusahaan";
import { getLembaga } from "@/services/general/organisasi/lembaga";
import { reactive, ref, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "MOU" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  tanggal_mou: "",
  id_organisasi: "",
  id_perusahaan: "",
  id_lembaga: "",
  file_mou: null,
  id_tna: "",
});

const formErrors = reactive({
  tanggal_mou: "",
  id_organisasi: "",
  id_perusahaan: "",
  id_lembaga: "",
  file_mou: "",
  id_tna: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const isShaking = ref(false);
const wasValidated = ref(false);

const initialOrganisasiLabel = ref("");
const initialPerusahaanLabel = ref("");
const initialLembagaLabel = ref("");

// TNA dropdown
const tnaOptions = ref([]);
const tnaLoading = ref(false);

// File MOU
const selectedFile = ref(null);
const fileInput = ref(null);
const isFileRemoved = ref(false);
const mouFileName = ref("");
const mouFilePreviewUrl = ref("");

// === Validation Schema ===
const validationSchema = yup.object().shape({
  tanggal_mou: yup.string().required("Tanggal MOU wajib diisi."),
  id_tna: yup.string().nullable(),
  id_organisasi: yup.string().nullable(),
  id_perusahaan: yup.string().nullable(),
  id_lembaga: yup.string().nullable(),
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

// === Fetch TNA ===
async function fetchTna() {
  tnaLoading.value = true;
  try {
    const res = await getTna({ limit: 100, sort: "id_tna", dir: "asc" });
    tnaOptions.value = res.data?.[0]?.data || [];
  } catch (err) {
    console.error("Gagal memuat TNA:", err);
    toast.error("Gagal memuat daftar TNA.");
  } finally {
    tnaLoading.value = false;
  }
}

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    errorMessage.value = null;
    isFileRemoved.value = false;
    selectedFile.value = null;

    if (newData) {
      formData.tanggal_mou = newData.tanggal_mou
        ? newData.tanggal_mou.substring(0, 10)
        : "";
      formData.id_organisasi = newData.id_organisasi || "";
      formData.id_perusahaan = newData.id_perusahaan || "";
      formData.id_lembaga = newData.id_lembaga || "";
      
      initialOrganisasiLabel.value = newData.fklpi?.nama_organisasi || newData.organisasi?.nama_organisasi || newData.nama_organisasi || "";
      initialPerusahaanLabel.value = newData.perusahaan?.nama_perusahaan || newData.nama_perusahaan || "";
      initialLembagaLabel.value = newData.lembaga?.nama_lembaga || newData.nama_lembaga || "";
      
      formData.file_mou = null;
      formData.id_tna = newData.id_tna || "";

      mouFileName.value = newData.file_mou
        ? newData.file_mou.split("/").pop()
        : "";
      mouFilePreviewUrl.value = newData.file_mou || "";
    } else {
      Object.keys(formData).forEach((key) => (formData[key] = ""));
      initialOrganisasiLabel.value = "";
      initialPerusahaanLabel.value = "";
      initialLembagaLabel.value = "";
      formData.file_mou = null;
      mouFileName.value = "";
      mouFilePreviewUrl.value = "";
    }

    if (fileInput.value) fileInput.value.value = null;
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  fetchTna();
});

// === Methods ===
function closeModal() {
  emit("close");
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    selectedFile.value = null;
    mouFileName.value =
      isEditMode.value && props.fieldToEdit
        ? props.fieldToEdit.file_mou?.split("/").pop() || ""
        : "";
    return;
  }

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Format file tidak didukung.");
    formErrors.file_mou = "Format file tidak didukung.";
    if (fileInput.value) fileInput.value.value = null;
    return;
  }

  selectedFile.value = file;
  mouFileName.value = file.name;
  mouFilePreviewUrl.value = URL.createObjectURL(file);
  formErrors.file_mou = "";
  isFileRemoved.value = false;
}

function removeFile() {
  selectedFile.value = null;
  if (fileInput.value) fileInput.value.value = null;

  if (isEditMode.value && props.fieldToEdit && props.fieldToEdit.file_mou) {
    mouFileName.value = "";
    mouFilePreviewUrl.value = "";
    isFileRemoved.value = true;
  } else {
    mouFileName.value = "";
    mouFilePreviewUrl.value = "";
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
  const isValid = await validateForm();
  if (!isValid) {
    isShaking.value = true;
    setTimeout(() => (isShaking.value = false), 300);
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[tanggal_mou]", formData.tanggal_mou);
  data.append("record[id_organisasi]", formData.id_organisasi || "");
  data.append("record[id_perusahaan]", formData.id_perusahaan || "");
  data.append("record[id_lembaga]", formData.id_lembaga || "");
  data.append("record[id_tna]", formData.id_tna || "");

  if (selectedFile.value) {
    data.append("upload_file_mou", selectedFile.value);
  } else if (isFileRemoved.value) {
    data.append("record[file_mou]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_mou;
      data.append("_method", "PUT");
      await updateMou(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addMou(data);
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
