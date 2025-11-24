<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    role="dialog"
    @click.self="closeModal"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
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
          <Wizard
            ref="wizardRef"
            :custom-tabs="wizardTabs"
            :beforeChange="onTabBeforeChange"
            @change="onChangeCurrentTab"
            @complete:wizard="wizardCompleted"
            card-background
            :next-button-text="'Selanjutnya'"
            :back-button-text="'Sebelumnya'"
            :finish-button-text="'Selesai'"
          >
            <!-- Step 1: Biodata -->
            <div v-if="currentTabIndex === 0">
              <Step1Biodata
                v-model="stepData.biodata"
                @validation-change="(valid) => updateStepValidation(0, valid)"
              />
            </div>

            <!-- Step 2: Unit Kerja -->
            <div v-if="currentTabIndex === 1">
              <Step2UnitKerja
                v-model="stepData.unitKerja"
                @validation-change="(valid) => updateStepValidation(1, valid)"
              />
            </div>

            <!-- Step 3: Jabatan -->
            <div v-if="currentTabIndex === 2">
              <Step3Jabatan
                v-model="stepData.jabatan"
                @validation-change="(valid) => updateStepValidation(2, valid)"
              />
            </div>

            <!-- Step 4: Pangkat -->
            <div v-if="currentTabIndex === 3">
              <Step4Pangkat
                v-model="stepData.pangkat"
                @validation-change="(valid) => updateStepValidation(3, valid)"
              />
            </div>

            <!-- Step 5: Pendidikan -->
            <div v-if="currentTabIndex === 4">
              <Step5Pendidikan
                v-model="stepData.pendidikan"
                @validation-change="(valid) => updateStepValidation(4, valid)"
              />
            </div>

            <!-- Step 6: Pelatihan -->
            <div v-if="currentTabIndex === 5">
              <Step6Pelatihan
                v-model="stepData.pelatihan"
                @validation-change="(valid) => updateStepValidation(5, valid)"
              />
            </div>

            <!-- Step 7: Prestasi -->
            <div v-if="currentTabIndex === 6">
              <Step7Prestasi
                v-model="stepData.prestasi"
                @validation-change="(valid) => updateStepValidation(6, valid)"
              />
            </div>
          </Wizard>

          <!-- Error Message -->
          <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
            <i class="bi bi-exclamation-circle me-2"></i>{{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import Wizard from "form-wizard-vue3";
import "form-wizard-vue3/dist/form-wizard-vue3.css";

// Import Step Components
import Step1Biodata from "./steps/Step1Biodata.vue";
import Step2UnitKerja from "./steps/Step2UnitKerja.vue";
import Step3Jabatan from "./steps/Step3Jabatan.vue";
import Step4Pangkat from "./steps/Step4Pangkat.vue";
import Step5Pendidikan from "./steps/Step5Pendidikan.vue";
import Step6Pelatihan from "./steps/Step6Pelatihan.vue";
import Step7Prestasi from "./steps/Step7Prestasi.vue";

// Import Services (will be used for submission)
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
  true, // Step 1: Biodata (true initially to show cards, will be updated by component)
  true, // Step 2: Unit Kerja (placeholder, auto-valid)
  true, // Step 3: Jabatan (placeholder, auto-valid)
  true, // Step 4: Pangkat (placeholder, auto-valid)
  true, // Step 5: Pendidikan (placeholder, auto-valid)
  true, // Step 6: Pelatihan (placeholder, auto-valid)
  true, // Step 7: Prestasi (placeholder, auto-valid)
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

// === Wizard Configuration ===
const wizardTabs = [
  {
    icon: "user",
    title: "Biodata",
  },
  {
    icon: "building",
    title: "Unit Kerja",
  },
  {
    icon: "briefcase",
    title: "Jabatan",
  },
  {
    icon: "star",
    title: "Pangkat",
  },
  {
    icon: "graduation-cap",
    title: "Pendidikan",
  },
  {
    icon: "certificate",
    title: "Pelatihan",
  },
  {
    icon: "trophy",
    title: "Prestasi",
  },
];

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

const canSubmit = computed(() => {
  // Check if all steps are valid
  return stepValidations.every((valid) => valid);
});

// === Methods ===
function closeModal() {
  emit("close");
}

function updateStepValidation(stepIndex, isValid) {
  stepValidations[stepIndex] = isValid;
}

function onChangeCurrentTab(index, oldIndex) {
  currentTabIndex.value = index;
}

function onTabBeforeChange() {
  // Validation is handled by stepValidations
  return stepValidations[currentTabIndex.value];
}

function wizardCompleted() {
  // This is called when wizard reaches the end (finish button clicked)
  // Automatically trigger form submission
  submitForm();
}

async function submitForm() {
  if (!canSubmit.value) {
    toast.warning("Mohon lengkapi semua data yang diperlukan.");
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    // Prepare data for submission
    const biodataInfo = stepData.biodata;

    // Check if using existing user or creating new
    if (biodataInfo.isExisting) {
      // Using existing user
      // TODO: Link existing user with other data (unit kerja, jabatan, etc.)
      toast.info(
        "Mode menggunakan data existing user - implementasi akan ditambahkan"
      );
      console.log("Selected User ID:", biodataInfo.userId);
      console.log("All Step Data:", stepData);
    } else {
      // Creating new user
      const data = new FormData();
      const userData = biodataInfo.userData;

      // Append user data
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

      // Append photo if exists
      if (biodataInfo.photoFile) {
        data.append(
          "upload_foto",
          biodataInfo.photoFile,
          biodataInfo.photoFile.name
        );
      }

      // TODO: Append data from other steps
      // For now, we'll just create the user
      // Later, you'll need to:
      // 1. Create user first
      // 2. Get the user ID
      // 3. Create related records (unit kerja, jabatan, etc.) with the user ID

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
      // TODO: Populate step data for edit mode
      console.log("Edit mode - data:", newData);
    } else {
      // Reset all step data
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
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
}

/* Wizard Styling */
:deep(.wizard-card-footer) {
  padding: 1.5rem 0 1rem;
  margin-top: 1.5rem;
  display: flex !important;
  justify-content: space-between;
  background: transparent;
  border: none;
}

:deep(.wizard-navigation) {
  margin-bottom: 1.5rem;
}

:deep(.wizard-icon-circle) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

:deep(.wizard-icon-circle.checked) {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

:deep(.wizard-nav-pills .active .wizard-icon-circle) {
  background: linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

/* Wizard Button Styling */
:deep(.wizard-btn) {
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
}

:deep(.wizard-btn-next) {
  background: linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%);
  border: none;
  color: white;
}

:deep(.wizard-btn-next:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

:deep(.wizard-btn-prev) {
  background: white;
  border: 1px solid #dee2e6;
  color: #6c757d;
}

:deep(.wizard-btn-prev:hover) {
  background: #f8f9fa;
  border-color: #adb5bd;
}

:deep(.wizard-btn-finish) {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
}

:deep(.wizard-btn-finish:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

:deep(.wizard-btn:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}
</style>
