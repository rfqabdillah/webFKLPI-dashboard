<template>
  <div class="step-prestasi">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h6 class="mb-1"><i class="fa fa-trophy me-2"></i>Riwayat Prestasi</h6>
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
                :class="{ 'is-invalid': getError(index, 'namapenyelenggara') }"
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
                  v-for="opt in scaleOptions"
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
                <label class="form-check-label" :for="'statusSwitch-' + index">
                  {{ item.status || "Tidak Aktif" }}
                </label>
              </div>
            </div>

            <div class="col-12">
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
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { getScales } from "@/services/referensi/scale";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ list: [] }),
  },
});

const emit = defineEmits(["update:modelValue", "validation-change"]);
const toast = useToast();

const prestasiList = ref([]);
const formErrors = ref([]);
const scaleOptions = ref([]);

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
const isDataLoaded = ref(false);
const isLoading = ref(false);

async function loadData() {
  if (isDataLoaded.value) return;
  await fetchScales();
  isDataLoaded.value = true;
}

async function fetchScales() {
  isLoading.value = true;
  try {
    const params = { limit: 100, sort: "namaskala", dir: "asc" };
    const response = await getScales(params);

    // console.log("Response fetchScales:", response);

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        scaleOptions.value = response.data[0].data;
      } else {
        scaleOptions.value = response.data;
      }
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      scaleOptions.value = response.data.data;
    } else {
      scaleOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching scales:", error);
    toast.error("Gagal memuat data skala.");
  } finally {
    isLoading.value = false;
  }
}

function addPrestasi() {
  prestasiList.value.forEach((item) => (item.status = "Tidak Aktif"));

  prestasiList.value.push({
    _tempId: Date.now(),
    namaprestasi: "",
    namapenyelenggara: "",
    idskala: "",
    status: "Aktif",
    filesertifikat: null,
    filesertifikat_preview: "",
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

// === Validation ===
function getError(index, field) {
  return formErrors.value[index] ? formErrors.value[index][field] : "";
}

function validateField(index, field) {
  const item = prestasiList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "namaprestasi") {
    if (!item.namaprestasi)
      formErrors.value[index].namaprestasi = "Nama Prestasi wajib diisi.";
    else formErrors.value[index].namaprestasi = "";
  }

  if (field === "namapenyelenggara") {
    if (!item.namapenyelenggara)
      formErrors.value[index].namapenyelenggara = "Penyelenggara wajib diisi.";
    else formErrors.value[index].namapenyelenggara = "";
  }

  if (field === "idskala") {
    if (!item.idskala) formErrors.value[index].idskala = "Skala wajib dipilih.";
    else formErrors.value[index].idskala = "";
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

// === Watchers ===
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
