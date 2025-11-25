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

      <!-- Modal Body with Wizard -->
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
          <!-- Step 1: Biodata -->
          <tab-content
            title="Biodata"
            icon="fa fa-user"
            :before-change="() => validateStep(0)"
          >
            <Step1Biodata
              v-model="stepData.biodata"
              @validation-change="(valid) => updateStepValidation(0, valid)"
            />
          </tab-content>

          <!-- Step 2: Unit Kerja -->
          <tab-content
            title="Unit Kerja"
            icon="fa fa-building"
            :before-change="() => validateStep(1)"
          >
            <Step2UnitKerja
              v-model="stepData.unitKerja"
              @validation-change="(valid) => updateStepValidation(1, valid)"
            />
          </tab-content>

          <!-- Step 3: Jabatan -->
          <tab-content
            title="Jabatan"
            icon="fa fa-briefcase"
            :before-change="() => validateStep(2)"
          >
            <Step3Jabatan
              v-model="stepData.jabatan"
              @validation-change="(valid) => updateStepValidation(2, valid)"
            />
          </tab-content>

          <!-- Step 4: Pangkat -->
          <tab-content
            title="Pangkat"
            icon="fa fa-star"
            :before-change="() => validateStep(3)"
          >
            <Step4Pangkat
              v-model="stepData.pangkat"
              @validation-change="(valid) => updateStepValidation(3, valid)"
            />
          </tab-content>

          <!-- Step 5: Pendidikan -->
          <tab-content
            title="Pendidikan"
            icon="fa fa-graduation-cap"
            :before-change="() => validateStep(4)"
          >
            <Step5Pendidikan
              v-model="stepData.pendidikan"
              @validation-change="(valid) => updateStepValidation(4, valid)"
            />
          </tab-content>

          <!-- Step 6: Pelatihan -->
          <tab-content
            title="Pelatihan"
            icon="fa fa-certificate"
            :before-change="() => validateStep(5)"
          >
            <Step6Pelatihan
              v-model="stepData.pelatihan"
              @validation-change="(valid) => updateStepValidation(5, valid)"
            />
          </tab-content>

          <!-- Step 7: Prestasi -->
          <tab-content
            title="Prestasi"
            icon="fa fa-trophy"
            :before-change="() => validateStep(6)"
          >
            <Step7Prestasi
              v-model="stepData.prestasi"
              @validation-change="(valid) => updateStepValidation(6, valid)"
            />
          </tab-content>
        </form-wizard>

        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
          <i class="bi bi-exclamation-circle me-2"></i>{{ errorMessage }}
        </div>
      </div>

      <!-- Modal Footer with Custom Navigation -->
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
import { ref, reactive, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import { FormWizard, TabContent } from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";

// Import Step Components
import Step1Biodata from "./steps/Step1Biodata.vue";
import Step2UnitKerja from "./steps/Step2UnitKerja.vue";
import Step3Jabatan from "./steps/Step3Jabatan.vue";
import Step4Pangkat from "./steps/Step4Pangkat.vue";
import Step5Pendidikan from "./steps/Step5Pendidikan.vue";
import Step6Pelatihan from "./steps/Step6Pelatihan.vue";
import Step7Prestasi from "./steps/Step7Prestasi.vue";

// Import Services
import { addUser } from "@/services/referensi/users";

const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Pegawai" },
});

const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === Wizard State ===
const wizardRef = ref(null);
const currentTabIndex = ref(0);
const isLoading = ref(false);
const errorMessage = ref(null);

// Step validations
const stepValidations = reactive([
  true, // Step 1: Biodata
  true, // Step 2: Unit Kerja
  true, // Step 3: Jabatan
  true, // Step 4: Pangkat
  true, // Step 5: Pendidikan
  true, // Step 6: Pelatihan
  true, // Step 7: Prestasi
]);

