<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form @submit.prevent="submitForm" novalidate id="pembinaanForm">
      <!-- Nama Pembinaan -->
      <div class="mb-3">
        <label class="form-label fw-semibold"
          >Nama Pembinaan <span class="text-danger">*</span></label
        >
        <input
          type="text"
          class="form-control"
          v-model="formData.nama_pembinaan"
          :class="{
            'is-invalid': formErrors.nama_pembinaan,
            'is-valid': wasValidated && !formErrors.nama_pembinaan,
            shake: isShaking && formErrors.nama_pembinaan,
          }"
          placeholder="Masukkan nama pembinaan"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.nama_pembinaan">
            {{ formErrors.nama_pembinaan }}
          </div>
        </transition>
      </div>

      <!-- Deskripsi -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Deskripsi</label>
        <textarea
          class="form-control"
          v-model="formData.deskripsi"
          :class="{
            'is-invalid': formErrors.deskripsi,
            'is-valid':
              wasValidated &&
              !formErrors.deskripsi &&
              formData.deskripsi !== '',
            shake: isShaking && formErrors.deskripsi,
          }"
          placeholder="Masukkan deskripsi pembinaan"
          rows="3"
        ></textarea>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.deskripsi">
            {{ formErrors.deskripsi }}
          </div>
        </transition>
      </div>

      <div class="row">
        <!-- Jenis Pembinaan -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Jenis Pembinaan</label>
          <select
            class="form-select"
            v-model="formData.id_jenis_pembinaan"
            :class="{
              'is-invalid': formErrors.id_jenis_pembinaan,
              'is-valid':
                wasValidated &&
                !formErrors.id_jenis_pembinaan &&
                formData.id_jenis_pembinaan !== '',
              shake: isShaking && formErrors.id_jenis_pembinaan,
            }"
            :disabled="jenisLoading"
          >
            <option value="">
              {{ jenisLoading ? "Memuat..." : "Pilih Jenis Pembinaan" }}
            </option>
            <option
              v-for="item in jenisOptions"
              :key="item.id_jenis_pembinaan"
              :value="item.id_jenis_pembinaan"
            >
              {{ item.nama_jenis_pembinaan }}
            </option>
          </select>
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_jenis_pembinaan">
              {{ formErrors.id_jenis_pembinaan }}
            </div>
          </transition>
        </div>

        <!-- Metode Pembinaan -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Metode Pembinaan</label>
          <select
            class="form-select"
            v-model="formData.id_metode_pembinaan"
            :class="{
              'is-invalid': formErrors.id_metode_pembinaan,
              'is-valid':
                wasValidated &&
                !formErrors.id_metode_pembinaan &&
                formData.id_metode_pembinaan !== '',
              shake: isShaking && formErrors.id_metode_pembinaan,
            }"
            :disabled="metodeLoading"
          >
            <option value="">
              {{ metodeLoading ? "Memuat..." : "Pilih Metode Pembinaan" }}
            </option>
            <option
              v-for="item in metodeOptions"
              :key="item.id_metode_pembinaan"
              :value="item.id_metode_pembinaan"
            >
              {{ item.nama_metode_pembinaan }}
            </option>
          </select>
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_metode_pembinaan">
              {{ formErrors.id_metode_pembinaan }}
            </div>
          </transition>
        </div>
      </div>

      <!-- Organisasi (FKLPI) -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Organisasi (FKLPI)</label>
        <BaseSearchSelect
          v-model="formData.id_organisasi"
          :api-fn="getOrganisasi"
          value-key="id_organisasi"
          label-key="nama_organisasi"
          filter-key="nama_organisasi"
          placeholder="Pilih Organisasi"
          search-placeholder="Ketik nama organisasi"
          :initial-label="initialOrganisasiLabel"
          :is-invalid="!!formErrors.id_organisasi"
          :shake="isShaking && !!formErrors.id_organisasi"
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.id_organisasi">
            {{ formErrors.id_organisasi }}
          </div>
        </transition>
      </div>

      <div class="row">
        <!-- Tanggal Mulai -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold"
            >Tanggal Mulai <span class="text-danger">*</span></label
          >
          <input
            type="date"
            class="form-control"
            v-model="formData.tanggal_mulai"
            :class="{
              'is-invalid': formErrors.tanggal_mulai,
              'is-valid': wasValidated && !formErrors.tanggal_mulai,
              shake: isShaking && formErrors.tanggal_mulai,
            }"
            required
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.tanggal_mulai">
              {{ formErrors.tanggal_mulai }}
            </div>
          </transition>
        </div>

        <!-- Tanggal Selesai -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Tanggal Selesai</label>
          <input
            type="date"
            class="form-control"
            v-model="formData.tanggal_selesai"
            :class="{
              'is-invalid': formErrors.tanggal_selesai,
              'is-valid':
                wasValidated &&
                !formErrors.tanggal_selesai &&
                formData.tanggal_selesai !== '',
              shake: isShaking && formErrors.tanggal_selesai,
            }"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.tanggal_selesai">
              {{ formErrors.tanggal_selesai }}
            </div>
          </transition>
        </div>
      </div>

      <!-- Batas Pendaftaran -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Batas Pendaftaran</label>
        <input
          type="date"
          class="form-control"
          v-model="formData.batas_pendaftaran"
          :class="{
            'is-invalid': formErrors.batas_pendaftaran,
            'is-valid':
              wasValidated &&
              !formErrors.batas_pendaftaran &&
              formData.batas_pendaftaran !== '',
            shake: isShaking && formErrors.batas_pendaftaran,
          }"
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.batas_pendaftaran">
            {{ formErrors.batas_pendaftaran }}
          </div>
        </transition>
      </div>

      <!-- Peserta -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Peserta</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.peserta"
          :class="{
            'is-invalid': formErrors.peserta,
            'is-valid':
              wasValidated && !formErrors.peserta && formData.peserta !== '',
            shake: isShaking && formErrors.peserta,
          }"
          placeholder="Masukkan peserta pembinaan"
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.peserta">
            {{ formErrors.peserta }}
          </div>
        </transition>
      </div>

      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
        <i class="bi bi-x-circle me-2"></i>{{ errorMessage }}
      </div>
    </form>
  </BaseFormModal>
