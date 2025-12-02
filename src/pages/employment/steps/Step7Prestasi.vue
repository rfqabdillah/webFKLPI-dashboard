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
            Tambahkan riwayat prestasi pegawai jika ada.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" @click="addPrestasi">
          <i class="fa fa-plus me-1"></i> Tambah Data
        </button>
      </div>

      <div
        class="border-start border-4 border-primary bg-light text-dark py-2 px-3 small mb-3 rounded"
      >
        <i class="fa fa-info-circle text-primary me-1"></i>
        <strong>Catatan:</strong> Hanya satu data yang boleh memiliki status
        <strong class="text-success"
          ><i class="fa fa-check-circle"></i> Aktif</strong
        >. Ketika Anda mengaktifkan satu data, data lainnya akan otomatis
        menjadi "Tidak Aktif".
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
              <div class="col-md-12">
                <label class="form-label fw-semibold">
                  Nama Prestasi <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namaprestasi"
                  :class="{ 'is-invalid': getError(index, 'namaprestasi') }"
                  required
                  placeholder="Contoh: Juara 1 Lomba Inovasi Pelayanan Publik"
                  @blur="validateField(index, 'namaprestasi')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namaprestasi") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Skala Prestasi <span class="text-danger">*</span>
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
                    v-for="skala in scaleOptions"
                    :key="skala.idskala"
                    :value="skala.idskala"
                  >
                    {{ skala.namaskala }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  {{ getError(index, "idskala") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Nama Penyelenggara <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namapenyelenggara"
                  :class="{
                    'is-invalid': getError(index, 'namapenyelenggara'),
                  }"
                  required
                  placeholder="Contoh: Kementerian PANRB"
                  @blur="validateField(index, 'namapenyelenggara')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namapenyelenggara") }}
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
                  v-if="isUrl(item.filesertifikat)"
                  class="mt-2 p-2 border rounded bg-light d-flex align-items-center justify-content-between"
                >
                  <div class="d-flex align-items-center overflow-hidden">
                    <div class="me-3 text-danger">
                      <i class="fa fa-file-pdf-o fa-2x"></i>
                    </div>
                    <div class="text-truncate">
                      <small
                        class="text-muted d-block"
                        style="font-size: 0.75rem"
                        >File Tersimpan:</small
                      >
                      <span
                        class="fw-bold text-dark text-truncate d-block"
                        :title="item.filesertifikat_preview"
                      >
                        {{ item.filesertifikat_preview }}
                      </span>
                    </div>
                  </div>

                  <a
                    :href="item.filesertifikat"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary ms-2 text-nowrap"
                  >
                    <i class="fa fa-external-link me-1"></i> Buka
                  </a>
                </div>

                <div
                  v-else-if="item.filesertifikat_preview"
                  class="mt-2 p-2 border border-success rounded bg-white text-success"
                >
                  <div class="d-flex align-items-center">
                    <i class="fa fa-check-circle fa-lg me-2"></i>
                    <div class="overflow-hidden">
                      <small class="d-block text-muted"
                        >File baru dipilih:</small
                      >
                      <strong class="text-truncate d-block">{{
                        item.filesertifikat_preview
                      }}</strong>
                    </div>
                  </div>
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
import {
  getUserAchievements,
  deleteUserAchievement,
} from "@/services/general/personnel/userAchievments";
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
const scaleOptions = ref([]);
const prestasiList = ref([]);
const formErrors = ref([]);

// === Helper Functions ===
const isUrl = (string) => {
  return (
    typeof string === "string" && string.length > 0 && string.startsWith("http")
  );
};

