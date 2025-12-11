<template>
  <div class="user-form-section">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h6 class="mb-0">
        <i class="fa fa-edit me-2"></i>
        {{ isEditMode ? "Edit Biodata" : "Input Biodata" }}
      </h6>
      <button
        v-if="!isEditMode"
        class="btn btn-outline-secondary btn-sm"
        @click="$emit('back')"
      >
        <i class="fa fa-arrow-left me-1"></i> Ubah Jenis Pengguna
      </button>
    </div>

    <div class="row">
      <!-- Nama Lengkap -->
      <div class="col-12 mb-3">
        <label class="form-label fw-semibold"
          >Nama Lengkap <span class="text-danger">*</span></label
        >
        <input
          type="text"
          class="form-control"
          v-model="formData.nama"
          :class="{ 'is-invalid': formErrors.nama }"
          :placeholder="isLoading ? 'Memuat...' : 'Nama lengkap'"
          :disabled="isLoading"
          @blur="validateField('nama')"
        />
        <div class="invalid-feedback">{{ formErrors.nama }}</div>
      </div>

      <!-- Gelar -->
      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">Gelar Depan</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.gelardepan"
          placeholder="Dr."
        />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">Gelar Belakang</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.gelarbelakang"
          placeholder="S.Kom"
        />
      </div>

      <!-- NIK -->
      <div class="col-12 mb-3">
        <label class="form-label fw-semibold"
          >NIK <span class="text-danger">*</span></label
        >
        <input
          type="text"
          class="form-control"
          v-model="formData.nik"
          :class="{ 'is-invalid': formErrors.nik }"
          :placeholder="isLoading ? 'Memuat...' : 'Nomor Induk Kependudukan'"
          :disabled="isLoading"
          @blur="validateField('nik')"
        />
        <div class="invalid-feedback">{{ formErrors.nik }}</div>
      </div>

      <!-- Email & Telepon -->
      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold"
          >Email <span class="text-danger">*</span></label
        >
        <input
          type="email"
          class="form-control"
          v-model="formData.email"
          :class="{ 'is-invalid': formErrors.email }"
          :placeholder="isLoading ? 'Memuat...' : 'email@instansi.go.id'"
          :disabled="isLoading"
          @blur="validateField('email')"
        />
        <div class="invalid-feedback">{{ formErrors.email }}</div>
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">No. Telepon</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.telp"
          placeholder="08xxxxxxxx"
        />
      </div>

      <!-- NIP & Karpeg (Only for ASN) -->
      <template v-if="!isNonAsn">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">NIP</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.nip"
            placeholder="NIP"
          />
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">No. Karpeg</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.no_karpeg"
            placeholder="Kartu Pegawai"
          />
        </div>
      </template>

      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">Jenis Kelamin</label>
        <select
          class="form-select"
          v-model="formData.idjeniskelamin"
          :disabled="gendersLoading || isLoading"
        >
          <option value="">
            {{ gendersLoading ? "Memuat..." : "Pilih Jenis Kelamin" }}
          </option>
          <option
            v-for="gender in genderOptions"
            :key="gender.idjeniskelamin"
            :value="gender.idjeniskelamin"
          >
            {{ gender.namajeniskelamin }}
          </option>
        </select>
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">Jenis Pengguna</label>
        <select
          class="form-select"
          v-model="formData.idjenispengguna"
          :disabled="userTypesLoading || isLoading"
        >
          <option value="">
            {{ userTypesLoading ? "Memuat..." : "Pilih Jenis Pengguna" }}
          </option>
          <option
            v-for="userType in userTypeOptions"
            :key="userType.idjenispengguna"
            :value="userType.idjenispengguna"
          >
            {{ userType.namajenispengguna }}
          </option>
        </select>
      </div>

      <!-- Tempat & Tanggal Lahir -->
      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">Tempat Lahir</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.tempatlahir"
          placeholder="Kota kelahiran"
        />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">Tanggal Lahir</label>
        <input
          type="date"
          class="form-control"
          v-model="formData.tanggallahir"
        />
      </div>

      <!-- Alamat -->
      <div class="col-12 mb-3">
        <label class="form-label fw-semibold">Alamat Lengkap</label>
        <textarea
          class="form-control"
          v-model="formData.alamat"
          placeholder="Alamat domisili"
        ></textarea>
      </div>

      <!-- Provinsi & Kabupaten -->
      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">Provinsi</label>
        <select
          class="form-select"
          v-model="formData.kodepropinsi"
          :disabled="regionsLoading"
        >
          <option value="" disabled>
            {{ regionsLoading ? "Memuat..." : "Pilih Provinsi" }}
          </option>
          <template v-if="!regionsLoading">
            <option
              v-for="prov in provinceOptions"
              :key="prov.idwilayah"
              :value="prov.kodewilayah"
            >
              {{ prov.kodewilayah }} - {{ prov.namawilayah }}
            </option>
          </template>
        </select>
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">Kabupaten</label>
        <select
          class="form-select"
          v-model="formData.kodekabupaten"
          :disabled="!formData.kodepropinsi || kabupatenLoading"
        >
          <option value="" disabled>
            {{
              kabupatenLoading
                ? "Memuat..."
                : formData.kodepropinsi
                ? "Pilih Kabupaten"
                : "Silakan pilih Provinsi terlebih dahulu"
            }}
          </option>
          <template v-if="!kabupatenLoading">
            <option
              v-for="kab in kabupatenOptions"
              :key="kab.idwilayah"
              :value="kab.kodewilayah"
            >
              {{ kab.kodewilayah }} - {{ kab.namawilayah }}
            </option>
          </template>
        </select>
      </div>

      <!-- Upload Foto -->
      <div class="col-12 mb-3">
        <label class="form-label fw-semibold">Upload Foto</label>
        <input
          type="file"
          class="form-control"
          @change="handlePhotoUpload"
          accept="image/*"
          ref="fileInput"
        />
        <small class="form-text text-muted"
          >Kosongkan jika tidak ingin mengubah foto.</small
        >

        <div class="mt-3" v-if="photoPreviewUrl || formData.foto">
          <div class="position-relative d-inline-block">
            <img
              :src="photoPreviewUrl || formData.foto"
              alt="Preview Foto"
              class="img-thumbnail shadow-sm"
              style="width: 120px; height: 120px; object-fit: cover"
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
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { getRoles } from "@/services/referensi/roles";
import { getRegions } from "@/services/referensi/regions";
import { getGenders } from "@/services/referensi/genders";
import { getUserTypes } from "@/services/referensi/userTypes";
import { compressImage } from "@/utils/imageCompressor";
import { useToast } from "vue-toastification";
import * as yup from "yup";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    default: "",
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isNonAsn: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "back", "photo-change"]);
const toast = useToast();

