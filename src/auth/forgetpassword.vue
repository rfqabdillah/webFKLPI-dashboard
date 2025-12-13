<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 p-0">
          <div class="login-card">
            <div>
              <!-- LOGO -->
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
                      style="font-size: 24px; letter-spacing: 2px"
                    >
                      LOGO
                    </span>
                  </div>
                </a>
              </div>

              <!-- FORM -->
              <div class="login-main">
                <Form
                  class="theme-form"
                  :validation-schema="schema"
                  @submit="onSubmit"
                  v-slot="{ errors }"
                >
                  <h4>Lupa Password</h4>
                  <p>
                    Masukkan email Anda untuk menerima tautan reset password
                  </p>

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
                        {{ isLoading ? "Mengirim..." : "Kirim Tautan Reset" }}
                      </button>
                    </div>
                  </div>

                  <p class="mt-4 mb-0 text-center">
                    Kembali ke?
                    <router-link to="/auth" class="ms-1"
                      >Masuk Sekarang</router-link
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
/* IMPORT */
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { useToast } from "vue-toastification";
import axios from "@/utils/axiosEncrypt.js";
import { getApplicationPub } from "@/services/general/website/settings/applicationsPublic";

const toast = useToast();

/* STATE */
const isLoading = ref(false);
const dynamicLogoUrl = ref(null);
const appName = ref("Forgot Password");
const isLoadingLogo = ref(true);

/* RECAPTCHA */
const recaptchaKey = "6LfgoRYsAAAAAHUs_iIg2SVCDTovDKr_hpHsnxnr";
const recaptchaLoaded = ref(false);

/* FORM DATA */
const form = reactive({
  email: "",
});

/* VALIDATION */
const schema = yup.object({
  email: yup
    .string()
    .email("Format email tidak valid")
    .required("Email wajib diisi"),
});

/* RECAPTCHA LOADER */
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
        .execute(recaptchaKey, { action: "forgot_password" })
        .then(resolve)
        .catch(reject);
    });
  });
}

/* SUBMIT */
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
    fd.append("email", form.email);
    fd.append("g-recaptcha-response", token);

    const res = await axios.post(`/forgot-password`, fd);

    toast.success(res.data.message || "Tautan reset password dikirim!");
  } catch (error) {
    console.error("Forgot Password Error:", error);

    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Terjadi kesalahan.");
    }
  } finally {
    isLoading.value = false;
  }
}

/* LOAD LOGO */
async function fetchLogoData() {
  isLoadingLogo.value = true;
  try {
    const response = await getApplicationPub();
    let sourceData = null;

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0]?.data?.length > 0) {
        sourceData = response.data[0].data[0];
      }
    }

    if (sourceData) {
      appName.value = sourceData.namainstansi || "Forgot Password";
      dynamicLogoUrl.value = sourceData.logo || null;
    }
  } catch {
    dynamicLogoUrl.value = null;
  } finally {
    isLoadingLogo.value = false;
  }
}

function handleImageError() {
  dynamicLogoUrl.value = null;
}

/* MOUNT */
onMounted(async () => {
  await fetchLogoData();
  await loadRecaptchaScript();

  window.addEventListener("app-settings-updated", fetchLogoData);
});

/* UNMOUNT */
onUnmounted(() => {
  window.removeEventListener("app-settings-updated", fetchLogoData);

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

.grecaptcha-badge {
  display: none !important;
}
</style>
