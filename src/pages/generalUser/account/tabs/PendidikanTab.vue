<template>
  <div class="step-pendidikan">
    <div v-if="isLoading" class="py-3">
      <SkeletonGroup type="list-card" :count="3" />
    </div>

    <div v-else>
      <!-- Header with Mode Toggle -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="mb-1">
            <i class="fa fa-graduation-cap me-2"></i>
            {{ $t("ProfileSteps.Education.Title") }}
          </h6>
          <p class="text-muted small mb-0">
            {{ $t("ProfileSteps.Education.Subtitle") }}
          </p>
        </div>
        <!-- View Mode: Show Edit Button -->
        <button
          v-if="!isEditMode && pendidikanList.length > 0"
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
          @click="addPendidikan"
        >
          <i class="fa fa-plus me-1"></i>
          {{ $t("ProfileSteps.Education.AddData") }}
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-if="pendidikanList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-graduation-cap text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">
          {{ $t("ProfileSteps.Education.EmptyState") }}
        </p>
        <button class="btn btn-outline-primary btn-sm" @click="addPendidikan">
          <i class="fa fa-plus me-1"></i>
          {{ $t("ProfileSteps.Education.AddEducation") }}
        </button>
      </div>

      <!-- VIEW MODE -->
      <div v-if="!isEditMode && pendidikanList.length > 0" class="row">
        <div
          v-for="item in sortedPendidikanList"
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
                    <i class="fa fa-graduation-cap"></i>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="fw-bold text-dark mb-1">
                        {{ getEducationLevelName(item.idjenjangpendidikan) }} -
                        {{ item.programstudi }}
                      </h6>
                      <div class="text-muted mb-2" style="font-size: 14px">
                        <i class="fa fa-university me-1"></i>
                        {{ item.namaperguruantinggi }}
                      </div>
                      <div class="text-muted mb-2" style="font-size: 14px">
                        <i class="fa fa-calendar me-1"></i>
                        {{ $t("ProfileSteps.Education.GraduationYear") }}:
                        {{ item.tahunlulus }}
                      </div>
                    </div>
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
            v-for="(item, index) in pendidikanList"
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
                {{ $t("ProfileSteps.Education.DataHeader") }}
              </h6>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="removePendidikan(index)"
                :title="$t('ProfileSteps.Education.RemoveData') || $t('Delete')"
              >
                <i class="fa fa-trash"></i>
              </button>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    {{ $t("ProfileSteps.Education.EducationLevel") }}
                    <span class="text-danger">*</span>
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
                    <option value="" disabled>
                      {{ $t("ProfileSteps.Education.SelectEducationLevel") }}
                    </option>
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
                    {{ $t("ProfileSteps.Education.GraduationYear") }}
                    <span class="text-danger">*</span>
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
                    {{ $t("ProfileSteps.Education.Major") }}
                    <span class="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="item.programstudi"
                    :class="{ 'is-invalid': getError(index, 'programstudi') }"
                    required
                    :placeholder="$t('ProfileSteps.Education.MajorPlaceholder')"
                    @blur="validateField(index, 'programstudi')"
                  />
                  <div class="invalid-feedback">
                    {{ getError(index, "programstudi") }}
                  </div>
                </div>

                <div class="col-md-12">
                  <label class="form-label fw-semibold">
                    {{ $t("ProfileSteps.Education.Institution") }}
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
                    :placeholder="
                      $t('ProfileSteps.Education.InstitutionPlaceholder')
                    "
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

        <!-- Action Buttons in Edit Mode -->
        <div
          v-if="pendidikanList.length > 0"
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
import { getEducationLevels } from "@/services/referensi/educationLevels";
import {
  getUserEducations,
  addUserEducation,
  updateUserEducation,
  deleteUserEducation,
} from "@/services/general/personnel/userEducation";
import Swal from "sweetalert2";
import * as yup from "yup";
import { SkeletonGroup } from "@/components/base/default/SkeletonLoader";

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
const educationLevelOptions = ref([]);
const pendidikanList = ref([]);
const formErrors = ref([]);

// === View/Edit Mode State ===
const isEditMode = ref(false);
const hasExistingData = ref(false);
const originalData = ref([]);

// === Computed: Sort by Graduation Year Descending ===
const sortedPendidikanList = computed(() => {
  return [...pendidikanList.value].sort((a, b) => {
    return b.tahunlulus - a.tahunlulus;
  });
});

// === Yup Validation Schema ===
const getValidationSchema = () =>
  yup.object().shape({
    idjenjangpendidikan: yup
      .string()
      .required(() => t("ProfileSteps.Education.Validation.LevelRequired")),
    programstudi: yup
      .string()
      .required(() => t("ProfileSteps.Education.Validation.MajorRequired")),
    namaperguruantinggi: yup
      .string()
      .required(() =>
        t("ProfileSteps.Education.Validation.InstitutionRequired")
      ),
    tahunlulus: yup
      .number()
      .required(() => t("ProfileSteps.Education.Validation.YearRequired"))
      .min(1900, () => t("ProfileSteps.Education.Validation.YearInvalid"))
      .max(2100, () => t("ProfileSteps.Education.Validation.YearInvalid")),
  });

