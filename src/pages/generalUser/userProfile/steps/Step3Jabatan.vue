<template>
  <div class="step-jenjang">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Memuat data referensi...</p>
    </div>

    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="mb-1">
            <i class="fa fa-graduation-cap me-2"></i>Riwayat Jenjang
          </h6>
          <p class="text-muted small mb-0">
            Tambahkan riwayat jenjang/tingkatan pegawai jika ada.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" @click="addJenjang">
          <i class="fa fa-plus me-1"></i> Tambah Data
        </button>
      </div>

      <div
        class="border-start border-4 border-primary bg-light text-dark py-2 px-3 small mb-3 rounded"
      >
        <i class="fa fa-info-circle text-primary me-1"></i>
        <strong>Catatan:</strong> Hanya satu data yang boleh memiliki status
        <strong class="text-success"
          ><i class="fa fa-check-circle"></i> Aktif</strong
        >. Ketika Anda mengaktifkan satu data, data lainnya akan otomatis
        menjadi "Tidak Aktif".
      </div>

      <div
        v-if="jenjangList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-layer-group text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">Belum ada data jenjang jabatan.</p>
        <button class="btn btn-outline-primary btn-sm" @click="addJenjang">
          <i class="fa fa-plus me-1"></i> Tambah Jenjang
        </button>
      </div>

      <transition-group name="list" tag="div">
        <div
          v-for="(item, index) in jenjangList"
          :key="item._tempId"
          class="card mb-3 shadow-sm border-0"
        >
          <div
            class="card-header bg-white d-flex justify-content-between align-items-center py-3"
          >
            <h6 class="mb-0 fw-bold text-primary">
              <span class="badge bg-primary me-2">{{ index + 1 }}</span>
              Data Jenjang
            </h6>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="removeJenjang(index)"
              title="Hapus data ini"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label fw-semibold">
                  Jenjang <span class="text-danger">*</span>
                </label>
                <select
                  class="form-select"
                  v-model="item.idjenjang"
                  :class="{ 'is-invalid': getError(index, 'idjenjang') }"
                  required
                  @blur="validateField(index, 'idjenjang')"
                >
                  <option value="" disabled>Pilih Jenjang</option>
                  <option
                    v-for="opt in levelOptions"
                    :key="opt.idjenjang"
                    :value="opt.idjenjang"
                  >
                    {{ opt.namajenjang }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  {{ getError(index, "idjenjang") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Tanggal Mulai <span class="text-danger">*</span>
                </label>
                <input
                  type="date"
                  class="form-control"
                  v-model="item.tglmulai"
                  :class="{ 'is-invalid': getError(index, 'tglmulai') }"
                  required
                  @blur="validateField(index, 'tglmulai')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "tglmulai") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Tanggal Selesai</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="item.tglselesai"
                />
                <div class="form-text small">Kosongkan jika masih aktif.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">File SK</label>

                <input
                  type="file"
                  class="form-control"
                  @change="(e) => handleFileUpload(index, e)"
                  accept=".pdf,.jpg,.jpeg,.png"
                />

                <div
                  v-if="isUrl(item.filesk)"
                  class="mt-2 p-2 border rounded bg-light d-flex align-items-center justify-content-between"
                >
                  <div class="d-flex align-items-center overflow-hidden">
                    <div class="me-3 text-danger">
                      <i class="fa fa-file-pdf-o fa-2x"></i>
                    </div>
                    <div class="text-truncate">
                      <small
                        class="text-muted d-block"
                        style="font-size: 0.75rem"
                        >File Tersimpan:</small
                      >
                      <span
                        class="fw-bold text-dark text-truncate d-block"
                        :title="item.filesk_preview"
                      >
                        {{ item.filesk_preview }}
                      </span>
                    </div>
                  </div>

                  <a
                    :href="item.filesk"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary ms-2 text-nowrap"
                  >
                    <i class="fa fa-external-link me-1"></i> Buka
                  </a>
                </div>

                <div
                  v-else-if="item.filesk_preview"
                  class="mt-2 p-2 border border-success rounded bg-white text-success"
                >
                  <div class="d-flex align-items-center">
                    <i class="fa fa-check-circle fa-lg me-2"></i>
                    <div class="overflow-hidden">
                      <small class="d-block text-muted"
                        >File baru dipilih:</small
                      >
                      <strong class="text-truncate d-block">{{
                        item.filesk_preview
                      }}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold d-block">Status</label>
                <div class="form-check form-switch mt-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    :id="'statusSwitch-' + index"
                    :checked="item.status === 'Aktif'"
                    @change="(e) => handleStatusChange(index, e.target.checked)"
                  />
                  <label
                    class="form-check-label"
                    :for="'statusSwitch-' + index"
                  >
                    {{ item.status || "Tidak Aktif" }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";

// === UPDATE IMPORT SESUAI PERMINTAAN ===
import { getPositionLevels } from "@/services/referensi/positionLevels";
import {
  getUserLevels,
  deleteUserLevel,
} from "@/services/general/personnel/userLevels";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ list: [] }),
  },
  currentUserId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "validation-change"]);
