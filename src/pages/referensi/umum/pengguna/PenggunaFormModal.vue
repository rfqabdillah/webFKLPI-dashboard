<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate id="penggunaForm">
      <!-- Nama -->
      <div class="mb-3">
        <label class="form-label fw-semibold"
          >Nama Lengkap <span class="text-danger">*</span></label
        >
        <input
          type="text"
          class="form-control"
          v-model="formData.nama"
          :class="{
            'is-invalid': formErrors.nama,
            shake: isShaking && formErrors.nama,
          }"
          placeholder="Masukkan nama lengkap"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.nama">
            {{ formErrors.nama }}
          </div>
        </transition>
      </div>

      <div class="row">
        <!-- NIK -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold"
            >NIK <span class="text-danger">*</span></label
          >
          <input
            type="text"
            class="form-control"
            v-model="formData.nik"
            :class="{
              'is-invalid': formErrors.nik,
              shake: isShaking && formErrors.nik,
            }"
            placeholder="Nomor Induk Kependudukan"
            maxlength="16"
            required
          />
          <div class="d-flex justify-content-between">
            <transition name="fade-error">
              <div class="invalid-feedback" v-if="formErrors.nik">
                {{ formErrors.nik }}
              </div>
            </transition>
            <small
              class="ms-auto"
              :class="{
                'text-success': formData.nik.length === 16,
                'text-muted': formData.nik.length !== 16,
              }"
            >
              {{ formData.nik.length }}/16
            </small>
          </div>
        </div>

        <!-- Jenis Kelamin -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Jenis Kelamin</label>
          <select
            class="form-select"
            v-model="formData.id_jenis_kelamin"
            :class="{
              'is-invalid': formErrors.id_jenis_kelamin,
              shake: isShaking && formErrors.id_jenis_kelamin,
            }"
            :disabled="genderLoading"
          >
            <option value="">
              {{ genderLoading ? "Memuat..." : "Pilih Jenis Kelamin" }}
            </option>
            <option
              v-for="g in genderOptions"
              :key="g.id_jenis_kelamin"
              :value="g.id_jenis_kelamin"
            >
              {{ g.nama_jenis_kelamin }}
            </option>
          </select>
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_jenis_kelamin">
              {{ formErrors.id_jenis_kelamin }}
            </div>
          </transition>
        </div>
      </div>

      <div class="row">
        <!-- Email -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold"
            >Email <span class="text-danger">*</span></label
          >
          <input
            type="email"
            class="form-control"
            v-model="formData.email"
            :class="{
              'is-invalid': formErrors.email,
              shake: isShaking && formErrors.email,
            }"
            placeholder="email@contoh.com"
            required
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.email">
              {{ formErrors.email }}
            </div>
          </transition>
        </div>

        <!-- Telepon -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Telepon</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.telepon"
            placeholder="08xxxxxxxxxx"
          />
        </div>
      </div>

      <div class="row">
        <!-- Tempat Lahir -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Tempat Lahir</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.tempat_lahir"
            placeholder="Kota kelahiran"
          />
        </div>

        <!-- Tanggal Lahir -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Tanggal Lahir</label>
          <input
            type="date"
            class="form-control"
            v-model="formData.tanggal_lahir"
          />
        </div>
      </div>

      <!-- Alamat -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Alamat</label>
        <textarea
          class="form-control"
          v-model="formData.alamat"
          placeholder="Masukkan alamat lengkap"
          rows="2"
        ></textarea>
      </div>

      <div class="row">
        <!-- Provinsi -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Provinsi</label>
          <select
            class="form-select"
            v-model="selectedProvinceCode"
            :disabled="isLoadingProvinsi"
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

      <!-- Organisasi FKLPI -->
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

      <!-- Tentang Saya -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Tentang Saya</label>
        <textarea
          class="form-control"
          v-model="formData.tentang_saya"
          placeholder="Ceritakan tentang diri Anda"
          rows="3"
        ></textarea>
      </div>

      <!-- Upload Foto -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Upload Foto</label>
        <input
          type="file"
          class="form-control"
          @change="handlePhotoUpload"
          accept="image/png, image/jpeg, image/jpg"
          :class="{
            'is-invalid': formErrors.foto,
            shake: isShaking && formErrors.foto,
          }"
          ref="fileInput"
        />
        <div class="form-text">
          Otomatis kompres. Format: .jpg, .jpeg, .png.
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.foto"
            class="d-block"
          >
            *Kosongkan jika tidak ingin mengubah foto.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.foto">
            {{ formErrors.foto }}
          </div>
        </transition>

        <div v-if="photoPreviewUrl" class="mt-3">
          <div class="position-relative d-inline-block">
            <img
              :src="photoPreviewUrl"
              alt="Preview Foto"
              class="img-thumbnail shadow-sm"
              style="
                width: 120px;
                height: 120px;
                object-fit: cover;
                background-color: #f8f9fa;
              "
            />
            <button
              type="button"
              class="btn btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style="
                width: 24px;
                height: 24px;
                padding: 0;
                border: 2px solid white;
              "
              @click="removePhoto"
              title="Hapus Foto"
            >
              <i class="fa fa-times" style="font-size: 12px"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Upload Bukti -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Upload Bukti</label>
        <input
          type="file"
          class="form-control"
          @change="handleBuktiUpload"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          :class="{
            'is-invalid': formErrors.bukti,
            shake: isShaking && formErrors.bukti,
          }"
          ref="buktiFileInput"
        />
        <div class="form-text">
          Format: .pdf, .jpg, .jpeg, .png, .doc, .docx.
          <span
            v-if="isEditMode && fieldToEdit && fieldToEdit.bukti"
            class="d-block"
          >
            *Kosongkan jika tidak ingin mengubah bukti.
          </span>
        </div>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.bukti">
            {{ formErrors.bukti }}
          </div>
        </transition>

        <div v-if="buktiFileName" class="mt-2">
          <a
            v-if="buktiPreviewUrl"
            :href="buktiPreviewUrl"
            target="_blank"
            class="badge bg-light text-primary border text-decoration-none"
            title="Klik untuk preview"
          >
            <i class="fa fa-eye me-1"></i>{{ buktiFileName }}
          </a>
          <span v-else class="badge bg-light text-dark border">
            <i class="fa fa-file me-1"></i>{{ buktiFileName }}
          </span>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger ms-2"
            @click="removeBukti"
            title="Hapus Bukti"
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
import { addPengguna, updatePengguna } from "@/services/referensi/pengguna";
import { getJenisKelamin } from "@/services/referensi/jenisKelamin";
import { getWilayah } from "@/services/referensi/wilayah";
import { getOrganisasi } from "@/services/general/organisasi/organisasi";
import { reactive, ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";
import { compressImage } from "@/utils/imageCompressor";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Pengguna" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  nik: "",
  nama: "",
  email: "",
  telepon: "",
  alamat: "",
  id_wilayah: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  tentang_saya: "",
  foto: null,
  bukti: null,
  id_jenis_kelamin: "",
  id_organisasi: "",
});

