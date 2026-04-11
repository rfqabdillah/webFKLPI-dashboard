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
      id="perusahaanForm"
    >
      <!-- Nama Perusahaan -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Perusahaan</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.nama_perusahaan"
          :class="{
            'is-invalid': formErrors.nama_perusahaan,
            shake: isShaking && formErrors.nama_perusahaan,
          }"
          placeholder="Masukkan nama perusahaan"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.nama_perusahaan">
            {{ formErrors.nama_perusahaan }}
          </div>
        </transition>
      </div>

      <!-- Organisasi -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Organisasi FKLPI</label>
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
        <!-- NPWP -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">NPWP Perusahaan</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.npwp_perusahaan"
            :class="{
              'is-invalid': formErrors.npwp_perusahaan,
              shake: isShaking && formErrors.npwp_perusahaan,
            }"
            placeholder="Masukkan NPWP"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.npwp_perusahaan">
              {{ formErrors.npwp_perusahaan }}
            </div>
          </transition>
        </div>

        <!-- NIB -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">NIB Perusahaan</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.nib_perusahaan"
            :class="{
              'is-invalid': formErrors.nib_perusahaan,
              shake: isShaking && formErrors.nib_perusahaan,
            }"
            placeholder="Masukkan NIB"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.nib_perusahaan">
              {{ formErrors.nib_perusahaan }}
            </div>
          </transition>
        </div>
      </div>

      <div class="row">
        <!-- Email -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Email Perusahaan</label>
          <input
            type="email"
            class="form-control"
            v-model="formData.email_perusahaan"
            :class="{
              'is-invalid': formErrors.email_perusahaan,
              shake: isShaking && formErrors.email_perusahaan,
            }"
            placeholder="Masukkan email"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.email_perusahaan">
              {{ formErrors.email_perusahaan }}
            </div>
          </transition>
        </div>

        <!-- Telepon -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Telepon Perusahaan</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.telepon_perusahaan"
            :class="{
              'is-invalid': formErrors.telepon_perusahaan,
              shake: isShaking && formErrors.telepon_perusahaan,
            }"
            placeholder="Masukkan nomor telepon"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.telepon_perusahaan">
              {{ formErrors.telepon_perusahaan }}
            </div>
          </transition>
        </div>
      </div>

      <div class="row">
        <!-- Provinsi -->
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

        <!-- Kabupaten -->
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

      <!-- Alamat Perusahaan -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Alamat Perusahaan</label>
        <textarea
          class="form-control"
          v-model="formData.alamat_perusahaan"
          :class="{
            'is-invalid': formErrors.alamat_perusahaan,
            shake: isShaking && formErrors.alamat_perusahaan,
          }"
          placeholder="Masukkan alamat perusahaan"
          rows="2"
        ></textarea>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.alamat_perusahaan">
            {{ formErrors.alamat_perusahaan }}
          </div>
        </transition>
      </div>

      <!-- Koordinat -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Koordinat</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.koordinat"
          :class="{
            'is-invalid': formErrors.koordinat,
            shake: isShaking && formErrors.koordinat,
          }"
          placeholder="Contoh: -6.200000, 106.816666"
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.koordinat">
            {{ formErrors.koordinat }}
          </div>
        </transition>
      </div>

      <!-- Deskripsi Perusahaan -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Deskripsi Perusahaan</label>
        <textarea
          class="form-control"
          v-model="formData.deskripsi_perusahaan"
          :class="{
            'is-invalid': formErrors.deskripsi_perusahaan,
            shake: isShaking && formErrors.deskripsi_perusahaan,
          }"
          placeholder="Masukkan deskripsi perusahaan"
          rows="3"
        ></textarea>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.deskripsi_perusahaan">
            {{ formErrors.deskripsi_perusahaan }}
          </div>
        </transition>
      </div>

      <!-- Logo Perusahaan -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Logo Perusahaan</label>
        <input
          type="file"
          class="form-control"
          @change="handleLogoUpload"
          accept="image/png, image/jpeg, image/jpg"
          :class="{
            'is-invalid': formErrors.logo_perusahaan,
            shake: isShaking && formErrors.logo_perusahaan,
          }"
          ref="logoFileInput"
          :disabled="isLogoProcessing"
        />
        <div class="form-text">
          Otomatis kompres. Format: .jpg, .jpeg, .png.
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.logo_perusahaan"
            class="d-block text-primary"
          >
            *Kosongkan jika tidak ingin mengubah logo.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.logo_perusahaan">
            {{ formErrors.logo_perusahaan }}
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

      <!-- Banner Perusahaan -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Banner Perusahaan</label>
        <input
          type="file"
          class="form-control"
          @change="handleBannerUpload"
          accept="image/png, image/jpeg, image/jpg"
          :class="{
            'is-invalid': formErrors.banner_perusahaan,
            shake: isShaking && formErrors.banner_perusahaan,
          }"
          ref="bannerFileInput"
          :disabled="isBannerProcessing"
        />
        <div class="form-text">
          Otomatis kompres. Format: .jpg, .jpeg, .png.
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.banner_perusahaan"
            class="d-block text-primary"
          >
            *Kosongkan jika tidak ingin mengubah banner.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.banner_perusahaan">
            {{ formErrors.banner_perusahaan }}
          </div>
        </transition>

        <div v-if="bannerPreviewUrl" class="mt-3">
          <label class="form-label fw-semibold d-block">Preview Banner</label>
          <div class="position-relative d-inline-block">
            <img
              :src="bannerPreviewUrl"
              alt="Preview Banner"
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
              @click="removeBanner"
              title="Hapus Banner"
              :disabled="isBannerProcessing"
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
import { reactive, ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { compressImage } from "@/utils/imageCompressor";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";
import {
  addPerusahaan,
  updatePerusahaan,
} from "@/services/general/organisasi/perusahaan";
import { getOrganisasi } from "@/services/general/organisasi/organisasi";
import { getWilayah } from "@/services/referensi/wilayah";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Perusahaan" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  nama_perusahaan: "",
  id_organisasi: "",
  id_wilayah: "",
  alamat_perusahaan: "",
  npwp_perusahaan: "",
  nib_perusahaan: "",
  email_perusahaan: "",
  telepon_perusahaan: "",
  deskripsi_perusahaan: "",
  logo_perusahaan: null,
  banner_perusahaan: null,
  koordinat: "",
});

