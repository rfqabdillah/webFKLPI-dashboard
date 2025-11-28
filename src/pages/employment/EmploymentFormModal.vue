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
          Sebelumnya
        </button>
        <button
          v-if="currentTabIndex < 6"
          type="button"
          class="btn btn-primary"
          @click="nextTab"
          :disabled="isLoading"
        >
          Selanjutnya
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

const stepData = reactive({
  biodata: { mode: "new", userId: null, userData: {}, photoFile: null },
  unitKerja: { list: [] },
  jabatan: { list: [] },
  pangkat: { list: [] },
  pendidikan: { list: [] },
  pelatihan: { list: [] },
  prestasi: { list: [] },
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() =>
  isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`
);

// Mendapatkan ID Pengguna Sementara (Penting untuk Load Data di step selanjutnya)
const currentUserId = computed(() => {
  if (props.fieldToEdit) return props.fieldToEdit.idpengguna;
  // Jika create baru tapi user sudah pilih "Existing" di Step 1
  if (stepData.biodata.userId) return stepData.biodata.userId;
  // Jika user baru tapi sudah di-save (dari response API)
  if (stepData.biodata.createdUserId) return stepData.biodata.createdUserId;
  return null;
});

// === Methods ===
function closeModal() {
  emit("close");
}

function updateStepValidation(stepIndex, isValid) {
  if (stepIndex === 0) step1IsValid.value = isValid;
}

// Fungsi Trigger Lazy Load Data saat Tab Berpindah
function onChangeCurrentTab(prevIndex, nextIndex) {
  currentTabIndex.value = nextIndex;
  const userId = currentUserId.value;

  // Jika User ID tersedia, panggil loadData di component anak
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

async function validateStep(stepIndex) {
  let isValid = true;

  // Panggil fungsi validate() milik component anak
  if (stepIndex === 0 && step1Ref.value) {
    isValid = await step1Ref.value.validate();
    // Validasi tambahan: pastikan mode sudah dipilih dan user ID ada (untuk existing)
    if (isValid && !isEditMode.value) {
      const biodataData = stepData.biodata;
      if (!biodataData.mode || biodataData.mode === "") {
        toast.warning(
          "Silakan pilih apakah Anda ingin menggunakan data yang ada atau membuat data baru."
        );
        return false;
      }
      // Jika mode existing, pastikan user sudah dipilih
      if (biodataData.mode === "existing" && !biodataData.userId) {
        toast.warning("Silakan pilih pengguna dari daftar yang ada.");
        return false;
      }
    }
  }
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

  if (!isValid) {
    toast.warning("Mohon lengkapi data yang wajib diisi pada langkah ini.");
  }
  return isValid;
}

function nextTab() {
  // Trigger validasi sebelum pindah
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

// === MAIN LOGIC: SUBMIT DATA ===
async function submitForm() {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    // 1. PROSES BIODATA (STEP 1)
    const biodataInfo = stepData.biodata;
    let userId = biodataInfo.userId;

    // Cek Mode: Create User Baru atau Pakai Existing
    if (
      biodataInfo.mode === "new" &&
      !isEditMode.value &&
      !biodataInfo.isExisting
    ) {
      // Create New User
      const userData = new FormData();
      // Append fields dari biodataInfo.userData ke FormData
      const fields = biodataInfo.userData;
      for (const key in fields) {
        userData.append(`record[${key}]`, fields[key]);
      }
      // Handle Foto User
      if (biodataInfo.photoFile) {
        userData.append(
          "upload_foto",
          biodataInfo.photoFile,
          biodataInfo.photoFile.name
        );
      }

      // Hapus dummy array jika API backend mewajibkan (sesuai code lama Anda)
      [
        "idpenggunajenjang",
        "idpenggunapangkat",
        "idpenggunapelatihan",
        "idpenggunapendidikan",
        "idpenggunaprestasi",
        "idpenggunaunitkerja",
      ].forEach((k) => userData.append(`record[${k}]`, ""));

      const res = await addUser(userData);
      // Ambil ID User baru dari response
      userId = res.data?.data?.idpengguna || res.data?.idpengguna;
      if (!userId) throw new Error("Gagal mendapatkan ID Pengguna baru.");

      // Simpan ke stepData agar bisa diakses di step selanjutnya
      stepData.biodata.createdUserId = userId;
      stepData.biodata.userId = userId;
    } else if (biodataInfo.mode === "edit" || isEditMode.value) {
      // Update User Existing (Jika ada perubahan biodata)
      userId = isEditMode.value ? props.fieldToEdit.idpengguna : userId;
      const userData = new FormData();
      const fields = biodataInfo.userData;
      for (const key in fields) {
        userData.append(`record[${key}]`, fields[key]);
      }
      if (biodataInfo.photoFile) {
        userData.append(
          "upload_foto",
          biodataInfo.photoFile,
          biodataInfo.photoFile.name
        );
      }
      userData.append("_method", "PUT"); // Laravel spoofing method
      await updateUser(userId, userData);
    }

    if (!userId) throw new Error("ID Pengguna tidak valid.");

    // 2. PROSES REPEATER (STEP 2-7)
    const promises = [];

    // Helper Function untuk Append FormData
    const createFormData = (item, fileKey) => {
      const fd = new FormData();
      fd.append("record[idpengguna]", userId);

      Object.keys(item).forEach((key) => {
        // Skip internal keys (isOpen, fileRaw, existingFile, dll)
        if (["isOpen", "fileRaw", "existingFile"].includes(key)) return;
        if (item[key] !== null && item[key] !== undefined) {
          fd.append(`record[${key}]`, item[key]);
        }
      });

      // Append File Khusus (jika ada upload baru)
      if (item.fileRaw) {
        fd.append(fileKey, item.fileRaw);
      }
      return fd;
    };

    // Push Requests to Promise Array
    // Step 2: Unit Kerja
    stepData.unitKerja.list.forEach((item) =>
      promises.push(addUserWorkUnit(createFormData(item, "filesk")))
    );
    // Step 3: Jabatan
    stepData.jabatan.list.forEach((item) =>
      promises.push(addUserLevel(createFormData(item, "filesk")))
    );
    // Step 4: Pangkat
    stepData.pangkat.list.forEach((item) =>
      promises.push(addUserRank(createFormData(item, "filesk")))
    );
    // Step 5: Pendidikan
    stepData.pendidikan.list.forEach((item) =>
      promises.push(addUserEducation(createFormData(item, "fileijazah")))
    );
    // Step 6: Pelatihan
    stepData.pelatihan.list.forEach((item) =>
      promises.push(addUserTraining(createFormData(item, "filesertifikat")))
    );
    // Step 7: Prestasi
    stepData.prestasi.list.forEach((item) =>
      promises.push(addUserAchievement(createFormData(item, "filesertifikat")))
    );

    // Execute All Promises
    if (promises.length > 0) {
      await Promise.all(promises);
    }

    toast.success("Data Berhasil Disimpan!");
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
      // Reset All Data if Closed/New
      currentTabIndex.value = 0;
      Object.keys(stepData).forEach((key) => {
        if (key === "biodata")
          stepData[key] = { mode: "new", userId: null, userData: {} };
        else stepData[key] = { list: [] };
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
</style>
