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
        <div class="wizard-steps mb-4">
          <div
            v-for="(step, index) in filteredSteps"
            :key="step.key"
            class="wizard-step"
            :class="{
              active: currentStepIndex === index,
              completed: currentStepIndex > index,
              clickable: visitedSteps.has(index) && index !== currentStepIndex,
            }"
            @click="goToStep(index)"
          >
            <div class="step-circle">
              <i :class="step.icon"></i>
            </div>
            <div class="step-title">{{ step.title }}</div>
          </div>
        </div>

        <div class="step-content">
          <div v-show="currentStepKey === 'biodata'">
            <Step1Biodata
              ref="step1Ref"
              v-model="wizardState.biodata"
              :fieldToEdit="fieldToEdit"
              @validation-change="(valid) => (stepValidations.biodata = valid)"
              @user-selected="handleUserSelected"
              @user-type-changed="handleUserTypeChanged"
              @photo-change="handlePhotoChange"
            />
          </div>

          <div v-if="!isNonAsn" v-show="currentStepKey === 'unitKerja'">
            <Step2UnitKerja
              ref="step2Ref"
              v-model="wizardState.unitKerja"
              :currentUserId="currentUserId"
              @validation-change="
                (valid) => (stepValidations.unitKerja = valid)
              "
            />
          </div>

          <div v-if="isNonAsn" v-show="currentStepKey === 'perusahaan'">
            <StepPerusahaan
              ref="stepPerusahaanRef"
              v-model="wizardState.perusahaan"
              :currentUserId="currentUserId"
              @validation-change="
                (valid) => (stepValidations.perusahaan = valid)
              "
            />
          </div>

          <div v-show="currentStepKey === 'pekerjaan'">
            <StepPekerjaan
              ref="stepPekerjaanRef"
              v-model="wizardState.pekerjaan"
              :currentUserId="currentUserId"
              @validation-change="
                (valid) => (stepValidations.pekerjaan = valid)
              "
            />
          </div>

          <div v-if="!isNonAsn" v-show="currentStepKey === 'jabatan'">
            <Step3Jabatan
              ref="step3Ref"
              v-model="wizardState.jabatan"
              :currentUserId="currentUserId"
              @validation-change="(valid) => (stepValidations.jabatan = valid)"
            />
          </div>

          <div v-if="!isNonAsn" v-show="currentStepKey === 'pangkat'">
            <Step4Pangkat
              ref="step4Ref"
              v-model="wizardState.pangkat"
              :currentUserId="currentUserId"
              @validation-change="(valid) => (stepValidations.pangkat = valid)"
            />
          </div>

          <div v-show="currentStepKey === 'pendidikan'">
            <Step5Pendidikan
              ref="step5Ref"
              v-model="wizardState.pendidikan"
              :currentUserId="currentUserId"
              @validation-change="
                (valid) => (stepValidations.pendidikan = valid)
              "
            />
          </div>

          <div v-show="currentStepKey === 'pelatihan'">
            <Step6Pelatihan
              ref="step6Ref"
              v-model="wizardState.pelatihan"
              :currentUserId="currentUserId"
              @validation-change="
                (valid) => (stepValidations.pelatihan = valid)
              "
            />
          </div>

          <div v-show="currentStepKey === 'prestasi'">
            <Step7Prestasi
              ref="step7Ref"
              v-model="wizardState.prestasi"
              :currentUserId="currentUserId"
              @validation-change="(valid) => (stepValidations.prestasi = valid)"
            />
          </div>
        </div>

        <div v-if="errorMessage" class="alert alert-danger mt-3">
          <i class="fa fa-exclamation-circle me-2"></i>{{ errorMessage }}
        </div>
      </div>

      <div class="modal-footer">
        <button
          v-if="currentStepIndex > 0"
          type="button"
          class="btn btn-secondary"
          @click="prevStep"
          :disabled="isLoading"
        >
          <i class="fa fa-arrow-left me-1"></i> Sebelumnya
        </button>

        <button
          v-if="currentStepIndex < filteredSteps.length - 1"
          type="button"
          class="btn btn-primary"
          @click="nextStep"
          :disabled="isLoading"
        >
          Selanjutnya <i class="fa fa-arrow-right ms-1"></i>
        </button>

        <button
          v-if="currentStepIndex === filteredSteps.length - 1"
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
import { ref, reactive, computed, watch } from "vue";
import { useToast } from "vue-toastification";

