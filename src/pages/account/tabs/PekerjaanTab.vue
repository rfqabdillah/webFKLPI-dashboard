<template>
  <div class="step-pekerjaan">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ $t("Loading") }}...</span>
      </div>
      <p class="mt-2 text-muted">{{ $t("Loading") }}...</p>
    </div>

    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="mb-1">
            <i class="fa fa-briefcase me-2"></i
            >{{ $t("ProfileSteps.Job.Title") }}
          </h6>
          <p class="text-muted small mb-0">
            {{ $t("ProfileSteps.Job.Subtitle") }}
          </p>
        </div>
        <button class="btn btn-success btn-sm" @click="addPekerjaan">
          <i class="fa fa-plus me-1"></i> {{ $t("ProfileSteps.Job.AddData") }}
        </button>
      </div>

      <div
        class="border-start border-4 border-primary bg-light text-dark py-2 px-3 small mb-3 rounded"
      >
        <i class="fa fa-info-circle text-primary me-1"></i>
        <strong>{{ $t("ProfileSteps.WorkUnit.Note") }}</strong>
        {{ $t("ProfileSteps.WorkUnit.NoteContent") }}
        <strong class="text-success"
          ><i class="fa fa-check-circle"></i> {{ $t("Active") }}</strong
        >{{ $t("ProfileSteps.WorkUnit.NoteContent2") }}
      </div>

      <div
        v-if="pekerjaanList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-briefcase text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">
          {{ $t("ProfileSteps.Job.EmptyState") }}
        </p>
        <button class="btn btn-outline-primary btn-sm" @click="addPekerjaan">
          <i class="fa fa-plus me-1"></i> {{ $t("ProfileSteps.Job.AddJob") }}
        </button>
      </div>

      <transition-group name="list" tag="div">
        <div
          v-for="(item, index) in pekerjaanList"
          :key="item._tempId"
          class="card mb-3 shadow-sm border-0"
        >
          <div
            class="card-header bg-white d-flex justify-content-between align-items-center py-3"
          >
            <h6 class="mb-0 fw-bold text-primary">
              <span class="badge me-2" style="background-color: #0d6efd">{{
                index + 1
              }}</span>
              {{ $t("ProfileSteps.Job.DataHeader") }}
            </h6>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="removePekerjaan(index)"
              :title="$t('Delete')"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  {{ $t("ProfileSteps.Job.JobName") }}
                  <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namapekerjaan"
                  :class="{ 'is-invalid': getError(index, 'namapekerjaan') }"
                  :placeholder="$t('ProfileSteps.Job.JobNamePlaceholder')"
                  required
                  @blur="validateField(index, 'namapekerjaan')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namapekerjaan") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  {{ $t("ProfileSteps.Job.CompanyName") }}
                  <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namaperusahaan"
                  :class="{ 'is-invalid': getError(index, 'namaperusahaan') }"
                  :placeholder="$t('ProfileSteps.Job.CompanyNamePlaceholder')"
                  required
                  @blur="validateField(index, 'namaperusahaan')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namaperusahaan") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  Tipe Pekerjaan <span class="text-danger">*</span>
                </label>
                <select
                  class="form-select"
                  v-model="item.idtipepekerjaan"
                  :class="{ 'is-invalid': getError(index, 'idtipepekerjaan') }"
                  required
                  @blur="validateField(index, 'idtipepekerjaan')"
                >
                  <option value="" disabled>Pilih Tipe Pekerjaan</option>
                  <option
                    v-for="jt in jobTypeOptions"
                    :key="jt.idtipepekerjaan"
                    :value="jt.idtipepekerjaan"
                  >
                    {{ jt.namatipepekerjaan }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  {{ getError(index, "idtipepekerjaan") }}
                </div>
              </div>

              <div class="col-md-3">
                <label class="form-label fw-semibold">
                  Tanggal Mulai <span class="text-danger">*</span>
                </label>
                <input
                  type="date"
                  class="form-control"
                  v-model="item.tanggalmulai"
                  :class="{ 'is-invalid': getError(index, 'tanggalmulai') }"
                  required
                  @blur="validateField(index, 'tanggalmulai')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "tanggalmulai") }}
                </div>
              </div>

              <div class="col-md-3">
                <label class="form-label fw-semibold">Tanggal Selesai</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="item.tanggalselesai"
                />
                <div class="form-text small">Kosongkan jika masih bekerja.</div>
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

      <!-- Save Button -->
      <div
        v-if="pekerjaanList.length > 0"
        class="d-flex justify-content-end mt-3"
      >
        <button
          class="btn btn-success save-btn"
          @click="saveData"
          :disabled="isSaving"
        >
          <span
            v-if="isSaving"
            class="spinner-border spinner-border-sm me-2"
            role="status"
          ></span>
          <i v-else class="fa fa-save me-2"></i>
          {{ isSaving ? "Menyimpan..." : "Simpan Data" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { getJobTypes } from "@/services/referensi/jobTypes";
import {
  getUserWorkExperiences,
  addUserWorkExperience,
  updateUserWorkExperience,
  deleteUserWorkExperience,
} from "@/services/general/personnel/userWorkExperiences";
import Swal from "sweetalert2";
import * as yup from "yup";

const { t, locale } = useI18n();

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
const jobTypeOptions = ref([]);
const pekerjaanList = ref([]);
const formErrors = ref([]);
const isSaving = ref(false);

// Yup Validation Schema
const getValidationSchema = () =>
  yup.object().shape({
    namapekerjaan: yup
      .string()
      .required(() => t("ProfileSteps.Job.Validation.JobNameRequired")),
    namaperusahaan: yup
      .string()
      .required(() => t("ProfileSteps.Job.Validation.CompanyNameRequired")),
    idtipepekerjaan: yup
      .string()
      .required(() => t("ProfileSteps.Job.Validation.JobTypeRequired")),
    tanggalmulai: yup
      .string()
      .required(() => t("ProfileSteps.Job.Validation.StartDateRequired")),
  });

// Re-validate when locale changes to update error messages
watch(
  () => locale.value,
  () => {
    // Re-validate all items that have errors to update messages
    formErrors.value.forEach((errors, index) => {
      if (Object.keys(errors).some((key) => errors[key])) {
        // Re-run validation for items with errors
        const item = pekerjaanList.value[index];
        if (item) {
          Object.keys(errors).forEach((field) => {
            if (errors[field]) {
              validateField(index, field);
            }
          });
        }
      }
    });
  }
);

// === Lifecycle ===
onMounted(async () => {
  await fetchJobTypes();

  // Only set initial values if data hasn't been loaded from API yet
  if (!isDataLoaded.value) {
    if (props.modelValue && Array.isArray(props.modelValue.list)) {
      pekerjaanList.value = props.modelValue.list.map((item) => ({
        ...item,
        _tempId: Date.now() + Math.random(),
      }));
      formErrors.value = pekerjaanList.value.map(() => ({}));
    } else {
      pekerjaanList.value = [];
      formErrors.value = [];
    }
  }

  emit("validation-change", true);
});

// Watch for currentUserId changes to auto-load data
watch(
  () => props.currentUserId,
  async (newUserId) => {
    if (newUserId && !isDataLoaded.value) {
      await loadData(newUserId);
    }
  },
  { immediate: true }
);

// === Methods ===
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
    if (jobTypeOptions.value.length === 0) {
      await fetchJobTypes();
    }

    if (userId) {
      const res = await getUserWorkExperiences({
        filter: `idpengguna=${userId}`,
      });

      let rawData = [];
      if (Array.isArray(res.data)) {
        if (res.data[0] && res.data[0].data) {
          rawData = res.data[0].data;
        } else if (res.data.length > 0 && res.data[0].idpenggunapekerjaan) {
          rawData = res.data;
        }
      } else if (res.data && res.data.data) {
        rawData = res.data.data;
      }

      const filteredData = rawData.filter((d) => d.idpengguna === userId);

      const apiData = filteredData.map((d) => ({
        idpenggunapekerjaan: d.idpenggunapekerjaan,
        namapekerjaan: d.namapekerjaan || "",
        namaperusahaan: d.namaperusahaan || "",
        idtipepekerjaan: d.idtipepekerjaan || "",
        tanggalmulai: d.tanggalmulai || "",
        tanggalselesai: d.tanggalselesai || "",
        status: d.status || "Tidak Aktif",
        _tempId: Date.now() + Math.random(),
      }));

      const uniqueData = uniqueByKey(apiData, "idpenggunapekerjaan");

      pekerjaanList.value = uniqueData;
      formErrors.value = pekerjaanList.value.map(() => ({}));
      emit("update:modelValue", { list: pekerjaanList.value });
    }

    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    isLoading.value = false;
  }
}

async function fetchJobTypes() {
  try {
    const params = {
      page: 1,
      limit: 999,
      sort: "namatipepekerjaan",
      dir: "asc",
    };
    const response = await getJobTypes(params);

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        jobTypeOptions.value = response.data[0].data;
      } else {
        jobTypeOptions.value = response.data;
      }
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      jobTypeOptions.value = response.data.data;
    } else {
      jobTypeOptions.value = [];
    }
  } catch (error) {
    console.error("Error fetching job types:", error);
    toast.error("Gagal memuat data tipe pekerjaan.");
  }
}