// State
const formData = reactive(props.modelValue);
const formErrors = reactive({});
const roleOptions = ref([]);
const genderOptions = ref([]);
const userTypeOptions = ref([]);
const provinceOptions = ref([]);
const kabupatenOptions = ref([]);
const rolesLoading = ref(false);
const gendersLoading = ref(false);
const userTypesLoading = ref(false);
const regionsLoading = ref(false);
const kabupatenLoading = ref(false);
const photoPreviewUrl = ref(null);
const fileInput = ref(null);

// Validation Schema
const validationSchema = yup.object().shape({
  nama: yup.string().required("Nama wajib diisi."),
  nik: yup
    .string()
    .matches(/^[0-9]+$/, "NIK hanya boleh berisi angka")
    .length(16, "NIK harus terdiri dari 16 digit")
    .required("NIK wajib diisi."),
  email: yup
    .string()
    .email("Format email salah")
    .required("Email wajib diisi."),
});

// Watchers
watch(
  formData,
  () => {
    emit("update:modelValue", formData);
  },
  { deep: true }
);

watch(
  () => formData.kodepropinsi,
  (newProv) => {
    if (newProv) {
      fetchKabupaten(newProv);
    } else {
      kabupatenOptions.value = [];
    }
  }
);

// Lifecycle
onMounted(() => {
  fetchRoles();
  fetchGenders();
  fetchUserTypes();
  fetchProvinces();

  if (formData.foto) {
    photoPreviewUrl.value = formData.foto;
  }

  if (formData.kodepropinsi) {
    fetchKabupaten(formData.kodepropinsi);
  }
});

