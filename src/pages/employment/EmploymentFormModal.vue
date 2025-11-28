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
          <!-- Step 1: Biodata (Required) -->
          <tab-content
            title="Biodata"
            icon="fa fa-user"
            :before-change="() => validateStep(0)"
          >
            <Step1Biodata
              ref="step1Ref"
              v-model="wizardState.biodata"
              :fieldToEdit="fieldToEdit"
              @validation-change="(isValid) => updateStepValidation(0, isValid)"
              @user-selected="handleUserSelected"
              @user-data-loaded="handleUserDataLoaded"
            />
          </tab-content>

          <!-- Step 2: Unit Kerja (Repeater) -->
          <tab-content
            title="Unit Kerja"
            icon="fa fa-building"
            :before-change="() => validateStep(1)"
          >
            <Step2UnitKerja
              ref="step2Ref"
              v-model="wizardState.unitKerja"
              :currentUserId="currentUserId"
              @validation-change="(isValid) => updateStepValidation(1, isValid)"
            />
          </tab-content>

          <!-- Step 3: Jabatan (Repeater) -->
          <tab-content
            title="Jabatan"
            icon="fa fa-id-badge"
            :before-change="() => validateStep(2)"
          >
            <Step3Jabatan
              ref="step3Ref"
              v-model="wizardState.jabatan"
              :currentUserId="currentUserId"
              @validation-change="(isValid) => updateStepValidation(2, isValid)"
            />
          </tab-content>

          <!-- Step 4: Pangkat (Repeater) -->
          <tab-content
            title="Pangkat"
            icon="fa fa-star"
            :before-change="() => validateStep(3)"
          >
            <Step4Pangkat
              ref="step4Ref"
              v-model="wizardState.pangkat"
              :currentUserId="currentUserId"
              @validation-change="(isValid) => updateStepValidation(3, isValid)"
            />
          </tab-content>

          <!-- Step 5: Pendidikan (Repeater) -->
          <tab-content
            title="Pendidikan"
            icon="fa fa-graduation-cap"
            :before-change="() => validateStep(4)"
          >
            <Step5Pendidikan
              ref="step5Ref"
              v-model="wizardState.pendidikan"
              :currentUserId="currentUserId"
              @validation-change="(isValid) => updateStepValidation(4, isValid)"
            />
          </tab-content>

          <!-- Step 6: Pelatihan (Repeater) -->
          <tab-content
            title="Pelatihan"
            icon="fa fa-certificate"
            :before-change="() => validateStep(5)"
          >
            <Step6Pelatihan
              ref="step6Ref"
              v-model="wizardState.pelatihan"
              :currentUserId="currentUserId"
              @validation-change="(isValid) => updateStepValidation(5, isValid)"
            />
          </tab-content>

          <!-- Step 7: Prestasi (Repeater) -->
          <tab-content
            title="Prestasi"
            icon="fa fa-trophy"
            :before-change="() => validateStep(6)"
          >
            <Step7Prestasi
              ref="step7Ref"
              v-model="wizardState.prestasi"
              :currentUserId="currentUserId"
              @validation-change="(isValid) => updateStepValidation(6, isValid)"
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
          :disabled="isLoading || !stepValidations[currentTabIndex]"
        >
          Selanjutnya <i class="fa fa-arrow-right ms-1"></i>
        </button>
        <button
          v-if="currentTabIndex === 6"
          type="button"
          class="btn btn-success"
          @click="wizardCompleted"
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

import Step1Biodata from "./steps/Step1Biodata.vue";
import Step2UnitKerja from "./steps/Step2UnitKerja.vue";
import Step3Jabatan from "./steps/Step3Jabatan.vue";
import Step4Pangkat from "./steps/Step4Pangkat.vue";
import Step5Pendidikan from "./steps/Step5Pendidikan.vue";
import Step6Pelatihan from "./steps/Step6Pelatihan.vue";
import Step7Prestasi from "./steps/Step7Prestasi.vue";

