<template>
  <div class="step-pelatihan">
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
            <i class="fa fa-certificate me-2"></i>Riwayat Pelatihan
          </h6>
          <p class="text-muted small mb-0">
            Tambahkan riwayat pelatihan pegawai jika ada.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" @click="addPelatihan">
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
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Nama Pelatihan <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namapelatihan"
                  :class="{ 'is-invalid': getError(index, 'namapelatihan') }"
                  required
                  placeholder="Contoh: Pelatihan Kepemimpinan"
                  @blur="validateField(index, 'namapelatihan')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namapelatihan") }}
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
                  placeholder="Contoh: LKPP"
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
                <div class="form-text small">
                  Kosongkan jika masih berlangsung.
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
import {
  getUserTrainings,
  deleteUserTraining,
} from "@/services/general/personnel/userTrainings";
import Swal from "sweetalert2";
import * as yup from "yup";

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
const pelatihanList = ref([]);
const formErrors = ref([]);

// === Yup Validation Schema ===
const validationSchema = yup.object().shape({
  namapelatihan: yup.string().required("Nama Pelatihan wajib diisi."),
  namapenyelenggara: yup.string().required("Nama Penyelenggara wajib diisi."),
  tglmulai: yup.string().required("Tanggal Mulai wajib diisi."),
});

// === Helper Functions ===
const isUrl = (string) => {
  return (
    typeof string === "string" && string.length > 0 && string.startsWith("http")
  );
};

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

async function loadData(userId) {
  isLoading.value = true;
  try {
    if (userId) {      const res = await getUserTrainings({ id_pengguna: userId });
      let rawData = [];
      if (Array.isArray(res.data)) {
        if (res.data[0] && res.data[0].data) {
          rawData = res.data[0].data;
        } else if (res.data.length > 0 && res.data[0].idpenggunapelatihan) {
          rawData = res.data;
        }
      } else if (res.data && res.data.data) {
        rawData = res.data.data;
      }
      const filteredData = rawData.filter((d) => d.idpengguna === userId);
      const apiData = filteredData.map((d) => ({
        idpenggunapelatihan: d.idpenggunapelatihan,
        namapelatihan: d.namapelatihan,
        namapenyelenggara: d.namapenyelenggara,
        tglmulai: d.tglmulai,
        tglselesai: d.tglselesai,
        status: d.status,
        filesertifikat: d.filesertifikat,
        filesertifikat_preview: d.filesertifikat
          ? d.filesertifikat.split("/").pop()
          : "",
        _tempId: Date.now() + Math.random(),
      }));
      pelatihanList.value = apiData;
      formErrors.value = pelatihanList.value.map(() => ({}));
      emit("update:modelValue", { list: pelatihanList.value });
    }
    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    isLoading.value = false;
  }
}

function addPelatihan() {
  pelatihanList.value.push({
    _tempId: Date.now(),
    namapelatihan: "",
    namapenyelenggara: "",
    tglmulai: "",
    tglselesai: "",
    filesertifikat: null,
    filesertifikat_preview: "",
    status: "Tidak Aktif",
  });
  formErrors.value.push({});
}

function removePelatihan(index) {
  const item = pelatihanList.value[index];

  Swal.fire({
    title: "Hapus Data?",
    text: item.idpenggunapelatihan
      ? "Data pelatihan ini akan dihapus dari database. Tindakan ini tidak dapat dibatalkan."
      : "Data pelatihan ini akan dihapus.",
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
        if (item.idpenggunapelatihan) {
          await deleteUserTraining(item.idpenggunapelatihan);
          toast.success("Data pelatihan berhasil dihapus dari database");
        } else {
          toast.success("Data pelatihan berhasil dihapus");
        }

        pelatihanList.value.splice(index, 1);
        formErrors.value.splice(index, 1);
      } catch (error) {
        console.error("Error deleting pelatihan:", error);
        toast.error("Gagal menghapus data pelatihan");
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
    pelatihanList.value[index].filesertifikat = file;
    pelatihanList.value[index].filesertifikat_preview = file.name;
  }
}

function handleStatusChange(index, isChecked) {
  const newStatus = isChecked ? "Aktif" : "Tidak Aktif";
  pelatihanList.value[index].status = newStatus;
  if (newStatus === "Aktif") {
    pelatihanList.value.forEach((item, i) => {
      if (i !== index) {
        item.status = "Tidak Aktif";
      }
    });
  }
}

// === Validation Logic (Yup-based) ===
function getError(index, field) {
  return formErrors.value[index] ? formErrors.value[index][field] : "";
}

async function validateField(index, field) {
  const item = pelatihanList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  try {
    await validationSchema.validateAt(field, item);
    formErrors.value[index][field] = "";
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      formErrors.value[index][field] = error.message;
    }
  }
}

async function validate() {
  if (pelatihanList.value.length === 0) return true;

  let isValid = true;

  for (let index = 0; index < pelatihanList.value.length; index++) {
    const item = pelatihanList.value[index];
    if (!formErrors.value[index]) formErrors.value[index] = {};

    try {
      await validationSchema.validate(item, { abortEarly: false });
      Object.keys(validationSchema.fields).forEach((field) => {
        formErrors.value[index][field] = "";
      });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        isValid = false;
        error.inner.forEach((err) => {
          if (err.path) {
            formErrors.value[index][err.path] = err.message;
          }
        });
      }
    }
  }

  return isValid;
}

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

defineExpose({ validate, loadData });
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
