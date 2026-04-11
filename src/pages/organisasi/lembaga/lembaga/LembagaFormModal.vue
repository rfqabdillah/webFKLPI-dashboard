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
      id="lembagaForm"
    >
      <!-- Nama Lembaga -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Lembaga</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.nama_lembaga"
          :class="{
            'is-invalid': formErrors.nama_lembaga,
            shake: isShaking && formErrors.nama_lembaga,
          }"
          placeholder="Masukkan nama lembaga"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.nama_lembaga">
            {{ formErrors.nama_lembaga }}
          </div>
        </transition>
      </div>

      <!-- VIN -->
      <div class="mb-3">
        <label class="form-label fw-semibold">VIN</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.vin"
          :class="{
            'is-invalid': formErrors.vin,
            shake: isShaking && formErrors.vin,
          }"
          placeholder="Masukkan VIN"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.vin">
            {{ formErrors.vin }}
          </div>
        </transition>
      </div>

      <div class="row">
        <!-- Jenis Lembaga Dropdown -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Jenis Lembaga</label>
          <select
            class="form-select"
            v-model="formData.id_jenis_lembaga"
            :class="{
              'is-invalid': formErrors.id_jenis_lembaga,
              shake: isShaking && formErrors.id_jenis_lembaga,
            }"
            :disabled="isLoadingJenisLembaga"
            required
          >
            <option value="" disabled>
              {{ isLoadingJenisLembaga ? "Memuat..." : "Pilih Jenis Lembaga" }}
            </option>
            <option
              v-for="item in jenisLembagaOptions"
              :key="item.id_jenis_lembaga"
              :value="item.id_jenis_lembaga"
            >
              {{ item.nama_jenis_lembaga }}
            </option>
          </select>
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_jenis_lembaga">
              {{ formErrors.id_jenis_lembaga }}
            </div>
          </transition>
        </div>
      </div>

      <div class="row">
        <!-- Provinsi Dropdown -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Provinsi</label>
          <select
            class="form-select"
            v-model="selectedProvinceCode"
            :class="{
              'is-invalid': formErrors.id_wilayah && !selectedProvinceCode,
              shake:
                isShaking && formErrors.id_wilayah && !selectedProvinceCode,
            }"
            :disabled="isLoadingProvinsi"
            required
          >
            <option value="" disabled>
              {{ isLoadingProvinsi ? "Memuat..." : "Pilih Provinsi" }}
            </option>
            <template v-if="!isLoadingProvinsi">
              <option
                v-for="prov in provinsiOptions"
                :key="prov.id_wilayah"
                :value="prov.kode_wilayah"
              >
                {{ prov.kode_wilayah }} - {{ prov.nama_wilayah }}
              </option>
            </template>
          </select>
        </div>

        <!-- Kabupaten Dropdown -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Kabupaten</label>
          <select
            class="form-select"
            v-model="formData.id_wilayah"
            :class="{
              'is-invalid': formErrors.id_wilayah,
              shake: isShaking && formErrors.id_wilayah,
            }"
            :disabled="!selectedProvinceCode || isLoadingKabupaten"
            required
          >
            <option value="" disabled>
              {{
                isLoadingKabupaten
                  ? "Memuat..."
                  : selectedProvinceCode
                  ? "Pilih Kabupaten"
                  : "Silakan pilih Provinsi terlebih dahulu"
              }}
            </option>
            <template v-if="!isLoadingKabupaten">
              <option
                v-for="kab in kabupatenOptions"
                :key="kab.id_wilayah"
                :value="kab.id_wilayah"
              >
                {{ kab.kode_wilayah }} - {{ kab.nama_wilayah }}
              </option>
            </template>
          </select>
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_wilayah">
              {{ formErrors.id_wilayah }}
            </div>
          </transition>
        </div>
      </div>

      <!-- Alamat Lembaga -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Alamat Lembaga</label>
        <textarea
          class="form-control"
          v-model="formData.alamat_lembaga"
          :class="{
            'is-invalid': formErrors.alamat_lembaga,
            shake: isShaking && formErrors.alamat_lembaga,
          }"
          placeholder="Masukkan alamat lembaga"
          rows="3"
        ></textarea>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.alamat_lembaga">
            {{ formErrors.alamat_lembaga }}
          </div>
        </transition>
      </div>

      <!-- Logo Lembaga -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Logo Lembaga</label>
        <input
          type="file"
          class="form-control"
          @change="handleLogoUpload"
          accept="image/png, image/jpeg, image/jpg"
          :class="{
            'is-invalid': formErrors.logo_lembaga,
            shake: isShaking && formErrors.logo_lembaga,
          }"
          ref="logoFileInput"
          :disabled="isLogoProcessing"
        />
        <div class="form-text">
          Otomatis kompres. Format: .jpg, .jpeg, .png.
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.logo_lembaga"
            class="d-block"
          >
            *Kosongkan jika tidak ingin mengubah logo.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.logo_lembaga">
            {{ formErrors.logo_lembaga }}
          </div>
        </transition>

        <div v-if="logoPreviewUrl" class="mt-3">
          <label class="form-label fw-semibold d-block">Preview Logo</label>
          <div class="position-relative d-inline-block">
            <img
              :src="logoPreviewUrl"
              alt="Preview Logo"
              class="img-thumbnail shadow-sm"
              style="
                max-height: 150px;
                max-width: 150px;
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
              @click="removeLogo"
              title="Hapus Logo"
              :disabled="isLogoProcessing"
            >
              <i class="fa fa-times" style="font-size: 14px"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Cover Lembaga -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Cover Lembaga</label>
        <input
          type="file"
          class="form-control"
          @change="handleCoverUpload"
          accept="image/png, image/jpeg, image/jpg"
          :class="{
            'is-invalid': formErrors.cover_lembaga,
            shake: isShaking && formErrors.cover_lembaga,
          }"
          ref="coverFileInput"
          :disabled="isCoverProcessing"
        />
        <div class="form-text">
          Otomatis kompres. Format: .jpg, .jpeg, .png.
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.cover_lembaga"
            class="d-block"
          >
            *Kosongkan jika tidak ingin mengubah cover.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.cover_lembaga">
            {{ formErrors.cover_lembaga }}
          </div>
        </transition>

        <div v-if="coverPreviewUrl" class="mt-3">
          <label class="form-label fw-semibold d-block">Preview Cover</label>
          <div class="position-relative d-inline-block">
            <img
              :src="coverPreviewUrl"
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
              @click="removeCover"
              title="Hapus Cover"
              :disabled="isCoverProcessing"
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
  addLembaga,
  updateLembaga,
} from "@/services/general/organisasi/lembaga";
import { getJenisLembaga } from "@/services/referensi/jenisLembaga";
import { getWilayah } from "@/services/referensi/wilayah";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Lembaga" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  nama_lembaga: "",
  vin: "",
  id_jenis_lembaga: "",
  id_wilayah: "",
  alamat_lembaga: "",
  logo_lembaga: null,
  cover_lembaga: null,
});