// Data from each step
const stepData = reactive({
  biodata: {},
  unitKerja: {},
  jabatan: {},
  pangkat: {},
  pendidikan: {},
  pelatihan: {},
  prestasi: {},
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

const canSubmit = computed(() => {
  return stepValidations.every((valid) => valid);
});

// === Methods ===
function closeModal() {
  emit("close");
}

function updateStepValidation(stepIndex, isValid) {
  stepValidations[stepIndex] = isValid;
}

function onChangeCurrentTab(prevIndex, nextIndex) {
  currentTabIndex.value = nextIndex;
}

function validateStep(stepIndex) {
  // Return true directly to ensure navigation works
  // Validation logic is handled by the component emitting validation-change
  // But for wizard navigation, we check the stored validation state
  const isValid = stepValidations[stepIndex];
  if (!isValid) {
    toast.warning("Mohon lengkapi data pada langkah ini sebelum melanjutkan.");
  }
  return isValid;
}

function wizardCompleted() {
  submitForm();
}

function nextTab() {
  if (validateStep(currentTabIndex.value)) {
    wizardRef.value.nextTab();
  }
}

function prevTab() {
  wizardRef.value.prevTab();
}

async function submitForm() {
  if (!canSubmit.value) {
    toast.warning("Mohon lengkapi semua data yang diperlukan.");
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    const biodataInfo = stepData.biodata;

    if (biodataInfo.isExisting) {
      toast.info(
        "Mode menggunakan data existing user - implementasi akan ditambahkan"
      );
      console.log("Selected User ID:", biodataInfo.userId);
      console.log("All Step Data:", stepData);
    } else {
      const data = new FormData();
      const userData = biodataInfo.userData;

      data.append("record[idlevel]", userData.idlevel || "");
      data.append("record[email]", userData.email || "");
      data.append("record[nama]", userData.nama || "");
      data.append("record[telp]", userData.telp || "");
      data.append("record[nik]", userData.nik || "");
      data.append("record[gelardepan]", userData.gelardepan || "");
      data.append("record[gelarbelakang]", userData.gelarbelakang || "");
      data.append("record[alamat]", userData.alamat || "");
      data.append("record[kodekabupaten]", userData.kodekabupaten || "");
      data.append("record[nip]", userData.nip || "");
      data.append("record[no_karpeg]", userData.no_karpeg || "");
      data.append("record[tempatlahir]", userData.tempatlahir || "");
      data.append("record[tanggallahir]", userData.tanggallahir || "");
      data.append("record[status]", userData.status || "Aktif");

      if (biodataInfo.photoFile) {
        data.append(
          "upload_foto",
          biodataInfo.photoFile,
          biodataInfo.photoFile.name
        );
      }

      await addUser(data);
      toast.success("Data pegawai berhasil ditambahkan");
      emit("save-successful");
      closeModal();
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    errorMessage.value =
      error.response?.data?.message || "Gagal menyimpan data.";
    toast.error(errorMessage.value);
  } finally {
    isLoading.value = false;
  }
}

// === Watchers ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    if (newData) {
      console.log("Edit mode - data:", newData);
    } else {
      Object.keys(stepData).forEach((key) => {
        stepData[key] = {};
      });
      currentTabIndex.value = 0;
    }
    errorMessage.value = null;
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
.invalid-feedback {
  display: block;
}
.text-danger {
  color: #dc3545 !important;
}

/* Vue3 Form Wizard Custom Styling */
:deep(.vue-form-wizard .wizard-navigation .wizard-progress-with-circle) {
  margin-bottom: 2rem;
}

:deep(.vue-form-wizard .wizard-icon-circle) {
  width: 50px;
  height: 50px;
  font-size: 18px;
}

:deep(.vue-form-wizard .wizard-nav-pills > li > a) {
  padding: 10px 15px;
}

:deep(.vue-form-wizard .wizard-card-footer) {
  display: none !important;
}

:deep(.vue-form-wizard .wizard-btn) {
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  border-radius: 6px;
}
</style>
