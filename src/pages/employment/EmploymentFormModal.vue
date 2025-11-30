<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <h5 class="modal-title">{{ modalTitle }}</h5>
        <button
          type="button"
          class="btn-close"
          @click="closeModal"
          :disabled="isLoading"
        ></button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Step Indicator -->
        <div class="wizard-steps mb-4">
          <div
            v-for="(step, index) in steps"
            :key="index"
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

        <!-- Step Content -->
        <div class="step-content">
          <!-- Step 1: Biodata -->
          <div v-show="currentStepIndex === 0">
            <Step1Biodata
              ref="step1Ref"
              v-model="wizardState.biodata"
              :fieldToEdit="fieldToEdit"
              @validation-change="(valid) => (stepValidations[0] = valid)"
              @user-selected="handleUserSelected"
            />
          </div>

          <!-- Step 2: Unit Kerja -->
          <div v-show="currentStepIndex === 1">
            <Step2UnitKerja
              ref="step2Ref"
              v-model="wizardState.unitKerja"
              :currentUserId="currentUserId"
              @validation-change="(valid) => (stepValidations[1] = valid)"
            />
          </div>

          <!-- Step 3: Jabatan -->
          <div v-show="currentStepIndex === 2">
            <Step3Jabatan
              ref="step3Ref"
              v-model="wizardState.jabatan"
              :currentUserId="currentUserId"
              @validation-change="(valid) => (stepValidations[2] = valid)"
            />
          </div>

          <!-- Step 4: Pangkat -->
          <div v-show="currentStepIndex === 3">
            <Step4Pangkat
              ref="step4Ref"
              v-model="wizardState.pangkat"
              :currentUserId="currentUserId"
              @validation-change="(valid) => (stepValidations[3] = valid)"
            />
          </div>

          <!-- Step 5: Pendidikan -->
          <div v-show="currentStepIndex === 4">
            <Step5Pendidikan
              ref="step5Ref"
              v-model="wizardState.pendidikan"
              :currentUserId="currentUserId"
              @validation-change="(valid) => (stepValidations[4] = valid)"
            />
          </div>

          <!-- Step 6: Pelatihan -->
          <div v-show="currentStepIndex === 5">
            <Step6Pelatihan
              ref="step6Ref"
              v-model="wizardState.pelatihan"
              :currentUserId="currentUserId"
              @validation-change="(valid) => (stepValidations[5] = valid)"
            />
          </div>

          <!-- Step 7: Prestasi -->
          <div v-show="currentStepIndex === 6">
            <Step7Prestasi
              ref="step7Ref"
              v-model="wizardState.prestasi"
              :currentUserId="currentUserId"
              @validation-change="(valid) => (stepValidations[6] = valid)"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert-danger mt-3">
          <i class="fa fa-exclamation-circle me-2"></i>{{ errorMessage }}
        </div>
      </div>

      <!-- Modal Footer -->
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
          v-if="currentStepIndex < steps.length - 1"
          type="button"
          class="btn btn-primary"
          @click="nextStep"
          :disabled="isLoading"
        >
          Selanjutnya <i class="fa fa-arrow-right ms-1"></i>
        </button>

        <button
          v-if="currentStepIndex === steps.length - 1"
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

const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Pegawai" },
});

const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === Steps Configuration ===
const steps = [
  { title: "Biodata", icon: "fa fa-user" },
  { title: "Unit Kerja", icon: "fa fa-building" },
  { title: "Jabatan", icon: "fa fa-briefcase" },
  { title: "Pangkat", icon: "fa fa-star" },
  { title: "Pendidikan", icon: "fa fa-graduation-cap" },
  { title: "Pelatihan", icon: "fa fa-certificate" },
  { title: "Prestasi", icon: "fa fa-trophy" },
];

// === Refs ===
const step1Ref = ref(null);
const step2Ref = ref(null);
const step3Ref = ref(null);
const step4Ref = ref(null);
const step5Ref = ref(null);
const step6Ref = ref(null);
const step7Ref = ref(null);

