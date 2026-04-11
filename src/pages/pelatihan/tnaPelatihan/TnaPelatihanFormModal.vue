<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate id="tnaPelatihanForm">
      <div class="d-flex justify-content-center mb-4">
        <div
          class="d-flex align-items-center"
          style="max-width: 150px; width: 100%"
        >
          <div
            class="step-badge"
            :class="{ active: currentStep === 1, done: currentStep === 2 }"
          >
            1
          </div>
          <div class="step-line" :class="{ active: currentStep === 2 }"></div>
          <div class="step-badge" :class="{ active: currentStep === 2 }">2</div>
        </div>
      </div>

      <!-- ===== STEP 1: TNA (tahun + id_perusahaan) ===== -->
      <template v-if="currentStep === 1">
        <!-- Tahun -->
        <div class="mb-3">
          <label class="form-label fw-semibold"
            >Tahun <span class="text-danger">*</span></label
          >
          <input
            type="number"
            class="form-control"
            v-model="formData.tahun"
            :class="{
              'is-invalid': formErrors.tahun,
              'is-valid':
                wasValidated && !formErrors.tahun && formData.tahun !== '',
              shake: isShaking && formErrors.tahun,
            }"
            placeholder="Masukkan tahun"
            min="2000"
            max="2100"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.tahun">
              {{ formErrors.tahun }}
            </div>
          </transition>
        </div>

        <!-- Perusahaan (Dropdown) -->
        <div class="mb-3">
          <label class="form-label fw-semibold"
            >Perusahaan <span class="text-danger">*</span></label
          >
          <BaseSearchSelect
            v-model="formData.id_perusahaan"
            :api-fn="getPerusahaan"
            value-key="id_perusahaan"
            label-key="nama_perusahaan"
            filter-key="nama_perusahaan"
            placeholder="Pilih Perusahaan"
            search-placeholder="Ketik nama perusahaan"
            :initial-label="initialPerusahaanLabel"
            :is-invalid="!!formErrors.id_perusahaan"
            :shake="isShaking && !!formErrors.id_perusahaan"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_perusahaan">
              {{ formErrors.id_perusahaan }}
            </div>
          </transition>
        </div>
      </template>

      <!-- ===== STEP 2: TNA KBJI (kode_kbji + jumlah) ===== -->
      <template v-if="currentStep === 2">
        <div
          class="border-start border-4 border-primary bg-light text-dark py-2 px-3 small mb-4 rounded"
        >
          <i class="fa fa-info-circle text-primary me-1"></i>
          <strong>Catatan:</strong> Silakan pilih profesi dan masukkan jumlah
          kebutuhan untuk tahun <strong>{{ formData.tahun }}</strong> pada
          perusahaan <strong>{{ savedPerusahaanLabel }}</strong
          >.
        </div>

        <div
          v-for="(row, index) in kbjiRows"
          :key="index"
          class="kbji-card mb-4 bg-white border rounded shadow-sm"
        >
          <div
            class="d-flex justify-content-between align-items-center p-3 border-bottom bg-light rounded-top"
          >
            <div class="d-flex align-items-center">
              <div
                class="step-number text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                style="
                  width: 32px;
                  height: 32px;
                  font-weight: 700;
                  font-size: 1rem;
                  background-color: #124373;
                "
              >
                {{ index + 1 }}
              </div>
              <h5 class="m-0 fw-bold" style="color: #124373">Data Kebutuhan</h5>
            </div>
            <button
              v-if="kbjiRows.length > 1"
              type="button"
              class="btn btn-outline-danger btn-sm px-3"
              @click="removeKbjiRow(index)"
              title="Hapus baris ini"
            >
              <i class="fa fa-trash-o"></i>
            </button>
          </div>

          <div class="p-4">
            <div class="row g-4">
              <div class="col-md-7">
                <label class="form-label fw-bold small text-dark mb-2"
                  >Pilih Profesi <span class="text-danger">*</span></label
                >
                <BaseSearchSelect
                  v-model="row.kode_kbji"
                  :api-fn="getKbji"
                  value-key="kode_kbji"
                  label-key="nama_kbji"
                  filter-key="nama_kbji"
                  placeholder="Pilih Profesi"
                  search-placeholder="Ketik nama profesi..."
                  :initial-label="row.nama_kbji"
                  :is-invalid="!!row.errors.kode_kbji"
                  :shake="isShaking && !!row.errors.kode_kbji"
                />
                <transition name="fade-error">
                  <div class="invalid-feedback" v-if="row.errors.kode_kbji">
                    {{ row.errors.kode_kbji }}
                  </div>
                </transition>
              </div>

              <div class="col-md-5">
                <label class="form-label fw-bold small text-dark mb-2"
                  >Jumlah Kebutuhan <span class="text-danger">*</span></label
                >
                <input
                  type="number"
                  class="form-control"
                  v-model="row.jumlah"
                  :class="{
                    'is-invalid': row.errors.jumlah,
                    'is-valid': !row.errors.jumlah && row.jumlah !== '',
                    shake: isShaking && row.errors.jumlah,
                  }"
                  placeholder="0"
                  min="1"
                />
                <transition name="fade-error">
                  <div class="invalid-feedback" v-if="row.errors.jumlah">
                    {{ row.errors.jumlah }}
                  </div>
                </transition>
              </div>

              <!-- Tanggal Batas -->
              <div class="col-md-12">
                <label class="form-label fw-bold small text-dark mb-2"
                  >Tenggat Waktu <span class="text-danger">*</span></label
                >
                <input
                  type="date"
                  class="form-control"
                  v-model="row.tanggal_batas"
                  :class="{
                    'is-invalid': row.errors.tanggal_batas,
                    'is-valid':
                      !row.errors.tanggal_batas && row.tanggal_batas !== '',
                    shake: isShaking && row.errors.tanggal_batas,
                  }"
                />
                <div class="invalid-feedback" v-if="row.errors.tanggal_batas">
                  {{ row.errors.tanggal_batas }}
                </div>
              </div>

              <!-- Deskripsi Pekerjaan -->
              <div class="col-md-12">
                <label class="form-label fw-bold small text-dark mb-2"
                  >Deskripsi Pekerjaan <span class="text-danger">*</span></label
                >
                <RichTextEditor
                  v-model="row.deskripsi_pekerjaan"
                  :is-invalid="!!row.errors.deskripsi_pekerjaan"
                  :shake="isShaking"
                  placeholder="Masukkan deskripsi pekerjaan..."
                />
                <div
                  v-if="row.errors.deskripsi_pekerjaan"
                  class="text-danger small mt-1"
                >
                  {{ row.errors.deskripsi_pekerjaan }}
                </div>
              </div>

              <!-- Persyaratan Minimum -->
              <div class="col-md-12">
                <label class="form-label fw-bold small text-dark mb-2"
                  >Persyaratan Minimum <span class="text-danger">*</span></label
                >
                <RichTextEditor
                  v-model="row.persyaratan_minimum"
                  :is-invalid="!!row.errors.persyaratan_minimum"
                  :shake="isShaking"
                  placeholder="Masukkan persyaratan minimum..."
                />
                <div
                  v-if="row.errors.persyaratan_minimum"
                  class="text-danger small mt-1"
                >
                  {{ row.errors.persyaratan_minimum }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mb-4 mt-2">
          <button
            type="button"
            class="btn btn-outline-primary px-4 rounded-pill shadow-sm"
            @click="addKbjiRow"
          >
            <i class="fa fa-plus me-2"></i> Tambah Kebutuhan Lainnya
          </button>
        </div>
      </template>

      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
        <i class="bi bi-x-circle me-2"></i>{{ errorMessage }}
      </div>
    </form>
  </BaseFormModal>
</template>

<script setup>
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import BaseSearchSelect from "@/components/base/BaseSearchSelect.vue";
import RichTextEditor from "@/components/base/default/richTextEditor.vue";
import {
  addTna,
  updateTna,
  getTna,
  deleteTna,
} from "@/services/general/website/tna";
import {
  addTnaKBJI,
  updateTnaKBJI,
  deleteTnaKBJI,
} from "@/services/general/pelatihan/tnaKBJI";
import { getPerusahaan } from "@/services/general/organisasi/perusahaan";
import { getKbji } from "@/services/referensi/kbji";
import { reactive, ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "TNA" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const currentStep = ref(1);
const savedIdTna = ref(null);
const initialPerusahaanLabel = ref("");
const savedPerusahaanLabel = ref("");

const formData = reactive({
  tahun: "",
  id_perusahaan: "",
});

const formErrors = reactive({
  tahun: "",
  id_perusahaan: "",
});

function createKbjiRow() {
  return reactive({
    kode_kbji: "",
    jumlah: "",
    deskripsi_pekerjaan: "",
    persyaratan_minimum: "",
    tanggal_batas: "",
    errors: {
      kode_kbji: "",
      jumlah: "",
      deskripsi_pekerjaan: "",
      persyaratan_minimum: "",
      tanggal_batas: "",
    },
  });
}

const kbjiRows = ref([createKbjiRow()]);
const deletedKbjiIds = ref([]);

function addKbjiRow() {
  kbjiRows.value.push(createKbjiRow());
}

function removeKbjiRow(index) {
  if (kbjiRows.value.length > 1) {
    const removed = kbjiRows.value[index];
    if (removed.id_tna_kbji) {
      deletedKbjiIds.value.push(removed.id_tna_kbji);
    }
    kbjiRows.value.splice(index, 1);
  }
}

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const wasValidatedStep2 = ref(false);
const isShaking = ref(false);

// === Validation Schemas ===
const validationSchemaStep1 = yup.object().shape({
  tahun: yup.string().required("Tahun wajib diisi."),
  id_perusahaan: yup.string().required("Perusahaan wajib dipilih."),
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  if (isEditMode.value) {
    return `Edit Data ${props.entityName}`;
  }
  return currentStep.value === 1
    ? `Tambah Data ${props.entityName} - Langkah 1`
    : `Tambah Data ${props.entityName} - Langkah 2`;
});

// === Watcher ===
let isValidating = false;
watch(
  kbjiRows,
  () => {
    if (isValidating || !wasValidatedStep2.value) return;
    isValidating = true;
    validateStep2();
    isValidating = false;
  },
  { deep: true },
);

watch(
  () => props.fieldToEdit,
  (newData) => {
    resetForm();

    if (newData) {
      formData.tahun = newData.tahun || "";
      formData.id_perusahaan = newData.id_perusahaan || "";
      initialPerusahaanLabel.value = newData.perusahaan?.nama_perusahaan || newData.nama_perusahaan || "";

      if (newData.kbjiList && newData.kbjiList.length > 0) {
        kbjiRows.value = newData.kbjiList.map((kbji) =>
          reactive({
            id_tna_kbji: kbji.id_tna_kbji || "",
            kode_kbji: kbji.kode_kbji || "",
            nama_kbji: kbji.nama_kbji || "",
            jumlah: kbji.jumlah || "",
            deskripsi_pekerjaan: kbji.deskripsi_pekerjaan || "",
            persyaratan_minimum: kbji.persyaratan_minimum || "",
            tanggal_batas: kbji.tanggal_batas || "",
            errors: {
              kode_kbji: "",
              jumlah: "",
              deskripsi_pekerjaan: "",
              persyaratan_minimum: "",
              tanggal_batas: "",
            },
          }),
        );
      }
    }
  },
  { immediate: true, deep: true },
);

// === Methods ===
function resetForm() {
  currentStep.value = 1;
  savedIdTna.value = null;
  errorMessage.value = null;
  wasValidated.value = false;
  wasValidatedStep2.value = false;

  Object.keys(formData).forEach((key) => (formData[key] = ""));
  Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
  kbjiRows.value = [createKbjiRow()];
  deletedKbjiIds.value = [];
  savedPerusahaanLabel.value = "";
}

async function closeModal() {
  if (currentStep.value === 2 && savedIdTna.value && !isEditMode.value) {
    try {
      await deleteTna(savedIdTna.value);
      toast.info("Data TNA dibatalkan dan dihapus.");
    } catch (err) {
      console.error("Gagal menghapus TNA:", err);
    }
  }
  emit("close");
}

function handleError(error) {
  errorMessage.value =
    error.response?.data?.failed ||
    error.response?.data?.message ||
    "Gagal menyimpan data. Silakan coba lagi.";
  toast.error(errorMessage.value);
}

useRealtimeValidation({
  formData,
  formErrors,
  wasValidated,
  validationSchema: validationSchemaStep1,
});

async function validateStep1() {
  Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
  try {
    await validationSchemaStep1.validate(formData, { abortEarly: false });
    return true;
  } catch (err) {
    err.inner.forEach((e) => {
      formErrors[e.path] = e.message;
    });
    return false;
  }
}

function validateStep2() {
  let allValid = true;
  for (const row of kbjiRows.value) {
    const setError = (field, message) => {
      if (row.errors[field] !== message) {
        row.errors[field] = message;
      }
    };

    if (!row.kode_kbji) {
      setError("kode_kbji", "Kode KBJI wajib dipilih.");
      allValid = false;
    } else {
      setError("kode_kbji", "");
    }

    if (!row.jumlah) {
      setError("jumlah", "Jumlah wajib diisi.");
      allValid = false;
    } else {
      setError("jumlah", "");
    }

    if (!row.tanggal_batas) {
      setError("tanggal_batas", "Tenggat waktu wajib diisi.");
      allValid = false;
    } else {
      setError("tanggal_batas", "");
    }

    if (!row.deskripsi_pekerjaan) {
      setError("deskripsi_pekerjaan", "Deskripsi pekerjaan wajib diisi.");
      allValid = false;
    } else {
      setError("deskripsi_pekerjaan", "");
    }

    if (!row.persyaratan_minimum) {
      setError("persyaratan_minimum", "Persyaratan minimum wajib diisi.");
      allValid = false;
    } else {
      setError("persyaratan_minimum", "");
    }
  }
  return allValid;
}

async function submitForm() {
  if (currentStep.value === 1) {
    await submitStep1();
  } else {
    await submitStep2();
  }
}

async function submitStep1() {
  wasValidated.value = true;

  const isValid = await validateStep1();
  if (!isValid) {
    isShaking.value = true;
    setTimeout(() => (isShaking.value = false), 300);
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    if (isEditMode.value) {
      await handleUpdateTna();
    } else {
      await handleCreateTna();
    }
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}

async function handleUpdateTna() {
  const fieldId = props.fieldToEdit.id_tna;
  const data = new FormData();
  data.append("record[tahun]", formData.tahun);
  data.append("record[id_perusahaan]", formData.id_perusahaan);
  data.append("_method", "PUT");

  await updateTna(fieldId, data);
  toast.success(`Data ${props.entityName} berhasil diperbarui`);

  savedIdTna.value = fieldId;
  savedPerusahaanLabel.value = initialPerusahaanLabel.value;
  currentStep.value = 2;
}

async function handleCreateTna() {
  const data = new FormData();
  data.append("record[tahun]", formData.tahun);
  data.append("record[id_perusahaan]", formData.id_perusahaan);

  await addTna(data);

  const filterStr = `tahun=${encodeURIComponent(
    formData.tahun,
  )},id_perusahaan=${encodeURIComponent(formData.id_perusahaan)}`;
  const res = await getTna({
    sort: "created_at",
    dir: "desc",
    filter: filterStr,
    limit: 1,
  });
  const responseData = Array.isArray(res.data) ? res.data[0] : res.data;
  const list = responseData?.data || [];
  const latest = Array.isArray(list) ? list[0] : list;
  const idTna = latest?.id_tna;

  if (!idTna) {
    toast.error("Data TNA berhasil disimpan, tapi gagal mendapatkan ID TNA.");
    emit("save-successful");
    closeModal();
    return;
  }

  savedIdTna.value = idTna;

  try {
    const perusahaanRes = await getPerusahaan({
      filter: `id_perusahaan=${formData.id_perusahaan}`,
      limit: 1,
    });
    const perusahaanData = perusahaanRes.data?.[0]?.data || [];
    savedPerusahaanLabel.value = perusahaanData[0]?.nama_perusahaan || "";
  } catch {
    savedPerusahaanLabel.value = "";
  }

  toast.success("Langkah 1 berhasil. Silakan lengkapi data KBJI.");
  currentStep.value = 2;
}

async function submitStep2() {
  wasValidatedStep2.value = true;

  const isValid = validateStep2();
  if (!isValid) {
    isShaking.value = true;
    setTimeout(() => (isShaking.value = false), 300);
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  try {
    for (const id of deletedKbjiIds.value) {
      await deleteTnaKBJI(id);
    }

    for (const row of kbjiRows.value) {
      const data = new FormData();
      data.append("record[id_tna]", savedIdTna.value);
      data.append("record[kode_kbji]", row.kode_kbji);
      data.append("record[jumlah]", row.jumlah);
      data.append("record[tanggal_batas]", row.tanggal_batas);
      data.append("record[deskripsi_pekerjaan]", row.deskripsi_pekerjaan);
      data.append("record[persyaratan_minimum]", row.persyaratan_minimum);

      if (row.id_tna_kbji) {
        data.append("_method", "PUT");
        await updateTnaKBJI(row.id_tna_kbji, data);
      } else {
        await addTnaKBJI(data);
      }
    }
    toast.success(`Data KBJI berhasil disimpan`);
    emit("save-successful");
    savedIdTna.value = null;
    closeModal();
  } catch (error) {
    handleError(error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.invalid-feedback {
  display: block;
}
.form-text {
  font-size: 0.875em;
}

.step-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  background-color: #e9ecef;
  color: #6c757d;
  transition: all 0.3s ease;
}
.step-badge.active {
  background-color: #0d6efd;
  color: #fff;
}
.step-badge.done {
  background-color: #198754;
  color: #fff;
}
.step-line {
  flex: 1;
  height: 3px;
  background-color: #e9ecef;
  margin: 0 8px;
  transition: background-color 0.3s ease;
}
.step-line.active {
  background-color: #198754;
}

.kbji-card {
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.kbji-card:focus-within {
  border-color: #86b7fe !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
}

.step-number {
  box-shadow: 0 2px 4px rgba(13, 110, 253, 0.2);
}

.bg-primary-subtle {
  background-color: #cfe2ff !important;
}
.border-primary {
  border-color: #0d6efd !important;
}

.shake {
  animation: shake 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.fade-error-enter-active,
.fade-error-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-error-enter-from,
.fade-error-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
