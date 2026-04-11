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
                    style="max-height: 100px; width: auto; object-fit: contain"
                    @error="handleImageError"
                  />

                  <div
                    v-else-if="isLoadingLogo"
                    class="d-flex align-items-center justify-content-center bg-light rounded shadow-sm mx-auto"
                    style="
                      min-height: 110px;
                      max-height: 120px;
                      width: auto;
                      min-width: 110px;
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
                      min-height: 110px;
                      max-height: 120px;
                      width: auto;
                      min-width: 110px;
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
                  <h4>Masuk</h4>
                  <p>Masukkan Email dan Password untuk masuk</p>

                  <div class="form-group">
                    <label class="col-form-label">Email</label>
                    <Field
                      name="email"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors.email }"
                      placeholder="email@gmail.com"
                      v-model="user.email"
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
                        v-model="user.password"
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

                  <div class="form-group mb-0">
                    <div class="checkbox p-0">
                      <input
                        id="checkbox1"
                        type="checkbox"
                        v-model="rememberMe"
                      />
                      <label class="text-muted" for="checkbox1"
                        >Ingat password</label
                      >
                      <router-link class="link" to="/forgetpassword">
                        Lupa password?</router-link
                      >
                    </div>

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
                        Masuk
                      </button>
                    </div>
                  </div>
                  <p class="mt-4 mb-0 text-center">
                    Belum punya akun?<router-link to="/register" class="ms-2"
                      >Buat Akun</router-link
                    >
                  </p>
                </Form>
                <h6 class="text-muted mt-4 text-center">atau login dengan</h6>

                <div class="mt-3 text-center">
                  <button
                    type="button"
                    class="btn btn-outline-success w-100 d-flex align-items-center justify-content-center kemnaker-btn"
                    @click="loginKemnaker"
                  >
                    <img
                      src="/kemnaker-icon.png"
                      alt="Login Kemnaker"
                      class="kemnaker-icon"
                    />
                    Akun Kemnaker
                  </button>
                </div>
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
import { useStore } from "vuex";
import { useToast } from "vue-toastification";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { login as loginAPI } from "@/services/auth";
import { updatePengguna } from "@/services/referensi/pengguna";
import { getAplikasi } from "@/services/public/aplikasiPublic";
// import { userLevelPerusahaan } from "@/constants/userLevels";

const router = useRouter();
const store = useStore();
const toast = useToast();

// === State Login ===
const isLoading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);
const user = reactive({
  email: "",
  password: "",
});

// === State Logo ===
const dynamicLogoUrl = ref(null);
const appName = ref("Login Page");
const isLoadingLogo = ref(true);

// === Schema Validasi ===
const schema = yup.object({
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
  password: yup.string().required("Password wajib diisi"),
});

// === Methods ===
function togglePassword() {
  showPassword.value = !showPassword.value;
}

async function onSubmit() {
  isLoading.value = true;
  try {
    if (rememberMe.value) {
      const data = btoa(JSON.stringify(user));
      localStorage.setItem("remember_me_data", data);
    } else {
      localStorage.removeItem("remember_me_data");
    }

    const response = await loginAPI(user.email, user.password);
    const responseData = response.data;
    const token =
      responseData.token || (responseData.data && responseData.data.token);
    const userProfile =
      responseData.user || (responseData.data && responseData.data.user);

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify({ data: [userProfile] }));

      // Update Login Status
      try {
        const userId = userProfile?.id;
        if (userId) {
          const formData = new FormData();
          formData.append("record[status]", "Aktif");
          formData.append("_method", "PUT");
          await updatePengguna(userId, formData);
        }
      } catch (err) {
        console.error("Gagal update status login:", err);
      }

      toast.success(
        `Login berhasil! Selamat datang, ${userProfile?.nama || "Pengguna"}`,
      );

      // const userLevel =
      //   userProfile?.id_level ||
      //   userProfile?.roles?.id_level ||
      //   userProfile?.id_peran;
      // store.dispatch("menu/refreshMenuByUserLevel");
      // router.push(userLevel === userLevelPerusahaan ? "/my-profile" : "/");
      router.push("/");
    } else {
      toast.error(
        responseData.message || "Login gagal. Token tidak ditemukan.",
      );
    }
  } catch (error) {
    console.error("Login Error:", error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Kesalahan sistem / koneksi server.";
    toast.error(message);
  } finally {
    isLoading.value = false;
  }
}

// === Login Kemnaker ===
function loginKemnaker() {
  window.location.href =
    "https://pengukuranproduktivitas.kemnaker.go.id/be/login/sso2";
}

// === Logo ===
async function fetchLogoData() {
  isLoadingLogo.value = true;
  try {
    const response = await getAplikasi();
    let sourceData = null;
    if (response.data?.[0]?.data?.[0]) {
      sourceData = response.data[0].data[0];
    }

    if (sourceData) {
      appName.value = sourceData.namainstansi || "Login Page";
      dynamicLogoUrl.value = sourceData.logo || null;
    } else {
      dynamicLogoUrl.value = null;
    }
  } catch (error) {
    console.error("Error fetching logo:", error);
    dynamicLogoUrl.value = null;
  } finally {
    isLoadingLogo.value = false;
  }
}

function handleImageError() {
  dynamicLogoUrl.value = null;
}

// === Lifecycle ===
onMounted(() => {
  const savedData = localStorage.getItem("remember_me_data");
  if (savedData) {
    try {
      const parsed = JSON.parse(atob(savedData));
      if (parsed.email && parsed.password) {
        user.email = parsed.email;
        user.password = parsed.password;
        rememberMe.value = true;
      }
    } catch (e) {
      localStorage.removeItem("remember_me_data");
    }
  }

  fetchLogoData();
  window.addEventListener("app-settings-updated", fetchLogoData);
});

onUnmounted(() => {
  window.removeEventListener("app-settings-updated", fetchLogoData);
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
.btn-outline-success {
  border-color: #213f67;
}

.btn-outline-success:hover {
  background-color: #213f67;
  color: #fff;
}
.btn-outline-success:hover,
.btn-outline-success:focus,
.btn-outline-success:active,
.btn-outline-success.active {
  color: white;
  background-color: #213f67 !important;
  border-color: #213f67 !important;
}
.btn-outline-success {
  color: #213f67;
}
.kemnaker-icon {
  height: 26px;
  margin-right: 10px;
  transition: filter 0.2s ease;
}

/* Hover button */
.kemnaker-btn:hover .kemnaker-icon {
  filter: brightness(0) invert(1);
}

/* Biar background & teks juga putih */
.kemnaker-btn:hover {
  background-color: #198754;
  color: #fff;
}
</style>
