<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{ modalTitle }}</h5>
        <button
          type="button"
          class="btn-close"
          @click="closeModal"
          :disabled="isLoading"
        ></button>
      </div>

      <div class="modal-body">
        <form-wizard
          ref="wizardRef"
          @on-change="onChangeCurrentTab"
          @on-complete="wizardCompleted"
          color="#0d6efd"
          error-color="#dc3545"
          :title="null"
          :subtitle="null"
          :next-button-text="'Selanjutnya'"
          :back-button-text="'Sebelumnya'"
          :finish-button-text="'Selesai'"
        >
          <tab-content
            title="Biodata"
            icon="fa fa-user"
            :before-change="() => validateStep(0)"
          >
            <Step1Biodata
              ref="step1Ref"
              v-model="stepData.biodata"
              :fieldToEdit="fieldToEdit"
              @validation-change="(valid) => updateStepValidation(0, valid)"
              @user-selected="handleUserSelected"
            />
          </tab-content>

          <tab-content
            title="Unit Kerja"
            icon="fa fa-building"
            :before-change="() => validateStep(1)"
          >
            <Step2UnitKerja
              ref="step2Ref"
              v-model="stepData.unitKerja"
              :currentUserId="currentUserId"
            />
          </tab-content>

          <tab-content
            title="Jabatan"
            icon="fa fa-briefcase"
            :before-change="() => validateStep(2)"
          >
            <Step3Jabatan
              ref="step3Ref"
              v-model="stepData.jabatan"
              :currentUserId="currentUserId"
            />
          </tab-content>

          <tab-content
            title="Pangkat"
            icon="fa fa-star"
            :before-change="() => validateStep(3)"
          >
            <Step4Pangkat
              ref="step4Ref"
              v-model="stepData.pangkat"
              :currentUserId="currentUserId"
            />
          </tab-content>

          <tab-content
            title="Pendidikan"
            icon="fa fa-graduation-cap"
            :before-change="() => validateStep(4)"
          >
            <Step5Pendidikan
              ref="step5Ref"
              v-model="stepData.pendidikan"
              :currentUserId="currentUserId"
            />
          </tab-content>

          <tab-content
            title="Pelatihan"
            icon="fa fa-certificate"
            :before-change="() => validateStep(5)"
          >
            <Step6Pelatihan
              ref="step6Ref"
              v-model="stepData.pelatihan"
              :currentUserId="currentUserId"
            />
          </tab-content>

          <tab-content
            title="Prestasi"
            icon="fa fa-trophy"
            :before-change="() => validateStep(6)"
          >
            <Step7Prestasi
              ref="step7Ref"
              v-model="stepData.prestasi"
              :currentUserId="currentUserId"
            />
          </tab-content>
        </form-wizard>

        <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
          <i class="fa fa-exclamation-circle me-2"></i>{{ errorMessage }}
        </div>
      </div>

      <div class="modal-footer">
        <button
          v-if="currentTabIndex > 0"
          type="button"
          class="btn btn-secondary"
          @click="prevTab"
          :disabled="isLoading"
        >
          <i class="fa fa-arrow-left me-1"></i> Sebelumnya
        </button>
        <button
          v-if="currentTabIndex < 6"
          type="button"
          class="btn btn-primary"
          @click="nextTab"
          :disabled="isLoading"
        >
          Selanjutnya <i class="fa fa-arrow-right ms-1"></i>
        </button>
        <button
          v-else
          type="button"
          class="btn btn-success"
          @click="submitForm"
          :disabled="isLoading"
        >
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm me-1"
            role="status"
            aria-hidden="true"
          ></span>
          <i v-else class="fa fa-check me-1"></i>
          {{ isLoading ? "Menyimpan..." : "Selesai" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from "vue";
import { useToast } from "vue-toastification";
import { FormWizard, TabContent } from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";

// Import Component Steps
import Step1Biodata from "./steps/Step1Biodata.vue";
import Step2UnitKerja from "./steps/Step2UnitKerja.vue";
import Step3Jabatan from "./steps/Step3Jabatan.vue";
import Step4Pangkat from "./steps/Step4Pangkat.vue";
import Step5Pendidikan from "./steps/Step5Pendidikan.vue";
import Step6Pelatihan from "./steps/Step6Pelatihan.vue";
import Step7Prestasi from "./steps/Step7Prestasi.vue";

// Import Services
import { addUser, updateUser } from "@/services/referensi/users";
import { addUserWorkUnit } from "@/services/general/personnel/userWorkUnits";
import { addUserLevel } from "@/services/general/personnel/userLevels";
import { addUserRank } from "@/services/general/personnel/userRanks";
import { addUserEducation } from "@/services/general/personnel/userEducation";
import { addUserTraining } from "@/services/general/personnel/userTrainings";
import { addUserAchievement } from "@/services/general/personnel/userAchievments";

const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Pegawai" },
});

