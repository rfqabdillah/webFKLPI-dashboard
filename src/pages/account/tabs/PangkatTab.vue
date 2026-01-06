<template>
  <div class="step-pangkat">
    <div v-if="isLoading" class="py-3">
      <SkeletonGroup type="form-card" :count="2" />
    </div>

    <div v-else>
      <!-- Header with Mode Toggle -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="mb-1">
            <i class="fa fa-star me-2"></i>{{ $t("ProfileSteps.Rank.Title") }}
          </h6>
          <p class="text-muted small mb-0">
            {{ $t("ProfileSteps.Rank.Subtitle") }}
          </p>
        </div>
        <!-- View Mode: Show Edit Button -->
        <button
          v-if="!isEditMode && pangkatList.length > 0"
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
          @click="addPangkat"
        >
          <i class="fa fa-plus me-1"></i> {{ $t("ProfileSteps.Rank.AddData") }}
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
        v-if="pangkatList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-star text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">
          {{ $t("ProfileSteps.Rank.EmptyState") }}
        </p>
        <button class="btn btn-outline-primary btn-sm" @click="addPangkat">
          <i class="fa fa-plus me-1"></i> {{ $t("ProfileSteps.Rank.AddRank") }}
        </button>
      </div>

      <!-- VIEW MODE -->
      <div v-if="!isEditMode && pangkatList.length > 0" class="row">
        <div
          v-for="item in sortedPangkatList"
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
                    <i class="fa fa-star"></i>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="fw-bold text-dark mb-1">
                        {{ getRankName(item.idpangkat) }}
                      </h6>
                      <div class="text-muted mb-2" style="font-size: 14px">
                        <i class="fa fa-calendar me-1"></i>
                        {{ formatDate(item.tglmulai, locale) }} -
                        {{
                          item.tglselesai
                            ? formatDate(item.tglselesai, locale)
                            : $t("Now")
                        }}
                      </div>
                      <div v-if="isUrl(item.filesk)" class="small">
                        <div class="mt-2">
                          <a
                            :href="item.filesk"
                            target="_blank"
                            class="btn btn-outline-primary btn-sm rounded-pill px-3 d-inline-flex align-items-center shadow-sm transition-all"
                          >
                            Tampilkan SK
                            <i class="fa fa-external-link ms-2"></i>
                          </a>
                        </div>
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
            v-for="(item, index) in pangkatList"
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
                {{ $t("ProfileSteps.Rank.DataHeader") }}
              </h6>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="removePangkat(index)"
                :title="$t('Delete')"
              >
                <i class="fa fa-trash"></i>
              </button>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label fw-semibold">
                    {{ $t("ProfileSteps.Rank.RankLabel") }}
                    <span class="text-danger">*</span>
                  </label>
                  <select
                    class="form-select"
                    v-model="item.idpangkat"
                    :class="{ 'is-invalid': getError(index, 'idpangkat') }"
                    required
                    @blur="validateField(index, 'idpangkat')"
                  >
                    <option value="" disabled>
                      {{ $t("ProfileSteps.Rank.SelectRank") }}
                    </option>
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
                    {{ $t("Start Date") }} <span class="text-danger">*</span>
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
                  <label class="form-label fw-semibold">{{
                    $t("End Date")
                  }}</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="item.tglselesai"
                  />
                  <div class="form-text small">
                    {{ $t("ProfileSteps.WorkUnit.EndDateHelp") }}
                  </div>
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
                        >
                          File Tersimpan:
                        </small>
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
                      <i class="fa fa-external-link me-1"></i> {{ $t("Open") }}
                    </a>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger ms-2"
                      @click="removeFile(index)"
                      :title="$t('RemoveFile')"
                    >
                      <i class="fa fa-times"></i>
                    </button>
                  </div>

                  <div
                    v-else-if="item.filesk_preview"
                    class="mt-2 p-2 border border-success rounded bg-white text-success"
                  >
                    <div
                      class="d-flex align-items-center justify-content-between"
                    >
                      <div class="d-flex align-items-center overflow-hidden">
                        <i class="fa fa-check-circle fa-lg me-2"></i>
                        <div class="overflow-hidden">
                          <small class="d-block text-muted"
                            >{{ $t("NewFileSelected") }}:</small
                          >
                          <strong class="text-truncate d-block">{{
                            item.filesk_preview
                          }}</strong>
                        </div>
                      </div>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-danger ms-2"
                        @click="removeFile(index)"
                        :title="$t('RemoveFile')"
                      >
                        <i class="fa fa-times"></i>
                      </button>
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
          v-if="pangkatList.length > 0"
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
import { getRanks } from "@/services/referensi/ranks";
import {
  getUserRanks,
  addUserRank,
  updateUserRank,
  deleteUserRank,
} from "@/services/general/personnel/userRanks";
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
const rankOptions = ref([]);
const pangkatList = ref([]);
const formErrors = ref([]);

// === View/Edit Mode State ===
const isEditMode = ref(false);
const hasExistingData = ref(false);
const originalData = ref([]);

