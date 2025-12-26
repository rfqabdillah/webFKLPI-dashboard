<template>
  <div class="container-fluid account-page">
    <div class="row">
      <div class="col-12">
        <!-- Loading State with Skeleton -->
        <div v-if="isLoading" class="row g-4 align-items-start">
          <!-- Left Column Skeleton -->
          <div class="col-lg-4">
            <SkeletonGroup type="profile-card" />
          </div>
          <!-- Right Column Skeleton -->
          <div class="col-lg-8">
            <SkeletonGroup type="tab-content" :tab-count="6" />
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="card shadow-sm text-center py-5">
          <i class="fa fa-exclamation-circle text-danger fa-3x mb-3"></i>
          <h5 class="text-danger">{{ $t("Error") }}</h5>
          <p class="text-muted">{{ error }}</p>
          <button class="btn btn-primary btn-sm" @click="fetchUserProfile">
            <i class="fa fa-refresh me-2"></i>{{ $t("Try Again") }}
          </button>
        </div>

        <!-- Profile Content - 2 Column Layout -->
        <div v-else class="row g-4 align-items-start">
          <!-- LEFT COLUMN: Profile Card (Sticky) -->
          <div class="col-lg-4 sticky-column">
            <div class="card profile-sidebar shadow-sm">
              <!-- Banner -->
              <div class="sidebar-banner"></div>

              <div class="card-body text-center pt-0">
                <!-- Profile Photo -->
                <div class="profile-img-wrapper">
                  <div
                    v-if="!user.foto"
                    class="profile-img rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow"
                    :style="{ backgroundColor: getRandomColor(user.nama) }"
                  >
                    <span class="display-4">{{ getInitials(user.nama) }}</span>
                  </div>
                  <img
                    v-else
                    :src="user.foto"
                    alt="Profile"
                    class="profile-img rounded-circle shadow clickable-photo"
                    @error="handleImageError"
                    @click="openLightbox"
                  />

                  <!-- Photo Upload Button -->
                  <button
                    class="photo-upload-btn"
                    @click="triggerPhotoUpload"
                    :disabled="isUploadingPhoto"
                    :title="$t('Change Photo')"
                  >
                    <i
                      v-if="isUploadingPhoto"
                      class="fa fa-spinner fa-spin"
                    ></i>
                    <i v-else class="fa fa-camera"></i>
                  </button>

                  <!-- Hidden File Input -->
                  <input
                    ref="photoInputRef"
                    type="file"
                    accept="image/*"
                    class="d-none"
                    @change="handlePhotoUpload"
                  />
                </div>
                <!-- Lightbox for Photo Preview -->
                <Teleport to="body">
                  <VueEasyLightbox
                    :visible="lightboxVisible"
                    :imgs="lightboxImages"
                    :index="0"
                    @hide="lightboxVisible = false"
                  />
                </Teleport>

                <!-- Name & Role -->
                <h4 class="mt-3 mb-1 fw-bold">{{ fullName }}</h4>
                <p class="text-muted mb-2">
                  <i class="fa fa-id-badge me-1"></i>{{ userRole }}
                </p>
                <span
                  class="badge px-3 py-2"
                  :class="
                    user.status === 'Aktif' ? 'bg-success' : 'bg-secondary'
                  "
                >
                  {{ user.status || "Aktif" }}
                </span>

                <hr class="my-4" />

                <!-- Quick Contact Info -->
                <div class="quick-info">
                  <div class="quick-info-item">
                    <div class="quick-icon bg-primary-soft">
                      <i class="fa fa-envelope text-primary"></i>
                    </div>
                    <div class="quick-text">
                      <small class="text-muted">Email</small>
                      <span>{{ user.email || "-" }}</span>
                    </div>
                  </div>

                  <div class="quick-info-item">
                    <div class="quick-icon bg-success-soft">
                      <i class="fa fa-phone text-success"></i>
                    </div>
                    <div class="quick-text">
                      <small class="text-muted">{{ $t("Phone") }}</small>
                      <span>{{ user.telp || "-" }}</span>
                    </div>
                  </div>

                  <div class="quick-info-item">
                    <div class="quick-icon bg-info-soft">
                      <i class="fa fa-map-marker text-info"></i>
                    </div>
                    <div class="quick-text">
                      <small class="text-muted">{{ $t("Address") }}</small>
                      <span>{{ user.alamat || "-" }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: Tabs Content -->
          <div class="col-lg-8">
            <!-- Modern Chip Tabs -->
            <div class="chip-tabs-container">
              <div class="chip-tabs">
                <button
                  v-for="tab in visibleTabs"
                  :key="tab.key"
                  class="chip-tab"
                  :class="{ active: activeTab === tab.key }"
                  @click="activeTab = tab.key"
                >
                  <i :class="['fa', tab.icon]"></i>
                  <span>{{ $t(tab.labelKey) }}</span>
                </button>
              </div>
            </div>

            <!-- TAB: Basic Info -->
            <BasicInfoTab
              v-show="activeTab === 'basic'"
              :user="user"
              :is-editing="isEditing"
              :is-saving="isSaving"
              :edit-form="editForm"
              :email-form="emailForm"
              :is-verifying-password="isVerifyingPassword"
              :is-changing-email="isChangingEmail"
              :gender-name="genderName"
              :formatted-birth-date="formattedBirthDate"
              :user-type-name="userTypeName"
              :employee-type-name="employeeTypeName"
              @start-editing="startEditing"
              @cancel-editing="cancelEditing"
              @update-profile="updateProfile"
              @update:edit-form="Object.assign(editForm, $event)"
              @update:email-form="Object.assign(emailForm, $event)"
              @verify-password="verifyPasswordForEmail"
              @request-change-email="requestChangeEmail"
              @reset-email-form="resetEmailForm"
            />

            <!-- TAB: Security -->
            <SecurityTab
              v-show="activeTab === 'security'"
              :user="user"
              :password-form="passwordForm"
              :email-form="emailForm"
              :is-changing-password="isChangingPassword"
              :is-verifying-password="isVerifyingPassword"
              :is-changing-email="isChangingEmail"
              :can-change-password="canChangePassword"
              :can-change-email="canChangeEmail"
              @change-password="changePassword"
              @verify-password="verifyPasswordForEmail"
              @reset-email-form="resetEmailForm"
              @request-change-email="requestChangeEmail"
              @update:password-form="Object.assign(passwordForm, $event)"
              @update:email-form="Object.assign(emailForm, $event)"
            />

            <!-- ASN-only Tabs -->
            <!-- TAB: Unit Kerja -->
            <UnitKerjaTab
              v-if="isASN"
              v-show="activeTab === 'unitkerja'"
              :current-user-id="currentUserId"
              :should-load="visitedTabs.has('unitkerja')"
            />

            <!-- TAB: Jabatan -->
            <JabatanTab
              v-if="isASN"
              v-show="activeTab === 'jabatan'"
              :current-user-id="currentUserId"
              :should-load="visitedTabs.has('jabatan')"
            />

            <!-- TAB: Pangkat -->
            <PangkatTab
              v-if="isASN"
              v-show="activeTab === 'pangkat'"
              :current-user-id="currentUserId"
              :should-load="visitedTabs.has('pangkat')"
            />

            <!-- TAB: Pekerjaan -->
            <PekerjaanTab
              v-show="activeTab === 'pekerjaan'"
              :current-user-id="currentUserId"
              :should-load="visitedTabs.has('pekerjaan')"
            />

            <!-- TAB: Pendidikan -->
            <PendidikanTab
              v-show="activeTab === 'pendidikan'"
              :current-user-id="currentUserId"
              :should-load="visitedTabs.has('pendidikan')"
            />

            <!-- TAB: Pelatihan -->
            <PelatihanTab
              v-show="activeTab === 'pelatihan'"
              :current-user-id="currentUserId"
              :should-load="visitedTabs.has('pelatihan')"
            />

            <!-- TAB: Prestasi -->
            <PrestasiTab
              v-show="activeTab === 'prestasi'"
              :current-user-id="currentUserId"
              :should-load="visitedTabs.has('prestasi')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from "vue";
import { getDetailUser, updateUser } from "@/services/referensi/users";
import { getInitials, getRandomColor } from "@/utils/avatarUtils";
import { compressImage } from "@/utils/imageCompressor";
import { formatDate } from "@/utils/formatDate";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { login } from "@/services/auth";
import { NON_ASN_ID } from "@/constants/userTypes";
import Swal from "sweetalert2";
import apiClient from "@/services/users";
import VueEasyLightbox from "vue-easy-lightbox";
import { SkeletonGroup } from "@/components/base/default/SkeletonLoader";
import {
  BasicInfoTab,
  SecurityTab,
  PendidikanTab,
  PekerjaanTab,
  PelatihanTab,
  PrestasiTab,
  UnitKerjaTab,
  JabatanTab,
  PangkatTab,
} from "./tabs";
const { t, locale } = useI18n();
const toast = useToast();

// === Constants ===
const MAX_FILE_SIZE_MB = 10;

const PROFILE_FIELDS = [
  "nama",
  "gelardepan",
  "gelarbelakang",
  "nik",
  "nip",
  "no_karpeg",
  "email",
  "telp",
  "alamat",
  "kodekabupaten",
  "tempatlahir",
  "tanggallahir",
  "minat",
  "idjeniskelamin",
  "idjenispegawai",
];

const TAB_CONFIG = [
  { key: "basic", icon: "fa-user", labelKey: "Basic Info", asnOnly: false },
  { key: "security", icon: "fa-shield", labelKey: "Security", asnOnly: false },
  {
    key: "unitkerja",
    icon: "fa-building",
    labelKey: "Work Unit",
    asnOnly: true,
  },
  { key: "jabatan", icon: "fa-id-badge", labelKey: "Position", asnOnly: true },
  { key: "pangkat", icon: "fa-star", labelKey: "Rank", asnOnly: true },
  {
    key: "pekerjaan",
    icon: "fa-briefcase",
    labelKey: "Work Experience",
    asnOnly: false,
  },
  {
    key: "pendidikan",
    icon: "fa-graduation-cap",
    labelKey: "Education",
    asnOnly: false,
  },
  {
    key: "pelatihan",
    icon: "fa-certificate",
    labelKey: "Training",
    asnOnly: false,
  },
  {
    key: "prestasi",
    icon: "fa-trophy",
    labelKey: "Achievements",
    asnOnly: false,
  },
];

// === State ===
const user = ref({});
const isLoading = ref(true);
const error = ref(null);
const isEditing = ref(false);
const isSaving = ref(false);

// Tab state
const activeTab = ref("basic");
const visitedTabs = ref(new Set(["basic"])); // Track visited tabs for lazy loading

// Watch activeTab to track visited tabs
watch(activeTab, (newTab) => {
  visitedTabs.value.add(newTab);
});

// Photo upload state
const photoInputRef = ref(null);
const isUploadingPhoto = ref(false);

// Lightbox state
const lightboxVisible = ref(false);
const lightboxImages = computed(() => {
  return user.value.foto ? [user.value.foto] : [];
});

const openLightbox = () => {
  if (user.value.foto) {
    lightboxVisible.value = true;
  }
};

// Password change state
const isChangingPassword = ref(false);

// Email change state
const isVerifyingPassword = ref(false);
const isChangingEmail = ref(false);

// Email form
const emailForm = reactive({
  currentPassword: "",
  newEmail: "",
  isPasswordVerified: false,
});

// Edit form
const editForm = reactive({
  nama: "",
  gelardepan: "",
  gelarbelakang: "",
  nik: "",
  nip: "",
  no_karpeg: "",
  email: "",
  telp: "",
  alamat: "",
  kodepropinsi: "",
  kodekabupaten: "",
  tempatlahir: "",
  tanggallahir: "",
  minat: "",
  idjeniskelamin: "",
  idjenispegawai: "",
});

// Password form
const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Password validation
const canChangePassword = computed(() => {
  return (
    passwordForm.currentPassword &&
    passwordForm.newPassword &&
    passwordForm.newPassword.length >= 6 &&
    passwordForm.confirmPassword &&
    passwordForm.newPassword === passwordForm.confirmPassword
  );
});

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const canChangeEmail = computed(() => {
  return (
    emailForm.isPasswordVerified &&
    emailForm.newEmail &&
    isValidEmail(emailForm.newEmail) &&
    emailForm.newEmail !== user.value.email
  );
});

// === Computed Properties ===
const isASN = computed(() => {
  return user.value.idjenispengguna !== NON_ASN_ID;
});

// Visible tabs based on user type
const visibleTabs = computed(() => {
  return TAB_CONFIG.filter((tab) => !tab.asnOnly || isASN.value);
});

const currentUserId = computed(() => {
  return user.value.id_pengguna || user.value.idpengguna || "";
});

const fullName = computed(() => {
  const parts = [user.value.gelardepan, user.value.nama].filter(Boolean);
  let name = parts.join(" ");
  if (user.value.gelarbelakang) {
    name += `, ${user.value.gelarbelakang}`;
  }
  return name || t("User");
});

const userRole = computed(() => {
  return user.value.roles?.[0]?.namalevel || user.value.nama_level || t("User");
});

const genderName = computed(() => {
  return (
    user.value.genders?.[0]?.namajeniskelamin ||
    user.value["jenis-kelamin"]?.namajeniskelamin ||
    null
  );
});

const userTypeName = computed(() => {
  return user.value["user-types"]?.[0]?.namajenispengguna || null;
});

const employeeTypeName = computed(() => {
  return user.value["employee-types"]?.[0]?.namajenispegawai || null;
});

const formattedBirthDate = computed(() => {
  const date = user.value.tanggallahir || user.value.tanggal_lahir;
  return date ? formatDate(date, locale.value) : null;
});

// Methods
// Helper: Parse user data from response
const parseUserData = (response) => {
  if (!response?.data) return null;

  if (Array.isArray(response.data)) {
    return response.data[0]?.data?.[0] || response.data[0];
  }

  if (response.data.data) {
    return Array.isArray(response.data.data)
      ? response.data.data[0]
      : response.data.data;
  }

  return response.data;
};

// Start of Methods
const fetchUserProfile = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const userDataStr = localStorage.getItem("userData");
    if (!userDataStr) throw new Error(t("User data not found"));

    const parsed = JSON.parse(userDataStr);
    const userId =
      parsed.data?.[0]?.id_pengguna || parsed.data?.[0]?.idpengguna;

    if (!userId) throw new Error(t("User ID not found"));

    const response = await getDetailUser(userId);
    const userData = parseUserData(response);

    if (userData) {
      user.value = userData;
    }
  } catch (err) {
    console.error("Error fetching user profile:", err);
    error.value = err.message || t("Failed to load profile data");
  } finally {
    isLoading.value = false;
  }
};

