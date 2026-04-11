<template>
  <div class="container-fluid p-0">
    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-white py-3">
            <h3 class="card-title mb-0">Pengaturan Kontak & Aplikasi</h3>
          </div>
          <div class="card-body">
            <div v-if="isLoadingFetch" class="text-center py-5">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2 text-muted">Memuat data aplikasi...</p>
            </div>

            <form v-else @submit.prevent="submitForm">
              <h6 class="fw-bold mb-3 border-bottom pb-2">Identitas Visual</h6>
              <div class="row mb-4">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Logo Instansi</label>
                  <input
                    type="file"
                    class="form-control"
                    @change="handleLogoUpload"
                    accept="image/png, image/jpeg, image/jpg"
                    ref="logoInput"
                    :disabled="isImageProcessing"
                  />
                  <div class="form-text">
                    Otomatis kompres. Format: .jpg, .jpeg, .png.
                    <span v-if="isEditMode && fieldToEdit.logo" class="d-block">
                      *Kosongkan jika tidak ingin mengubah gambar.
                    </span>
                  </div>

                  <div class="mt-3" v-if="logoPreview || formData.logo">
                    <div class="position-relative d-inline-block">
                      <img
                        :src="logoPreview || formData.logo"
                        alt="Preview Logo"
                        class="img-thumbnail shadow-sm"
                        style="
                          height: 100px;
                          object-fit: contain;
                          background-color: #f8f9fa;
                        "
                      />
                      <button
                        type="button"
                        class="btn btn-danger position-absolute top-0 start-100 translate-middle rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                        style="
                          width: 28px;
                          height: 28px;
                          padding: 0;
                          border: 2px solid white;
                        "
                        @click="removeLogo"
                        title="Hapus Logo"
                        :disabled="isImageProcessing"
                      >
                        <i class="fa fa-times" style="font-size: 14px"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Favicon</label>
                  <input
                    type="file"
                    class="form-control"
                    @change="handleFaviconUpload"
                    accept="image/png, image/jpeg, image/jpg"
                    ref="faviconInput"
                    :disabled="isImageProcessing"
                  />
                  <div class="form-text">
                    Otomatis kompres. Format: .jpg, .jpeg, .png (Rasio 1:1).
                    <span
                      v-if="isEditMode && fieldToEdit.favicon"
                      class="d-block"
                    >
                      *Kosongkan jika tidak ingin mengubah gambar.
                    </span>
                  </div>

                  <div class="mt-3" v-if="faviconPreview || formData.favicon">
                    <div class="position-relative d-inline-block">
                      <img
                        :src="faviconPreview || formData.favicon"
                        alt="Preview Favicon"
                        class="img-thumbnail shadow-sm"
                        style="width: 60px; height: 60px; object-fit: cover"
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
                        @click="removeFavicon"
                        title="Hapus Favicon"
                        :disabled="isImageProcessing"
                      >
                        <i class="fa fa-times" style="font-size: 12px"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <h6 class="fw-bold mb-3 border-bottom pb-2">
                Informasi Instansi
              </h6>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Nama Instansi</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.nama_instansi"
                    :class="{
                      'is-invalid': formErrors.nama_instansi,
                      shake: isShaking && formErrors.nama_instansi,
                    }"
                    placeholder="Contoh: Dinas Kominfo"
                  />
                  <transition name="fade-error">
                    <div
                      class="invalid-feedback"
                      v-if="formErrors.nama_instansi"
                    >
                      {{ formErrors.nama_instansi }}
                    </div>
                  </transition>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Nama Aplikasi</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="formData.nama_aplikasi"
                    :class="{
                      'is-invalid': formErrors.nama_aplikasi,
                      shake: isShaking && formErrors.nama_aplikasi,
                    }"
                    placeholder="Contoh: SIPD"
                  />
                  <transition name="fade-error">
                    <div
                      class="invalid-feedback"
                      v-if="formErrors.nama_aplikasi"
                    >
                      {{ formErrors.nama_aplikasi }}
                    </div>
                  </transition>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Email Resmi</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="formData.email"
                    :class="{
                      'is-invalid': formErrors.email,
                      shake: isShaking && formErrors.email,
                    }"
                    placeholder="email@instansi.go.id"
                  />
                  <transition name="fade-error">
                    <div class="invalid-feedback" v-if="formErrors.email">
                      {{ formErrors.email }}
                    </div>
                  </transition>
                </div>

                <div class="col-12 mb-3">
                  <label class="form-label fw-semibold">Alamat Lengkap</label>
                  <textarea
                    class="form-control"
                    v-model="formData.alamat"
                    :class="{
                      'is-invalid': formErrors.alamat,
                      shake: isShaking && formErrors.alamat,
                    }"
                    rows="3"
                    placeholder="Masukkan alamat lengkap instansi"
                  ></textarea>
                  <transition name="fade-error">
                    <div class="invalid-feedback" v-if="formErrors.alamat">
                      {{ formErrors.alamat }}
                    </div>
                  </transition>
                </div>
              </div>

              <h6 class="fw-bold mb-3 mt-4 border-bottom pb-2">Kontak</h6>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Nomor Telepon</label>
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="fa-solid fa-phone"></i
                    ></span>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.telepon"
                      :class="{ 'is-invalid': formErrors.telepon }"
                      placeholder="021-xxxxxx"
                    />
                  </div>
                  <div class="invalid-feedback">{{ formErrors.telepon }}</div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">WhatsApp</label>
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="fa-brands fa-whatsapp"></i
                    ></span>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.whatsapp"
                      placeholder="628xxxxxxxx"
                    />
                  </div>
                </div>
              </div>

              <h6 class="fw-bold mb-3 mt-4 border-bottom pb-2">Media Sosial</h6>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Facebook</label>
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="fa-brands fa-facebook"></i
                    ></span>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.facebook"
                      placeholder="Link Facebook"
                    />
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Instagram</label>
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="fa-brands fa-instagram"></i
                    ></span>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.instagram"
                      placeholder="Link Instagram"
                    />
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Twitter (X)</label>
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="fa-brands fa-x-twitter"></i
                    ></span>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.twitter_x"
                      placeholder="Link Twitter"
                    />
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">Tiktok</label>
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="fa-brands fa-tiktok"></i
                    ></span>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.tiktok"
                      placeholder="Link Tiktok"
                    />
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label fw-semibold">YouTube</label>
                  <div class="input-group">
                    <span class="input-group-text"
                      ><i class="fa-brands fa-youtube"></i
                    ></span>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.youtube"
                      placeholder="Link YouTube"
                    />
                  </div>
                </div>
              </div>

              <h6 class="fw-bold mb-3 mt-4 border-bottom pb-2">
                Pesan Notifikasi
              </h6>
              <div class="row">
                <div class="col-12 mb-3">
                  <label class="form-label fw-semibold"
                    >Notifikasi Pendaftaran Akun</label
                  >
                  <textarea
                    class="form-control"
                    v-model="formData.notif_pendaftaran_akun"
                    rows="3"
                    placeholder="Pesan yang muncul saat pendaftaran akun berhasil..."
                  ></textarea>
                </div>

                <div class="col-12 mb-3">
                  <label class="form-label fw-semibold"
                    >Notifikasi Pendaftaran Peserta Pembinaan</label
                  >
                  <textarea
                    class="form-control"
                    v-model="formData.notif_mendaftar_peserta_pembinaan"
                    rows="3"
                    placeholder="Pesan yang muncul saat pendaftaran pembinaan berhasil..."
                  ></textarea>
                </div>
              </div>

              <div v-if="errorMessage" class="alert alert-danger mt-3">
                {{ errorMessage }}
              </div>

              <div
                class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top"
              >
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="resetForm"
                  :disabled="isSubmitting || isImageProcessing"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isSubmitting || isImageProcessing"
                >
                  <span
                    v-if="isSubmitting || isImageProcessing"
                    class="spinner-border spinner-border-sm me-1"
                  ></span>
                  <span v-if="isImageProcessing">Memproses Gambar...</span>
                  <span v-else>Simpan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import * as yup from "yup";