</template>

<script setup>
import BaseFormModal from "@/components/base/BaseFormModal.vue";
import BaseSearchSelect from "@/components/base/BaseSearchSelect.vue";
import {
  addPembinaan,
  updatePembinaan,
} from "@/services/general/pembinaan/pembinaan";
import { getJenisPembinaan } from "@/services/referensi/jenisPembinaan";
import { getMetodePembinaan } from "@/services/referensi/metodePembinaan";
import { getOrganisasi } from "@/services/general/organisasi/organisasi";
import { reactive, ref, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Pembinaan" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  nama_pembinaan: "",
  deskripsi: "",
  tanggal_mulai: "",
  tanggal_selesai: "",
  batas_pendaftaran: "",
  id_organisasi: "",
  id_jenis_pembinaan: "",
  id_metode_pembinaan: "",
  peserta: "",
});

const formErrors = reactive({
  nama_pembinaan: "",
  deskripsi: "",
  tanggal_mulai: "",
  tanggal_selesai: "",
  batas_pendaftaran: "",
  id_organisasi: "",
  id_jenis_pembinaan: "",
  id_metode_pembinaan: "",
  peserta: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);

const initialOrganisasiLabel = ref("");

// Dropdown options
const jenisOptions = ref([]);
const jenisLoading = ref(false);
const metodeOptions = ref([]);
const metodeLoading = ref(false);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  nama_pembinaan: yup.string().required("Nama pembinaan wajib diisi."),
  deskripsi: yup.string().nullable(),
  tanggal_mulai: yup.string().required("Tanggal mulai wajib diisi."),
  tanggal_selesai: yup
    .string()
    .nullable()
    .test(
      "not-before-mulai",
      "Tanggal selesai tidak boleh sebelum tanggal mulai.",
      function (value) {
        const { tanggal_mulai } = this.parent;
        if (!value || !tanggal_mulai) return true;
        return new Date(value) >= new Date(tanggal_mulai);
      },
    ),
  batas_pendaftaran: yup
    .string()
    .nullable()
    .test(
      "not-after-mulai",
      "Batas pendaftaran tidak boleh lebih dari tanggal mulai.",
      function (value) {
        const { tanggal_mulai } = this.parent;
        if (!value || !tanggal_mulai) return true;
        return new Date(value) <= new Date(tanggal_mulai);
      },
    ),
  id_organisasi: yup.string().nullable(),
  id_jenis_pembinaan: yup.string().nullable(),
  id_metode_pembinaan: yup.string().nullable(),
  peserta: yup.string().nullable(),
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

// === Fetch Dropdown Data ===
async function fetchJenisPembinaan() {
  jenisLoading.value = true;
  try {
    const res = await getJenisPembinaan({
      limit: 100,
      sort: "nama_jenis_pembinaan",
      dir: "asc",
    });
    jenisOptions.value = res.data?.[0]?.data || [];
  } catch (err) {
    console.error("Gagal memuat jenis pembinaan:", err);
    toast.error("Gagal memuat daftar jenis pembinaan.");
  } finally {
    jenisLoading.value = false;
  }
}

async function fetchMetodePembinaan() {
  metodeLoading.value = true;
  try {
    const res = await getMetodePembinaan({
      limit: 100,
      sort: "nama_metode_pembinaan",
      dir: "asc",
    });
    metodeOptions.value = res.data?.[0]?.data || [];
  } catch (err) {
    console.error("Gagal memuat metode pembinaan:", err);
    toast.error("Gagal memuat daftar metode pembinaan.");
  } finally {
    metodeLoading.value = false;
  }
}

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;

    if (newData) {
      formData.nama_pembinaan = newData.nama_pembinaan
        ? newData.nama_pembinaan.trim()
        : "";
      formData.deskripsi = newData.deskripsi ? newData.deskripsi.trim() : "";
      formData.tanggal_mulai = newData.tanggal_mulai
        ? newData.tanggal_mulai.substring(0, 10)
        : "";
      formData.tanggal_selesai = newData.tanggal_selesai
        ? newData.tanggal_selesai.substring(0, 10)
        : "";
      formData.batas_pendaftaran = newData.batas_pendaftaran
        ? newData.batas_pendaftaran.substring(0, 10)
        : "";
      formData.id_organisasi = newData.id_organisasi || "";
      initialOrganisasiLabel.value = newData.fklpi?.nama_organisasi || newData.organisasi?.nama_organisasi || newData.nama_organisasi || "";
      formData.id_jenis_pembinaan = newData.id_jenis_pembinaan || "";
      formData.id_metode_pembinaan = newData.id_metode_pembinaan || "";
      formData.peserta = newData.peserta ? newData.peserta.trim() : "";
    } else {
      Object.keys(formData).forEach((key) => (formData[key] = ""));
      initialOrganisasiLabel.value = "";
    }
  },
  { immediate: true, deep: true },
);

