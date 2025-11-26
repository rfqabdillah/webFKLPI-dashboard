<template>
  <div class="step-biodata">
    <div
      v-show="showCards && !isEditMode"
      ref="cardsContainer"
      class="selection-cards row g-4 justify-content-center mb-4"
    >
      <div class="col-md-5 col-lg-4">
        <div
          class="selection-card"
          :class="{ active: hoveredCard === 'existing' }"
          @mouseenter="hoveredCard = 'existing'"
          @mouseleave="hoveredCard = null"
          @click="selectMode('existing')"
        >
          <div class="card-content">
            <div class="card-icon">
              <i class="fa fa-users"></i>
            </div>
            <h6 class="card-title">Gunakan Data yang Ada</h6>
            <p class="card-description">
              Pilih dari daftar pengguna yang sudah terdaftar
            </p>
            <div class="card-action">
              <i class="fa fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-5 col-lg-4">
        <div
          class="selection-card"
          :class="{ active: hoveredCard === 'new' }"
          @mouseenter="hoveredCard = 'new'"
          @mouseleave="hoveredCard = null"
          @click="selectMode('new')"
        >
          <div class="card-content">
            <div class="card-icon">
              <i class="fa fa-user-plus"></i>
            </div>
            <h6 class="card-title">Input Data Baru</h6>
            <p class="card-description">
              Isi formulir biodata untuk pengguna baru
            </p>
            <div class="card-action">
              <i class="fa fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="mode === 'existing' && !isEditMode && !selectedUser"
      class="existing-user-section"
    >
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="mb-0">
          <i class="fa fa-search me-2"></i>Pilih Pengguna Existing
        </h6>
        <button
          class="btn btn-outline-secondary btn-sm"
          @click="resetSelection"
        >
          <i class="fa fa-arrow-left me-1"></i> Kembali
        </button>
      </div>

      <div class="user-selection-interface">
        <div class="row mb-3">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0">
                <i class="fa fa-search text-muted"></i>
              </span>
              <input
                type="text"
                class="form-control border-start-0 ps-0"
                placeholder="Cari berdasarkan nama, NIP, atau email"
                v-model="searchQuery"
                @input="handleSearch"
              />
            </div>
          </div>
        </div>

        <div class="table-responsive border rounded">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th style="width: 50px" class="text-center">#</th>
                <th>Nama Pegawai</th>
                <th>NIP / NIK</th>
                <th>Email</th>
                <th style="width: 100px" class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="usersLoading">
                <td colspan="5" class="text-center py-4">
                  <div
                    class="spinner-border text-primary spinner-border-sm"
                    role="status"
                  ></div>
                  <span class="ms-2 text-muted">Memuat data...</span>
                </td>
              </tr>
              <tr v-else-if="filteredUsers.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">
                  <i class="fa fa-info-circle me-1"></i>
                  {{
                    searchQuery
                      ? "Tidak ada pengguna yang cocok."
                      : "Belum ada data pengguna."
                  }}
                </td>
              </tr>
              <tr
                v-else
                v-for="(user, index) in filteredUsers"
                :key="user.idpengguna"
              >
                <td class="text-center">{{ index + 1 }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div v-if="user.foto" class="me-2">
                      <img
                        :src="user.foto"
                        class="rounded-circle"
                        style="width: 32px; height: 32px; object-fit: cover"
                        alt="Foto"
                      />
                    </div>
                    <div
                      v-else
                      class="avatar-circle me-2 bg-primary text-white d-flex align-items-center justify-content-center rounded-circle"
                      style="width: 32px; height: 32px; font-size: 12px"
                    >
                      {{ user.nama ? user.nama.charAt(0).toUpperCase() : "?" }}
                    </div>
                    <div>
                      <div class="fw-bold">{{ user.nama }}</div>
                      <div class="small text-muted">
                        {{ user.jabatan || "-" }}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="small">{{ user.nip || "-" }}</div>
                  <div class="small text-muted">{{ user.nik || "-" }}</div>
                </td>
                <td>{{ user.email }}</td>
                <td class="text-center">
                  <button
                    class="btn btn-primary btn-sm"
                    @click="selectUser(user)"
                  >
                    Pilih
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="d-flex justify-content-between align-items-center mt-2 text-muted small"
        >
          <div>Menampilkan {{ filteredUsers.length }} data</div>
        </div>
      </div>
    </div>

    <!-- Form Input Section (Shown for New User, Edit Mode, OR Selected Existing User) -->
    <div
      v-if="
        mode === 'new' || isEditMode || (mode === 'existing' && selectedUser)
      "
      class="user-form-section"
    >
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="mb-0">
          <i
            class="fa"
            :class="
              isEditMode
                ? 'fa-edit'
                : mode === 'existing'
                ? 'fa-user-check'
                : 'fa-user-plus'
            "
          ></i>
          {{
            isEditMode
              ? "Edit Biodata"
              : mode === "existing"
              ? "Konfirmasi Data Pengguna"
              : "Input Biodata Baru"
          }}
        </h6>
        <button
          v-if="!isEditMode"
          class="btn btn-outline-secondary btn-sm"
          @click="resetSelection"
        >
          <i class="fa fa-arrow-left me-1"></i> Kembali
        </button>
      </div>

      <div class="row">
        <div class="col-12 mb-3">
          <label class="form-label fw-semibold"
            >Nama Lengkap <span class="text-danger">*</span></label
          >
          <input
            type="text"
            class="form-control"
            v-model="formData.nama"
            :class="{ 'is-invalid': formErrors.nama }"
            placeholder="Nama lengkap"
            @blur="validateField('nama')"
          />
          <div class="invalid-feedback">{{ formErrors.nama }}</div>
        </div>

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

        <div class="col-12 mb-3">
          <label class="form-label fw-semibold">NIK</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.nik"
            placeholder="Nomor Induk Kependudukan"
          />
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold"
            >Email <span class="text-danger">*</span></label
          >
          <input
            type="email"
            class="form-control"
            v-model="formData.email"
            :class="{ 'is-invalid': formErrors.email }"
            placeholder="email@instansi.go.id"
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

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold"
            >Level / Role <span class="text-danger">*</span></label
          >
          <select
            class="form-select"
            v-model="formData.idlevel"
            :class="{ 'is-invalid': formErrors.idlevel }"
            @blur="validateField('idlevel')"
            :disabled="rolesLoading"
          >
            <option value="" disabled>Pilih Level</option>
            <option
              v-for="role in roleOptions"
              :key="role.idlevel"
              :value="String(role.idlevel)"
            >
              {{ role.namalevel }}
            </option>
          </select>
          <div class="invalid-feedback">{{ formErrors.idlevel }}</div>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold d-block">Status Akun</label>
          <div class="form-check form-switch mt-2">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="statusSwitch"
              v-model="formData.status"
              true-value="Aktif"
              false-value="Tidak Aktif"
            />
            <label class="form-check-label" for="statusSwitch">
              {{ formData.status || "Tidak Aktif" }}
            </label>
          </div>
          <div class="invalid-feedback d-block" v-if="formErrors.status">
            {{ formErrors.status }}
          </div>
        </div>

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

        <div class="col-12 mb-3">
          <label class="form-label fw-semibold">Alamat Lengkap</label>
          <textarea
            class="form-control"
            v-model="formData.alamat"
            placeholder="Alamat domisili"
          ></textarea>
        </div>

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
            :disabled="!formData.kodepropinsi || regionsLoading"
          >
            <option value="" disabled>
              {{
                regionsLoading
                  ? "Memuat..."
                  : formData.kodepropinsi
                  ? "Pilih Kabupaten"
                  : "Silakan pilih Provinsi terlebih dahulu"
              }}
            </option>
            <template v-if="!regionsLoading">
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

        <div class="col-12 mb-3">
          <label class="form-label fw-semibold">Upload Foto</label>
          <input
            type="file"
            class="form-control"
            @change="handlePhotoUpload"
            accept="image/*"
            :class="{ 'is-invalid': formErrors.foto }"
            ref="fileInput"
          />
          <div class="invalid-feedback">{{ formErrors.foto }}</div>
          <small
            v-if="isEditMode || (mode === 'existing' && selectedUser)"
            class="form-text text-muted"
          >
            Kosongkan jika tidak ingin mengubah foto.
          </small>

          <div
            class="mt-3"
            v-if="
              photoPreviewUrl ||
              ((isEditMode || mode === 'existing') && formData.foto)
            "
          >
            <div class="position-relative d-inline-block">
              <div v-if="photoPreviewUrl">
                <img
                  :src="photoPreviewUrl"
                  alt="Preview Foto Baru"
                  class="img-thumbnail shadow-sm"
                  style="
                    width: 120px;
                    height: 120px;
                    object-fit: cover;
                    background-color: #f8f9fa;
                  "
                />
              </div>
              <div
                v-else-if="(isEditMode || mode === 'existing') && formData.foto"
              >
                <img
                  :src="formData.foto"
                  alt="Foto Saat Ini"
                  class="img-thumbnail shadow-sm"
                  style="
                    width: 120px;
                    height: 120px;
                    object-fit: cover;
                    background-color: #f8f9fa;
                  "
                />
              </div>

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

      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { getUsers } from "@/services/referensi/users";
import { getRoles } from "@/services/referensi/roles";
import { getRegions } from "@/services/referensi/regions";
import { compressImage } from "@/utils/imageCompressor";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  fieldToEdit: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue", "validation-change"]);
const toast = useToast();

// === State ===
const selectionMade = ref(false);
const mode = ref("");
const hoveredCard = ref(null);
const cardsContainer = ref(null);

const userOptions = ref([]);
const usersLoading = ref(false);
const selectedUserId = ref("");
const selectedUser = ref(null);
const searchQuery = ref("");

const roleOptions = ref([]);
const rolesLoading = ref(false);
const allRegions = ref([]);
const regionsLoading = ref(false);
const errorMessage = ref(null);

const formData = reactive({
  idlevel: "",
  email: "",
  nama: "",
  gelardepan: "",
  gelarbelakang: "",
  nik: "",
  telp: "",
  tempatlahir: "",
  tanggallahir: "",
  alamat: "",
  kodepropinsi: "",
  kodekabupaten: "",
  nip: "",
  no_karpeg: "",
  status: "Aktif",
  foto: null,
});

const formErrors = reactive({
  idlevel: "",
  email: "",
  nama: "",
  foto: "",
  status: "",
});

const selectedPhotoFile = ref(null);
const photoPreviewUrl = ref(null);
const fileInput = ref(null);
const isPhotoRemoved = ref(false);
const isUpdatingFromParent = ref(false);

// === Validation Schema  ===
const validationSchema = yup.object().shape({
  nama: yup.string().required("Nama wajib diisi."),
  email: yup
    .string()
    .email("Format email salah")
    .required("Email wajib diisi."),
  idlevel: yup.string().required("Level wajib dipilih."),
  status: yup.string().required("Status wajib dipilih."),
});

// === Computed  ===
const isEditMode = computed(() => !!props.fieldToEdit);

const showCards = computed(() => {
  return !selectionMade.value && !isEditMode.value;
});

const provinceOptions = computed(() => {
  return allRegions.value
    .filter((r) => r.tipewilayah === "A")
    .sort((a, b) =>
      a.kodewilayah.localeCompare(b.kodewilayah, undefined, { numeric: true })
    );
});

const kabupatenOptions = computed(() => {
  if (!formData.kodepropinsi) return [];
  return allRegions.value
    .filter((r) => {
      return (
        r.tipewilayah === "B" &&
        r.kodewilayah.startsWith(formData.kodepropinsi + ".")
      );
    })
    .sort((a, b) =>
      a.kodewilayah.localeCompare(b.kodewilayah, undefined, { numeric: true })
    );
});

const filteredUsers = computed(() => {
  if (!searchQuery.value) return userOptions.value;
  const query = searchQuery.value.toLowerCase();
  return userOptions.value.filter(
    (user) =>
      (user.nama && user.nama.toLowerCase().includes(query)) ||
      (user.nip && user.nip.toLowerCase().includes(query)) ||
      (user.nik && user.nik.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query))
  );
});