onMounted(async () => {
  await fetchScales();

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

async function loadData(userId) {
  isLoading.value = true;
  try {
    if (scaleOptions.value.length === 0) {
      await fetchScales();
    }
    if (userId) {
      console.log("Step7Prestasi - Loading data for userId:", userId);
      const res = await getUserAchievements({ id_pengguna: userId });
      console.log("Step7Prestasi - API Response:", res);

      let rawData = [];
      if (Array.isArray(res.data)) {
        if (res.data[0] && res.data[0].data) {
          rawData = res.data[0].data;
        } else if (res.data.length > 0 && res.data[0].idpenggunaprestasi) {
          rawData = res.data;
        }
      } else if (res.data && res.data.data) {
        rawData = res.data.data;
      }

      console.log("Step7Prestasi - Raw data extracted:", rawData);

      const filteredData = rawData.filter((d) => d.idpengguna === userId);
      console.log("Step7Prestasi - Filtered data:", filteredData);

      const apiData = filteredData.map((d) => ({
        idpenggunaprestasi: d.idpenggunaprestasi,
        namaprestasi: d.namaprestasi,
        idskala: d.idskala,
        namapenyelenggara: d.namapenyelenggara,
        status: d.status,
        filesertifikat: d.filesertifikat,
        filesertifikat_preview: d.filesertifikat
          ? d.filesertifikat.split("/").pop()
          : "",
        _tempId: Date.now() + Math.random(),
      }));

      console.log("Step7Prestasi - Mapped data:", apiData);

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
    const params = { page: 1, limit: 999, sort: "namaskala", dir: "asc" };
    const response = await getScales(params);
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
    toast.error("Gagal memuat data skala prestasi.");
  }
}

function addPrestasi() {
  prestasiList.value.push({
    _tempId: Date.now(),
    namaprestasi: "",
    idskala: "",
    namapenyelenggara: "",
    filesertifikat: null,
    filesertifikat_preview: "",
    status: "Tidak Aktif",
  });
  formErrors.value.push({});
}

function removePrestasi(index) {
  const item = prestasiList.value[index];

  Swal.fire({
    title: "Hapus Data?",
    text: item.idpenggunaprestasi
      ? "Data prestasi ini akan dihapus dari database. Tindakan ini tidak dapat dibatalkan."
      : "Data prestasi ini akan dihapus.",
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
        if (item.idpenggunaprestasi) {
          await deleteUserAchievement(item.idpenggunaprestasi);
          toast.success("Data prestasi berhasil dihapus dari database");
        } else {
          toast.success("Data prestasi berhasil dihapus");
        }

        prestasiList.value.splice(index, 1);
        formErrors.value.splice(index, 1);
      } catch (error) {
        console.error("Error deleting prestasi:", error);
        toast.error("Gagal menghapus data prestasi");
      }
    }
  });
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

function getError(index, field) {
  return formErrors.value[index] ? formErrors.value[index][field] : "";
}

function validateField(index, field) {
  const item = prestasiList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "namaprestasi") {
    formErrors.value[index].namaprestasi = !item.namaprestasi
      ? "Nama Prestasi wajib diisi."
      : "";
  }
  if (field === "idskala") {
    formErrors.value[index].idskala = !item.idskala
      ? "Skala Prestasi wajib dipilih."
      : "";
  }
  if (field === "namapenyelenggara") {
    formErrors.value[index].namapenyelenggara = !item.namapenyelenggara
      ? "Nama Penyelenggara wajib diisi."
      : "";
  }
}

function validate() {
  let isValid = true;
  if (prestasiList.value.length === 0) return true;

  prestasiList.value.forEach((item, index) => {
    if (!formErrors.value[index]) formErrors.value[index] = {};
    if (!item.namaprestasi) {
      formErrors.value[index].namaprestasi = "Nama Prestasi wajib diisi.";
      isValid = false;
    } else {
      formErrors.value[index].namaprestasi = "";
    }
    if (!item.idskala) {
      formErrors.value[index].idskala = "Skala Prestasi wajib dipilih.";
      isValid = false;
    } else {
      formErrors.value[index].idskala = "";
    }
    if (!item.namapenyelenggara) {
      formErrors.value[index].namapenyelenggara =
        "Nama Penyelenggara wajib diisi.";
      isValid = false;
    } else {
      formErrors.value[index].namapenyelenggara = "";
    }
  });
  return isValid;
}

watch(
  prestasiList,
  (newList) => {
    emit("update:modelValue", { list: newList });
    let isValid = true;
    if (newList.length > 0) {
      isValid = newList.every(
        (item) => item.namaprestasi && item.idskala && item.namapenyelenggara
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