const formErrors = reactive({
  nama_perusahaan: "",
  id_organisasi: "",
  id_wilayah: "",
  alamat_perusahaan: "",
  npwp_perusahaan: "",
  nib_perusahaan: "",
  email_perusahaan: "",
  telepon_perusahaan: "",
  deskripsi_perusahaan: "",
  logo_perusahaan: "",
  banner_perusahaan: "",
  koordinat: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);

const initialOrganisasiLabel = ref("");

const selectedProvinceCode = ref("");
const provinsiOptions = ref([]);
const kabupatenOptions = ref([]);
const isLoadingProvinsi = ref(false);
const isLoadingKabupaten = ref(false);

const isLogoProcessing = ref(false);
const logoPreviewUrl = ref(null);
const logoFileInput = ref(null);
const isLogoRemoved = ref(false);

const isBannerProcessing = ref(false);
const bannerPreviewUrl = ref(null);
const bannerFileInput = ref(null);
const isBannerRemoved = ref(false);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  nama_perusahaan: yup.string().required("Nama perusahaan wajib diisi."),
  id_organisasi: yup.string().required("Organisasi wajib dipilih."),
  id_wilayah: yup.string().required("Wilayah wajib dipilih."),
  alamat_perusahaan: yup.string().nullable(),
  npwp_perusahaan: yup.string().nullable(),
  nib_perusahaan: yup.string().nullable(),
  email_perusahaan: yup.string().email("Format email tidak valid.").nullable(),
  telepon_perusahaan: yup.string().nullable(),
  deskripsi_perusahaan: yup.string().nullable(),
  logo_perusahaan: yup
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
  banner_perusahaan: yup
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
  koordinat: yup.string().nullable(),
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

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
  fetchProvinsi();
});

