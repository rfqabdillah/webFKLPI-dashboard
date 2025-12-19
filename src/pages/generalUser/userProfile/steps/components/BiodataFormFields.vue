<template>
  <div class="user-form-section">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h6 class="mb-0">
        <i class="fa fa-edit me-2"></i>
        {{
          isEditMode
            ? t("ProfileSteps.Biodata.EditTitle")
            : t("ProfileSteps.Biodata.InputTitle")
        }}
      </h6>
      <button
        v-if="!isEditMode"
        class="btn btn-outline-secondary btn-sm"
        @click="$emit('back')"
      >
        <i class="fa fa-arrow-left me-1"></i>
        {{ t("ProfileSteps.Biodata.ChangeUserType") }}
      </button>
    </div>

    <div class="row">
      <!-- Nama Lengkap -->
      <div class="col-12 mb-3">
        <label class="form-label fw-semibold"
          >{{ t("ProfileSteps.Biodata.FullName") }}
          <span class="text-danger">*</span></label
        >
        <input
          type="text"
          class="form-control"
          v-model="formData.nama"
          :class="{ 'is-invalid': formErrors.nama }"
          :placeholder="
            isLoading ? t('Loading') : t('ProfileSteps.Biodata.FullName')
          "
          :disabled="isLoading"
          @blur="validateField('nama')"
        />
        <div class="invalid-feedback">{{ formErrors.nama }}</div>
      </div>

      <!-- Gelar -->
      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">{{
          t("ProfileSteps.Biodata.FrontTitle")
        }}</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.gelardepan"
          placeholder="Dr."
        />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">{{
          t("ProfileSteps.Biodata.BackTitle")
        }}</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.gelarbelakang"
          placeholder="S.Kom"
        />
      </div>

      <!-- NIK -->
      <div class="col-12 mb-3">
        <label class="form-label fw-semibold"
          >{{ t("ProfileSteps.Biodata.NIK") }}
          <span class="text-danger">*</span></label
        >
        <input
          type="text"
          class="form-control"
          v-model="formData.nik"
          :class="{ 'is-invalid': formErrors.nik }"
          :placeholder="
            isLoading ? t('Loading') : t('ProfileSteps.Biodata.NIK')
          "
          :disabled="isLoading"
          @blur="validateField('nik')"
        />
        <div class="invalid-feedback">{{ formErrors.nik }}</div>
      </div>

      <!-- Email & Telepon -->
      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold"
          >{{ t("Email") }} <span class="text-danger">*</span></label
        >
        <input
          type="email"
          class="form-control"
          v-model="formData.email"
          :class="{ 'is-invalid': formErrors.email }"
          :placeholder="isLoading ? t('Loading') : t('Email')"
          :disabled="isLoading"
          @blur="validateField('email')"
        />
        <div class="invalid-feedback">{{ formErrors.email }}</div>
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">{{
          t("ProfileSteps.Biodata.Phone")
        }}</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.telp"
          placeholder="08xxxxxxxx"
        />
      </div>

      <!-- NIP & Karpeg (Only for ASN) -->
      <template v-if="!isNonAsn">
        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">{{
            t("ProfileSteps.Biodata.NIP")
          }}</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.nip"
            placeholder="NIP"
          />
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label fw-semibold">{{
            t("ProfileSteps.Biodata.KarpegCard")
          }}</label>
          <input
            type="text"
            class="form-control"
            v-model="formData.no_karpeg"
            placeholder="Kartu Pegawai"
          />
        </div>
      </template>

      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">{{
          t("ProfileSteps.Biodata.Gender")
        }}</label>
        <select
          class="form-select"
          v-model="formData.idjeniskelamin"
          :disabled="gendersLoading || isLoading"
        >
          <option value="" disabled>
            {{
              gendersLoading
                ? t("Loading")
                : t("ProfileSteps.Biodata.SelectGender")
            }}
          </option>
          <option
            v-for="gender in genderOptions"
            :key="gender.idjeniskelamin"
            :value="gender.idjeniskelamin"
          >
            {{ gender.namajeniskelamin }}
          </option>
        </select>
      </div>

      <!-- Jenis Pengguna sudah dipilih di UserTypeSelectionCards -->
      <!-- Hidden: nilai sudah di-set dari step sebelumnya -->

      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">{{
          t("ProfileSteps.Biodata.EmployeeType")
        }}</label>
        <select
          class="form-select"
          v-model="formData.idjenispegawai"
          :disabled="employeeTypesLoading || isLoading"
        >
          <option value="" disabled>
            {{
              employeeTypesLoading
                ? t("Loading")
                : t("ProfileSteps.Biodata.SelectEmployeeType")
            }}
          </option>
          <option
            v-for="employeeType in employeeTypeOptions"
            :key="employeeType.idjenispegawai"
            :value="employeeType.idjenispegawai"
          >
            {{ employeeType.namajenispegawai }}
          </option>
        </select>
      </div>

      <!-- Tempat & Tanggal Lahir -->
      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">{{
          t("ProfileSteps.Biodata.BirthPlace")
        }}</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.tempatlahir"
          placeholder="Kota kelahiran"
        />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">{{
          t("ProfileSteps.Biodata.BirthDate")
        }}</label>
        <input
          type="date"
          class="form-control"
          v-model="formData.tanggallahir"
        />
      </div>

      <!-- Alamat -->
      <div class="col-12 mb-3">
        <label class="form-label fw-semibold">{{
          t("ProfileSteps.Biodata.FullAddress")
        }}</label>
        <textarea
          class="form-control"
          v-model="formData.alamat"
          placeholder="Alamat domisili"
        ></textarea>
      </div>

      <!-- Provinsi & Kabupaten -->
      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">{{
          t("ProfileSteps.Biodata.Province")
        }}</label>
        <select
          class="form-select"
          v-model="formData.kodepropinsi"
          :disabled="regionsLoading"
        >
          <option value="" disabled>
            {{
              regionsLoading
                ? t("Loading")
                : t("ProfileSteps.Biodata.SelectProvince")
            }}
          </option>
          <template v-if="!regionsLoading">
            <option
              v-for="prov in provinceOptions"
              :key="prov.idwilayah"
              :value="prov.kodewilayah"
            >
              {{ prov.kodewilayah }} - {{ prov.namawilayah }}
            </option>
          </template>
        </select>
      </div>

      <div class="col-md-6 mb-3">
        <label class="form-label fw-semibold">{{
          t("ProfileSteps.Biodata.District")
        }}</label>
        <select
          class="form-select"
          v-model="formData.kodekabupaten"
          :disabled="!formData.kodepropinsi || kabupatenLoading"
        >
          <option value="" disabled>
            {{
              kabupatenLoading
                ? "Memuat..."
                : formData.kodepropinsi
                ? t("ProfileSteps.Biodata.SelectDistrict")
                : t("ProfileSteps.Biodata.SelectDistrictPlaceholder")
            }}
          </option>
          <template v-if="!kabupatenLoading">
            <option
              v-for="kab in kabupatenOptions"
              :key="kab.idwilayah"
              :value="kab.kodewilayah"
            >
              {{ kab.kodewilayah }} - {{ kab.namawilayah }}
            </option>
          </template>
        </select>
      </div>

      <!-- Minat -->
      <div class="col-12 mb-3">
        <label class="form-label fw-semibold">{{
          t("ProfileSteps.Biodata.Interests")
        }}</label>
        <div class="interest-input-container">
          <div class="interest-bubbles">
            <span
              v-for="(interest, index) in interestList"
              :key="index"
              class="interest-bubble"
            >
              {{ interest }}
              <button
                type="button"
                class="bubble-remove"
                @click="removeInterest(index)"
              >
                <i class="fa fa-times"></i>
              </button>
            </span>
            <input
              type="text"
              class="interest-input"
              v-model="interestInput"
              @keydown="handleInterestKeydown"
              :placeholder="t('ProfileSteps.Biodata.InterestsPlaceholder')"
            />
          </div>
        </div>
        <small class="form-text text-muted">
          {{ t("ProfileSteps.Biodata.InterestsHelp") }}
        </small>
      </div>

      <!-- Upload Foto -->
      <div class="col-12 mb-3">
        <label class="form-label fw-semibold">{{
          t("ProfileSteps.Biodata.UploadPhoto")
        }}</label>
        <input
          type="file"
          class="form-control"
          @change="handlePhotoUpload"
          accept="image/*"
          ref="fileInput"
        />
        <small class="form-text text-muted">{{
          t("ProfileSteps.Biodata.UploadPhotoHelp")
        }}</small>

        <div class="mt-3" v-if="photoPreviewUrl || formData.foto">
          <div class="position-relative d-inline-block">
            <img
              :src="photoPreviewUrl || formData.foto"
              alt="Preview Foto"
              class="img-thumbnail shadow-sm"
              style="width: 120px; height: 120px; object-fit: cover"
            />
            <button
              type="button"
              class="btn btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style="
                width: 24px;
                height: 24px;
                padding: 0;
                border: 2px solid white;
              "
              @click="removePhoto"
              :title="t('ProfileSteps.Biodata.RemovePhoto')"
            >
              <i class="fa fa-times" style="font-size: 12px"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { getRoles } from "@/services/referensi/roles";
