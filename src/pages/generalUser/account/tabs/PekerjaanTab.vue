<template>
  <div class="step-pekerjaan">
    <div v-if="isLoading" class="py-3">
      <SkeletonGroup type="list-card" :count="3" />
    </div>

    <div v-else>
      <!-- Header with Mode Toggle -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="mb-1">
            <i class="fa fa-briefcase me-2"></i>
            {{ $t("ProfileSteps.Job.Title") }}
          </h6>
          <p class="text-muted small mb-0">
            {{ $t("ProfileSteps.Job.Subtitle") }}
          </p>
        </div>
        <!-- View Mode: Show Edit Button -->
        <button
          v-if="!isEditMode && pekerjaanList.length > 0"
          class="btn btn-outline-primary btn-sm"
          @click="enterEditMode"
        >
          <i class="fa fa-pencil me-1"></i>
          Ubah Data
        </button>
        <!-- Edit Mode: Show Add Button -->
        <button
          v-if="isEditMode"
          class="btn btn-primary btn-sm"
          @click="addPekerjaan"
        >
          <i class="fa fa-plus me-1"></i> {{ $t("ProfileSteps.Job.AddData") }}
        </button>
      </div>

      <!-- Info Note (only in Edit Mode) -->
      <div
        v-if="isEditMode"
        class="border-start border-4 border-primary bg-light text-dark py-2 px-3 small mb-3 rounded"
      >
        <i class="fa fa-info-circle text-primary me-1"></i>
        <strong>{{ $t("ProfileSteps.WorkUnit.Note") }}</strong>
        {{ $t("ProfileSteps.WorkUnit.NoteContent") }}
        <strong class="text-success">
          <i class="fa fa-check-circle"></i> {{ $t("Active") }}
        </strong>
        {{ $t("ProfileSteps.WorkUnit.NoteContent2") }}
      </div>

      <!-- Empty State -->
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

      <!-- VIEW MODE -->
      <div v-if="!isEditMode && pekerjaanList.length > 0" class="row">
        <div
          v-for="item in sortedPekerjaanList"
          :key="item._tempId"
          class="col-12 mb-2"
        >
          <div class="card shadow-sm border hover-lift">
            <div class="card-body py-3 px-4">
              <div class="d-flex align-items-start">
                <!-- Icon Box -->
                <div class="flex-shrink-0 me-3">
                  <div
                    class="icon-box bg-light text-primary rounded-3 d-flex align-items-center justify-content-center"
                    style="width: 42px; height: 42px"
                  >
                    <i class="fa fa-briefcase"></i>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="fw-bold text-dark mb-1">
                        {{ item.namapekerjaan }}
                      </h6>
                      <div class="text-muted mb-2" style="font-size: 14px">
                        <i class="fa fa-building-o me-1"></i>
                        {{ item.namaperusahaan }}
                      </div>
                      <div class="text-muted mb-2" style="font-size: 14px">
                        <i class="fa fa-tag me-1"></i>
                        {{ getJobTypeName(item.idtipepekerjaan) }}
                      </div>
                      <div class="text-muted mb-2" style="font-size: 14px">
                        <i class="fa fa-calendar me-1"></i>
                        {{ formatDate(item.tanggalmulai, locale) }} -
                        {{
                          item.tanggalselesai
                            ? formatDate(item.tanggalselesai, locale)
                            : $t("Now")
                        }}
                      </div>
                    </div>
                    <span
                      class="badge rounded-pill px-3 py-1"
                      :class="
                        item.status === 'Aktif'
                          ? 'bg-soft-success text-success'
                          : 'bg-soft-secondary text-secondary'
                      "
                    >
                      <i
                        :class="
                          item.status === 'Aktif'
                            ? 'fa fa-check-circle me-1'
                            : 'fa fa-times-circle me-1'
                        "
                      ></i>
                      {{
                        item.status === "Aktif" ? $t("Active") : $t("Inactive")
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- EDIT MODE -->
      <div v-if="isEditMode">
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
                <div class="col-12">
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

                <div class="col-12">
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

                <div class="col-12">
                  <label class="form-label fw-semibold">
                    {{ $t("ProfileSteps.Job.JobType") }}
                    <span class="text-danger">*</span>
                  </label>
                  <select
                    class="form-select"
                    v-model="item.idtipepekerjaan"
                    :class="{
                      'is-invalid': getError(index, 'idtipepekerjaan'),
                    }"
                    required
                    @blur="validateField(index, 'idtipepekerjaan')"
                  >
                    <option value="" disabled>
                      {{ $t("ProfileSteps.Job.SelectJobType") }}
                    </option>
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

                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    {{ $t("Start Date") }} <span class="text-danger">*</span>
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

                <div class="col-md-6">
                  <label class="form-label fw-semibold">{{
                    $t("End Date")
                  }}</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="item.tanggalselesai"
                  />
                  <div class="form-text small">
                    {{ $t("ProfileSteps.Job.EndDateHelp") }}
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
                      @change="
                        (e) => handleStatusChange(index, e.target.checked)
                      "
                    />
                    <label
                      class="form-check-label"
                      :for="'statusSwitch-' + index"
                    >
                      {{
                        item.status === "Aktif" ? $t("Active") : $t("Inactive")
                      }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition-group>

        <!-- Action Buttons in Edit Mode -->
        <div
          v-if="pekerjaanList.length > 0"
          class="d-flex justify-content-end gap-2 mt-3"
        >
          <button
            v-if="hasExistingData"
            class="btn btn-outline-secondary"
            @click="cancelEditMode"
            :disabled="isSaving"
          >
            <i class="fa fa-arrow-left me-1"></i>
            Kembali
          </button>
          <button
            class="btn btn-primary save-btn"
            @click="saveData"
            :disabled="isSaving"
          >
            <span
              v-if="isSaving"
              class="spinner-border spinner-border-sm me-2"
              role="status"
            ></span>
            <i v-else class="fa fa-save me-2"></i>
            {{
              isSaving ? $t("Saving") + "..." : $t("Save") + " " + $t("Data")
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
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
import { SkeletonGroup } from "@/components/base/default/SkeletonLoader";
import { formatDate } from "@/utils/formatDate";

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
  shouldLoad: {
    type: Boolean,
    default: false,
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

// === View/Edit Mode State ===
const isEditMode = ref(false);
const hasExistingData = ref(false);
const originalData = ref([]);

// === Computed: Sort list with Aktif first ===
const sortedPekerjaanList = computed(() => {
  return [...pekerjaanList.value].sort((a, b) => {
    if (a.status === "Aktif" && b.status !== "Aktif") return -1;
    if (a.status !== "Aktif" && b.status === "Aktif") return 1;
    return 0;
  });
});

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

watch(
  () => locale.value,
  () => {
    formErrors.value.forEach((errors, index) => {
      if (Object.keys(errors).some((key) => errors[key])) {
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

watch(
  () => props.shouldLoad,
  async (shouldLoad) => {
    if (shouldLoad && props.currentUserId && !isDataLoaded.value) {
      await loadData(props.currentUserId);
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

      hasExistingData.value = uniqueData.length > 0;
      originalData.value = JSON.parse(JSON.stringify(uniqueData));
      isEditMode.value = uniqueData.length === 0;
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
    toast.error(t("ProfileSteps.Job.LoadError"));
  }
}

async function saveData() {
  const isValid = validate();
  if (!isValid) {
    toast.error(t("ProfileSteps.Modal.Messages.CompleteRequired"));
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

    toast.success(t("Data saved successfully"));

    hasExistingData.value = pekerjaanList.value.length > 0;
    originalData.value = JSON.parse(JSON.stringify(pekerjaanList.value));
    isEditMode.value = false;
  } catch (error) {
    console.error("Error saving pekerjaan:", error);
    toast.error(t("Error saving data"));
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
    title: t("ProfileSteps.Job.DeleteConfirmTitle"),
    text: item.idpenggunapekerjaan
      ? t("ProfileSteps.Job.DeleteConfirmTextDB")
      : t("ProfileSteps.Job.DeleteConfirmText"),
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
        toast.success(t("ProfileSteps.Job.DeleteSuccess"));

        pekerjaanList.value.splice(index, 1);
        formErrors.value.splice(index, 1);
      } catch (error) {
        console.error("Error deleting pekerjaan:", error);
        toast.error(t("ProfileSteps.Job.DeleteError"));
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

// === View/Edit Mode Methods ===
function enterEditMode() {
  originalData.value = JSON.parse(JSON.stringify(pekerjaanList.value));
  isEditMode.value = true;
}

function cancelEditMode() {
  pekerjaanList.value = JSON.parse(JSON.stringify(originalData.value));
  formErrors.value = pekerjaanList.value.map(() => ({}));
  isEditMode.value = false;
}

function getJobTypeName(idtipepekerjaan) {
  const jt = jobTypeOptions.value.find(
    (j) => j.idtipepekerjaan === idtipepekerjaan
  );
  return jt ? jt.namatipepekerjaan : "-";
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
  background: #0d6efd;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  background: #0b5ed7;
  transform: scale(1.02);
}

.save-btn:disabled {
  opacity: 1;
  background: #6c9bd1;
  cursor: not-allowed;
  color: white;
}

.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08) !important;
}

.bg-soft-success {
  background-color: rgba(25, 135, 84, 0.1);
}

.bg-soft-secondary {
  background-color: rgba(108, 117, 125, 0.1);
}

.badge.rounded-pill {
  font-size: 13px;
  padding: 8px 14px !important;
  font-weight: 600;
}

.step-pekerjaan .row {
  --bs-gutter-y: 0;
}

.step-pekerjaan .row > .col-12.mb-2 {
  margin-bottom: 8px !important;
}

.step-pekerjaan .card.hover-lift {
  margin-bottom: 0;
}
</style>