// Methods
async function fetchRoles() {
  rolesLoading.value = true;
  try {
    const response = await getRoles({ page: 1, limit: 100 });
    roleOptions.value = response.data?.[0]?.data || response.data?.data || [];
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat daftar level/role");
  } finally {
    rolesLoading.value = false;
  }
}

async function fetchGenders() {
  gendersLoading.value = true;
  try {
    const response = await getGenders({
      page: 1,
      limit: 999,
      sort: "namajeniskelamin",
      dir: "asc",
    });
    genderOptions.value = response.data?.[0]?.data || response.data?.data || [];
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat daftar jenis kelamin");
  } finally {
    gendersLoading.value = false;
  }
}

async function fetchUserTypes() {
  userTypesLoading.value = true;
  try {
    const response = await getUserTypes({
      page: 1,
      limit: 999,
      sort: "namajenispengguna",
      dir: "asc",
    });
    userTypeOptions.value =
      response.data?.[0]?.data || response.data?.data || [];
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat daftar jenis pengguna");
  } finally {
    userTypesLoading.value = false;
  }
}

async function fetchProvinces() {
  regionsLoading.value = true;
  try {
    const response = await getRegions({ filter: "tipewilayah=A", limit: 100 });
    provinceOptions.value =
      response.data?.[0]?.data || response.data?.data || [];
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat daftar provinsi");
  } finally {
    regionsLoading.value = false;
  }
}

async function fetchKabupaten(provCode) {
  kabupatenLoading.value = true;
  try {
    const response = await getRegions({
      filter: `tipewilayah=B,kodewilayah=${provCode}`,
      limit: 500,
    });
    kabupatenOptions.value =
      response.data?.[0]?.data || response.data?.data || [];

    if (formData.kodekabupaten && kabupatenOptions.value.length > 0) {
      const currentVal = String(formData.kodekabupaten);
      const exists = kabupatenOptions.value.some(
        (k) => k.kodewilayah === currentVal
      );
      if (!exists) {
        const cleanCurrent = currentVal.replace(/\./g, "");
        const match = kabupatenOptions.value.find(
          (k) => k.kodewilayah.replace(/\./g, "") === cleanCurrent
        );
        if (match) formData.kodekabupaten = match.kodewilayah;
      }
    }
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat daftar kabupaten");
  } finally {
    kabupatenLoading.value = false;
  }
}

async function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    toast.info("Sedang mengompres gambar...", { timeout: 2000 });
    const compressed = await compressImage(file);
    photoPreviewUrl.value = URL.createObjectURL(compressed);
    emit("photo-change", compressed);
    toast.success("Gambar berhasil dikompres", { timeout: 2000 });
  } catch (error) {
    toast.error("Gagal memproses gambar");
  }
}

function removePhoto() {
  photoPreviewUrl.value = null;
  formData.foto = null;
  if (fileInput.value) fileInput.value.value = null;
  emit("photo-change", null);
}

async function validateField(field) {
  try {
    await validationSchema.validateAt(field, formData);
    formErrors[field] = "";
  } catch (err) {
    formErrors[field] = err.message;
  }
}

async function validate() {
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    formErrors.nama = "";
    formErrors.nik = "";
    formErrors.email = "";
    return true;
  } catch (err) {
    const errors = {};
    err.inner.forEach((e) => (errors[e.path] = e.message));
    Object.assign(formErrors, errors);
    return false;
  }
}

defineExpose({ validate });
</script>

<style scoped>
.invalid-feedback {
  display: block;
}
</style>