// === State ===
const currentStepIndex = ref(0);
const visitedSteps = ref(new Set([0])); // Track which steps have been visited
const isLoading = ref(false);
const errorMessage = ref(null);
const createdUserId = ref(null);

const stepValidations = reactive([false, true, true, true, true, true, true]);

const wizardState = reactive({
  biodata: {
    mode: "",
    isExisting: false,
    userId: null,
    userData: {
      idpengguna: null,
      idlevel: "",
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
  jabatan: { list: [] },
  pangkat: { list: [] },
  pendidikan: { list: [] },
  pelatihan: { list: [] },
  prestasi: { list: [] },
});

const stepLoaded = reactive([false, false, false, false, false, false, false]);

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

const canProceed = computed(() => {
  return stepValidations[currentStepIndex.value];
});

// === Watchers ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    if (newData) {
      wizardState.biodata.mode = "existing";
      wizardState.biodata.isExisting = true;
      wizardState.biodata.userId = newData.idpengguna;
      Object.assign(wizardState.biodata.userData, newData);
      stepLoaded.fill(false);
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

async function loadStepData(stepIndex) {
  const stepRefs = [
    null,
    step2Ref,
    step3Ref,
    step4Ref,
    step5Ref,
    step6Ref,
    step7Ref,
  ];
  const stepRef = stepRefs[stepIndex];

  if (stepRef.value && typeof stepRef.value.loadData === "function") {
    try {
      await stepRef.value.loadData(currentUserId.value);
      stepLoaded[stepIndex] = true;
    } catch (error) {
      console.error(`Error loading data for step ${stepIndex}:`, error);
      toast.error(`Gagal memuat data: ${error.message}`);
    }
  }
}

async function nextStep() {
  // Validate current step
  const stepRefs = [
    step1Ref,
    step2Ref,
    step3Ref,
    step4Ref,
    step5Ref,
    step6Ref,
    step7Ref,
  ];
  const currentRef = stepRefs[currentStepIndex.value];

  if (currentRef.value && typeof currentRef.value.validate === "function") {
    const isValid = await currentRef.value.validate();
    if (!isValid) {
      // Validation messages are handled by each step component
      // No need for additional toasts here
      return;
    }
  }

  if (!canProceed.value) {
    toast.warning("Mohon lengkapi data yang diperlukan");
    return;
  }

  currentStepIndex.value++;
  visitedSteps.value.add(currentStepIndex.value); // Mark new step as visited
}

function goToStep(targetIndex) {
  // Only allow navigation to visited steps or the current step
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

    // Step 1: Save/Update User
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

    // Validate single active status
    validateSingleActiveStatus();

    // Save all repeater data
    await saveUnitKerja(userId);
    await saveJabatan(userId);
    await savePangkat(userId);
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
    { name: "Unit Kerja", data: wizardState.unitKerja.data },
    { name: "Jabatan", data: wizardState.jabatan.data },
    { name: "Pangkat", data: wizardState.pangkat.data },
    { name: "Pelatihan", data: wizardState.pelatihan.data },
    { name: "Prestasi", data: wizardState.prestasi.data },
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

  Object.keys(biodata).forEach((key) => {
    if (
      biodata[key] !== null &&
      biodata[key] !== undefined &&
      key !== "foto" &&
      key !== "roles" &&
      key !== "permissions" &&
      key !== "created_at" &&
      key !== "updated_at" &&
      key !== "deleted_at" &&
      key !== "email_verified_at" &&
      key !== "remember_token" &&
      key !== "lastlogin" &&
      key !== "kodepropinsi"
    ) {
      data.append(`record[${key}]`, biodata[key]);
    }
  });

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
      if (value !== null && value !== undefined) {
        formData.append(`record[${key}]`, value);
      }
    }
  });

  if (fileKey && item[fileKey] instanceof File) {
    formData.append(`upload_${fileKey}`, item[fileKey], item[fileKey].name);
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

/* Clickable Steps */
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