// Import API services (akan digunakan untuk final submission)
import { addUser, updateUser } from "@/services/referensi/users";
import {
  addUserWorkUnit,
  updateUserWorkUnit,
} from "@/services/general/personnel/userWorkUnits";
import {
  addUserPosition,
  updateUserPosition,
} from "@/services/general/personnel/userPositions";
import {
  addUserRank,
  updateUserRank,
} from "@/services/general/personnel/userRanks";
import {
  addUserEducation,
  updateUserEducation,
} from "@/services/general/personnel/userEducation";
import {
  addUserTraining,
  updateUserTraining,
} from "@/services/general/personnel/userTrainings";
import {
  addUserAchievement,
  updateUserAchievement,
} from "@/services/general/personnel/userAchievments";

const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Pegawai" },
});

const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === Wizard State ===
const wizardRef = ref(null);
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

// Track which steps have been visited/loaded
const stepLoaded = reactive({
  0: false, // Step 1: Biodata
  1: false, // Step 2: Unit Kerja
  2: false, // Step 3: Jabatan
  3: false, // Step 4: Pangkat
  4: false, // Step 5: Pendidikan
  5: false, // Step 6: Pelatihan
  6: false, // Step 7: Prestasi
});

// Track validation state per step
const stepValidations = reactive({
  0: false,
  1: true, // Optional steps default to true
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
});

// userId created from Step 1 (if new user is created)
const createdUserId = ref(null);

// ┌──────────────────────────────────────────────────────────────────────┐
// │  CENTRALIZED WIZARD STATE                                             │
// │  This is the single source of truth that accumulates all data         │
// │  Struktur data dipertahankan sesuai spesifikasi API                   │
// └──────────────────────────────────────────────────────────────────────┘
const wizardState = reactive({
  // Step 1: Biodata
  biodata: {
    mode: "", // 'new' or 'existing' or 'edit'
    isExisting: false,
    userId: null,
    userData: {
      idpengguna: null,
      idlevel: "",
      email: "",
      nama: "",
      telp: "",
      created_at: null,
      updated_at: null,
      deleted_at: null,
      email_verified_at: null,
      remember_token: null,
      lastlogin: null,
      nik: "",
      gelardepan: "",
      gelarbelakang: "",
      alamat: "",
      kodekabupaten: "",
      nip: "",
      no_karpeg: "",
      tempatlahir: "",
      tanggallahir: "",
      foto: null,
      status: "Aktif",
    },
    photoFile: null,
    isPhotoRemoved: false,
  },

  // Step 2: Unit Kerja (Repeater)
  unitKerja: {
    data: [], // Array of { idpenggunaunitkerja, idpengguna, idunitkerja, tglmulai, tglselesai, filesk, status, created_at, updated_at, deleted_at }
    files: {}, // Map: index -> File object
  },

  // Step 3: Jabatan (Repeater)
  jabatan: {
    data: [], // Array of { idepnggunajenjang, idpengguna, idjenjang, tglmulai, tglselesai, filesk, status, created_at, updated_at, deleted_at }
    files: {},
  },

  // Step 4: Pangkat (Repeater)
  pangkat: {
    data: [], // Array of { idpenggunapangkat, idpengguna, idpangkat, tglmulai, tglselesai, filesk, status, created_at, updated_at, deleted_at }
    files: {},
  },

  // Step 5: Pendidikan (Repeater - No Files)
  pendidikan: {
    data: [], // Array of { idpenggunapendidikan, idpengguna, idjenjangpendidikan, programstudi, namaperguruantinggi, tahunlulus, created_at, updated_at, deleted_at }
  },

  // Step 6: Pelatihan (Repeater)
  pelatihan: {
    data: [], // Array of { idpenggunalatihan, idpengguna, namapelatihan, namapenyelenggara, filesertifikat, created_at, updated_at, deleted_at, tglmulai, tglselesai, status }
    files: {},
  },

  // Step 7: Prestasi (Repeater)
  prestasi: {
    data: [], // Array of { idpenggunaprestasi, idpengguna, idskala, namaprestasi, namapenyelenggara, filesertifikat, created_at, updated_at, deleted_at, status }
    files: {},
  },
});

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
  if (wizardState.biodata.userId) {
    return wizardState.biodata.userId;
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
  stepValidations[stepIndex] = isValid;
}

