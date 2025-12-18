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
          <h6 class="mb-1"><i class="fa fa-star me-2"></i>Riwayat Pangkat</h6>
          <p class="text-muted small mb-0">
            Tambahkan riwayat kepangkatan pegawai jika ada.
          </p>
        </div>
        <button class="btn btn-primary btn-sm" @click="addPangkat">
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
        v-if="pangkatList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-star text-muted fa-2x mb-2"></i>
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
                  Pangkat <span class="text-danger">*</span>
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
                    v-for="pangkat in rankOptions"
                    :key="pangkat.idpangkat"
                    :value="pangkat.idpangkat"
                  >
                    {{ pangkat.golongan }}/{{ pangkat.ruang }}-{{
                      pangkat.pangkat
                    }}
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

                <div
                  v-if="isUrl(item.filesk)"
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
                        :title="item.filesk_preview"
                      >
                        {{ item.filesk_preview }}
                      </span>
                    </div>
                  </div>

                  <a
                    :href="item.filesk"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary ms-2 text-nowrap"
                  >
                    <i class="fa fa-external-link me-1"></i> Buka
                  </a>
                </div>

                <div
                  v-else-if="item.filesk_preview"
                  class="mt-2 p-2 border border-success rounded bg-white text-success"
                >
                  <div class="d-flex align-items-center">
                    <i class="fa fa-check-circle fa-lg me-2"></i>
                    <div class="overflow-hidden">
                      <small class="d-block text-muted"
                        >File baru dipilih:</small
                      >
                      <strong class="text-truncate d-block">{{
                        item.filesk_preview
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
import { getRanks } from "@/services/referensi/ranks";
import {
  getUserRanks,
  deleteUserRank,
} from "@/services/general/personnel/userRanks";
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
const rankOptions = ref([]);
const pangkatList = ref([]);
const formErrors = ref([]);

// === Yup Validation Schema ===
const validationSchema = yup.object().shape({
  idpangkat: yup.string().required("Pangkat wajib dipilih."),
  tglmulai: yup.string().required("Tanggal Mulai wajib diisi."),
});

// === Helper Functions ===
const isUrl = (string) => {
  return (
    typeof string === "string" && string.length > 0 && string.startsWith("http")
  );
};

onMounted(async () => {
  await fetchRanks();

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

/**
 * Remove duplicates from array based on a key
 */
function uniqueByKey(array, key) {
  const seen = new Set();
  return array.filter((item) => {
    const keyValue = item[key];
    if (keyValue && seen.has(keyValue)) {
      return false;
    }
    if (keyValue) {
      seen.add(keyValue);
    }
    return true;
  });
}

async function loadData(userId) {
  isLoading.value = true;
  try {
    if (rankOptions.value.length === 0) {
      await fetchRanks();
    }
    if (userId) {
      const res = await getUserRanks({ filter: `idpengguna=${userId}` });
      let rawData = [];
      if (Array.isArray(res.data)) {
        if (res.data[0] && res.data[0].data) {
          rawData = res.data[0].data;
        } else if (res.data.length > 0 && res.data[0].idpenggunapangkat) {
          rawData = res.data;
        }
      } else if (res.data && res.data.data) {
        rawData = res.data.data;
      }
      const filteredData = rawData.filter((d) => d.idpengguna === userId);
      const apiData = filteredData.map((d) => ({
        idpenggunapangkat: d.idpenggunapangkat,
        idpangkat: d.idpangkat,
        tglmulai: d.tglmulaipangkat || d.tglmulai,
        tglselesai: d.tglselesaipangkat || d.tglselesai,
        status: d.statuspangkat || d.status,
        filesk: d.fileskpangkat || d.filesk,
        filesk_preview:
          d.fileskpangkat || d.filesk
            ? (d.fileskpangkat || d.filesk).split("/").pop()
            : "",
        _tempId: Date.now() + Math.random(),
      }));

      // Deduplicate by ID
      const uniqueData = uniqueByKey(apiData, "idpenggunapangkat");

      pangkatList.value = uniqueData;
      formErrors.value = pangkatList.value.map(() => ({}));
      emit("update:modelValue", { list: pangkatList.value });
    }
    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchRanks() {
  try {
    const params = { page: 1, limit: 999, sort: "namapangkat", dir: "asc" };
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
  }
}

function addPangkat() {
  pangkatList.value.push({
    _tempId: Date.now(),
    idpangkat: "",
    tglmulai: "",
    tglselesai: "",
    filesk: null,
    filesk_preview: "",
    status: "Tidak Aktif",
  });
  formErrors.value.push({});
}

function removePangkat(index) {
  const item = pangkatList.value[index];

  Swal.fire({
    title: "Hapus Data?",
    text: item.idpenggunapangkat
      ? "Data pangkat ini akan dihapus. Tindakan ini tidak dapat dibatalkan."
      : "Data pangkat ini akan dihapus.",
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
        if (item.idpenggunapangkat) {
          await deleteUserRank(item.idpenggunapangkat);
        }
        toast.success("Data pangkat berhasil dihapus");

        pangkatList.value.splice(index, 1);
        formErrors.value.splice(index, 1);
      } catch (error) {
        console.error("Error deleting pangkat:", error);
        toast.error("Gagal menghapus data pangkat");
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

// === Validation Logic (Yup-based) ===
function getError(index, field) {
  return formErrors.value[index] ? formErrors.value[index][field] : "";
}

async function validateField(index, field) {
  const item = pangkatList.value[index];
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
  if (pangkatList.value.length === 0) return true;

  let isValid = true;

  for (let index = 0; index < pangkatList.value.length; index++) {
    const item = pangkatList.value[index];
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