import { getRegions } from "@/services/referensi/regions";
import { getGenders } from "@/services/referensi/genders";
import { getEmployeeTypes } from "@/services/referensi/employeeTypes";
import { compressImage } from "@/utils/imageCompressor";
import { parseBubble } from "@/utils/parseBubble";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import * as yup from "yup";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    default: "",
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isNonAsn: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "back", "photo-change"]);
const toast = useToast();
const { t } = useI18n();

// State
const formData = reactive(props.modelValue);
const formErrors = reactive({});
const roleOptions = ref([]);
const genderOptions = ref([]);
const provinceOptions = ref([]);
const kabupatenOptions = ref([]);
const rolesLoading = ref(false);
const gendersLoading = ref(false);
const employeeTypesLoading = ref(false);
const regionsLoading = ref(false);
const kabupatenLoading = ref(false);
const photoPreviewUrl = ref(null);
const fileInput = ref(null);
const interestInput = ref("");
const interestList = ref([]);
const employeeTypeOptions = ref([]);

// Validation Schema
const validationSchema = yup.object().shape({
  nama: yup
    .string()
    .required(t("ProfileSteps.Biodata.Validation.NameRequired")),
  nik: yup
    .string()
    .matches(/^[0-9]+$/, t("ProfileSteps.Biodata.Validation.NIKNumeric"))
    .length(16, t("ProfileSteps.Biodata.Validation.NIKLength"))
    .required(t("ProfileSteps.Biodata.Validation.NIKRequired")),
  email: yup
    .string()
    .email(t("ProfileSteps.Biodata.Validation.EmailInvalid"))
    .required(t("ProfileSteps.Biodata.Validation.EmailRequired")),
});