// === Lifecycle ===
onMounted(async () => {
  await Promise.all([fetchRolesData(), fetchRegions()]);

  if (isEditMode.value) {
    populateFormData(props.fieldToEdit);
    mode.value = "new";
    selectionMade.value = true;
  } else if (!mode.value) {
    selectionMade.value = false;
    fetchUsers();
  }
});

onUnmounted(() => {
  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }
});

// === Watchers ===
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      isUpdatingFromParent.value = true;
      if (newVal.mode) {
        mode.value = newVal.mode;
        selectionMade.value = true;

        if (newVal.mode === "existing") {
          selectedUserId.value = newVal.userId;
          // Jika ada userData dari parent (misal saat back/next), populate
          if (newVal.userData) {
            Object.assign(formData, newVal.userData);
          }
        } else if (newVal.mode === "new" && newVal.userData) {
          if (!isEditMode.value) {
            Object.assign(formData, newVal.userData);
          }
        }
      } else if (!isEditMode.value) {
        resetSelection();
      }
      nextTick(() => {
        isUpdatingFromParent.value = false;
      });
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => formData.kodepropinsi,
  (newProv) => {
    if (!newProv) {
      formData.kodekabupaten = "";
      return;
    }
    if (formData.kodekabupaten && !formData.kodekabupaten.startsWith(newProv)) {
      formData.kodekabupaten = "";
    }
  }
);

