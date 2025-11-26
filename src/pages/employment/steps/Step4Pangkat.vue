<template>
  <div class="step-pangkat">
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
            <i class="fa fa-star me-2"></i>Riwayat Pangkat / Golongan
          </h6>
          <p class="text-muted small mb-0">
            Tambahkan riwayat kepangkatan pegawai jika ada.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" @click="addPangkat">
          <i class="fa fa-plus me-1"></i> Tambah Data
        </button>
      </div>

      <div
        v-if="pangkatList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-star-o text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">Belum ada data pangkat.</p>
        <button class="btn btn-outline-primary btn-sm" @click="addPangkat">
          <i class="fa fa-plus me-1"></i> Tambah Pangkat
        </button>
      </div>

      <transition-group name="list" tag="div">
        <div
          v-for="(item, index) in pangkatList"
          :key="item._tempId"
          class="card mb-3 shadow-sm border-0"
        >
          <div
            class="card-header bg-white d-flex justify-content-between align-items-center py-3"
          >
            <h6 class="mb-0 fw-bold text-primary">
              <span class="badge bg-primary me-2">{{ index + 1 }}</span>
              Data Pangkat
            </h6>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="removePangkat(index)"
              title="Hapus data ini"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label fw-semibold">
                  Pangkat / Golongan <span class="text-danger">*</span>
                </label>
                <select
                  class="form-select"
                  v-model="item.idpangkat"
                  :class="{ 'is-invalid': getError(index, 'idpangkat') }"
                  required
                  @blur="validateField(index, 'idpangkat')"
                >
                  <option value="" disabled>Pilih Pangkat</option>
                  <option
                    v-for="rank in rankOptions"
                    :key="rank.idpangkat"
                    :value="rank.idpangkat"
                  >
                    {{ rank.namapangkat }} ({{ rank.golongan }})
                  </option>
                </select>
                <div class="invalid-feedback">
                  {{ getError(index, "idpangkat") }}
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
                <div v-if="item.filesk_preview" class="mt-2 small text-success">
                  <i class="fa fa-check-circle me-1"></i> File terpilih:
                  {{ item.filesk_preview }}
                </div>
              </div>

              <!-- Status Switch -->
              <div class="col-md-6">
                <label class="form-label fw-semibold d-block">Status</label>
                <div class="form-check form-switch mt-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    :id="'statusSwitchPangkat-' + index"
                    :checked="item.status === 'Aktif'"
                    @change="(e) => handleStatusChange(index, e.target.checked)"
                  />
                  <label
                    class="form-check-label"
                    :for="'statusSwitchPangkat-' + index"
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
import { getRanks } from "@/services/referensi/ranks";

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
const rankOptions = ref([]);
const pangkatList = ref([]);
const formErrors = ref([]);

// === Lifecycle ===
onMounted(() => {
  if (props.modelValue && Array.isArray(props.modelValue.list)) {
    pangkatList.value = props.modelValue.list.map((item) => ({
      ...item,
      _tempId: Date.now() + Math.random(),
    }));
    formErrors.value = pangkatList.value.map(() => ({}));
  } else {
    pangkatList.value = [];
    formErrors.value = [];
  }

  emit("validation-change", true);
});

// === Methods ===
async function loadData() {
  if (isDataLoaded.value) return;
  await fetchRanks();
  isDataLoaded.value = true;
}

async function fetchRanks() {
  isLoading.value = true;
  try {
    const params = { page: 1, limit: 999, sort: "golongan", dir: "desc" }; // Usually sorted by rank/golongan
    const response = await getRanks(params);

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        rankOptions.value = response.data[0].data;
      } else {
        rankOptions.value = response.data;
      }
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      rankOptions.value = response.data.data;
    } else {
      rankOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching ranks:", error);
    toast.error("Gagal memuat data pangkat.");
  } finally {
    isLoading.value = false;
  }
}

function addPangkat() {
  pangkatList.value.forEach((item) => (item.status = "Tidak Aktif"));

  pangkatList.value.push({
    _tempId: Date.now(),
    idpangkat: "",
    tglmulai: "",
    tglselesai: "",
    filesk: null,
    filesk_preview: "",
    status: "Aktif",
  });

  formErrors.value.push({});
}

function removePangkat(index) {
  pangkatList.value.splice(index, 1);
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
    pangkatList.value[index].filesk = file;
    pangkatList.value[index].filesk_preview = file.name;
  }
}

function handleStatusChange(index, isChecked) {
  const newStatus = isChecked ? "Aktif" : "Tidak Aktif";
  pangkatList.value[index].status = newStatus;

  if (newStatus === "Aktif") {
    pangkatList.value.forEach((item, i) => {
      if (i !== index) {
        item.status = "Tidak Aktif";
      }
    });
  }
}

// === Validation ===
function getError(index, field) {
  return formErrors.value[index] ? formErrors.value[index][field] : "";
}

function validateField(index, field) {
  const item = pangkatList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "idpangkat") {
    if (!item.idpangkat) {
      formErrors.value[index].idpangkat = "Pangkat wajib dipilih.";
    } else {
      formErrors.value[index].idpangkat = "";
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

  if (pangkatList.value.length === 0) {
    return true;
  }

  pangkatList.value.forEach((item, index) => {
    if (!formErrors.value[index]) formErrors.value[index] = {};

    if (!item.idpangkat) {
      formErrors.value[index].idpangkat = "Pangkat wajib dipilih.";
      isValid = false;
    } else {
      formErrors.value[index].idpangkat = "";
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

// === Watchers ===
watch(
  pangkatList,
  (newList) => {
    emit("update:modelValue", { list: newList });

    let isValid = true;
    if (newList.length > 0) {
      isValid = newList.every((item) => item.idpangkat && item.tglmulai);
    }
    emit("validation-change", isValid);
  },
  { deep: true }
);

defineExpose({ validate, loadData });
</script>

<style scoped>
.step-pangkat {
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