// === Computed: Sort list with Aktif first ===
const sortedPangkatList = computed(() => {
  return [...pangkatList.value].sort((a, b) => {
    if (a.status === "Aktif" && b.status !== "Aktif") return -1;
    if (a.status !== "Aktif" && b.status === "Aktif") return 1;
    return 0;
  });
});

// === Yup Validation Schema ===
const getValidationSchema = () =>
  yup.object().shape({
    idpangkat: yup
      .string()
      .required(() => t("ProfileSteps.Rank.Validation.RankRequired")),
    tglmulai: yup
      .string()
      .required(() => t("ProfileSteps.Rank.Validation.StartDateRequired")),
  });

watch(
  () => locale.value,
  () => {
    formErrors.value.forEach((errors, index) => {
      if (Object.keys(errors).some((key) => errors[key])) {
        const item = pangkatList.value[index];
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

// === Helper Functions ===
const isUrl = (string) => {
  return (
    typeof string === "string" && string.length > 0 && string.startsWith("http")
  );
};

onMounted(async () => {
  await fetchRanks();

  if (!isDataLoaded.value) {
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
        filesk_preview: d.fileskpangkat || d.filesk ? "Surat Keputusan" : "",
        _tempId: Date.now() + Math.random(),
      }));

      const uniqueData = uniqueByKey(apiData, "idpenggunapangkat");

      pangkatList.value = uniqueData;
      formErrors.value = pangkatList.value.map(() => ({}));
      emit("update:modelValue", { list: pangkatList.value });

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
    toast.error(t("ProfileSteps.Rank.LoadError"));
  }
}

const isSaving = ref(false);

async function saveData() {
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
    for (const item of pangkatList.value) {
      const formData = new FormData();
      formData.append("record[idpengguna]", props.currentUserId);
      formData.append("record[idpangkat]", item.idpangkat || "");
      formData.append("record[tglmulaipangkat]", item.tglmulai || "");
      formData.append("record[tglselesaipangkat]", item.tglselesai || "");
      formData.append("record[statuspangkat]", item.status || "Tidak Aktif");

      if (item.filesk instanceof File) {
        formData.append("upload_fileskpangkat", item.filesk);
      }

      if (item.idpenggunapangkat) {
        formData.append("_method", "PUT");
        await updateUserRank(item.idpenggunapangkat, formData);
      } else {
        const response = await addUserRank(formData);
        if (response?.data?.idpenggunapangkat) {
          item.idpenggunapangkat = response.data.idpenggunapangkat;
        } else if (response?.data?.data?.idpenggunapangkat) {
          item.idpenggunapangkat = response.data.data.idpenggunapangkat;
        }
      }
    }

    toast.success(t("Data saved successfully"));

    hasExistingData.value = pangkatList.value.length > 0;
    originalData.value = JSON.parse(JSON.stringify(pangkatList.value));
    isEditMode.value = false;
  } catch (error) {
    console.error("Error saving pangkat:", error);
    toast.error(t("Error saving data"));
  } finally {
    isSaving.value = false;
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
    title: t("ProfileSteps.Rank.DeleteConfirmTitle"),
    text: item.idpenggunapangkat
      ? t("ProfileSteps.Rank.DeleteConfirmTextDB")
      : t("ProfileSteps.Rank.DeleteConfirmText"),
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
        if (item.idpenggunapangkat) {
          await deleteUserRank(item.idpenggunapangkat);
        }
        toast.success(t("ProfileSteps.Rank.DeleteSuccess"));

        pangkatList.value.splice(index, 1);
        formErrors.value.splice(index, 1);
      } catch (error) {
        console.error("Error deleting pangkat:", error);
        toast.error(t("ProfileSteps.Rank.DeleteError"));
      }
    }
  });
}

function removeFile(index) {
  pangkatList.value[index].filesk = null;
  pangkatList.value[index].filesk_preview = "";
  pangkatList.value[index]._fileRemoved = true;
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

// === View/Edit Mode Methods ===
function enterEditMode() {
  originalData.value = JSON.parse(JSON.stringify(pangkatList.value));
  isEditMode.value = true;
}

function cancelEditMode() {
  pangkatList.value = JSON.parse(JSON.stringify(originalData.value));
  formErrors.value = pangkatList.value.map(() => ({}));
  isEditMode.value = false;
}

function getRankName(idpangkat) {
  const rank = rankOptions.value.find((r) => r.idpangkat === idpangkat);
  return rank ? `${rank.golongan}/${rank.ruang}-${rank.pangkat}` : "-";
}

// === Validation Logic ===
function getError(index, field) {
  return formErrors.value[index] ? formErrors.value[index][field] : "";
}

async function validateField(index, field) {
  const item = pangkatList.value[index];
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
  if (pangkatList.value.length === 0) return true;

  let isValid = true;
  const schema = getValidationSchema();

  for (let index = 0; index < pangkatList.value.length; index++) {
    const item = pangkatList.value[index];
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

.step-pangkat .row {
  --bs-gutter-y: 0;
}

.step-pangkat .row > .col-12.mb-2 {
  margin-bottom: 8px !important;
}

.step-pangkat .card.hover-lift {
  margin-bottom: 0;
}
</style>
