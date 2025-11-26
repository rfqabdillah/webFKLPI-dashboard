<template>
  <div class="step-pelatihan">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h6 class="mb-1">
          <i class="fa fa-certificate me-2"></i>Riwayat Pelatihan / Kursus
        </h6>
        <p class="text-muted small mb-0">
          Tambahkan riwayat pelatihan atau kursus yang pernah diikuti.
        </p>
      </div>
      <button class="btn btn-primary btn-sm" @click="addPelatihan">
        <i class="fa fa-plus me-1"></i> Tambah Data
      </button>
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
            <div class="col-12">
              <label class="form-label fw-semibold">
                Nama Pelatihan <span class="text-danger">*</span>
              </label>
              <input
                type="text"
                class="form-control"
                v-model="item.namapelatihan"
                placeholder="Contoh: Pelatihan Kepemimpinan"
                :class="{ 'is-invalid': getError(index, 'namapelatihan') }"
                required
                @blur="validateField(index, 'namapelatihan')"
              />
              <div class="invalid-feedback">
                {{ getError(index, "namapelatihan") }}
              </div>
            </div>

            <div class="col-md-12">
              <label class="form-label fw-semibold">
                Penyelenggara <span class="text-danger">*</span>
              </label>
              <input
                type="text"
                class="form-control"
                v-model="item.namapenyelenggara"
                placeholder="Contoh: BKN, Lembaga Sertifikasi"
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
              <label class="form-label fw-semibold">Status</label>
              <select class="form-select" v-model="item.status">
                <option value="Selesai">Selesai</option>
                <option value="Sedang Berjalan">Sedang Berjalan</option>
              </select>
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

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ list: [] }),
  },
});

const emit = defineEmits(["update:modelValue", "validation-change"]);
const toast = useToast();

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
function addPelatihan() {
  pelatihanList.value.push({
    _tempId: Date.now(),
    namapelatihan: "",
    namapenyelenggara: "",
    tglmulai: "",
    tglselesai: "",
    status: "Selesai",
    filesertifikat: null,
    filesertifikat_preview: "",
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

// === Validation ===
function getError(index, field) {
  return formErrors.value[index] ? formErrors.value[index][field] : "";
}

function validateField(index, field) {
  const item = pelatihanList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "namapelatihan") {
    if (!item.namapelatihan)
      formErrors.value[index].namapelatihan = "Nama Pelatihan wajib diisi.";
    else formErrors.value[index].namapelatihan = "";
  }

  if (field === "namapenyelenggara") {
    if (!item.namapenyelenggara)
      formErrors.value[index].namapenyelenggara = "Penyelenggara wajib diisi.";
    else formErrors.value[index].namapenyelenggara = "";
  }

  if (field === "tglmulai") {
    if (!item.tglmulai)
      formErrors.value[index].tglmulai = "Tanggal Mulai wajib diisi.";
    else formErrors.value[index].tglmulai = "";
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

// === Watchers ===
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

defineExpose({ validate });
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