// === Validasi tanggal real-time (tanpa perlu klik Simpan) ===
watch(
  () => [formData.tanggal_selesai, formData.tanggal_mulai],
  ([selesai, mulai]) => {
    if (selesai && mulai && new Date(selesai) < new Date(mulai)) {
      formErrors.tanggal_selesai =
        "Tanggal selesai tidak boleh sebelum tanggal mulai.";
    } else {
      formErrors.tanggal_selesai = "";
    }
  },
);

watch(
  () => [formData.batas_pendaftaran, formData.tanggal_mulai],
  ([batas, mulai]) => {
    if (batas && mulai && new Date(batas) > new Date(mulai)) {
      formErrors.batas_pendaftaran =
        "Batas pendaftaran tidak boleh lebih dari tanggal mulai.";
    } else {
      formErrors.batas_pendaftaran = "";
    }
  },
);

onMounted(() => {
  fetchJenisPembinaan();
  fetchMetodePembinaan();
});

// === Methods ===
function closeModal() {
  emit("close");
}

function handleError(error) {
  errorMessage.value =
    error.response?.data?.failed ||
    error.response?.data?.message ||
    "Gagal menyimpan data. Silakan coba lagi.";
  toast.error(errorMessage.value);
}

useRealtimeValidation({ formData, formErrors, wasValidated, validationSchema });

async function validateForm() {
  Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    return true;
  } catch (err) {
    err.inner.forEach((e) => {
      formErrors[e.path] = e.message;
    });
    return false;
  }
}

async function submitForm() {
  wasValidated.value = true;

  const isValid = await validateForm();
  if (!isValid) {
    isShaking.value = true;
    setTimeout(() => (isShaking.value = false), 300);
    return;
  }

  isLoading.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[nama_pembinaan]", formData.nama_pembinaan);
  data.append("record[deskripsi]", formData.deskripsi || "");
  data.append("record[tanggal_mulai]", formData.tanggal_mulai);
  data.append("record[tanggal_selesai]", formData.tanggal_selesai || "");
  data.append("record[batas_pendaftaran]", formData.batas_pendaftaran || "");
  data.append("record[id_organisasi]", formData.id_organisasi || "");
  data.append("record[id_jenis_pembinaan]", formData.id_jenis_pembinaan || "");
  data.append(
    "record[id_metode_pembinaan]",
    formData.id_metode_pembinaan || "",
  );
  data.append("record[peserta]", formData.peserta || "");

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_pembinaan;
      data.append("_method", "PUT");
      await updatePembinaan(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addPembinaan(data);
      toast.success(`Data ${props.entityName} berhasil ditambah`);
    }

    emit("save-successful");
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
