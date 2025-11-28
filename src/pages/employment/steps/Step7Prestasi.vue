<template>
  <div class="step-prestasi">
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
            <i class="fa fa-trophy me-2"></i>Riwayat Prestasi
          </h6>
          <p class="text-muted small mb-0">
            Tambahkan riwayat prestasi yang pernah diraih.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" @click="addPrestasi">
          <i class="fa fa-plus me-1"></i> Tambah Data
        </button>
      </div>

      <div
        v-if="prestasiList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-trophy text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">Belum ada data prestasi.</p>
        <button class="btn btn-outline-primary btn-sm" @click="addPrestasi">
          <i class="fa fa-plus me-1"></i> Tambah Prestasi
        </button>
      </div>

      <transition-group name="list" tag="div">
        <div
          v-for="(item, index) in prestasiList"
          :key="item._tempId"
          class="card mb-3 shadow-sm border-0"
        >
          <div
            class="card-header bg-white d-flex justify-content-between align-items-center py-3"
          >
            <h6 class="mb-0 fw-bold text-primary">
              <span class="badge bg-primary me-2">{{ index + 1 }}</span>
              Data Prestasi
            </h6>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="removePrestasi(index)"
              title="Hapus data ini"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label fw-semibold">
                  Nama Prestasi <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namaprestasi"
                  placeholder="Contoh: Juara 1 Lomba Coding"
                  :class="{ 'is-invalid': getError(index, 'namaprestasi') }"
                  required
                  @blur="validateField(index, 'namaprestasi')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namaprestasi") }}
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
                  placeholder="Contoh: Kemenkominfo"
                  :class="{
                    'is-invalid': getError(index, 'namapenyelenggara'),
                  }"
                  required
                  @blur="validateField(index, 'namapenyelenggara')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namapenyelenggara") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Skala <span class="text-danger">*</span>
                </label>
                <select
                  class="form-select"
                  v-model="item.idskala"
                  :class="{ 'is-invalid': getError(index, 'idskala') }"
                  required
                  @blur="validateField(index, 'idskala')"
                >
                  <option value="" disabled>Pilih Skala</option>
                  <option
                    v-for="opt in skalaOptions"
                    :key="opt.idskala"
                    :value="opt.idskala"
                  >
                    {{ opt.namaskala }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  {{ getError(index, "idskala") }}
                </div>
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
import { getScales } from "@/services/referensi/scale";
import { getUserAchievements } from "@/services/general/personnel/userAchievments";

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
const skalaOptions = ref([]);
const prestasiList = ref([]);
const formErrors = ref([]);

// === Lifecycle ===
onMounted(() => {
  if (props.modelValue && Array.isArray(props.modelValue.list)) {
    prestasiList.value = props.modelValue.list.map((item) => ({
      ...item,
      _tempId: Date.now() + Math.random(),
    }));
    formErrors.value = prestasiList.value.map(() => ({}));
  } else {
    prestasiList.value = [];
    formErrors.value = [];
  }

  emit("validation-change", true);
});

// === Methods ===
async function loadData(userId) {
  if (isDataLoaded.value) return;

  isLoading.value = true;
  try {
    await fetchScales();

    if (userId) {
      const res = await getUserAchievements({ id_pengguna: userId });
      const apiData = (
        Array.isArray(res.data) ? res.data : res.data.data || []
      ).map((d) => ({
        idpenggunaprestasi: d.idpenggunaprestasi,
        namaprestasi: d.namaprestasi,
        namapenyelenggara: d.namapenyelenggara,
        idskala: d.idskala,
        status: d.status,
        filesertifikat: d.filesertifikat,
        filesertifikat_preview: d.filesertifikat
          ? d.filesertifikat.split("/").pop()
          : "",
        _tempId: Date.now() + Math.random(),
      }));

      prestasiList.value = apiData;
      formErrors.value = prestasiList.value.map(() => ({}));
      emit("update:modelValue", { list: prestasiList.value });
    }

    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchScales() {
  try {
    const params = { limit: 100, sort: "namaskala", dir: "asc" };
    const res = await getScales(params);
    skalaOptions.value = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];
  } catch (error) {
    console.error("Error fetching scales:", error);
    toast.error("Gagal memuat data skala.");
  }
}

function addPrestasi() {
  prestasiList.value.forEach((item) => (item.status = "Tidak Aktif"));

  prestasiList.value.push({
    _tempId: Date.now(),
    namaprestasi: "",
    namapenyelenggara: "",
    idskala: "",
    filesertifikat: null,
    filesertifikat_preview: "",
    status: "Aktif",
  });

  formErrors.value.push({});
}

function removePrestasi(index) {
  prestasiList.value.splice(index, 1);
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

    prestasiList.value[index].filesertifikat = file;
    prestasiList.value[index].filesertifikat_preview = file.name;
  }
}

function handleStatusChange(index, isChecked) {
  const newStatus = isChecked ? "Aktif" : "Tidak Aktif";
  prestasiList.value[index].status = newStatus;

  if (newStatus === "Aktif") {
    prestasiList.value.forEach((item, i) => {
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
  const item = prestasiList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "namaprestasi") {
    if (!item.namaprestasi) {
      formErrors.value[index].namaprestasi = "Nama Prestasi wajib diisi.";
    } else {
      formErrors.value[index].namaprestasi = "";
    }
  }

  if (field === "namapenyelenggara") {
    if (!item.namapenyelenggara) {
      formErrors.value[index].namapenyelenggara = "Penyelenggara wajib diisi.";
    } else {
      formErrors.value[index].namapenyelenggara = "";
    }
  }

  if (field === "idskala") {
    if (!item.idskala) {
      formErrors.value[index].idskala = "Skala wajib dipilih.";
    } else {
      formErrors.value[index].idskala = "";
    }
  }
}

function validate() {
  let isValid = true;

  if (prestasiList.value.length === 0) {
    return true;
  }

  prestasiList.value.forEach((item, index) => {
    if (!formErrors.value[index]) formErrors.value[index] = {};

    if (!item.namaprestasi) {
      formErrors.value[index].namaprestasi = "Nama Prestasi wajib diisi.";
      isValid = false;
    } else {
      formErrors.value[index].namaprestasi = "";
    }

    if (!item.namapenyelenggara) {
      formErrors.value[index].namapenyelenggara = "Penyelenggara wajib diisi.";
      isValid = false;
    } else {
      formErrors.value[index].namapenyelenggara = "";
    }

    if (!item.idskala) {
      formErrors.value[index].idskala = "Skala wajib dipilih.";
      isValid = false;
    } else {
      formErrors.value[index].idskala = "";
    }
  });

  return isValid;
}

// === Sync & Watch ===
watch(
  prestasiList,
  (newList) => {
    emit("update:modelValue", { list: newList });
    let isValid = true;
    if (newList.length > 0) {
      isValid = newList.every(
        (item) => item.namaprestasi && item.namapenyelenggara && item.idskala
      );
    }

    emit("validation-change", isValid);
  },
  { deep: true }
);

defineExpose({ validate, loadData });
</script>

<style scoped>
.step-prestasi {
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
