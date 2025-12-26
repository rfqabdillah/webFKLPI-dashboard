<template>
  <div>
    <!-- Section: Personal Information -->
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-white">
        <div class="d-flex align-items-center">
          <div class="section-icon bg-primary">
            <i class="fa fa-user"></i>
          </div>
          <h5 class="mb-0 ms-3">{{ $t("Personal Information") }}</h5>
          <button
            v-if="!isEditing"
            class="btn btn-sm btn-warning ms-auto"
            @click="$emit('start-editing')"
          >
            <i class="fa fa-pencil me-1"></i>{{ $t("Edit") }}
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="info-list">
          <!-- Nama Lengkap -->
          <div class="info-row">
            <span class="info-label">
              {{ $t("Full Name") }}
              <span v-if="isEditing" class="text-danger">*</span>
            </span>
            <div class="info-value">
              <template v-if="isEditing">
                <input
                  type="text"
                  class="form-control"
                  :value="editForm.nama"
                  @input="handleInput('nama', $event.target.value)"
                  @blur="validateField('nama')"
                  :class="{ 'is-invalid': formErrors.nama }"
                />
                <div v-if="formErrors.nama" class="invalid-feedback">
                  {{ formErrors.nama }}
                </div>
              </template>
              <span v-else>{{ user.nama || "-" }}</span>
            </div>
          </div>

          <!-- Gelar Depan -->
          <div class="info-row">
            <span class="info-label">{{ $t("Title Prefix") }}</span>
            <div class="info-value">
              <input
                v-if="isEditing"
                type="text"
                class="form-control"
                :value="editForm.gelardepan"
                @input="handleInput('gelardepan', $event.target.value)"
                placeholder="Dr., Ir., H."
              />
              <span v-else>{{ user.gelardepan || "-" }}</span>
            </div>
          </div>

          <!-- Gelar Belakang -->
          <div class="info-row">
            <span class="info-label">{{ $t("Title Suffix") }}</span>
            <div class="info-value">
              <input
                v-if="isEditing"
                type="text"
                class="form-control"
                :value="editForm.gelarbelakang"
                @input="handleInput('gelarbelakang', $event.target.value)"
                placeholder="S.Kom, M.T."
              />
              <span v-else>{{ user.gelarbelakang || "-" }}</span>
            </div>
          </div>

          <!-- Jenis Kelamin -->
          <div class="info-row">
            <span class="info-label">{{ $t("Gender") }}</span>
            <div class="info-value">
              <select
                v-if="isEditing"
                class="form-select"
                :value="editForm.idjeniskelamin"
                @change="handleInput('idjeniskelamin', $event.target.value)"
                :disabled="gendersLoading"
              >
                <option value="" disabled>
                  {{ gendersLoading ? $t("Loading") : $t("Select Gender") }}
                </option>
                <option
                  v-for="gender in genderOptions"
                  :key="gender.idjeniskelamin"
                  :value="gender.idjeniskelamin"
                >
                  {{ gender.namajeniskelamin }}
                </option>
              </select>
              <span v-else class="fw-medium">{{ genderName || "-" }}</span>
            </div>
          </div>

          <!-- NIK -->
          <div class="info-row">
            <span class="info-label">
              NIK
              <span v-if="isEditing" class="text-danger">*</span>
            </span>
            <div class="info-value">
              <template v-if="isEditing">
                <input
                  type="text"
                  class="form-control"
                  :value="editForm.nik"
                  @input="handleInput('nik', $event.target.value)"
                  @blur="validateField('nik')"
                  :class="{ 'is-invalid': formErrors.nik }"
                  maxlength="16"
                />
                <div v-if="formErrors.nik" class="invalid-feedback">
                  {{ formErrors.nik }}
                </div>
              </template>
              <span v-else>{{ user.nik || "-" }}</span>
            </div>
          </div>

          <!-- NIP (ASN only) -->
          <div class="info-row" v-if="isASN || (isEditing && isASN)">
            <span class="info-label">NIP</span>
            <div class="info-value">
              <input
                v-if="isEditing"
                type="text"
                class="form-control"
                :value="editForm.nip"
                @input="handleInput('nip', $event.target.value)"
                placeholder="NIP"
              />
              <span v-else>{{ user.nip || "-" }}</span>
            </div>
          </div>

          <!-- No Karpeg (ASN only) -->
          <div class="info-row" v-if="isASN || (isEditing && isASN)">
            <span class="info-label">No. Karpeg</span>
            <div class="info-value">
              <input
                v-if="isEditing"
                type="text"
                class="form-control"
                :value="editForm.no_karpeg"
                @input="handleInput('no_karpeg', $event.target.value)"
                placeholder="Kartu Pegawai"
              />
              <span v-else>{{ user.no_karpeg || "-" }}</span>
            </div>
          </div>

          <!-- Employee Type -->
          <div class="info-row">
            <span class="info-label">{{ $t("Employee Type") }}</span>
            <div class="info-value">
              <select
                v-if="isEditing"
                class="form-select"
                :value="editForm.idjenispegawai"
                @change="handleInput('idjenispegawai', $event.target.value)"
                :disabled="employeeTypesLoading"
              >
                <option value="" disabled>
                  {{
                    employeeTypesLoading
                      ? $t("Loading")
                      : $t("Select Employee Type")
                  }}
                </option>
                <option
                  v-for="et in employeeTypeOptions"
                  :key="et.idjenispegawai"
                  :value="et.idjenispegawai"
                >
                  {{ et.namajenispegawai }}
                </option>
              </select>
              <template v-else>
                <span v-if="currentEmployeeTypeName">{{
                  currentEmployeeTypeName
                }}</span>
                <span v-else>-</span>
              </template>
            </div>
          </div>

          <!-- Tempat Lahir -->
          <div class="info-row">
            <span class="info-label">{{ $t("Place of Birth") }}</span>
            <div class="info-value">
              <input
                v-if="isEditing"
                type="text"
                class="form-control"
                :value="editForm.tempatlahir"
                @input="handleInput('tempatlahir', $event.target.value)"
                :placeholder="$t('Birth city')"
              />
              <span v-else>{{ user.tempatlahir || "-" }}</span>
            </div>
          </div>

          <!-- Tanggal Lahir -->
          <div class="info-row">
            <span class="info-label">{{ $t("Date of Birth") }}</span>
            <div class="info-value">
              <input
                v-if="isEditing"
                type="date"
                class="form-control"
                :value="editForm.tanggallahir"
                @input="handleInput('tanggallahir', $event.target.value)"
              />
              <span v-else>{{ formattedBirthDate || "-" }}</span>
            </div>
          </div>

          <!-- Minat -->
          <div class="info-row">
            <span class="info-label">{{ $t("Interests") }}</span>
            <div class="info-value">
              <template v-if="isEditing">
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
                      :placeholder="$t('Type and press Enter')"
                    />
                  </div>
                </div>
                <small class="form-text text-muted">
                  {{ $t("Press Enter or comma to add interest") }}
                </small>
              </template>
              <template v-else>
                <div v-if="user.minat" class="d-flex flex-wrap gap-1">
                  <span
                    v-for="(interest, idx) in interestsList"
                    :key="idx"
                    class="interest-chip"
                  >
                    {{ interest }}
                  </span>
                </div>
                <span v-else>-</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section: Contact & Address -->
    <div class="card shadow-sm mb-4">
      <div class="card-header bg-white">
        <div class="d-flex align-items-center">
          <div class="section-icon bg-info">
            <i class="fa fa-address-book"></i>
          </div>
          <h5 class="mb-0 ms-3">{{ $t("Contact & Address") }}</h5>
        </div>
      </div>
      <div class="card-body">
        <div class="info-list">
          <!-- Email (Read-only, use Change Email button to edit) -->
          <div class="info-row">
            <span class="info-label">Email</span>
            <div class="info-value">
              <div
                class="d-flex align-items-center justify-content-between w-100"
              >
                <span>{{ user.email || "-" }}</span>
                <button
                  v-if="isEditing && !showChangeEmail"
                  class="btn btn-sm btn-outline-info ms-auto"
                  @click="showChangeEmail = true"
                >
                  <i class="fa fa-pencil me-1"></i>{{ $t("Change Email") }}
                </button>
              </div>
            </div>
          </div>

          <!-- Change Email Section (Modern Design) -->
          <div
            v-if="showChangeEmail && isEditing"
            class="change-email-modern my-3"
          >
            <div class="email-change-card">
              <!-- Header -->
              <div class="email-card-header">
                <div class="header-content">
                  <div class="header-icon">
                    <i class="fa fa-envelope"></i>
                  </div>
                  <div class="header-text">
                    <h6 class="mb-0">{{ $t("Change Email") }}</h6>
                    <small class="text-white-50">{{
                      $t("Secure email update")
                    }}</small>
                  </div>
                </div>
                <button class="close-btn" @click="resetEmailChange">
                  <i class="fa fa-times"></i>
                </button>
              </div>

              <!-- Body -->
              <div class="email-card-body">
                <!-- Step Indicator -->
                <div class="step-indicator mb-3">
                  <div
                    class="step"
                    :class="{
                      active: !emailForm.isPasswordVerified,
                      completed: emailForm.isPasswordVerified,
                    }"
                  >
                    <div class="step-circle">
                      <i
                        v-if="emailForm.isPasswordVerified"
                        class="fa fa-check"
                      ></i>
                      <span v-else>1</span>
                    </div>
                    <span class="step-label">{{ $t("Verify") }}</span>
                  </div>
                  <div
                    class="step-line"
                    :class="{ active: emailForm.isPasswordVerified }"
                  ></div>
                  <div
                    class="step"
                    :class="{ active: emailForm.isPasswordVerified }"
                  >
                    <div class="step-circle">
                      <span>2</span>
                    </div>
                    <span class="step-label">{{ $t("New Email") }}</span>
                  </div>
                </div>

                <!-- Step 1: Password Verification -->
                <div v-if="!emailForm.isPasswordVerified" class="step-content">
                  <p class="text-muted small mb-3">
                    {{ $t("Enter your password to verify your identity") }}
                  </p>
                  <div class="modern-input-group">
                    <div class="input-wrapper">
                      <i class="fa fa-lock input-icon"></i>
                      <input
                        :value="emailForm.currentPassword"
                        @input="
                          updateEmailForm(
                            'currentPassword',
                            $event.target.value
                          )
                        "
                        :type="showEmailPassword ? 'text' : 'password'"
                        class="form-control modern-input"
                        :placeholder="$t('Enter your password')"
                      />
                      <button
                        class="toggle-password"
                        type="button"
                        @click="showEmailPassword = !showEmailPassword"
                      >
                        <i
                          class="fa"
                          :class="showEmailPassword ? 'fa-eye-slash' : 'fa-eye'"
                        ></i>
                      </button>
                    </div>
                    <button
                      class="btn btn-gradient"
                      @click="$emit('verify-password')"
                      :disabled="
                        !emailForm.currentPassword || isVerifyingPassword
                      "
                    >
                      <span v-if="isVerifyingPassword">
                        <i class="fa fa-spinner fa-spin me-1"></i>
                      </span>
                      <span v-else>
                        <i class="fa fa-arrow-right me-1"></i
                        >{{ $t("Continue") }}
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Step 2: Enter New Email -->
                <div v-else class="step-content">
                  <div class="success-badge mb-3">
                    <i class="fa fa-check-circle me-2"></i
                    >{{ $t("Identity verified") }}
                  </div>
                  <div class="modern-input-group">
                    <div class="input-wrapper">
                      <i class="fa fa-envelope input-icon"></i>
                      <input
                        :value="emailForm.newEmail"
                        @input="
                          updateEmailForm('newEmail', $event.target.value)
                        "
                        type="email"
                        class="form-control modern-input"
                        :placeholder="$t('Enter new email address')"
                      />
                    </div>
                    <button
                      class="btn btn-gradient-info"
                      @click="$emit('request-change-email')"
                      :disabled="!canSendEmailChange || isChangingEmail"
                    >
                      <span v-if="isChangingEmail">
                        <i class="fa fa-spinner fa-spin me-1"></i>
                      </span>
                      <span v-else>
                        <i class="fa fa-paper-plane me-1"></i>{{ $t("Send") }}
                      </span>
                    </button>
                  </div>
                  <small
                    v-if="
                      emailForm.newEmail && emailForm.newEmail === user.email
                    "
                    class="text-danger mt-2 d-block"
                  >
                    <i class="fa fa-exclamation-circle me-1"></i
                    >{{ $t("Cannot use current email") }}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <!-- Telepon -->
          <div class="info-row">
            <span class="info-label">{{ $t("Phone") }}</span>
            <div class="info-value">
              <input
                v-if="isEditing"
                type="text"
                class="form-control"
                :value="editForm.telp"
                @input="handleInput('telp', $event.target.value)"
                placeholder="08xxxxxxxx"
              />
              <span v-else>{{ user.telp || "-" }}</span>
            </div>
          </div>

          <!-- Alamat -->
          <div class="info-row">
            <span class="info-label">{{ $t("Address") }}</span>
            <div class="info-value">
              <textarea
                v-if="isEditing"
                class="form-control"
                :value="editForm.alamat"
                @input="handleInput('alamat', $event.target.value)"
                :placeholder="$t('Full address')"
                rows="2"
              ></textarea>
              <span v-else>{{ user.alamat || "-" }}</span>
            </div>
          </div>

          <!-- Provinsi (Edit only) -->
          <div class="info-row" v-if="isEditing">
            <span class="info-label">{{ $t("Province") }}</span>
            <div class="info-value">
              <select
                class="form-select"
                :value="editForm.kodepropinsi"
                @change="handleProvinceChange($event.target.value)"
                :disabled="provinceLoading"
              >
                <option value="" disabled>
                  {{ provinceLoading ? $t("Loading") : $t("Select Province") }}
                </option>
                <option
                  v-for="prov in provinceOptions"
                  :key="prov.idwilayah"
                  :value="prov.kodewilayah"
                >
                  {{ prov.kodewilayah }} - {{ prov.namawilayah }}
                </option>
              </select>
            </div>
          </div>

          <!-- Kabupaten -->
          <div class="info-row">
            <span class="info-label">{{ $t("District") }}</span>
            <div class="info-value">
              <template v-if="isEditing">
                <select
                  class="form-select"
                  :value="editForm.kodekabupaten"
                  @change="handleInput('kodekabupaten', $event.target.value)"
                  :disabled="!editForm.kodepropinsi || kabupatenLoading"
                >
                  <option value="" disabled>
                    {{
                      kabupatenLoading
                        ? $t("Loading")
                        : editForm.kodepropinsi
                        ? $t("Select District")
                        : $t("Select province first")
                    }}
                  </option>
                  <option
                    v-for="kab in kabupatenOptions"
                    :key="kab.idwilayah"
                    :value="kab.kodewilayah"
                  >
                    {{ kab.kodewilayah }} - {{ kab.namawilayah }}
                  </option>
                </select>
              </template>
              <span v-else>{{ user.kodekabupaten || "-" }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section: Employment (View only) -->
    <div class="card shadow-sm mb-4" v-if="!isEditing && userTypeName">
      <div class="card-header bg-white">
        <div class="d-flex align-items-center">
          <div class="section-icon bg-success">
            <i class="fa fa-briefcase"></i>
          </div>
          <h5 class="mb-0 ms-3">{{ $t("Employment") }}</h5>
        </div>
      </div>
      <div class="card-body">
        <div class="info-list">
          <div class="info-row">
            <span class="info-label">{{ $t("User Type") }}</span>
            <div class="info-value">
              <span>{{ userTypeName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons for Edit Mode -->
    <div class="d-flex justify-content-end gap-2 mt-4" v-if="isEditing">
      <button class="btn btn-outline-secondary" @click="handleCancel">
        {{ $t("Cancel") }}
      </button>
      <button
        class="btn btn-primary"
        @click="handleSubmit"
        :disabled="isSaving"
      >
        <span v-if="isSaving">
          <i class="fa fa-spinner fa-spin me-2"></i>{{ $t("Updating") }}...
        </span>
        <span v-else>{{ $t("Update Profile") }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { getGenders } from "@/services/referensi/genders";
import { getEmployeeTypes } from "@/services/referensi/employeeTypes";
import { getRegions } from "@/services/referensi/regions";
import { isASNUser } from "@/constants/userTypes";
import * as yup from "yup";

const { t } = useI18n();
const toast = useToast();

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
  editForm: {
    type: Object,
    required: true,
  },
  emailForm: {
    type: Object,
    default: () => ({
      currentPassword: "",
      newEmail: "",
      isPasswordVerified: false,
    }),
  },
  isVerifyingPassword: {
    type: Boolean,
    default: false,
  },
  isChangingEmail: {
    type: Boolean,
    default: false,
  },
  genderName: {
    type: String,
    default: null,
  },
  formattedBirthDate: {
    type: String,
    default: null,
  },
  userTypeName: {
    type: String,
    default: null,
  },
  employeeTypeName: {
    type: String,
    default: null,
  },
});

const emit = defineEmits([
  "start-editing",
  "cancel-editing",
  "update-profile",
  "update:editForm",
  "update:emailForm",
  "verify-password",
  "request-change-email",
  "reset-email-form",
]);

// State
const formErrors = reactive({});
const genderOptions = ref([]);
const employeeTypeOptions = ref([]);
const provinceOptions = ref([]);
const kabupatenOptions = ref([]);
const gendersLoading = ref(false);
const employeeTypesLoading = ref(false);
const provinceLoading = ref(false);
const kabupatenLoading = ref(false);
const interestInput = ref("");
const interestList = ref([]);
const showChangeEmail = ref(false);
const showEmailPassword = ref(false);

// Yup Validation Schema
const validationSchema = yup.object().shape({
  nama: yup.string().required(() => t("Full name is required")),
  nik: yup
    .string()
    .matches(/^[0-9]+$/, () => t("NIK must be numeric"))
    .length(16, () => t("NIK must be 16 digits"))
    .required(() => t("NIK is required")),
  email: yup
    .string()
    .email(() => t("Invalid email format"))
    .required(() => t("Email is required")),
});

// Computed
const isASN = computed(() => {
  return isASNUser(props.user.idjenispengguna);
});

const interestsList = computed(() => {
  if (!props.user.minat) return [];
  return props.user.minat
    .split(",")
    .map((i) => i.trim())
    .filter(Boolean);
});

// Computed to get employee type name from options (for auto-update after save)
const currentEmployeeTypeName = computed(() => {
  const id = props.user.idjenispegawai;
  if (!id) return null;
  const found = employeeTypeOptions.value.find(
    (et) => et.idjenispegawai === id
  );
  return found?.namajenispegawai || props.employeeTypeName || null;
});

const canSendEmailChange = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    props.emailForm.isPasswordVerified &&
    props.emailForm.newEmail &&
    emailRegex.test(props.emailForm.newEmail) &&
    props.emailForm.newEmail !== props.user.email
  );
});

