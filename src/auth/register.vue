<template>
  <div class="container-fluid p-0">
    <div class="row m-0">
      <div class="col-12 p-0">
        <div class="login-card">
          <div>
            <div>
              <a class="logo">
                <img
                    v-if="dynamicLogoUrl && !isLoadingLogo"
                    class="img-fluid for-light"
                    :src="dynamicLogoUrl"
                    :alt="appName"
                    style="width: 110px; height: 110px; object-fit: contain"
                    @error="handleImageError"
                />
              </a>
            </div>

            <div class="login-main">
              <form class="theme-form" @submit.prevent="submitRegister">
                <h4>Buat akun Anda</h4>
                <p>Masukkan detail pribadi Anda untuk membuat akun</p>

                <div class="form-group">
                  <label>Nama</label>
                  <input v-model="form.nama" class="form-control" required placeholder="Nama Lengkap" />
                </div>

                <div class="form-group">
                  <label>Nomor HP</label>
                  <input v-model="form.telp" class="form-control" required placeholder="Nomor HP" />
                </div>

                <div class="form-group">
                  <label>Email</label>
                  <input v-model="form.email" class="form-control" type="email" required placeholder="Email" />
                </div>

                <div class="form-group">
                  <label>Password</label>
                  <div class="form-input position-relative">
                    <input
                        v-model="form.password"
                        class="form-control"
                        :type="active ? 'password' : 'text'"
                        required
                    />
                    <div class="show-hide">
                      <span :class="active ? 'show' : 'hide'" @click.prevent="show"></span>
                    </div>
                  </div>
                </div>

                <div class="form-group mb-0">
                  <button class="btn btn-primary btn-block" :disabled="loading">
                    {{ loading ? "Memproses..." : "Buat Akun" }}
                  </button>
                </div>

                <p class="mt-4 mb-0">
                  Sudah punya akun?
                  <router-link class="ms-2" tag="a" to="/auth">Login</router-link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getApplication } from "@/services/general/website/settings/applications";
import axios from '@/utils/axiosEncrypt.js';
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      active: true,
      loading: false,
      toast: useToast(),
      form: { nama: "", telp: "", email: "", password: "" },

      recaptchaKey: "6LfgoRYsAAAAAHUs_iIg2SVCDTovDKr_hpHsnxnr",
      recaptchaLoaded: false,

      dynamicLogoUrl: null,
      appName: "Register Page",
      isLoadingLogo: true,
    };
  },

  methods: {
    show() {
      this.active = !this.active;
    },

    async fetchLogoData() {
      this.isLoadingLogo = true;
      try {
        const arr = (await getApplication())?.data?.[0]?.data || [];
        if (arr.length > 0) {
          const d = arr[0];
          this.appName = d.namainstansi || "Register Page";
          this.dynamicLogoUrl = d.logo || null;
        }
      } catch {
        this.dynamicLogoUrl = null;
      } finally {
        this.isLoadingLogo = false;
      }
    },

    handleImageError() {
      this.dynamicLogoUrl = null;
    },

    loadRecaptchaScript() {
      return new Promise((resolve) => {
        if (this.recaptchaLoaded) return resolve();

        // Hanya buat script untuk halaman ini
        const s = document.createElement("script");
        s.src = `https://www.google.com/recaptcha/api.js?render=${this.recaptchaKey}`;
        s.async = true;
        s.defer = true;
        s.onload = () => {
          this.recaptchaLoaded = true;
          resolve();
        };
        document.head.appendChild(s);
      });
    },

    async getRecaptchaToken() {
      return new Promise((resolve, reject) => {
        if (!window.grecaptcha) return reject("reCAPTCHA not loaded");
        window.grecaptcha.ready(() => {
          window.grecaptcha
              .execute(this.recaptchaKey, { action: "register" })
              .then((token) => resolve(token))
              .catch((err) => reject(err));
        });
      });
    },

    async submitRegister() {
      this.loading = true;
      try {
        const token = await this.getRecaptchaToken();
        if (!token) {
          this.toast.error("Verifikasi reCAPTCHA gagal.");
          this.loading = false;
          return;
        }

        const fd = new FormData();
        fd.append("nama", this.form.nama);
        fd.append("telp", this.form.telp);
        fd.append("email", this.form.email);
        fd.append("password", this.form.password);
        fd.append("g-recaptcha-response", token);

        const res = await axios.post(`/register`, fd);
        this.toast.success(res.data.message || "Akun berhasil dibuat!");
        this.$router.push("/auth");
      } catch (err) {
        console.error(err);
        if (err.response?.status === 422) {
          const errors = err.response.data.errors;
          if (errors) {
            const messages = Object.values(errors).flat().join(", ");
            this.toast.error(messages);
          } else if (err.response.data.message) {
            this.toast.error(err.response.data.message);
          } else {
            this.toast.error("Terjadi kesalahan validasi.");
          }
        } else {
          this.toast.error(err.response?.data?.message || "Gagal membuat akun.");
        }
      } finally {
        this.loading = false;
      }
    },
  },

  async mounted() {
    await this.fetchLogoData();

    // === KUNCI ===
    // Hanya load script reCAPTCHA di komponen ini
    if (!this.recaptchaLoaded) {
      await this.loadRecaptchaScript();
    }
  },

  beforeUnmount() {
    // Hapus badge saat komponen dilepas
    const badge = document.querySelector(".grecaptcha-badge");
    if (badge) badge.remove();
  },
};
</script>

<style scoped>
/* Opsional: sembunyikan badge */
.grecaptcha-badge {
  display: none !important;
}
</style>