// === Save Function ===
async function saveData() {
  const isValid = validate();
  if (!isValid) {
    toast.error("Mohon lengkapi data yang diperlukan");
    return;
  }

  if (!props.currentUserId) {
    toast.error("User ID tidak ditemukan");
    return;
  }

  isSaving.value = true;

  try {
    for (const item of pekerjaanList.value) {
      const formData = new FormData();
      formData.append("record[idpengguna]", props.currentUserId);
      formData.append("record[namapekerjaan]", item.namapekerjaan || "");
      formData.append("record[namaperusahaan]", item.namaperusahaan || "");
      formData.append("record[idtipepekerjaan]", item.idtipepekerjaan || "");
      formData.append("record[tanggalmulai]", item.tanggalmulai || "");
      formData.append("record[tanggalselesai]", item.tanggalselesai || "");
      formData.append("record[status]", item.status || "Tidak Aktif");

      if (item.idpenggunapekerjaan) {
        formData.append("_method", "PUT");
        await updateUserWorkExperience(item.idpenggunapekerjaan, formData);
      } else {
        const response = await addUserWorkExperience(formData);
        if (response?.data?.idpenggunapekerjaan) {
          item.idpenggunapekerjaan = response.data.idpenggunapekerjaan;
        } else if (response?.data?.data?.idpenggunapekerjaan) {
          item.idpenggunapekerjaan = response.data.data.idpenggunapekerjaan;
        }
      }
    }

    toast.success("Data pekerjaan berhasil disimpan");
  } catch (error) {
    console.error("Error saving pekerjaan:", error);
    toast.error("Gagal menyimpan data pekerjaan");
  } finally {
    isSaving.value = false;
  }
}