// Watchers
watch(
  formData,
  () => {
    emit("update:modelValue", formData);
  },
  { deep: true }
);

watch(
  () => formData.kodepropinsi,
  (newProv) => {
    if (newProv) {
      fetchKabupaten(newProv);
    } else {
      kabupatenOptions.value = [];
    }
  }
);

// Lifecycle
onMounted(() => {
  fetchRoles();
  fetchGenders();
  fetchEmployeeTypes();
  fetchProvinces();

  if (formData.foto) {
    photoPreviewUrl.value = formData.foto;
  }

  if (formData.kodepropinsi) {
    fetchKabupaten(formData.kodepropinsi);
  }

  // Parse existing minat
  if (formData.minat) {
    interestList.value = parseBubble(formData.minat);
  }
});

// Methods
async function fetchRoles() {
  rolesLoading.value = true;
  try {
    const response = await getRoles({ page: 1, limit: 100 });
    roleOptions.value = response.data?.[0]?.data || response.data?.data || [];
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat daftar level/role");
  } finally {
    rolesLoading.value = false;
  }
}

async function fetchGenders() {
  gendersLoading.value = true;
  try {
    const response = await getGenders({
      page: 1,
      limit: 999,
      sort: "namajeniskelamin",
      dir: "asc",
    });
    genderOptions.value = response.data?.[0]?.data || response.data?.data || [];
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat daftar jenis kelamin");
  } finally {
    gendersLoading.value = false;
  }
}

