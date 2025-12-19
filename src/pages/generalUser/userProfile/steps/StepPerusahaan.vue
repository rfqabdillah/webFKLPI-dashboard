<template>
  <div class="step-perusahaan">
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">{{ t("Loading") }}</p>
    </div>

    <div v-else>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 class="mb-1">
            <i class="fa fa-briefcase me-2"></i
            >{{ t("ProfileSteps.Company.Title") }}
          </h6>
          <p class="text-muted small mb-0">
            {{ t("ProfileSteps.Company.Subtitle") }}
          </p>
        </div>
        <button class="btn btn-success btn-sm" @click="addPerusahaan">
          <i class="fa fa-plus me-1"></i>
          {{ t("ProfileSteps.Company.AddData") }}
        </button>
      </div>

      <div
        class="border-start border-4 border-primary bg-light text-dark py-2 px-3 small mb-3 rounded"
      >
        <i class="fa fa-info-circle text-primary me-1"></i>
        <strong>{{ t("ProfileSteps.WorkUnit.Note") }}</strong>
        {{ t("ProfileSteps.WorkUnit.NoteContent") }}
        <strong class="text-success"
          ><i class="fa fa-check-circle"></i>
          {{ t("ProfileSteps.WorkUnit.Active") }}</strong
        >{{ t("ProfileSteps.WorkUnit.NoteContent2") }}
      </div>

      <div
        v-if="perusahaanList.length === 0"
        class="text-center py-4 border rounded bg-light mb-3"
      >
        <i class="fa fa-briefcase text-muted fa-2x mb-2"></i>
        <p class="text-muted mb-2 small">
          {{ t("ProfileSteps.Company.EmptyState") }}
        </p>
        <button class="btn btn-outline-primary btn-sm" @click="addPerusahaan">
          <i class="fa fa-plus me-1"></i>
          {{ t("ProfileSteps.Company.AddCompany") }}
        </button>
      </div>

      <transition-group name="list" tag="div">
        <div
          v-for="(item, index) in perusahaanList"
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
              {{ t("ProfileSteps.Company.DataHeader") }}
            </h6>
            <button
              class="btn btn-outline-danger btn-sm"
              @click="removePerusahaan(index)"
              :title="t('ProfileSteps.WorkUnit.RemoveData')"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label fw-semibold">
                  {{ t("ProfileSteps.Company.CompanyName") }}
                  <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="item.namaperusahaan"
                  :class="{ 'is-invalid': getError(index, 'namaperusahaan') }"
                  :placeholder="
                    t('ProfileSteps.Company.CompanyNamePlaceholder')
                  "
                  @blur="validateField(index, 'namaperusahaan')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "namaperusahaan") }}
                </div>
              </div>

              <div class="col-md-12">
                <label class="form-label fw-semibold">{{
                  t("ProfileSteps.Company.CompanyLocation")
                }}</label>
                <textarea
                  class="form-control"
                  v-model="item.alamat"
                  :placeholder="
                    t('ProfileSteps.Company.CompanyLocationPlaceholder')
                  "
                  rows="2"
                ></textarea>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">
                  {{ t("ProfileSteps.WorkUnit.StartDate") }}
                  <span class="text-danger">*</span>
                </label>
                <input
                  type="date"
                  class="form-control"
                  v-model="item.tanggalmulai"
                  :class="{ 'is-invalid': getError(index, 'tanggalmulai') }"
                  @blur="validateField(index, 'tanggalmulai')"
                />
                <div class="invalid-feedback">
                  {{ getError(index, "tanggalmulai") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">{{
                  t("ProfileSteps.WorkUnit.EndDate")
                }}</label>
                <input
                  type="date"
                  class="form-control"
                  v-model="item.tanggalselesai"
                />
                <div class="form-text small">
                  {{ t("ProfileSteps.WorkUnit.EndDateHelp") }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold d-block">{{
                  t("ProfileSteps.WorkUnit.Status")
                }}</label>
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
                    {{ item.status || t("Inactive") }}
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
import { useI18n } from "vue-i18n";
import {
  getUserCompanies,
  deleteUserCompany,
} from "@/services/general/personnel/userCompanies";
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
const { t } = useI18n();

const isLoading = ref(false);
const isDataLoaded = ref(false);
const perusahaanList = ref([]);
const formErrors = ref([]);

// === Helper Functions ===
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

// === Lifecycle ===
onMounted(async () => {
  if (props.modelValue && Array.isArray(props.modelValue.list)) {
    perusahaanList.value = props.modelValue.list.map((item) => ({
      ...item,
      _tempId: Date.now() + Math.random(),
    }));
    formErrors.value = perusahaanList.value.map(() => ({}));
  } else {
    perusahaanList.value = [];
    formErrors.value = [];
  }

  emit("validation-change", true);
});

