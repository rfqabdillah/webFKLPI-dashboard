<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 p-0">
          <div class="login-card">
            <div>
              <div class="text-center mb-4">
                <a class="logo d-inline-block">
                  <img
                    v-if="dynamicLogoUrl && !isLoadingLogo"
                    class="img-fluid for-light"
                    :src="dynamicLogoUrl"
                    :alt="appName"
                    style="width: 110px; height: 110px; object-fit: contain"
                    @error="handleImageError"
                  />

                  <div
                    v-else-if="isLoadingLogo"
                    class="d-flex align-items-center justify-content-center bg-light rounded shadow-sm mx-auto"
                    style="
                      width: 110px;
                      height: 110px;
                      border: 1px solid #dee2e6;
                    "
                  >
                    <div
                      class="spinner-border text-primary"
                      role="status"
                      style="width: 2.5rem; height: 2.5rem"
                    >
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>

                  <div
                    v-else
                    class="d-flex align-items-center justify-content-center bg-light rounded shadow-sm mx-auto"
                    style="
                      width: 110px;
                      height: 110px;
                      border: 1px solid #dee2e6;
                    "
                  >
                    <span
                      class="fw-bold text-secondary"
                      style="
                        font-size: 24px;
                        letter-spacing: 2px;
                        user-select: none;
                      "
                    >
                      LOGO
                    </span>
                  </div>
                </a>
              </div>
              <div class="login-main">
                <Form
                  class="theme-form"
                  :validation-schema="schema"
                  @submit="onSubmit"
                  v-slot="{ errors }"
                >
                  <h4>Buat akun Anda</h4>
                  <p>Masukkan detail pribadi Anda untuk membuat akun</p>

                  <div class="form-group">
                    <label class="col-form-label">Nama</label>
                    <Field
                      name="nama"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.nama }"
                      placeholder="Nama Lengkap"
                      v-model="form.nama"
                    />
                    <span class="validate-error">{{ errors.nama }}</span>
                  </div>

                  <div class="form-group">
                    <label class="col-form-label">Nomor HP</label>
                    <Field
                      name="telp"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.telp }"
                      placeholder="Nomor HP"
                      v-model="form.telp"
                    />
                    <span class="validate-error">{{ errors.telp }}</span>
                  </div>

                  <div class="form-group">
                    <label class="col-form-label">Email</label>
                    <Field
                      name="email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors.email }"
                      placeholder="email@gmail.com"
                      v-model="form.email"
                    />
                    <span class="validate-error">{{ errors.email }}</span>
                  </div>

                  <div class="form-group">
                    <label class="col-form-label">Password</label>
                    <div class="d-flex password-group">
                      <Field
                        name="password"
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control password-input"
                        :class="{ 'is-invalid': errors.password }"
                        placeholder="*********"
                        v-model="form.password"
                      />

                      <div class="eye-container" @click="togglePassword">
                        <vue-feather
                          :type="showPassword ? 'eye-off' : 'eye'"
                          size="18"
                        />
                      </div>
                    </div>
                    <span class="validate-error">{{ errors.password }}</span>
                  </div>

                  <div class="form-group">
                    <label class="col-form-label">Konfirmasi Password</label>
                    <div class="d-flex password-group">
                      <Field
                        name="passwordConfirm"
                        :type="showPasswordConfirm ? 'text' : 'password'"
                        class="form-control password-input"
                        :class="{ 'is-invalid': errors.passwordConfirm }"
                        placeholder="*********"
                        v-model="form.passwordConfirm"
                      />

                      <div class="eye-container" @click="togglePasswordConfirm">
                        <vue-feather
                          :type="showPasswordConfirm ? 'eye-off' : 'eye'"
                          size="18"
                        />
                      </div>
                    </div>
                    <span class="validate-error">{{
                      errors.passwordConfirm
                    }}</span>
                  </div>

                  <div class="form-group mb-0">
                    <div class="text-end mt-3">
                      <button
                        class="btn btn-primary btn-block w-100"
                        type="submit"
                        :disabled="isLoading"
                      >
                        <span
                          v-if="isLoading"
                          class="spinner-border spinner-border-sm me-1"
                        ></span>
                        {{ isLoading ? "Memproses..." : "Buat Akun" }}
                      </button>
                    </div>
                  </div>
                  <p class="mt-4 mb-0 text-center">
                    Sudah punya akun?<router-link to="/auth" class="ms-2"
                      >Login</router-link
                    >
                  </p>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import axios from "@/utils/axiosEncrypt.js";
import { getApplication } from "@/services/general/website/settings/applications";

const router = useRouter();
const toast = useToast();

// === State Register ===
const isLoading = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const form = reactive({
  nama: "",
  telp: "",
  email: "",
  password: "",
  passwordConfirm: "",
});