const formErrors = reactive({
  nama_lembaga: "",
  vin: "",
  id_jenis_lembaga: "",
  id_wilayah: "",
  alamat_lembaga: "",
  logo_lembaga: "",
  cover_lembaga: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);

// Dropdown options
const jenisLembagaOptions = ref([]);
const isLoadingJenisLembaga = ref(false);

// Province & Kabupaten cascading
const selectedProvinceCode = ref("");
const provinsiOptions = ref([]);
const kabupatenOptions = ref([]);
const isLoadingProvinsi = ref(false);
const isLoadingKabupaten = ref(false);

// Logo state
const isLogoProcessing = ref(false);
const logoPreviewUrl = ref(null);
const logoFileInput = ref(null);
const isLogoRemoved = ref(false);

// Cover state
const isCoverProcessing = ref(false);
const coverPreviewUrl = ref(null);
const coverFileInput = ref(null);
const isCoverRemoved = ref(false);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  nama_lembaga: yup.string().required("Nama lembaga wajib diisi."),
  vin: yup.string().required("VIN wajib diisi."),
  id_jenis_lembaga: yup.string().required("Jenis lembaga wajib dipilih."),
  id_wilayah: yup.string().required("Wilayah wajib dipilih."),
  alamat_lembaga: yup.string().required("Alamat lembaga wajib diisi."),
  logo_lembaga: yup
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
  cover_lembaga: yup
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
async function fetchJenisLembaga() {
  isLoadingJenisLembaga.value = true;
  try {
    const res = await getJenisLembaga();
    const responseBody = res.data?.[0] || {};
    jenisLembagaOptions.value = responseBody.data || [];
  } catch (err) {
    console.error("Gagal memuat jenis lembaga:", err);
    toast.error("Gagal memuat data jenis lembaga.");
  } finally {
    isLoadingJenisLembaga.value = false;
  }
}

async function fetchProvinsi() {
  isLoadingProvinsi.value = true;
  try {
    const res = await getWilayah({ filter: "tipe_wilayah=A", limit: 50 });
    const responseBody = res.data?.[0] || {};
    provinsiOptions.value = responseBody.data || [];
  } catch (err) {
    console.error("Gagal memuat provinsi:", err);
    toast.error("Gagal memuat daftar provinsi.");
  } finally {
    isLoadingProvinsi.value = false;
  }
}

async function fetchKabupaten(provCode) {
  if (!provCode) {
    kabupatenOptions.value = [];
    return;
  }
  isLoadingKabupaten.value = true;
  try {
    const params = {
      limit: 100,
      sort: "kode_wilayah",
      dir: "asc",
      filter: `tipe_wilayah=B,kode_wilayah=${provCode}`,
    };

    const response = await getWilayah(params);
    let allData = [];
    if (response.data && Array.isArray(response.data)) {
      const rootData = response.data[0];
      if (rootData.data) {
        allData = rootData.data;
      }
    } else if (response.data && response.data.data) {
      allData = response.data.data;
    }
    kabupatenOptions.value = allData.filter((item) =>
      item.kode_wilayah.startsWith(provCode + "."),
    );

    if (formData.id_wilayah && kabupatenOptions.value.length > 0) {
      const currentVal = String(formData.id_wilayah);
      const exists = kabupatenOptions.value.some(
        (k) => k.id_wilayah === currentVal,
      );

      if (!exists) {
        const cleanCurrent = currentVal.replace(/\./g, "");
        const match = kabupatenOptions.value.find(
          (k) => k.kode_wilayah.replace(/\./g, "") === cleanCurrent,
        );
        if (match) {
          formData.id_wilayah = match.id_wilayah;
        }
      }
    }
  } catch (error) {
    console.error("Gagal memuat data kabupaten:", error);
    toast.error("Gagal memuat daftar kabupaten.");
  } finally {
    isLoadingKabupaten.value = false;
  }
}

watch(
  () => selectedProvinceCode.value,
  (newProv) => {
    if (!newProv) {
      formData.id_wilayah = "";
      kabupatenOptions.value = [];
      return;
    }
    const idWilayahStr = String(formData.id_wilayah || "");
    if (idWilayahStr && kabupatenOptions.value.length > 0) {
      const selectedKab = kabupatenOptions.value.find(
        (k) => k.id_wilayah === idWilayahStr,
      );
      if (selectedKab && !selectedKab.kode_wilayah.startsWith(newProv)) {
        formData.id_wilayah = "";
      } else if (!selectedKab) {
        formData.id_wilayah = "";
      }
    }

    fetchKabupaten(newProv);
  },
);

onMounted(() => {
  fetchJenisLembaga();
  fetchProvinsi();
});

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;
    isLogoRemoved.value = false;
    isCoverRemoved.value = false;

    if (logoPreviewUrl.value && logoPreviewUrl.value.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreviewUrl.value);
    }
    if (coverPreviewUrl.value && coverPreviewUrl.value.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreviewUrl.value);
    }

    if (newData) {
      formData.nama_lembaga = newData.nama_lembaga || "";
      formData.vin = newData.vin || "";
      formData.id_jenis_lembaga = newData.id_jenis_lembaga || "";
      formData.id_wilayah = newData.id_wilayah || "";
      formData.alamat_lembaga = newData.alamat_lembaga || "";
      formData.logo_lembaga = null;
      formData.cover_lembaga = null;

      logoPreviewUrl.value = newData.logo_lembaga || null;
      coverPreviewUrl.value = newData.cover_lembaga || null;

      // Populate province from nested wilayah data
      if (newData.wilayah && newData.wilayah.kode_wilayah) {
        const kode = String(newData.wilayah.kode_wilayah);
        selectedProvinceCode.value = kode.includes(".")
          ? kode.split(".")[0]
          : kode.substring(0, 2);

        fetchKabupaten(selectedProvinceCode.value);
      } else {
        selectedProvinceCode.value = "";
      }
    } else {
      formData.nama_lembaga = "";
      formData.vin = "";
      formData.id_jenis_lembaga = "";
      formData.id_wilayah = "";
      formData.alamat_lembaga = "";
      formData.logo_lembaga = null;
      formData.cover_lembaga = null;

      logoPreviewUrl.value = null;
      coverPreviewUrl.value = null;
      selectedProvinceCode.value = "";
    }

    if (logoFileInput.value) logoFileInput.value.value = null;
    if (coverFileInput.value) coverFileInput.value.value = null;
  },
  { immediate: true, deep: true },
);