// Watchers
watch(
  () => props.isEditing,
  (newVal) => {
    if (newVal) {
      // Parse minat
      if (props.editForm.minat) {
        interestList.value = props.editForm.minat
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
      } else {
        interestList.value = [];
      }

      // Fetch kabupaten based on kodepropinsi from editForm
      if (props.editForm.kodepropinsi) {
        fetchKabupaten(props.editForm.kodepropinsi);
      } else {
        kabupatenOptions.value = [];
      }
    }
  }
);

// Lifecycle
onMounted(() => {
  fetchGenders();
  fetchEmployeeTypes();
  fetchProvinces();

  // If user has kodekabupaten, extract kodepropinsi and fetch kabupaten
  if (props.user.kodekabupaten) {
    const kodeKab = props.user.kodekabupaten;
    const kodeProv = kodeKab.includes(".")
      ? kodeKab.split(".")[0]
      : kodeKab.substring(0, 2);
    if (kodeProv) {
      fetchKabupaten(kodeProv);
    }
  }
});

// Methods
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
    toast.error(t("Failed to load genders"));
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
    toast.error(t("Failed to load employee types"));
  } finally {
    employeeTypesLoading.value = false;
  }
}

async function fetchProvinces() {
  provinceLoading.value = true;
  try {
    const response = await getRegions({ filter: "tipewilayah=A", limit: 100 });
    provinceOptions.value =
      response.data?.[0]?.data || response.data?.data || [];
  } catch (error) {
    console.error(error);
    toast.error(t("Failed to load provinces"));
  } finally {
    provinceLoading.value = false;
  }
}