useRealtimeValidation({ formData, formErrors, wasValidated, validationSchema });

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;
    isLogoRemoved.value = false;
    isBannerRemoved.value = false;

    if (logoPreviewUrl.value && logoPreviewUrl.value.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreviewUrl.value);
    }
    if (bannerPreviewUrl.value && bannerPreviewUrl.value.startsWith("blob:")) {
      URL.revokeObjectURL(bannerPreviewUrl.value);
    }

    if (newData) {
      formData.nama_perusahaan = newData.nama_perusahaan || "";
      formData.id_organisasi = newData.id_organisasi || "";
      initialOrganisasiLabel.value = newData.fklpi?.nama_organisasi || newData.organisasi?.nama_organisasi || newData.nama_organisasi || "";
      formData.id_wilayah = newData.id_wilayah || "";
      formData.alamat_perusahaan = newData.alamat_perusahaan || "";
      formData.npwp_perusahaan = newData.npwp_perusahaan || "";
      formData.nib_perusahaan = newData.nib_perusahaan || "";
      formData.email_perusahaan = newData.email_perusahaan || "";
      formData.telepon_perusahaan = newData.telepon_perusahaan || "";
      formData.deskripsi_perusahaan = newData.deskripsi_perusahaan || "";
      formData.logo_perusahaan = null;
      formData.banner_perusahaan = null;
      formData.koordinat = newData.koordinat || "";

      logoPreviewUrl.value = newData.logo_perusahaan || null;
      bannerPreviewUrl.value = newData.banner_perusahaan || null;

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
      formData.nama_perusahaan = "";
      formData.id_organisasi = "";
      formData.id_wilayah = "";
      formData.alamat_perusahaan = "";
      formData.npwp_perusahaan = "";
      formData.nib_perusahaan = "";
      formData.email_perusahaan = "";
      formData.telepon_perusahaan = "";
      formData.deskripsi_perusahaan = "";
      formData.logo_perusahaan = null;
      formData.banner_perusahaan = null;
      formData.koordinat = "";

      logoPreviewUrl.value = null;
      bannerPreviewUrl.value = null;
      selectedProvinceCode.value = "";
    }

    if (logoFileInput.value) logoFileInput.value.value = null;
    if (bannerFileInput.value) bannerFileInput.value.value = null;
  },
  { immediate: true, deep: true },
);

// === Lifecycle ===
onUnmounted(() => {
  if (logoPreviewUrl.value && logoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(logoPreviewUrl.value);
  }
  if (bannerPreviewUrl.value && bannerPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(bannerPreviewUrl.value);
  }
});

// === Methods ===
function closeModal() {
  if (!isLogoProcessing.value && !isBannerProcessing.value) {
    emit("close");
  }
}

async function handleImageUpload(event, field) {
  const file = event.target.files[0];
  const input = event.target;

  const isLogo = field === "logo";
  const previewRef = isLogo ? logoPreviewUrl : bannerPreviewUrl;
  const processingRef = isLogo ? isLogoProcessing : isBannerProcessing;
  const formField = isLogo ? "logo_perusahaan" : "banner_perusahaan";
  const removedRef = isLogo ? isLogoRemoved : isBannerRemoved;

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

function handleBannerUpload(event) {
  handleImageUpload(event, "banner");
}

function removeImage(field) {
  const isLogo = field === "logo";
  const previewRef = isLogo ? logoPreviewUrl : bannerPreviewUrl;
  const fileInputRef = isLogo ? logoFileInput : bannerFileInput;
  const formField = isLogo ? "logo_perusahaan" : "banner_perusahaan";
  const removedRef = isLogo ? isLogoRemoved : isBannerRemoved;

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

function removeBanner() {
  removeImage("banner");
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
  if (!isValid) {
    isShaking.value = true;
    setTimeout(() => (isShaking.value = false), 300);
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[nama_perusahaan]", formData.nama_perusahaan);
  data.append("record[id_organisasi]", formData.id_organisasi);
  data.append("record[id_wilayah]", formData.id_wilayah);
  data.append("record[alamat_perusahaan]", formData.alamat_perusahaan || "");
  data.append("record[npwp_perusahaan]", formData.npwp_perusahaan || "");
  data.append("record[nib_perusahaan]", formData.nib_perusahaan || "");
  data.append("record[email_perusahaan]", formData.email_perusahaan || "");
  data.append("record[telepon_perusahaan]", formData.telepon_perusahaan || "");
  data.append(
    "record[deskripsi_perusahaan]",
    formData.deskripsi_perusahaan || "",
  );
  data.append("record[koordinat]", formData.koordinat || "");

  if (formData.logo_perusahaan) {
    data.append("upload_logo_perusahaan", formData.logo_perusahaan);
  } else if (isLogoRemoved.value) {
    data.append("record[logo_perusahaan]", "");
  }

  if (formData.banner_perusahaan) {
    data.append("upload_banner_perusahaan", formData.banner_perusahaan);
  } else if (isBannerRemoved.value) {
    data.append("record[banner_perusahaan]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_perusahaan;
      data.append("_method", "PUT");
      await updatePerusahaan(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addPerusahaan(data);
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