// === Lifecycle ===
onUnmounted(() => {
  if (logoPreviewUrl.value && logoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(logoPreviewUrl.value);
  }
  if (coverPreviewUrl.value && coverPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(coverPreviewUrl.value);
  }
});

// === Methods ===
function closeModal() {
  if (!isLogoProcessing.value && !isCoverProcessing.value) {
    emit("close");
  }
}

async function handleImageUpload(event, field) {
  const file = event.target.files[0];
  const input = event.target;

  const isLogo = field === "logo";
  const previewRef = isLogo ? logoPreviewUrl : coverPreviewUrl;
  const processingRef = isLogo ? isLogoProcessing : isCoverProcessing;
  const formField = isLogo ? "logo_lembaga" : "cover_lembaga";
  const removedRef = isLogo ? isLogoRemoved : isCoverRemoved;

  if (previewRef.value && previewRef.value.startsWith("blob:")) {
    URL.revokeObjectURL(previewRef.value);
  }

  const resetToOriginal = () => {
    formData[formField] = null;
    previewRef.value = isEditMode.value ? props.fieldToEdit?.[formField] : null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    formErrors[formField] = "";
    return;
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Format file tidak didukung (Hanya .jpg, .jpeg, .png).");
    resetToOriginal();
    formErrors[formField] = "Format file tidak didukung.";
    return;
  }

  try {
    processingRef.value = true;
    toast.info("Sedang mengompres gambar...", { timeout: 1500 });

    const compressedFile = await compressImage(file);
    formData[formField] = compressedFile;
    previewRef.value = URL.createObjectURL(compressedFile);
    formErrors[formField] = "";
    removedRef.value = false;
  } catch (error) {
    toast.error("Gagal memproses gambar: " + error.message);
    resetToOriginal();
    formErrors[formField] = "Gagal memproses gambar.";
  } finally {
    processingRef.value = false;
  }
}