async function fetchKabupaten(provCode) {
  kabupatenLoading.value = true;
  kabupatenOptions.value = [];
  try {
    const response = await getRegions({
      filter: `tipewilayah=B,kodewilayah=${provCode}`,
      limit: 500,
    });
    kabupatenOptions.value =
      response.data?.[0]?.data || response.data?.data || [];
  } catch (error) {
    console.error(error);
    toast.error(t("Failed to load districts"));
  } finally {
    kabupatenLoading.value = false;
  }
}

function handleProvinceChange(value) {
  emit("update:editForm", {
    ...props.editForm,
    kodepropinsi: value,
    kodekabupaten: "",
  });
  if (value) {
    fetchKabupaten(value);
  } else {
    kabupatenOptions.value = [];
  }
}

function handleInput(field, value) {
  emit("update:editForm", { ...props.editForm, [field]: value });
  if (formErrors[field]) {
    formErrors[field] = "";
  }
}

async function validateField(field) {
  try {
    await validationSchema.validateAt(field, props.editForm);
    formErrors[field] = "";
  } catch (err) {
    formErrors[field] = err.message;
  }
}

async function validate() {
  try {
    await validationSchema.validate(props.editForm, { abortEarly: false });
    Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
    return true;
  } catch (err) {
    err.inner.forEach((e) => (formErrors[e.path] = e.message));
    return false;
  }
}

