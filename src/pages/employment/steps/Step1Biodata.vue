<template>
  <div class="step-biodata">
    <div v-if="!selectionMade" class="selection-cards">
      <div class="row g-4">
        <div class="col-md-6">
          <div
            class="selection-card"
            :class="{ active: hoveredCard === 'existing' }"
            @mouseenter="hoveredCard = 'existing'"
            @mouseleave="hoveredCard = null"
            @click="selectMode('existing')"
          >
            <div class="card-icon">
              <i class="fa fa-users"></i>
            </div>
            <h5 class="card-title">Gunakan Data yang Sudah Ada</h5>
            <p class="card-description">
              Pilih dari daftar pengguna yang sudah terdaftar di sistem
            </p>
            <div class="card-action">
              <i class="fa fa-arrow-right"></i>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div
            class="selection-card"
            :class="{ active: hoveredCard === 'new' }"
            @mouseenter="hoveredCard = 'new'"
            @mouseleave="hoveredCard = null"
            @click="selectMode('new')"
          >
            <div class="card-icon">
              <i class="fa fa-user-plus"></i>
            </div>
            <h5 class="card-title">Buat Data Baru</h5>
            <p class="card-description">
              Tambahkan pengguna baru dengan mengisi form biodata lengkap
            </p>
            <div class="card-action">
              <i class="fa fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="mode === 'existing'" class="existing-user-section">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="mb-0">Pilih Pengguna yang Sudah Ada</h6>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="resetSelection"
        >
          <i class="fa fa-arrow-left me-1"></i>Kembali
        </button>
      </div>

      <div class="mb-3">
        <label class="form-label fw-semibold">
          Cari Pengguna <span class="text-danger">*</span>
        </label>
        <select
          class="form-select"
          v-model="selectedUserId"
          :disabled="usersLoading"
          @change="onUserSelected"
        >
          <option value="" disabled>
            {{ usersLoading ? "Memuat data..." : "Pilih pengguna" }}
          </option>
          <option
            v-for="user in userOptions"
            :key="user.idpengguna"
            :value="user.idpengguna"
          >
            {{ user.nama }} - {{ user.email }}
          </option>
        </select>
      </div>

      <div v-if="selectedUser" class="user-data-display">
        <div class="row">
          <div class="col-12 mb-3">
            <div class="user-header-card">
              <div class="row align-items-center">
                <div class="col-auto">
                  <img
                    v-if="selectedUser.foto"
                    :src="selectedUser.foto"
                    alt="Foto"
                    class="user-avatar-large"
                  />
                  <div v-else class="user-avatar-placeholder-large">
                    <i class="fa fa-user"></i>
                  </div>
                </div>
                <div class="col">
                  <h5 class="mb-1">{{ selectedUser.nama }}</h5>
                  <p class="mb-0 text-white-50">{{ selectedUser.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold text-muted small"
              >Gelar Depan</label
            >
            <div class="form-control-plaintext">
              {{ selectedUser.gelardepan || "-" }}
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold text-muted small"
              >Gelar Belakang</label
            >
            <div class="form-control-plaintext">
              {{ selectedUser.gelarbelakang || "-" }}
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold text-muted small">NIK</label>
            <div class="form-control-plaintext">
              {{ selectedUser.nik || "-" }}
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold text-muted small">NIP</label>
            <div class="form-control-plaintext">
              {{ selectedUser.nip || "-" }}
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold text-muted small"
              >No. Telepon</label
            >
            <div class="form-control-plaintext">
              {{ selectedUser.telp || "-" }}
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold text-muted small"
              >No. Karpeg</label
            >
            <div class="form-control-plaintext">
              {{ selectedUser.no_karpeg || "-" }}
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold text-muted small"
              >Level / Role</label
            >
            <div class="form-control-plaintext">
              {{ getLevelName(selectedUser.idlevel) }}
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold text-muted small"
              >Status</label
            >
            <div class="form-control-plaintext">
              <span
                :class="
                  selectedUser.status === 'Aktif'
                    ? 'badge bg-success'
                    : 'badge bg-secondary'
                "
              >
                {{ selectedUser.status || "-" }}
              </span>
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold text-muted small"
              >Tempat Lahir</label
            >
            <div class="form-control-plaintext">
              {{ selectedUser.tempatlahir || "-" }}
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold text-muted small"
              >Tanggal Lahir</label
            >
            <div class="form-control-plaintext">
              {{ selectedUser.tanggallahir || "-" }}
            </div>
          </div>

          <div class="col-12 mb-3">
            <label class="form-label fw-semibold text-muted small"
              >Alamat</label
            >
            <div class="form-control-plaintext">
              {{ selectedUser.alamat || "-" }}
            </div>
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold text-muted small"
              >Provinsi</label
            >
            <div class="form-control-plaintext">
              {{ getProvinceName(selectedUser.kodekabupaten) }}
            </div>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold text-muted small"
              >Kabupaten</label
            >
            <div class="form-control-plaintext">
              {{ getKabupatenName(selectedUser.kodekabupaten) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="mode === 'new'" class="new-user-section">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="mb-0">Form Biodata Baru</h6>
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="resetSelection"
        >
          <i class="fa fa-arrow-left me-1"></i>Kembali
        </button>
      </div>

      <div class="row">
        <div class="col-12 mb-3">
          <label class="form-label fw-semibold">
            Nama Lengkap <span class="text-danger">*</span>
          </label>
          <input
            type="text"
            class="form-control"
            v-model="formData.nama"
            placeholder="Nama lengkap pegawai"
            required
          />
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Gelar Depan</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.gelardepan"
            placeholder="Contoh: Dr., Ir."
          />
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Gelar Belakang</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.gelarbelakang"
            placeholder="Contoh: S.Kom, M.M."
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
          <label class="form-label fw-semibold">NIP</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.nip"
            placeholder="Nomor Induk Pegawai"
          />
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">
            Email <span class="text-danger">*</span>
          </label>
          <input
            type="email"
            class="form-control"
            v-model="formData.email"
            placeholder="email@instansi.go.id"
            required
          />
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
          <label class="form-label fw-semibold">No. Karpeg</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.no_karpeg"
            placeholder="Kartu Pegawai"
          />
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">
            Level / Role <span class="text-danger">*</span>
          </label>
          <select
            class="form-select"
            v-model="formData.idlevel"
            :disabled="rolesLoading"
            required
          >
            <option value="" disabled>
              {{ rolesLoading ? "Memuat..." : "Pilih Level" }}
            </option>
            <option
              v-for="role in roleOptions"
              :key="role.idlevel"
              :value="role.idlevel"
            >
              {{ role.namalevel }}
            </option>
          </select>
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
            placeholder="Jalan, RT/RW, Dusun..."
            rows="2"
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
            ref="fileInput"
          />

          <div class="mt-3" v-if="photoPreviewUrl">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import { getUsers } from "@/services/referensi/users";
import { getRoles } from "@/services/referensi/roles";
import { getRegions } from "@/services/referensi/regions";
import { compressImage } from "@/utils/imageCompressor";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "validation-change"]);
const toast = useToast();

// === Selection State ===
const selectionMade = ref(false);
const mode = ref(""); // 'existing' or 'new'
const hoveredCard = ref(null);

// === Existing User State ===
const userOptions = ref([]);
const usersLoading = ref(false);
const selectedUserId = ref("");
const selectedUser = ref(null);

// === New User State ===
const roleOptions = ref([]);
const rolesLoading = ref(false);
const allRegions = ref([]);
const regionsLoading = ref(false);

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

const selectedPhotoFile = ref(null);
const photoPreviewUrl = ref(null);
const fileInput = ref(null);

// === Computed ===
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

const isValid = computed(() => {
  if (mode.value === "existing") {
    return !!selectedUserId.value;
  } else if (mode.value === "new") {
    return !!(formData.nama && formData.email && formData.idlevel);
  }
  return false;
});

// === Lifecycle ===
onMounted(() => {
  // FIX: Jika mode masih kosong saat dimuat, paksa selectionMade ke false
  // Ini mencegah layar blank jika state sebelumnya tertinggal
  if (!mode.value) {
    selectionMade.value = false;
  }

  fetchUsers();
  fetchRolesData();
  fetchRegions();
});

onUnmounted(() => {
  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }
});

// === Watchers ===

// WATCHER BARU: Reset tampilan jika parent mereset data (misal saat tambah data baru)
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && Object.keys(newVal).length === 0) {
      // Jika data kosong (reset) dan masih ada status pilihan, reset ke awal
      if (selectionMade.value || mode.value !== "") {
        resetSelection();
      }
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
  selectionMade,
  (made) => {
    // When showing card selection (selectionMade = false), emit false validation
    // This prevents user from proceeding without selecting a mode
    if (!made) {
      emit("validation-change", false);
    }
  },
  { immediate: true }
);