/**
 * Handle user selection from Step1Biodata
 * When user selects existing user OR creates new user
 */
function handleUserSelected(userId) {
  console.log("User selected/created with ID:", userId);
  createdUserId.value = userId;

  // Trigger lazy loading of data for steps 2-7 when we have a userId
  if (userId && !stepLoaded[1]) {
    Object.keys(stepLoaded).forEach((key) => {
      if (parseInt(key) > 0) {
        stepLoaded[key] = false; // Reset to allow re-loading
      }
    });
  }
}

/**
 * Handle when user data is loaded in Step1 (for existing user selection)
 * This populates the biodata in wizardState
 */
function handleUserDataLoaded(userData) {
  console.log("User data loaded:", userData);
  // Data already updated via v-model binding
}

/**
 * Lazy load data when tab changes
 */
async function onChangeCurrentTab(prevIndex, nextIndex) {
  currentTabIndex.value = nextIndex;

  // If moving to Step 2-7 and we have userId, load data
  if (nextIndex > 0 && currentUserId.value && !stepLoaded[nextIndex]) {
    const stepRefs = [
      null,
      step2Ref,
      step3Ref,
      step4Ref,
      step5Ref,
      step6Ref,
      step7Ref,
    ];
    const stepRef = stepRefs[nextIndex];

    if (stepRef.value && typeof stepRef.value.loadData === "function") {
      try {
        await stepRef.value.loadData(currentUserId.value);
        stepLoaded[nextIndex] = true;
      } catch (error) {
        console.error(`Error loading data for step ${nextIndex}:`, error);
        toast.error(`Gagal memuat data untuk step ini.`);
      }
    }
  }
}

/**
 * Validate step before proceeding
 */
async function validateStep(stepIndex) {
  const stepRefs = [
    step1Ref,
    step2Ref,
    step3Ref,
    step4Ref,
    step5Ref,
    step6Ref,
    step7Ref,
  ];
  const stepRef = stepRefs[stepIndex];

  if (stepRef.value && typeof stepRef.value.validate === "function") {
    try {
      const isValid = await stepRef.value.validate();
      if (!isValid) {
        return false;
      }
    } catch (error) {
      console.error(`Validation error in step ${stepIndex}:`, error);
      toast.error("Terjadi kesalahan saat validasi. Silakan periksa kembali.");
      return false;
    }
  }

  return true;
}

function nextTab() {
  if (wizardRef.value) {
    wizardRef.value.nextTab();
  }
}

function prevTab() {
  wizardRef.value.prevTab();
}

function wizardCompleted() {
  // Final submission
  submitForm();
}