function addPekerjaan() {
  pekerjaanList.value.push({
    _tempId: Date.now(),
    namapekerjaan: "",
    namaperusahaan: "",
    idtipepekerjaan: "",
    tanggalmulai: "",
    tanggalselesai: "",
    status: "Tidak Aktif",
  });

  formErrors.value.push({});
}

function removePekerjaan(index) {
  const item = pekerjaanList.value[index];

  Swal.fire({
    title: t("Swal.DeleteTitle"),
    text: item.idpenggunapekerjaan
      ? t("Swal.DeletePermanent")
      : t("Swal.DeleteConfirm"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `<i class="fa fa-check me-2"></i> ${t("Delete")}`,
    cancelButtonText: `<i class="fa fa-times me-2"></i> ${t("Cancel")}`,
    cancelButtonColor: "#efefef",
    confirmButtonColor: "#d33",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        if (item.idpenggunapekerjaan) {
          await deleteUserWorkExperience(item.idpenggunapekerjaan);
        }
        toast.success(t("Swal.DeleteSuccess"));

        pekerjaanList.value.splice(index, 1);
        formErrors.value.splice(index, 1);
      } catch (error) {
        console.error("Error deleting pekerjaan:", error);
        toast.error(t("Swal.DeleteError"));
      }
    }
  });
}

function handleStatusChange(index, isChecked) {
  const newStatus = isChecked ? "Aktif" : "Tidak Aktif";
  pekerjaanList.value[index].status = newStatus;

  if (newStatus === "Aktif") {
    pekerjaanList.value.forEach((item, i) => {
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

async function validateField(index, field) {
  const item = pekerjaanList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  try {
    const schema = getValidationSchema();
    await schema.validateAt(field, item);
    formErrors.value[index][field] = "";
  } catch (err) {
    formErrors.value[index][field] = err.message;
  }
}

async function validate() {
  if (pekerjaanList.value.length === 0) {
    return true;
  }

  let isValid = true;
  const schema = getValidationSchema();

  for (let index = 0; index < pekerjaanList.value.length; index++) {
    const item = pekerjaanList.value[index];
    if (!formErrors.value[index]) formErrors.value[index] = {};

    try {
      await schema.validate(item, { abortEarly: false });
      // Clear all errors for this item
      formErrors.value[index] = {};
    } catch (err) {
      isValid = false;
      if (err.inner) {
        err.inner.forEach((e) => {
          formErrors.value[index][e.path] = e.message;
        });
      }
    }
  }

  return isValid;
}

// === Sync & Watch ===
watch(
  pekerjaanList,
  (newList) => {
    emit("update:modelValue", { list: newList });
    let isValid = true;
    if (newList.length > 0) {
      isValid = newList.every(
        (item) =>
          item.namapekerjaan &&
          item.namaperusahaan &&
          item.idtipepekerjaan &&
          item.tanggalmulai
      );
    }

    emit("validation-change", isValid);
  },
  { deep: true }
);

defineExpose({ validate, loadData });
</script>

<style scoped>
.step-pekerjaan {
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
.save-btn {
  transition: all 0.3s ease;
}
.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 135, 84, 0.4);
}
</style>
