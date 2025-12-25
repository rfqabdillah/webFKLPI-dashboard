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
            <!-- Tab Navigation (DRY: using v-for loop) -->
            <ul class="nav nav-tabs mb-4 flex-wrap" role="tablist">
              <li
                v-for="tab in visibleTabs"
                :key="tab.key"
                class="nav-item"
                role="presentation"
              >
                <button
                  class="nav-link"
                  :class="{ active: activeTab === tab.key }"
                  @click="activeTab = tab.key"
                  type="button"
                >
                  <i :class="['fa', tab.icon, 'me-2']"></i
                  >{{ $t(tab.labelKey) }}
                </button>
              </li>
            </ul>

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

            <!-- TAB: Pendidikan -->
            <PendidikanTab
              v-show="activeTab === 'pendidikan'"
              :current-user-id="currentUserId"
            />

            <!-- TAB: Pekerjaan -->
            <PekerjaanTab
              v-show="activeTab === 'pekerjaan'"
              :current-user-id="currentUserId"
            />

            <!-- TAB: Pelatihan -->
            <PelatihanTab
              v-show="activeTab === 'pelatihan'"
              :current-user-id="currentUserId"
            />

            <!-- TAB: Prestasi -->
            <PrestasiTab
              v-show="activeTab === 'prestasi'"
              :current-user-id="currentUserId"
            />

            <!-- ASN-only Tabs -->
            <!-- TAB: Unit Kerja -->
            <UnitKerjaTab
              v-if="isASN"
              v-show="activeTab === 'unitkerja'"
              :current-user-id="currentUserId"
            />

            <!-- TAB: Jabatan -->
            <JabatanTab
              v-if="isASN"
              v-show="activeTab === 'jabatan'"
              :current-user-id="currentUserId"
            />

            <!-- TAB: Pangkat -->
            <PangkatTab
              v-if="isASN"
              v-show="activeTab === 'pangkat'"
              :current-user-id="currentUserId"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
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