watch(isValid, (valid) => {
  emit("validation-change", valid);
});

watch(
  [mode, selectedUser, formData],
  () => {
    const data = {
      mode: mode.value,
      isExisting: mode.value === "existing",
      userId: selectedUserId.value,
      userData:
        mode.value === "existing" ? selectedUser.value : { ...formData },
      photoFile: selectedPhotoFile.value,
    };
    emit("update:modelValue", data);
  },
  { deep: true }
);

// === Methods ===
function selectMode(selectedMode) {
  mode.value = selectedMode;
  selectionMade.value = true;
}

function resetSelection() {
  selectionMade.value = false;
  mode.value = "";
  selectedUserId.value = "";
  selectedUser.value = null;
  Object.keys(formData).forEach((key) => (formData[key] = ""));
  formData.status = "Aktif";
  formData.foto = null;
  selectedPhotoFile.value = null;
  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }
  photoPreviewUrl.value = null;
  if (fileInput.value) fileInput.value.value = null;
}

async function fetchUsers() {
  usersLoading.value = true;
  try {
    const params = { page: 1, limit: 999, sort: "nama", dir: "asc" };
    const response = await getUsers(params);

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        userOptions.value = response.data[0].data;
      } else {
        userOptions.value = response.data;
      }
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      userOptions.value = response.data.data;
    } else {
      userOptions.value = [];
    }
  } catch (error) {
    toast.error("Gagal memuat daftar pengguna.");
  } finally {
    usersLoading.value = false;
  }
}

