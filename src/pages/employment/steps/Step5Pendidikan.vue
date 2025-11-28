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
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Jenjang Pendidikan <span class="text-danger">*</span>
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
                    v-for="opt in educationOptions"
                    :key="opt.idjenjangpendidikan"
                    :value="opt.idjenjangpendidikan"
                  >
                    {{ opt.namajenjangpendidikan }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  {{ getError(index, "idjenjangpendidikan") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Tahun Lulus <span class="text-danger">*</span>
                </label>
                <input
                  type="number"
                  class="form-control"
                  v-model="item.tahunlulus"
                  placeholder="YYYY"
                  :class="{ 'is-invalid': getError(index, 'tahunlulus') }"
                  required
                  @blur="validateField(index, 'tahunlulus')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "tahunlulus") }}
                </div>
              </div>

              <div class="col-12">
                <label class="form-label fw-semibold">
                  Nama Perguruan Tinggi / Sekolah
                  <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namaperguruantinggi"
                  :class="{
                    'is-invalid': getError(index, 'namaperguruantinggi'),
                  }"
                  placeholder="Contoh: Universitas Gadjah Mada"
                  required
                  @blur="validateField(index, 'namaperguruantinggi')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namaperguruantinggi") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Program Studi</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.programstudi"
                  placeholder="Contoh: Teknik Informatika"
                />
              </div>

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
import { getUserEducation } from "@/services/general/personnel/userEducation";

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
const educationOptions = ref([]);
const pendidikanList = ref([]);
const formErrors = ref([]);

// === Lifecycle ===
onMounted(() => {
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
async function loadData(userId) {
  if (isDataLoaded.value) return;

  isLoading.value = true;
  try {
    await fetchEducationLevels();

    if (userId) {
      const res = await getUserEducation({ id_pengguna: userId });
      const apiData = (
        Array.isArray(res.data) ? res.data : res.data.data || []
      ).map((d) => ({
        idpenggunapendidikan: d.idpenggunapendidikan,
        idjenjangpendidikan: d.idjenjangpendidikan,
        namaperguruantinggi: d.namaperguruantinggi,
        programstudi: d.programstudi,
        tahunlulus: d.tahunlulus,
        fileijazah: d.fileijazah,
        fileijazah_preview: d.fileijazah ? d.fileijazah.split("/").pop() : "",
        _tempId: Date.now() + Math.random(),
      }));

      pendidikanList.value = apiData;
      formErrors.value = pendidikanList.value.map(() => ({}));
      emit("update:modelValue", { list: pendidikanList.value });
    }

    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchEducationLevels() {
  try {
    const params = { limit: 100, sort: "namajenjangpendidikan", dir: "asc" };
    const res = await getEducationLevels(params);
    educationOptions.value = Array.isArray(res.data)
      ? res.data
      : res.data.data || [];

    if (
      educationOptions.value.length === 0 &&
      res.data &&
      Array.isArray(res.data[0]?.data)
    ) {
      educationOptions.value = res.data[0].data;
    }
  } catch (error) {
    console.error("Error fetching education levels:", error);
    toast.error("Gagal memuat data jenjang pendidikan.");
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

// === Validation Logic ===
function getError(index, field) {
  return formErrors.value[index] ? formErrors.value[index][field] : "";
}

function validateField(index, field) {
  const item = pendidikanList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "idjenjangpendidikan") {
    if (!item.idjenjangpendidikan) {
      formErrors.value[index].idjenjangpendidikan = "Jenjang wajib dipilih.";
    } else {
      formErrors.value[index].idjenjangpendidikan = "";
    }
  }

  if (field === "namaperguruantinggi") {
    if (!item.namaperguruantinggi) {
      formErrors.value[index].namaperguruantinggi =
        "Nama Perguruan Tinggi wajib diisi.";
    } else {
      formErrors.value[index].namaperguruantinggi = "";
    }
  }

  if (field === "tahunlulus") {
    if (!item.tahunlulus) {
      formErrors.value[index].tahunlulus = "Tahun Lulus wajib diisi.";
    } else {
      formErrors.value[index].tahunlulus = "";
    }
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

// === Sync & Watch ===
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