const startEditing = () => {
  editForm.nama = user.value.nama || "";
  editForm.gelardepan = user.value.gelardepan || "";
  editForm.gelarbelakang = user.value.gelarbelakang || "";
  editForm.nik = user.value.nik || "";
  editForm.nip = user.value.nip || "";
  editForm.no_karpeg = user.value.no_karpeg || "";
  editForm.email = user.value.email || "";
  editForm.telp = user.value.telp || "";
  editForm.alamat = user.value.alamat || "";

  const kodeKab = user.value.kodekabupaten || "";
  editForm.kodekabupaten = kodeKab;
  editForm.kodepropinsi = kodeKab.includes(".")
    ? kodeKab.split(".")[0]
    : kodeKab.substring(0, 2);
  editForm.tempatlahir = user.value.tempatlahir || "";
  editForm.tanggallahir = user.value.tanggallahir || "";
  editForm.minat = user.value.minat || "";
  editForm.idjeniskelamin = user.value.idjeniskelamin || "";
  editForm.idjenispegawai = user.value.idjenispegawai || "";
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const updateProfile = async () => {
  const result = await Swal.fire({
    title: t("Confirm Update"),
    text: t("Are you sure you want to update your profile?"),
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#0d6efd",
    cancelButtonColor: "#efefef",
    confirmButtonText: t("Yes, Update"),
    cancelButtonText: t("No"),
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  isSaving.value = true;

  try {
    const userId = user.value.id_pengguna || user.value.idpengguna;

    const formData = new FormData();
    PROFILE_FIELDS.forEach((field) => {
      formData.append(`record[${field}]`, editForm[field] || "");
    });
    formData.append("_method", "PUT");

    await updateUser(userId, formData);

    PROFILE_FIELDS.forEach((field) => {
      user.value[field] = editForm[field];
    });

    updateLocalStorage({
      nama: editForm.nama,
      email: editForm.email,
      telp: editForm.telp,
    });

    toast.success(t("Profile updated successfully"));
    isEditing.value = false;
  } catch (err) {
    console.error("Error saving profile:", err);
    toast.error(t("Failed to save profile"));
  } finally {
    isSaving.value = false;
  }
};

const updateLocalStorage = (updates = {}) => {
  const userDataStr = localStorage.getItem("userData");
  if (!userDataStr) return;

  try {
    const parsed = JSON.parse(userDataStr);
    if (parsed.data?.[0]) {
      Object.assign(parsed.data[0], updates);
      localStorage.setItem("userData", JSON.stringify(parsed));
      window.dispatchEvent(new CustomEvent("userDataUpdated"));
    }
  } catch (e) {
    console.error("Error updating local storage:", e);
  }
};

const handleImageError = () => {
  user.value.foto = null;
};

const triggerPhotoUpload = () => {
  if (photoInputRef.value) {
    photoInputRef.value.click();
  }
};

const handlePhotoUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error(t("Please select an image file"));
    return;
  }

  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    toast.error(t("File size exceeds 10MB limit"));
    return;
  }

  isUploadingPhoto.value = true;

  try {
    const compressedFile = await compressImage(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      initialQuality: 0.8,
    });

    const userId = user.value.id_pengguna || user.value.idpengguna;
    const formData = new FormData();
    formData.append("upload_foto", compressedFile, file.name);
    formData.append("_method", "PUT");

    await updateUser(userId, formData);
    await fetchUserProfile();
    updateLocalStorage({ foto: user.value.foto });

    toast.success(t("Profile photo updated successfully"));
  } catch (err) {
    console.error("Error uploading photo:", err);
    toast.error(t("Failed to upload photo"));
  } finally {
    isUploadingPhoto.value = false;
    if (photoInputRef.value) {
      photoInputRef.value.value = "";
    }
  }
};

