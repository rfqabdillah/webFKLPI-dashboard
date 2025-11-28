<template>
  <div class="step-pelatihan">
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
            <i class="fa fa-certificate me-2"></i>Riwayat Pelatihan
          </h6>
          <p class="text-muted small mb-0">
            Tambahkan riwayat pelatihan atau kursus.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" @click="addPelatihan">
          <i class="fa fa-plus me-1"></i> Tambah Data
        </button>
      </div>

      <div class="alert alert-info py-2 small mb-3" role="alert">
        <i class="fa fa-info-circle me-1"></i>
        <strong>Catatan:</strong> Hanya satu data yang boleh memiliki status
        <span class="badge bg-success">Aktif</span>. Ketika Anda mengaktifkan
        satu data, data lainnya akan otomatis menjadi "Tidak Aktif".
      </div>

      <div
        v-if="pelatihanList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-certificate text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">Belum ada data pelatihan.</p>
        <button class="btn btn-outline-primary btn-sm" @click="addPelatihan">
          <i class="fa fa-plus me-1"></i> Tambah Pelatihan
        </button>
      </div>

      <transition-group name="list" tag="div">
        <div
          v-for="(item, index) in pelatihanList"
          :key="item._tempId"
          class="card mb-3 shadow-sm border-0"
        >
          <div
            class="card-header bg-white d-flex justify-content-between align-items-center py-3"
          >
            <h6 class="mb-0 fw-bold text-primary">
              <span class="badge bg-primary me-2">{{ index + 1 }}</span>
              Data Pelatihan
            </h6>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="removePelatihan(index)"
              title="Hapus data ini"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Nama Pelatihan <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namapelatihan"
                  :class="{ 'is-invalid': getError(index, 'namapelatihan') }"
                  placeholder="Contoh: Pelatihan Kepemimpinan"
                  required
                  @blur="validateField(index, 'namapelatihan')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namapelatihan") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Penyelenggara <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namapenyelenggara"
                  :class="{
                    'is-invalid': getError(index, 'namapenyelenggara'),
                  }"
                  placeholder="Contoh: BKN"
                  required
                  @blur="validateField(index, 'namapenyelenggara')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namapenyelenggara") }}
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
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">File Sertifikat</label>
                <input
                  type="file"
                  class="form-control"
                  @change="(e) => handleFileUpload(index, e)"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div
                  v-if="item.filesertifikat_preview"
                  class="mt-2 small text-success"
                >
                  <i class="fa fa-check-circle me-1"></i> File terpilih:
                  {{ item.filesertifikat_preview }}
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
import { getUserTrainings } from "@/services/general/personnel/userTrainings";

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
const pelatihanList = ref([]);
const formErrors = ref([]);

// === Lifecycle ===
onMounted(() => {
  if (props.modelValue && Array.isArray(props.modelValue.list)) {
    pelatihanList.value = props.modelValue.list.map((item) => ({
      ...item,
      _tempId: Date.now() + Math.random(),
    }));
    formErrors.value = pelatihanList.value.map(() => ({}));
  } else {
    pelatihanList.value = [];
    formErrors.value = [];
  }

  emit("validation-change", true);
});

// === Methods ===
async function loadData(userId) {
  if (isDataLoaded.value) return;

  isLoading.value = true;
  try {
    if (userId) {
      const res = await getUserTrainings({ id_pengguna: userId });
      const apiData = (
        Array.isArray(res.data) ? res.data : res.data.data || []
      ).map((d) => ({
        idpenggunalatihan: d.idpenggunalatihan,
        namapelatihan: d.namapelatihan,
        namapenyelenggara: d.namapenyelenggara,
        tglmulai: d.tglmulai,
        tglselesai: d.tglselesai,
        status: d.status,
        filesertifikat: d.filesertifikat,
        filesertifikat_preview: d.filesertifikat
          ? d.filesertifikat.split("/").pop()
          : "",
        _tempId: Date.now() + Math.random(),
      }));

      pelatihanList.value = apiData;
      formErrors.value = pelatihanList.value.map(() => ({}));
      emit("update:modelValue", { list: pelatihanList.value });
    }

    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    isLoading.value = false;
  }
}

function addPelatihan() {
  pelatihanList.value.forEach((item) => (item.status = "Tidak Aktif"));

  pelatihanList.value.push({
    _tempId: Date.now(),
    namapelatihan: "",
    namapenyelenggara: "",
    tglmulai: "",
    tglselesai: "",
    filesertifikat: null,
    filesertifikat_preview: "",
    status: "Aktif",
  });

  formErrors.value.push({});
}

function removePelatihan(index) {
  pelatihanList.value.splice(index, 1);
  formErrors.value.splice(index, 1);
}

function handleFileUpload(index, event) {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      toast.warning("Ukuran file maksimal 5MB");
      event.target.value = "";
      return;
    }

    pelatihanList.value[index].filesertifikat = file;
    pelatihanList.value[index].filesertifikat_preview = file.name;
  }
}

function handleStatusChange(index, isChecked) {
  const newStatus = isChecked ? "Aktif" : "Tidak Aktif";
  pelatihanList.value[index].status = newStatus;

  if (newStatus === "Aktif") {
    pelatihanList.value.forEach((item, i) => {
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
  const item = pelatihanList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "namapelatihan") {
    if (!item.namapelatihan) {
      formErrors.value[index].namapelatihan = "Nama Pelatihan wajib diisi.";
    } else {
      formErrors.value[index].namapelatihan = "";
    }
  }

  if (field === "namapenyelenggara") {
    if (!item.namapenyelenggara) {
      formErrors.value[index].namapenyelenggara = "Penyelenggara wajib diisi.";
    } else {
      formErrors.value[index].namapenyelenggara = "";
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

  if (pelatihanList.value.length === 0) {
    return true;
  }

  pelatihanList.value.forEach((item, index) => {
    if (!formErrors.value[index]) formErrors.value[index] = {};

    if (!item.namapelatihan) {
      formErrors.value[index].namapelatihan = "Nama Pelatihan wajib diisi.";
      isValid = false;
    } else {
      formErrors.value[index].namapelatihan = "";
    }

    if (!item.namapenyelenggara) {
      formErrors.value[index].namapenyelenggara = "Penyelenggara wajib diisi.";
      isValid = false;
    } else {
      formErrors.value[index].namapenyelenggara = "";
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
  pelatihanList,
  (newList) => {
    emit("update:modelValue", { list: newList });
    let isValid = true;
    if (newList.length > 0) {
      isValid = newList.every(
        (item) => item.namapelatihan && item.namapenyelenggara && item.tglmulai
      );
    }

    emit("validation-change", isValid);
  },
  { deep: true }
);

defineExpose({ validate, loadData });
</script>

<style scoped>
.step-pelatihan {
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