watch(
  [mode, selectedUserId, formData],
  async () => {
    if (isUpdatingFromParent.value) return;

    let isValid = false;
    if (selectionMade.value) {
      try {
        await validationSchema.validate(formData);
        isValid = true;
      } catch (err) {
        isValid = false;
      }
    }

    emit("validation-change", isValid);

    const data = {
      mode: isEditMode.value ? "edit" : mode.value,
      isExisting: mode.value === "existing" && !isEditMode.value,
      userId: isEditMode.value
        ? props.fieldToEdit.idpengguna
        : selectedUserId.value,
      userData: { ...formData },
      photoFile: selectedPhotoFile.value,
      isPhotoRemoved: isPhotoRemoved.value,
    };
    emit("update:modelValue", data);
  },
  { deep: true }
);

// === Methods ===
function populateFormData(data) {
  if (!data) return;

  formData.idlevel = data.idlevel ? String(data.idlevel) : "";
  formData.email = data.email || "";
  formData.nama = data.nama || "";
  formData.gelardepan = data.gelardepan || "";
  formData.gelarbelakang = data.gelarbelakang || "";
  formData.nik = data.nik || "";
  formData.telp = data.telp || "";
  formData.nip = data.nip || "";
  formData.no_karpeg = data.no_karpeg || "";
  formData.status = data.status || "Aktif";
  formData.tempatlahir = data.tempatlahir || "";
  formData.tanggallahir = data.tanggallahir || "";
  formData.alamat = data.alamat || "";

  formData.kodekabupaten = data.kodekabupaten || "";
  formData.kodepropinsi = data.kodekabupaten
    ? data.kodekabupaten.split(".")[0]
    : "";

  formData.foto = data.foto;
  if (data.foto) {
    // photoPreviewUrl.value = data.foto; // UserFormModal logic handles this in template
  }
}