const formErrors = reactive({
  nik: "",
  nama: "",
  email: "",
  id_jenis_kelamin: "",
  id_wilayah: "",
  id_organisasi: "",
  foto: "",
  bukti: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);

const initialOrganisasiLabel = ref("");

// Dropdown options
const genderOptions = ref([]);
const genderLoading = ref(false);

// Province & Kabupaten cascading
const selectedProvinceCode = ref("");
const provinsiOptions = ref([]);
const kabupatenOptions = ref([]);
const isLoadingProvinsi = ref(false);
const isLoadingKabupaten = ref(false);

// Photo
const selectedPhotoFile = ref(null);
const photoPreviewUrl = ref(null);
const fileInput = ref(null);
const isPhotoRemoved = ref(false);

// Bukti
const selectedBuktiFile = ref(null);
const buktiFileInput = ref(null);
const isBuktiRemoved = ref(false);
const buktiFileName = ref("");
const buktiPreviewUrl = ref("");

// === Validation Schema ===
const validationSchema = yup.object().shape({
  nama: yup.string().required("Nama wajib diisi."),
  email: yup
    .string()
    .email("Format email tidak valid.")
    .required("Email wajib diisi."),
  nik: yup
    .string()
    .matches(/^[0-9]+$/, "NIK hanya boleh berisi angka.")
    .length(16, "NIK harus terdiri dari 16 digit.")
    .required("NIK wajib diisi."),
  id_jenis_kelamin: yup.string().nullable(),
  id_wilayah: yup.string().nullable(),
  id_organisasi: yup.string().nullable(),
  foto: yup
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
async function fetchPeran() {
  peranLoading.value = true;
  try {
    const res = await getPeran({ limit: 50, sort: "nama_peran", dir: "asc" });
    peranOptions.value = res.data?.[0]?.data || [];
  } catch (err) {
    console.error("Gagal memuat peran:", err);
    toast.error("Gagal memuat daftar peran.");
  } finally {
    peranLoading.value = false;
  }
}

async function fetchGender() {
  genderLoading.value = true;
  try {
    const res = await getJenisKelamin({ limit: 50 });
    genderOptions.value = res.data?.[0]?.data || [];
  } catch (err) {
    console.error("Gagal memuat jenis kelamin:", err);
    toast.error("Gagal memuat daftar jenis kelamin.");
  } finally {
    genderLoading.value = false;
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

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;
    isPhotoRemoved.value = false;
    isBuktiRemoved.value = false;
    selectedPhotoFile.value = null;
    selectedBuktiFile.value = null;

    if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreviewUrl.value);
    }
    photoPreviewUrl.value = null;

    if (newData) {
      formData.nik = newData.nik || "";
      formData.nama = newData.nama || "";
      formData.email = newData.email || "";
      formData.telepon = newData.telepon || "";
      formData.alamat = newData.alamat || "";
      formData.id_wilayah = newData.id_wilayah || "";
      formData.tempat_lahir = newData.tempat_lahir || "";
      formData.tanggal_lahir = newData.tanggal_lahir
        ? newData.tanggal_lahir.substring(0, 10)
        : "";
      formData.tentang_saya = newData.tentang_saya || "";
      formData.foto = null;
      formData.bukti = null;
      formData.id_jenis_kelamin = newData.id_jenis_kelamin || "";
      formData.id_organisasi = newData.id_organisasi || "";
      initialOrganisasiLabel.value = newData.fklpi?.nama_organisasi || newData.organisasi?.nama_organisasi || newData.nama_organisasi || "";

      photoPreviewUrl.value = newData.foto || null;
      buktiFileName.value = newData.bukti ? newData.bukti.split("/").pop() : "";
      buktiPreviewUrl.value = newData.bukti || "";

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
      Object.keys(formData).forEach((key) => (formData[key] = ""));
      initialOrganisasiLabel.value = "";
      formData.status = "Aktif";
      formData.foto = null;
      selectedProvinceCode.value = "";
      photoPreviewUrl.value = null;
      buktiFileName.value = "";
      buktiPreviewUrl.value = "";
    }

    if (fileInput.value) fileInput.value.value = null;
    if (buktiFileInput.value) buktiFileInput.value.value = null;
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  fetchGender();
  fetchProvinsi();
});

onUnmounted(() => {
  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }
});