import Swal from "sweetalert2";
import {
  getAplikasi,
  updateAplikasi,
  addAplikasi,
} from "@/services/general/website/aplikasi";
import { compressImage } from "@/utils/imageCompressor";

const toast = useToast();

// === State ===
const isLoadingFetch = ref(true);
const isSubmitting = ref(false);
const isImageProcessing = ref(false);
const errorMessage = ref(null);
const isShaking = ref(false);

const formData = reactive({
  id_aplikasi: "",
  nama_aplikasi: "",
  nama_instansi: "",
  alamat: "",
  email: "",
  whatsapp: "",
  telepon: "",
  instagram: "",
  facebook: "",
  youtube: "",
  twitter_x: "",
  tiktok: "",
  notif_pendaftaran_akun: "",
  notif_mendaftar_peserta_pembinaan: "",
  logo: null,
  favicon: null,
});

const selectedLogoFile = ref(null);
const logoPreview = ref(null);
const logoInput = ref(null);

const selectedFaviconFile = ref(null);
const faviconPreview = ref(null);
const faviconInput = ref(null);

const formErrors = reactive({});

// === Validasi ===
const validationSchema = yup.object().shape({
  nama_instansi: yup.string(),
  email: yup.string().email("Format email tidak valid").nullable(),
});

// === Lifecycle ===
onMounted(() => {
  fetchSingletonData();
});