// Interest handlers
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
  emit("update:editForm", {
    ...props.editForm,
    minat: interestList.value.join(", "),
  });
}

function handleCancel() {
  Object.keys(formErrors).forEach((key) => (formErrors[key] = ""));
  interestList.value = [];
  interestInput.value = "";
  kabupatenOptions.value = [];
  emit("cancel-editing");
}

async function handleSubmit() {
  const isValid = await validate();
  if (isValid) {
    emit("update-profile");
  }
}

// Email change helpers
function updateEmailForm(field, value) {
  emit("update:emailForm", { ...props.emailForm, [field]: value });
}

function resetEmailChange() {
  showChangeEmail.value = false;
  showEmailPassword.value = false;
  emit("reset-email-form");
}

defineExpose({ validate });
</script>

<style scoped>
.section-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.info-list {
  display: flex;
  flex-direction: column;
}

/* Info Row Styles */
.info-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-row:first-child {
  padding-top: 0;
}

.info-label {
  flex: 0 0 160px;
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
  padding-top: 7px;
}

.info-value {
  flex: 1;
  font-size: 15px;
  color: #333;
  font-weight: 500;
  min-width: 0;
}

.info-value .form-control,
.info-value .form-select {
  font-size: 14px;
  width: 100% !important;
}

.invalid-feedback {
  display: block;
}