const changePassword = async () => {
  if (!canChangePassword.value) return;

  const result = await Swal.fire({
    title: t("Change Password"),
    text: t("Are you sure you want to change your password?"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ffc107",
    cancelButtonColor: "#efefef",
    confirmButtonText: t("Yes, Change"),
    cancelButtonText: t("Cancel"),
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  isChangingPassword.value = true;

  try {
    try {
      await login(user.value.email, passwordForm.currentPassword);
    } catch (loginError) {
      toast.error(t("Current password is incorrect"));
      isChangingPassword.value = false;
      return;
    }

    const userId = user.value.id_pengguna || user.value.idpengguna;
    const formData = new FormData();
    formData.append("record[password]", passwordForm.newPassword);
    formData.append("_method", "PUT");

    await updateUser(userId, formData);

    // Clear form
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";

    toast.success(t("Password changed successfully"));

    await Swal.fire({
      title: t("Success"),
      text: t("Your password has been changed successfully"),
      icon: "success",
      confirmButtonColor: "#0d6efd",
    });
  } catch (err) {
    console.error("Error changing password:", err);
    toast.error(t("Failed to change password"));
  } finally {
    isChangingPassword.value = false;
  }
};

// Verify password for email change
const verifyPasswordForEmail = async () => {
  if (!emailForm.currentPassword) return;

  isVerifyingPassword.value = true;

  try {
    await login(user.value.email, emailForm.currentPassword);

    // Password verified successfully
    emailForm.isPasswordVerified = true;
    toast.success(t("Password verified successfully"));
  } catch (err) {
    console.error("Password verification failed:", err);
    toast.error(t("Current password is incorrect"));
  } finally {
    isVerifyingPassword.value = false;
  }
};

// Request email change
const requestChangeEmail = async () => {
  if (!canChangeEmail.value) return;

  const result = await Swal.fire({
    title: t("Change Email"),
    text: t(
      "A verification link will be sent to your new email address. Do you want to continue?"
    ),
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#17a2b8",
    cancelButtonColor: "#efefef",
    confirmButtonText: t("Yes, Send Verification"),
    cancelButtonText: t("Cancel"),
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  isChangingEmail.value = true;

  try {
    const fd = new FormData();
    fd.append("email", emailForm.newEmail);

    await apiClient.post("/change-email", fd);

    resetEmailForm();

    await Swal.fire({
      title: t("Verification Email Sent"),
      text: t(
        "Please check your new email address and click the verification link to complete the email change."
      ),
      icon: "success",
      confirmButtonColor: "#0d6efd",
    });
  } catch (err) {
    console.error("Error requesting email change:", err);

    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      t("Failed to request email change");

    toast.error(message);
  } finally {
    isChangingEmail.value = false;
  }
};

// Reset email form
const resetEmailForm = () => {
  emailForm.currentPassword = "";
  emailForm.newEmail = "";
  emailForm.isPasswordVerified = false;
};

// === Lifecycle ===
onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
.account-page {
  padding-top: 1rem;
  padding-bottom: 2rem;
}

.account-page {
  padding-top: 1rem;
  padding-bottom: 2rem;
  overflow: visible;
}

.nav-tabs {
  border-bottom: none;
  gap: 10px;
}

.nav-tabs .nav-link {
  border: none;
  background: transparent;
  color: #6c757d;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-tabs .nav-link:hover {
  color: #0d6efd;
  background: rgba(13, 110, 253, 0.1);
}

.nav-tabs .nav-link.active {
  background: #0d6efd;
  color: white !important;
  border: none;
}

.nav-tabs .nav-link.active i {
  color: white;
}

.profile-sidebar {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.sidebar-banner {
  height: 100px;
  background-color: #05e8ba;
  background-image: linear-gradient(315deg, #05e8ba 0%, #087ee1 74%);
}

.profile-img-wrapper {
  margin-top: -60px;
}

.profile-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: white;
}

.profile-img-wrapper {
  position: relative;
  display: inline-block;
}

.photo-upload-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
  border: 3px solid white;
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.4);
}

.photo-upload-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.5);
}

.photo-upload-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.clickable-photo {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clickable-photo:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.quick-info {
  text-align: left;
}

.quick-info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.quick-info-item:last-child {
  border-bottom: none;
}

.quick-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bg-primary-soft {
  background-color: rgba(13, 110, 253, 0.1);
}

.bg-success-soft {
  background-color: rgba(40, 167, 69, 0.1);
}

.bg-info-soft {
  background-color: rgba(23, 162, 184, 0.1);
}

.quick-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.quick-text small {
  font-size: 12px;
  margin-bottom: 2px;
}

.quick-text span {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  word-break: break-word;
}

.card {
  border: none;
  border-radius: 12px;
}

.card-header {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 20px;
}

.card-header h5 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

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

.card-body {
  padding: 20px;
}

.info-list {
  display: flex;
  flex-direction: column;
}

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
}

.info-value {
  flex: 1;
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.info-value .form-control {
  font-size: 14px;
}

@media (max-width: 991px) {
  .profile-sidebar {
    margin-bottom: 20px;
  }

  .sidebar-banner {
    height: 80px;
  }

  .profile-img-wrapper {
    margin-top: -50px;
  }

  .profile-img {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 576px) {
  .info-row {
    flex-direction: column;
    gap: 6px;
  }

  .info-label {
    flex: none;
  }
}

/* Sticky Sidebar CSS */
@media (min-width: 992px) {
  .sticky-column {
    position: -webkit-sticky;
    position: sticky;
    top: 100px;
    z-index: 5;
    height: fit-content;
    align-self: flex-start;
  }
}

.chip-tabs-container {
  margin-bottom: 20px;
}

.chip-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 50px;
  border: 1px solid #e0e0e0;
  background: #ffffff;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.chip-tab:hover {
  border-color: #15406a;
  color: #15406a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(21, 64, 106, 0.15);
}

.chip-tab.active {
  background: linear-gradient(135deg, #15406a 0%, #0f2d4a 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(21, 64, 106, 0.35);
}

.chip-tab.active:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(21, 64, 106, 0.4);
}

.chip-tab i {
  font-size: 14px;
}

@media (max-width: 768px) {
  .chip-tab {
    padding: 8px 14px;
    font-size: 13px;
  }

  .chip-tab span {
    display: none;
  }
}
</style>
