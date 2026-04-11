<template>
  <BaseFormModal
    :title="modalTitle"
    :is-loading="isLoading"
    @close="closeModal"
    @save="submitForm"
  >
    <form
      @submit.prevent="submitForm"
      novalidate
      id="fklpiForm"
    >
      <!-- Nama Organisasi -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Nama Organisasi</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.nama_organisasi"
          :class="{
            'is-invalid': formErrors.nama_organisasi,
            'is-valid': wasValidated && !formErrors.nama_organisasi && formData.nama_organisasi,
            shake: isShaking && formErrors.nama_organisasi,
          }"
          placeholder="Masukkan nama organisasi"
          required
        />
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.nama_organisasi">
            {{ formErrors.nama_organisasi }}
          </div>
        </transition>
      </div>

      <div class="row">
        <!-- Lembaga Dropdown -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Lembaga (UPTP/UPTD)</label>
          <BaseSearchSelect
            v-model="formData.id_lembaga"
            :api-fn="getLembaga"
            value-key="id_lembaga"
            label-key="nama_lembaga"
            filter-key="nama_lembaga"
            placeholder="Pilih Lembaga"
            search-placeholder="Ketik nama lembaga"
            :initial-label="initialLembagaLabel"
            :is-invalid="!!formErrors.id_lembaga"
            :shake="isShaking && !!formErrors.id_lembaga"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_lembaga">
              {{ formErrors.id_lembaga }}
            </div>
          </transition>
        </div>

        <!-- Skala Dropdown -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Skala</label>
          <select
            class="form-select"
            v-model="formData.id_skala"
            :class="{
              'is-invalid': formErrors.id_skala,
              'is-valid': wasValidated && !formErrors.id_skala && formData.id_skala,
              shake: isShaking && formErrors.id_skala,
            }"
            :disabled="isLoadingSkala"
          >
            <option value="" disabled>
              {{ isLoadingSkala ? "Memuat..." : "Pilih Skala" }}
            </option>
            <option
              v-for="item in skalaOptions"
              :key="item.id_skala"
              :value="item.id_skala"
            >
              {{ item.skala }}
            </option>
          </select>
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_skala">
              {{ formErrors.id_skala }}
            </div>
          </transition>
        </div>
      </div>

      <div class="row">
        <!-- Provinsi Dropdown -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Provinsi</label>
          <select
            class="form-select"
            v-model="selectedProvinceCode"
            :class="{
              'is-invalid': formErrors.id_wilayah && !selectedProvinceCode,
              'is-valid': wasValidated && selectedProvinceCode,
              shake:
                isShaking && formErrors.id_wilayah && !selectedProvinceCode,
            }"
            :disabled="isLoadingProvinsi"
            required
          >
            <option value="" disabled>
              {{ isLoadingProvinsi ? "Memuat..." : "Pilih Provinsi" }}
            </option>
            <template v-if="!isLoadingProvinsi">
              <option
                v-for="prov in provinsiOptions"
                :key="prov.id_wilayah"
                :value="prov.kode_wilayah"
              >
                {{ prov.kode_wilayah }} - {{ prov.nama_wilayah }}
              </option>
            </template>
          </select>
        </div>

        <!-- Kabupaten Dropdown -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Kabupaten</label>
          <select
            class="form-select"
            v-model="formData.id_wilayah"
            :class="{
              'is-invalid': formErrors.id_wilayah,
              'is-valid': wasValidated && !formErrors.id_wilayah && formData.id_wilayah,
              shake: isShaking && formErrors.id_wilayah,
            }"
            :disabled="!selectedProvinceCode || isLoadingKabupaten"
            required
          >
            <option value="" disabled>
              {{
                isLoadingKabupaten
                  ? "Memuat..."
                  : selectedProvinceCode
                  ? "Pilih Kabupaten"
                  : "Silakan pilih Provinsi terlebih dahulu"
              }}
            </option>
            <template v-if="!isLoadingKabupaten">
              <option
                v-for="kab in kabupatenOptions"
                :key="kab.id_wilayah"
                :value="kab.id_wilayah"
              >
                {{ kab.kode_wilayah }} - {{ kab.nama_wilayah }}
              </option>
            </template>
          </select>
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.id_wilayah">
              {{ formErrors.id_wilayah }}
            </div>
          </transition>
        </div>
      </div>

      <!-- Alamat Organisasi -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Alamat Organisasi</label>
        <textarea
          class="form-control"
          v-model="formData.alamat_organisasi"
          :class="{
            'is-invalid': formErrors.alamat_organisasi,
            'is-valid': wasValidated && !formErrors.alamat_organisasi && formData.alamat_organisasi,
            shake: isShaking && formErrors.alamat_organisasi,
          }"
          placeholder="Masukkan alamat organisasi"
          rows="2"
        ></textarea>
        <transition name="fade-error">
          <div class="invalid-feedback" v-if="formErrors.alamat_organisasi">
            {{ formErrors.alamat_organisasi }}
          </div>
        </transition>
      </div>

      <!-- Koordinat -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Koordinat</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.koordinat"
          placeholder="Contoh: -6.200000, 106.816666"
        />
      </div>

      <!-- Deskripsi Organisasi -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Deskripsi Organisasi</label>
        <textarea
          class="form-control"
          v-model="formData.deskripsi_organisasi"
          placeholder="Masukkan deskripsi organisasi"
          rows="3"
        ></textarea>
      </div>

      <!-- Visi -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Visi</label>
        <textarea
          class="form-control"
          v-model="formData.visi"
          placeholder="Masukkan visi organisasi"
          rows="3"
        ></textarea>
      </div>

      <!-- Misi -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Misi</label>
        <textarea
          class="form-control"
          v-model="formData.misi"
          placeholder="Masukkan misi organisasi"
          rows="3"
        ></textarea>
      </div>

      <!-- Dasar Hukum -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Dasar Hukum</label>
        <textarea
          class="form-control"
          v-model="formData.dasar_hukum"
          placeholder="Masukkan dasar hukum"
          rows="3"
        ></textarea>
      </div>

      <!-- Potensi Wilayah -->
      <div class="mb-3">
        <label class="form-label fw-semibold">Potensi Wilayah</label>
        <textarea
          class="form-control"
          v-model="formData.potensi_wilayah"
          placeholder="Masukkan potensi wilayah"
          rows="3"
        ></textarea>
      </div>

      <hr class="my-3" />
      <h6 class="fw-semibold text-muted mb-3">Kontak & Sosial Media</h6>

      <div class="row">
        <!-- Telepon -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Telepon</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.telepon_organisasi"
            placeholder="Masukkan nomor telepon"
          />
        </div>

        <!-- Email -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Email</label>
          <input
            type="email"
            class="form-control"
            v-model="formData.email_organisasi"
            :class="{
              'is-invalid': formErrors.email_organisasi,
              'is-valid': wasValidated && !formErrors.email_organisasi && formData.email_organisasi,
              shake: isShaking && formErrors.email_organisasi,
            }"
            placeholder="Masukkan email organisasi"
          />
          <transition name="fade-error">
            <div class="invalid-feedback" v-if="formErrors.email_organisasi">
              {{ formErrors.email_organisasi }}
            </div>
          </transition>
        </div>
      </div>

      <div class="row">
        <!-- Instagram -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Instagram</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.instagram_organisasi"
            placeholder="Masukkan link Instagram"
          />
        </div>

        <!-- Facebook -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Facebook</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.facebook_organisasi"
            placeholder="Masukkan link Facebook"
          />
        </div>
      </div>

      <div class="row">
        <!-- YouTube -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">YouTube</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.youtube_organisasi"
            placeholder="Masukkan link YouTube"
          />
        </div>

        <!-- Twitter -->
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">Twitter</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.twitter_organisasi"
            placeholder="Masukkan link Twitter"
          />
        </div>
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
import { reactive, ref, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import { useRealtimeValidation } from "@/composables/useRealtimeValidation";
import {
  addOrganisasi,
  updateOrganisasi,
} from "@/services/general/organisasi/organisasi";
import { getWilayah } from "@/services/referensi/wilayah";
import { getLembaga } from "@/services/general/organisasi/lembaga";
import { getSkala } from "@/services/referensi/skala";

// === Props & Emits ===
const props = defineProps({
  fieldToEdit: { type: Object, default: null },
  entityName: { type: String, default: "Organisasi" },
});
const emit = defineEmits(["close", "save-successful"]);
const toast = useToast();

// === State ===
const formData = reactive({
  nama_organisasi: "",
  alamat_organisasi: "",
  id_wilayah: "",
  deskripsi_organisasi: "",
  telepon_organisasi: "",
  email_organisasi: "",
  instagram_organisasi: "",
  facebook_organisasi: "",
  youtube_organisasi: "",
  twitter_organisasi: "",
  id_lembaga: "",
  id_skala: "",
  koordinat: "",
  visi: "",
  misi: "",
  dasar_hukum: "",
  potensi_wilayah: "",
});

const formErrors = reactive({
  nama_organisasi: "",
  id_wilayah: "",
  id_lembaga: "",
  id_skala: "",
  alamat_organisasi: "",
  email_organisasi: "",
});

const isLoading = ref(false);
const errorMessage = ref(null);
const wasValidated = ref(false);
const isShaking = ref(false);

const initialLembagaLabel = ref("");

// Dropdown options

const skalaOptions = ref([]);
const isLoadingSkala = ref(false);

// Province & Kabupaten cascading
const selectedProvinceCode = ref("");
const provinsiOptions = ref([]);
const kabupatenOptions = ref([]);
const isLoadingProvinsi = ref(false);
const isLoadingKabupaten = ref(false);

// === Validation Schema ===
const validationSchema = yup.object().shape({
  nama_organisasi: yup.string().required("Nama organisasi wajib diisi."),
  id_lembaga: yup.string().required("Lembaga wajib dipilih."),
  id_wilayah: yup.string().required("Wilayah wajib dipilih."),
  alamat_organisasi: yup.string().required("Alamat organisasi wajib diisi."),
  email_organisasi: yup.string().nullable().email("Format email tidak valid."),
});

// === Computed ===
const isEditMode = computed(() => !!props.fieldToEdit);
const modalTitle = computed(() => {
  return isEditMode.value
    ? `Edit Data ${props.entityName}`
    : `Tambah Data ${props.entityName}`;
});

// === Fetch Dropdown Options ===

async function fetchSkala() {
  isLoadingSkala.value = true;
  try {
    const res = await getSkala({ per_page: 100 });
    const responseBody = res.data?.[0] || {};
    skalaOptions.value = responseBody.data || [];
  } catch (err) {
    console.error("Gagal memuat skala:", err);
    toast.error("Gagal memuat data skala.");
  } finally {
    isLoadingSkala.value = false;
  }
}

async function fetchProvinsi() {
  isLoadingProvinsi.value = true;
  try {
    const res = await getWilayah({ filter: "tipe_wilayah=A", limit: 50 });
    const responseBody = res.data?.[0] || {};
    provinsiOptions.value = responseBody.data || [];
  } catch (err) {
    console.error("Gagal memuat provinsi:", err);
    toast.error("Gagal memuat daftar provinsi.");
  } finally {
    isLoadingProvinsi.value = false;
  }
}

async function fetchKabupaten(provCode) {
  if (!provCode) {
    kabupatenOptions.value = [];
    return;
  }
  isLoadingKabupaten.value = true;
  try {
    const params = {
      limit: 100,
      sort: "kode_wilayah",
      dir: "asc",
      filter: `tipe_wilayah=B,kode_wilayah=${provCode}`,
    };

    const response = await getWilayah(params);
    let allData = [];
    if (response.data && Array.isArray(response.data)) {
      const rootData = response.data[0];
      if (rootData.data) {
        allData = rootData.data;
      }
    } else if (response.data && response.data.data) {
      allData = response.data.data;
    }
    kabupatenOptions.value = allData.filter((item) =>
      item.kode_wilayah.startsWith(provCode + "."),
    );

    if (formData.id_wilayah && kabupatenOptions.value.length > 0) {
      const currentVal = String(formData.id_wilayah);
      const exists = kabupatenOptions.value.some(
        (k) => k.id_wilayah === currentVal,
      );

      if (!exists) {
        const cleanCurrent = currentVal.replace(/\./g, "");
        const match = kabupatenOptions.value.find(
          (k) => k.kode_wilayah.replace(/\./g, "") === cleanCurrent,
        );
        if (match) {
          formData.id_wilayah = match.id_wilayah;
        }
      }
    }
  } catch (error) {
    console.error("Gagal memuat data kabupaten:", error);
    toast.error("Gagal memuat daftar kabupaten.");
  } finally {
    isLoadingKabupaten.value = false;
  }
}

watch(
  () => selectedProvinceCode.value,
  (newProv) => {
    if (!newProv) {
      formData.id_wilayah = "";
      kabupatenOptions.value = [];
      return;
    }
    const idWilayahStr = String(formData.id_wilayah || "");
    if (idWilayahStr && kabupatenOptions.value.length > 0) {
      const selectedKab = kabupatenOptions.value.find(
        (k) => k.id_wilayah === idWilayahStr,
      );
      if (selectedKab && !selectedKab.kode_wilayah.startsWith(newProv)) {
        formData.id_wilayah = "";
      } else if (!selectedKab) {
        formData.id_wilayah = "";
      }
    }

    fetchKabupaten(newProv);
  },
);

onMounted(() => {
  fetchSkala();
  fetchProvinsi();
});

// === Watcher ===
watch(
  () => props.fieldToEdit,
  (newData) => {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    wasValidated.value = false;
    errorMessage.value = null;

    if (newData) {
      formData.nama_organisasi = newData.nama_organisasi || "";
      formData.alamat_organisasi = newData.alamat_organisasi || "";
      formData.id_wilayah = newData.id_wilayah || "";
      formData.deskripsi_organisasi = newData.deskripsi_organisasi || "";
      formData.telepon_organisasi = newData.telepon_organisasi || "";
      formData.email_organisasi = newData.email_organisasi || "";
      formData.instagram_organisasi = newData.instagram_organisasi || "";
      formData.facebook_organisasi = newData.facebook_organisasi || "";
      formData.youtube_organisasi = newData.youtube_organisasi || "";
      formData.twitter_organisasi = newData.twitter_organisasi || "";
      formData.id_lembaga = newData.id_lembaga || "";
      formData.id_skala = newData.id_skala || "";
      formData.koordinat = newData.koordinat || "";
      formData.visi = newData.visi || "";
      formData.misi = newData.misi || "";
      formData.dasar_hukum = newData.dasar_hukum || "";
      formData.potensi_wilayah = newData.potensi_wilayah || "";
      initialLembagaLabel.value = newData.lembaga?.nama_lembaga || newData.nama_lembaga || "";

      if (newData.wilayah && newData.wilayah.kode_wilayah) {
        const kode = String(newData.wilayah.kode_wilayah);
        selectedProvinceCode.value = kode.includes(".")
          ? kode.split(".")[0]
          : kode.substring(0, 2);

        fetchKabupaten(selectedProvinceCode.value);
      } else {
        selectedProvinceCode.value = "";
      }
    } else {
      Object.keys(formData).forEach((key) => {
        formData[key] = "";
      });
      selectedProvinceCode.value = "";
    }
  },
  { immediate: true, deep: true },
);

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
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    return true;
  } catch (err) {
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    err.inner.forEach((e) => {
      if (formErrors.hasOwnProperty(e.path)) {
        formErrors[e.path] = e.message;
      }
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
  data.append("record[nama_organisasi]", formData.nama_organisasi);
  data.append("record[alamat_organisasi]", formData.alamat_organisasi);
  data.append("record[id_wilayah]", formData.id_wilayah);
  data.append("record[deskripsi_organisasi]", formData.deskripsi_organisasi);
  data.append("record[telepon_organisasi]", formData.telepon_organisasi);
  data.append("record[email_organisasi]", formData.email_organisasi);
  data.append("record[instagram_organisasi]", formData.instagram_organisasi);
  data.append("record[facebook_organisasi]", formData.facebook_organisasi);
  data.append("record[youtube_organisasi]", formData.youtube_organisasi);
  data.append("record[twitter_organisasi]", formData.twitter_organisasi);
  data.append("record[id_lembaga]", formData.id_lembaga);
  data.append("record[id_skala]", formData.id_skala);
  data.append("record[koordinat]", formData.koordinat);
  data.append("record[visi]", formData.visi);
  data.append("record[misi]", formData.misi);
  data.append("record[dasar_hukum]", formData.dasar_hukum);
  data.append("record[potensi_wilayah]", formData.potensi_wilayah);

  try {
    if (isEditMode.value) {
      const fieldId = props.fieldToEdit.id_organisasi;
      data.append("_method", "PUT");
      await updateOrganisasi(fieldId, data);
      toast.success(`Data ${props.entityName} berhasil diperbarui`);
    } else {
      await addOrganisasi(data);
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