function handleLogoUpload(event) {
  handleImageUpload(event, "logo");
}

function handleCoverUpload(event) {
  handleImageUpload(event, "cover");
}

function removeImage(field) {
  const isLogo = field === "logo";
  const previewRef = isLogo ? logoPreviewUrl : coverPreviewUrl;
  const fileInputRef = isLogo ? logoFileInput : coverFileInput;
  const formField = isLogo ? "logo_lembaga" : "cover_lembaga";
  const removedRef = isLogo ? isLogoRemoved : isCoverRemoved;

  if (previewRef.value && previewRef.value.startsWith("blob:")) {
    URL.revokeObjectURL(previewRef.value);
  }

  if (fileInputRef.value) {
    fileInputRef.value.value = null;
  }
  formData[formField] = null;

  if (isEditMode.value && props.fieldToEdit && props.fieldToEdit[formField]) {
    const isBlobPreview =
      previewRef.value && previewRef.value.startsWith("blob:");

    if (!isBlobPreview) {
      previewRef.value = null;
      removedRef.value = true;
    } else {
      previewRef.value = props.fieldToEdit[formField];
      removedRef.value = false;
    }
  } else {
    previewRef.value = null;
    removedRef.value = false;
  }
}

function removeLogo() {
  removeImage("logo");
}

function removeCover() {
  removeImage("cover");
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
  data.append("record[nama_lembaga]", formData.nama_lembaga);
  data.append("record[vin]", formData.vin);
  data.append("record[id_jenis_lembaga]", formData.id_jenis_lembaga);
  data.append("record[id_wilayah]", formData.id_wilayah);
  data.append("record[alamat_lembaga]", formData.alamat_lembaga);

  if (formData.logo_lembaga) {
    data.append("upload_logo_lembaga", formData.logo_lembaga);
  } else if (isLogoRemoved.value) {
    data.append("record[logo_lembaga]", "");
  }

  if (formData.cover_lembaga) {
    data.append("upload_cover_lembaga", formData.cover_lembaga);
  } else if (isCoverRemoved.value) {
    data.append("record[cover_lembaga]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_lembaga;
      data.append("_method", "PUT");
      await updateLembaga(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addLembaga(data);
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