const toast = useToast();

const isLoading = ref(false);
const isDataLoaded = ref(false);
const levelOptions = ref([]); // Menyimpan data dari positionLevels
const jenjangList = ref([]); // Menyimpan data input user
const formErrors = ref([]);

// === Helper Functions ===
const isUrl = (string) => {
  return (
    typeof string === "string" && string.length > 0 && string.startsWith("http")
  );
};

// === Lifecycle ===
onMounted(async () => {
  // Load referensi terlebih dahulu
  await fetchReferenceLevels();

  if (props.modelValue && Array.isArray(props.modelValue.list)) {
    jenjangList.value = props.modelValue.list.map((item) => ({
      ...item,
      _tempId: Date.now() + Math.random(),
    }));
    formErrors.value = jenjangList.value.map(() => ({}));
  } else {
    jenjangList.value = [];
    formErrors.value = [];
  }

  emit("validation-change", true);
});

// === Methods ===

/**
 * Remove duplicates from array based on a key
 */
function uniqueByKey(array, key) {
  const seen = new Set();
  return array.filter((item) => {
    const keyValue = item[key];
    if (keyValue && seen.has(keyValue)) {
      return false;
    }
    if (keyValue) {
      seen.add(keyValue);
    }
    return true;
  });
}

// Fungsi mengambil data referensi positionLevels
async function fetchReferenceLevels() {
  try {
    const params = { page: 1, limit: 999, sort: "namajenjang", dir: "asc" };
    const response = await getPositionLevels(params);

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        levelOptions.value = response.data[0].data;
      } else {
        levelOptions.value = response.data;
      }
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      levelOptions.value = response.data.data;
    } else {
      levelOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching position levels:", error);
    toast.error("Gagal memuat data referensi jenjang jabatan.");
  }
}

// Fungsi load data user-levels dari database
async function loadData(userId) {
  isLoading.value = true;
  try {
    // Pastikan referensi sudah termuat
    if (levelOptions.value.length === 0) {
      await fetchReferenceLevels();
    }

    if (userId) {
      const res = await getUserLevels({ filter: `idpengguna=${userId}` });

      let rawData = [];
      // Handle variasi respon backend
      if (Array.isArray(res.data)) {
        if (res.data[0] && res.data[0].data) {
          rawData = res.data[0].data;
        } else if (res.data.length > 0 && res.data[0].idpenggunajenjang) {
          rawData = res.data;
        }
      } else if (res.data && res.data.data) {
        rawData = res.data.data;
      }

      console.log("[DEBUG] Step3 rawData count:", rawData.length);

      // Filter berdasarkan idpengguna jika perlu
      const filteredData = rawData.filter((d) => d.idpengguna === userId);

      console.log("[DEBUG] Step3 filteredData count:", filteredData.length);

      // Mapping sesuai struktur JSON yang diminta
      const apiData = filteredData.map((d) => ({
        idpenggunajenjang: d.idpenggunajenjang, // Primary Key
        idjenjang: d.idjenjang, // Foreign Key Jenjang
        tglmulai: d.tglmulai,
        tglselesai: d.tglselesai,
        status: d.status,
        filesk: d.filesk,
        filesk_preview: d.filesk ? d.filesk.split("/").pop() : "",
        _tempId: Date.now() + Math.random(),
      }));

      // Deduplicate by ID
      const uniqueData = uniqueByKey(apiData, "idpenggunajenjang");

      console.log("[DEBUG] Step3 uniqueData count:", uniqueData.length);
      console.log(
        "[DEBUG] Step3 uniqueData IDs:",
        uniqueData.map((d) => d.idpenggunajenjang)
      );

      jenjangList.value = uniqueData;
      formErrors.value = jenjangList.value.map(() => ({}));
      emit("update:modelValue", { list: jenjangList.value });
    }

    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    isLoading.value = false;
  }
}

