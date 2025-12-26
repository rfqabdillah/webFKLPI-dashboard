<template>
  <div class="step-pelatihan">
    <div v-if="isLoading" class="py-3">
      <SkeletonGroup type="form-card" :count="2" />
    </div>

    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="mb-1">
            <i class="fa fa-certificate me-2"></i
            >{{ $t("ProfileSteps.Training.Title") }}
          </h6>
          <p class="text-muted small mb-0">
            {{ $t("ProfileSteps.Training.Subtitle") }}
          </p>
        </div>
        <button class="btn btn-primary btn-sm" @click="addPelatihan">
          <i class="fa fa-plus me-1"></i>
          {{ $t("ProfileSteps.Training.AddData") }}
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
        v-if="pelatihanList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-certificate text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">
          {{ $t("ProfileSteps.Training.EmptyState") }}
        </p>
        <button class="btn btn-outline-primary btn-sm" @click="addPelatihan">
          <i class="fa fa-plus me-1"></i>
          {{ $t("ProfileSteps.Training.AddTraining") }}
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
              <span class="badge me-2" style="background-color: #0d6efd">{{
                index + 1
              }}</span>
              {{ $t("ProfileSteps.Training.DataHeader") }}
            </h6>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="removePelatihan(index)"
              :title="$t('Delete')"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  {{ $t("ProfileSteps.Training.TrainingName") }}
                  <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namapelatihan"
                  :class="{ 'is-invalid': getError(index, 'namapelatihan') }"
                  required
                  :placeholder="
                    $t('ProfileSteps.Training.TrainingNamePlaceholder')
                  "
                  @blur="validateField(index, 'namapelatihan')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namapelatihan") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  {{ $t("ProfileSteps.Training.Organizer") }}
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
                    $t('ProfileSteps.Training.OrganizerPlaceholder')
                  "
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
        v-if="pelatihanList.length > 0"
        class="d-flex justify-content-end mt-3"
      >
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
import {
  getUserTrainings,
  addUserTraining,
  updateUserTraining,
  deleteUserTraining,
} from "@/services/general/personnel/userTrainings";
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
const pelatihanList = ref([]);
const formErrors = ref([]);

// === Yup Validation Schema ===
const getValidationSchema = () =>
  yup.object().shape({
    namapelatihan: yup
      .string()
      .required(() => t("ProfileSteps.Training.Validation.NameRequired")),
    namapenyelenggara: yup
      .string()
      .required(() => t("ProfileSteps.Training.Validation.OrganizerRequired")),
    tglmulai: yup
      .string()
      .required(() => t("ProfileSteps.Training.Validation.StartDateRequired")),
  });

// Re-validate when locale changes to update error messages
watch(
  () => locale.value,
  () => {
    formErrors.value.forEach((errors, index) => {
      if (Object.keys(errors).some((key) => errors[key])) {
        const item = pelatihanList.value[index];
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
  // Only set initial values if data hasn't been loaded from API yet
  if (!isDataLoaded.value) {
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
    if (userId) {
      const res = await getUserTrainings({ filter: `idpengguna=${userId}` });
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

      // Deduplicate by ID
      const uniqueData = uniqueByKey(apiData, "idpenggunapelatihan");

      pelatihanList.value = uniqueData;
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

const isSaving = ref(false);

// === Save Function ===
async function saveData() {
  const isValid = await validate();
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
    for (const item of pelatihanList.value) {
      const formData = new FormData();
      formData.append("record[idpengguna]", props.currentUserId);
      formData.append("record[namapelatihan]", item.namapelatihan || "");
      formData.append(
        "record[namapenyelenggara]",
        item.namapenyelenggara || ""
      );
      formData.append("record[tglmulai]", item.tglmulai || "");
      formData.append("record[tglselesai]", item.tglselesai || "");
      formData.append("record[status]", item.status || "Tidak Aktif");

      // Handle file upload
      if (item.filesertifikat instanceof File) {
        formData.append("upload_filesertifikat", item.filesertifikat);
      }

      if (item.idpenggunapelatihan) {
        formData.append("_method", "PUT");
        await updateUserTraining(item.idpenggunapelatihan, formData);
      } else {
        const response = await addUserTraining(formData);
        if (response?.data?.idpenggunapelatihan) {
          item.idpenggunapelatihan = response.data.idpenggunapelatihan;
        } else if (response?.data?.data?.idpenggunapelatihan) {
          item.idpenggunapelatihan = response.data.data.idpenggunapelatihan;
        }
      }
    }

    toast.success("Data pelatihan berhasil disimpan");
  } catch (error) {
    console.error("Error saving pelatihan:", error);
    toast.error("Gagal menyimpan data pelatihan");
  } finally {
    isSaving.value = false;
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
    title: t("ProfileSteps.Training.DeleteConfirmTitle"),
    text: item.idpenggunapelatihan
      ? t("ProfileSteps.Training.DeleteConfirmTextDB")
      : t("ProfileSteps.Training.DeleteConfirmText"),
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
        if (item.idpenggunapelatihan) {
          await deleteUserTraining(item.idpenggunapelatihan);
        }
        toast.success(t("ProfileSteps.Training.DeleteSuccess"));

        pelatihanList.value.splice(index, 1);
        formErrors.value.splice(index, 1);
      } catch (error) {
        console.error("Error deleting pelatihan:", error);
        toast.error(t("ProfileSteps.Training.DeleteError"));
      }
    }
  });
}

function removeFile(index) {
  pelatihanList.value[index].filesertifikat = null;
  pelatihanList.value[index].filesertifikat_preview = "";
  pelatihanList.value[index]._fileRemoved = true;
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
  if (pelatihanList.value.length === 0) return true;

  let isValid = true;
  const schema = getValidationSchema();

  for (let index = 0; index < pelatihanList.value.length; index++) {
    const item = pelatihanList.value[index];
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
</style>
