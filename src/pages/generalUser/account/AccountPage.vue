<template>
  <div class="container-fluid account-page">
    <div class="row">
      <div class="col-12">
        <!-- Loading State with Skeleton -->
        <div v-if="isLoading" class="row g-4 align-items-start">
          <div class="col-lg-4">
            <SkeletonGroup type="profile-card" />
          </div>
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
          <!-- Left Column: Sidebar -->
          <AccountSidebar
            :user="user"
            :is-uploading-photo="isUploadingPhoto"
            @upload-photo="handlePhotoUpload"
            @image-error="handleImageError"
          />

          <!-- Right Column: Content -->
          <AccountContent
            v-model:active-tab="activeTab"
            :user="user"
            :is-editing="isEditing"
            :is-saving="isSaving"
            :edit-form="editForm"
            :email-form="emailForm"
            :password-form="passwordForm"
            :is-verifying-password="isVerifyingPassword"
            :is-changing-email="isChangingEmail"
            :is-changing-password="isChangingPassword"
            :can-change-password="canChangePassword"
            :can-change-email="canChangeEmail"
            :gender-name="genderName"
            :formatted-birth-date="formattedBirthDate"
            :user-type-name="userTypeName"
            :employee-type-name="employeeTypeName"
            :visited-tabs="visitedTabs"
            :is-a-s-n="isASN"
            :current-user-id="currentUserId"
            @start-editing="startEditing"
            @cancel-editing="cancelEditing"
            @update-profile="updateProfile"
            @update:edit-form="Object.assign(editForm, $event)"
            @update:email-form="Object.assign(emailForm, $event)"
            @update:password-form="Object.assign(passwordForm, $event)"
            @verify-password="verifyPasswordForEmail"
            @request-change-email="requestChangeEmail"
            @reset-email-form="resetEmailForm"
            @change-password="changePassword"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from "vue";
import { getDetailUser, updateUser } from "@/services/referensi/users";
import { compressImage } from "@/utils/imageCompressor";
import { formatDate } from "@/utils/formatDate";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { login } from "@/services/auth";
import { NON_ASN_ID } from "@/constants/userTypes";
import Swal from "sweetalert2";
import apiClient from "@/services/users";
import * as yup from "yup";
import { SkeletonGroup } from "@/components/base/default/SkeletonLoader";

// New Components
import AccountSidebar from "./components/AccountSidebar.vue";
import AccountContent from "./components/AccountContent.vue";

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
  "keahlian",
  "idjeniskelamin",
  "idjenispegawai",
];

// === State ===
const user = ref({});
const isLoading = ref(true);
const error = ref(null);
const isEditing = ref(false);
const isSaving = ref(false);
const activeTab = ref("basic");
const visitedTabs = ref(new Set(["basic"]));
const isUploadingPhoto = ref(false);

const isChangingPassword = ref(false);
const isVerifyingPassword = ref(false);
const isChangingEmail = ref(false);

const emailForm = reactive({
  currentPassword: "",
  newEmail: "",
  isPasswordVerified: false,
});

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
  keahlian: "",
  idjeniskelamin: "",
  idjenispegawai: "",
});

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

watch(activeTab, (newTab) => {
  visitedTabs.value.add(newTab);
});

// Computed Properties
const canChangePassword = computed(() => {
  return (
    passwordForm.currentPassword &&
    passwordForm.newPassword &&
    passwordForm.newPassword.length >= 6 &&
    passwordForm.confirmPassword &&
    passwordForm.newPassword === passwordForm.confirmPassword
  );
});

const canChangeEmail = computed(() => {
  try {
    return (
      emailForm.isPasswordVerified &&
      emailForm.newEmail &&
      emailForm.newEmail !== user.value.email &&
      yup.string().email().isValidSync(emailForm.newEmail)
    );
  } catch (e) {
    return false;
  }
});

const isASN = computed(() => {
  return user.value.idjenispengguna !== NON_ASN_ID;
});

const currentUserId = computed(() => {
  return user.value.id_pengguna || user.value.idpengguna || "";
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
  editForm.keahlian = user.value.keahlian || "";
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

const handlePhotoUpload = async (file) => {
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
      "A verification link will be sent to your new email address. Do you want to continue?",
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
        "Please check your new email address and click the verification link to complete the email change.",
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
  overflow: visible;
}
</style>