import Step1Biodata from "./steps/Step1Biodata.vue";
import Step2UnitKerja from "./steps/Step2UnitKerja.vue";
import StepPerusahaan from "./steps/StepPerusahaan.vue";
import StepPekerjaan from "./steps/StepPekerjaan.vue";
import Step3Jabatan from "./steps/Step3Jabatan.vue";
import Step4Pangkat from "./steps/Step4Pangkat.vue";
import Step5Pendidikan from "./steps/Step5Pendidikan.vue";
import Step6Pelatihan from "./steps/Step6Pelatihan.vue";
import Step7Prestasi from "./steps/Step7Prestasi.vue";

import { addUser, updateUser } from "@/services/referensi/users";
import {
  addUserWorkUnit,
  updateUserWorkUnit,
} from "@/services/general/personnel/userWorkUnits";
import {
  addUserLevel,
  updateUserLevel,
} from "@/services/general/personnel/userLevels";
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
import {
  addUserWorkExperience,
  updateUserWorkExperience,
} from "@/services/general/personnel/userWorkExperiences";
import {
  addUserCompany,
  updateUserCompany,
} from "@/services/general/personnel/userCompanies";

const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Pegawai" },
});

const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === Steps Configuration ===
const allSteps = [
  {
    key: "biodata",
    title: "Biodata",
    icon: "fa-solid fa-id-card",
    asnOnly: false,
  },
  {
    key: "unitKerja",
    title: "Unit Kerja",
    icon: "fa-solid fa-building-user",
    asnOnly: true,
  },
  {
    key: "perusahaan",
    title: "Perusahaan",
    icon: "fa-solid fa-briefcase",
    nonAsnOnly: true,
  },
  {
    key: "pekerjaan",
    title: "Pengalaman Kerja",
    icon: "fa-solid fa-briefcase",
    asnOnly: false,
  },
  {
    key: "jabatan",
    title: "Jabatan",
    icon: "fa-solid fa-user-tie",
    asnOnly: true,
  },
  {
    key: "pangkat",
    title: "Pangkat",
    icon: "fa-solid fa-ranking-star",
    asnOnly: true,
  },
  {
    key: "pendidikan",
    title: "Pendidikan",
    icon: "fa-solid fa-graduation-cap",
    asnOnly: false,
  },
  {
    key: "pelatihan",
    title: "Pelatihan",
    icon: "fa-solid fa-chalkboard-user",
    asnOnly: false,
  },
  {
    key: "prestasi",
    title: "Prestasi",
    icon: "fa-solid fa-award",
    asnOnly: false,
  },
];

// State for user type
const selectedUserTypeName = ref("");

// === Refs ===
const step1Ref = ref(null);
const step2Ref = ref(null);
const stepPerusahaanRef = ref(null);
const stepPekerjaanRef = ref(null);
const step3Ref = ref(null);
const step4Ref = ref(null);
const step5Ref = ref(null);
const step6Ref = ref(null);
const step7Ref = ref(null);

// === State ===
const currentStepIndex = ref(0);
const visitedSteps = ref(new Set([0]));
const isLoading = ref(false);
const errorMessage = ref(null);
const createdUserId = ref(null);

const stepValidations = reactive({
  biodata: false,
  unitKerja: true,
  perusahaan: true,
  pekerjaan: true,
  jabatan: true,
  pangkat: true,
  pendidikan: true,
  pelatihan: true,
  prestasi: true,
});