// === Methods ===
async function loadData(userId) {
  isLoading.value = true;
  try {
    if (userId) {
      const res = await getUserCompanies({ filter: `idpengguna=${userId}` });

      let rawData = [];
      if (Array.isArray(res.data)) {
        if (res.data[0] && res.data[0].data) {
          rawData = res.data[0].data;
        } else if (res.data.length > 0 && res.data[0].idpenggunaperusahaan) {
          rawData = res.data;
        }
      } else if (res.data && res.data.data) {
        rawData = res.data.data;
      }

      const filteredData = rawData.filter((d) => d.idpengguna === userId);

      const apiData = filteredData.map((d) => ({
        idpenggunaperusahaan: d.idpenggunaperusahaan,
        namaperusahaan: d.namaperusahaan || "",
        alamat: d.alamat || "",
        tanggalmulai: d.tanggalmulai || "",
        tanggalselesai: d.tanggalselesai || "",
        status: d.status || t("Inactive"),
        _tempId: Date.now() + Math.random(),
      }));

      const uniqueData = uniqueByKey(apiData, "idpenggunaperusahaan");

      perusahaanList.value = uniqueData;
      formErrors.value = perusahaanList.value.map(() => ({}));
      emit("update:modelValue", { list: perusahaanList.value });
    }

    isDataLoaded.value = true;
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    isLoading.value = false;
  }
}

function addPerusahaan() {
  perusahaanList.value.push({
    _tempId: Date.now(),
    namaperusahaan: "",
    alamat: "",
    tanggalmulai: "",
    tanggalselesai: "",
    status: t("Inactive"),
  });

  formErrors.value.push({});
}

function removePerusahaan(index) {
  const item = perusahaanList.value[index];

  Swal.fire({
    title: t("ProfileSteps.Company.DeleteConfirmTitle"),
    text: item.idpenggunaperusahaan
      ? t("ProfileSteps.Company.DeleteConfirmTextDB")
      : t("ProfileSteps.Company.DeleteConfirmText"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `<i class="fa fa-check me-2"></i> ${t(
      "ProfileSteps.Company.DeleteButton"
    )}`,
    cancelButtonText: `<i class="fa fa-times me-2"></i> ${t(
      "ProfileSteps.Company.CancelButton"
    )}`,
    cancelButtonColor: "#efefef",
    confirmButtonColor: "#d33",
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        if (item.idpenggunaperusahaan) {
          await deleteUserCompany(item.idpenggunaperusahaan);
        }
        toast.success(t("ProfileSteps.Company.DeleteSuccess"));

        perusahaanList.value.splice(index, 1);
        formErrors.value.splice(index, 1);
      } catch (error) {
        console.error("Error deleting perusahaan:", error);
        toast.error(t("ProfileSteps.Company.DeleteError"));
      }
    }
  });
}

function handleStatusChange(index, isChecked) {
  const newStatus = isChecked
    ? t("ProfileSteps.WorkUnit.Active")
    : t("Inactive");
  perusahaanList.value[index].status = newStatus;

  if (newStatus === "Aktif") {
    perusahaanList.value.forEach((item, i) => {
      if (i !== index) {
        item.status = t("Inactive");
      }
    });
  }
}

// === Validation Logic ===
function getError(index, field) {
  return formErrors.value[index] ? formErrors.value[index][field] : "";
}

function validateField(index, field) {
  const item = perusahaanList.value[index];
  if (!formErrors.value[index]) formErrors.value[index] = {};

  if (field === "namaperusahaan") {
    if (!item.namaperusahaan) {
      formErrors.value[index].namaperusahaan = t(
        "ProfileSteps.Company.Validation.NameRequired"
      );
    } else {
      formErrors.value[index].namaperusahaan = "";
    }
  }

  if (field === "tanggalmulai") {
    if (!item.tanggalmulai) {
      formErrors.value[index].tanggalmulai = t(
        "ProfileSteps.Company.Validation.StartDateRequired"
      );
    } else {
      formErrors.value[index].tanggalmulai = "";
    }
  }
}

function validate() {
  let isValid = true;

  if (perusahaanList.value.length === 0) {
    return true;
  }

  perusahaanList.value.forEach((item, index) => {
    if (!formErrors.value[index]) formErrors.value[index] = {};

    if (!item.namaperusahaan) {
      formErrors.value[index].namaperusahaan = t(
        "ProfileSteps.Company.Validation.NameRequired"
      );
      isValid = false;
    } else {
      formErrors.value[index].namaperusahaan = "";
    }

    if (!item.tanggalmulai) {
      formErrors.value[index].tanggalmulai = t(
        "ProfileSteps.Company.Validation.StartDateRequired"
      );
      isValid = false;
    } else {
      formErrors.value[index].tanggalmulai = "";
    }
  });

  return isValid;
}

// === Sync & Watch ===
watch(
  perusahaanList,
  (newList) => {
    emit("update:modelValue", { list: newList });
    let isValid = true;
    if (newList.length > 0) {
      isValid = newList.every(
        (item) => item.namaperusahaan && item.tanggalmulai
      );
    }

    emit("validation-change", isValid);
  },
  { deep: true }
);

defineExpose({ validate, loadData });
</script>

<style scoped>
.step-perusahaan {
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