// === Tab Configuration (DRY) ===
const tabConfig = [
  { key: "basic", icon: "fa-user", labelKey: "Basic Info", asnOnly: false },
  { key: "security", icon: "fa-shield", labelKey: "Security", asnOnly: false },
  {
    key: "pendidikan",
    icon: "fa-graduation-cap",
    labelKey: "Education",
    asnOnly: false,
  },
  {
    key: "pekerjaan",
    icon: "fa-briefcase",
    labelKey: "Work Experience",
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
  {
    key: "unitkerja",
    icon: "fa-building",
    labelKey: "Work Unit",
    asnOnly: true,
  },
  { key: "jabatan", icon: "fa-id-badge", labelKey: "Position", asnOnly: true },
  { key: "pangkat", icon: "fa-star", labelKey: "Rank", asnOnly: true },
];

// === State ===
const user = ref({});
const isLoading = ref(true);
const error = ref(null);
const isEditing = ref(false);
const isSaving = ref(false);

// Tab state
const activeTab = ref("basic");

// Photo upload state
const photoInputRef = ref(null);
const isUploadingPhoto = ref(false);
const MAX_FILE_SIZE_MB = 10;

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
  return tabConfig.filter((tab) => !tab.asnOnly || isASN.value);
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
const fetchUserProfile = async () => {
  isLoading.value = true;
  error.value = null;

  const userDataStr = localStorage.getItem("userData");
  if (!userDataStr) {
    error.value = t("User data not found");
    isLoading.value = false;
    return;
  }

  try {
    const parsed = JSON.parse(userDataStr);
    const userId =
      parsed.data?.[0]?.id_pengguna || parsed.data?.[0]?.idpengguna;

    if (!userId) {
      error.value = t("User ID not found");
      isLoading.value = false;
      return;
    }

    const response = await getDetailUser(userId);

    if (response?.data) {
      let userData = null;
      if (Array.isArray(response.data)) {
        userData = response.data[0]?.data?.[0] || response.data[0];
      } else if (response.data.data) {
        userData = Array.isArray(response.data.data)
          ? response.data.data[0]
          : response.data.data;
      } else {
        userData = response.data;
      }

      if (userData) {
        user.value = userData;
      }
    }
  } catch (err) {
    console.error("Error fetching user profile:", err);
    error.value = t("Failed to load profile data");
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
  // Extract kodepropinsi from kodekabupaten
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

    // Fields to update
    const profileFields = [
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

    // Build FormData
    const formData = new FormData();
    profileFields.forEach((field) => {
      formData.append(`record[${field}]`, editForm[field] || "");
    });
    formData.append("_method", "PUT");

    await updateUser(userId, formData);

    // Update local user data using Object.assign
    profileFields.forEach((field) => {
      user.value[field] = editForm[field];
    });

    // Update localStorage
    updateLocalStorage();

    toast.success(t("Profile updated successfully"));
    isEditing.value = false;
  } catch (err) {
    console.error("Error saving profile:", err);
    toast.error(t("Failed to save profile"));
  } finally {
    isSaving.value = false;
  }
};

// Helper: Update localStorage with current user data
const updateLocalStorage = () => {
  const userDataStr = localStorage.getItem("userData");
  if (userDataStr) {
    const parsed = JSON.parse(userDataStr);
    if (parsed.data?.[0]) {
      Object.assign(parsed.data[0], {
        nama: editForm.nama,
        email: editForm.email,
        telp: editForm.telp,
      });
      localStorage.setItem("userData", JSON.stringify(parsed));
      window.dispatchEvent(new CustomEvent("userDataUpdated"));
    }
  }
};

const handleImageError = () => {
  user.value.foto = null;
};

// === Photo Upload Functions ===
const triggerPhotoUpload = () => {
  if (photoInputRef.value) {
    photoInputRef.value.click();
  }
};

const handlePhotoUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    toast.error(t("Please select an image file"));
    return;
  }

  // Validate file size (max 10MB)
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    toast.error(t("File size exceeds 10MB limit"));
    return;
  }

  isUploadingPhoto.value = true;

  try {
    // Compress image
    const compressedFile = await compressImage(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      initialQuality: 0.8,
    });

    // Create FormData for upload
    const userId = user.value.id_pengguna || user.value.idpengguna;
    const formData = new FormData();
    formData.append("upload_foto", compressedFile, file.name);
    formData.append("_method", "PUT");

    await updateUser(userId, formData);

    // Refresh user data to get new photo URL
    await fetchUserProfile();

    // Update localStorage with new photo
    const userDataStr = localStorage.getItem("userData");
    if (userDataStr) {
      const parsed = JSON.parse(userDataStr);
      if (parsed.data?.[0]) {
        parsed.data[0].foto = user.value.foto;
        localStorage.setItem("userData", JSON.stringify(parsed));
        window.dispatchEvent(new CustomEvent("userDataUpdated"));
      }
    }

    toast.success(t("Profile photo updated successfully"));
  } catch (err) {
    console.error("Error uploading photo:", err);
    toast.error(t("Failed to upload photo"));
  } finally {
    isUploadingPhoto.value = false;
    // Reset file input
    if (photoInputRef.value) {
      photoInputRef.value.value = "";
    }
  }
};

// Change Password
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
    // First verify current password by attempting login
    try {
      await login(user.value.email, passwordForm.currentPassword);
    } catch (loginError) {
      toast.error(t("Current password is incorrect"));
      isChangingPassword.value = false;
      return;
    }

    // If login successful, update password
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

/* Modern Tab Navigation */
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

/* Sticky Left Column - maintains position and size naturally */
.sticky-column {
  position: sticky;
  top: 100px;
  height: fit-content;
}

/* Left Sidebar Card */
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

/* Photo Upload Button */
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

/* Clickable Photo for Lightbox */
.clickable-photo {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clickable-photo:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Quick Info Items */
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

/* Right Column Cards */
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

/* Info List */
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

/* Responsive */
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
</style>