async function validate() {
  if (selectionMade.value) {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      return true;
    } catch (err) {
      err.inner.forEach((error) => {
        formErrors[error.path] = error.message;
      });
      return false;
    }
  }
  return false;
}

async function validateField(field) {
  try {
    await validationSchema.validateAt(field, formData);
    formErrors[field] = "";
  } catch (err) {
    formErrors[field] = err.message;
  }
}

function selectMode(selectedMode) {
  mode.value = selectedMode;
  selectionMade.value = true;
  if (selectedMode === "existing") {
    fetchUsers();
  }
}

function resetSelection() {
  selectionMade.value = false;
  mode.value = "";
  selectedUserId.value = "";
  selectedUser.value = null;

  // Reset Form
  Object.keys(formData).forEach((key) => (formData[key] = ""));
  formData.status = "Aktif";
  formData.foto = null;
  selectedPhotoFile.value = null;
  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }
  photoPreviewUrl.value = null;
  if (fileInput.value) fileInput.value.value = null;
  isPhotoRemoved.value = false;

  // Reset errors
  Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
  errorMessage.value = null;
}

async function fetchUsers() {
  usersLoading.value = true;
  try {
    const params = { page: 1, limit: 999, sort: "nama", dir: "asc" };
    const response = await getUsers(params);

    console.log("Fetch Users Response:", response);

    if (response.data && Array.isArray(response.data)) {
      if (
        response.data.length > 0 &&
        response.data[0].data &&
        Array.isArray(response.data[0].data)
      ) {
        userOptions.value = response.data[0].data;
      } else {
        userOptions.value = response.data;
      }
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      userOptions.value = response.data.data;
    } else {
      userOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Gagal memuat daftar pengguna.");
    userOptions.value = [];
  } finally {
    usersLoading.value = false;
  }
}

function selectUser(user) {
  selectedUser.value = user;
  selectedUserId.value = user.idpengguna || user.email;
  nextTick(() => {
    populateFormData(user);
  });
}

function handleSearch() {}

async function fetchRolesData() {
  rolesLoading.value = true;
  try {
    const params = {
      page: 1,
      limit: 999,
      sort: "namalevel",
      dir: "asc",
    };

    const response = await getRoles(params);

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        roleOptions.value = response.data[0].data;
      } else {
        roleOptions.value = response.data;
      }
    } else if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      roleOptions.value = response.data.data;
    } else {
      console.warn("Struktur data role tidak terduga:", response.data);
      roleOptions.value = [];
    }
  } catch (error) {
    console.error("Gagal memuat data roles:", error);
    toast.error("Gagal memuat daftar level/role.");
  } finally {
    rolesLoading.value = false;
  }
}

