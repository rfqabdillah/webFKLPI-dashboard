<template>
  <div class="step-unit-kerja">
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
            <i class="fa fa-building me-2"></i>Riwayat Unit Kerja
          </h6>
          <p class="text-muted small mb-0">
            Tambahkan riwayat penempatan unit kerja pegawai jika ada.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" @click="addUnitKerja">
          <i class="fa fa-plus me-1"></i> Tambah Data
        </button>
      </div>

      <div
        v-if="unitKerjaList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-building-o text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">Belum ada data unit kerja.</p>
        <button class="btn btn-outline-primary btn-sm" @click="addUnitKerja">
          <i class="fa fa-plus me-1"></i> Tambah Unit Kerja
        </button>
      </div>

      <transition-group name="list" tag="div">
        <div
          v-for="(item, index) in unitKerjaList"
          :key="item._tempId"
          class="card mb-3 shadow-sm border-0"
        >
          <div
            class="card-header bg-white d-flex justify-content-between align-items-center py-3"
          >
            <h6 class="mb-0 fw-bold text-primary">
              <span class="badge bg-primary me-2">{{ index + 1 }}</span>
              Data Unit Kerja
            </h6>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="removeUnitKerja(index)"
              title="Hapus data ini"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label fw-semibold">
                  Unit Kerja <span class="text-danger">*</span>
                </label>
                <select
                  class="form-select"
                  v-model="item.idunitkerja"
                  :class="{ 'is-invalid': getError(index, 'idunitkerja') }"
                  required
                  @blur="validateField(index, 'idunitkerja')"
                >
                  <option value="" disabled>Pilih Unit Kerja</option>
                  <option
                    v-for="unit in workUnitOptions"
                    :key="unit.idunitkerja"
                    :value="unit.idunitkerja"
                  >
                    {{ unit.namaunitkerja }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  {{ getError(index, "idunitkerja") }}
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
                <div class="form-text small">
                  Kosongkan jika masih aktif menjabat.
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">File SK</label>
                <input
                  type="file"
                  class="form-control"
                  @change="(e) => handleFileUpload(index, e)"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div v-if="item.filesk_preview" class="mt-2 small text-success">
                  <i class="fa fa-check-circle me-1"></i> File terpilih:
                  {{ item.filesk_preview }}
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
import { getWorkUnits } from "@/services/referensi/workUnits";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ list: [] }),
  },
});

const emit = defineEmits(["update:modelValue", "validation-change"]);
const toast = useToast();

const isLoading = ref(false);
const isDataLoaded = ref(false);
const workUnitOptions = ref([]);
const unitKerjaList = ref([]);
const formErrors = ref([]);

// === Lifecycle ===
onMounted(() => {
  if (props.modelValue && Array.isArray(props.modelValue.list)) {
    unitKerjaList.value = props.modelValue.list.map((item) => ({
      ...item,
      _tempId: Date.now() + Math.random(),
    }));
    formErrors.value = unitKerjaList.value.map(() => ({}));
  } else {
    unitKerjaList.value = [];
    formErrors.value = [];
  }

  emit("validation-change", true);
});

// === Methods ===
async function loadData() {
  if (isDataLoaded.value) return;
  await fetchWorkUnits();
  isDataLoaded.value = true;
}

async function fetchWorkUnits() {
  isLoading.value = true;
  try {
    const params = { page: 1, limit: 999, sort: "namaunitkerja", dir: "asc" };
    const response = await getWorkUnits(params);

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        workUnitOptions.value = response.data[0].data;
      } else {
        workUnitOptions.value = response.data;
      }
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      workUnitOptions.value = response.data.data;
    } else {
      workUnitOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching work units:", error);
    toast.error("Gagal memuat data unit kerja.");
  } finally {
    isLoading.value = false;
  }
}

function addUnitKerja() {
  unitKerjaList.value.forEach((item) => (item.status = "Tidak Aktif"));

  unitKerjaList.value.push({
    _tempId: Date.now(),
    idunitkerja: "",
    tglmulai: "",
    tglselesai: "",
    filesk: null,
    filesk_preview: "",
    status: "Aktif",
  });

  formErrors.value.push({});
}

function removeUnitKerja(index) {
  unitKerjaList.value.splice(index, 1);
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

    unitKerjaList.value[index].filesk = file;
    unitKerjaList.value[index].filesk_preview = file.name;
  }
}

function handleStatusChange(index, isChecked) {
  const newStatus = isChecked ? "Aktif" : "Tidak Aktif";
  unitKerjaList.value[index].status = newStatus;

  if (newStatus === "Aktif") {
    unitKerjaList.value.forEach((item, i) => {
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
  const item = unitKerjaList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "idunitkerja") {
    if (!item.idunitkerja) {
      formErrors.value[index].idunitkerja = "Unit Kerja wajib dipilih.";
    } else {
      formErrors.value[index].idunitkerja = "";
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

  if (unitKerjaList.value.length === 0) {
    return true;
  }

  unitKerjaList.value.forEach((item, index) => {
    if (!formErrors.value[index]) formErrors.value[index] = {};

    if (!item.idunitkerja) {
      formErrors.value[index].idunitkerja = "Unit Kerja wajib dipilih.";
      isValid = false;
    } else {
      formErrors.value[index].idunitkerja = "";
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
  unitKerjaList,
  (newList) => {
    emit("update:modelValue", { list: newList });
    let isValid = true;
    if (newList.length > 0) {
      isValid = newList.every((item) => item.idunitkerja && item.tglmulai);
    }

    emit("validation-change", isValid);
  },
  { deep: true }
);

defineExpose({ validate, loadData });
</script>

<style scoped>
.step-unit-kerja {
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
