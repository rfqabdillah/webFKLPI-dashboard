<template>
  <div class="step-pendidikan">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Mem uat data referensi...</p>
    </div>

    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="mb-1">
            <i class="fa fa-graduation-cap me-2"></i>Riwayat Pendidikan
          </h6>
          <p class="text-muted small mb-0">
            Tambahkan riwayat pendidikan pegawai jika ada.
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
                  <option value="" disabled>Pilih Jenjang Pendidikan</option>
                  <option
                    v-for="jenjang in educationLevelOptions"
                    :key="jenjang.idjenjangpendidikan"
                    :value="jenjang.idjenjangpendidikan"
                  >
                    {{ jenjang.namajenjangpendidikan }}
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
                  :class="{ 'is-invalid': getError(index, 'tahunlulus') }"
                  required
                  min="1900"
                  max="2100"
                  @blur="validateField(index, 'tahunlulus')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "tahunlulus") }}
                </div>
              </div>

              <div class="col-md-12">
                <label class="form-label fw-semibold">
                  Program Studi <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.programstudi"
                  :class="{ 'is-invalid': getError(index, 'programstudi') }"
                  required
                  placeholder="Contoh: Teknik Informatika"
                  @blur="validateField(index, 'programstudi')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "programstudi") }}
                </div>
              </div>

              <div class="col-md-12">
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
                  required
                  placeholder="Contoh: Universitas Indonesia"
                  @blur="validateField(index, 'namaperguruantinggi')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namaperguruantinggi") }}
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
import {
  getUserEducations,
  deleteUserEducation,
} from "@/services/general/personnel/userEducation";
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
const educationLevelOptions = ref([]);
const pendidikanList = ref([]);
const formErrors = ref([]);

onMounted(async () => {
  await fetchEducationLevels();

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

async function loadData(userId) {
  isLoading.value = true;
  try {
    if (educationLevelOptions.value.length === 0) {
      await fetchEducationLevels();
    }
    if (userId) {
      console.log("Step5Pendidikan - Loading data for userId:", userId);
      const res = await getUserEducations({ id_pengguna: userId });
      console.log("Step5Pendidikan - API Response:", res);

      let rawData = [];
      if (Array.isArray(res.data)) {
        if (res.data[0] && res.data[0].data) {
          rawData = res.data[0].data;
        } else if (res.data.length > 0 && res.data[0].idpenggunapendidikan) {
          rawData = res.data;
        }
      } else if (res.data && res.data.data) {
        rawData = res.data.data;
      }

      console.log("Step5Pendidikan - Raw data extracted:", rawData);

      const filteredData = rawData.filter((d) => d.idpengguna === userId);
      console.log("Step5Pendidikan - Filtered data:", filteredData);

      const apiData = filteredData.map((d) => ({
        idpenggunapendidikan: d.idpenggunapendidikan,
        idjenjangpendidikan: d.idjenjangpendidikan,
        programstudi: d.programstudi,
        namaperguruantinggi: d.namaperguruantinggi,
        tahunlulus: d.tahunlulus,
        _tempId: Date.now() + Math.random(),
      }));

      console.log("Step5Pendidikan - Mapped data:", apiData);

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
    const params = {
      page: 1,
      limit: 999,
      sort: "namajenjangpendidikan",
      dir: "asc",
    };
    const response = await getEducationLevels(params);
    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        educationLevelOptions.value = response.data[0].data;
      } else {
        educationLevelOptions.value = response.data;
      }
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      educationLevelOptions.value = response.data.data;
    } else {
      educationLevelOptions.value = [];
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
    programstudi: "",
    namaperguruantinggi: "",
    tahunlulus: "",
  });
  formErrors.value.push({});
}

function removePendidikan(index) {
  const item = pendidikanList.value[index];

  Swal.fire({
    title: "Hapus Data?",
    text: item.idpenggunapendidikan
      ? "Data pendidikan ini akan dihapus dari database. Tindakan ini tidak dapat dibatalkan."
      : "Data pendidikan ini akan dihapus.",
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
        if (item.idpenggunapendidikan) {
          await deleteUserEducation(item.idpenggunapendidikan);
          toast.success("Data pendidikan berhasil dihapus dari database");
        } else {
          toast.success("Data pendidikan berhasil dihapus");
        }

        pendidikanList.value.splice(index, 1);
        formErrors.value.splice(index, 1);
      } catch (error) {
        console.error("Error deleting pendidikan:", error);
        toast.error("Gagal menghapus data pendidikan");
      }
    }
  });
}

function getError(index, field) {
  return formErrors.value[index] ? formErrors.value[index][field] : "";
}

function validateField(index, field) {
  const item = pendidikanList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "idjenjangpendidikan") {
    formErrors.value[index].idjenjangpendidikan = !item.idjenjangpendidikan
      ? "Jenjang Pendidikan wajib dipilih."
      : "";
  }
  if (field === "programstudi") {
    formErrors.value[index].programstudi = !item.programstudi
      ? "Program Studi wajib diisi."
      : "";
  }
  if (field === "namaperguruantinggi") {
    formErrors.value[index].namaperguruantinggi = !item.namaperguruantinggi
      ? "Nama Perguruan Tinggi wajib diisi."
      : "";
  }
  if (field === "tahunlulus") {
    formErrors.value[index].tahunlulus = !item.tahunlulus
      ? "Tahun Lulus wajib diisi."
      : "";
  }
}

function validate() {
  let isValid = true;
  if (pendidikanList.value.length === 0) return true;

  pendidikanList.value.forEach((item, index) => {
    if (!formErrors.value[index]) formErrors.value[index] = {};
    const required = [
      "idjenjangpendidikan",
      "programstudi",
      "namaperguruantinggi",
      "tahunlulus",
    ];
    required.forEach((field) => {
      if (!item[field]) {
        formErrors.value[index][field] = `Field ini wajib diisi.`;
        isValid = false;
      } else {
        formErrors.value[index][field] = "";
      }
    });
  });
  return isValid;
}

watch(
  pendidikanList,
  (newList) => {
    emit("update:modelValue", { list: newList });
    let isValid = true;
    if (newList.length > 0) {
      isValid = newList.every(
        (item) =>
          item.idjenjangpendidikan &&
          item.programstudi &&
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
