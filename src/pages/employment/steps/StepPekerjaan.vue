<template>
  <div class="step-pekerjaan">
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
            <i class="fa fa-briefcase me-2"></i>Riwayat Pekerjaan
          </h6>
          <p class="text-muted small mb-0">
            Tambahkan riwayat pekerjaan pegawai jika ada.
          </p>
        </div>
        <button class="btn btn-success btn-sm" @click="addPekerjaan">
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
        v-if="pekerjaanList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-briefcase text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">Belum ada data pekerjaan.</p>
        <button class="btn btn-outline-primary btn-sm" @click="addPekerjaan">
          <i class="fa fa-plus me-1"></i> Tambah Pekerjaan
        </button>
      </div>

      <transition-group name="list" tag="div">
        <div
          v-for="(item, index) in pekerjaanList"
          :key="item._tempId"
          class="card mb-3 shadow-sm border-0"
        >
          <div
            class="card-header bg-white d-flex justify-content-between align-items-center py-3"
          >
            <h6 class="mb-0 fw-bold text-primary">
              <span class="badge me-2" style="background-color: #0d6efd">{{
                index + 1
              }}</span>
              Data Pekerjaan
            </h6>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="removePekerjaan(index)"
              title="Hapus data ini"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Nama Pekerjaan <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namapekerjaan"
                  :class="{ 'is-invalid': getError(index, 'namapekerjaan') }"
                  placeholder="Masukkan nama pekerjaan"
                  required
                  @blur="validateField(index, 'namapekerjaan')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namapekerjaan") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Nama Perusahaan <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namaperusahaan"
                  :class="{ 'is-invalid': getError(index, 'namaperusahaan') }"
                  placeholder="Masukkan nama perusahaan"
                  required
                  @blur="validateField(index, 'namaperusahaan')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namaperusahaan") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Tipe Pekerjaan <span class="text-danger">*</span>
                </label>
                <select
                  class="form-select"
                  v-model="item.idtipepekerjaan"
                  :class="{ 'is-invalid': getError(index, 'idtipepekerjaan') }"
                  required
                  @blur="validateField(index, 'idtipepekerjaan')"
                >
                  <option value="" disabled>Pilih Tipe Pekerjaan</option>
                  <option
                    v-for="jt in jobTypeOptions"
                    :key="jt.idtipepekerjaan"
                    :value="jt.idtipepekerjaan"
                  >
                    {{ jt.namatipepekerjaan }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  {{ getError(index, "idtipepekerjaan") }}
                </div>
              </div>

              <div class="col-md-3">
                <label class="form-label fw-semibold">
                  Tanggal Mulai <span class="text-danger">*</span>
                </label>
                <input
                  type="date"
                  class="form-control"
                  v-model="item.tanggalmulai"
                  :class="{ 'is-invalid': getError(index, 'tanggalmulai') }"
                  required
                  @blur="validateField(index, 'tanggalmulai')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "tanggalmulai") }}
                </div>
              </div>

              <div class="col-md-3">
                <label class="form-label fw-semibold">Tanggal Selesai</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="item.tanggalselesai"
                />
                <div class="form-text small">Kosongkan jika masih bekerja.</div>
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
import { getJobTypes } from "@/services/referensi/jobTypes";
import {
  getUserWorkExperiences,
  deleteUserWorkExperience,
} from "@/services/general/personnel/userWorkExperiences";
import Swal from "sweetalert2";

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
const jobTypeOptions = ref([]);
const pekerjaanList = ref([]);
const formErrors = ref([]);

// === Lifecycle ===
onMounted(async () => {
  await fetchJobTypes();

  if (props.modelValue && Array.isArray(props.modelValue.list)) {
    pekerjaanList.value = props.modelValue.list.map((item) => ({
      ...item,
      _tempId: Date.now() + Math.random(),
    }));
    formErrors.value = pekerjaanList.value.map(() => ({}));
  } else {
    pekerjaanList.value = [];
    formErrors.value = [];
  }

  emit("validation-change", true);
});

// === Methods ===
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

async function loadData(userId) {
  isLoading.value = true;
  try {
    if (jobTypeOptions.value.length === 0) {
      await fetchJobTypes();
    }

    if (userId) {
      const res = await getUserWorkExperiences({
        filter: `idpengguna=${userId}`,
      });

      let rawData = [];
      if (Array.isArray(res.data)) {
        if (res.data[0] && res.data[0].data) {
          rawData = res.data[0].data;
        } else if (res.data.length > 0 && res.data[0].idpenggunapekerjaan) {
          rawData = res.data;
        }
      } else if (res.data && res.data.data) {
        rawData = res.data.data;
      }

      const filteredData = rawData.filter((d) => d.idpengguna === userId);

      const apiData = filteredData.map((d) => ({
        idpenggunapekerjaan: d.idpenggunapekerjaan,
        namapekerjaan: d.namapekerjaan || "",
        namaperusahaan: d.namaperusahaan || "",
        idtipepekerjaan: d.idtipepekerjaan || "",
        tanggalmulai: d.tanggalmulai || "",
        tanggalselesai: d.tanggalselesai || "",
        status: d.status || "Tidak Aktif",
        _tempId: Date.now() + Math.random(),
      }));

      const uniqueData = uniqueByKey(apiData, "idpenggunapekerjaan");

      pekerjaanList.value = uniqueData;
      formErrors.value = pekerjaanList.value.map(() => ({}));
      emit("update:modelValue", { list: pekerjaanList.value });
    }

    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchJobTypes() {
  try {
    const params = {
      page: 1,
      limit: 999,
      sort: "namatipepekerjaan",
      dir: "asc",
    };
    const response = await getJobTypes(params);

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        jobTypeOptions.value = response.data[0].data;
      } else {
        jobTypeOptions.value = response.data;
      }
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      jobTypeOptions.value = response.data.data;
    } else {
      jobTypeOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching job types:", error);
    toast.error("Gagal memuat data tipe pekerjaan.");
  }
}

function addPekerjaan() {
  pekerjaanList.value.push({
    _tempId: Date.now(),
    namapekerjaan: "",
    namaperusahaan: "",
    idtipepekerjaan: "",
    tanggalmulai: "",
    tanggalselesai: "",
    status: "Tidak Aktif",
  });

  formErrors.value.push({});
}

function removePekerjaan(index) {
  const item = pekerjaanList.value[index];

  Swal.fire({
    title: "Hapus Data?",
    text: item.idpenggunapekerjaan
      ? "Data pekerjaan ini akan dihapus. Tindakan ini tidak dapat dibatalkan."
      : "Data pekerjaan ini akan dihapus.",
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
        if (item.idpenggunapekerjaan) {
          await deleteUserWorkExperience(item.idpenggunapekerjaan);
        }
        toast.success("Data pekerjaan berhasil dihapus");

        pekerjaanList.value.splice(index, 1);
        formErrors.value.splice(index, 1);
      } catch (error) {
        console.error("Error deleting pekerjaan:", error);
        toast.error("Gagal menghapus data pekerjaan");
      }
    }
  });
}

