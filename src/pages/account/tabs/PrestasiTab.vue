<template>
  <div class="step-prestasi">
    <div v-if="isLoading" class="py-3">
      <SkeletonGroup type="form-card" :count="2" />
    </div>

    <div v-else>
      <!-- Header with Mode Toggle -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="mb-1">
            <i class="fa fa-trophy me-2"></i>
            {{ $t("ProfileSteps.Achievement.Title") }}
          </h6>
          <p class="text-muted small mb-0">
            {{ $t("ProfileSteps.Achievement.Subtitle") }}
          </p>
        </div>
        <!-- View Mode: Show Edit Button -->
        <button
          v-if="!isEditMode && prestasiList.length > 0"
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
          @click="addPrestasi"
        >
          <i class="fa fa-plus me-1"></i>
          {{ $t("ProfileSteps.Achievement.AddData") }}
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
        v-if="prestasiList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-trophy text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">
          {{ $t("ProfileSteps.Achievement.EmptyState") }}
        </p>
        <button class="btn btn-outline-primary btn-sm" @click="addPrestasi">
          <i class="fa fa-plus me-1"></i>
          {{ $t("ProfileSteps.Achievement.AddAchievement") }}
        </button>
      </div>

      <!-- VIEW MODE -->
      <div v-if="!isEditMode && prestasiList.length > 0" class="row">
        <div
          v-for="item in sortedPrestasiList"
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
                    <i class="fa fa-trophy"></i>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 class="fw-bold text-dark mb-1">
                        {{ item.namaprestasi }}
                      </h6>
                      <div class="text-muted mb-2" style="font-size: 14px">
                        <i class="fa fa-building-o me-1"></i>
                        {{ item.namapenyelenggara }}
                      </div>
                      <div class="text-muted mb-2" style="font-size: 14px">
                        <i class="fa fa-globe me-1"></i>
                        {{ getScaleName(item.idskala) }}
                      </div>
                      <div v-if="isUrl(item.filesertifikat)" class="small">
                        <div class="mt-2">
                          <a
                            :href="item.filesertifikat"
                            target="_blank"
                            class="btn btn-outline-primary btn-sm rounded-pill px-3 d-inline-flex align-items-center shadow-sm transition-all"
                          >
                            Tampilkan Sertifikat
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
            v-for="(item, index) in prestasiList"
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
                {{ $t("ProfileSteps.Achievement.DataHeader") }}
              </h6>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="removePrestasi(index)"
                :title="$t('Delete')"
              >
                <i class="fa fa-trash"></i>
              </button>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-12">
                  <label class="form-label fw-semibold">
                    {{ $t("ProfileSteps.Achievement.AchievementName") }}
                    <span class="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="item.namaprestasi"
                    :class="{ 'is-invalid': getError(index, 'namaprestasi') }"
                    required
                    :placeholder="
                      $t('ProfileSteps.Achievement.AchievementNamePlaceholder')
                    "
                    @blur="validateField(index, 'namaprestasi')"
                  />
                  <div class="invalid-feedback">
                    {{ getError(index, "namaprestasi") }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">
                    {{ $t("ProfileSteps.Achievement.AchievementScale") }}
                    <span class="text-danger">*</span>
                  </label>
                  <select
                    class="form-select"
                    v-model="item.idskala"
                    :class="{ 'is-invalid': getError(index, 'idskala') }"
                    required
                    @blur="validateField(index, 'idskala')"
                  >
                    <option value="" disabled>
                      {{ $t("ProfileSteps.Achievement.SelectScale") }}
                    </option>
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
                    {{ $t("ProfileSteps.Achievement.Organizer") }}
                    <span class="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="item.namapenyelenggara"
                    :class="{
                      'is-invalid': getError(index, 'namapenyelenggara'),
                    }"
                    required
                    :placeholder="
                      $t('ProfileSteps.Achievement.OrganizerPlaceholder')
                    "
                    @blur="validateField(index, 'namapenyelenggara')"
                  />
                  <div class="invalid-feedback">
                    {{ getError(index, "namapenyelenggara") }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">{{
                    $t("ProfileSteps.Achievement.CertificateFile")
                  }}</label>
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
                        >
                          File Tersimpan:
                        </small>
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
                    v-else-if="item.filesertifikat_preview"
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
                            item.filesertifikat_preview
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
          v-if="prestasiList.length > 0"
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
import { getScales } from "@/services/referensi/scale";
import {
  getUserAchievements,
  addUserAchievement,
  updateUserAchievement,
  deleteUserAchievement,
} from "@/services/general/personnel/userAchievments";
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
const scaleOptions = ref([]);
const prestasiList = ref([]);
const formErrors = ref([]);

// === View/Edit Mode State ===
const isEditMode = ref(false);
const hasExistingData = ref(false);
const originalData = ref([]);

// === Computed: Sort list with Aktif first ===
const sortedPrestasiList = computed(() => {
  return [...prestasiList.value].sort((a, b) => {
    if (a.status === "Aktif" && b.status !== "Aktif") return -1;
    if (a.status !== "Aktif" && b.status === "Aktif") return 1;
    return 0;
  });
});

