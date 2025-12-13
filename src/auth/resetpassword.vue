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

                  <!-- LOADING -->
                  <div
                      v-else-if="isLoadingLogo"
                      class="d-flex align-items-center justify-content-center bg-light rounded shadow-sm mx-auto"
                      style="width: 110px; height: 110px; border: 1px solid #dee2e6;"
                  >
                    <div
                        class="spinner-border text-primary"
                        role="status"
                        style="width: 2.5rem; height: 2.5rem"
                    ></div>
                  </div>

                  <!-- FALLBACK LOGO -->
                  <div
                      v-else
                      class="d-flex align-items-center justify-content-center bg-light rounded shadow-sm mx-auto"
                      style="width: 110px; height: 110px; border: 1px solid #dee2e6;"
                  >
                    <span class="fw-bold text-secondary" style="font-size: 24px; letter-spacing: 2px;">
                      LOGO
                    </span>
                  </div>
                </a>
              </div>

              <!-- FORM RESET PASSWORD -->
              <div class="login-main">
                <Form class="theme-form" :validation-schema="schema" @submit="onSubmit" v-slot="{ errors }">

                  <h4>Reset Password</h4>
                  <p>Masukkan password baru Anda</p>

                  <!-- EMAIL READONLY -->
                  <div class="form-group">
                    <label class="col-form-label">Email</label>
                    <Field
                        name="email"
                        type="email"
                        class="form-control"
                        readonly
                        v-model="form.email"
                    />
                  </div>

                  <!-- PASSWORD BARU -->
                  <div class="form-group">
                    <label class="col-form-label">Password Baru</label>
                    <Field
                        name="password"
                        type="password"
                        class="form-control"
                        :class="{ 'is-invalid': errors.password }"
                        placeholder="Masukkan password baru"
                        v-model="form.password"
                    />
                    <span class="validate-error">{{ errors.password }}</span>
                  </div>

                  <!-- KONFIRMASI -->
                  <div class="form-group">
                    <label class="col-form-label">Konfirmasi Password</label>
                    <Field
                        name="password_confirmation"
                        type="password"
                        class="form-control"
                        :class="{ 'is-invalid': errors.password_confirmation }"
                        placeholder="Ulangi password baru"
                        v-model="form.password_confirmation"
                    />
                    <span class="validate-error">{{ errors.password_confirmation }}</span>
                  </div>

                  <!-- BUTTON -->
                  <div class="form-group mb-0">
                    <div class="text-end mt-3">
                      <button
                          class="btn btn-primary btn-block w-100"
                          type="submit"
                          :disabled="isLoading"
                      >
                        <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
                        {{ isLoading ? "Memproses..." : "Reset Password" }}
                      </button>
                    </div>
                  </div>

                  <p class="mt-4 mb-0 text-center">
                    Kembali ke?
                    <router-link to="/auth" class="ms-1">Login</router-link>
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
const appName = ref("Reset Password");
const isLoadingLogo = ref(true);

/* FORM */
const form = reactive({
  token: "",
  email: "",
  password: "",
  password_confirmation: ""
});

/* VALIDATION */
const schema = yup.object({
  password: yup.string().required("Password wajib diisi").min(6, "Minimal 6 karakter"),
  password_confirmation: yup
      .string()
      .oneOf([yup.ref("password")], "Password tidak sama")
      .required("Konfirmasi password wajib diisi")
});

/* SUBMIT RESET PASSWORD */
async function onSubmit() {
  isLoading.value = true;

  try {
    const fd = new FormData();
    fd.append("token", form.token);
    fd.append("email", form.email);
    fd.append("password", form.password);
    fd.append("password_confirmation", form.password_confirmation);

    const res = await axios.post(`/reset-password`, fd);

    toast.success(res.data.message || "Password berhasil direset!");

    setTimeout(() => {
      window.location.href = "/auth";
    }, 2000);

  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Terjadi kesalahan.");
  } finally {
    isLoading.value = false;
  }
}

/* LOGO FETCH */
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
      appName.value = sourceData.namainstansi || "Reset Password";
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

  // Ambil query: token & email
  const query = new URLSearchParams(window.location.hash.split("?")[1] || "");
  form.token = query.get("token") || "";
  form.email = query.get("email") || "";
});

/* UNMOUNT */
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
</style>
