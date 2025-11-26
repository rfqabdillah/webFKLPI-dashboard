<template>
  <div class="step-pendidikan">
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
            <i class="fa fa-graduation-cap me-2"></i>Riwayat Pendidikan
          </h6>
          <p class="text-muted small mb-0">
            Tambahkan riwayat pendidikan formal pegawai.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" @click="addPendidikan">
          <i class="fa fa-plus me-1"></i> Tambah Data
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-if="pendidikanList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-graduation-cap text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">Belum ada data pendidikan.</p>
        <button class="btn btn-outline-primary btn-sm" @click="addPendidikan">
          <i class="fa fa-plus me-1"></i> Tambah Pendidikan
        </button>
      </div>

      <transition-group name="list" tag="div">
        <div
          v-for="(item, index) in pendidikanList"
          :key="item._tempId"
          class="card mb-3 shadow-sm border-0"
        >
          <div
            class="card-header bg-white d-flex justify-content-between align-items-center py-3"
          >
            <h6 class="mb-0 fw-bold text-primary">
              <span class="badge bg-primary me-2">{{ index + 1 }}</span>
              Data Pendidikan
            </h6>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="removePendidikan(index)"
              title="Hapus data ini"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <!-- Jenjang Pendidikan -->
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Jenjang <span class="text-danger">*</span>
                </label>
                <select
                  class="form-select"
                  v-model="item.idjenjangpendidikan"
                  :class="{
                    'is-invalid': getError(index, 'idjenjangpendidikan'),
                  }"
                  required
                  @blur="validateField(index, 'idjenjangpendidikan')"
                >
                  <option value="" disabled>Pilih Jenjang</option>
                  <option
                    v-for="level in educationLevelOptions"
                    :key="level.idjenjangpendidikan"
                    :value="level.idjenjangpendidikan"
                  >
                    {{ level.namajenjangpendidikan }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  {{ getError(index, "idjenjangpendidikan") }}
                </div>
              </div>

              <!-- Tahun Lulus -->
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Tahun Lulus <span class="text-danger">*</span>
                </label>
                <input
                  type="number"
                  class="form-control"
                  v-model="item.tahunlulus"
                  placeholder="Contoh: 2015"
                  :class="{ 'is-invalid': getError(index, 'tahunlulus') }"
                  required
                  @blur="validateField(index, 'tahunlulus')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "tahunlulus") }}
                </div>
              </div>

              <!-- Nama Perguruan Tinggi / Sekolah -->
              <div class="col-12">
                <label class="form-label fw-semibold">
                  Nama Perguruan Tinggi / Sekolah
                  <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namaperguruantinggi"
                  placeholder="Nama institusi pendidikan"
                  :class="{
                    'is-invalid': getError(index, 'namaperguruantinggi'),
                  }"
                  required
                  @blur="validateField(index, 'namaperguruantinggi')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namaperguruantinggi") }}
                </div>
              </div>

              <!-- Program Studi -->
              <div class="col-md-6">
                <label class="form-label fw-semibold">Program Studi</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.programstudi"
                  placeholder="Contoh: Teknik Informatika"
                />
              </div>

              <!-- File Ijazah (Optional in UI, but good to have) -->
              <div class="col-md-6">
                <label class="form-label fw-semibold">File Ijazah</label>
                <input
                  type="file"
                  class="form-control"
                  @change="(e) => handleFileUpload(index, e)"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div
                  v-if="item.fileijazah_preview"
                  class="mt-2 small text-success"
                >
                  <i class="fa fa-check-circle me-1"></i> File terpilih:
                  {{ item.fileijazah_preview }}
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
import { getEducationLevels } from "@/services/referensi/educationLevels";

const props = defineProps({
  modelValue: {
    type: Object, // Expecting { list: [] }
    default: () => ({ list: [] }),
  },
});

const emit = defineEmits(["update:modelValue", "validation-change"]);
const toast = useToast();

const isLoading = ref(false);
const isDataLoaded = ref(false);
const educationLevelOptions = ref([]);
const pendidikanList = ref([]);
const formErrors = ref([]);