@media (max-width: 768px) {
  .info-row {
    flex-direction: column;
    gap: 8px;
  }

  .info-label {
    flex: none;
    width: 100%;
    padding-top: 0;
    margin-bottom: 4px;
  }

  .info-value {
    width: 100%;
  }
}

/* Interest Bubble Styles */
.interest-input-container {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  background-color: #fff;
  min-height: 60px;
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
  background-color: transparent;
  color: #15406a;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid #15406a;
  transition: all 0.2s ease;
}

.interest-bubble:hover {
  background-color: rgba(21, 64, 106, 0.1);
}

.bubble-remove {
  background: transparent;
  border: none;
  color: #15406a;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  font-size: 10px;
  transition: all 0.2s;
}

.bubble-remove:hover {
  background: #15406a;
  color: white;
}

/* View mode interest chip */
.interest-chip {
  display: inline-block;
  background-color: transparent;
  color: #15406a;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid #15406a;
}

.interest-input {
  border: none;
  outline: none;
  flex: 1;
  min-width: 150px;
  padding: 4px;
  font-size: 0.875rem;
}

.interest-input::placeholder {
  color: #adb5bd;
}

/* Modern Change Email Styles */
.change-email-modern {
  margin-left: -1rem;
  margin-right: -1rem;
}

.email-change-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(13, 110, 253, 0.15);
}