const wizardState = reactive({
  biodata: {
    mode: "",
    isExisting: false,
    userId: null,
    userData: {
      idpengguna: null,
      idlevel: "",
      idjeniskelamin: "",
      idjenispengguna: "",
      email: "",
      nama: "",
      telp: "",
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
  unitKerja: { list: [] },
  perusahaan: { list: [] },
  pekerjaan: { list: [] },
  jabatan: { list: [] },
  pangkat: { list: [] },
  pendidikan: { list: [] },
  pelatihan: { list: [] },
  prestasi: { list: [] },
});

const stepLoaded = reactive([
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
]);

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() =>
  isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`
);

const currentUserId = computed(() => {
  if (isEditMode.value && props.fieldToEdit)
    return props.fieldToEdit.idpengguna;
  if (wizardState.biodata.userId) return wizardState.biodata.userId;
  if (createdUserId.value) return createdUserId.value;
  return null;
});

const isNonAsn = computed(() => {
  const NON_ASN_ID = "7563d021-664d-4cd9-87d7-82cb3440664f";
  return wizardState.biodata.userData.idjenispengguna === NON_ASN_ID;
});

const filteredSteps = computed(() => {
  if (isNonAsn.value) {
    return allSteps.filter((step) => !step.asnOnly);
  }
  return allSteps.filter((step) => !step.nonAsnOnly);
});

const currentStepKey = computed(() => {
  return filteredSteps.value[currentStepIndex.value]?.key || "biodata";
});

const canProceed = computed(() => {
  const currentKey = currentStepKey.value;
  return stepValidations[currentKey];
});

// === Reset Function ===
function resetWizardState() {
  // Reset all list data
  wizardState.unitKerja.list = [];
  wizardState.perusahaan.list = [];
  wizardState.jabatan.list = [];
  wizardState.pangkat.list = [];
  wizardState.pendidikan.list = [];
  wizardState.pelatihan.list = [];
  wizardState.prestasi.list = [];

  // Reset step loaded flags
  stepLoaded.fill(false);

  // Reset step index
  currentStepIndex.value = 0;
  visitedSteps.value = new Set([0]);
}

// === Watchers ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    if (newData) {
      // Reset state first to prevent data mixing
      resetWizardState();

      wizardState.biodata.mode = "existing";
      wizardState.biodata.isExisting = true;
      wizardState.biodata.userId = newData.idpengguna;
      Object.assign(wizardState.biodata.userData, newData);
    }
  },
  { immediate: true }
);

watch(currentStepIndex, async (newIndex, oldIndex) => {
  // Load data when entering a repeater step
  if (newIndex > 0 && currentUserId.value && !stepLoaded[newIndex]) {
    await loadStepData(newIndex);
  }
});

// === Methods ===
function closeModal() {
  emit("close");
}

function handleUserSelected(userId) {
  createdUserId.value = userId;
  stepLoaded.fill(false);
  stepLoaded[0] = true;
}

function handleUserTypeChanged(userType) {
  selectedUserTypeName.value = userType?.namajenispengguna || "";
  // Reset step index if we're past the removed steps
  if (isNonAsn.value && currentStepIndex.value >= filteredSteps.value.length) {
    currentStepIndex.value = 0;
  }
}

function handlePhotoChange(file) {
  wizardState.biodata.photoFile = file;
  wizardState.biodata.isPhotoRemoved =
    !file && wizardState.biodata.userData.foto;
}

async function loadStepData(stepIndex) {
  const currentKey = filteredSteps.value[stepIndex]?.key;
  const stepRefMap = {
    unitKerja: step2Ref,
    perusahaan: stepPerusahaanRef,
    pekerjaan: stepPekerjaanRef,
    jabatan: step3Ref,
    pangkat: step4Ref,
    pendidikan: step5Ref,
    pelatihan: step6Ref,
    prestasi: step7Ref,
  };
  const stepRef = stepRefMap[currentKey];

  if (stepRef?.value && typeof stepRef.value.loadData === "function") {
    try {
      await stepRef.value.loadData(currentUserId.value);
      stepLoaded[stepIndex] = true;
    } catch (error) {
      console.error(`Error loading data for step ${currentKey}:`, error);
      toast.error(`Gagal memuat data: ${error.message}`);
    }
  }
}

async function nextStep() {
  const currentKey = currentStepKey.value;
  const stepRefMap = {
    biodata: step1Ref,
    unitKerja: step2Ref,
    perusahaan: stepPerusahaanRef,
    pekerjaan: stepPekerjaanRef,
    jabatan: step3Ref,
    pangkat: step4Ref,
    pendidikan: step5Ref,
    pelatihan: step6Ref,
    prestasi: step7Ref,
  };
  const currentRef = stepRefMap[currentKey];

  if (currentRef?.value && typeof currentRef.value.validate === "function") {
    const isValid = await currentRef.value.validate();
    if (!isValid) {
      return;
    }
  }

  if (!canProceed.value) {
    toast.warning("Mohon lengkapi data yang diperlukan");
    return;
  }

  currentStepIndex.value++;
  visitedSteps.value.add(currentStepIndex.value);
}

function goToStep(targetIndex) {
  if (visitedSteps.value.has(targetIndex)) {
    currentStepIndex.value = targetIndex;
  }
}

function prevStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
  }
}

async function submitForm() {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    let userId = null;

    if (isEditMode.value) {
      userId = props.fieldToEdit.idpengguna;
      await saveBiodataUpdate(userId);
    } else if (wizardState.biodata.isExisting && wizardState.biodata.userId) {
      userId = wizardState.biodata.userId;
      await saveBiodataUpdate(userId);
    } else if (wizardState.biodata.mode === "new") {
      userId = await saveBiodataCreate();
    } else {
      throw new Error("Mode biodata tidak valid");
    }

    if (!userId) throw new Error("Gagal mendapatkan ID pengguna");

    validateSingleActiveStatus();

    // Save based on user type
    if (isNonAsn.value) {
      await savePerusahaan(userId);
    } else {
      await saveUnitKerja(userId);
    }
    await savePekerjaan(userId);
    // Only save Jabatan and Pangkat for ASN users
    if (!isNonAsn.value) {
      await saveJabatan(userId);
      await savePangkat(userId);
    }
    await savePendidikan(userId);
    await savePelatihan(userId);
    await savePrestasi(userId);

    toast.success("Data berhasil disimpan.");
    emit("save-successful");
    closeModal();
  } catch (error) {
    console.error("Error submitting form:", error);
    errorMessage.value =
      error.response?.data?.message || error.message || "Gagal menyimpan data.";
    toast.error(errorMessage.value);
  } finally {
    isLoading.value = false;
  }
}

function validateSingleActiveStatus() {
  const categories = [
    { name: "Unit Kerja", data: wizardState.unitKerja.list },
    { name: "Perusahaan", data: wizardState.perusahaan.list },
    { name: "Pekerjaan", data: wizardState.pekerjaan.list },
    { name: "Jabatan", data: wizardState.jabatan.list },
    { name: "Pangkat", data: wizardState.pangkat.list },
    { name: "Pelatihan", data: wizardState.pelatihan.list },
    { name: "Prestasi", data: wizardState.prestasi.list },
  ];

  for (const category of categories) {
    if (!category.data) continue;
    const activeCount = category.data.filter(
      (item) => item.status === "Aktif"
    ).length;
    if (activeCount > 1) {
      throw new Error(
        `Kategori ${category.name} hanya boleh memiliki satu data dengan status aktif.`
      );
    }
  }
}

// === Data Saving Helpers ===
function createBiodataFormData() {
  const data = new FormData();
  const biodata = wizardState.biodata.userData;

  const allowedFields = [
    "idpengguna",
    "idlevel",
    "idjeniskelamin",
    "idjenispengguna",
    "idjenispegawai",
    "email",
    "nama",
    "telp",
    "nik",
    "gelardepan",
    "gelarbelakang",
    "alamat",
    "kodekabupaten",
    "nip",
    "no_karpeg",
    "tempatlahir",
    "tanggallahir",
    "status",
    "minat",
    "idpenggunajenjang",
    "idpenggunapangkat",
    "idpenggunapendidikan",
    "idpenggunapelatihan",
    "idpenggunaprestasi",
    "idpenggunaunitkerja",
  ];

  allowedFields.forEach((key) => {
    const value = biodata[key];
    if (value !== null && value !== undefined && value !== "") {
      data.append(`record[${key}]`, value);
    }
  });

  if (wizardState.biodata.photoFile) {
    data.append("upload_foto", wizardState.biodata.photoFile);
  } else if (wizardState.biodata.isPhotoRemoved) {
    data.append("record[foto]", "");
  }

  return data;
}

async function saveBiodataCreate() {
  const formData = createBiodataFormData();
  const response = await addUser(formData);
  return (
    response.data?.idpengguna ||
    response.data?.data?.idpengguna ||
    response.idpengguna
  );
}

async function saveBiodataUpdate(userId) {
  const formData = createBiodataFormData();
  formData.append("_method", "PUT");
  await updateUser(userId, formData);
}

function createFormData(item, fileKey, userId) {
  const formData = new FormData();
  formData.append("record[idpengguna]", userId);

  const systemFields = ["created_at", "updated_at", "deleted_at"];

  Object.keys(item).forEach((key) => {
    if (
      !key.startsWith("_") &&
      key !== "idpengguna" &&
      key !== fileKey &&
      !key.endsWith("_preview") &&
      !key.endsWith("Preview") &&
      !systemFields.includes(key)
    ) {
      const value = item[key];
      if (
        value !== null &&
        value !== undefined &&
        typeof value !== "object" &&
        !Array.isArray(value)
      ) {
        formData.append(`record[${key}]`, value);
      }
    }
  });

  if (fileKey && item[fileKey] instanceof File) {
    formData.append(`upload_${fileKey}`, item[fileKey]);
  }

  return formData;
}

async function saveUnitKerja(userId) {
  for (const item of wizardState.unitKerja.list) {
    const formData = createFormData(item, "filesk", userId);
    if (item.idpenggunaunitkerja) {
      formData.append("_method", "PUT");
      await updateUserWorkUnit(item.idpenggunaunitkerja, formData);
    } else {
      await addUserWorkUnit(formData);
    }
  }
}

async function savePerusahaan(userId) {
  for (const item of wizardState.perusahaan.list) {
    const formData = createFormData(item, null, userId);
    if (item.idpenggunaperusahaan) {
      formData.append("_method", "PUT");
      await updateUserCompany(item.idpenggunaperusahaan, formData);
    } else {
      await addUserCompany(formData);
    }
  }
}

async function savePekerjaan(userId) {
  for (const item of wizardState.pekerjaan.list) {
    const formData = createFormData(item, null, userId);
    if (item.idpenggunapekerjaan) {
      formData.append("_method", "PUT");
      await updateUserWorkExperience(item.idpenggunapekerjaan, formData);
    } else {
      await addUserWorkExperience(formData);
    }
  }
}

async function saveJabatan(userId) {
  for (const item of wizardState.jabatan.list) {
    const formData = createFormData(item, "filesk", userId);
    if (item.idpenggunajenjang) {
      formData.append("_method", "PUT");
      await updateUserLevel(item.idpenggunajenjang, formData);
    } else {
      await addUserLevel(formData);
    }
  }
}

async function savePangkat(userId) {
  for (const item of wizardState.pangkat.list) {
    const formData = createFormData(item, "filesk", userId);
    if (item.idpenggunapangkat) {
      formData.append("_method", "PUT");
      await updateUserRank(item.idpenggunapangkat, formData);
    } else {
      await addUserRank(formData);
    }
  }
}

async function savePendidikan(userId) {
  for (const item of wizardState.pendidikan.list) {
    const formData = createFormData(item, null, userId);
    if (item.idpenggunapendidikan) {
      formData.append("_method", "PUT");
      await updateUserEducation(item.idpenggunapendidikan, formData);
    } else {
      await addUserEducation(formData);
    }
  }
}

async function savePelatihan(userId) {
  for (const item of wizardState.pelatihan.list) {
    const formData = createFormData(item, "filesertifikat", userId);
    if (item.idpenggunapelatihan) {
      formData.append("_method", "PUT");
      await updateUserTraining(item.idpenggunapelatihan, formData);
    } else {
      await addUserTraining(formData);
    }
  }
}

async function savePrestasi(userId) {
  for (const item of wizardState.prestasi.list) {
    const formData = createFormData(item, "filesertifikat", userId);
    if (item.idpenggunaprestasi) {
      formData.append("_method", "PUT");
      await updateUserAchievement(item.idpenggunaprestasi, formData);
    } else {
      await addUserAchievement(formData);
    }
  }
}
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
  max-width: 1200px;
  max-height: 90vh;
  min-height: 90vh;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  border: none;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0.5;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex-grow: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* Wizard Steps */
.wizard-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 2rem;
}

.wizard-steps::before {
  content: "";
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e9ecef;
  z-index: 0;
}

.wizard-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  z-index: 1;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  transition: all 0.3s;
}

.wizard-step.active .step-circle {
  background: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

.wizard-step.completed .step-circle {
  background: #28a745;
  border-color: #28a745;
  color: white;
}

.step-title {
  font-size: 0.75rem;
  text-align: center;
  color: #6c757d;
  font-weight: 500;
}

.wizard-step.active .step-title {
  color: #0d6efd;
  font-weight: 600;
}

.wizard-step.completed .step-title {
  color: #28a745;
}

.wizard-step.clickable {
  cursor: pointer;
}

.wizard-step.clickable:hover .step-circle {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.wizard-step.clickable:hover .step-title {
  color: #1e7e34;
  font-weight: 600;
}

/* Step Content */
.step-content {
  min-height: 300px;
}
</style>