function onUserSelected() {
  selectedUser.value =
    userOptions.value.find((u) => u.idpengguna === selectedUserId.value) ||
    null;
}

function getLevelName(idlevel) {
  const role = roleOptions.value.find((r) => r.idlevel === idlevel);
  return role ? role.namalevel : "-";
}

function getProvinceName(kodekabupaten) {
  if (!kodekabupaten) return "-";
  const kodeprov = kodekabupaten.split(".")[0];
  const prov = allRegions.value.find((r) => r.kodewilayah === kodeprov);
  return prov ? prov.namawilayah : "-";
}

function getKabupatenName(kodekabupaten) {
  if (!kodekabupaten) return "-";
  const kab = allRegions.value.find((r) => r.kodewilayah === kodekabupaten);
  return kab ? kab.namawilayah : "-";
}

async function fetchRolesData() {
  rolesLoading.value = true;
  try {
    const params = { page: 1, limit: 999, sort: "namalevel", dir: "asc" };
    const response = await getRoles(params);

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        roleOptions.value = response.data[0].data;
      } else {
        roleOptions.value = response.data;
      }
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      roleOptions.value = response.data.data;
    } else {
      roleOptions.value = [];
    }
  } catch (error) {
    toast.error("Gagal memuat daftar level/role.");
  } finally {
    rolesLoading.value = false;
  }
}

async function fetchRegions() {
  regionsLoading.value = true;
  try {
    const params = { page: 1, limit: 100, sort: "kodewilayah", dir: "asc" };
    const response = await getRegions(params);

    let accumulatedData = [];
    let lastPage = 1;

    if (Array.isArray(response.data) && response.data.length > 0) {
      const rootData = response.data[0];
      if (rootData.data) accumulatedData = rootData.data;
      if (rootData.meta?.pagination)
        lastPage = rootData.meta.pagination.last_page;
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
    toast.error("Gagal memuat daftar wilayah.");
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

  if (!file) {
    selectedPhotoFile.value = null;
    photoPreviewUrl.value = null;
    if (input) input.value = null;
    return;
  }

  if (!file.type.startsWith("image/")) {
    toast.error("File yang diupload harus berupa gambar.");
    selectedPhotoFile.value = null;
    photoPreviewUrl.value = null;
    if (input) input.value = null;
    return;
  }

  try {
    toast.info("Sedang mengompres gambar...", { timeout: 2000 });
    const compressedFile = await compressImage(file);
    selectedPhotoFile.value = compressedFile;
    photoPreviewUrl.value = URL.createObjectURL(compressedFile);
  } catch (error) {
    toast.error("Gagal memproses gambar: " + error.message);
    selectedPhotoFile.value = null;
    photoPreviewUrl.value = null;
    if (input) input.value = null;
  }
}

function removePhoto() {
  if (photoPreviewUrl.value && photoPreviewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(photoPreviewUrl.value);
  }
  if (fileInput.value) fileInput.value.value = null;
  selectedPhotoFile.value = null;
  photoPreviewUrl.value = null;
}
</script>

<style scoped>
.step-biodata {
  padding: 1rem 0;
}

/* Selection Cards */
.selection-cards {
  padding: 2rem 0;
  min-height: 300px; /* Ensure visibility */
}

.selection-card {
  background: #fff;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.selection-card:hover,
.selection-card.active {
  border-color: #0d6efd;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.15);
  transform: translateY(-4px);
}

.card-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.selection-card:hover .card-icon,
.selection-card.active .card-icon {
  transform: scale(1.1);
}

.card-icon i {
  font-size: 2rem;
  color: white;
}

.card-title {
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.75rem;
}

.card-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.card-action {
  margin-top: auto;
  color: #0d6efd;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.selection-card:hover .card-action,
.selection-card.active .card-action {
  opacity: 1;
}

/* User Data Display */
.user-data-display {
  animation: fadeIn 0.3s ease;
}

.user-header-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.user-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
}

.user-avatar-placeholder-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  border: 3px solid white;
}

.form-control-plaintext {
  padding: 0.375rem 0;
  font-weight: 500;
  color: #212529;
}

/* Sections */
.existing-user-section,
.new-user-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