// === Lifecycle ===
onMounted(() => {
  // Initialize from props
  if (props.modelValue && Array.isArray(props.modelValue.list)) {
    pendidikanList.value = props.modelValue.list.map((item) => ({
      ...item,
      _tempId: Date.now() + Math.random(),
    }));
    formErrors.value = pendidikanList.value.map(() => ({}));
  } else {
    pendidikanList.value = [];
    formErrors.value = [];
  }

  emit("validation-change", true);
});

// === Methods ===
async function loadData() {
  if (isDataLoaded.value) return;
  await fetchEducationLevels();
  isDataLoaded.value = true;
}

async function fetchEducationLevels() {
  isLoading.value = true;
  try {
    const params = {
      page: 1,
      limit: 999,
      sort: "namajenjangpendidikan",
      dir: "asc",
    };
    const response = await getEducationLevels(params);

    // Handle various response structures
    if (Array.isArray(response.data)) {
      // Case: Response is an array directly (like the example provided: [{ data: [...], meta: ... }])
      if (response.data[0] && response.data[0].data) {
        educationLevelOptions.value = response.data[0].data;
      } else {
        // Fallback if it's a flat array of items
        educationLevelOptions.value = response.data;
      }
    } else if (response.data && response.data.data) {
      // Case: Standard Laravel pagination { data: [...], meta: ... }
      educationLevelOptions.value = response.data.data;
    } else {
      educationLevelOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching education levels:", error);
    toast.error("Gagal memuat data jenjang pendidikan.");
  } finally {
    isLoading.value = false;
  }
}

function addPendidikan() {
  pendidikanList.value.push({
    _tempId: Date.now(),
    idjenjangpendidikan: "",
    namaperguruantinggi: "",
    programstudi: "",
    tahunlulus: "",
    fileijazah: null,
    fileijazah_preview: "",
  });

  formErrors.value.push({});
}

function removePendidikan(index) {
  pendidikanList.value.splice(index, 1);
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
    pendidikanList.value[index].fileijazah = file;
    pendidikanList.value[index].fileijazah_preview = file.name;
  }
}

// === Validation ===
function getError(index, field) {
  return formErrors.value[index] ? formErrors.value[index][field] : "";
}

function validateField(index, field) {
  const item = pendidikanList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "idjenjangpendidikan") {
    if (!item.idjenjangpendidikan)
      formErrors.value[index].idjenjangpendidikan = "Jenjang wajib dipilih.";
    else formErrors.value[index].idjenjangpendidikan = "";
  }

  if (field === "namaperguruantinggi") {
    if (!item.namaperguruantinggi)
      formErrors.value[index].namaperguruantinggi =
        "Nama Perguruan Tinggi wajib diisi.";
    else formErrors.value[index].namaperguruantinggi = "";
  }

  if (field === "tahunlulus") {
    if (!item.tahunlulus)
      formErrors.value[index].tahunlulus = "Tahun Lulus wajib diisi.";
    else formErrors.value[index].tahunlulus = "";
  }
}

function validate() {
  let isValid = true;

  if (pendidikanList.value.length === 0) {
    return true;
  }

  pendidikanList.value.forEach((item, index) => {
    if (!formErrors.value[index]) formErrors.value[index] = {};

    if (!item.idjenjangpendidikan) {
      formErrors.value[index].idjenjangpendidikan = "Jenjang wajib dipilih.";
      isValid = false;
    } else {
      formErrors.value[index].idjenjangpendidikan = "";
    }

    if (!item.namaperguruantinggi) {
      formErrors.value[index].namaperguruantinggi =
        "Nama Perguruan Tinggi wajib diisi.";
      isValid = false;
    } else {
      formErrors.value[index].namaperguruantinggi = "";
    }

    if (!item.tahunlulus) {
      formErrors.value[index].tahunlulus = "Tahun Lulus wajib diisi.";
      isValid = false;
    } else {
      formErrors.value[index].tahunlulus = "";
    }
  });

  return isValid;
}

// === Watchers ===
watch(
  pendidikanList,
  (newList) => {
    emit("update:modelValue", { list: newList });

    let isValid = true;
    if (newList.length > 0) {
      isValid = newList.every(
        (item) =>
          item.idjenjangpendidikan &&
          item.namaperguruantinggi &&
          item.tahunlulus
      );
    }
    emit("validation-change", isValid);
  },
  { deep: true }
);

defineExpose({ validate, loadData });
</script>

<style scoped>
.step-pendidikan {
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