// === Methods ===
async function fetchSingletonData() {
  isLoadingFetch.value = true;
  try {
    const response = await getAplikasi();
    let sourceData = null;

    if (response.data && Array.isArray(response.data)) {
      if (response.data[0] && response.data[0].data) {
        const innerData = response.data[0].data;
        if (Array.isArray(innerData) && innerData.length > 0) {
          sourceData = innerData[0];
        }
      }
    }

    if (sourceData) {
      formData.id_aplikasi = sourceData.id_aplikasi;
      formData.nama_aplikasi = sourceData.nama_aplikasi || "";
      formData.nama_instansi = sourceData.nama_instansi || "";
      formData.alamat = sourceData.alamat || "";
      formData.email = sourceData.email || "";
      formData.whatsapp = sourceData.whatsapp || "";
      formData.telepon = sourceData.telepon || "";
      formData.facebook = sourceData.facebook || "";
      formData.instagram = sourceData.instagram || "";
      formData.twitter_x = sourceData.twitter_x || "";
      formData.tiktok = sourceData.tiktok || "";
      formData.youtube = sourceData.youtube || "";
      formData.notif_pendaftaran_akun = sourceData.notif_pendaftaran_akun || "";
      formData.notif_mendaftar_peserta_pembinaan =
        sourceData.notif_mendaftar_peserta_pembinaan || "";

      formData.logo = sourceData.logo || null;
      formData.favicon = sourceData.favicon || null;
    } else {
      formData.id_aplikasi = "";
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    toast.error("Gagal memuat data aplikasi");
  } finally {
    isLoadingFetch.value = false;
  }
}

async function handleLogoUpload(event) {
  const file = event.target.files[0];
  const input = event.target;

  const resetToOriginal = () => {
    selectedLogoFile.value = null;
    logoPreview.value = formData.logo || null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    return;
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Format logo harus JPG atau PNG");
    resetToOriginal();
    return;
  }

  try {
    isImageProcessing.value = true;
    toast.info("Sedang mengompres logo...", { timeout: 1500 });

    const compressedFile = await compressImage(file);

    selectedLogoFile.value = compressedFile;
    logoPreview.value = URL.createObjectURL(compressedFile);
  } catch (error) {
    toast.error("Gagal memproses logo: " + error.message);
    resetToOriginal();
  } finally {
    isImageProcessing.value = false;
  }
}

async function handleFaviconUpload(event) {
  const file = event.target.files[0];
  const input = event.target;

  const resetToOriginal = () => {
    selectedFaviconFile.value = null;
    faviconPreview.value = formData.favicon || null;
    if (input) input.value = null;
  };

  if (!file) {
    resetToOriginal();
    return;
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Format favicon harus JPG atau PNG");
    resetToOriginal();
    return;
  }

  try {
    isImageProcessing.value = true;
    toast.info("Sedang mengompres favicon...", { timeout: 1500 });

    const compressedFile = await compressImage(file);

    selectedFaviconFile.value = compressedFile;
    faviconPreview.value = URL.createObjectURL(compressedFile);
  } catch (error) {
    toast.error("Gagal memproses favicon: " + error.message);
    resetToOriginal();
  } finally {
    isImageProcessing.value = false;
  }
}

function removeLogo() {
  if (logoPreview.value && logoPreview.value.startsWith("blob:")) {
    URL.revokeObjectURL(logoPreview.value);
  }

  selectedLogoFile.value = null;
  logoPreview.value = null;
  formData.logo = null;

  if (logoInput.value) logoInput.value.value = null;
}

function removeFavicon() {
  if (faviconPreview.value && faviconPreview.value.startsWith("blob:")) {
    URL.revokeObjectURL(faviconPreview.value);
  }

  selectedFaviconFile.value = null;
  faviconPreview.value = null;
  formData.favicon = null;

  if (faviconInput.value) faviconInput.value.value = null;
}

function handleError(error) {
  errorMessage.value = error.response?.data?.message || "Gagal menyimpan data.";
  toast.error(errorMessage.value);
}

async function validateForm() {
  Object.keys(formErrors).forEach((key) => delete formErrors[key]);
  try {
    await validationSchema.validate(formData, { abortEarly: false });
    return true;
  } catch (err) {
    err.inner.forEach((e) => {
      formErrors[e.path] = e.message;
    });
    toast.warning("Periksa kembali isian form");
    return false;
  }
}

function resetForm() {
  Swal.fire({
    title: "Reset Input",
    text: "Kosongkan semua kolom isian?",
    icon: "warning",
    showCancelButton: true,
    cancelButtonColor: "#efefef",
    confirmButtonColor: "#d33",
    cancelButtonText: "Batal",
    confirmButtonText: "Kosongkan",
    reverseButtons: true,
    cancelButtonText: "Batal",
    confirmButtonText: "Kosongkan",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      formData.nama_instansi = "";
      formData.alamat = "";
      formData.email = "";
      formData.whatsapp = "";
      formData.telepon = "";
      formData.instagram = "";
      formData.facebook = "";
      formData.youtube = "";
      formData.twitter_x = "";
      formData.tiktok = "";
      formData.nama_aplikasi = "";
      formData.notif_pendaftaran_akun = "";
      formData.notif_mendaftar_peserta_pembinaan = "";
      formData.logo = null;
      formData.favicon = null;

      removeLogo();
      removeFavicon();

      Object.keys(formErrors).forEach((key) => delete formErrors[key]);

      toast.info("Isian form dikosongkan.");
    }
  });
}