// Re-validate when locale changes to update error messages
watch(
  () => locale.value,
  () => {
    formErrors.value.forEach((errors, index) => {
      if (Object.keys(errors).some((key) => errors[key])) {
        const item = pendidikanList.value[index];
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

onMounted(async () => {
  await fetchEducationLevels();

  // Only set initial values if data hasn't been loaded from API yet
  if (!isDataLoaded.value) {
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
  }
  emit("validation-change", true);
});

// Watch for shouldLoad to trigger data loading (lazy load)
watch(
  () => props.shouldLoad,
  async (shouldLoad) => {
    if (shouldLoad && props.currentUserId && !isDataLoaded.value) {
      await loadData(props.currentUserId);
    }
  },
  { immediate: true }
);

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
    if (educationLevelOptions.value.length === 0) {
      await fetchEducationLevels();
    }
    if (userId) {
      const res = await getUserEducations({ filter: `idpengguna=${userId}` });
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
      const filteredData = rawData; // API already filters by idpengguna
      const apiData = filteredData.map((d) => ({
        idpenggunapendidikan: d.idpenggunapendidikan,
        idjenjangpendidikan: d.idjenjangpendidikan || d.id_jenjang_pendidikan,
        programstudi: d.programstudi,
        namaperguruantinggi: d.namaperguruantinggi,
        tahunlulus: d.tahunlulus,
        _tempId: Date.now() + Math.random(),
      }));

      // Deduplicate by ID
      const uniqueData = uniqueByKey(apiData, "idpenggunapendidikan");

      pendidikanList.value = uniqueData;
      formErrors.value = pendidikanList.value.map(() => ({}));
      emit("update:modelValue", { list: pendidikanList.value });

      // Track if we have existing data from API
      hasExistingData.value = uniqueData.length > 0;
      originalData.value = JSON.parse(JSON.stringify(uniqueData));

      // If we have data, start in View Mode; otherwise Edit Mode
      isEditMode.value = uniqueData.length === 0;
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

const isSaving = ref(false);

// === Save Function ===
async function saveData() {
  // Validate first
  const isValid = await validate();
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
    for (const item of pendidikanList.value) {
      const formData = new FormData();
      formData.append("record[idpengguna]", props.currentUserId);
      formData.append("record[idjenjangpendidikan]", item.idjenjangpendidikan);
      formData.append("record[programstudi]", item.programstudi || "");
      formData.append(
        "record[namaperguruantinggi]",
        item.namaperguruantinggi || ""
      );
      formData.append("record[tahunlulus]", item.tahunlulus || "");

      if (item.idpenggunapendidikan) {
        // Update existing
        formData.append("_method", "PUT");
        await updateUserEducation(item.idpenggunapendidikan, formData);
      } else {
        // Create new
        const response = await addUserEducation(formData);
        // Update the item with the new ID
        if (response?.data?.idpenggunapendidikan) {
          item.idpenggunapendidikan = response.data.idpenggunapendidikan;
        } else if (response?.data?.data?.idpenggunapendidikan) {
          item.idpenggunapendidikan = response.data.data.idpenggunapendidikan;
        }
      }
    }

    toast.success(t("Data saved successfully"));

    // Update tracking and switch to View Mode
    hasExistingData.value = pendidikanList.value.length > 0;
    originalData.value = JSON.parse(JSON.stringify(pendidikanList.value));
    isEditMode.value = false;
  } catch (error) {
    console.error("Error saving pendidikan:", error);
    toast.error(t("Error saving data"));
  } finally {
    isSaving.value = false;
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
    title: t("ProfileSteps.Education.DeleteConfirmTitle"),
    text: item.idpenggunapendidikan
      ? t("ProfileSteps.Education.DeleteConfirmTextDB")
      : t("ProfileSteps.Education.DeleteConfirmText"),
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
        if (item.idpenggunapendidikan) {
          await deleteUserEducation(item.idpenggunapendidikan);
        }
        toast.success(t("ProfileSteps.Education.DeleteSuccess"));

        pendidikanList.value.splice(index, 1);
        formErrors.value.splice(index, 1);
      } catch (error) {
        console.error("Error deleting pendidikan:", error);
        toast.error(t("ProfileSteps.Education.DeleteError"));
      }
    }
  });
}

// === View/Edit Mode Methods ===
function enterEditMode() {
  originalData.value = JSON.parse(JSON.stringify(pendidikanList.value));
  isEditMode.value = true;
}

function cancelEditMode() {
  pendidikanList.value = JSON.parse(JSON.stringify(originalData.value));
  formErrors.value = pendidikanList.value.map(() => ({}));
  isEditMode.value = false;
}

// === Helper Functions for View Mode ===
function getEducationLevelName(idjenjangpendidikan) {
  const level = educationLevelOptions.value.find(
    (l) => l.idjenjangpendidikan === idjenjangpendidikan
  );
  return level ? level.namajenjangpendidikan : "-";
}

// === Validation Logic (Yup-based) ===
function getError(index, field) {
  return formErrors.value[index] ? formErrors.value[index][field] : "";
}

async function validateField(index, field) {
  const item = pendidikanList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  try {
    const schema = getValidationSchema();
    await schema.validateAt(field, item);
    formErrors.value[index][field] = "";
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      formErrors.value[index][field] = error.message;
    }
  }
}

async function validate() {
  if (pendidikanList.value.length === 0) return true;

  let isValid = true;
  const schema = getValidationSchema();

  for (let index = 0; index < pendidikanList.value.length; index++) {
    const item = pendidikanList.value[index];
    if (!formErrors.value[index]) formErrors.value[index] = {};

    try {
      await schema.validate(item, { abortEarly: false });
      formErrors.value[index] = {};
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

.bg-soft-primary {
  background-color: rgba(13, 110, 253, 0.1);
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

.step-pendidikan .row {
  --bs-gutter-y: 0;
}

.step-pendidikan .row > .col-12.mb-2 {
  margin-bottom: 8px !important;
}

.step-pendidikan .card.hover-lift {
  margin-bottom: 0;
}
</style>