function addJenjang() {
  jenjangList.value.push({
    _tempId: Date.now(),
    idjenjang: "",
    tglmulai: "",
    tglselesai: "",
    filesk: null,
    filesk_preview: "",
    status: "Tidak Aktif",
  });

  formErrors.value.push({});
}

function removeJenjang(index) {
  const item = jenjangList.value[index];

  Swal.fire({
    title: "Hapus Data?",
    text: item.idpenggunajenjang
      ? "Data jenjang ini akan dihapus dari database. Tindakan ini tidak dapat dibatalkan."
      : "Data jenjang ini akan dihapus.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: '<i class="fa fa-check me-2"></i> Hapus',
    cancelButtonText: '<i class="fa fa-times me-2"></i> Batal',
    cancelButtonColor: "#efefef",
    confirmButtonColor: "#d33",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        if (item.idpenggunajenjang) {
          await deleteUserLevel(item.idpenggunajenjang);
        }
        toast.success("Data jenjang berhasil dihapus");

        jenjangList.value.splice(index, 1);
        formErrors.value.splice(index, 1);
      } catch (error) {
        console.error("Error deleting user level:", error);
        toast.error("Gagal menghapus data jenjang");
      }
    }
  });
}

function handleFileUpload(index, event) {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      toast.warning("Ukuran file maksimal 5MB");
      event.target.value = "";
      return;
    }

    jenjangList.value[index].filesk = file;
    jenjangList.value[index].filesk_preview = file.name;
  }
}

function handleStatusChange(index, isChecked) {
  const newStatus = isChecked ? "Aktif" : "Tidak Aktif";
  jenjangList.value[index].status = newStatus;

  if (newStatus === "Aktif") {
    jenjangList.value.forEach((item, i) => {
      if (i !== index) {
        item.status = "Tidak Aktif";
      }
    });
  }
}

// === Validation Logic ===
function getError(index, field) {
  return formErrors.value[index] ? formErrors.value[index][field] : "";
}

function validateField(index, field) {
  const item = jenjangList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "idjenjang") {
    if (!item.idjenjang) {
      formErrors.value[index].idjenjang = "Jenjang wajib dipilih.";
    } else {
      formErrors.value[index].idjenjang = "";
    }
  }

  if (field === "tglmulai") {
    if (!item.tglmulai) {
      formErrors.value[index].tglmulai = "Tanggal Mulai wajib diisi.";
    } else {
      formErrors.value[index].tglmulai = "";
    }
  }
}

function validate() {
  let isValid = true;

  if (jenjangList.value.length === 0) {
    return true;
  }

  jenjangList.value.forEach((item, index) => {
    if (!formErrors.value[index]) formErrors.value[index] = {};

    if (!item.idjenjang) {
      formErrors.value[index].idjenjang = "Jenjang wajib dipilih.";
      isValid = false;
    } else {
      formErrors.value[index].idjenjang = "";
    }

    if (!item.tglmulai) {
      formErrors.value[index].tglmulai = "Tanggal Mulai wajib diisi.";
      isValid = false;
    } else {
      formErrors.value[index].tglmulai = "";
    }
  });

  return isValid;
}

// === Sync & Watch ===
watch(
  jenjangList,
  (newList) => {
    emit("update:modelValue", { list: newList });
    let isValid = true;
    if (newList.length > 0) {
      isValid = newList.every((item) => item.idjenjang && item.tglmulai);
    }

    emit("validation-change", isValid);
  },
  { deep: true }
);

defineExpose({ validate, loadData });
</script>

<style scoped>
.step-jenjang {
  padding: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.invalid-feedback {
  display: block;
}
</style>