async function fetchRegions() {
  regionsLoading.value = true;
  try {
    const params = {
      page: 1,
      limit: 100,
      sort: "kodewilayah",
      dir: "asc",
    };

    const response = await getRegions(params);

    let accumulatedData = [];
    let lastPage = 1;
    if (Array.isArray(response.data) && response.data.length > 0) {
      const rootData = response.data[0];

      if (rootData.data) {
        accumulatedData = rootData.data;
      }

      if (rootData.meta && rootData.meta.pagination) {
        lastPage = rootData.meta.pagination.last_page;
      }
    }

    if (lastPage > 1) {
      const promises = [];
      for (let i = 2; i <= lastPage; i++) {
        promises.push(getRegions({ ...params, page: i }));
      }

      const results = await Promise.all(promises);

      results.forEach((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          accumulatedData = accumulatedData.concat(res.data[0].data);
        }
      });
    }
    allRegions.value = accumulatedData;
  } catch (error) {
    console.error("Gagal memuat data wilayah:", error);
    toast.error("Gagal memuat daftar wilayah lengkap.");
  } finally {
    regionsLoading.value = false;
  }
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
      isEditMode.value || mode.value === "existing" ? formData.foto : null;
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

  toast.info("Sedang mengompres gambar...", { timeout: 2000 });

  try {
    const compressedFile = await compressImage(file);

    selectedPhotoFile.value = compressedFile;
    photoPreviewUrl.value = URL.createObjectURL(compressedFile);
    formErrors.foto = "";
    isPhotoRemoved.value = false;
  } catch (error) {
    console.error("Error compressing image:", error);
    toast.error("Gagal memproses gambar.");
    resetToOriginal();
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

  if ((isEditMode.value || mode.value === "existing") && formData.foto) {
    if (!isBlobPreview) {
      photoPreviewUrl.value = null;
      formData.foto = null;
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

defineExpose({ validate });
</script>

<style scoped>
.step-biodata {
  padding: 0;
}

.selection-cards {
  padding: 0.5 rem 0;
}

.selection-card {
  background: #fff;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.selection-card:hover {
  border-color: #0d6efd;
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(13, 110, 253, 0.1);
}

.selection-card.active {
  border-color: #0d6efd;
  background-color: #f8fbff;
}

.card-icon {
  width: 60px;
  height: 60px;
  background: #e7f1ff;
  color: #0d6efd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 1.5rem;
  transition: all 0.3s ease;
}

.selection-card:hover .card-icon {
  background: #0d6efd;
  color: #fff;
  transform: scale(1.1);
}

.card-title {
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #343a40;
}

.card-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.card-action {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e9ecef;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.selection-card:hover .card-action {
  background: #0d6efd;
  color: #fff;
}

.invalid-feedback {
  display: block;
}
</style>