async function fetchEmployeeTypes() {
  employeeTypesLoading.value = true;
  try {
    const response = await getEmployeeTypes({
      page: 1,
      limit: 999,
      sort: "namajenispegawai",
      dir: "asc",
    });
    employeeTypeOptions.value =
      response.data?.[0]?.data || response.data?.data || [];
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat daftar jenis pegawai");
  } finally {
    employeeTypesLoading.value = false;
  }
}

async function fetchProvinces() {
  regionsLoading.value = true;
  try {
    const response = await getRegions({ filter: "tipewilayah=A", limit: 100 });
    provinceOptions.value =
      response.data?.[0]?.data || response.data?.data || [];
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat daftar provinsi");
  } finally {
    regionsLoading.value = false;
  }
}

async function fetchKabupaten(provCode) {
  kabupatenLoading.value = true;
  try {
    const response = await getRegions({
      filter: `tipewilayah=B,kodewilayah=${provCode}`,
      limit: 500,
    });
    kabupatenOptions.value =
      response.data?.[0]?.data || response.data?.data || [];

    if (formData.kodekabupaten && kabupatenOptions.value.length > 0) {
      const currentVal = String(formData.kodekabupaten);
      const exists = kabupatenOptions.value.some(
        (k) => k.kodewilayah === currentVal
      );
      if (!exists) {
        const cleanCurrent = currentVal.replace(/\./g, "");
        const match = kabupatenOptions.value.find(
          (k) => k.kodewilayah.replace(/\./g, "") === cleanCurrent
        );
        if (match) formData.kodekabupaten = match.kodewilayah;
      }
    }
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat daftar kabupaten");
  } finally {
    kabupatenLoading.value = false;
  }
}

async function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    toast.info(t("ProfileSteps.Biodata.Compressing"), { timeout: 2000 });
    const compressed = await compressImage(file);
    photoPreviewUrl.value = URL.createObjectURL(compressed);
    emit("photo-change", compressed);
    toast.success(t("ProfileSteps.Biodata.PhotoCompressed"), { timeout: 2000 });
  } catch (error) {
    toast.error("Gagal memproses gambar");
  }
}

function removePhoto() {
  photoPreviewUrl.value = null;
  formData.foto = null;
  if (fileInput.value) fileInput.value.value = null;
  emit("photo-change", null);
}

// Interest (Minat) handlers
function handleInterestKeydown(event) {
  if (event.key === "," || event.key === "Enter") {
    event.preventDefault();
    addInterest();
  } else if (
    event.key === "Backspace" &&
    !interestInput.value &&
    interestList.value.length > 0
  ) {
    interestList.value.pop();
    updateMinatFormData();
  }
}

function addInterest() {
  const value = interestInput.value.replace(/,/g, "").trim();
  if (value && !interestList.value.includes(value)) {
    interestList.value.push(value);
    updateMinatFormData();
  }
  interestInput.value = "";
}

function removeInterest(index) {
  interestList.value.splice(index, 1);
  updateMinatFormData();
}

function updateMinatFormData() {
  formData.minat = interestList.value.join(", ");
}

async function validateField(field) {
  try {
    await validationSchema.validateAt(field, formData);
    formErrors[field] = "";
  } catch (err) {
    formErrors[field] = err.message;
  }
}

async function validate() {
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    formErrors.nama = "";
    formErrors.nik = "";
    formErrors.email = "";
    return true;
  } catch (err) {
    const errors = {};
    err.inner.forEach((e) => (errors[e.path] = e.message));
    Object.assign(formErrors, errors);
    return false;
  }
}

defineExpose({ validate });
</script>

<style scoped>
.invalid-feedback {
  display: block;
}

/* Interest Bubble Styles */
.interest-input-container {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  background-color: #fff;
  min-height: 80px;
}

.interest-input-container:focus-within {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.interest-bubbles {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.interest-bubble {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #e7f1ff;
  color: #0d6efd;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #b6d4fe;
}

.bubble-remove {
  background: #0d6efd;
  border: none;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  font-size: 10px;
  transition: background 0.2s;
}

.bubble-remove:hover {
  background: #0b5ed7;
}

.interest-input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 200px;
  padding: 6px;
  font-size: 0.9rem;
}

.interest-input::placeholder {
  color: #adb5bd;
}
</style>