.email-card-header {
  background: #0d6efd;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.header-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.header-text h6 {
  color: white;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.email-card-body {
  padding: 20px;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e9ecef;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s;
}

.step.active .step-circle {
  background: #0d6efd;
  color: white;
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.4);
}

.step.completed .step-circle {
  background: #28a745;
  color: white;
}

.step-label {
  font-size: 11px;
  color: #6c757d;
  font-weight: 500;
}

.step.active .step-label,
.step.completed .step-label {
  color: #333;
}

.step-line {
  width: 60px;
  height: 3px;
  background: #e9ecef;
  border-radius: 2px;
  margin-bottom: 20px;
  transition: background 0.3s;
}

.step-line.active {
  background: #0d6efd;
}

/* Modern Input Group */
.modern-input-group {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.input-wrapper {
  flex: 1;
  position: relative;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 14px;
}

.modern-input {
  padding-left: 42px !important;
  padding-right: 42px !important;
  height: 44px;
  border-radius: 10px !important;
  border: 2px solid #e9ecef !important;
  transition: all 0.2s;
  font-size: 14px;
}

.modern-input:focus {
  border-color: #0d6efd !important;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15) !important;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
}

.toggle-password:hover {
  color: #333;
}

/* Primary Buttons */
.btn-gradient {
  background: #0d6efd;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-gradient:hover:not(:disabled) {
  background: #0b5ed7;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 110, 253, 0.4);
  color: white;
}

.btn-gradient:disabled {
  opacity: 1;
  background: #6c9bd1;
  cursor: not-allowed;
  color: white;
}

.btn-gradient-info {
  background: #0d6efd;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-gradient-info:hover:not(:disabled) {
  background: #0b5ed7;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 110, 253, 0.4);
  color: white;
}

.btn-gradient-info:disabled {
  opacity: 1;
  background: #6c9bd1;
  cursor: not-allowed;
  color: white;
}

/* Success Badge */
.success-badge {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

@media (max-width: 576px) {
  .modern-input-group {
    flex-direction: column;
  }

  .step-line {
    width: 40px;
  }
}
</style>