// === State Logo ===
const dynamicLogoUrl = ref(null);
const appName = ref("Register Page");
const isLoadingLogo = ref(true);

// === State reCAPTCHA ===
const recaptchaKey = "6LfgoRYsAAAAAHUs_iIg2SVCDTovDKr_hpHsnxnr";
const recaptchaLoaded = ref(false);

// === Schema Validasi ===
const schema = yup.object({
  nama: yup.string().required("Nama wajib diisi"),
  telp: yup
    .string()
    .matches(/^[0-9]+$/, "Nomor HP hanya boleh berisi angka")
    .min(10, "Nomor HP minimal 10 digit")
    .max(15, "Nomor HP maksimal 15 digit")
    .required("Nomor HP wajib diisi"),
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: yup.string().required("Password wajib diisi"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
});

// === Methods Register ===
function togglePassword() {
  showPassword.value = !showPassword.value;
}

function togglePasswordConfirm() {
  showPasswordConfirm.value = !showPasswordConfirm.value;
}

function loadRecaptchaScript() {
  return new Promise((resolve) => {
    if (recaptchaLoaded.value) return resolve();

    const s = document.createElement("script");
    s.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaKey}`;
    s.async = true;
    s.defer = true;
    s.onload = () => {
      recaptchaLoaded.value = true;
      resolve();
    };
    document.head.appendChild(s);
  });
}

function getRecaptchaToken() {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) return reject("reCAPTCHA not loaded");
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(recaptchaKey, { action: "register" })
        .then((token) => resolve(token))
        .catch((err) => reject(err));
    });
  });
}

async function onSubmit() {
  isLoading.value = true;
  try {
    const token = await getRecaptchaToken();
    if (!token) {
      toast.error("Verifikasi reCAPTCHA gagal.");
      isLoading.value = false;
      return;
    }

    const fd = new FormData();
    fd.append("nama", form.nama);
    fd.append("telp", form.telp);
    fd.append("email", form.email);
    fd.append("password", form.password);
    fd.append("g-recaptcha-response", token);

    const response = await axios.post(`/register`, fd);
    toast.success(response.data.message || "Akun berhasil dibuat!");
    router.push("/auth");
  } catch (error) {
    console.error("Register Error:", error);
    if (error.response && error.response.data) {
      if (error.response.status === 422) {
        const errors = error.response.data.errors;
        if (errors) {
          const messages = Object.values(errors).flat().join(", ");
          toast.error(messages);
        } else if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Terjadi kesalahan validasi.");
        }
      } else {
        const message =
          error.response.data.message ||
          error.response.data.error ||
          "Gagal membuat akun.";
        toast.error(message);
      }
    } else {
      toast.error("Kesalahan sistem / koneksi server.");
    }
  } finally {
    isLoading.value = false;
  }
}

async function fetchLogoData() {
  isLoadingLogo.value = true;
  try {
    const response = await getApplication();
    let sourceData = null;

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        const innerArray = response.data[0].data;
        if (Array.isArray(innerArray) && innerArray.length > 0) {
          sourceData = innerArray[0];
        }
      }
    }

    // Mapping Data
    if (sourceData) {
      appName.value = sourceData.namainstansi || "Register Page";
      if (sourceData.logo && sourceData.logo !== "") {
        dynamicLogoUrl.value = sourceData.logo;
      } else {
        dynamicLogoUrl.value = null;
      }
    } else {
      dynamicLogoUrl.value = null;
    }
  } catch (error) {
    console.error("Error fetching logo for register:", error);
    dynamicLogoUrl.value = null;
  } finally {
    isLoadingLogo.value = false;
  }
}

function handleImageError() {
  dynamicLogoUrl.value = null;
}

// === Lifecycle ===
onMounted(async () => {
  await fetchLogoData();

  // Load reCAPTCHA script
  if (!recaptchaLoaded.value) {
    await loadRecaptchaScript();
  }

  window.addEventListener("app-settings-updated", fetchLogoData);
});

onUnmounted(() => {
  window.removeEventListener("app-settings-updated", fetchLogoData);

  // Hapus badge reCAPTCHA
  const badge = document.querySelector(".grecaptcha-badge");
  if (badge) badge.remove();
});
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 0.1rem rgba(220, 53, 69, 0.25);
}

.validate-error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 4px;
  display: block;
}

.password-group {
  display: flex;
  align-items: stretch;
  gap: 0;
}

.password-input {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.eye-container {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-left: none;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  width: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.eye-container:hover {
  background-color: #e9ecef;
  color: #0d6efd;
}

.eye-container svg {
  color: #6c757d;
  transition: color 0.2s ease;
}

.eye-container:hover svg {
  color: #0d6efd;
}

.grecaptcha-badge {
  display: none !important;
}
</style>
