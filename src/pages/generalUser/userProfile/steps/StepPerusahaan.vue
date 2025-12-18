<template>
  <div class="step-perusahaan">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Memuat data...</p>
    </div>

    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="mb-1">
            <i class="fa fa-briefcase me-2"></i>Riwayat Perusahaan
          </h6>
          <p class="text-muted small mb-0">
            Tambahkan riwayat perusahaan tempat Anda bekerja.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" @click="addPerusahaan">
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
        v-if="perusahaanList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-briefcase text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">Belum ada data perusahaan.</p>
        <button class="btn btn-outline-primary btn-sm" @click="addPerusahaan">
          <i class="fa fa-plus me-1"></i> Tambah Perusahaan
        </button>
      </div>

      <transition-group name="list" tag="div">
        <div
          v-for="(item, index) in perusahaanList"
          :key="item._tempId"
          class="card mb-3 shadow-sm border-0"
        >
          <div
            class="card-header bg-white d-flex justify-content-between align-items-center py-3"
          >
            <h6 class="mb-0 fw-bold text-primary">
              <span class="badge bg-primary me-2">{{ index + 1 }}</span>
              Data Perusahaan
            </h6>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="removePerusahaan(index)"
              title="Hapus data ini"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label fw-semibold">
                  Nama Perusahaan <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namaperusahaan"
                  :class="{ 'is-invalid': getError(index, 'namaperusahaan') }"
                  placeholder="Masukkan nama perusahaan"
                  @blur="validateField(index, 'namaperusahaan')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namaperusahaan") }}
                </div>
              </div>

              <div class="col-md-12">
                <label class="form-label fw-semibold">Alamat Perusahaan</label>
                <textarea
                  class="form-control"
                  v-model="item.alamat"
                  placeholder="Masukkan alamat perusahaan"
                  rows="2"
                ></textarea>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Tanggal Mulai <span class="text-danger">*</span>
                </label>
                <input
                  type="date"
                  class="form-control"
                  v-model="item.tanggalmulai"
                  :class="{ 'is-invalid': getError(index, 'tanggalmulai') }"
                  @blur="validateField(index, 'tanggalmulai')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "tanggalmulai") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Tanggal Selesai</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="item.tanggalselesai"
                />
                <div class="form-text small">
                  Kosongkan jika masih bekerja di perusahaan ini.
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
import {
  getUserCompanies,
  deleteUserCompany,
} from "@/services/general/personnel/userCompanies";
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
const perusahaanList = ref([]);
const formErrors = ref([]);

// === Helper Functions ===
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

// === Lifecycle ===
onMounted(async () => {
  if (props.modelValue && Array.isArray(props.modelValue.list)) {
    perusahaanList.value = props.modelValue.list.map((item) => ({
      ...item,
      _tempId: Date.now() + Math.random(),
    }));
    formErrors.value = perusahaanList.value.map(() => ({}));
  } else {
    perusahaanList.value = [];
    formErrors.value = [];
  }

  emit("validation-change", true);
});

// === Methods ===
async function loadData(userId) {
  isLoading.value = true;
  try {
    if (userId) {
      const res = await getUserCompanies({ filter: `idpengguna=${userId}` });

      let rawData = [];
      if (Array.isArray(res.data)) {
        if (res.data[0] && res.data[0].data) {
          rawData = res.data[0].data;
        } else if (res.data.length > 0 && res.data[0].idpenggunaperusahaan) {
          rawData = res.data;
        }
      } else if (res.data && res.data.data) {
        rawData = res.data.data;
      }

      const filteredData = rawData.filter((d) => d.idpengguna === userId);

      const apiData = filteredData.map((d) => ({
        idpenggunaperusahaan: d.idpenggunaperusahaan,
        namaperusahaan: d.namaperusahaan || "",
        alamat: d.alamat || "",
        tanggalmulai: d.tanggalmulai || "",
        tanggalselesai: d.tanggalselesai || "",
        status: d.status || "Tidak Aktif",
        _tempId: Date.now() + Math.random(),
      }));

      const uniqueData = uniqueByKey(apiData, "idpenggunaperusahaan");

      perusahaanList.value = uniqueData;
      formErrors.value = perusahaanList.value.map(() => ({}));
      emit("update:modelValue", { list: perusahaanList.value });
    }

    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    isLoading.value = false;
  }
}

function addPerusahaan() {
  perusahaanList.value.push({
    _tempId: Date.now(),
    namaperusahaan: "",
    alamat: "",
    tanggalmulai: "",
    tanggalselesai: "",
    status: "Tidak Aktif",
  });

  formErrors.value.push({});
}

function removePerusahaan(index) {
  const item = perusahaanList.value[index];

  Swal.fire({
    title: "Hapus Data?",
    text: item.idpenggunaperusahaan
      ? "Data perusahaan ini akan dihapus dari database. Tindakan ini tidak dapat dibatalkan."
      : "Data perusahaan ini akan dihapus.",
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
        if (item.idpenggunaperusahaan) {
          await deleteUserCompany(item.idpenggunaperusahaan);
        }
        toast.success("Data perusahaan berhasil dihapus");

        perusahaanList.value.splice(index, 1);
        formErrors.value.splice(index, 1);
      } catch (error) {
        console.error("Error deleting perusahaan:", error);
        toast.error("Gagal menghapus data perusahaan");
      }
    }
  });
}

function handleStatusChange(index, isChecked) {
  const newStatus = isChecked ? "Aktif" : "Tidak Aktif";
  perusahaanList.value[index].status = newStatus;

  if (newStatus === "Aktif") {
    perusahaanList.value.forEach((item, i) => {
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
  const item = perusahaanList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "namaperusahaan") {
    if (!item.namaperusahaan) {
      formErrors.value[index].namaperusahaan = "Nama Perusahaan wajib diisi.";
    } else {
      formErrors.value[index].namaperusahaan = "";
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

  if (perusahaanList.value.length === 0) {
    return true;
  }

  perusahaanList.value.forEach((item, index) => {
    if (!formErrors.value[index]) formErrors.value[index] = {};

    if (!item.namaperusahaan) {
      formErrors.value[index].namaperusahaan = "Nama Perusahaan wajib diisi.";
      isValid = false;
    } else {
      formErrors.value[index].namaperusahaan = "";
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
  perusahaanList,
  (newList) => {
    emit("update:modelValue", { list: newList });
    let isValid = true;
    if (newList.length > 0) {
      isValid = newList.every(
        (item) => item.namaperusahaan && item.tanggalmulai
      );
    }

    emit("validation-change", isValid);
  },
  { deep: true }
);

defineExpose({ validate, loadData });
</script>

<style scoped>
.step-perusahaan {
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
