<template>
  <div class="step-jabatan">
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
            <i class="fa fa-briefcase me-2"></i>Riwayat Jabatan
          </h6>
          <p class="text-muted small mb-0">
            Tambahkan riwayat jabatan pegawai jika ada.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" @click="addJabatan">
          <i class="fa fa-plus me-1"></i> Tambah Data
        </button>
      </div>

      <div
        v-if="jabatanList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-briefcase text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">Belum ada data jabatan.</p>
        <button class="btn btn-outline-primary btn-sm" @click="addJabatan">
          <i class="fa fa-plus me-1"></i> Tambah Jabatan
        </button>
      </div>

      <transition-group name="list" tag="div">
        <div
          v-for="(item, index) in jabatanList"
          :key="item._tempId"
          class="card mb-3 shadow-sm border-0"
        >
          <div
            class="card-header bg-white d-flex justify-content-between align-items-center py-3"
          >
            <h6 class="mb-0 fw-bold text-primary">
              <span class="badge bg-primary me-2">{{ index + 1 }}</span>
              Data Jabatan
            </h6>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="removeJabatan(index)"
              title="Hapus data ini"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label fw-semibold">
                  Nama Jabatan <span class="text-danger">*</span>
                </label>
                <select
                  class="form-select"
                  v-model="item.idjenjang"
                  :class="{ 'is-invalid': getError(index, 'idjenjang') }"
                  required
                  @blur="validateField(index, 'idjenjang')"
                >
                  <option value="" disabled>Pilih Jabatan</option>
                  <option
                    v-for="opt in jabatanOptions"
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
import { getPositionLevels } from "@/services/referensi/positionLevels";
import { getUserLevels } from "@/services/general/personnel/userLevels";

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
const jabatanOptions = ref([]);
const jabatanList = ref([]);
const formErrors = ref([]);

// === Lifecycle ===
onMounted(() => {
  if (props.modelValue && Array.isArray(props.modelValue.list)) {
    jabatanList.value = props.modelValue.list.map((item) => ({
      ...item,
      _tempId: Date.now() + Math.random(),
    }));
    formErrors.value = jabatanList.value.map(() => ({}));
  } else {
    jabatanList.value = [];
    formErrors.value = [];
  }

  emit("validation-change", true);
});

// === Methods ===
async function loadData(userId) {
  if (isDataLoaded.value) return;

  isLoading.value = true;
  try {
    await fetchPositionLevels();

    if (userId) {
      const res = await getUserLevels({ id_pengguna: userId });
      const apiData = (
        Array.isArray(res.data) ? res.data : res.data.data || []
      ).map((d) => ({
        idpenggunajenjang: d.idpenggunajenjang,
        idjenjang: d.idjenjang,
        tglmulai: d.tglmulai,
        tglselesai: d.tglselesai,
        status: d.status,
        filesk: d.filesk,
        filesk_preview: d.filesk ? d.filesk.split("/").pop() : "",
        _tempId: Date.now() + Math.random(),
      }));

      jabatanList.value = apiData;
      formErrors.value = jabatanList.value.map(() => ({}));
      emit("update:modelValue", { list: jabatanList.value });
    }

    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchPositionLevels() {
  try {
    const res = await getPositionLevels({ limit: 999 });
    jabatanOptions.value = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];
  } catch (error) {
    console.error("Error fetching position levels:", error);
    toast.error("Gagal memuat data jabatan.");
  }
}

function addJabatan() {
  jabatanList.value.forEach((item) => (item.status = "Tidak Aktif"));

  jabatanList.value.push({
    _tempId: Date.now(),
    idjenjang: "",
    tglmulai: "",
    tglselesai: "",
    filesk: null,
    filesk_preview: "",
    status: "Aktif",
  });

  formErrors.value.push({});
}

function removeJabatan(index) {
  jabatanList.value.splice(index, 1);
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

    jabatanList.value[index].filesk = file;
    jabatanList.value[index].filesk_preview = file.name;
  }
}

function handleStatusChange(index, isChecked) {
  const newStatus = isChecked ? "Aktif" : "Tidak Aktif";
  jabatanList.value[index].status = newStatus;

  if (newStatus === "Aktif") {
    jabatanList.value.forEach((item, i) => {
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
  const item = jabatanList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "idjenjang") {
    if (!item.idjenjang) {
      formErrors.value[index].idjenjang = "Jabatan wajib dipilih.";
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

  if (jabatanList.value.length === 0) {
    return true;
  }

  jabatanList.value.forEach((item, index) => {
    if (!formErrors.value[index]) formErrors.value[index] = {};

    if (!item.idjenjang) {
      formErrors.value[index].idjenjang = "Jabatan wajib dipilih.";
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
  jabatanList,
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
.step-jabatan {
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