const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === Wizard State ===
const wizardRef = ref(null);
// Refs for Steps validation & data loading
const step1Ref = ref(null);
const step2Ref = ref(null);
const step3Ref = ref(null);
const step4Ref = ref(null);
const step5Ref = ref(null);
const step6Ref = ref(null);
const step7Ref = ref(null);

const currentTabIndex = ref(0);
const isLoading = ref(false);
const errorMessage = ref(null);
const step1IsValid = ref(false);

// === Centralized Data Management ===
const stepData = reactive({
  biodata: {
    mode: "", // "" | "existing" | "new"
    userId: null, // Selected user ID (for existing mode)
    userData: {}, // User data fields
    photoFile: null, // New photo file
    isPhotoRemoved: false,
  },
  unitKerja: { list: [] },
  jabatan: { list: [] },
  pangkat: { list: [] },
  pendidikan: { list: [] },
  pelatihan: { list: [] },
  prestasi: { list: [] },
});

// Track if user was created in this session
const createdUserId = ref(null);

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() =>
  isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`
);

/**
 * Get current user ID for use in steps 2-7
 * Priority:
 * 1. Edit mode: from fieldToEdit
 * 2. Existing user mode: from selected userId
 * 3. New user created: from createdUserId (after Step 1 save)
 */
const currentUserId = computed(() => {
  if (isEditMode.value && props.fieldToEdit) {
    return props.fieldToEdit.idpengguna;
  }
  if (stepData.biodata.userId) {
    return stepData.biodata.userId;
  }
  if (createdUserId.value) {
    return createdUserId.value;
  }
  return null;
});

// === Methods ===
function closeModal() {
  emit("close");
}

function updateStepValidation(stepIndex, isValid) {
  if (stepIndex === 0) step1IsValid.value = isValid;
}

/**
 * Handle user selection from Step1Biodata
 * When user selects existing user OR creates new user
 */
function handleUserSelected(userId) {
  if (!userId) return;

  // Update currentUserId tracking
  if (stepData.biodata.mode === "existing") {
    stepData.biodata.userId = userId;
  } else if (stepData.biodata.mode === "new") {
    createdUserId.value = userId;
  }
}

/**
 * Lazy load data when tab changes
 */
function onChangeCurrentTab(prevIndex, nextIndex) {
  currentTabIndex.value = nextIndex;
  const userId = currentUserId.value;

  // Load data for steps 2-7 when entering them
  if (userId) {
    nextTick(() => {
      if (nextIndex === 1 && step2Ref.value?.loadData)
        step2Ref.value.loadData(userId);
      if (nextIndex === 2 && step3Ref.value?.loadData)
        step3Ref.value.loadData(userId);
      if (nextIndex === 3 && step4Ref.value?.loadData)
        step4Ref.value.loadData(userId);
      if (nextIndex === 4 && step5Ref.value?.loadData)
        step5Ref.value.loadData(userId);
      if (nextIndex === 5 && step6Ref.value?.loadData)
        step6Ref.value.loadData(userId);
      if (nextIndex === 6 && step7Ref.value?.loadData)
        step7Ref.value.loadData(userId);
    });
  }
}

/**
 * Validate step before proceeding
 */
async function validateStep(stepIndex) {
  let isValid = true;

  // Step 0: Biodata - Required validation
  if (stepIndex === 0 && step1Ref.value) {
    isValid = await step1Ref.value.validate();

    if (isValid && !isEditMode.value) {
      const biodataData = stepData.biodata;

      // Mode must be selected
      if (!biodataData.mode || biodataData.mode === "") {
        toast.warning(
          "Silakan pilih apakah Anda ingin menggunakan data yang ada atau membuat data baru."
        );
        return false;
      }

      // If existing mode, user must be selected
      if (biodataData.mode === "existing" && !biodataData.userId) {
        toast.warning("Silakan pilih pengguna dari daftar yang ada.");
        return false;
      }

      // Required fields validation
      const userData = biodataData.userData;
      const requiredFields = {
        nama: "Nama",
        nik: "NIK",
        email: "Email",
        idlevel: "Level/Role",
      };

      const missingFields = [];
      for (const [field, label] of Object.entries(requiredFields)) {
        if (!userData[field] || userData[field] === "") {
          missingFields.push(label);
        }
      }

      if (missingFields.length > 0) {
        toast.error(`Field berikut wajib diisi: ${missingFields.join(", ")}`);
        return false;
      }
    }
  }

  // Steps 1-6: Optional repeater validation
  if (stepIndex === 1 && step2Ref.value)
    isValid = await step2Ref.value.validate();
  if (stepIndex === 2 && step3Ref.value)
    isValid = await step3Ref.value.validate();
  if (stepIndex === 3 && step4Ref.value)
    isValid = await step4Ref.value.validate();
  if (stepIndex === 4 && step5Ref.value)
    isValid = await step5Ref.value.validate();
  if (stepIndex === 5 && step6Ref.value)
    isValid = await step6Ref.value.validate();
  if (stepIndex === 6 && step7Ref.value)
    isValid = await step7Ref.value.validate();

  if (!isValid && stepIndex > 0) {
    toast.warning("Mohon lengkapi data yang wajib diisi pada langkah ini.");
  }

  return isValid;
}

function nextTab() {
  validateStep(currentTabIndex.value).then((valid) => {
    if (valid) wizardRef.value.nextTab();
  });
}

function prevTab() {
  wizardRef.value.prevTab();
}

function wizardCompleted() {
  submitForm();
}

// === MAIN LOGIC: SUBMIT DATA (CENTRALIZED) ===
async function submitForm() {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    // ============================================
    // STEP 1: PROCESS BIODATA
    // ============================================
    const biodataInfo = stepData.biodata;
    let userId = biodataInfo.userId;

    // Case 1: Create New User
    if (
      biodataInfo.mode === "new" &&
      !isEditMode.value &&
      !createdUserId.value
    ) {
      const userData = new FormData();

      // Append all user data fields
      const fields = biodataInfo.userData;
      for (const key in fields) {
        if (
          fields[key] !== null &&
          fields[key] !== undefined &&
          fields[key] !== ""
        ) {
          userData.append(`record[${key}]`, fields[key]);
        }
      }

      // Handle photo upload
      if (biodataInfo.photoFile) {
        userData.append(
          "upload_foto",
          biodataInfo.photoFile,
          biodataInfo.photoFile.name
        );
      }

      // Append empty dummy arrays (backend requirement)
      [
        "idpenggunajenjang",
        "idpenggunapangkat",
        "idpenggunapelatihan",
        "idpenggunapendidikan",
        "idpenggunaprestasi",
        "idpenggunaunitkerja",
      ].forEach((k) => userData.append(`record[${k}]`, ""));

      const res = await addUser(userData);
      userId = res.data?.data?.idpengguna || res.data?.idpengguna;

      if (!userId) throw new Error("Gagal mendapatkan ID Pengguna baru.");

      // Save created user ID
      createdUserId.value = userId;
      stepData.biodata.userId = userId;

      toast.success("Data pengguna baru berhasil dibuat.");
    }

    // Case 2: Update Existing User (Edit mode or existing user with changes)
    else if (
      isEditMode.value ||
      (biodataInfo.mode === "existing" && biodataInfo.userData)
    ) {
      userId = isEditMode.value
        ? props.fieldToEdit.idpengguna
        : biodataInfo.userId;

      if (!userId) throw new Error("ID Pengguna tidak valid untuk update.");

      const userData = new FormData();
      const fields = biodataInfo.userData;

      for (const key in fields) {
        if (fields[key] !== null && fields[key] !== undefined) {
          userData.append(`record[${key}]`, fields[key]);
        }
      }

      if (biodataInfo.photoFile) {
        userData.append(
          "upload_foto",
          biodataInfo.photoFile,
          biodataInfo.photoFile.name
        );
      }

      userData.append("_method", "PUT");
      await updateUser(userId, userData);

      toast.success("Data pengguna berhasil diperbarui.");
    }

    // Case 3: Using existing user without changes
    else if (biodataInfo.mode === "existing" && biodataInfo.userId) {
      userId = biodataInfo.userId;
    }

    if (!userId) {
      throw new Error(
        "ID Pengguna tidak valid. Tidak dapat melanjutkan penyimpanan data terkait."
      );
    }

    // ============================================
    // STEP 2-7: PROCESS REPEATER DATA
    // ============================================
    const promises = [];

    /**
     * Helper function to create FormData for each record
     * Attaches idpengguna and handles file uploads
     */
    const createFormData = (item, fileKey) => {
      const fd = new FormData();
      fd.append("record[idpengguna]", userId);

      Object.keys(item).forEach((key) => {
        // Skip internal/metadata keys
        if (
          [
            "_tempId",
            "isOpen",
            "fileRaw",
            "existingFile",
            "filesk_preview",
            "fileijazah_preview",
            "filesertifikat_preview",
          ].includes(key)
        ) {
          return;
        }

        // Handle file fields separately
        if (
          key === fileKey ||
          key === "filesk" ||
          key === "fileijazah" ||
          key === "filesertifikat"
        ) {
          return; // Will be handled below
        }

        if (item[key] !== null && item[key] !== undefined && item[key] !== "") {
          fd.append(`record[${key}]`, item[key]);
        }
      });

      // Append file if exists (new upload)
      // Check for various file field naming
      if (item[fileKey] && item[fileKey] instanceof File) {
        fd.append(fileKey, item[fileKey]);
      } else if (item.fileRaw && item.fileRaw instanceof File) {
        fd.append(fileKey, item.fileRaw);
      } else if (item.filesk && item.filesk instanceof File) {
        fd.append("filesk", item.filesk);
      } else if (item.fileijazah && item.fileijazah instanceof File) {
        fd.append("fileijazah", item.fileijazah);
      } else if (item.filesertifikat && item.filesertifikat instanceof File) {
        fd.append("filesertifikat", item.filesertifikat);
      }

      return fd;
    };

    // Step 2: Unit Kerja
    if (stepData.unitKerja.list && stepData.unitKerja.list.length > 0) {
      stepData.unitKerja.list.forEach((item) => {
        // Only submit items that have required fields
        if (item.idunitkerja && item.tglmulai) {
          promises.push(addUserWorkUnit(createFormData(item, "filesk")));
        }
      });
    }

    // Step 3: Jabatan
    if (stepData.jabatan.list && stepData.jabatan.list.length > 0) {
      stepData.jabatan.list.forEach((item) => {
        if (item.idjenjang && item.tglmulai) {
          promises.push(addUserLevel(createFormData(item, "filesk")));
        }
      });
    }

    // Step 4: Pangkat
    if (stepData.pangkat.list && stepData.pangkat.list.length > 0) {
      stepData.pangkat.list.forEach((item) => {
        if (item.idpangkat && item.tglmulai) {
          promises.push(addUserRank(createFormData(item, "filesk")));
        }
      });
    }

    // Step 5: Pendidikan
    if (stepData.pendidikan.list && stepData.pendidikan.list.length > 0) {
      stepData.pendidikan.list.forEach((item) => {
        if (item.idpendidikan && item.namasekolah) {
          promises.push(addUserEducation(createFormData(item, "fileijazah")));
        }
      });
    }

    // Step 6: Pelatihan
    if (stepData.pelatihan.list && stepData.pelatihan.list.length > 0) {
      stepData.pelatihan.list.forEach((item) => {
        if (item.namapelatihan) {
          promises.push(
            addUserTraining(createFormData(item, "filesertifikat"))
          );
        }
      });
    }

    // Step 7: Prestasi
    if (stepData.prestasi.list && stepData.prestasi.list.length > 0) {
      stepData.prestasi.list.forEach((item) => {
        if (item.namaprestasi) {
          promises.push(
            addUserAchievement(createFormData(item, "filesertifikat"))
          );
        }
      });
    }

    // Execute all repeater data submissions in parallel
    if (promises.length > 0) {
      await Promise.all(promises);
      toast.success("Semua data riwayat berhasil disimpan.");
    }

    toast.success("Data Berhasil Disimpan!", { timeout: 3000 });
    emit("save-successful");
    closeModal();
  } catch (error) {
    console.error("Error submitting form:", error);
    errorMessage.value =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan saat menyimpan data.";
    toast.error(errorMessage.value);
  } finally {
    isLoading.value = false;
  }
}

// === Watchers ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    if (!newData) {
      // Reset all data when modal is closed/new
      currentTabIndex.value = 0;
      createdUserId.value = null;

      Object.keys(stepData).forEach((key) => {
        if (key === "biodata") {
          stepData[key] = {
            mode: "",
            userId: null,
            userData: {},
            photoFile: null,
            isPhotoRemoved: false,
          };
        } else {
          stepData[key] = { list: [] };
        }
      });
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 1rem;
  flex-shrink: 0;
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
  flex-grow: 1;
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Vue3 Form Wizard Styling Overrides */
:deep(.vue-form-wizard .wizard-navigation .wizard-progress-with-circle) {
  margin-bottom: 2rem;
}

:deep(.vue-form-wizard .wizard-icon-circle) {
  width: 50px;
  height: 50px;
  font-size: 18px;
}

:deep(.vue-form-wizard .wizard-card-footer) {
  display: none !important;
}

/* Ensure wizard content is visible */
:deep(.wizard-tab-content) {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  min-height: 200px;
}

:deep(.fw-body-container > div) {
  display: block !important;
  visibility: visible !important;
}
</style>