// === Yup Validation Schema ===
const getValidationSchema = () =>
  yup.object().shape({
    namaprestasi: yup
      .string()
      .required(() => t("ProfileSteps.Achievement.Validation.NameRequired")),
    idskala: yup
      .string()
      .required(() => t("ProfileSteps.Achievement.Validation.ScaleRequired")),
    namapenyelenggara: yup
      .string()
      .required(() =>
        t("ProfileSteps.Achievement.Validation.OrganizerRequired")
      ),
  });

watch(
  () => locale.value,
  () => {
    formErrors.value.forEach((errors, index) => {
      if (Object.keys(errors).some((key) => errors[key])) {
        const item = prestasiList.value[index];
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
  await fetchScales();

  if (!isDataLoaded.value) {
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
    if (scaleOptions.value.length === 0) {
      await fetchScales();
    }
    if (userId) {
      const res = await getUserAchievements({ filter: `idpengguna=${userId}` });
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
      const filteredData = rawData;
      const apiData = filteredData.map((d) => ({
        idpenggunaprestasi: d.idpenggunaprestasi,
        namaprestasi: d.namaprestasi,
        idskala: d.idskala,
        namapenyelenggara: d.namapenyelenggara,
        status: d.status,
        filesertifikat: d.filesertifikat,
        filesertifikat_preview: d.filesertifikat ? "Sertifikat" : "",
        _tempId: Date.now() + Math.random(),
      }));

      const uniqueData = uniqueByKey(apiData, "idpenggunaprestasi");

      prestasiList.value = uniqueData;
      formErrors.value = prestasiList.value.map(() => ({}));
      emit("update:modelValue", { list: prestasiList.value });

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
    toast.error(t("ProfileSteps.Achievement.LoadError"));
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
    for (const item of prestasiList.value) {
      const formData = new FormData();
      formData.append("record[idpengguna]", props.currentUserId);
      formData.append("record[namaprestasi]", item.namaprestasi || "");
      formData.append("record[idskala]", item.idskala || "");
      formData.append(
        "record[namapenyelenggara]",
        item.namapenyelenggara || ""
      );
      formData.append("record[status]", item.status || "Tidak Aktif");

      if (item.filesertifikat instanceof File) {
        formData.append("upload_filesertifikat", item.filesertifikat);
      }

      if (item.idpenggunaprestasi) {
        formData.append("_method", "PUT");
        await updateUserAchievement(item.idpenggunaprestasi, formData);
      } else {
        const response = await addUserAchievement(formData);
        if (response?.data?.idpenggunaprestasi) {
          item.idpenggunaprestasi = response.data.idpenggunaprestasi;
        } else if (response?.data?.data?.idpenggunaprestasi) {
          item.idpenggunaprestasi = response.data.data.idpenggunaprestasi;
        }
      }
    }

    toast.success(t("Data saved successfully"));

    hasExistingData.value = prestasiList.value.length > 0;
    originalData.value = JSON.parse(JSON.stringify(prestasiList.value));
    isEditMode.value = false;
  } catch (error) {
    console.error("Error saving prestasi:", error);
    toast.error(t("Error saving data"));
  } finally {
    isSaving.value = false;
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
    title: t("ProfileSteps.Achievement.DeleteConfirmTitle"),
    text: item.idpenggunaprestasi
      ? t("ProfileSteps.Achievement.DeleteConfirmTextDB")
      : t("ProfileSteps.Achievement.DeleteConfirmText"),
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
        if (item.idpenggunaprestasi) {
          await deleteUserAchievement(item.idpenggunaprestasi);
        }
        toast.success(t("ProfileSteps.Achievement.DeleteSuccess"));

        prestasiList.value.splice(index, 1);
        formErrors.value.splice(index, 1);
      } catch (error) {
        console.error("Error deleting prestasi:", error);
        toast.error(t("ProfileSteps.Achievement.DeleteError"));
      }
    }
  });
}

function removeFile(index) {
  prestasiList.value[index].filesertifikat = null;
  prestasiList.value[index].filesertifikat_preview = "";
  prestasiList.value[index]._fileRemoved = true;
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

// === View/Edit Mode Methods ===
function enterEditMode() {
  originalData.value = JSON.parse(JSON.stringify(prestasiList.value));
  isEditMode.value = true;
}

function cancelEditMode() {
  prestasiList.value = JSON.parse(JSON.stringify(originalData.value));
  formErrors.value = prestasiList.value.map(() => ({}));
  isEditMode.value = false;
}

function getScaleName(idskala) {
  const scale = scaleOptions.value.find((s) => s.idskala === idskala);
  return scale ? scale.namaskala : "-";
}

// === Validation Logic ===
function getError(index, field) {
  return formErrors.value[index] ? formErrors.value[index][field] : "";
}

async function validateField(index, field) {
  const item = prestasiList.value[index];
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
  if (prestasiList.value.length === 0) return true;

  let isValid = true;
  const schema = getValidationSchema();

  for (let index = 0; index < prestasiList.value.length; index++) {
    const item = prestasiList.value[index];
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

.step-prestasi .row {
  --bs-gutter-y: 0;
}

.step-prestasi .row > .col-12.mb-2 {
  margin-bottom: 8px !important;
}

.step-prestasi .card.hover-lift {
  margin-bottom: 0;
}
</style>