function handleStatusChange(index, isChecked) {
  const newStatus = isChecked ? "Aktif" : "Tidak Aktif";
  pekerjaanList.value[index].status = newStatus;

  if (newStatus === "Aktif") {
    pekerjaanList.value.forEach((item, i) => {
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
  const item = pekerjaanList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "namapekerjaan") {
    if (!item.namapekerjaan) {
      formErrors.value[index].namapekerjaan = "Nama Pekerjaan wajib diisi.";
    } else {
      formErrors.value[index].namapekerjaan = "";
    }
  }

  if (field === "namaperusahaan") {
    if (!item.namaperusahaan) {
      formErrors.value[index].namaperusahaan = "Nama Perusahaan wajib diisi.";
    } else {
      formErrors.value[index].namaperusahaan = "";
    }
  }

  if (field === "idtipepekerjaan") {
    if (!item.idtipepekerjaan) {
      formErrors.value[index].idtipepekerjaan = "Tipe Pekerjaan wajib dipilih.";
    } else {
      formErrors.value[index].idtipepekerjaan = "";
    }
  }

  if (field === "tanggalmulai") {
    if (!item.tanggalmulai) {
      formErrors.value[index].tanggalmulai = "Tanggal Mulai wajib diisi.";
    } else {
      formErrors.value[index].tanggalmulai = "";
    }
  }
}

function validate() {
  let isValid = true;

  if (pekerjaanList.value.length === 0) {
    return true;
  }

  pekerjaanList.value.forEach((item, index) => {
    if (!formErrors.value[index]) formErrors.value[index] = {};

    if (!item.namapekerjaan) {
      formErrors.value[index].namapekerjaan = "Nama Pekerjaan wajib diisi.";
      isValid = false;
    } else {
      formErrors.value[index].namapekerjaan = "";
    }

    if (!item.namaperusahaan) {
      formErrors.value[index].namaperusahaan = "Nama Perusahaan wajib diisi.";
      isValid = false;
    } else {
      formErrors.value[index].namaperusahaan = "";
    }

    if (!item.idtipepekerjaan) {
      formErrors.value[index].idtipepekerjaan = "Tipe Pekerjaan wajib dipilih.";
      isValid = false;
    } else {
      formErrors.value[index].idtipepekerjaan = "";
    }

    if (!item.tanggalmulai) {
      formErrors.value[index].tanggalmulai = "Tanggal Mulai wajib diisi.";
      isValid = false;
    } else {
      formErrors.value[index].tanggalmulai = "";
    }
  });

  return isValid;
}

// === Sync & Watch ===
watch(
  pekerjaanList,
  (newList) => {
    emit("update:modelValue", { list: newList });
    let isValid = true;
    if (newList.length > 0) {
      isValid = newList.every(
        (item) =>
          item.namapekerjaan &&
          item.namaperusahaan &&
          item.idtipepekerjaan &&
          item.tanggalmulai
      );
    }

    emit("validation-change", isValid);
  },
  { deep: true }
);

defineExpose({ validate, loadData });
</script>

<style scoped>
.step-pekerjaan {
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