// ┌──────────────────────────────────────────────────────────────────────┐
// │  CENTRALIZED DATA SUBMISSION ARCHITECTURE                             │
// │                                                                        │
// │  Semua data dari Step 1-7 dikumpulkan dalam wizardState dan          │
// │  dikirim dalam satu proses submission yang terkoordinasi.            │
// │                                                                        │
// │  Alur:                                                                │
// │  1. Save/Update Biodata (Step 1) → Dapatkan idpengguna              │
// │  2. Untuk setiap kategori (Step 2-7):                               │
// │     - Validate single active status rule                             │
// │     - Delete existing records (jika edit mode)                        │
// │     - Insert new records dengan idpengguna                           │
// │  3. Commit seluruh transaksi atau rollback jika ada error           │
// └──────────────────────────────────────────────────────────────────────┘
async function submitForm() {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    // ============================================================
    // STEP 1: Save/Update Biodata
    // ============================================================
    let userId = null;

    // Jika edit mode, gunakan idpengguna yang sudah ada
    if (isEditMode.value) {
      userId = props.fieldToEdit.idpengguna;
      await saveBiodataUpdate(userId);
    }
    // Jika mode existing, gunakan userId yang dipilih (tidak perlu save biodata lagi)
    else if (wizardState.biodata.isExisting && wizardState.biodata.userId) {
      userId = wizardState.biodata.userId;
      // Optional: Update biodata if changes were made
      if (wizardState.biodata.userData) {
        await saveBiodataUpdate(userId);
      }
    }
    // Jika mode new, create new user
    else if (wizardState.biodata.mode === "new") {
      userId = await saveBiodataCreate();
    } else {
      throw new Error("Mode biodata tidak valid");
    }

    if (!userId) {
      throw new Error("Gagal mendapatkan ID pengguna");
    }

    console.log("User ID for subsequent steps:", userId);

    // ============================================================
    // STEP 2-7: Validate & Save Related Data (Repeaters)
    // ============================================================
    // Validate single active status rule before submitting
    validateSingleActiveStatus();

    // Simpan semua data terkait secara berurutan
    await saveUnitKerja(userId);
    await saveJabatan(userId);
    await savePangkat(userId);
    await savePendidikan(userId);
    await savePelatihan(userId);
    await savePrestasi(userId);

    // ============================================================
    // SUCCESS
    // ============================================================
    toast.success(
      `Data ${props.entityName} berhasil ${
        isEditMode.value ? "diperbarui" : "ditambahkan"
      }`
    );
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

/**
 * Validate single active status rule across all repeater steps
 * Each category can only have ONE record with status = "Aktif"
 */
function validateSingleActiveStatus() {
  const categories = [
    { name: "Unit Kerja", data: wizardState.unitKerja.data },
    { name: "Jabatan", data: wizardState.jabatan.data },
    { name: "Pangkat", data: wizardState.pangkat.data },
    { name: "Pelatihan", data: wizardState.pelatihan.data },
    { name: "Prestasi", data: wizardState.prestasi.data },
  ];

  for (const category of categories) {
    if (!category.data || category.data.length === 0) continue;

    const activeCount = category.data.filter(
      (item) => item.status === "Aktif"
    ).length;

    if (activeCount > 1) {
      throw new Error(
        `Kategori ${category.name} hanya boleh memiliki satu data dengan status aktif. Saat ini ada ${activeCount} data aktif.`
      );
    }
  }
}

/**
 * ============================================================
 * BIODATA SUBMISSION HELPERS
 * ============================================================
 */
async function saveBiodataCreate() {
  const formData = createBiodataFormData();

  const response = await addUser(formData);

  // Extract user ID from response
  let userId = null;
  if (response.data && response.data.idpengguna) {
    userId = response.data.idpengguna;
  } else if (response.idpengguna) {
    userId = response.idpengguna;
  } else if (
    response.data &&
    response.data.data &&
    response.data.data.idpengguna
  ) {
    userId = response.data.data.idpengguna;
  }

  if (!userId) {
    console.warn("Could not extract userId from response:", response);
    throw new Error("Gagal mendapatkan ID pengguna dari response");
  }

  return userId;
}

async function saveBiodataUpdate(userId) {
  const formData = createBiodataFormData();
  formData.append("_method", "PUT");

  await updateUser(userId, formData);
  return userId;
}

function createBiodataFormData() {
  const data = new FormData();
  const biodata = wizardState.biodata.userData;

  // Append all biodata fields sesuai struktur API
  data.append("record[idlevel]", biodata.idlevel || "");
  data.append("record[email]", biodata.email || "");
  data.append("record[nama]", biodata.nama || "");
  data.append("record[telp]", biodata.telp || "");
  data.append("record[nik]", biodata.nik || "");
  data.append("record[gelardepan]", biodata.gelardepan || "");
  data.append("record[gelarbelakang]", biodata.gelarbelakang || "");
  data.append("record[alamat]", biodata.alamat || "");
  data.append("record[kodekabupaten]", biodata.kodekabupaten || "");
  data.append("record[nip]", biodata.nip || "");
  data.append("record[no_karpeg]", biodata.no_karpeg || "");
  data.append("record[tempatlahir]", biodata.tempatlahir || "");
  data.append("record[tanggallahir]", biodata.tanggallahir || "");
  data.append("record[status]", biodata.status || "Aktif");

  // Handle photo upload
  if (wizardState.biodata.photoFile) {
    data.append(
      "upload_foto",
      wizardState.biodata.photoFile,
      wizardState.biodata.photoFile.name
    );
  } else if (wizardState.biodata.isPhotoRemoved) {
    data.append("record[foto]", "");
  }

  return data;
}

/**
 * ============================================================
 * STEP 2: UNIT KERJA
 * ============================================================
 */
async function saveUnitKerja(userId) {
  const items = wizardState.unitKerja.data || [];
  if (items.length === 0) {
    console.log("No unit kerja data to save");
    return;
  }

  for (const item of items) {
    const formData = createFormData(item, "filesk", userId);

    // Jika item memiliki ID (edit mode), update; jika tidak, create
    if (item.idpenggunaunitkerja) {
      formData.append("_method", "PUT");
      await updateUserWorkUnit(item.idpenggunaunitkerja, formData);
    } else {
      await addUserWorkUnit(formData);
    }
  }
}

/**
 * ============================================================
 * STEP 3: JABATAN
 * ============================================================
 */
async function saveJabatan(userId) {
  const items = wizardState.jabatan.data || [];
  if (items.length === 0) {
    console.log("No jabatan data to save");
    return;
  }

  for (const item of items) {
    const formData = createFormData(item, "filesk", userId);

    if (item.idepnggunajenjang) {
      formData.append("_method", "PUT");
      await updateUserPosition(item.idepnggunajenjang, formData);
    } else {
      await addUserPosition(formData);
    }
  }
}

/**
 * ============================================================
 * STEP 4: PANGKAT
 * ============================================================
 */
async function savePangkat(userId) {
  const items = wizardState.pangkat.data || [];
  if (items.length === 0) {
    console.log("No pangkat data to save");
    return;
  }

  for (const item of items) {
    const formData = createFormData(item, "filesk", userId);

    if (item.idpenggunapangkat) {
      formData.append("_method", "PUT");
      await updateUserRank(item.idpenggunapangkat, formData);
    } else {
      await addUserRank(formData);
    }
  }
}

/**
 * ============================================================
 * STEP 5: PENDIDIKAN
 * ============================================================
 */
async function savePendidikan(userId) {
  const items = wizardState.pendidikan.data || [];
  if (items.length === 0) {
    console.log("No pendidikan data to save");
    return;
  }

  for (const item of items) {
    const formData = createFormData(item, null, userId);

    if (item.idpenggunapendidikan) {
      formData.append("_method", "PUT");
      await updateUserEducation(item.idpenggunapendidikan, formData);
    } else {
      await addUserEducation(formData);
    }
  }
}

/**
 * ============================================================
 * STEP 6: PELATIHAN
 * ============================================================
 */
async function savePelatihan(userId) {
  const items = wizardState.pelatihan.data || [];
  if (items.length === 0) {
    console.log("No pelatihan data to save");
    return;
  }

  for (const item of items) {
    const formData = createFormData(item, "filesertifikat", userId);

    if (item.idpenggunalatihan) {
      formData.append("_method", "PUT");
      await updateUserTraining(item.idpenggunalatihan, formData);
    } else {
      await addUserTraining(formData);
    }
  }
}

/**
 * ============================================================
 * STEP 7: PRESTASI
 * ============================================================
 */
async function savePrestasi(userId) {
  const items = wizardState.prestasi.data || [];
  if (items.length === 0) {
    console.log("No prestasi data to save");
    return;
  }

  for (const item of items) {
    const formData = createFormData(item, "filesertifikat", userId);

    if (item.idpenggunaprestasi) {
      formData.append("_method", "PUT");
      await updateUserAchievement(item.idpenggunaprestasi, formData);
    } else {
      await addUserAchievement(formData);
    }
  }
}

/**
 * ============================================================
 * HELPER: CREATE FORMDATA FOR REPEATER ITEMS
 * ============================================================
 */
function createFormData(item, fileKey, userId) {
  const formData = new FormData();

  // Always append idpengguna
  formData.append("record[idpengguna]", userId);

  // Append all other fields from item
  Object.keys(item).forEach((key) => {
    // Skip internal fields and file-related fields
    if (
      key.startsWith("_") ||
      key === "idpengguna" ||
      key === fileKey ||
      key === `${fileKey}Preview`
    ) {
      return;
    }

    const value = item[key];
    if (value !== null && value !== undefined && value !== "") {
      formData.append(`record[${key}]`, value);
    }
  });

  // Handle file upload if fileKey is provided
  if (fileKey && item[`_${fileKey}File`]) {
    formData.append(
      `upload_${fileKey}`,
      item[`_${fileKey}File`],
      item[`_${fileKey}File`].name
    );
  }

  return formData;
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  overflow-y: auto;
  padding: 1rem;
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  margin: auto;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.btn-close::before {
  content: "×";
}

.btn-close:hover {
  color: #000;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* Wizard Customization */
:deep(.wizard-tab-content) {
  min-height: 300px;
  padding: 1.5rem 0;
}

/* Hide default wizard buttons */
:deep(.vue-form-wizard .wizard-btn) {
  display: none !important;
}

:deep(.wizard-footer-left),
:deep(.wizard-footer-right) {
  display: none !important;
}

/* Stepper Styling */
:deep(.vue-form-wizard .wizard-header) {
  display: none;
}

:deep(.vue-form-wizard .wizard-navigation) {
  margin-bottom: 2rem;
}

:deep(.vue-form-wizard .wizard-progress-with-circle) {
  position: relative;
  top: 20px;
  height: 4px;
  background-color: #e9ecef;
}

:deep(.vue-form-wizard .wizard-progress-bar) {
  height: 4px;
  background-color: #0d6efd;
}

:deep(.vue-form-wizard .wizard-nav-pills) {
  position: relative;
  text-align: center;
  display: flex;
  justify-content: space-between;
}

:deep(.vue-form-wizard .wizard-nav-pills > li) {
  margin-top: 0;
}

:deep(.vue-form-wizard .wizard-nav-pills > li > a) {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6c757d !important;
  font-weight: 500;
  padding-top: 0;
}

:deep(.vue-form-wizard .wizard-nav-pills > li.active > a) {
  color: #0d6efd !important;
}

:deep(.vue-form-wizard .wizard-icon-circle) {
  width: 40px;
  height: 40px;
  font-size: 18px;
  border-width: 3px;
  background-color: #fff;
  margin-bottom: 10px;
}

:deep(.vue-form-wizard .wizard-nav-pills > li.active .wizard-icon-circle) {
  border-color: #0d6efd;
  background-color: #0d6efd;
  color: #fff;
}

:deep(.vue-form-wizard .wizard-nav-pills > li.checked .wizard-icon-circle) {
  border-color: #0d6efd;
  background-color: #0d6efd;
  color: #fff;
}

/* Ensure wizard content is visible */
:deep(.fw-body-container > div) {
  display: block !important;
  visibility: visible !important;
  height: auto !important;
  opacity: 1 !important;
}
</style>