async function submitForm() {
  const isValid = await validateForm();
  if (!isValid) {
    isShaking.value = true;
    setTimeout(() => (isShaking.value = false), 300);
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = null;

  const data = new FormData();
  data.append("record[nama_instansi]", formData.nama_instansi || "");
  data.append("record[nama_aplikasi]", formData.nama_aplikasi || "");
  data.append("record[alamat]", formData.alamat || "");
  data.append("record[email]", formData.email || "");
  data.append("record[whatsapp]", formData.whatsapp || "");
  data.append("record[telepon]", formData.telepon || "");
  data.append("record[instagram]", formData.instagram || "");
  data.append("record[facebook]", formData.facebook || "");
  data.append("record[youtube]", formData.youtube || "");
  data.append("record[twitter_x]", formData.twitter_x || "");
  data.append("record[tiktok]", formData.tiktok || "");
  data.append(
    "record[notif_pendaftaran_akun]",
    formData.notif_pendaftaran_akun || "",
  );
  data.append(
    "record[notif_mendaftar_peserta_pembinaan]",
    formData.notif_mendaftar_peserta_pembinaan || "",
  );

  if (selectedLogoFile.value) {
    data.append(
      "upload_logo",
      selectedLogoFile.value,
      selectedLogoFile.value.name,
    );
  } else if (!formData.logo) {
    data.append("record[logo]", "");
  }

  if (selectedFaviconFile.value) {
    data.append(
      "upload_favicon",
      selectedFaviconFile.value,
      selectedFaviconFile.value.name,
    );
  } else if (!formData.favicon) {
    data.append("record[favicon]", "");
  }

  try {
    if (formData.id_aplikasi) {
      data.append("_method", "PUT");
      await updateAplikasi(formData.id_aplikasi, data);
      toast.success("Pengaturan berhasil diperbarui");
    } else {
      await addAplikasi(data);
      toast.success("Pengaturan awal berhasil dibuat");
    }

    selectedLogoFile.value = null;
    selectedFaviconFile.value = null;

    await fetchSingletonData();
    window.dispatchEvent(new Event("app-settings-updated"));
  } catch (error) {
    handleError(error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.invalid-feedback {
  display: block;
  font-size: 0.875em;
}

.shake {
  animation: shake 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.fade-error-enter-active,
.fade-error-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-error-enter-from,
.fade-error-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