// === Methods ===
function closeModal() {
  emit("close");
}

async function handlePhotoUpload(event) {
  const file = event.target.files[0];
  const input = event.target;

  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }

  const resetToOriginal = () => {
    selectedPhotoFile.value = null;
    photoPreviewUrl.value =
      isEditMode.value && props.fieldToEdit ? props.fieldToEdit.foto : null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    formErrors.foto = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    toast.error("File yang diupload harus berupa gambar.");
    resetToOriginal();
    formErrors.foto = "Format file tidak didukung.";
    return;
  }

  try {
    isLoading.value = true;
    toast.info("Sedang mengompres gambar...", { timeout: 2000 });

    const compressedFile = await compressImage(file);
    selectedPhotoFile.value = compressedFile;
    photoPreviewUrl.value = URL.createObjectURL(compressedFile);
    formErrors.foto = "";
    isPhotoRemoved.value = false;
  } catch (error) {
    toast.error("Gagal memproses gambar: " + error.message);
    resetToOriginal();
    formErrors.foto = "Gagal memproses gambar.";
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

  if (isEditMode.value && props.fieldToEdit && props.fieldToEdit.foto) {
    if (!isBlobPreview) {
      photoPreviewUrl.value = null;
      isPhotoRemoved.value = true;
    } else {
      photoPreviewUrl.value = props.fieldToEdit.foto;
      isPhotoRemoved.value = false;
    }
  } else {
    photoPreviewUrl.value = null;
    isPhotoRemoved.value = false;
  }
}

function handleBuktiUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    selectedBuktiFile.value = null;
    buktiFileName.value =
      isEditMode.value && props.fieldToEdit
        ? props.fieldToEdit.bukti?.split("/").pop() || ""
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
    formErrors.bukti = "Format file tidak didukung.";
    if (buktiFileInput.value) buktiFileInput.value.value = null;
    return;
  }

  selectedBuktiFile.value = file;
  buktiFileName.value = file.name;
  buktiPreviewUrl.value = URL.createObjectURL(file);
  formErrors.bukti = "";
  isBuktiRemoved.value = false;
}

function removeBukti() {
  selectedBuktiFile.value = null;
  if (buktiFileInput.value) buktiFileInput.value.value = null;

  if (isEditMode.value && props.fieldToEdit && props.fieldToEdit.bukti) {
    buktiFileName.value = "";
    buktiPreviewUrl.value = "";
    isBuktiRemoved.value = true;
  } else {
    buktiFileName.value = "";
    buktiPreviewUrl.value = "";
    isBuktiRemoved.value = false;
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
  data.append("record[nik]", formData.nik);
  data.append("record[nama]", formData.nama);
  data.append("record[email]", formData.email);
  data.append("record[telepon]", formData.telepon || "");
  data.append("record[alamat]", formData.alamat || "");
  data.append("record[id_wilayah]", formData.id_wilayah || "");
  data.append("record[tempat_lahir]", formData.tempat_lahir || "");
  data.append("record[tanggal_lahir]", formData.tanggal_lahir || "");
  data.append("record[tentang_saya]", formData.tentang_saya || "");
  data.append("record[id_jenis_kelamin]", formData.id_jenis_kelamin || "");
  data.append("record[id_organisasi]", formData.id_organisasi || "");

  if (selectedPhotoFile.value) {
    data.append("upload_foto", selectedPhotoFile.value);
  } else if (isPhotoRemoved.value) {
    data.append("record[foto]", "");
  }

  if (selectedBuktiFile.value) {
    data.append("upload_bukti", selectedBuktiFile.value);
  } else if (isBuktiRemoved.value) {
    data.append("record[bukti]", "");
  }

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_pengguna;
      data.append("_method", "PUT");
      await updatePengguna(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addPengguna(data);
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
